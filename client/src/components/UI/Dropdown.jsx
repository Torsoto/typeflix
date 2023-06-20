import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext.jsx";
import "../../styles/App.css";

export const DropdownMenu = () => {
  const { isLoggedIn, logout, userData } = useContext(AuthContext);

  return (
    <div className="absolute w-[152px]">
      <div
        className="absolute z-10 w-40 mt-2 text-left origin-top-right bg-black rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
      >
        <div className="py-1" role="none">
          {isLoggedIn ? (
            <div>
              <a
                href={`/${userData.username}`}
                className="block px-4 py-2 text-sm text-white transition-all duration-100 ease-in-out hover:scale-105 hover:ml-1"
                role="menuitem"
              >
                Profile
              </a>
              <a href="/settings" className="block px-4 py-2 text-sm text-white transition-all duration-100 ease-in-out hover:scale-105 hover:ml-1">
                Settings
              </a>
              <a href="/"
                className="block px-4 py-2 text-sm text-white transition-all duration-100 ease-in-out hover:scale-105 hover:ml-1"
                onClick={(e) => {
                  e.preventDefault();
                  logout();
                }}>
                Log out
              </a>
            </div>
          ) : (
            <a href="/login" className="block px-4 py-2 text-sm text-white">
              Login
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default DropdownMenu;
