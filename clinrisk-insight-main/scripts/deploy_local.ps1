<#
PowerShell deployment helper

Usage: run in PowerShell (may require Administrator for installs or service operations):
 .\scripts\deploy_local.ps1

What it does:
 - Optionally installs Maven (via winget or choco) if missing (interactive)
 - Imports MySQL schema from backend-java/db/schema.sql
 - Runs `mvn -f backend-java/pom.xml clean package` to build WAR
 - Copies WAR to Tomcat `webapps` and restarts Tomcat via startup/shutdown scripts
 - Runs a small smoke test against GetPatientsServlet

Notes:
 - Ensure `mysql` CLI is available in PATH (MySQL Workbench/Connector may not provide CLI)
 - Ensure Tomcat is installed locally; provide `TOMCAT_HOME` when prompted if not set
#>

function Prompt-YesNo($message, $default=$true) {
    $yn = Read-Host "$message ([Y]/N)"
    if ([string]::IsNullOrWhiteSpace($yn)) { return $default }
    return $yn.Trim().ToUpper().StartsWith('Y')
}

Write-Host "=== ClinRisk Backend Local Deploy Script ===" -ForegroundColor Cyan

# 1) Ensure Maven
if (-not (Get-Command mvn -ErrorAction SilentlyContinue)) {
    Write-Host "Maven (mvn) not found on PATH." -ForegroundColor Yellow
    if (Get-Command winget -ErrorAction SilentlyContinue) {
        if (Prompt-YesNo "Install Maven via winget?" ) {
            winget install -e --id Apache.Maven
        }
    } elseif (Get-Command choco -ErrorAction SilentlyContinue) {
        if (Prompt-YesNo "Install Maven via Chocolatey? (requires admin)" ) {
            choco install maven -y
        }
    } else {
        Write-Host "Please install Maven manually and ensure 'mvn' is on PATH. Aborting." -ForegroundColor Red
        exit 1
    }
}

Write-Host "Maven check passed." -ForegroundColor Green

# 2) MySQL import
$mysqlExe = Get-Command mysql -ErrorAction SilentlyContinue
if (-not $mysqlExe) {
    Write-Host "`nMySQL CLI 'mysql' not found on PATH. If you have MySQL Workbench installed, ensure the CLI is available or add MySQL's bin folder to PATH." -ForegroundColor Yellow
    if (-not (Prompt-YesNo "Continue without importing schema now?" $false)) { exit 1 }
} else {
    $dbUser = Read-Host "Enter MySQL user to import schema (default: root)"
    if ([string]::IsNullOrWhiteSpace($dbUser)) { $dbUser = 'root' }
    $dbPass = Read-Host "Enter MySQL password for user $dbUser" -AsSecureString
    $plainPass = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPass))
    Write-Host "Importing schema backend-java/db/schema.sql..."
    & mysql -u $dbUser -p$plainPass < "$(Resolve-Path backend-java\db\schema.sql)"
    if ($LASTEXITCODE -ne 0) { Write-Host "Schema import may have failed (mysql exit code $LASTEXITCODE)" -ForegroundColor Yellow }
    else { Write-Host "Schema imported." -ForegroundColor Green }
}

# 3) Build WAR
Write-Host "Building backend WAR with Maven..."
Push-Location backend-java
$mvnExit = & mvn clean package
Pop-Location
if ($LASTEXITCODE -ne 0) {
    Write-Host "Maven build failed. Please inspect output above." -ForegroundColor Red
    exit 1
}
Write-Host "Maven build completed." -ForegroundColor Green

# 4) Locate WAR file
$warPath = Resolve-Path "backend-java\target\HospitalManagement-1.0.0.war" -ErrorAction SilentlyContinue
if (-not $warPath) {
    Write-Host "WAR file not found at backend-java/target. Aborting." -ForegroundColor Red
    exit 1
}

# 5) Tomcat deploy
$tomcatHome = $env:TOMCAT_HOME
if ([string]::IsNullOrWhiteSpace($tomcatHome) -or -not (Test-Path $tomcatHome)) {
    $tomcatHome = Read-Host "Enter TOMCAT_HOME path (e.g. C:\\Program Files\\Apache Software Foundation\\Tomcat 10.1)"
}
if (-not (Test-Path $tomcatHome)) { Write-Host "TOMCAT_HOME not found. Aborting." -ForegroundColor Red; exit 1 }

$shutdown = Join-Path $tomcatHome 'bin\shutdown.bat'
$startup  = Join-Path $tomcatHome 'bin\startup.bat'

if (Test-Path $shutdown) {
    Write-Host "Stopping Tomcat..."
    & $shutdown | Out-Null
    Start-Sleep -Seconds 2
}

Write-Host "Copying WAR to Tomcat webapps..."
Copy-Item -Path $warPath -Destination (Join-Path $tomcatHome 'webapps') -Force

Write-Host "Starting Tomcat..."
if (Test-Path $startup) { & $startup | Out-Null } else { Write-Host "Tomcat startup script not found; please start Tomcat manually." -ForegroundColor Yellow }

Start-Sleep -Seconds 5

# 6) Smoke test
$endpoint = "http://localhost:8080/HospitalManagement/GetPatientsServlet"
Write-Host "Running smoke test: GET $endpoint"
try {
    $resp = Invoke-WebRequest -Uri $endpoint -UseBasicParsing -TimeoutSec 10
    if ($resp.StatusCode -ge 200 -and $resp.StatusCode -lt 300) {
        Write-Host "Smoke test passed (status $($resp.StatusCode))." -ForegroundColor Green
        Write-Host "Response snippet: `n$($resp.Content.Substring(0,[Math]::Min(400,$resp.Content.Length)))`n..."
    } else {
        Write-Host "Smoke test returned status $($resp.StatusCode). Check Tomcat logs." -ForegroundColor Yellow
    }
} catch {
    Write-Host "Smoke test failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "Deployment script finished. If you see any errors above, inspect Tomcat logs: $tomcatHome\logs\catalina.*.log" -ForegroundColor Cyan
