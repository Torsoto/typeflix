import logo from "../../assets/wide-logo.svg";
import userIcon from "../../assets/profile.svg";
import "../../styles/App.css";
import { useContext, useState } from "react";
import DropdownMenu from "../UI/Dropdown";
import AuthContext from "../context/AuthContext.jsx";

const Navbar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const { avatarUrl } = useContext(AuthContext);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="flex items-center justify-between p-6 bg-transparent">
      <div className="navbar__logo">
        <a href="/">
          <img src={logo} alt="Logo" />
        </a>
      </div>
      <div className="flex gap-6">
        <a href="/" className="navbar__link">
          <span className="font-medium text-white transition-colors hover:text-gray-400">
            Theme
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
      </div>
      <div className="relative w-[152px] text-right">
        <div className="flex items-center justify-end gap-1">
          <img
            src={avatarUrl ? avatarUrl : userIcon}
            alt="User Icon"
            className="w-8 h-8 bg-white rounded-full cursor-pointer"
            onClick={toggleDropdown}
          />
        </div>
        {isDropdownOpen && <DropdownMenu />}
      </div>
    </nav>
  );
};

export default Navbar;
