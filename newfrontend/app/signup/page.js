"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import NavBar from "../_components/nav-bar";
import Footer from "../_components/footer";
// import { useUserAuth } from "../_utils/auth_context";

export default function SignUp({ onClose }) {
  // const { emailSignUp } = useUserAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const register = async (event) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3306/register", {
        fName: firstName,
        lName: lastName,
        email: email,
        password: password,
      });
      console.log(response.data);
    } catch (error) {
      setError(
        error.response?.data?.error || "An error occurred during registration."
      );
      console.log(`Sign Up Error: ${error.message}`);
    }
  };

  const handleSetFirstName = (event) => setFirstName(event.target.value);
  const handleSetLastName = (event) => setLastName(event.target.value);
  const handleSetEmail = (event) => setEmail(event.target.value);
  const handleSetPassword = (event) => setPassword(event.target.value);
  const handleSetConfirmPassword = (event) =>
    setConfirmPassword(event.target.value);

  return (
    <main>
      <NavBar />

      <div className="flex flex-col bg-white text-black pt-40 pb-40 pl-52 pr-52 items-center">
        <div className="flex flex-col justify-center border-opacity-80 border-2 border-black p-20 text-center">
          <b>
            <h2 className="text-3xl mb-6">Sign Up</h2>
          </b>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex flex-col items-start w-1/2 pr-2">
                <label htmlFor="firstName" className="mb-1">
                  First name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={handleSetFirstName}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="flex flex-col items-start w-1/2 pl-2">
                <label htmlFor="lastName" className="mb-1">
                  Last name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={handleSetLastName}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col items-start">
              <label htmlFor="email" className="mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleSetEmail}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="flex flex-col items-start">
              <label htmlFor="password" className="mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handleSetPassword}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="flex flex-col items-start">
              <label htmlFor="confirmPassword" className="mb-1">
                Confirm password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={handleSetConfirmPassword}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-80 mt-10 p-2 border rounded bg-orange-500"
                onClick={register}
              >
                Sign Up
              </button>
            </div>
          </form>
          <Link href="/login">
            <button className="w-80 mt-10 p-2 border rounded bg-orange-500">
              Already have an account?
            </button>
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
