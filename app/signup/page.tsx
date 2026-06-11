"use client"
import { useAuth, useSignUp } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import LandingNav from "@/components/layout/navbars/landingnav";
import SellOrBuyPopup from "@/components/layout/selection-popup/Choose";

export default function SignUp(){
     const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();
 
  // ✅ Lee el rol desde la URL: /sign-up?role=buyer o /sign-up?role=seller
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");
  // Si no viene rol en la URL, manda de vuelta al inicio
  const role = roleParam === "seller" ? "seller" : "buyer";
 
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
   const [popupOpen, setPopupOpen] = useState(false);
 
  const isLoading = fetchStatus === "fetching";

   const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
 
    if (!email || !password) {
      setErrorMessage("Please complete the form");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage("Invalid Email");
      return;
    }
    setErrorMessage("");
   

     const { error } = await signUp.password({
      emailAddress: email.trim(),
      password,
      firstName,
      lastName,
      // ✅ El rol viene del query param y se guarda en unsafeMetadata de Clerk
      unsafeMetadata: { role, firstName, lastName },
    });
    
    

    if(error){
      setErrorMessage(error.message || "There was an error. Please try again");
      console.error(JSON.stringify(error, null, 2));
      return;
    }

     await signUp.verifications.sendEmailCode();
    setPendingVerification(true);
   }

   const handleVerify = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage("")
    console.log("email sent")

    if (code === "") {
      setErrorMessage("Please enter the verification code");
      return;
    }

    const { error } = await signUp.verifications.verifyEmailCode({ code });
    if (error) {
      setErrorMessage(error.message || "Invalid code, please try again");
      console.error(JSON.stringify(error, null, 2));
      return;
    }


    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: async () => {
          //Hace llamada a la api para subir datos a supabase
         

          // ✅ Redirige según el rol elegido
          router.push(role === "seller" ? "/seller/terms" : "/buyer/terms");
        },
      });
    } else {
      setErrorMessage("There was an error. Please try again");
      console.log("Status:", signUp.status);
    }
  };
 
  // Guard después de los handlers
  if (isSignedIn) {
    router.push(role === "seller" ? "/seller/terms" : "/buyer/terms");
    return null;
  }
   if (!roleParam) {
    router.push("/");
    return null;
  }
   

  return(
    <div className="relative min-h-screen overflow-hidden bg-white mt-20">
        <LandingNav onSignUpClick={() => setPopupOpen(true)} />
    <SellOrBuyPopup isOpen={popupOpen} onClose={() => setPopupOpen(false)} />
      <div className="absolute -bottom-28 -left-28 w-72 h-72 rounded-full bg-gradient-to-br from-[#2563eb] to-[#60a5fa] z-0" />
 
      <div className="relative z-10 min-h-screen flex flex-col md:flex-row w-full">
        {!pendingVerification && (
          <div className="w-full md:w-1/2 min-h-screen flex items-center justify-center px-6 sm:px-10 lg:px-24 py-10">
            <div className="w-full max-w-md -mt-10">
              <Image
                src={"/valtrust-isologo.png"}
                alt={"Valtrust Isologo"}
                height={200}
                width={200}
              />
 
              <div className="mb-8">
                <h2 className="text-4xl sm:text-5xl font-light text-black mb-2">
                  Sign Up
                </h2>
                <p className="text-gray-500">
                  {/* ✅ Muestra el rol elegido */}
                  Creating your account as a{" "}
                  <span className="font-semibold text-[#2f8fb6] capitalize">{role}</span>
                </p>
              </div>
 
              {errorMessage !== "" && (
                <div className="flex justify-center mb-4 rounded-md bg-red-50 px-4 py-2 text-sm text-red-600 text-center h-10 items-center">
                  <p className="w-7/8">{errorMessage}</p>
                  <X size={12} className="w-1/8 cursor-pointer" onClick={() => setErrorMessage("")} />
                </div>
              )}
 
              <form onSubmit={handleSubmit} className="space-y-4">
                <div id="clerk-captcha" />
 
                <input
                  value={firstName}
                  type="text"
                  placeholder="First Name"
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full h-11 px-4 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-[#4ea2ff] text-black"
                />
                <input
                  value={lastName}
                  type="text"
                  placeholder="Last Name"
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full h-11 px-4 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-[#4ea2ff] text-black"
                />
                <input
                  value={email}
                  type="email"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 px-4 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-[#4ea2ff] text-black"
                />
                <input
                  value={password}
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 px-4 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-[#4ea2ff] text-black"
                />
                <input
                  value={confirmPassword}
                  type="password"
                  placeholder="Confirm password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-11 px-4 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-[#4ea2ff] text-black"
                />
 
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 rounded-md bg-[#5aa8ff] hover:bg-[#4696ee] text-white font-semibold transition disabled:opacity-60"
                >
                  {isLoading ? "Creating account..." : "Sign Up"}
                </button>
              </form>
 
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-gray-300" />
                <span className="text-gray-400 text-sm">OR</span>
                <div className="flex-1 h-px bg-gray-300" />
              </div>
 
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?
                  <a href="/login" className="text-[#2f8fb6] font-semibold hover:underline ml-1">
                    Login
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}
 
        {pendingVerification && (
          <div className="relative z-10 min-h-screen flex flex-col md:flex-row w-full -mt-10">
            <div className="w-full md:w-1/2 min-h-screen flex-col flex items-center justify-center md:ml-[30%]">
              <Image
                src={"/valtrust-isologo.png"}
                alt={"Valtrust Isologo"}
                height={200}
                width={200}
              />
              <div className="mb-8">
                <h2 className="text-4xl sm:text-5xl font-light text-black mb-2">
                  Almost there
                </h2>
                <p className="text-gray-500">Let´s verify your account</p>
              </div>
 
              <form
                className="flex items-center justify-center gap-10 flex-col w-full max-w-sm"
                onSubmit={handleVerify}
                
              >
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter 6-digit code"
                  className="border-solid border-2 rounded-md w-full h-11 px-4 border border-gray-300 outline-none focus:ring-2 focus:ring-[#4ea2ff] text-black"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="text-white bg-[#5aa8ff] hover:bg-[#4696ee] p-2 w-1/2 rounded-lg disabled:opacity-60"
                >
                  {isLoading ? "Verifying..." : "Verify"}
                </button>
              </form>
 
              {errorMessage !== "" && (
                <div className="flex justify-center bg-red-200 border-solid border-2 border-red-400 text-black text-center rounded-md mt-3 mb-3 h-10 items-center text-sm">
                  <p className="w-7/8">{errorMessage}</p>
                  <X size={12} className="w-1/8 cursor-pointer" onClick={() => setErrorMessage("")} />
                </div>
              )}
            </div>
          </div>
        )}
 
        <div className="hidden md:flex md:w-1/2 h-screen items-center justify-center relative overflow-hidden">
          <div className="absolute -top-40 -right-28 w-[720px] h-[720px] rounded-full bg-gradient-to-br from-[#163d96] via-[#2458d4] to-[#3f95ff]" />
          <div className="absolute -bottom-28 -right-16 w-[320px] h-[320px] rounded-full bg-[#14337e]" />
          <div className="relative z-10 text-center text-white mb-10 ml-10">
            <Image
              src={"/valtrust-isologo-white.png"}
              alt={"Valtrust Isologo"}
              height={200}
              width={200}
            />
            <p className="text-4xl text-black">Welcome</p>
            <p className="text-xl lg:text-2xl text-black -mt-20 font-bold">
              Glad to have you here!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}