"use client";
import LandingFooter from "@/components/layout/footers/landingFooter";

import { useEffect } from "react";
import Image from "next/image";

export default function AboutPage() {
    useEffect(() => {
        const counters = document.querySelectorAll<HTMLElement>(".counter");

        const animateCounter = (counter: HTMLElement) => {
            const target = +(counter.dataset.target || 0);
            let current = 0;
            const step = target / 60;

        const update = () => {
            current += step;

        if (current < target) {
            counter.innerText = Math.floor(current).toString();
            requestAnimationFrame(update);
        } else {
            counter.innerText = target.toString();
        }
    };

    update();
    };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
        if (entry.isIntersecting) {
        animateCounter(entry.target as HTMLElement);
        observer.unobserve(entry.target);
        }
    });
});

        counters.forEach((counter) => observer.observe(counter));

        return () => observer.disconnect();
        }, []);

    return (
    <div className=" mt-30 md:mt-0">

    {/* HERO */}
    <section className="relative overflow-hidden bg-[#0b1e4a] ">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1a6373]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2a0c0f]/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-24">

        <div>
            <Image
                src="/valtrust-isologo-white.png"
                alt="ValTrust Logo"
                width={250}
                height={250}
                className="object-contain"
                priority
            />
        </div>

        <div className="max-w-4xl">
            <span className="inline-block px-4 py-2 rounded-full bg-[#1a6373]/20 text-cyan-200 text-sm font-medium">
                About ValTrust
            </span>

            <h1 className="mt-8 text-5xl md:text-6xl font-bold text-white leading-tight">
                Bringing Trust and Transparency to Every Property Transaction
            </h1>

            <p className="mt-8 text-lg text-slate-300 leading-relaxed max-w-3xl">
                ValTrust helps buyers and sellers make informed decisions through
                fair property valuations, transparent information and a safer real
                estate experience.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
                <div className="bg-white/10 px-5 py-3 rounded-xl text-white">
                ✓ Verified Prices
                </div>
                <div className="bg-white/10 px-5 py-3 rounded-xl text-white">
                ✓ Trusted Valuations
            </div>
            <div className="bg-white/10 px-5 py-3 rounded-xl text-white">
                ✓ Secure Transactions
            </div>
            </div>
        </div>
        </div>
    </section>

    {/* ABOUT */}
    <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-[#0b1e4a]">
                Why ValTrust?
            </h2>

        <p className="mt-8 text-lg text-slate-600 leading-relaxed">
            We believe that buying and selling properties should be fair,
            transparent and secure. Our goal is to ensure that property prices
            reflect their true value so people can make decisions with
            confidence and avoid misleading information.
        </p>
        </div>
    </section>

    {/* MISSION VISION */}
    <section className="pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-8">

        <div className="bg-slate-50 p-10 rounded-3xl border">
            <h3 className="text-3xl font-bold text-[#0b1e4a]">
                Our Mission
            </h3>
            <p className="mt-5 text-slate-600">
                To provide reliable property valuations that promote fairness,
                transparency and security in every transaction.
            </p>
        </div>

        <div className="bg-slate-50 p-10 rounded-3xl border">
            <h3 className="text-3xl font-bold text-[#0b1e4a]">
                Our Vision
            </h3>
            <p className="mt-5 text-slate-600">
                To become a trusted platform recognized for innovation, accuracy
                and transparency in the real estate market.
            </p>
        </div>

        </div>
    </section>

    {/* STATS */}
    <section className="pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-6">

            <div className="bg-[#0b1e4a] text-white rounded-3xl p-8 text-center">
                <h3 className="text-5xl font-bold counter" data-target="16">
                    0
                </h3>
                <p className="mt-2">Team Members</p>
            </div>

            <div className="bg-[#1a6373] text-white rounded-3xl p-8 text-center">
                <h3 className="text-5xl font-bold counter" data-target="10">
                    0
                </h3>
                <p className="mt-2">Developers</p>
            </div>

            <div className="bg-[#1a6373] text-white rounded-3xl p-8 text-center">
                <h3 className="text-5xl font-bold counter" data-target="6">
                    0
                </h3>
            <p className="mt-2">Designers</p>
            </div>

            <div className="bg-[#2a0c0f] text-white rounded-3xl p-8 text-center">
                <h3 className="text-5xl font-bold counter" data-target="1">
                    0
                </h3>
            <p className="mt-2">Shared Purpose</p>
            </div>

        </div>
        </div>
    </section>

    {/* DEVELOPMENT TEAM */}
            <section className="pb-24 text-slate-800 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-4xl font-bold text-center text-[#0b1e4a]">
                    Development Team
                    </h2>

                <p className="text-center text-slate-500 mt-3">
                    Building the technology behind ValTrust.
                </p>

    <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-12">
            {[
                { name: "Aldo", image: "/aldo.jpeg" },
                { name: "Leonardo", image: "/leonardo.jpeg" },
                { name: "Josué", image: "/josue.jpeg" },
                { name: "José", image: "/jose.jpeg" },
                { name: "Rocío", image: "/rocio.jpeg" },
                { name: "Alan", image: "/alan.jpeg" },
                { name: "Gerar", image: "/gerar.jpeg" },
                { name: "Elías", image: "/elias.jpeg" },
                { name: "Willfredo", image: "/willfredo.jpeg" },
                { name: "Tatiana", image: "/tatiana.jpeg" },
            ].map((member) => (
            <div
                key={member.name}
                className="bg-white border rounded-3xl p-6 text-center shadow-sm"
            >
            <div className="w-24 h-24 mx-auto rounded-full overflow-hidden shadow-xl ring-4 ring-cyan-900">
                <Image
                    src={member.image}
                    alt={member.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
            />
        </div>
        <h3 className="mt-4 font-semibold">{member.name}</h3>
        <p className="text-sm text-slate-500">Developer</p>
    </div>
    ))}
    </div>
</div>
</section>

    {/* DESIGN TEAM */}
            <section className="pb-24   text-slate-800 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-4xl font-bold text-center text-[#0b1e4a]">
                    Design Team
                </h2>

                <p className="text-center text-slate-500 mt-3">
                    Creating intuitive and attractive experiences.
                </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {[
                { name: "Débora", image: "/debora.jpeg" },
                { name: "Ashly", image: "/ashly.jpeg" },
                { name: "Brayan", image: "/brayan.jpeg" },
                { name: "Madeline", image: "/madeline.jpg" },
                { name: "Briseyda", image: "/briseyda.jpeg" },
                { name: "Keyli", image: "/keyli.jpeg" },
            ].map((member) => (
            <div
                key={member.name}
                className="bg-white border rounded-3xl p-6 text-center shadow-sm"
            >
            <div className="w-24 h-24 mx-auto rounded-full overflow-hidden shadow-xl ring-4 ring-cyan-900">
                <Image
                    src={member.image}
                    alt={member.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                />
            </div>

            <h3 className="mt-4 font-semibold">{member.name}</h3>
            <p className="text-sm text-slate-500">Designer</p>
            </div>
        ))}
    </div>
    </div>
</section>
<LandingFooter/>
    </div>
    );
}