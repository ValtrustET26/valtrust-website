"use client";

import { useRef } from "react";
import ListingCard from "./listingcard";

export default function ListingCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative p-5">
      
      {/* Cards */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scroll-smooth pb-4"
      >
        <ListingCard
          title="Lourdes Colón"
          price="$40,000"
          phone="7058-9698"
          verified={true}
        />

        <ListingCard
          title="Ciudad Arce"
          price="$40,000"
          phone="7140-5988"
          verified={false}
        />

        <ListingCard
          title="Santa Tecla"
          price="$40,000"
          phone="6078-2120"
          verified={true}
        />

        <ListingCard
          title="Soyapango"
          price="$40,000"
          phone="6078-2120"
          verified={true}
        />
         <ListingCard
          title="Chanmico"
          price="$40,000"
          phone="6078-2120"
          verified={true}
        />
      </div>

     
      <button
        onClick={scrollRight}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white p-3 shadow-md w-12 transition text-black hover:bg-gray-100"
      >
        →
      </button>
    </div>
  );
}