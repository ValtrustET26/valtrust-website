export default function NewLand(){
    return (
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-12 shadow-sm">
          <h2 className="mb-10 text-xl font-semibold text-[#171717]">
            Add a new land
          </h2>
          <div className="mb-10 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 px-6 py-16 text-center">
            <div className="mb-6 h-20 w-20 rounded-xl bg-gray-300" />
            <h3 className="mb-2 text-xl font-semibold text-[#171717]">
              You can upload your properties
            </h3>
            <p className="mb-6 text-sm text-gray-500">
              Upload your land or house to start selling
            </p>
             <button className="rounded-md bg-[#1E5EDB] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90">
              Add Property
            </button>
            <p className="mt-4 text-xs text-gray-400">
              or drag and drop your images here
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex items-start gap-4 rounded-xl bg-[#fafaf9] p-4">
              <div className="h-14 w-14 rounded-full bg-[#1E5EDB]" />
              <div>
                <h4 className="mb-1 text-sm font-semibold text-[#171717]">
                  Upload Property
                </h4>
                <p className="text-xs leading-relaxed text-gray-500">
                  Add pictures and basic details of your property.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl bg-[#fafaf9] p-4">
              <div className="h-14 w-14 rounded-full bg-[#1E5EDB]" />
              <div>
                <h4 className="mb-1 text-sm font-semibold text-[#171717]">
                  Verification
                </h4>
                <p className="text-xs leading-relaxed text-gray-500">
                  Your land will pass a process review for publication.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl bg-[#fafaf9] p-4">
              <div className="h-14 w-14 rounded-full bg-[#1E5EDB]" />
              <div>
                <h4 className="mb-1 text-sm font-semibold text-[#171717]">
                  Published
                </h4>
                <p className="text-xs leading-relaxed text-gray-500">
                  Your property will be visible and available.
                </p>
              </div>
            </div>
          </div>
        </div>
    )
}