import { useState, useEffect, useContext } from "react";
import { BiTimeFive } from "react-icons/bi";
import Navbar from "../components/Home/Navbar.jsx";
import AuthContext from "../components/context/AuthContext.jsx";
import "../styles/Settings.css";


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

  const handleUpdateUsername = async () => {
  };

  const handleUpdatePassword = async () => {
  };

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

  const handleDeleteAccount = async () => {
  };

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
                  <p className="text-white">Username: {userData && <p>{userData.username}</p>}</p>
                  <button
                    className="bg-black text-white font-semibold py-2 px-4 rounded mt-2"
                    onClick={handleUpdateUsername}
                  >
                    Edit
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <div>
                  <p className="text-white">Email: {userData && <p>{userData.email}</p>}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div>
                  <p className="text-white">Password</p>
                  <button
                    className="bg-black text-white font-semibold py-2 px-4 rounded mt-2"
                    onClick={handleUpdatePassword}
                  >
                    Edit
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
            <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
              <div className="bg-white p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Select an Avatar</h3>
                <div className="flex flex-wrap">
                  <button
                    className="w-16 h-16 rounded-full overflow-hidden mr-2 mb-2"
                    onClick={() => handleSelectAvatar("lorelei")}
                  >
                    <img
                      src={`https://api.dicebear.com/6.x/lorelei/svg`}
                      alt="Avatar 1"
                    />
                  </button>
                  <button
                    className="w-16 h-16 rounded-full overflow-hidden mr-2 mb-2"
                    onClick={() => handleSelectAvatar("pixel-art")}
                  >
                    <img
                      src={`https://api.dicebear.com/6.x/pixel-art/svg`}
                      alt="Avatar 2"
                    />
                  </button>
                  <button
                    className="w-16 h-16 rounded-full overflow-hidden mr-2 mb-2"
                    onClick={() => handleSelectAvatar("micah")}
                  >
                    <img
                      src={`https://api.dicebear.com/6.x/micah/svg`}
                      alt="Avatar 3"
                    />
                  </button>
                  <button
                    className="w-16 h-16 rounded-full overflow-hidden mr-2 mb-2"
                    onClick={() => handleSelectAvatar("adventurer")}
                  >
                    <img
                      src={`https://api.dicebear.com/6.x/adventurer/svg`}
                      alt="Avatar 4"
                    />
                  </button>
                  <button
                    className="w-16 h-16 rounded-full overflow-hidden mr-2 mb-2"
                    onClick={() => handleSelectAvatar("big-ears")}
                  >
                    <img
                      src={`https://api.dicebear.com/6.x/big-ears/svg`}
                      alt="Avatar 5"
                    />
                  </button>
                  <button
                    className="w-16 h-16 rounded-full overflow-hidden mr-2 mb-2"
                    onClick={() => handleSelectAvatar("personas")}
                  >
                    <img
                      src={`https://api.dicebear.com/6.x/personas/svg`}
                      alt="Avatar 6"
                    />
                  </button>
                  <button
                    className="w-16 h-16 rounded-full overflow-hidden mr-2 mb-2"
                    onClick={() => handleSelectAvatar("thumbs")}
                  >
                    <img
                      src={`https://api.dicebear.com/6.x/thumbs/svg`}
                      alt="Avatar 7"
                    />
                  </button>
                  <button
                    className="w-16 h-16 rounded-full overflow-hidden mr-2 mb-2"
                    onClick={() => handleSelectAvatar("bottts")}
                  >
                    <img
                      src={`https://api.dicebear.com/6.x/bottts/svg`}
                      alt="Avatar 8"
                    />
                  </button>
                  <button
                    className="w-16 h-16 rounded-full overflow-hidden mr-2 mb-2"
                    onClick={() => handleSelectAvatar("pixel-art")}
                  >
                    <img
                      src={`https://api.dicebear.com/6.x/pixel-art/svg`}
                      alt="Avatar 9"
                    />
                  </button>
                  <button
                    className="w-16 h-16 rounded-full overflow-hidden mr-2 mb-2"
                    onClick={() => handleSelectAvatar("fun-emoji")}
                  >
                    <img
                      src={`https://api.dicebear.com/6.x/fun-emoji/svg`}
                      alt="Avatar 10"
                    />
                  </button>
                </div>
                <button
                  className="mt-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
                  onClick={handleToggleAvatarOptions}
                >
                  Cancel
                </button>
              </div>
            </div>
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
