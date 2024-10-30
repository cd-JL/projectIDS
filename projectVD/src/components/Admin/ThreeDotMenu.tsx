"use client";
import { useEffect, useState, useRef } from "react";
import ClickOutside from "@/components/ClickOutside"; // Ensure you have a ClickOutside component to handle outside clicks


const ThreeDotMenu = ({ email, username }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to manage dropdown visibility
  const menuRef = useRef(null); // Ref to handle click outside the dropdown

  // Function to handle outside click
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setDropdownOpen(false); // Close the dropdown if the click is outside
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside); // Event listener for outside click
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Cleanup on unmount
    };
  }, []);

  const handleMakeAdmin = async () => {
    const isConfirm = confirm(`Make ${username} active.`);
    if (isConfirm) {
      await fetch(`http://localhost:8000/makeAsAdmin?email=${email}`);
    }
    return;
  };

  const handleDismissAdmin = async () => {
    const isConfirm = confirm(`Make ${username} deactive.`);
    if (isConfirm) {
      await fetch(`http://localhost:8000/dismissAsAdmin?email=${email}`);
    }
    return;
  };

  const handleDeleteUser = async () => {
    const isConfirm = confirm(`Delete ${username}`);
    if (isConfirm) {
      await fetch(`http://localhost:8000/deleteUser?email=${email}`);
    }
    return;
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="">
      <button
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200"
        aria-label="Menu"
      >
        <svg
          className="fill-current text-gray-800"
          width="20"
          height="20"
          viewBox="0 0 20 20"
        >
          <circle cx="10" cy="3" r="2" />
          <circle cx="10" cy="10" r="2" />
          <circle cx="10" cy="17" r="2" />
        </svg>
      </button>

      {dropdownOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
        >
          <ul className="py-1">
            <li>
              <button
                onClick={handleMakeAdmin}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Activate User
              </button>
            </li>
            <li>
              <button
                onClick={handleDismissAdmin}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Deactivate User
              </button>
            </li>
            <li>
              <button
                onClick={handleDeleteUser}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Delete User
              </button>
            </li>
          </ul>
        </div>
      )}
    </ClickOutside>
  );
};

export default ThreeDotMenu;
