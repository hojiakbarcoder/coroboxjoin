"use client";

import { api } from '@/convex/_generated/api'
import { useAction } from "convex/react"
import { useMemo, useState } from "react"
// 1. Next.js optimizatsiyalangan Image komponentini import qilamiz
import Image from "next/image"

export default function CoroboxLanding() {
  const [volume, setVolume] = useState(500000);
  const [defectRate, setDefectRate] = useState(1.5);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // const sendTelegramAlert = useAction(api.telegram.sendAlert);
  const joinWaitlist = useAction(api.waitlist.join);

  const stats = useMemo(() => {
    const totalDefects = Math.round(volume * (defectRate / 100));
    const annualSavings = Math.round(totalDefects * 0.15 * 12);
    return { totalDefects, annualSavings };
  }, [volume, defectRate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || !company) return;

    setLoading(true);
    setStatus(null);

    try {
      // Telegram funksiyasi o'rniga bazaga qo'shuvchi join funksiyasini chaqiramiz
      await joinWaitlist({
          companyName: company,
          contactName: name,
          phone: email, 
          lineType: "Automated Inspection Line",
          monthlyVolume: volume,
          estimatedMonthlyCost: Math.round(stats.annualSavings / 12),
          submittedLang: "en"
      });

      setStatus({ type: "success", msg: "Message sent successfully. We will get in touch soon!" });
        // ... set state qismlari
    } catch (err) {
        setStatus({ type: "error", msg: "Something went wrong. Please try again." });
    }
    setLoading(false);
};

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#09090b] selection:bg-zinc-200">
      
      {/* HEADER */}
      <header className="max-w-7xl mx-auto px-8 h-24 flex items-center justify-between">
        <div className="flex items-center">
          {/* O'lchamlari aniq berilgan Next.js Image */}
          <Image 
            src="/corobox-logo.png" 
            alt="Corobox Logo Icon" 
            width={50}
            height={50}
            style={{ height: "auto" }}
            className="object-contain mix-blend-darken contrast-125 brightness-105"
          />
          <span className="font-semibold text-2xl tracking-tight text-black leading-none">COROBOX</span>
        </div>
        
        <a 
          href="#get-in-touch" 
          className="bg-[#18181b] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-black transition-colors"
        >
          Get in touch
        </a>
      </header>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-8 pt-20 pb-28 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-7 space-y-6">
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-black leading-[1.05]">
            Automated vision inspection <br />for production lines.
          </h1>
          <p className="text-xl text-zinc-500 font-normal max-w-2xl leading-relaxed">
            An intelligent on-premise computer vision system designed for real-time packaging quality control and factory line automation.
          </p>
          <div className="pt-4">
            <a 
              href="#get-in-touch" 
              className="inline-block bg-[#18181b] text-white px-6 py-3.5 rounded-full text-base font-medium hover:bg-black transition-colors"
            >
              Secure Partnership
            </a>
          </div>
        </div>
        
        {/* HERO RIGHT */}
        <div className="md:col-span-5 hidden md:block">
          <div className="relative w-full aspect-square bg-white rounded-3xl border border-zinc-200/60 shadow-xs overflow-hidden group">
            
            {/* 
              Konteyner nisbatiga moslashuvchi 'fill' xususiyati.
              'priority' sahifa yuklanganda birinchi bo'lib yuklanishini ta'minlaydi (LCP yaxshilanadi).
            */}
            <Image 
              src="/corobox-hardware.png" 
              alt="Corobox Industrial Edge-AI Vision System" 
              fill
              priority
              sizes="(max-width: 768px) 100vw, 420px"
              className="object-cover transform group-hover:scale-[1.02] transition-transform duration-700 ease-out"
            />
            
          </div>
        </div>
      </section>

      {/* ENTERPRISE ARCHITECTURE */}
      <section className="max-w-7xl mx-auto px-8 py-20 border-t border-zinc-200/60">
        <div className="max-w-3xl mb-12">
          <h2 className="text-3xl font-semibold tracking-tight text-black">Enterprise Architecture.</h2>
          <p className="text-zinc-500 mt-2 text-sm">Engineered for seamless conveyor integration and scalable automation with zero upfront friction.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-2xl border border-zinc-200/50 shadow-xs">
            <h3 className="text-lg font-medium text-black mb-2">Retrofit Edge-AI Inspection</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Our advanced computer vision models mount directly onto your existing production and conveyor lines. The system executes high-speed optical inference locally to detect packaging defects and anomalies instantly without halting factory workflows.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl border border-zinc-200/50 shadow-xs">
            <h3 className="text-lg font-medium text-black mb-2">Robotics-as-a-Service (RaaS)</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Eliminate prohibitive upfront capital expenditures. Through our flexible leasing model, factories can deploy intelligent hardware and automation assets seamlessly, shifting heavy scaling costs into predictable operational expenses.
            </p>
          </div>
        </div>
      </section>

      {/* INDUSTRIAL ROI CALCULATOR */}
      <section id="roi-calculator" className="max-w-7xl mx-auto px-8 py-20 border-t border-zinc-200/60">
        <div className="max-w-3xl mb-12">
          <h2 className="text-3xl font-semibold tracking-tight text-black">Financial Impact Forecast.</h2>
          <p className="text-zinc-500 mt-2 text-sm">Simulate immediate waste reduction and cost containment metrics upon hardware activation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white p-8 md:p-12 rounded-3xl border border-zinc-200/60 shadow-xs">
          <div className="md:col-span-7 space-y-8">
            <div>
              <div className="flex justify-between text-xs font-semibold tracking-wide text-zinc-400 mb-3">
                <span>MONTHLY PRODUCTION VOLUME</span>
                <span className="text-black font-mono">{volume.toLocaleString()} UNITS</span>
              </div>
              <input 
                type="range" min="50000" max="5000000" step="50000" value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full accent-black bg-zinc-100 h-2 rounded-full appearance-none cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold tracking-wide text-zinc-400 mb-3">
                <span>OBSERVED MANUAL DEFECT RATE</span>
                <span className="text-black font-mono">{defectRate}%</span>
              </div>
              <input 
                type="range" min="0.1" max="5.0" step="0.1" value={defectRate}
                onChange={(e) => setDefectRate(Number(e.target.value))}
                className="w-full accent-black bg-zinc-100 h-2 rounded-full appearance-none cursor-pointer"
              />
            </div>
          </div>

          <div className="md:col-span-5 grid grid-cols-1 gap-4 md:pl-8 border-t md:border-t-0 md:border-l border-zinc-200/80 pt-6 md:pt-0">
            <div className="bg-[#f8f9fa] p-5 rounded-xl border border-zinc-200/40">
              <span className="text-[11px] font-semibold tracking-wider text-zinc-400 block mb-1">DEFECTS DETECTED / MO</span>
              <span className="text-3xl font-bold tracking-tight text-black font-mono">{stats.totalDefects.toLocaleString()}</span>
            </div>
            <div className="bg-[#f8f9fa] p-5 rounded-xl border border-zinc-200/40">
              <span className="text-[11px] font-semibold tracking-wider text-zinc-400 block mb-1">EST. ANNUAL MIGRATION SAVINGS</span>
              <span className="text-3xl font-bold tracking-tight text-emerald-600 font-mono">${stats.annualSavings.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </section>

      {/* GET IN TOUCH FORM */}
      <section id="get-in-touch" className="max-w-4xl mx-auto px-8 py-24 text-center">
        <h2 className="text-5xl font-semibold tracking-tight text-black mb-12">Get in touch.</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6 text-left max-w-2xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-semibold tracking-widest text-zinc-400 block uppercase">Name</label>
              <input
                type="text" required value={name} onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-zinc-200 focus:border-zinc-400 px-4 py-3.5 rounded-xl focus:outline-none transition-colors text-sm shadow-2xs"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-semibold tracking-widest text-zinc-400 block uppercase">Email</label>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-zinc-200 focus:border-zinc-400 px-4 py-3.5 rounded-xl focus:outline-none transition-colors text-sm shadow-2xs"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold tracking-widest text-zinc-400 block uppercase">Company / Factory Name</label>
            <input
              type="text" required value={company} onChange={(e) => setCompany(e.target.value)}
              className="w-full bg-white border border-zinc-200 focus:border-zinc-400 px-4 py-3.5 rounded-xl focus:outline-none transition-colors text-sm shadow-2xs"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold tracking-widest text-zinc-400 block uppercase">Message</label>
            <textarea
              rows={5} value={message} onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-white border border-zinc-200 focus:border-zinc-400 px-4 py-3.5 rounded-xl focus:outline-none transition-colors text-sm resize-none shadow-2xs"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <span className="text-xs text-zinc-400">
              or email <a href="mailto:team@corobox.ai" className="text-zinc-600 underline hover:text-black">team@corobox.ai</a>
            </span>
            <button
              type="submit" disabled={loading}
              className="w-full sm:w-auto bg-[#18181b] text-white font-medium text-sm px-8 py-3 rounded-full hover:bg-black transition-colors disabled:opacity-50 shadow-sm"
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </form>

        {status && (
          <div className={`mt-6 text-xs max-w-2xl mx-auto p-3.5 rounded-xl border ${status.type === "success" ? "border-emerald-200 text-emerald-700 bg-emerald-50" : "border-rose-200 text-rose-700 bg-rose-50"}`}>
            {status.msg}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="bg-zinc-100/50 border-t border-zinc-200/60 mt-12">
        <div className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-12 gap-8 text-sm">
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center">
              <Image 
                src="/corobox-logo.png" 
                alt="Corobox Logo Icon" 
                width={25}
                height={25}
                style={{ height: "auto" }}
                className="object-contain mix-blend-darken contrast-125 brightness-105"
              />
              <span className="font-semibold text-lg text-black">corobox</span>
            </div>
            <p className="text-zinc-400 text-xs">Vision inspection platform for factories.</p>
          </div>
          
          <div className="md:col-span-4 space-y-2">
            <span className="text-[11px] font-semibold text-zinc-400 tracking-wider uppercase block">Contact</span>
            <div className="space-y-1 text-xs text-zinc-600">
              <div><a href="mailto:team@corobox.ai" className="hover:text-black">team@corobox.ai</a></div>
              <div><a href="#" className="hover:text-black">LinkedIn</a></div>
            </div>
          </div>

          <div className="md:col-span-3 space-y-2">
            <span className="text-[11px] font-semibold text-zinc-400 tracking-wider uppercase block">Backed by</span>
            <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-700">
            <Image 
                src="/founders-hub.png" 
                alt="Corobox Logo Icon" 
                width={25}
                height={25}
                style={{ height: "auto" }}
                className="object-contain mix-blend-darken contrast-125 brightness-105"
              />
              <span>Founders Hub</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 py-6 border-t border-zinc-200/40 flex flex-col sm:flex-row justify-between items-center text-xs text-zinc-400 gap-2">
          <div>&copy; 2026 Corobox Inc. All rights reserved.</div>
          <div>Tashkent, Uzbekistan</div>
        </div>
      </footer>

    </div>
  );
}