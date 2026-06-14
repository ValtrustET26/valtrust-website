"use client";
import { useState } from "react";
import { TypeAnimation } from "react-type-animation";
import Image from "next/image";

const properties = [
  { id: 1,  name: "Lourdes Colón", price: "$40,000", phone: "7058-9898", verified: true,  liked: true,  bg: "bg-amber-100" },
  { id: 2,  name: "Ciudad Arce",   price: "$40,000", phone: "7140-5988", verified: false, liked: true,  bg: "bg-orange-100" },
  { id: 3,  name: "Santa Tecla",   price: "$40,000", phone: "6078-2120", verified: true,  liked: false, bg: "bg-sky-100" },
];

const areaProperties = [
  { id: 10, name: "San Juan Opico", price: "$45,000", phone: "4045-7678", verified: true,  liked: false, bg: "bg-green-100" },
  { id: 11, name: "San Juan Opico", price: "$40,000", phone: "9098-9768", verified: true,  liked: true,  bg: "bg-lime-100" },
  { id: 12, name: "San Juan Opico", price: "$50,000", phone: "7654-3765", verified: true,  liked: false, bg: "bg-emerald-100" },
  { id: 13, name: "San Juan Opico", price: "$30,000", phone: "2323-4570", verified: true,  liked: false, bg: "bg-teal-100" },
  { id: 14, name: "San Juan Opico", price: "$40,000", phone: "2277-7722", verified: true,  liked: true,  bg: "bg-cyan-100" },
  { id: 15, name: "San Juan Opico", price: "$60,000", phone: "6069-8789", verified: false, liked: false, bg: "bg-slate-100" },
];

const elsalvadorProperties = [
  { id: 20, name: "San Salvador", price: "$30,000", phone: "4040-468",  verified: false, liked: false, bg: "bg-rose-100" },
  { id: 21, name: "Santa Ana",    price: "$20,000", phone: "7031-9751", verified: true,  liked: true,  bg: "bg-amber-100" },
  { id: 22, name: "San Miguel",   price: "$20,000", phone: "6078-7987", verified: true,  liked: false, bg: "bg-sky-100" },
];

const departments    = ["San Salvador", "La Libertad", "Santa Ana", "Sonsonate"];
const municipalities = ["Santa Tecla", "Antiguo Cuscatlán", "Mejicanos", "Soyapango"];
const zones          = ["Zona Rosa", "Escalón", "San Benito", "Merliot"];

