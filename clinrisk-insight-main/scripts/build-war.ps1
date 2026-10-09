# Build WAR file without Maven (uses javac)
param(
    [string]$DB_PASS = "12345"
)

$jar = "C:\Users\DELL\Downloads\mysql-connector-j-9.7.0\mysql-connector-j-9.7.0\mysql-connector-j-9.7.0.jar"
$gs = "C:\Users\DELL\Downloads\gson-2.10.1.jar"
$je = "C:\Program Files\Java\jdk-21\lib\modules"
$jsi = "C:\Program Files\Java\jdk-21\lib\jdk.httpserver.jar"

# Check if JAR files exist
if (-not (Test-Path $jar)) {
    Write-Host "ERROR: MySQL connector not found at $jar" -ForegroundColor Red
    exit 1
}

# Create directories
$srcDir = "backend-java\src\main\java"
$webDir = "backend-java\src\main\webapp"
$outDir = "backend-java\target\classes"
$warDir = "backend-java\target\HospitalManagement"
$distDir = "backend-java\target"

New-Item -ItemType Directory -Path $outDir -Force | Out-Null
New-Item -ItemType Directory -Path $webDir -Force | Out-Null

Write-Host "Building HospitalManagement.war..." -ForegroundColor Cyan

# Compile Java sources
Write-Host "`n[1/4] Compiling Java classes..." -ForegroundColor Yellow
$sources = @(
    "$srcDir\com\clinic\model\Patient.java",
    "$srcDir\com\clinic\dao\DBConnection.java",
    "$srcDir\com\clinic\dao\PatientDAO.java",
    "$srcDir\com\clinic\servlet\GetPatientsServlet.java",
    "$srcDir\com\clinic\servlet\AddPatientServlet.java",
    "$srcDir\com\clinic\servlet\UpdatePatientServlet.java",
    "$srcDir\com\clinic\servlet\DeletePatientServlet.java",
    "$srcDir\com\clinic\servlet\LoginServlet.java",
    "$srcDir\com\clinic\filter\CORSFilter.java"
)

# Check for Gson JAR
$gsonPath = $null
if (Test-Path $gs) {
    $gsonPath = $gs
} else {
    # Try to find it in downloads
    $gsonFound = Get-ChildItem -Path "C:\Users\DELL\Downloads" -Recurse -Filter "gson*.jar" -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($gsonFound) {
        $gsonPath = $gsonFound.FullName
        Write-Host "Found Gson at: $gsonPath" -ForegroundColor Green
    }
}

if (-not $gsonPath) {
    Write-Host "WARNING: Gson JAR not found. Trying with MySQL connector only..." -ForegroundColor Yellow
    $cp = $jar
} else {
    $cp = "$jar;$gsonPath"
}

# Look for Jakarta Servlet API JAR
$jakartaPath = Get-ChildItem -Path "C:\Users\DELL\Downloads" -Recurse -Filter "*jakarta.servlet*.jar" -ErrorAction SilentlyContinue | Select-Object -First 1
if ($jakartaPath) {
    $cp = "$cp;$($jakartaPath.FullName)"
    Write-Host "Found Jakarta Servlet at: $($jakartaPath.FullName)" -ForegroundColor Green
}

Write-Host "Classpath: $cp" -ForegroundColor Gray

javac -d $outDir -cp $cp @sources 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Compilation failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Compilation successful" -ForegroundColor Green

# Create web.xml if it doesn't exist
Write-Host "`n[2/4] Creating web.xml..." -ForegroundColor Yellow
$webXml = @"
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="https://jakarta.ee/xml/ns/jakartaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="https://jakarta.ee/xml/ns/jakartaee
                             https://jakarta.ee/xml/ns/jakartaee/web-app_6_0.xsd"
         version="6.0">
    <display-name>HospitalManagement</display-name>
    <description>Hospital Patient Management System</description>
</web-app>
"@

$webXml | Out-File -FilePath "$webDir\web.xml" -Encoding UTF8

# Create WAR structure
Write-Host "[3/4] Creating WAR structure..." -ForegroundColor Yellow
Remove-Item -Path $warDir -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path "$warDir\WEB-INF\classes" -Force | Out-Null
New-Item -ItemType Directory -Path "$warDir\WEB-INF\lib" -Force | Out-Null

# Copy compiled classes
Copy-Item -Path "$outDir\*" -Destination "$warDir\WEB-INF\classes\" -Recurse

# Copy web.xml
Copy-Item -Path "$webDir\web.xml" -Destination "$warDir\WEB-INF\"

# Copy required JARs to WEB-INF/lib
Write-Host "[4/4] Packaging libraries..." -ForegroundColor Yellow

if (Test-Path $jar) {
    Copy-Item -Path $jar -Destination "$warDir\WEB-INF\lib\"
    Write-Host "✓ Added MySQL Connector" -ForegroundColor Green
}

if ($gsonPath -and (Test-Path $gsonPath)) {
    Copy-Item -Path $gsonPath -Destination "$warDir\WEB-INF\lib\"
    Write-Host "✓ Added Gson" -ForegroundColor Green
}

if ($jakartaPath -and (Test-Path $jakartaPath.FullName)) {
    Copy-Item -Path $jakartaPath.FullName -Destination "$warDir\WEB-INF\lib\"
    Write-Host "✓ Added Jakarta Servlet" -ForegroundColor Green
}

# Create WAR file
Write-Host "`nCreating WAR archive..." -ForegroundColor Cyan
$currentDir = Get-Location
Set-Location $warDir
$warFile = "$distDir\HospitalManagement-1.0.0.war"
Remove-Item $warFile -Force -ErrorAction SilentlyContinue

# Use PowerShell to create ZIP (WAR is just a ZIP)
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory((Get-Location).Path, $warFile)

Set-Location $currentDir

if (Test-Path $warFile) {
    $size = (Get-Item $warFile).Length / 1MB
    Write-Host "`n✓ WAR file created successfully!" -ForegroundColor Green
    Write-Host "  Path: $warFile" -ForegroundColor Green
    Write-Host "  Size: $([math]::Round($size, 2)) MB" -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Cyan
    Write-Host "  1. Copy WAR to Tomcat: copy '$warFile' 'C:\Program Files\Apache Software Foundation\Tomcat 10.1\webapps\'" -ForegroundColor Yellow
    Write-Host "  2. Restart Tomcat" -ForegroundColor Yellow
    Write-Host "  3. Test: http://localhost:8080/HospitalManagement/GetPatientsServlet" -ForegroundColor Yellow
} else {
    Write-Host "✗ Failed to create WAR file" -ForegroundColor Red
    exit 1
}
