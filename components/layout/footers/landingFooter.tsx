
import Image from "next/image"
import { MapPin, Copyright} from "lucide-react";


export default function LandingFooter(){
    return (
      <>
        <section className="w-full h-screen md:h-90  flex-col justify-center items-center relative">
          <Image
            src={"/footer-image.png"}
            alt={"Footer Image"}
            fill
            className="object-cover hidden md:block"
          />
          <div className="absolute inset-0 bg-black/85"></div>

          <div className="w-full flex justify-start relative">
            <Image
              src={"/valtrust-isologo-white.png"}
              alt={"Logo"}
              width={150}
              height={150}
              className=""
            />
          </div>

          <div className="relative flex-col flex md:flex-row  w-full justify-center items-center gap-10">
            <div className="grid gap-2 w-1/2 md:w-4/8 justify-center">
              <div>
                <p>Smart property valuation platform.</p>
              </div>

              <div className="flex mt-10 gap-2 items-center ">
                <MapPin size={30} />
                <p>El Salvador</p>
              </div>
              <p>support@valtrust.com</p>
            </div>

            <div className="grid w-1/2 md:w-4/8 justify-start">
              <p>Home</p>
              <p>Properties</p>
              <p>About Us</p>
              <p>Premium</p>
            </div>

            <div className="grid  w-1/2 md:w-2/8 justify-start">
              <p>About Us</p>
              <p>Privacy Policy</p>
              <p>Terms of Service</p>
            </div>

            <div className="grid gap-5 w-1/2 md:w-2/8 justify-center text-white">
              <div className="flex items-center justify-center ">Follow Us</div>
              <div className="flex gap-10">
                <Image
                  src={"/instagram.svg"}
                  alt={"Instagram Logo"}
                  width={30}
                  height={30}
                  className="dark:invert"
                />
                <Image
                  src={"/facebook.svg"}
                  alt={"Instagram Logo"}
                  width={30}
                  height={30}
                  className="dark:invert"
                />
              </div>
            </div>
          </div>

          <div className="relative flex mt-8 w-full items-center justify-center gap-2">
            <Copyright size={20} /> 2026 Valtrust. All rights reserved
          </div>
        </section>
      </>
    );
}