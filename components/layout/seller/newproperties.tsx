export default function NewProperty(){
    return(
        <div className="mb-14">
          <h2 className="mb-6 text-xl font-semibold text-[#171717]">
            My properties
          </h2>
           <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="h-[180px] w-full rounded-lg bg-gray-300 md:w-[280px]" />
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-[#1A6373]" />
 
                    <span className="text-sm font-medium text-[#1A6373]">
                      Verified
                    </span>
                  </div>
                  <p className="mb-5 text-sm leading-relaxed text-gray-700">
                    This house is located in Santa Ana in an urban area.
                    It has a modern design, three rooms, a living room,
                    kitchen, and bedrooms, and is close to shops and public services.
                  </p>
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Price</p>
                    <h3 className="text-2xl font-bold text-[#0B1E4A]">
                      $20,000
                    </h3>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p>6708-0077</p>
                  <p>@luisrodriguez@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
    )
}