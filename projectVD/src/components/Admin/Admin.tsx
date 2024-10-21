
import React, { useEffect, useState } from 'react';
import ThreeDotMenu from './ThreeDotMenu';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const userEmail = localStorage.getItem("userEmail");


  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8000/Users');
      if (response.ok) {
        const userList = await response.json();
        console.log("Fetched users:", userList); // Log fetched data
        setUsers(userList);
      } else {
        console.error("Failed to fetch user list");
      }
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
            <th className="py-2 px-4 border-b">Role</th>
            <th className="py-2 px-4 border-b">Edit</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) ? (
            users.map((user, index) => (
              user.email !== userEmail ? (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{index + 1}</td>
                  <td className="py-2 px-4 border-b">{user.username}</td>
                  <td className="py-2 px-4 border-b">{user.email}</td>
                  <td className="py-2 px-4 border-b">{user.role}</td>
                  <ThreeDotMenu email={user.email} username={user.username}/>
                </tr>
              ) : null
            ))
          ) : (
            <tr>
              <td colSpan="4" className="py-2 px-4 border-b text-center">No users found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;