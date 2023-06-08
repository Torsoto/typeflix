import logo from "../../assets/wide-logo.svg";
import userIcon from "../../assets/user-icon.png";
import { IoIosArrowDown } from "react-icons/io";
import { useState } from "react";
import DropdownMenu from "./Dropdown";

const Navbar = () => {
  const [isLoggedIn] = useState(true);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="flex items-center justify-between p-6 bg-transparent">
      <div className="navbar__logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="flex gap-6">
        <a href="/random" className="navbar__link">
          <span className="font-medium text-white transition-colors hover:text-gray-400">
            Random
          </span>
        </a>
        <a href="/training" className="navbar__link">
          <span className="font-medium text-white transition-colors hover:text-gray-400">
            Training
          </span>
        </a>
        <a href="/leaderboard" className="navbar__link">
          <span className="font-medium text-white transition-colors hover:text-gray-400">
            Leaderboard
          </span>
        </a>
        <a href="/create" className="navbar__link">
          <span className="font-medium text-white transition-colors hover:text-gray-400">
            Create
          </span>
        </a>
      </div>
      <div className="relative w-[152px] text-right">
        {isLoggedIn ? (
          <div>
            <div className="flex items-center gap-1 justify-end">
              <IoIosArrowDown
                className={`mr-1 text-lg text-white cursor-pointer transform transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                onClick={toggleDropdown}
              />
              <img
                src={userIcon}
                alt="User Icon"
                className="w-8 h-8 rounded-full cursor-pointer"
              />
            </div>
            {isDropdownOpen && <DropdownMenu />}
          </div>
        ) : (
          <a href="/login" className="navbar__link">
            <span className="font-medium text-white transition-colors hover:text-gray-400">
              Login
            </span>
          </a>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
