"use client"
import LandingFooter from "@/components/layout/footers/landingFooter";
import LandingNav from "@/components/layout/navbars/landingnav";
import { TypeAnimation } from "react-type-animation";
import { useState } from "react";
import SellOrBuyPopup from "@/components/layout/selection-popup/Choose";

export default function Premium() {
   const [popupOpen, setPopupOpen] = useState(false);
  return (
<main className="min-h-screen bg-black text-white overflow-hidden md:mt-20 mt-42">
 
   <LandingNav onSignUpClick={() => setPopupOpen(true)} />
    <SellOrBuyPopup isOpen={popupOpen} onClose={() => setPopupOpen(false)} />
<section className="relative">
 
<div className="absolute inset-0 bg-gradient-to-r from-black via-blue-950 to-black" />
 
<div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6">
 
<div className="max-w-5xl text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mt-20">
           <TypeAnimation
              sequence={[
                " Unlock the full potential of your property",
                100,
              ]}
              wrapper="h1"
              cursor={true}
              speed={30}
              repeat={0}
              className="text-white font-bold leading-tight text-5xl sm:text-6xl md:text-7xl"
            />
</div>
 
<p className="mt-8 max-w-2xl text-lg md:text-xl text-gray-300">
            Get deeper insights and smarter tools to make better
            property decisions.
</p>
 
<div className="mt-40">
<h2 className="text-4xl md:text-5xl font-extrabold">
              We provide the best{" "}
<span className="text-cyan-700">
                services
</span>
</h2>
</div>
 
 
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20 w-full max-w-7xl">
 
<div className="bg-blue-950 border-t-4 border-white rounded-2xl p-8 shadow-2xl hover:scale-105 transition duration-300">
<h3 className="text-xl font-bold">
                Advanced Valuation
</h3>
 
              <p className="mt-5 text-gray-300 leading-relaxed">
                More accurate price estimates using deeper
                data analysis.
</p>
</div>
 
 
<div className="bg-blue-950 border-t-4 border-cyan-700 rounded-2xl p-8 shadow-2xl hover:scale-105 transition duration-300">
<h3 className="text-xl font-bold">
                Market Insights
</h3>
 
              <p className="mt-5 text-gray-300 leading-relaxed">
                See trends and compare property values
                by area.
</p>
</div>
 
 
<div className="bg-blue-950 border-t-4 border-white rounded-2xl p-8 shadow-2xl hover:scale-105 transition duration-300">
<h3 className="text-xl font-bold">
                Priority Verification
</h3>
 
              <p className="mt-5 text-gray-300 leading-relaxed">
                Faster and more secure account validation.
</p>
</div>
 
 
<div className="bg-blue-950 border-t-4 border-cyan-700 rounded-2xl p-8 shadow-2xl hover:scale-105 transition duration-300">
<h3 className="text-xl font-bold">
                Smart Recommendations
</h3>
 
              <p className="mt-5 text-gray-300 leading-relaxed">
                Get suggestions to improve pricing
                and selling.
</p>
</div>
</div>
 
 
<section className="w-full max-w-5xl mt-40 pb-32">
 
<div className="text-center">
<h2 className="text-4xl md:text-5xl font-extrabold">
                Find the Right Plan for You
</h2>
 
              <p className="mt-4 text-gray-400">
                From free tools to premium features.
</p>
</div>
 
<div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-20">
 
<div className="bg-blue-950 border border-blue-900 rounded-3xl p-10 shadow-2xl hover:scale-105 transition duration-300">
 
                <div className="flex items-center justify-between">
<h3 className="text-3xl font-bold">
                    Free plan
</h3>
 
                  <div className="w-6 h-6 rounded-full border border-cyan-700" />
</div>
 
                <ul className="mt-10 space-y-4 text-gray-300 text-left">
<li>• Basic valuation</li>
<li>• Limited property listings</li>
<li>• Standard access</li>
</ul>
 
                <button className="w-full mt-12 bg-cyan-700 hover:bg-cyan-600 transition duration-300 py-4 rounded-xl font-bold">
                  Continue
</button>
</div>
 
 
<div className="bg-blue-950 border border-blue-900 rounded-3xl p-10 shadow-2xl hover:scale-105 transition duration-300">
 
                <div className="flex items-center justify-between">
<h3 className="text-3xl font-bold">
                    Monthly
</h3>
 
                  <div className="w-6 h-6 rounded-full border border-cyan-700" />
</div>
 
                <div className="mt-10 flex items-end gap-2">
<span className="text-5xl font-extrabold">
                    $12.99
</span>
 
                  <span className="text-gray-400 mb-2">
                    / month
</span>
</div>
 
                <p className="mt-4 text-gray-400 text-left">
                  Renews automatically unless canceled
</p>
 
                <button className="w-full mt-12 bg-cyan-700 hover:bg-cyan-600 transition duration-300 py-4 rounded-xl font-bold">
                  Continue
</button>
</div>
</div>
</section>
</div>
</section>

<LandingFooter/>
</main>
  );
}