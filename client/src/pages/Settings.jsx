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
          <h1 className="text-white mt-8 text-xl pb-7">Settings</h1>
          <div className="container mx-auto bg-gray-600 p-8 rounded-lg flex">
            <div className="w-1/2">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                  {avatarStyle && <img src={avatarStyle} alt="Avatar" />}
                </div>
                <div>
                  <p className="text-white">
                    Username: {userData && <p>{userData.username}</p>}
                  </p>
                  <button
                    className="bg-black text-white font-semibold py-1 px-2 rounded mt-2"
                    onClick={handleUpdateUsername}
                  >
                    <BiEdit />
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <div>
                  <p className="text-white">
                    Email: {userData && <p>{userData.email}</p>}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div>
                  <p className="text-white">Password</p>
                  <button
                    className="bg-black text-white font-semibold py-1 px-2 rounded mt-2"
                    onClick={handleUpdatePassword}
                  >
                    <BiEdit />
                  </button>
                </div>
              </div>
            </div>
            <div className="w-1/2">
              <div className="flex flex-col mt-4">
                <button
                  className="bg-black text-white font-semibold py-2 px-4 rounded"
                  onClick={handleToggleAvatarOptions}
                >
                  Change Avatar
                </button>
                <button
                  className="mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
                  onClick={() => handleDeleteAccount()}
                >
                  Delete Account
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
        <div>
          <a href="/">
            <span className="ont-medium text-white transition-colors hover:text-gray-400">
              Go Back
            </span>
          </a>
        </div>
      </div>
    </>
  );
}

export default Settings;
