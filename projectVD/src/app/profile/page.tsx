"use client";

import { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Admin from "@/components/Admin/Admin";
import NewCompany from "@/components/Admin/NewCompany";
import DeleteCompany from "@/components/Admin/DeleteCompany";

function ProfilePage() {
  const [user, setUser] = useState(null); // State to hold user data
  const [loading, setLoading] = useState(true); // State to manage loading state
  const userEmail = localStorage.getItem("userEmail"); // Get user email from localStorage

  // Function to fetch user data from the server
  // Refernced chatGPT in creting this function
  const fetchUserData = async (email) => {
    try {
      const response = await fetch(`http://localhost:8000/getUser?email=${email}`); // Fetch user data
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

  if (loading) return <div>Loading...</div>; // Show loading state while fetching data

  return (
    <DefaultLayout>
      <div className="flex flex-col items-center justify-center bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-full max-h-full">
          <div className="flex flex-col items-center h-80">
            {/* Conditional rendering based on user role */}
            {user?.role == "admin" && 
            <img
              src={"/images/user/admin.png"} // Admin profile image
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-gray-300 mb-4"
            />}
            {user?.role == "view-only" && 
            <img
              src={"/images/user/user.png"} // View-only profile image
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-gray-300 mb-4"
            />}

            <h2 className="text-2xl font-semibold text-gray-800">{user?.username || "Username"}</h2> {/* Display username */}
            <h3 className="text-xl font-semibold text-gray-800">Company XYZ</h3> {/* Static company name; consider dynamic value */}
            <p className="text-gray-600">{user?.email || "Email"}</p> {/* Display user email */}
            <p className="text-gray-600">{user?.role || "role"}</p> {/* Display user role */}
          </div>
        </div>
      </div>
      <div className=" flex justify-around">
        <div>{user?.role == "admin" && <NewCompany/>} {/* Render Admin component if user is an admin */}</div>
        <div>{user?.role == "admin" && <DeleteCompany/>} {/* Render Admin component if user is an admin */}</div>
      </div>
      {user?.role == "admin" && <Admin/>} {/* Render Admin component if user is an admin */}
    </DefaultLayout>
  );
}

export default ProfilePage;
