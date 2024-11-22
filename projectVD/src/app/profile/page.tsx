"use client";

import { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Admin from "@/components/Admin/Admin";
import NewCompany from "@/components/Admin/NewCompany";
import DeleteCompany from "@/components/Admin/DeleteCompany";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid"; // Importing icons

function ProfilePage() {
  const [user, setUser] = useState(null); // State to hold user data
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode
  const userEmail = localStorage.getItem("userEmail"); // Get user email from localStorage

  // Function to fetch user data from the server
  const fetchUserData = async (email) => {
    try {
      const response = await fetch(`http://localhost:8000/getUser?email=${email}`); // Fixed URL
      if (response.ok) {
        const userData = await response.json(); // Parse JSON response
        setUser(userData); // Set user data in state
        console.log(userData);
      } else {
        console.error("Failed to fetch user data"); // Log error if response is not ok
      }
    } catch (error) {
      console.error("Error fetching user data:", error); // Log any fetch errors
    } finally {
      setLoading(false); // Set loading to false regardless of outcome
    }
  };

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  // useEffect to fetch user data or redirect to sign-in
  useEffect(() => {
    if (!userEmail) {
      // Redirect to sign-in if no user is logged in
      window.location.href = "/auth/signin"; // Simple client-side redirect
    } else {
      // Fetch user data from the server
      fetchUserData(userEmail);
    }
  }, [userEmail]); // Dependency on userEmail

  // useEffect to handle dark mode on initial render
  useEffect(() => {
    const darkModePreference = localStorage.getItem("isDarkMode") === "true";
    setIsDarkMode(darkModePreference);
    if (darkModePreference) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // useEffect to update dark mode class and localStorage when isDarkMode changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("isDarkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("isDarkMode", "false");
    }
  }, [isDarkMode]);

  if (loading) return <div className="text-center mt-10">Loading...</div>; // Show loading state while fetching data

  return (
    <DefaultLayout>

      <div className="h-full flex flex-col items-center justify-center">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-2xl">
          <div className="flex flex-col items-center h-80">
            {/* Conditional rendering based on user role */}
            {user?.role === "admin" && (
              <img
                src="/images/user/admin.png" // Admin profile image
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-gray-300 dark:border-gray-600 mb-4"
              />
            )}
            {user?.role === "view-only" && (
              <img
                src="/images/user/user.png" // View-only profile image
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-gray-300 dark:border-gray-600 mb-4"
              />
            )}

            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              {user?.username || "Username"}
            </h2> {/* Display username */}
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Company XYZ
            </h3> {/* Static company name; consider dynamic value */}
            <p className="text-gray-600 dark:text-gray-400">{user?.email || "Email"}</p> {/* Display user email */}
            <p className="text-gray-600 dark:text-gray-400">{user?.role || "Role"}</p> {/* Display user role */}
            <h2 className="text-2xl font-semibold text-gray-800">{user?.username || "Username"}</h2> {/* Display username */}
            <h3 className="text-xl font-semibold text-gray-800">{user?.company || ""}</h3> {/* Static company name; consider dynamic value */}
          </div>
        </div>

        <div className="flex justify-around w-full max-w-2xl mt-6">
          <div>{user?.role === "admin" && <NewCompany />}</div> {/* Render NewCompany if admin */}
          <div>{user?.role === "admin" && <DeleteCompany />}</div> {/* Render DeleteCompany if admin */}
        </div>

        {user?.role === "admin" && <Admin />} {/* Render Admin component if admin */}
      </div>
    </DefaultLayout>
  );
}

export default ProfilePage;
