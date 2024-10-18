"use client";
import { useEffect, useState, useRef } from "react";
import ClickOutside from "@/components/ClickOutside"; // Ensure you have a ClickOutside component to handle outside clicks

const ThreeDotMenu = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef(null);

  // Function to handle outside click
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMakeAdmin = () => {
    alert("Promoted to admin");
  };

  const handleDismissAdmin = () => {
    alert("Dismissed as admin");
  };

  const handleDeleteUser = () => {
    alert("User deleted");
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
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
                Make as admin
              </button>
            </li>
            <li>
              <button
                onClick={handleDismissAdmin}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Dismiss as admin
              </button>
            </li>
            <li>
              <button
                onClick={handleDeleteUser}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Delete user
              </button>
            </li>
          </ul>
        </div>
      )}
    </ClickOutside>
  );
};

export default ThreeDotMenu;
