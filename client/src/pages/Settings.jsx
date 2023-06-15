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
  const [userData, setUserData] = useState(null);
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/${userId}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error(
          "There has been a problem with your fetch operation: ",
          error.message
        );
      }
    };
    fetchData();
  }, [userId]);

  const handleUpdateUsername = async () => {};

  const handleUpdatePassword = async () => {};

  const handleToggleAvatarOptions = () => {
    setShowAvatarOptions(!showAvatarOptions);
  };

  const handleSelectAvatar = (styleName) => {
    // Set the avatar URL
    const avatarURL = `https://api.dicebear.com/6.x/${styleName}/svg`;
    setAvatarStyle(avatarURL);

    // Hide the avatar options
    setShowAvatarOptions(false);
  };

  const handleDeleteAccount = async () => {};

  return (
    <>
      <div className="main-bg">
        <div className="h-[90%] m-auto max-w-7xl">
          <Navbar />
          <div className="container mx-auto">
            <h1 className="text-white mt-8 text-xl pb-7">Settings</h1>
            <div className="mx-auto bg-gray-600 p-8 rounded-lg flex flex-col md:flex-row">
              <div className="mb-4 md:mb-0 md:w-1/2 flex flex-col items-start">
                <div className="w-16 h-16 rounded-full overflow-hidden">
                  {avatarStyle && <img src={avatarStyle} alt="Avatar" />}
                </div>
                <button
                  className="bg-black text-white font-semibold py-2 px-4 rounded-full mt-2"
                  onClick={handleToggleAvatarOptions}
                >
                  Change Avatar
                </button>
                <button
                  className="mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full"
                  onClick={() => handleDeleteAccount()}
                >
                  Delete Account
                </button>
              </div>
              <div className="md:w-1/2 flex flex-col">
                <div className="flex items-center">
                  <p className="text-white mr-2">
                    Username: {userData && <span>{userData.username}</span>}
                  </p>
                  <button
                    className="bg-black text-white font-semibold py-1 px-2 rounded-full"
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
                  <p className="text-white mr-2">Change password</p>
                  <button
                    className="bg-black text-white font-semibold py-1 px-2 rounded-full"
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
              />
            )}
            {error && <div className="text-red-500 mt-4">{error}</div>}
          </div>
        </div>
        <div>
          <a href="/">
            <span className="font-medium text-white transition-colors hover:text-gray-400">
              Go Back
            </span>
          </a>
        </div>
      </div>
    </>
  );
}

export default Settings;
