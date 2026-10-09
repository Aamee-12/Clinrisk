import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import * as Icons from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ClinRisk - Healthcare Designed Around You" },
      { name: "description", content: "Multi-specialty medical clinic" },
    ],
  }),
  component: () => (
    <AppShell>
      <LandingPage />
    </AppShell>
  ),
});

function LandingPage() {
  return (
    <div className="pb-32">
      {/* Hero Section - Full Screen Dark Animated */}
      <section className="relative min-h-screen flex items-center bg-animated-dark overflow-hidden pt-20 pb-16">
        <div className="mx-auto max-w-7xl px-4 md:px-8 w-full grid md:grid-cols-2 gap-12 items-center">
          <div className="z-10 animate-fade-up">
            {/* Logo representation */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex -space-x-2">
                <div className="size-6 rounded-t-full rounded-bl-full bg-[#52a792] rotate-45" />
                <div className="size-5 rounded-t-full rounded-br-full bg-[#408272] -rotate-12 mt-2" />
              </div>
              <h1 className="text-5xl font-bold tracking-tight text-white">
                Clin<span className="text-[#52a792]">Risk</span>
              </h1>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-display leading-[1.2] text-white mb-6 max-w-md">
              Clinical Decision Support<br/>
              for Better Outcomes
            </h2>
            
            <p className="text-lg text-slate-300 max-w-sm leading-relaxed font-medium mb-12">
              Evidence-based insights.<br/>
              Smarter decisions. Healthier lives.
            </p>

            <div className="flex items-center gap-6 md:gap-10">
              <Link to="/patients" className="flex flex-col items-center gap-3 group">
                <div className="size-14 rounded-full border border-white/20 flex items-center justify-center text-slate-300 group-hover:border-[#52a792] group-hover:text-[#52a792] transition-smooth bg-white/5 backdrop-blur-sm">
                  <Icons.Users className="size-6" />
                </div>
                <span className="text-xs font-medium text-slate-300">Patients</span>
              </Link>
              
              <Link to="/analysis" className="flex flex-col items-center gap-3 group">
                <div className="size-14 rounded-full border border-white/20 flex items-center justify-center text-slate-300 group-hover:border-[#52a792] group-hover:text-[#52a792] transition-smooth bg-white/5 backdrop-blur-sm">
                  <Icons.ClipboardList className="size-6" />
                </div>
                <span className="text-xs font-medium text-slate-300">Analysis</span>
              </Link>

              <Link to="/reports" className="flex flex-col items-center gap-3 group">
                <div className="size-14 rounded-full border border-white/20 flex items-center justify-center text-slate-300 group-hover:border-[#52a792] group-hover:text-[#52a792] transition-smooth bg-white/5 backdrop-blur-sm">
                  <Icons.FileText className="size-6" />
                </div>
                <span className="text-xs font-medium text-slate-300">Reports</span>
              </Link>

              <div className="flex flex-col items-center gap-3 group">
                <div className="size-14 rounded-full border border-white/20 flex items-center justify-center text-slate-300 group-hover:border-[#52a792] group-hover:text-[#52a792] transition-smooth bg-white/5 backdrop-blur-sm">
                  <Icons.ShieldPlus className="size-6" />
                </div>
                <span className="text-xs font-medium text-slate-300">Better Care</span>
              </div>
            </div>
          </div>

        {/* Right side floating UI elements and Doctor Image */}
        <div className="hidden md:flex flex-col items-end gap-6 pt-10 animate-fade-up relative h-[500px]" style={{ animationDelay: "100ms" }}>
            
            {/* Doctor Background Image */}
            <div className="absolute inset-0 z-0">
              <img 
                src="/assets/doctor-hero.jpg" 
                alt="Doctor" 
                className="w-full h-full object-cover object-top rounded-3xl opacity-90 shadow-xl border border-white/40"
              />
              {/* Soft gradient overlay to blend it slightly into the background */}
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#fcfbfa]/80 rounded-3xl pointer-events-none" />
            </div>

            <div className="absolute -right-8 top-16 flex flex-col gap-5 z-10">
              <div className="bg-white/70 backdrop-blur-md border border-white shadow-xl rounded-2xl p-4 flex items-center gap-4 w-64 hover:scale-105 transition-transform cursor-default">
                <div className="size-10 rounded-lg border border-slate-200 grid place-items-center text-[#3a9682] bg-white">
                  <Icons.Activity className="size-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800">Risk Analysis</div>
                  <div className="h-1.5 w-16 bg-slate-200 rounded-full mt-1.5"></div>
                  <div className="h-1.5 w-10 bg-slate-200 rounded-full mt-1"></div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-md border border-white shadow-xl rounded-2xl p-4 flex items-center gap-4 w-64 hover:scale-105 transition-transform cursor-default translate-x-6">
                <div className="size-10 rounded-lg border border-slate-200 grid place-items-center text-[#3a9682] bg-white">
                  <Icons.ShieldPlus className="size-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800">Clinical Guidance</div>
                  <div className="h-1.5 w-16 bg-slate-200 rounded-full mt-1.5"></div>
                  <div className="h-1.5 w-10 bg-slate-200 rounded-full mt-1"></div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-md border border-white shadow-xl rounded-2xl p-4 flex items-center gap-4 w-64 hover:scale-105 transition-transform cursor-default">
                <div className="size-10 rounded-lg border border-slate-200 grid place-items-center text-[#3a9682] bg-white">
                  <Icons.BarChart3 className="size-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800">Better Outcomes</div>
                  <div className="h-1.5 w-16 bg-slate-200 rounded-full mt-1.5"></div>
                  <div className="h-1.5 w-10 bg-slate-200 rounded-full mt-1"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rest of the Page Content */}
      <div className="mx-auto max-w-7xl px-4 md:px-8">
      {/* Better Health Features */}
      <section className="py-24 animate-fade-up" style={{ animationDelay: "200ms" }}>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-10">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold tracking-[0.2em] text-[#3b82f6] uppercase mb-5">
              SMARTER INSIGHTS. HEALTHIER TOMORROWS.
            </p>
            <h2 className="text-5xl md:text-6xl font-display text-foreground leading-[1.1] mb-6 tracking-tight">
              Everything you need for<br/>
              <span className="text-[#3b82f6]">Better health</span>—in one place.
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed font-medium max-w-xl">
              Healthcare shouldn't require visiting multiple clinics, repeating your medical history, or waiting weeks for answers. ClinRisk connects specialists, diagnostics, and follow-up care into one coordinated experience.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-10">
            {/* Pulse text */}
            <div className="hidden lg:flex items-center gap-4 opacity-60">
              <Icons.Activity className="text-[#3b82f6] size-10 stroke-1" />
              <div className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase leading-relaxed">
                Better Data.<br/>Better Decisions.<br/>Better Care.
              </div>
            </div>
            
            {/* Arrows */}
            <div className="flex items-center gap-4">
              <button className="size-14 rounded-full border border-border flex items-center justify-center hover:bg-black/5 transition-smooth bg-white text-foreground shadow-sm hover:scale-105">
                <Icons.ChevronLeft className="size-5" />
              </button>
              <button className="size-14 rounded-full border border-border flex items-center justify-center hover:bg-black/5 transition-smooth bg-white text-foreground shadow-sm hover:scale-105">
                <Icons.ChevronRight className="size-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard 
            title="Comprehensive Care" 
            desc="From preventive medicine to advanced specialist consultations." 
            icon={<Icons.Stethoscope className="size-5" />}
            image="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop"
            colorFrom="rgba(59, 130, 246, 0.7)"
            colorTo="rgba(37, 99, 235, 1)"
          />
          <FeatureCard 
            title="Collaborative Doctors" 
            desc="Specialists work together to build complete treatment plans." 
            icon={<Icons.Users className="size-5" />}
            image="https://images.unsplash.com/photo-1638202993928-7267aad84c31?q=80&w=800&auto=format&fit=crop"
            colorFrom="rgba(16, 185, 129, 0.7)"
            colorTo="rgba(5, 150, 105, 1)"
          />
          <FeatureCard 
            title="Modern Diagnostics" 
            desc="Fast laboratory testing and digital imaging with quick reporting." 
            icon={<Icons.FlaskConical className="size-5" />}
            image="https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800&auto=format&fit=crop"
            colorFrom="rgba(139, 92, 246, 0.7)"
            colorTo="rgba(109, 40, 217, 1)"
          />
          <FeatureCard 
            title="Convenient Scheduling" 
            desc="Book online, choose your physician, and manage appointments easily." 
            icon={<Icons.Calendar className="size-5" />}
            image="https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=800&auto=format&fit=crop"
            colorFrom="rgba(245, 158, 11, 0.7)"
            colorTo="rgba(217, 119, 6, 1)"
          />
        </div>
      </section>

      {/* Specialties */}
      <section className="py-20 animate-fade-up" style={{ animationDelay: "300ms" }}>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-display text-foreground leading-[1.1] mb-4">
              Expert care across<br/>
              Every major specialty
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
              Access experienced physicians across a wide range of disciplines without the hassle of coordinating between multiple providers.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/patients" className="pill-button pill-button-dark text-sm inline-flex items-center gap-2">
              <Icons.Calendar className="size-4" />
              BOOK AN APPOINTMENT
            </Link>
            <button className="pill-button pill-button-light text-sm inline-flex items-center gap-2">
              <Icons.Search className="size-4" />
              FIND A DOCTOR
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          <SpecialtyCard icon={<Icons.Stethoscope className="text-blue-500" />} name="Internal Medicine" />
          <SpecialtyCard icon={<Icons.Users className="text-emerald-500" />} name="Family Medicine" />
          <SpecialtyCard icon={<Icons.Activity className="text-red-500" />} name="Cardiology" />
          <SpecialtyCard icon={<Icons.Bone className="text-slate-500" />} name="Orthopedics" />
        </div>
      </section>
      </div>
    </div>
  );
}

