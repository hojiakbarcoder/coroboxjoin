"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

/* ------------------------------------------------------------------ */
/* Site settings: fill these in before launch.                        */
/* ------------------------------------------------------------------ */

const BRAND = "Wenzzday Robotics";

// Inbox that receives "or email us" messages.
const CONTACT_EMAIL = "team@corobox.ai";

// Company LinkedIn page. The link is hidden while this is empty, so the site
// never shows a dead "#" link.
const LINKEDIN_URL = "";

// Team members. Replace the placeholders with real names, roles and a one-line bio.
const TEAM: { name: string; role: string; bio: string }[] = [
  { name: "[Name]", role: "[Role]", bio: "[One-line background]" },
  { name: "[Name]", role: "[Role]", bio: "[One-line background]" },
  { name: "[Name]", role: "[Role]", bio: "[One-line background]" },
];

// Upload rules. Keep in sync with convex/waitlist.ts.
const MAX_FILE_BYTES = 50 * 1024 * 1024;
const MAX_FILES = 30;
// Some browsers report an empty type for HEIC/HEIF and MOV, so fall back to the extension.
const TYPE_BY_EXTENSION: Record<string, string> = {
  heic: "image/heic",
  heif: "image/heif",
  mov: "video/quicktime",
  mp4: "video/mp4",
};
const fileType = (f: File) => f.type || TYPE_BY_EXTENSION[f.name.split(".").pop()?.toLowerCase() ?? ""] || "";
const isAllowedFile = (f: File) => {
  const t = fileType(f);
  return t.startsWith("image/") || t === "video/mp4" || t === "video/quicktime";
};
const FILE_ACCEPT = "image/*,.heic,.heif,video/mp4,.mp4,video/quicktime,.mov";

/** Thrown for a non-OK API response; carries the API's error code. */
class ApiError extends Error {}

async function postJson<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data?.error ?? "server_error");
  return data as T;
}
const fmtSize = (b: number) => (b >= 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);

const INSPECTION_METHODS = [
  "Manual / visual inspection",
  "Rule-based machine vision",
  "End-of-line functional test only",
  "No dedicated inspection",
  "Other",
];

/* ------------------------------------------------------------------ */

const label = "text-[11px] font-semibold tracking-widest text-zinc-400 block uppercase";
const input =
  "w-full bg-white border border-zinc-200 focus:border-zinc-400 px-4 py-3.5 rounded-xl focus:outline-none transition-colors text-sm shadow-2xs";
const card = "bg-white p-8 rounded-2xl border border-zinc-200/50 shadow-xs";
const section = "max-w-7xl mx-auto px-6 sm:px-8 py-20 border-t border-zinc-200/60";

function SectionHeader({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="max-w-3xl mb-12">
      <span className={`${label} mb-3`}>{eyebrow}</span>
      <h2 className="text-3xl font-semibold tracking-tight text-black">{title}</h2>
      {sub && <p className="text-zinc-500 mt-3 text-sm leading-relaxed">{sub}</p>}
    </div>
  );
}

function Wordmark({ size = "lg" }: { size?: "lg" | "sm" }) {
  return (
    <span
      className={`font-semibold tracking-tight text-black leading-none ${
        size === "lg" ? "text-xl sm:text-2xl" : "text-lg"
      }`}
    >
      WENZZDAY <span className="text-zinc-400 font-normal">ROBOTICS</span>
    </span>
  );
}

