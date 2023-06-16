import { useState, useEffect, useContext } from "react";
import { BiTimeFive } from "react-icons/bi";
import { BiEdit } from "react-icons/bi";
import Navbar from "../components/UI/Navbar.jsx";
import AuthContext from "../components/context/AuthContext.jsx";
import "../styles/Settings.css";
import { Avatars } from "../components/UI/Avatars.jsx";

function Settings() {
  const [error, setError] = useState("");
  const [avatarStyle, setAvatarStyle] = useState(""); // State to store the avatar URL
  const [showAvatarOptions, setShowAvatarOptions] = useState(false); // State to control the display of avatar options
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { userId, userData } = useContext(AuthContext);

  const handleUpdateUsername = async () => { };

  const handleUpdatePassword = async () => { };

  const handleToggleAvatarOptions = () => {
    setShowAvatarOptions(!showAvatarOptions);
  };

  useEffect(() => {
    return () => {

    };
  }, [avatarStyle]);


  const handleSelectAvatar = (styleName) => {
    // Set the avatar URL
    const avatarURL = `https://api.dicebear.com/6.x/${styleName}/svg?seed=${userId}`;
    setAvatarStyle(avatarURL);

    // Hide the avatar options
    setShowAvatarOptions(false);
  };

  const handleDeleteAccount = async () => { };

  return (
    <>
      <div className="main-bg">
        <div className="h-[90%] m-auto max-w-7xl">
          <Navbar />
          <div className="container mx-auto">
            <h1 className="mt-8 text-xl text-white pb-7">Settings</h1>
            <div className="flex flex-col p-8 mx-auto rounded-lg bg-neutral-700 md:flex-row">
              <div className="flex flex-col items-start mb-4 md:mb-0 md:w-1/2">
                <div className="w-40 h-40 overflow-hidden rounded-full">
                  {avatarStyle && <img src={avatarStyle} alt="Avatar" />}
                </div>
                <button
                  className="px-4 py-2 mt-4 font-semibold text-white bg-black rounded-full"
                  onClick={handleToggleAvatarOptions}
                >
                  Change Avatar
                </button>
                <button
                  className="px-4 py-2 mt-4 font-semibold text-white bg-red-500 rounded-full hover:bg-red-600"
                  onClick={() => handleDeleteAccount()}
                >
                  Delete Account
                </button>
              </div>
              <div className="flex flex-col md:w-1/2">
                <div className="flex items-center">
                  <p className="mr-2 text-white">
                    Username: {userData && <span>{userData.username}</span>}
                  </p>
                  <button
                    className="px-2 py-1 font-semibold text-white bg-black rounded-full"
                    onClick={handleUpdateUsername}
                  >
                    <BiEdit />
                  </button>
                </div>

                <div className="flex flex-col items-start mt-4">
                  <p className="text-white">
                    Email: {userData && <span>{userData.email}</span>}
                  </p>
                </div>
                <div className="flex items-center mt-4">
                  <p className="mr-2 text-white">Change password</p>
                  <button
                    className="px-2 py-1 font-semibold text-white bg-black rounded-full"
                    onClick={handleUpdatePassword}
                  >
                    <BiEdit />
                  </button>
                </div>
              </div>
            </div>
            {showAvatarOptions && (
              <Avatars
                handleSelectAvatar={handleSelectAvatar}
                handleToggleAvatarOptions={handleToggleAvatarOptions}
                userId={userId}
              />
            )}
            {error && <div className="mt-4 text-red-500">{error}</div>}
          </div>
        </div>
        <div>
          <a href="/">
            <span className="font-medium text-white transition-colors hover:text-gray-400 pl-14 ">
              Go Back
            </span>
          </a>
        </div>
      </div>
    </>
  );
}

export default Settings;
