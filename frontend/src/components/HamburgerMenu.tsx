"use client";

import Link from "next/link";
import { useState } from "react";

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const handleMenuClick = () => {
    setIsOpen(false); // Close the menu after clicking a menu item
  };

  return (
    <div className="relative">
      {/* Hamburger Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 focus:outline-none"
      >
        <span className="block w-6 h-0.5 bg-gray-800 mb-1"></span>
        <span className="block w-6 h-0.5 bg-gray-800 mb-1"></span>
        <span className="block w-6 h-0.5 bg-gray-800"></span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-10 left-0 bg-white shadow-lg rounded-md p-4">
          <Link href="/generate" onClick={handleMenuClick}>
            <span className="block py-2 text-gray-700 hover:text-blue-500 cursor-pointer">
              Generate Notes
            </span>
          </Link>
          <Link href="/view" onClick={handleMenuClick}>
            <span className="block py-2 text-gray-700 hover:text-blue-500 cursor-pointer">
              View Notes
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}
