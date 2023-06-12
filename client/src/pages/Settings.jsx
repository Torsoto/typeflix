import { useState } from "react";
import "../styles/Settings.css";

function Settings() {
  const [error, setError] = useState("");
  const [avatarStyle, setAvatarStyle] = useState(""); // State to store the avatar style

  const handleChangeAvatar = () => {
    // Generate a random style name or choose a specific style from DiceBear
    const pixel = "<pixel-art>"; // Replace with the desired style name

    // Set the avatar style
    setAvatarStyle(pixel-art);
  };

  return (
    <div className="main-bg flex items-center justify-center h-screen">
      <div className="container mx-auto bg-gray-600 p-8 rounded-lg">
        <div className="max-w-sm mx-auto mt-10">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
              {avatarStyle && (
                <img
                  src={`https://api.dicebear.com/6.x/${pixel-art}.svg`}
                  alt="Avatar"
                />
              )}
            </div>
            <ul className="list-disc text-white">
              <li>Username:</li>
              <li>Email:</li>
              <li>Password:</li>
            </ul>
            <div className="ml-auto">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                onClick={() => {
                  // Implement edit username logic
                }}
              >
                Edit
              </button>
            </div>
          </div>
          <div className="flex items-center">
            <div className="ml-auto">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                onClick={() => {
                  // Implement edit email logic
                }}
              >
                Edit
              </button>
              <button
                className="ml-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                onClick={() => {
                  // Implement edit password logic
                }}
              >
                Edit
              </button>
            </div>
          </div>
          <div className="flex flex-col mt-4">
            <button
              className="bg-black text-white font-semibold py-2 px-4 rounded"
              onClick={handleChangeAvatar}
            >
              Change Avatar
            </button>
            <button className="mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded">
              Delete Account
            </button>
          </div>
          {error && <div className="text-red-500 mt-4">{error}</div>}
        </div>
      </div>
    </div>
  );
}

export default Settings;
