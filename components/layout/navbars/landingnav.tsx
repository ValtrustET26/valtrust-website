"use client";
import Image from "next/image";
import { Menu, X, House, SwatchBook, Gem } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Router } from "next/router";



export default function LandingNav() {
  const [open, setOpen] = useState(false);
  return (
    <nav className=" fixed top-0 left-0 bg-wh-main text-sm text-black w-full min-height z-50 fixed backdrop-blur-md">
      <div className="flex items-center h-20">
        <div className="mt-3 w-1/3s items-center justify-between">
        <Link href={"/"} className="mt-3 w-1/3  items-center justify-between">
          <Image
            src={"/valtrust-isologo.png"}
            alt="Logo Image"
            width={125}
            height={125}
           
          />
          </Link>
        </div>

        <div className="md:block hidden w-2/3 md:text-md ">
          <ul className="flex justify-end items-center gap-10">
            <li className="hover:bg-zinc-300 p-3 rounded-4xl w-2/9 flex justify-center ">
            <Link href={"/"}>
              Home
              </Link>
            </li>
            <li className="hover:bg-zinc-300 p-3 rounded-4xl w-2/9 flex justify-center ">
             <Link href={"/aboutUs"}>
              About Us
              </Link>
            </li>
            <li className="hover:bg-zinc-300 p-3 rounded-4xl w-2/9 flex justify-center">
               <Link href={"/premium"}>
              Premium
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col w-full justify-end md:hidden ">
          <button
            className="text-3xl md:hidden w-full justify-end items-center p-5 flex items-center flex-3z-50 z-20"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <X size={35} className="opacity-100 scale-100 translate-y-0" />
            ) : (
              <Menu
                size={35}
                className="scale-95 pointer-events-none"
              />
            )}
          </button>
        </div>

        <div className="flex justify-center md:flex hidden font-bold items-center w-1/3 gap-5 text-md">
          <button className="w-1/3 bg-bl-main p-3 rounded-lg text-white">
           <Link href={"/signup"}>

          Sign Up
          </Link>
          </button>
          <button className="w-1/3 bg-zinc-200 p-3 rounded-lg"><Link href={"/login"}>
          Sign In
          </Link></button>
        </div>
      </div>

      {open && (
        <div className=" flex text-black flex-col md:hidden w-50 p-10 fixed bg-wh-main items-center top-5 right-4 gap-20 text-xl z-10 rounded-lg shadow-lg shadow-5xl border-white">
          <div className="flex flex-col items-center text-left ">
            
            <div className="w-full  ">
              <Link href={"/"} className="flex gap-2 justify-center items-center">
              <House size={30} />
              <h3 className="w-full flex flex-col">Home</h3>
              </Link>
              
            </div>
            
            <div className="w-full ">
              <Link href={"aboutUs"} className="flex gap-2 justify-center items-center">
              <SwatchBook size={30} />
              <h3 className="w-full flex flex-col">About Us</h3>
              </Link>
            </div>
            
            <div className="w-full flex gap-2 justify-center items-center">
              <Link href={"premium"} className="flex gap-2 justify-center items-center">
 
              <Gem size={30} />
              <h3 className="w-full flex flex-col">Premium</h3>
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="flex md:hidden w-full items-center justify-center p-3 gap-5 text-lg md:text-sm">
        <button className="p-5 bg-zinc-200 w-1/3 rounded-lg font-bold">
        <Link href={"/login"}>
          Sign In
          </Link>
        </button>
        <button className="p-5 bg-bl-main  w-1/3 rounded-lg text-white font-bold">
        <Link href={"/signup"}>

          Sign Up
          </Link>
        </button>
      </div>
    </nav>
  );
}