function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-right">
      <div className="text-4xl md:text-5xl font-display text-foreground opacity-90">{value}</div>
      <div className="text-xs text-muted-foreground mt-1 max-w-[140px] ml-auto font-medium">{label}</div>
    </div>
  );
}

function FeatureCard({ 
  title, 
  desc, 
  icon, 
  image, 
  colorFrom, 
  colorTo 
}: { 
  title: string; 
  desc: string; 
  icon: React.ReactNode;
  image: string;
  colorFrom: string;
  colorTo: string;
}) {
  return (
    <div className="relative h-[480px] rounded-[32px] overflow-hidden flex flex-col group hover-lift shadow-sm cursor-pointer">
      {/* Background Image */}
      <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      
      {/* Gradient Wavy Overlay */}
      {/* We use a complex gradient to mimic the soft wavy overlay at the bottom */}
      <div 
        className="absolute inset-0 z-10"
        style={{
          background: `linear-gradient(to bottom, transparent 30%, ${colorFrom} 60%, ${colorTo} 100%)`
        }}
      />
      
      {/* Top Left Icon */}
      <div className="absolute top-6 left-6 z-20 size-12 rounded-full border border-white/30 backdrop-blur-md flex items-center justify-center text-white bg-white/10">
        {icon}
      </div>

      {/* Content */}
      <div className="relative z-20 mt-auto p-8 pt-0 text-white flex flex-col">
        <h3 className="font-display text-2xl mb-3 font-semibold tracking-tight">{title}</h3>
        <p className="text-sm text-white/90 leading-relaxed font-medium mb-8 opacity-90">{desc}</p>
        
        {/* Arrow Button */}
        <div className="size-10 rounded-full border border-white/40 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-colors">
          <Icons.ArrowRight className="size-4" />
        </div>
      </div>
    </div>
  );
}

function SpecialtyCard({ icon, name }: { icon: React.ReactNode; name: string }) {
  return (
    <div className="bg-white rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-smooth cursor-pointer border border-border shadow-sm">
      <div className="size-12 rounded-xl bg-black/5 grid place-items-center">
        {icon}
      </div>
      <span className="font-semibold text-sm text-foreground">{name}</span>
    </div>
  );
}
