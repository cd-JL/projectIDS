import React, { useEffect, useState } from 'react';
import ThreeDotMenu from './ThreeDotMenu';

const Admin = () => {
  const [users, setUsers] = useState([]); // State to hold the list of users
  const userEmail = localStorage.getItem("userEmail"); // Get logged-in user email from local storage
  const indexNumber = 1; // Placeholder for index if needed later

  // Function to fetch users from the server
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8000/Users'); // Fetch user list
      if (response.ok) {
        const userList = await response.json(); // Parse the response to JSON
        console.log("Fetched users:", userList); // Log fetched data
        setUsers(userList); // Set the user list in state
      } else {
        console.error("Failed to fetch user list"); // Handle fetch failure
      }
    } catch (error) {
      console.error("Error fetching user list:", error); // Log any error that occurs
    }
  };

  // Effect hook to fetch users on component mount
  useEffect(() => {
    fetchUsers(); // Call the function to fetch users
  }, []); // Empty dependency array means this runs once when the component mounts

  return (
    <div className="p-6">
      <div className="text-lg font-semibold mb-4">Admin Panel</div>

      {/* Users Table */}
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="py-2 px-4 border-b">No.</th>
            <th className="py-2 px-4 border-b">Username</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Edit</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) ? (
            users.map((user, index) => (
              user.email !== userEmail && user.role !== 'owner' ? (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{index}</td> {/* Display index + 1 for user number */}
                  <td className="py-2 px-4 border-b">{user.username}</td>
                  <td className="py-2 px-4 border-b">{user.email}</td>
                  <td className="py-2 px-4 border-b">{user.status}</td>
                  <ThreeDotMenu email={user.email} username={user.username}/> {/* Render the three dot menu */}
                </tr>
              ) : null
            ))
          ) : (
            <tr>
              <td colSpan="5" className="py-2 px-4 border-b text-center">No users found.</td> {/* Fallback if no users */}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
