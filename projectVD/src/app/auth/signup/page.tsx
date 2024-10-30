"use client";

import React, { useState, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Link from "next/link";

const SignUp: React.FC = () => {
  const [name, setName] = useState(""); // State for user's name
  const [email, setEmail] = useState(""); // State for email input
  const [company, setCompany] = useState(""); // State for company selection
  const [password, setPassword] = useState(""); // State for password input
  const [reEnterPassword, setReEnterPassword] = useState(""); // State for re-entering password
  const [error, setError] = useState(""); // State for error messages
  const [successMessage, setSuccessMessage] = useState(""); // State for success messages
  const [companies, setCompanies] = useState([]); // State for fetched companies

  // Fetch companies when component mounts
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch("http://localhost:8000/companies"); // Fetching company data
        if (!response.ok) {
          throw new Error("Failed to fetch companies");
        }
        const data = await response.json(); // Parsing response data
        setCompanies(data); // Storing company data in state
        console.log(data);
      } catch (error) {
        console.error("Error fetching companies:", error);
        setError("Failed to load companies"); // Set error if fetching fails
      }
    };
    
    fetchCompanies(); // Invoke fetchCompanies on mount
  }, []); // Empty dependency array means this runs once when component mounts

  const handleSubmission = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setError(""); // Reset error message
    setSuccessMessage(""); // Reset success message

    // Validate form inputs
    // ChatGPT guided the validation logic to ensure no fields are empty
    if (!name || !email || !password || !reEnterPassword || !company) {
      setError("All fields are required.");
      return;
    }

    // Password complexity validation
    // W3Schools provided insight into common password validation patterns
    if (
      password.length < 6 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[!@#$%&*]/.test(password)
    ) {
      setError("Incorrect password format.");
      return;
    }

    if (password !== reEnterPassword) {
      setError("Passwords don't match."); // Check if passwords match
      return;
    }

    const status = 'active'; // Default user status

    const userData = { name, email, password, company, status }; // Prepare user data for submission

    // ChatGPT guid me throuth the process of sending the user input to the server
    try {
      const response = await fetch("http://localhost:8000/signUp", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Set content type
        body: JSON.stringify(userData), // Stringify user data for sending
      });

      if (!response.ok) {
        const result = await response.json();
        setError(result.message); // Set error message from server response
        throw new Error(result.error || "Failed to create account.");
      }


      const result = await response.json(); // Parse the success response
      setSuccessMessage(result.message); // Set success message on successful registration
      // Clear input fields on success
      setName("");
      setEmail("");
      setCompany("");
      setPassword("");
      setReEnterPassword("");
    } catch (err: any) {
      console.error("Error:", err.message || err); // Log error message
      setError(err.message || "An error occurred during sign-up."); // Set error message for user
    }
  };

  return (
    <DefaultLayout>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center justify-center">
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <span className="mb-1.5 block font-medium">Start for free</span>
            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
              Sign Up to Project VD
            </h2>
            {error && <p className="text-red-600">{error}</p>} {/* Display error message */}
            {successMessage && <p className="text-green-600">{successMessage}</p>} {/* Display success message */}
            <form onSubmit={handleSubmission}> {/* Form submission handler */}
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter your full name" // Placeholder for name input
                    value={name} // Bind name state to input
                    onChange={(e) => setName(e.target.value)} // Update state on change
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Company
                </label>
                <div className="relative">
                  <select
                    value={company} // Bind company state to select
                    onChange={(e) => setCompany(e.target.value)} // Update state on change
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option value="" disabled>
                      Select your company {/* Placeholder for company selection */}
                    </option>
                    {companies.map((company) => ( // Map through fetched companies
                      <option key={company.name} value={company.name}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email" // Placeholder for email input
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
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Re-type Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Re-enter your password" // Placeholder for re-enter password input
                    value={reEnterPassword} // Bind re-enter password state to input
                    onChange={(e) => setReEnterPassword(e.target.value)} // Update state on change
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>

              <button
                type="submit" // Button to submit the form
                className="w-full rounded-lg bg-primary py-4 text-white"
              >
                Sign Up
              </button>
              <div className="mt-6 text-center">
                <p>
                  Already have an account?{" "}
                  <Link href="/auth/signin" className="text-primary">
                    Sign In
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

export default SignUp;