/** Schematic of the camera's view of an assembly with flagged deviations. */
function InspectionIllustration() {
  return (
    <svg viewBox="0 0 400 400" className="w-full h-full" role="img" aria-label="Illustration of an assembly being inspected, with two flagged deviations">
      <rect width="400" height="400" fill="#ffffff" />
      <g stroke="#e4e4e7" strokeWidth="1">
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`v${i}`} x1={40 + i * 40} y1="0" x2={40 + i * 40} y2="400" />
        ))}
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={40 + i * 40} x2="400" y2={40 + i * 40} />
        ))}
      </g>

      {/* part body */}
      <rect x="80" y="110" width="240" height="180" rx="18" fill="#f4f4f5" stroke="#18181b" strokeWidth="2" />
      <rect x="120" y="150" width="160" height="100" rx="10" fill="#ffffff" stroke="#a1a1aa" strokeWidth="1.5" />

      {/* bolts: one missing */}
      {[
        [100, 130],
        [300, 130],
        [100, 270],
      ].map(([cx, cy]) => (
        <g key={`${cx}-${cy}`}>
          <circle cx={cx} cy={cy} r="9" fill="#d4d4d8" stroke="#18181b" strokeWidth="1.5" />
          <path d={`M${cx - 4} ${cy}h8M${cx} ${cy - 4}v8`} stroke="#18181b" strokeWidth="1.5" />
        </g>
      ))}
      <circle cx="300" cy="270" r="9" fill="none" stroke="#a1a1aa" strokeWidth="1.5" strokeDasharray="3 3" />

      {/* connector + hose */}
      <rect x="150" y="180" width="44" height="30" rx="4" fill="#18181b" />
      <rect x="212" y="186" width="34" height="22" rx="4" fill="#71717a" transform="rotate(-12 229 197)" />
      <path d="M320 200 C 360 200, 360 320, 250 330" fill="none" stroke="#52525b" strokeWidth="7" strokeLinecap="round" />

      {/* passed checks */}
      <g fill="none" stroke="#059669" strokeWidth="1.5">
        <rect x="84" y="114" width="32" height="32" rx="4" />
        <rect x="284" y="114" width="32" height="32" rx="4" />
        <rect x="84" y="254" width="32" height="32" rx="4" />
        <rect x="144" y="174" width="56" height="42" rx="4" />
      </g>

      {/* flagged deviations */}
      <g fill="none" stroke="#e11d48" strokeWidth="2">
        <rect x="280" y="250" width="40" height="40" rx="4" />
        <rect x="206" y="174" width="48" height="46" rx="4" />
      </g>
      <g fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="11" fontWeight="600">
        <rect x="244" y="296" width="112" height="22" rx="4" fill="#e11d48" />
        <text x="252" y="311" fill="#ffffff">MISSING BOLT</text>
        <rect x="196" y="140" width="132" height="22" rx="4" fill="#e11d48" />
        <text x="204" y="155" fill="#ffffff">CONNECTOR UNSEATED</text>
      </g>

      {/* status bar */}
      <rect x="20" y="20" width="360" height="34" rx="8" fill="#18181b" />
      <circle cx="40" cy="37" r="5" fill="#e11d48" />
      <text x="54" y="41" fill="#ffffff" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="11" fontWeight="600">
        STATION 04 · 2 DEVIATIONS · REJECT
      </text>
    </svg>
  );
}

