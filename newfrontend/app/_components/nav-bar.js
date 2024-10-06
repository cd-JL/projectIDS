"use client";


import Link from "next/link";
import { useState } from "react";
import Image from "next/image";



export default function NavBar() {

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
       {/* Fixed NavBar with transparent background */}
       <div className=" fixed top-0 left-0 w-full z-20 bg-black bg-opacity-60 backdrop-blur-sm text-white px-10 py-5 flex justify-between items-center">
        {/* Logo Section */}
        <Link href="/" className="flex items-center">
          <div className="relative w-[150px] h-[80px]">
            <Image
              src="/projectlogo.png"
              alt="logo"
              layout="fill"
              objectFit="contain"
              className="cursor-pointer"
            />
          </div>
        </Link>

        {/* Dropdown Button and Menu */}
        <div className="relative z-20">
          <button onClick={toggleMenu} className="inline-block">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              width={40}
              height={40}
              className="bg-white p-1 rounded-md"
            >
              <path
                fill="black"  // This ensures the lines are visible
                d="M0 96C0 78.3 14.3 64 32 64h384c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zm0 160c0-17.7 14.3-32 32-32h384c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zm448 160c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32h384c17.7 0 32 14.3 32 32z"
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-md shadow-lg py-1">
              <Link href="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">HOME</Link>
              <Link href="/get-quote" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">GET A QUOTE</Link>
              <Link href="/services" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">SERVICES</Link>
              <Link href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">SECTORS</Link>
              <Link href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">FREE VIDEO MARKETING PLAN</Link>
              <Link href="/about-us" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">ABOUT US</Link>
              <Link href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">CAREERS</Link>
              <Link href="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">LOG IN/SIGN UP</Link>
              <button className="border-2 rounded-md text-left ml-5 mt-8 mb-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                CONTACT US
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}