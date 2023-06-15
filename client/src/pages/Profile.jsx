import React, { useContext, useEffect, useState } from "react";
import "../styles/Home.css";
import Navbar from "../components/UI/Navbar.jsx";
import AuthContext from "../components/context/AuthContext.jsx";
import "../styles/Profile.css";

function Profile() {
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

  return (
    <>
      <div className="main-bg">
        <div className="h-[90%] m-auto max-w-7xl">
          <Navbar />
          <div>
            {/* Here you can use the user data. For example: */}
            {userData && <p>Welcome, {userData.username}!</p>}
          </div>{" "}
          <div style={{ backgroundColor: "gray", padding: "20px" }}>
            <div style={{ display: "flex" }}>
              <div style={{ marginLeft: "20px" }}>
                <p>Best WPM: </p>
                <p>Avg. WPM: </p>
                <p>Accuracy: </p>
                <p>Games Played: </p>
                <p>Duels Win/Lose Ratio:</p>
                <p>Bosses Defeated: </p>
              </div>
            </div>
            <p style={{ marginTop: "20px" }}>Last Played:</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
