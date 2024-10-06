"use client"

import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import NavBar from "../_components/nav-bar";
import Footer from "../_components/footer";

export default function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginStatus, setLoginStatus] = useState("");


  const handleEmailSignIn = async (event) =>  {
      event.preventDefault();
      loginError("");
    try {
      setLoginError("");
      await axios
        .post("http://localhost:3306/login", {
          email: email,
          password: password,
        })
        .then((response) => {
          if(response.data.message) {
            setLoginStatus(response.data.message);
          } else {
            setLoginStatus(response.data[0].email);
          }
          // console.log(response);
          // console.log("Login successful");
        });
    } catch (error) {
      console.log(`Email sign in error: ${error.message}`);
      setLoginError(error.message);
    }
  }

  async function handleGoogleSignIn() {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(`Google sign in error: ${error.message}`);
    }
  }


  const handleSetEmail = (event) => {
    setEmail(event.target.value);
    setLoginError("");
  };

  const handleSetPassword = (event) => {
    setPassword(event.target.value);
    setLoginError("");
  };

  return (
    <main>
        <NavBar />
        <div className="flex flex-col bg-white text-black pt-40 pb-40 pl-52 pr-52 items-center">
          <div className=" flex flex-col justify-center border-opacity-80 border-2 border-black p-20 text-center">
            {loginStatus && (
              <p className="text-red-500 text-center">{loginStatus}</p>
            )}

            <div className="flex flex-col space-y-10">
              <b>
                <h3 className="text-3xl">Sign In</h3>
              </b>
              <p>Use your email address to sign into your account</p>

              <b>
                <h4 className="text-xl underline">Email or UserID</h4>
              </b>
            </div>
            <div className="flex flex-col items-center">
              <input
                type="email"
                value={email}
                onChange={handleSetEmail}
                id="email"
                className="w-80 mt-5 p-2 border rounded"
                required
                placeholder="Email or UserID"
              />
              <input
                type="password"
                value={password}
                onChange={handleSetPassword}
                id="password"
                className="w-80 mt-5 p-2 border rounded"
                required
                placeholder="Enter Password"
              />
              <button
                onClick={handleEmailSignIn}
                className="w-80 mt-10 p-2 border rounded bg-orange-500 hover:bg-orange-600"
              >
                Log In
              </button>
              <div>
                <button
                  className="flex w-80 mt-5 justify-center bg-orange-500 rounded-md p-2 hover:bg-orange-600"
                  onClick={handleGoogleSignIn}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 488 512"
                    className="fill-current"
                    height="25"
                    width="25"
                  >
                    <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                  </svg>
                  Sign in with Google
                </button>
              </div>
              <p className="text-sm mt-5 max-w-80">
                By selecting Sign In, you agree to our <b>Terms</b> and
                acknowledge our <b>Privacy Statement</b>
              </p>
            </div>
            <b>
              <p className="mt-14 text-xl">
                New to ONTHEGO Production?
                <Link href="signup" className="text-blue-800 underline">
                  Create an account
                </Link>
              </p>
            </b>
          </div>
        </div>
        <Footer />
    </main>
  );
}
