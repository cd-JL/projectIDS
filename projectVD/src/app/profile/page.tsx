"use client";

import { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Admin from "@/components/Admin/Admin";


function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const userEmail = localStorage.getItem("userEmail");
  

  const fetchUserData = async (email) => {
    try {
      const response = await fetch(`http://localhost:8000/getUser?email=${email}`);
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        console.log(userData)
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userEmail) {
      // Redirect to sign-in if no user is logged in
      window.location.href = "/auth/signin";
    } else {
      // Fetch user data from the server
      fetchUserData(userEmail);
    }
  }, [userEmail]);


  if (loading) return <div>Loading...</div>; // Loading state

  return (
    <DefaultLayout>
      <div className="flex flex-col items-center justify-center bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-full max-h-full">
          <div className="flex flex-col items-center h-80">
            <img
              src={"/images/user/user-01.png"}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-gray-300 mb-4"
            />
            <h2 className="text-2xl font-semibold text-gray-800">{user?.username || "Username"}</h2>
            <h3 className="text-xl font-semibold text-gray-800">Company XYZ</h3>
            <p className="text-gray-600">{user?.email || "Email"}</p>
            <p className="text-gray-600">{user?.role || "role"}</p>
          </div>
        </div>
      </div>
      {user?.role == "admin" && <Admin/>}
    </DefaultLayout>
  );
}

export default ProfilePage;


