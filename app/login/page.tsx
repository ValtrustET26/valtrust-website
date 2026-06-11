"use client"
import Image from "next/image";
import { useSignIn, useAuth, useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LandingNav from "@/components/layout/navbars/landingnav";
import SellOrBuyPopup from "@/components/layout/selection-popup/Choose";

export default function Login() {
  const { signIn, errors, fetchStatus, } = useSignIn();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const {  isLoaded, user} = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showClientTrust, setShowClientTrust] = useState(false);
  const [trustCode, setTrustCode] = useState("");
  const role = (user?.unsafeMetadata as { role?: string })?.role;
   const [popupOpen, setPopupOpen] = useState(false);

   const isLoading = fetchStatus === "fetching";

   const HandleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) =>{
    e.preventDefault();
       
    setErrorMessage("")

    if (!signIn) {
      console.log("signIn is undefined");
      return;
    }
    if (!email || !password) {
      setErrorMessage("Please complete the form");
      return;
    }


    try {
         const { error } = await signIn.password({
      emailAddress: email.trim(),
      password,
    })
    
    
    if (error) {
 setErrorMessage(error.message);
      console.error(JSON.stringify(error, null, 2))
      return
    }
    if(signIn.status === "complete") {
      await signIn.finalize();
    }
    useEffect(() => {
  if (!isLoaded || !user) return;

  const role = (user.unsafeMetadata as { role?: string }).role;

  router.replace(role === "seller" ? "/seller" : "/buyer");
}, [isLoaded, user]);
   

     if (signIn.status === "needs_client_trust") {
        await signIn.emailCode.sendCode();
        setShowClientTrust(true);
      } else if (signIn.status === "needs_second_factor") {
        await signIn.emailCode.sendCode();
        setShowClientTrust(true);
      } 
    } catch (error) {
        console.log(error)
    }
   }




   const HandleVerify = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("")
    

      if (!signIn) return;

    
  try {
    const { error } = await signIn.emailCode.verifyCode({ code: trustCode });
console.log("VERIFY ERROR");
  console.log(JSON.stringify(error, null, 2));
  console.log("STATUS:", signIn.status);
      if (error) {
 setErrorMessage(error.message);
      console.error(JSON.stringify(error, null, 2))
      return
    }
      
    if (signIn.status === "complete") {
        
        await signIn.finalize();
      
      } 
  } catch (err : any) {
    setErrorMessage(err.message);
      console.error(JSON.stringify(err, null, 2))
      return
  }


  

   }

useEffect(() => {
  if (!isLoaded || !user) return;

  const role = (user.unsafeMetadata as { role?: string }).role;

  router.replace(role === "seller" ? "/seller" : "/buyer");
}, [isLoaded, user]);
  
    

  // --- UI principal de login ---
  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
           <LandingNav onSignUpClick={() => setPopupOpen(true)} />
    <SellOrBuyPopup isOpen={popupOpen} onClose={() => setPopupOpen(false)} />

      <div className="absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-gradient-to-br from-blue-600 to-blue-400" />

      <div className="relative z-10 flex min-h-screen flex-col md:flex-row">
         {!showClientTrust && 
        <section className="flex w-full items-center justify-center px-6 py-10 md:w-1/2 lg:px-24">
          <div className="w-full max-w-md">
            <Image
              src={"/LogosValtrust/valtrust-isologo.png"}
              alt={"Valtrust Isologo"}
              height={200}
              width={200}
            />

            <div className="mb-8">
              <h2 className="text-4xl font-light text-black sm:text-5xl">
                Welcome Back
              </h2>
            </div>

            {errorMessage && (
              <p className="mb-4 rounded-md bg-red-50 px-4 py-2 text-sm text-red-600">
             {errorMessage}
              </p>
            )}

          
            <form onSubmit={HandleSubmit} className="space-y-4" >
              <div>
                <label className="mb-2 block text-sm text-gray-600">
                  Email or username
                </label>
                <input
                  type="text"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 w-full rounded-md border border-gray-300 px-4 text-black outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-600">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 w-full rounded-md border border-gray-300 px-4 text-black outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
                <label className="flex items-center text-gray-500">
                  <input type="checkbox" className="mr-2" />
                  Remember me
                </label>
                <a href="#" className="text-[#2f8fb6] hover:underline">
                  Forgot your password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="h-11 w-full rounded-md bg-blue-400 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60"
              >
                {isLoading ? "Logging in..." : "LOGIN"}
              </button>
            </form>

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-300" />
              <span className="text-sm text-gray-400">OR</span>
              <div className="h-px flex-1 bg-gray-300" />
            </div>

            <div className="space-y-3">
              <button
                
                disabled={isLoading}
                className="flex h-11 w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white transition hover:bg-gray-50 disabled:opacity-60"
              >
                <span className="text-sm font-medium text-gray-800">
                  LOGIN WITH GOOGLE
                </span>
              </button>

              <button
                
                disabled={isLoading}
                className="flex h-11 w-full items-center justify-center gap-3 rounded-md bg-[#252d8d] text-white transition hover:bg-[#1d2370] disabled:opacity-60"
              >
                <span className="text-lg font-bold">f</span>
                <span className="text-sm font-medium">LOGIN WITH FACEBOOK</span>
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?
                <button
                  onClick={() => setPopupOpen(true)}
                  className="ml-1 font-semibold text-[#2f8fb6] hover:underline"
                  
                >
                  Register here
                </button>
              </p>
            </div>
          </div>
        </section>
  }
        {showClientTrust && (
      <div className="relative min-h-screen overflow-hidden bg-white flex md:w-1/2  items-center justify-center">
        <div className="absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-gradient-to-br from-blue-600 to-blue-400" />
        <div className="relative z-10 w-full max-w-md px-6">
          <Image
            src={"/LogosValtrust/valtrust-isologo.png"}
            alt={"Valtrust Isologo"}
            height={200}
            width={200}
          />
          <h2 className="mb-2 text-3xl font-light text-black">
            Verify your device
          </h2>
          <p className="mb-6 text-sm text-gray-500">
            We sent a verification code to <strong>{email}</strong>. Enter it
            below to continue.
          </p>

          {errorMessage && (
            <p className="mb-4 rounded-md bg-red-50 px-4 py-2 text-sm text-red-600">
              {errorMessage}
            </p>
          )}

          <form onSubmit={HandleVerify} className="space-y-4">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="Verification code"
              value={trustCode}
              onChange={(e) => setTrustCode(e.target.value.replace(/\D/g, ""))}
              className="h-11 w-full rounded-md border border-gray-300 px-4 text-black outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="h-11 w-full rounded-md bg-blue-400 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60"
            >
              {isLoading ? "Verifying..." : "VERIFY DEVICE"}
            </button>
          </form>
        </div>
      </div>
    )};
  

        <section className="relative hidden h-screen  md:flex md:w-1/2 items-center justify-center">
          <div className="absolute -right-28 -top-40 h-[720px] w-[720px] rounded-full bg-gradient-to-br from-[#163d96] via-[#2458d4] to-[#3f95ff]" />
          <div className="absolute -bottom-20 -right-16 h-[320px] w-[320px] rounded-full bg-[#14337e]" />
          <div className="relative z-10 text-center text-white mb-10 ml-10">
            <Image
              src={"/LogosValtrust/valtrust-isologo-white.png"}
              alt={"Valtrust Isologo"}
              height={200}
              width={200}
            />
            <p className="text-2xl text-black font-bold -mt-10">
              Glad to have you here!
            </p>
          </div>
        </section>
      </div>
    </div>
  )}
