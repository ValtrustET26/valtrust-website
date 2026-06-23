"use client"
import NewProperty from "@/components/layout/seller/newproperties"
import NewLand from "@/components/layout/seller/newland"
import ReviewCard from "@/components/layout/seller/reviewcard"
import ReviewForm from "@/components/layout/seller/leavereview"
import { TypeAnimation } from "react-type-animation";
import Image from "next/image"
import { useState, useEffect } from "react";
type Review = {
  id: string;
  firstName: string;
  lastName: string;
  comment: string;
  rating: number;
};


export default function HomeSeller({ listings }: { listings: React.ReactNode }) {

    const [reviews, setReviews] = useState<Review[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const load = async () => {
    try {
      const res = await fetch("/api/get-comments");
      const data = await res.json();

      setReviews(data.comments || []);
    } catch (err) {
      console.error("Error loading comments:", err);
    } finally {
      setLoading(false);
    }
  };

  load();
}, []);
    return (
        <div className="min-h-screen bg-[#fafaf9]">


            <section className="relative w-full h-[70vh]  md:h-screen overflow-hidden z-1">
                <Image
                    src="/landing/landing-image.png"
                    priority
                    className="object-cover"
                    alt="landing-image"
                    fill
                />
                {/*
          <video
    autoPlay
    loop
    muted

    playsInline
    className="object-fit object-cover  inset-0 w-full h-full"
  >
    <source src="/videos/seller-hero.mp4" type="video/mp4" />
  </video>
  */}

                <div className="absolute inset-0 flex items-center pt-20 md:pt-0r overflow-hidden">
                    <div className="px-6 md:px-16 max-w-3xl">
                        <TypeAnimation
                            sequence={[
                                "Find Your Dream",
                                200,
                                "Find Your Dream Land With",
                                200,
                                "Find Your Dream Land With Valtrust",
                            ]}
                            wrapper="div"
                            cursor={false}
                            speed={50}
                            repeat={0}
                            className="text-white font-bold leading-tight text-5xl sm:text-6xl md:text-7xl"
                        />
                    </div>
                </div>

            </section>

            <section className=" mx-auto max-w-6xl px-4 py-10 md:px-8 mt-15 md:mt-20">
                <NewProperty />
                <NewLand />
            </section>

            {/* LISTINGS */}
            <section className="mx-auto mb-16 max-w-5xl">

                <h2 className=" mx-auto mb-6 text-2xl font-semibold text-[#171717]">
                    Explore other seller's listings
                </h2>

                {listings}
            </section>

            {/* REVIEWS */}
            <section className="mx-auto max-w-5xl p-5">
                <h2 className="text-3xl font-bold text-[#0B1E4A]">
                    Sellers Reviews
                </h2>
                <p className=" mx-automb-8 text-base text-gray-600">
                    Experiences From Our Clients
                </p>
                <div className="grid items-start gap-5 lg:grid-cols-2">
                    {/*Review section*/}
                   {loading ? (
  <p>Loading reviews...</p>
) : (
  <div className="grid items-start gap-5 lg:grid-cols-2">
    {reviews[0] && (
      <ReviewCard
        name={`${reviews[0].firstName} ${reviews[0].lastName}`}
        review={reviews[0].comment}
        rating={reviews[0].rating}
      />
    )}

    <div className="flex flex-col gap-6">
      {reviews.slice(1).map((review) => (
        <ReviewCard
          key={review.id}
          name={`${review.firstName} ${review.lastName}`}
          review={review.comment}
          rating={review.rating}
        />
      ))}
    </div>
  </div>
)}
                    
                </div>
            </section>
            <ReviewForm />
        </div>
    )
}
