"use client";
import NavBar from "@/app/_components/nav-bar";
import Footer from "@/app/_components/footer";
import { useState } from "react";



export default function ServicesPage() {
  const [videoType, setVideoType] = useState("Any");
  const [industry, setIndustry] = useState("Any");

  return (
    <div className="relative">
      {/* Navbar */}
      <NavBar />

      {/* Hero Section with Background Video */}
      <section className="relative h-screen w-full flex justify-center items-center z-0">
        {/* Background video */}
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          src="/back-round2.mp4"
          autoPlay
          loop
          muted
        />
        {/* Overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>

        {/* Text and Button */}
        <div className="relative z-10 text-center text-white">
          <h1 className="text-6xl font-bold mb-6">Video Production Services</h1>
          <button className="bg-orange-500 text-white px-8 py-4 text-xl rounded-full hover:bg-orange-600 transition duration-300">
            Watch Our Showreel
          </button>
        </div>
      </section>

      {/* Services Section with Filters */}
      <section className="py-20 bg-gray-100 z-10 relative">
        <div className="container mx-auto">
          <h2 className="text-5xl font-bold text-center mb-12">Our Services</h2>

          {/* Filter Options with Tabs */}
          <div className="flex justify-center mb-16 space-x-16">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Filter by Video Type</h3>
              <div className="flex space-x-4">
                {["Any", "Promotional Video", "Corporate Video", "Explainer Video"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setVideoType(type)}
                    className={`px-4 py-2 rounded-lg border-2 ${videoType === type ? "bg-black text-white" : "bg-white text-black"} hover:bg-black hover:text-white transition duration-300`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4">Filter by Industry</h3>
              <div className="flex space-x-4">
                {["Any", "Fashion", "Food", "Real Estate"].map((ind) => (
                  <button
                    key={ind}
                    onClick={() => setIndustry(ind)}
                    className={`px-4 py-2 rounded-lg border-2 ${industry === ind ? "bg-black text-white" : "bg-white text-black"} hover:bg-black hover:text-white transition duration-300`}
                  >
                    {ind}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Services Cards with Hover Effects */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Promotional Video */}
            <div className="group relative bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <img
                src="https://via.placeholder.com/400x300"
                alt="Promotional Video"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-75 transition duration-300 flex justify-center items-center">
                <button className="bg-white text-black px-6 py-2 rounded-full text-lg opacity-0 group-hover:opacity-100 transition duration-300">
                  Watch Sample
                </button>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">Promotional Video</h3>
                <p>Create eye-catching promotional videos to promote your brand in the best light.</p>
              </div>
            </div>

            {/* Corporate Video */}
            <div className="group relative bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <img
                src="https://via.placeholder.com/400x300"
                alt="Corporate Video"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-75 transition duration-300 flex justify-center items-center">
                <button className="bg-white text-black px-6 py-2 rounded-full text-lg opacity-0 group-hover:opacity-100 transition duration-300">
                  Watch Sample
                </button>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">Corporate Video</h3>
                <p>Professional corporate videos for internal communications or external marketing.</p>
              </div>
            </div>

            {/* Social Video Marketing */}
            <div className="group relative bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <img
                src="https://via.placeholder.com/400x300"
                alt="Social Video Marketing"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-75 transition duration-300 flex justify-center items-center">
                <button className="bg-white text-black px-6 py-2 rounded-full text-lg opacity-0 group-hover:opacity-100 transition duration-300">
                  Watch Sample
                </button>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">Social Video Marketing</h3>
                <p>Maximize reach and engagement with videos optimized for social media platforms.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial or Need a Video Section */}
      <section className="bg-black text-white py-16 text-center">
        <h2 className="text-4xl font-bold mb-6">Need a Video?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Let's turn your vision into reality. Our team is ready to create a stunning video that resonates with your audience.
        </p>
        <a href="/case-study" className="bg-white text-black px-8 py-4 rounded-full hover:bg-gray-200 transition duration-300">
          Read Full Case Study →
        </a>
      </section>

      <Footer />
    </div>
  );
}