export default function WenzzdayLanding() {
  /* --- Defect cost calculator --- */
  const [calcVolume, setCalcVolume] = useState(100000);
  const [calcDefectRate, setCalcDefectRate] = useState(0.5);
  const [calcCost, setCalcCost] = useState(150);

  const calc = useMemo(() => {
    const v = Math.max(0, calcVolume || 0);
    const r = Math.max(0, calcDefectRate || 0);
    const c = Math.max(0, calcCost || 0);
    const defectiveParts = v * (r / 100);
    const monthly = defectiveParts * c;
    return { defectiveParts, monthly, annual: monthly * 12 };
  }, [calcVolume, calcDefectRate, calcCost]);

  const fmtInt = (n: number) => Math.round(n).toLocaleString("en-US");
  const fmtUsd = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  /* --- Contact form --- */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [partType, setPartType] = useState("");
  const [monthlyVolume, setMonthlyVolume] = useState("");
  const [inspectionMethod, setInspectionMethod] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);


  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const picked = Array.from(list);
    const rejected = picked.filter((f) => !isAllowedFile(f) || f.size > MAX_FILE_BYTES);
    const accepted = picked.filter((f) => isAllowedFile(f) && f.size <= MAX_FILE_BYTES);
    const next = [...files, ...accepted].slice(0, MAX_FILES);
    const messages: string[] = [];
    if (rejected.length) messages.push(`Skipped ${rejected.length} file(s): only images (incl. HEIC) and MP4/MOV videos up to 50 MB each.`);
    if (files.length + accepted.length > MAX_FILES) messages.push(`Up to ${MAX_FILES} files.`);
    setFileError(messages.length ? messages.join(" ") : null);
    setFiles(next);
  };

  const uploadFiles = async (): Promise<string[]> => {
    const ids: string[] = [];
    for (let i = 0; i < files.length; i++) {
      setProgress(`Uploading ${i + 1} of ${files.length}...`);
      const { url } = await postJson<{ url: string }>("/api/upload-url");
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": fileType(files[i]) },
        body: files[i],
      });
      if (!res.ok) throw new Error("upload_failed");
      const { storageId } = (await res.json()) as { storageId: string };
      ids.push(storageId);
    }
    return ids;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const volume = Number(monthlyVolume);
    if (!name || !email || !company || !partType || !inspectionMethod || !Number.isFinite(volume)) return;

    setLoading(true);
    setStatus(null);
    try {
      const attachments = await uploadFiles();
      setProgress("Sending...");
      await postJson("/api/lead", { name, email, company, partType, monthlyVolume: volume, inspectionMethod, attachments });
      setStatus({ type: "success", msg: "Thanks. We received your request and will reply within 48 hours with a written feasibility note." });
      setName("");
      setEmail("");
      setCompany("");
      setPartType("");
      setMonthlyVolume("");
      setInspectionMethod("");
      setFiles([]);
      setFileError(null);
    } catch (err) {
      const code = err instanceof ApiError ? err.message : "";
      const msg =
        code === "rate_limited"
          ? `Too many requests from your network. Please try again in an hour, or email ${CONTACT_EMAIL}.`
          : code === "attachment_invalid"
            ? "One of the files was rejected. Use images, MP4 or MOV up to 50 MB each."
            : `Something went wrong. Please try again or email ${CONTACT_EMAIL}.`;
      setStatus({ type: "error", msg });
    }
    setProgress(null);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#09090b] selection:bg-zinc-200">
      {/* HEADER */}
      <header className="max-w-7xl mx-auto px-6 sm:px-8 h-24 flex items-center justify-between gap-4">
        <a href="#top" aria-label={`${BRAND} home`}>
          <Wordmark />
        </a>
        <nav className="flex items-center gap-6">
          <a href="#how-it-works" className="hidden md:inline text-sm text-zinc-500 hover:text-black transition-colors">How it works</a>
          <a href="#start" className="hidden md:inline text-sm text-zinc-500 hover:text-black transition-colors">How to start</a>
          <a href="#contact" className="bg-[#18181b] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-black transition-colors whitespace-nowrap">
            <span className="sm:hidden">Free check</span>
            <span className="hidden sm:inline">Get a free feasibility check</span>
          </a>
        </nav>
      </header>

      {/* HERO */}
      <section id="top" className="max-w-7xl mx-auto px-6 sm:px-8 pt-16 md:pt-20 pb-24 md:pb-28 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-7 space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-black leading-[1.05]">
            Self-learning quality inspection for automotive manufacturing
          </h1>
          <p className="text-lg sm:text-xl text-zinc-500 font-normal max-w-2xl leading-relaxed">
            AI that catches assembly errors on engine and component lines, and learns every new part on its own.
          </p>
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <a href="#contact" className="inline-block bg-[#18181b] text-white px-6 py-3.5 rounded-full text-base font-medium hover:bg-black transition-colors">
              Get a free feasibility check
            </a>
            <a href="#how-it-works" className="inline-block text-base font-medium text-zinc-600 hover:text-black transition-colors px-2 py-3.5">
              See how it works →
            </a>
          </div>
        </div>
        <div className="md:col-span-5">
          <div className="relative w-full max-w-md md:max-w-none mx-auto aspect-square bg-white rounded-3xl border border-zinc-200/60 shadow-xs overflow-hidden">
            <InspectionIllustration />
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section id="problem" className={section}>
        <SectionHeader
          eyebrow="The problem"
          title="Assembly errors get past the station."
          sub="A missing bolt on an engine, a connector that is not fully latched, the wrong variant of a component: small errors that are easy to miss at the station and expensive once they leave it."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={card}>
            <h3 className="text-lg font-medium text-black mb-2">Manual checks miss things</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Inspectors look at near-identical assemblies all shift. On an engine line, a missing fastener, a misrouted hose or an unseated clamp is hard to spot on the hundredth unit.
            </p>
          </div>
          <div className={card}>
            <h3 className="text-lg font-medium text-black mb-2">Rule-based vision breaks on new parts</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Traditional machine vision is programmed rule by rule. Every new component, variant or model change means reprogramming, usually by an integrator, before the station can check it.
            </p>
          </div>
          <div className={card}>
            <h3 className="text-lg font-medium text-black mb-2">Escapes cost more downstream</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              An error caught at the station is a rework. The same error found at the next plant or by the OEM brings containment, sorting and chargebacks.
            </p>
          </div>
        </div>

        {/* DEFECT COST CALCULATOR */}
        <div id="calculator" className="mt-16">
          <div className="max-w-3xl mb-8">
            <h3 className="text-2xl font-semibold tracking-tight text-black">What defects cost you today.</h3>
            <p className="text-zinc-500 mt-2 text-sm leading-relaxed">
              Enter your own numbers. This shows the cost at stake; how much of it inspection recovers is measured on your parts in the bench test.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-white p-6 sm:p-8 md:p-12 rounded-3xl border border-zinc-200/60 shadow-xs">
            <div className="md:col-span-7 space-y-6">
              <div className="space-y-2">
                <label htmlFor="calc-volume" className={label}>Monthly part volume</label>
                <div className="relative">
                  <input
                    id="calc-volume" type="number" inputMode="numeric" min={0} step={1000}
                    value={Number.isNaN(calcVolume) ? "" : calcVolume}
                    onChange={(e) => setCalcVolume(e.target.valueAsNumber)}
                    className={`${input} font-mono pr-20`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-400">parts / mo</span>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="calc-rate" className={label}>Defect rate</label>
                <div className="relative">
                  <input
                    id="calc-rate" type="number" inputMode="decimal" min={0} max={100} step={0.01}
                    value={Number.isNaN(calcDefectRate) ? "" : calcDefectRate}
                    onChange={(e) => setCalcDefectRate(e.target.valueAsNumber)}
                    className={`${input} font-mono pr-10`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-400">%</span>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="calc-cost" className={label}>Cost per defect</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-zinc-400">$</span>
                  <input
                    id="calc-cost" type="number" inputMode="decimal" min={0} step={1}
                    value={Number.isNaN(calcCost) ? "" : calcCost}
                    onChange={(e) => setCalcCost(e.target.valueAsNumber)}
                    className={`${input} font-mono pl-8`}
                  />
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Include rework, scrap, sorting, containment and customer chargebacks per defective part.
                </p>
              </div>
            </div>

            <div className="md:col-span-5 flex flex-col gap-4 md:pl-8 border-t md:border-t-0 md:border-l border-zinc-200/80 pt-6 md:pt-0">
              <div className="bg-[#f8f9fa] p-5 rounded-xl border border-zinc-200/40">
                <span className="text-[11px] font-semibold tracking-wider text-zinc-400 block mb-1">DEFECTIVE PARTS / MO</span>
                <span className="text-3xl font-bold tracking-tight text-black font-mono">{fmtInt(calc.defectiveParts)}</span>
              </div>
              <div className="bg-[#f8f9fa] p-5 rounded-xl border border-zinc-200/40">
                <span className="text-[11px] font-semibold tracking-wider text-zinc-400 block mb-1">DEFECT COST / MO</span>
                <span className="text-3xl font-bold tracking-tight text-black font-mono">{fmtUsd(calc.monthly)}</span>
              </div>
              <div className="bg-[#f8f9fa] p-5 rounded-xl border border-zinc-200/40">
                <span className="text-[11px] font-semibold tracking-wider text-zinc-400 block mb-1">DEFECT COST / YEAR</span>
                <span className="text-3xl font-bold tracking-tight text-black font-mono">{fmtUsd(calc.annual)}</span>
              </div>
            </div>

            <div className="md:col-span-12 border-t border-zinc-200/80 pt-6">
              <span className={`${label} mb-3`}>Formula</span>
              <div className="font-mono text-xs sm:text-sm text-zinc-600 space-y-1.5 break-words">
                <p>
                  defective parts / mo = {fmtInt(calcVolume || 0)} × {calcDefectRate || 0}% = <span className="text-black">{fmtInt(calc.defectiveParts)}</span>
                </p>
                <p>
                  defect cost / mo = {fmtInt(calc.defectiveParts)} × {fmtUsd(calcCost || 0)} = <span className="text-black">{fmtUsd(calc.monthly)}</span>
                </p>
                <p>
                  defect cost / year = {fmtUsd(calc.monthly)} × 12 = <span className="text-black">{fmtUsd(calc.annual)}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className={section}>
        <SectionHeader
          eyebrow="How it works"
          title="From camera to inspection, without writing rules."
        />
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              t: "Mount over the station",
              d: "An industrial camera and an edge computer go over an existing assembly or end-of-line station.",
            },
            {
              t: "Show it good parts",
              d: "The model learns what a correct assembly looks like from examples of good parts, not a hand-written rule set.",
            },
            {
              t: "It flags what's wrong",
              d: "Every part is checked as it passes. Deviations are flagged to the operator with the image and the location of the error.",
            },
            {
              t: "It learns new parts itself",
              d: "When a new part or variant arrives, the system learns it on its own, without reprogramming the station.",
            },
          ].map((s, i) => (
            <li key={s.t} className={card}>
              <span className="font-mono text-xs text-zinc-400 block mb-4">0{i + 1}</span>
              <h3 className="text-lg font-medium text-black mb-2">{s.t}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* WHY IT'S DIFFERENT */}
      <section id="why" className={section}>
        <SectionHeader
          eyebrow="Why it's different"
          title="Built for lines where the parts keep changing."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={card}>
            <h3 className="text-lg font-medium text-black mb-2">Self-learning, not rule-based</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Rule-based vision needs someone to define every check. Our models learn the part from examples, so adding a new part does not start a programming project.
            </p>
          </div>
          <div className={card}>
            <h3 className="text-lg font-medium text-black mb-2">Learns from good parts</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              You do not need a library of every possible defect. The system learns what correct looks like and flags what differs from it.
            </p>
          </div>
          <div className={card}>
            <h3 className="text-lg font-medium text-black mb-2">Checks the assembly, not just the surface</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Built for assembly verification: whether each component is present, in the right position, the right way round and the right variant.
            </p>
          </div>
          <div className={card}>
            <h3 className="text-lg font-medium text-black mb-2">Runs at the line</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Inference runs on an edge computer at the station, so decisions are made locally and production images stay in your plant.
            </p>
          </div>
        </div>
      </section>

      {/* PROOF */}
      {/* Add measured results here (bench or pilot numbers) once you have them. */}
      <section id="proof" className={section}>
        <SectionHeader
          eyebrow="Proof"
          title="Proven on your part, not a brochure."
          sub="We would rather show you results on your own parts than ask you to trust a slide. The bench test produces a report with numbers measured on your samples."
        />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className={`${card} md:col-span-7`}>
            <span className={`${label} mb-4`}>Examples of what we test for</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-base font-medium text-black mb-3">Engine assembly</h3>
                <ul className="space-y-2 text-sm text-zinc-500">
                  <li>Missing or unseated bolts</li>
                  <li>Connectors not fully latched</li>
                  <li>Misrouted hoses and clamps</li>
                  <li>Missing gaskets and seals</li>
                </ul>
              </div>
              <div>
                <h3 className="text-base font-medium text-black mb-3">Component assembly</h3>
                <ul className="space-y-2 text-sm text-zinc-500">
                  <li>Wrong part variant fitted</li>
                  <li>Missing clips and fasteners</li>
                  <li>Parts mounted in the wrong orientation</li>
                  <li>Incorrect or missing labels and markings</li>
                </ul>
              </div>
            </div>
          </div>
          <div className={`${card} md:col-span-5`}>
            <span className={`${label} mb-4`}>Your bench test report shows</span>
            <ul className="space-y-4 text-sm">
              <li>
                <span className="text-black font-medium block">Catch rate</span>
                <span className="text-zinc-500">Share of known defects on your samples that the system flagged.</span>
              </li>
              <li>
                <span className="text-black font-medium block">False rejects</span>
                <span className="text-zinc-500">Share of good parts incorrectly flagged.</span>
              </li>
              <li>
                <span className="text-black font-medium block">Inspection time per part</span>
                <span className="text-zinc-500">Measured against your station cycle time.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* HOW TO START */}
      <section id="start" className={section}>
        <SectionHeader
          eyebrow="How to start"
          title="Start free, pay only once it works on your parts."
        />
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              tag: "Free",
              t: "Remote check",
              d: "Send 10–20 photos of good parts and 3–5 of defective ones, or a 1-minute phone video. We reply within 48 hours with a written feasibility note.",
            },
            {
              tag: "Free",
              t: "Live demo",
              d: "A 30-minute call where we run a model on your images, live.",
            },
            {
              tag: "Paid",
              t: "Bench test",
              d: "You ship us a few sample parts. We test them on our bench and give you a written result.",
            },
            {
              tag: "Paid",
              t: "Pilot",
              d: "Installation on your line.",
            },
          ].map((s, i) => (
            <li key={s.t} className={`${card} relative`}>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs text-zinc-400">STEP {i + 1}</span>
                <span className="text-[11px] font-semibold tracking-wider uppercase text-zinc-600 bg-[#f8f9fa] border border-zinc-200/60 px-2.5 py-1 rounded-full">
                  {s.tag}
                </span>
              </div>
              <h3 className="text-lg font-medium text-black mb-2">{s.t}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{s.d}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10">
          <a href="#contact" className="inline-block bg-[#18181b] text-white px-6 py-3.5 rounded-full text-base font-medium hover:bg-black transition-colors">
            Get a free feasibility check
          </a>
        </div>
      </section>

      {/* TEAM */}
      <section id="team" className={section}>
        <SectionHeader eyebrow="Team" title="Who builds it." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEAM.map((m, i) => (
            <div key={`${m.name}-${i}`} className={card}>
              <div className="w-12 h-12 rounded-full bg-[#f8f9fa] border border-zinc-200/60 mb-5" aria-hidden />
              <h3 className="text-lg font-medium text-black">{m.name}</h3>
              <span className="text-sm text-zinc-400 block mb-3">{m.role}</span>
              <p className="text-zinc-500 text-sm leading-relaxed">{m.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="max-w-4xl mx-auto px-6 sm:px-8 py-24 text-center border-t border-zinc-200/60">
        <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-black mb-4">Get a free feasibility check.</h2>
        <p className="text-zinc-500 text-sm mb-12 max-w-xl mx-auto leading-relaxed">
          Tell us about the part and how you inspect it today. Photos or a short video help, but are optional. We reply within 48 hours with a written feasibility note.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 text-left max-w-2xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="f-name" className={label}>Name</label>
              <input id="f-name" type="text" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={input} />
            </div>
            <div className="space-y-2">
              <label htmlFor="f-email" className={label}>Work email</label>
              <input id="f-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="f-company" className={label}>Company</label>
            <input id="f-company" type="text" required autoComplete="organization" value={company} onChange={(e) => setCompany(e.target.value)} className={input} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="f-part" className={label}>Part type</label>
              <input
                id="f-part" type="text" required placeholder="e.g. cylinder head, wiring harness"
                value={partType} onChange={(e) => setPartType(e.target.value)} className={input}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="f-volume" className={label}>Monthly volume</label>
              <input
                id="f-volume" type="number" required min={0} step={1} inputMode="numeric" placeholder="Parts per month"
                value={monthlyVolume} onChange={(e) => setMonthlyVolume(e.target.value)} className={input}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="f-method" className={label}>Current inspection method</label>
            <select
              id="f-method" required value={inspectionMethod} onChange={(e) => setInspectionMethod(e.target.value)}
              className={`${input} appearance-none ${inspectionMethod ? "" : "text-zinc-400"}`}
            >
              <option value="" disabled>Select one</option>
              {INSPECTION_METHODS.map((m) => (
                <option key={m} value={m} className="text-black">{m}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <span className={label}>
              Photos or video <span className="normal-case tracking-normal font-normal">(optional)</span>
            </span>
            <label
              htmlFor="f-files"
              className="flex flex-col items-center justify-center gap-1 w-full bg-white border border-dashed border-zinc-300 hover:border-zinc-400 px-4 py-6 rounded-xl cursor-pointer transition-colors text-center shadow-2xs"
            >
              <span className="text-sm text-black font-medium">Choose files</span>
              <span className="text-xs text-zinc-400">Images (JPG, PNG, HEIC) or video (MP4, MOV), up to 50 MB each</span>
            </label>
            <input
              id="f-files" type="file" multiple accept={FILE_ACCEPT} className="sr-only"
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = "";
              }}
            />
            {fileError && <p className="text-xs text-rose-600">{fileError}</p>}
            {files.length > 0 && (
              <ul className="divide-y divide-zinc-200/60 bg-white border border-zinc-200 rounded-xl text-sm">
                {files.map((f, i) => (
                  <li key={`${f.name}-${i}`} className="flex items-center justify-between gap-3 px-4 py-2.5">
                    <span className="truncate text-zinc-700">{f.name}</span>
                    <span className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-zinc-400 font-mono">{fmtSize(f.size)}</span>
                      <button
                        type="button" disabled={loading}
                        onClick={() => setFiles(files.filter((_, j) => j !== i))}
                        className="text-xs text-zinc-400 hover:text-black disabled:opacity-50"
                        aria-label={`Remove ${f.name}`}
                      >
                        Remove
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <span className="text-xs text-zinc-400">
              or email <a href={`mailto:${CONTACT_EMAIL}`} className="text-zinc-600 underline hover:text-black">{CONTACT_EMAIL}</a>
            </span>
            <button
              type="submit" disabled={loading}
              className="w-full sm:w-auto bg-[#18181b] text-white font-medium text-sm px-8 py-3 rounded-full hover:bg-black transition-colors disabled:opacity-50 shadow-sm"
            >
              {loading ? progress ?? "Sending..." : "Send"}
            </button>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed text-center sm:text-left">
            NDA available on request. You can hide logos and serial numbers. Your images are used only for this assessment and deleted on request.
          </p>
        </form>

        {status && (
          <div
            role="status"
            className={`mt-6 text-xs max-w-2xl mx-auto p-3.5 rounded-xl border ${
              status.type === "success" ? "border-emerald-200 text-emerald-700 bg-emerald-50" : "border-rose-200 text-rose-700 bg-rose-50"
            }`}
          >
            {status.msg}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="bg-zinc-100/50 border-t border-zinc-200/60 mt-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16 grid grid-cols-1 md:grid-cols-12 gap-8 text-sm">
          <div className="md:col-span-5 space-y-3">
            <Wordmark size="sm" />
            <p className="text-zinc-400 text-xs">Self-learning quality inspection for automotive manufacturing.</p>
          </div>

          <div className="md:col-span-4 space-y-2">
            <span className="text-[11px] font-semibold text-zinc-400 tracking-wider uppercase block">Contact</span>
            <div className="space-y-1 text-xs text-zinc-600">
              <div><a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-black">{CONTACT_EMAIL}</a></div>
              {LINKEDIN_URL && (
                <div>
                  <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="hover:text-black">LinkedIn</a>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-3 space-y-2">
            <span className="text-[11px] font-semibold text-zinc-400 tracking-wider uppercase block">Backed by</span>
            <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-700">
              <Image
                src="/founders-hub.png" alt="" width={25} height={25} style={{ height: "auto" }}
                className="object-contain mix-blend-darken contrast-125 brightness-105"
              />
              <span>Founders Hub</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-6 border-t border-zinc-200/40 flex flex-col sm:flex-row justify-between items-center text-xs text-zinc-400 gap-2">
          <div>&copy; 2026 {BRAND}. All rights reserved.</div>
          <div>Tashkent, Uzbekistan</div>
        </div>
      </footer>
    </div>
  );
}