export default function LandingBuyer() {
  const [search,       setSearch]       = useState("");
  const [department,   setDepartment]   = useState("");
  const [municipality, setMunicipality] = useState("");
  const [zone,         setZone]         = useState("");
  const [likes, setLikes] = useState<Record<number, boolean>>(
    Object.fromEntries(
      [...properties, ...areaProperties, ...elsalvadorProperties].map((p) => [p.id, p.liked])
    )
  );
  
  const [showForm, setShowForm]       = useState(false);
  const [rating, setRating]           = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewName, setReviewName]   = useState("");
  const [reviewText, setReviewText]   = useState("");
  const [submitted, setSubmitted]     = useState(false);
  const [reviews, setReviews] = useState([
    { id: 1, name: "Maria Martinez",    text: "Finding a home felt overwhelming at first, but this platform made the entire experience much easier...", rating: 5 },
    { id: 2, name: "Marizta Rodriguez", text: "Easy to use, professional, and full of great properties. I found my dream home in just a few days.", rating: 5 },
    { id: 3, name: "Roxana Sermeño",    text: "Excellent experience. The platform help me to discover the perfect house for my family.", rating: 5 },
  ]);

  const handleSubmitReview = () => {
    if (!reviewName.trim() || !reviewText.trim() || rating === 0) return;
    setReviews((prev) => [
      ...prev,
      { id: Date.now(), name: reviewName, text: reviewText, rating },
    ]);
    setReviewName("");
    setReviewText("");
    setRating(0);
    setShowForm(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const toggleLike = (id: number) =>
    setLikes((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="min-h-screen bg-gray-50 font-sans mt-20">

      <div
        className="relative w-full h-[75vh] overflow-hidden"
        style={{
          backgroundImage: "url('/landing/landing-image.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
      
        <div className="absolute inset-0 bg-black/30" />

      
        <div className="relative z-10 flex flex-col justify-center py-55  px-8 md:py-20 max-w-xl">
          
        
           <TypeAnimation
              sequence={[
                "Find Your Dream",
                100,
                "Find Your Dream Land With",
                100,
                "Find Your Dream Land With Valtrust",
              ]}
              wrapper="h1"
              speed={50}
              repeat={0}
              cursor={false}
              className="text-white font-bold leading-tight text-5xl sm:text-6xl md:text-7xl"
            />
        </div>

        
        <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-6 flex flex-col items-center">

        
          <div className="flex gap-3 mb-3">
            {[
              { label: "Department",         value: department,   setter: setDepartment,   options: departments },
              { label: "Municipality",        value: municipality, setter: setMunicipality, options: municipalities },
              { label: "Zone / Neighborhood", value: zone,         setter: setZone,         options: zones },
            ].map(({ label, value, setter, options }) => (
              <div key={label} className="relative">
                <select
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  className="appearance-none bg-white/90 backdrop-blur text-gray-700 text-sm font-medium pl-4 pr-8 py-2 rounded-full shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">{label}</option>
                  {options.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">▼</span>
              </div>
            ))}
          </div>

          
          <div className="flex items-center bg-white rounded-full shadow-lg px-5 py-3 w-full max-w-2xl">
            <svg className="w-5 h-5 text-gray-400 mr-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Find your dream property"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-gray-700 text-sm outline-none placeholder-gray-400"
            />
          </div>
        </div>

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {[0, 1, 2].map((i) => (
            <span key={i} className={`w-2 h-2 rounded-full ${i === 0 ? "bg-white" : "bg-white/40"}`} />
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <h2 className="text-xl font-bold text-gray-800 mb-5">Top properties</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {properties.map((prop) => (
            <div
              key={prop.id}
              className="bg-white rounded-2xl shadow hover:shadow-md transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              <div className={`relative w-full h-40 ${prop.bg} flex items-center justify-center`}>
                <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                  <path d="M3 9.5L12 3l9 6.5V21H3V9.5z" />
                  <rect x="9" y="13" width="6" height="8" />
                </svg>
                <button
                  onClick={() => toggleLike(prop.id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center"
                >
                  <svg className={`w-4 h-4 transition-colors ${likes[prop.id] ? "fill-red-500 text-red-500" : "fill-none text-gray-400"}`} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <p className="font-semibold text-gray-800 text-sm">{prop.name}</p>
                <p className="text-gray-700 font-bold text-sm mt-0.5">{prop.price}</p>
                <p className="text-gray-400 text-xs mt-0.5">{prop.phone}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1">
                    {prop.verified ? (
                      <>
                        <svg className="w-4 h-4 text-blue-500 fill-blue-500" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.707-9.293a1 1 0 0 0-1.414-1.414L9 10.586 7.707 9.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-blue-500 text-xs font-medium">Verified</span>
                      </>
                    ) : (
                      <span className="text-gray-400 text-xs">Unverified</span>
                    )}
                  </div>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full transition-colors">
                    More...
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-4">
          <button className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      
      <div className="max-w-5xl mx-auto px-6 py-8">
        <h2 className="text-xl font-bold text-gray-800 mb-5">Properties in Your Area</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {areaProperties.map((prop) => (
            <div
              key={prop.id}
              className="bg-white rounded-2xl shadow hover:shadow-md transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              <div className={`relative w-full h-40 ${prop.bg} flex items-center justify-center`}>
                <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                  <path d="M3 9.5L12 3l9 6.5V21H3V9.5z" />
                  <rect x="9" y="13" width="6" height="8" />
                </svg>
                <button
                  onClick={() => toggleLike(prop.id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center"
                >
                  <svg className={`w-4 h-4 transition-colors ${likes[prop.id] ? "fill-red-500 text-red-500" : "fill-none text-gray-400"}`} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <p className="font-semibold text-gray-800 text-sm">{prop.name}</p>
                <p className="text-gray-700 font-bold text-sm mt-0.5">{prop.price}</p>
                <p className="text-gray-400 text-xs mt-0.5">{prop.phone}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1">
                    {prop.verified ? (
                      <>
                        <svg className="w-4 h-4 text-blue-500 fill-blue-500" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.707-9.293a1 1 0 0 0-1.414-1.414L9 10.586 7.707 9.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-blue-500 text-xs font-medium">Verified</span>
                      </>
                    ) : (
                      <span className="text-gray-400 text-xs">Unverified</span>
                    )}
                  </div>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full transition-colors">
                    More...
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


      <div className="max-w-5xl mx-auto px-6 py-8">
        <h2 className="text-xl font-bold text-gray-800 mb-5">Real Estate in El Salvador</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {elsalvadorProperties.map((prop) => (
            <div
              key={prop.id}
              className="bg-white rounded-2xl shadow hover:shadow-md transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              <div className={`relative w-full h-40 ${prop.bg} flex items-center justify-center`}>
                <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                  <path d="M3 9.5L12 3l9 6.5V21H3V9.5z" />
                  <rect x="9" y="13" width="6" height="8" />
                </svg>
                <button
                  onClick={() => toggleLike(prop.id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center"
                >
                  <svg className={`w-4 h-4 transition-colors ${likes[prop.id] ? "fill-red-500 text-red-500" : "fill-none text-gray-400"}`} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <p className="font-semibold text-gray-800 text-sm">{prop.name}</p>
                <p className="text-gray-700 font-bold text-sm mt-0.5">{prop.price}</p>
                <p className="text-gray-400 text-xs mt-0.5">{prop.phone}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1">
                    {prop.verified ? (
                      <>
                        <svg className="w-4 h-4 text-blue-500 fill-blue-500" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.707-9.293a1 1 0 0 0-1.414-1.414L9 10.586 7.707 9.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-blue-500 text-xs font-medium">Verified</span>
                      </>
                    ) : (
                      <span className="text-gray-400 text-xs">Unverified</span>
                    )}
                  </div>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full transition-colors">
                    More...
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>




        
      </div>
    
<div className="max-w-5xl mx-auto px-6 py-8">

  
  <h2 className="text-xl font-bold text-gray-800">Buyer Reviews</h2>
  <p className="text-sm text-gray-500 mb-6">Experiences From Our Clients</p>

  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">

  
    {reviews[0] && (
      <div className="border border-gray-200 rounded-2xl p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-800">{reviews[0].name}</span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{reviews[0].text}</p>
        </div>
        <div className="flex gap-1 mt-4">
          {Array.from({ length: reviews[0].rating }).map((_, i) => (
            <svg key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          ))}
        </div>
      </div>
    )}

    
    <div className="flex flex-col gap-5">
      {reviews.slice(1).map((review) => (
        <div key={review.id} className="border border-gray-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-800">{review.name}</span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{review.text}</p>
          <div className="flex gap-1 mt-3">
            {Array.from({ length: review.rating }).map((_, i) => (
              <svg key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>

  
  <h3 className="text-lg font-bold text-gray-800">Share your experience</h3>
  <p className="text-sm text-gray-500 mb-4">Your feedback help us to maintain our standards of excellence</p>

  
  {submitted && (
    <div className="mb-4 px-4 py-3 bg-green-100 text-green-700 rounded-xl text-sm font-medium">
       Your review was submitted successfully!
    </div>
  )}

  
  {!showForm && (
    <button
      onClick={() => setShowForm(true)}
      className="border border-gray-300 text-gray-700 text-sm font-medium px-5 py-2 rounded-lg hover:bg-gray-50 transition mb-6"
    >
      Leave Review
    </button>
  )}

  
  {showForm && (
    <div className="border border-gray-200 rounded-2xl p-6 mt-4">

  
      <p className="text-sm font-semibold text-gray-700 mb-2">Overall Rating</p>
      <div className="flex gap-1 mb-5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
          >
            <svg
              className={`w-7 h-7 transition-colors ${
                star <= (hoverRating || rating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
              }`}
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </button>
        ))}
      </div>

      
      <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
      <input
        type="text"
        placeholder="e.g. Marisol Elena Martinez Guevara"
        value={reviewName}
        onChange={(e) => setReviewName(e.target.value)}
        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-400 mb-4"
      />

      
      <label className="block text-sm font-semibold text-gray-700 mb-1">Your Review</label>
      <textarea
        placeholder="Share your experience with our services..."
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        rows={5}
        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-400 mb-5 resize-none"
      />

      
      <button
        onClick={handleSubmitReview}
        className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 rounded-xl transition-colors"
      >
        Submit Review
      </button>
    </div>
  )}
</div>
    </div>
    
  );
  
}