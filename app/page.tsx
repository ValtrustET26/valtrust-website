'use client'
import React from "react";
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
import LandingFooter from "@/components/layout/footers/landingFooter";
import LandingNav from "@/components/layout/navbars/landingnav";
import { useState, useEffect } from "react";
import SellOrBuyPopup from "@/components/layout/selection-popup/Choose";
import { Eye, List, BarChart2 } from "lucide-react";


function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        relative rounded-2xl p-7 cursor-pointer overflow-hidden
        border transition-all duration-300 group
        ${hovered
          ? "bg-[#0F1E3C] border-[#0F1E3C] shadow-2xl -translate-y-1"
          : "bg-white border-zinc-100 shadow-sm hover:shadow-md"}
      `}
    >
      <div className={`
        w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5
        transition-colors duration-300
        ${hovered ? "bg-white/10" : "bg-[#0F1E3C]/5"}
      `}>
        {icon}
      </div>
      <h3 className={`font-bold text-lg mb-2 transition-colors duration-300 ${hovered ? "text-white" : "text-[#0F1E3C]"}`}>
        {title}
      </h3>
      <p className={`text-sm leading-relaxed transition-colors duration-300 ${hovered ? "text-white/60" : "text-zinc-500"}`}>
        {description}
      </p>
    </div>
  );
}

function CommunityCard({ name, tag, imageSrc }: { name: string; tag: string; imageSrc: string }) {
  return (
    <div className="group rounded-2xl overflow-hidden bg-white shadow-sm border border-zinc-100 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className="relative w-full h-52 overflow-hidden">
        <Image
          src={imageSrc}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-[#0F1E3C] text-base">{name}</h3>
        <span className="inline-block mt-2 bg-[#0F1E3C]/6 text-[#0F1E3C]/70 text-xs font-semibold px-3 py-1 rounded-full">
          {tag}
        </span>
      </div>
    </div>
  );
}

export default function Home() {
  const [popupOpen, setPopupOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="flex flex-col bg-zinc-50 font-sans dark:bg-black">
      <LandingNav onSignUpClick={() => setPopupOpen(true)} />
      <SellOrBuyPopup isOpen={popupOpen} onClose={() => setPopupOpen(false)} />

      {/* ── HERO ── */}
      <section className="relative w-full h-[80vh] md:h-screen overflow-hidden">
        <Image
          src="/landing/landing-image.png"
          priority
          className="object-cover"
          alt="landing-image"
          fill
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center pt-20">
          <TypeAnimation
            sequence={[
              "Find Your Dream",
              200,
              "Find Your Dream Land With",
              200,
              "Find Your Dream Land With Valtrust",
            ]}
            wrapper="h1"
            cursor={false}
            speed={50}
            repeat={0}
            className="text-white font-extrabold leading-tight text-5xl sm:text-6xl md:text-7xl max-w-3xl"
          />

          <p className="mt-5 text-white/65 text-lg max-w-xl leading-relaxed">
            AI-powered valuations and curated listings — buy, sell, and invest with confidence.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4 mt-8 justify-center">
            <button
              onClick={() => setPopupOpen(true)}
              className="bg-[#0F1E3C] hover:bg-[#1a2f5a] text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
            >
              Get started
            </button>
            <button className="bg-white/15 backdrop-blur-md hover:bg-white/25 text-white font-semibold px-8 py-3.5 rounded-xl border border-white/25 transition-all duration-200">
              Browse listings
            </button>
          </div>
        </div>


      </section>

      {/* ── FEATURE CARDS ── */}
      <section className="bg-white w-full py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold text-white/50 tracking-widest uppercase text-center mb-2">What we offer</p>
          <h2 className="text-3xl font-bold text-[#0F1E3C] text-center mb-12">Everything you need</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon="🏠"
              title="Visualize homes"
              description="Explore properties with immersive virtual tours and detailed photo galleries before visiting."
            />
            <FeatureCard
              icon="📋"
              title="Top listings"
              description="Curated properties updated daily, filtered by location, price range, and property type."
            />
            <FeatureCard
              icon="📊"
              title="Evaluate land"
              description="AI-driven valuation using real market data to help you make smarter investment decisions."
            />
          </div>
        </div>
      </section>

      {/* ── COMMUNITIES ── */}
      <section className="bg-zinc-50 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold text-white/50 tracking-widest uppercase text-center mb-2">Explore</p>
          <h2 className="text-3xl font-bold text-[#0F1E3C] text-center mb-12">Our communities</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <CommunityCard
              name="Santa Tecla"
              tag="Urban area"
              imageSrc="/landing/santa-tecla.png"
            />
            <CommunityCard
              name="Santa Ana"
              tag="Urban area"
              imageSrc="/landing/santa-ana.png"
            />
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
          {/* Text */}
          <div className="flex-1 flex flex-col gap-5">
            <p className="text-xs font-bold text-white/50 tracking-widest uppercase">About Valtrust</p>
            <h2 className="text-4xl font-extrabold text-[#0F1E3C] leading-tight">
              Smarter real estate,<br />built for El Salvador
            </h2>
            <p className="text-zinc-500 leading-relaxed">
              We are a digital platform that modernizes property buying, selling, and valuation in
              El Salvador through AI and real market data. We connect owners, buyers, and investors
              in a secure and transparent environment — making real estate decisions easier and smarter.
            </p>
            <button
              onClick={() => setPopupOpen(true)}
              className="self-start bg-[#0F1E3C] hover:bg-[#1a2f5a] text-white font-semibold px-7 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg mt-2"
            >
              Join Valtrust →
            </button>
          </div>

          {/* Images */}
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div className="relative h-56 rounded-2xl overflow-hidden shadow-md group">
              <Image
                src="/landing/casa-1.png"
                alt="Property 1"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="relative h-56 rounded-2xl overflow-hidden shadow-md group mt-8">
              <Image
                src="/landing/casa-2.png"
                alt="Property 2"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="bg-[#0F1E3C] py-16 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
          Ready to find your dream property?
        </h2>
        <p className="text-white/55 text-lg mb-8 max-w-md mx-auto">
          Start buying, selling, or valuing property today.
        </p>
        <button
          onClick={() => setPopupOpen(true)}
          className="bg-white text-[#0F1E3C] font-bold px-10 py-4 rounded-xl hover:bg-zinc-100 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl text-base"
        >
          Get started for free
        </button>
      </section>

      <LandingFooter />
    </div>
  );
}