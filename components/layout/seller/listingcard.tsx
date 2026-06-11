interface listingcard{
  title: string;
  price: string;
  phone: string;
  verified: boolean;
}

export default function ListingCardPro({
  title,
  price,
  phone,
  verified,
}: listingcard) {
  return (
    <div className="min-w-[250px] rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
      
      {/* Image Placeholder */}
      <div className="relative mb-4">
  
  {/* Image Placeholder */}
  <div className="h-[140px] w-full rounded-lg bg-gray-300" />

  {/* Heart Button */}
  <button className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-105">
    ❤️
  </button>
</div>

      {/* Content */}
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-[#171717]">
          {title}
        </h3>

        <p className="text-sm text-gray-700">
          {price}
        </p>

        <p className="text-sm text-gray-500">
          {phone}
        </p>

        <div className="flex items-center gap-2">
  
  {/* Icon Placeholder */}
  <div className="h-4 w-4 rounded-full bg-gray-300" />

  <p
    className={`text-sm font-medium ${
      verified ? "text-[#1A6373]" : "text-gray-500"
    }`}
  >
    {verified ? "Verified" : "Unverified"}
  </p>
</div>
      </div>

      {/* Button */}
      <div className="mt-4 flex justify-end">
        <button className="rounded-md bg-[#1E5EDB] px-4 py-1 text-xs font-medium text-white transition hover:opacity-90">
          More...
        </button>
      </div>
    </div>
  );
}