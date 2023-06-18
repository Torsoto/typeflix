import {useContext, useEffect, useState} from "react";
import AuthContext from "../context/AuthContext.jsx";
import "../../styles/App.css";

export const DropdownMenu = () => {
    const { isLoggedIn, logout, userData } = useContext(AuthContext);

  return (
    <div className="absolute w-[152px]">
      <div
        className="absolute z-10 mt-2 w-40 origin-top-right rounded-md bg-neutral-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-left"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
      >
        <div className="py-1" role="none">
          {isLoggedIn ? (
              <div>
                  <a
                      href={`/${userData.username}`}
                      className="text-white block px-4 py-2 text-sm"
                      role="menuitem"
                  >
                  Profile
                </a>
                <a href="/settings" className="text-white block px-4 py-2 text-sm">
                  Settings
                </a>
                <a href="/"
                   className="text-white block px-4 py-2 text-sm"
                   onClick={(e) => {
                       e.preventDefault();
                       logout();
                   }}>
                  Log out
                </a>
              </div>
          ) : (
              <a href="/login" className="text-white block px-4 py-2 text-sm">
                Login
              </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default DropdownMenu;
