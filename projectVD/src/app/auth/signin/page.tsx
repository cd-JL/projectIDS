"use client";

import React, { useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState(""); // State for email input
  const [password, setPassword] = useState(""); // State for password input
  const [error, setError] = useState(""); // State for error messages
  const router = useRouter(); // Using Next.js routing for navigation

  const handleSubmission = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setError(""); // Reset error state on submission

    // Validation for required fields
    // ChatGPT guided the validation logic to ensure inputs are not empty
    if (!email || !password) {
      setError("All fields are required.");
      return;
    }

    // Password complexity validation
    // W3Schools provided insight into common password validation patterns
    if (password.length < 6 || !/[A-Z]/.test(password)) {
      setError("Incorrect password format.");
      return;
    }

    const userData = { email, password }; // Prepare user data for submission

    try {
      const response = await fetch("http://localhost:8000/signIn", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Set content type
        body: JSON.stringify(userData), // Stringify user data
      });

      // Handle response status
      // ChatGPT helped with error handling and checking response.ok
      if (!response.ok) {
        const result = await response.json();
        setError(result.message);
        throw new Error(result.message || "Failed to sign in.");
      }

      const result = await response.json();
      setEmail(""); // Reset email input
      setPassword(""); // Reset password input
      setError(result.message); // Set message to display after sign-in

      // Navigate to profile page on successful sign-in
      if (result.messagee === "Signed In") {
        // Store user email in local storage
        localStorage.setItem("userEmail", email); // Storing email in localStorage
        router.push('/profile'); // Navigate to profile page
      }

    } catch (err: any) {
      console.error("Error:", err.message || err); // Log error message
      setError(err.message || "An error occurred during sign-in."); // Set error message
    }
  };

  return (
    <DefaultLayout>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center justify-center">
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <span className="mb-1.5 block font-medium">Start for free</span>
            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
              Sign In to Project VD
            </h2>
            {error && <p className="text-red-600">{error}</p>} {/* Display error message */}
            <form onSubmit={handleSubmission}> {/* Form submission handler */}
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email} // Bind email state to input
                    onChange={(e) => setEmail(e.target.value)} // Update state on change
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="6+ Characters, 1 Capital letter" // Password requirements
                    value={password} // Bind password state to input
                    onChange={(e) => setPassword(e.target.value)} // Update state on change
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>

              <div className="mb-5">
                <button
                  className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                  type="submit" // Button to submit the form
                >
                  Sign In
                </button>
              </div>
              <div className="mt-6 text-center">
                <p>
                  Don't have an account?{" "}
                  <Link href="/auth/signup" className="text-primary">
                    Sign Up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default SignIn;
