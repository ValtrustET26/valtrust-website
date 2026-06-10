"use client";
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Lock, ShieldCheck } from "lucide-react"
import {useRouter} from "next/navigation";        

gsap.registerPlugin(ScrollTrigger);

export default function BuyerTerms() {
  const [agreed, setAgreed] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-title", { y: 40, opacity: 0, duration: 0.9, ease: "power3.out", delay: 0.1 });
      gsap.from(".hero-sub",   { y: 24, opacity: 0, duration: 0.8, ease: "power3.out", delay: 0.3 });
      gsap.from(".hero-btn",   { y: 16, opacity: 0, duration: 0.7, ease: "power3.out", delay: 0.5 });
      gsap.from(".hero-line",  { scaleX: 0, duration: 1, ease: "power3.out", delay: 0.6, transformOrigin: "left center" });

      gsap.utils.toArray<HTMLElement>(".scroll-reveal").forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
          y: 48, opacity: 0, duration: 0.7, ease: "power3.out", delay: i * 0.05,
        });
      });

      gsap.utils.toArray<HTMLElement>(".card-item").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" },
          y: 32, opacity: 0, scale: 0.97, duration: 0.6, ease: "back.out(1.4)",
        });
      });

      gsap.utils.toArray<HTMLElement>(".section-num").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 88%" },
          x: -20, opacity: 0, duration: 0.5, ease: "power2.out",
        });
      });
    });

    return () => ctx.revert();
  }, []);


    

   
  return (
    <main className="min-h-screen bg-[var(--wh-main)]" ref={heroRef}>
      {/* Hero */}
      <div className="relative w-full h-64 bg-[var(--bl-main)] overflow-hidden flex items-end">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bl-main)] via-[var(--bl-main)]/90 to-[var(--gr-main)]/40 z-10" />

        <div className="relative z-20 px-10 pb-8 w-full">
          <div className="hero-line h-[2px] w-16 bg-[var(--gr-main)] mb-4 rounded-full" />
          <h1 className="hero-title font-heading text-3xl font-bold text-white leading-tight tracking-tight">
            Buyer Terms<br />& Conditions
          </h1>
          <p className="hero-sub text-white/60 text-sm mt-2">
            Secure and transparent property purchasing with Valtrust.
          </p>
          <button className="hero-btn mt-5 px-6 py-2.5 bg-[var(--gr-main)] text-white text-sm font-semibold rounded-lg hover:brightness-110 transition-all duration-200 shadow-lg shadow-[var(--gr-main)]/30">
            Agree & continue
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12 flex flex-col gap-12">

        {/* 1. Buyer Responsibilities */}
        <section className="scroll-reveal">
          <SectionHeading number="1" title="Buyer Responsibilities" />
          <div className="card-item border border-gray-200 rounded-2xl p-6 flex gap-6 items-start bg-white shadow-sm hover:shadow-md hover:border-[var(--gr-main)]/40 transition-all duration-300">
            <div className="shrink-0 w-16 h-16 border-2 border-[var(--gr-main)]/40 rounded-xl flex items-center justify-center bg-[var(--gr-main)]/5">
              <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
                <rect x="8" y="6" width="32" height="36" rx="3" fill="#e8f4f6" stroke="var(--gr-main)" strokeWidth="2" />
                <circle cx="24" cy="22" r="7" fill="#b0d8e5" stroke="var(--gr-main)" strokeWidth="1.5" />
                <path d="M14 38q10-10 20 0" stroke="var(--gr-main)" strokeWidth="1.5" fill="none" />
              </svg>
            </div>
            <ul className="flex flex-col gap-2.5 pt-1">
              {[
                "Provide accurate and up-to-date personal information.",
                "Upload valid identification documents when requested.",
                "Use Valtrust only for lawful property transactions.",
                "Respect the privacy of sellers and other users.",
                "Avoid fraudulent, misleading, or harmful activity.",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-gray-600">
                  <CheckIcon />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 2. Verification Policy */}
        <section className="scroll-reveal">
          <SectionHeading number="2" title="Verification Policy" />
          <div className="grid md:flex gap-4">
            {[
              {
                title: "Government-issued ID",
                desc: "Provide a valid government-issued identification.",
                icon: <IDIcon />,
              },
              {
                title: "Facial Verification",
                desc: "Complete a secure face verification process.",
                icon: <FaceIcon />,
              },
              {
                title: "Secure Transactions",
                desc: "Your data is encrypted and used only for verification.",
                icon: <ShieldSmallIcon />,
              },
            ].map((doc) => (
              <div
                key={doc.title}
                className="card-item group border border-gray-200 rounded-2xl p-5 flex flex-col items-center text-center gap-3 bg-white shadow-sm hover:shadow-md hover:border-[var(--gr-main)]/50 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-[var(--gr-main)]/8 flex items-center justify-center group-hover:bg-[var(--gr-main)]/15 transition-colors duration-300">
                  {doc.icon}
                </div>
                <p className="font-heading text-sm font-semibold text-[var(--bl-main)]">{doc.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{doc.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3 & 4 side by side */}
        <div className="grid md:flex md:full gap-4">
          <section className="scroll-reveal flex flex-col md:w-full">
            <SectionHeading number="3" title="Property Viewing Rules" />
            <div className="card-item flex-1 border border-gray-200 rounded-2xl p-5 flex gap-4 items-start bg-white shadow-sm hover:shadow-md hover:border-[var(--gr-main)]/40 transition-all duration-300">
              <div className="shrink-0 w-12 h-12 border border-[var(--gr-main)]/30 rounded-xl flex items-center justify-center bg-[var(--gr-main)]/5">
                <svg viewBox="0 0 40 40" className="w-7 h-7" fill="none">
                  <rect x="6" y="10" width="20" height="24" rx="2" fill="#e8f4f6" stroke="var(--gr-main)" strokeWidth="1.5" />
                  <path d="M18 10l6 6h-6V10Z" fill="#b0d8e5" stroke="var(--gr-main)" strokeWidth="1" />
                  <path d="M10 20h12M10 24h9M10 28h10" stroke="var(--gr-main)" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
                </svg>
              </div>
              <ul className="flex flex-col gap-2">
                {[
                  "Schedule visits through the platform.",
                  "No direct negotiations outside Valtrust.",
                  "Respect the property and neighborhood.",
                  "Do not record or take photos without permission.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-gray-600">
                    <CheckIcon small />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="scroll-reveal flex flex-col">
            <SectionHeading number="4" title="AI Valuation Disclaimer" />
            <div className="card-item flex-1 border border-gray-200 rounded-2xl p-5 flex gap-4 items-start bg-white shadow-sm hover:shadow-md hover:border-[var(--gr-main)]/40 transition-all duration-300">
              <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-[var(--bl-main)] shadow-md shadow-[var(--bl-main)]/30">
                <span className="text-white font-bold text-base tracking-tight">AI</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed pt-1">
                Property valuations are estimates generated using market data and artificial intelligence. Valtrust does not guarantee final market prices.
              </p>
            </div>
          </section>
        </div>

        {/* 5. Security */}
        <section className="scroll-reveal">
          <SectionHeading number="5" title="Data & Platform Security" />
          <div className="grid md:flex gap-4">
            {[
              {
                title: "Personal Data Protection",
                desc: "We protect your personal information with advanced security measures.",
                icon: <Lock className="w-8 h-8" color="var(--gr-main)" strokeWidth={1.5} />,
              },
              {
                title: "Secure Platform",
                desc: "We promote transparency between buyers and sellers for a smooth experience.",
                icon: <ShieldCheck className="w-8 h-8" color="var(--gr-main)" strokeWidth={1.5} />,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="card-item border border-gray-200 rounded-2xl p-5 flex gap-4 items-start bg-white shadow-sm hover:shadow-md hover:border-[var(--gr-main)]/40 hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="shrink-0 w-12 h-12 rounded-xl bg-[var(--gr-main)]/8 flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <p className="font-heading text-sm font-semibold text-[var(--bl-main)] mb-1">{item.title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Agree + Continue */}
        <div className="scroll-reveal flex flex-col items-center gap-5 pt-2 pb-10">
          <label className="flex items-center gap-3 cursor-pointer select-none group">
            <div className="relative">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                  agreed
                    ? "bg-[var(--bl-main)] border-[var(--bl-main)]"
                    : "border-gray-300 group-hover:border-[var(--gr-main)]"
                }`}
              >
                {agreed && (
                  <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm text-gray-700">
              I have read and agree to the Buyer Terms & Conditions.
            </span>
          </label>

          <button
            disabled={!agreed}
            onClick={() => agreed && router.push("/buyer")}
            className={`w-full max-w-xs py-3 rounded-xl font-heading font-semibold text-sm tracking-widest transition-all duration-300 ${
              agreed
                ? "bg-[var(--bl-main)] text-white hover:brightness-110 shadow-lg shadow-[var(--bl-main)]/25 hover:shadow-[var(--bl-main)]/40 hover:-translate-y-0.5 active:scale-[0.98]"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            CONTINUE
          </button>
        </div>

      </div>
    </main>
  );
}

// Sub-components -----------------------------------------------------------------------

function SectionHeading({ number, title }: { number: string; title: string }) {
  return (
    <div className="section-num flex items-center gap-3 mb-4">
      <span className="w-7 h-7 rounded-lg bg-[var(--bl-main)] text-white text-xs font-bold flex items-center justify-center shrink-0">
        {number}
      </span>
      <h2 className="font-heading text-base font-semibold text-[var(--bl-main)]">{title}</h2>
      <div className="flex-1 h-px bg-gray-200 ml-1" />
    </div>
  );
}

function CheckIcon({ small = false }: { small?: boolean }) {
  const size = small ? "w-3.5 h-3.5" : "w-4 h-4";
  return (
    <svg className={`${size} shrink-0 mt-0.5`} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9" stroke="var(--gr-main)" strokeWidth="1.5" />
      <path d="M6 10l3 3 5-5" stroke="var(--gr-main)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IDIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
      <rect x="8" y="6" width="32" height="36" rx="3" fill="#e8f4f6" stroke="var(--gr-main)" strokeWidth="2" />
      <circle cx="24" cy="22" r="7" fill="#b0d8e5" stroke="var(--gr-main)" strokeWidth="1.5" />
      <path d="M14 38q10-10 20 0" stroke="var(--gr-main)" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function FaceIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
      <circle cx="24" cy="20" r="10" fill="#e8f4f6" stroke="var(--gr-main)" strokeWidth="2" />
      <path d="M24 32c-8 0-14 4-14 8h28c0-4-6-8-14-8Z" fill="#b0d8e5" stroke="var(--gr-main)" strokeWidth="1.5" />
      <path d="M20 20l2 2 6-5" stroke="var(--gr-main)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShieldSmallIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
      <path d="M24 4L8 12v12c0 10 7 18 16 20 9-2 16-10 16-20V12L24 4Z" fill="#e8f4f6" stroke="var(--gr-main)" strokeWidth="2" />
      <path d="M19 24l3 3 7-7" stroke="var(--gr-main)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}