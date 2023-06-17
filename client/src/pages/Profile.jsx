import "../styles/Profile.css";
import React, { useContext, useEffect, useState } from "react";
import "../styles/Home.css";
import Navbar from "../components/UI/Navbar.jsx";
import AuthContext from "../components/context/AuthContext.jsx";
import userIcon from "../assets/profile.svg";

function Profile() {
  const { userData } = useContext(AuthContext);

  return (
    <>
      <div className="main-bg">
        <div className="h-[90%] m-auto max-w-7xl">
          <Navbar />
          <div className="flex main-container">
            <div>
              {userData && <h1 className="h1-s font-medium">{userData.username}</h1>}
              <div className="flex">
                <div className="min-w-[550px] min-h-[400px] p-8 rounded-lg profil-box-bg">
                  <div style={{ display: "flex" }}>
                    <div style={{ textAlign: "center" }}>
                      <img
                        src={userIcon}
                        alt="Avatar"
                        style={{ width: "120px", height: "120px" }}
                      />
                      <h3 className="h3-s" style={{ padding: "px" }}>X followers</h3>
                      <button className="button-s px-2 py-1 font-semibold text-white bg-black rounded-full">
                        Follow
                      </button>
                    </div>
                    <div style={{ display: "flex" }}>
                      <div className="values-container" style={{ marginLeft: "50px" }}>
                        <p>Best WPM: </p>
                        <p>Avg. WPM: </p>
                        <p>Games Played: </p>
                        <p>Levels Completed: </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h2 className="h2-s">Last Played:</h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="friends-container">
              <h1 className="h1-s font-medium">Friends</h1>
              <div className="friends">
                <div className="user-avatar">
                  <img
                    src={userIcon}
                    alt="Avatar"
                    style={{ width: "40px", height: "40px" }}
                  />
                </div>
                <div className="user-avatar">
                  <img
                    src={userIcon}
                    alt="Avatar"
                    style={{ width: "40px", height: "40px" }}
                  />
                </div>
                <div className="user-avatar">
                  <img
                    src={userIcon}
                    alt="Avatar"
                    style={{ width: "40px", height: "40px" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
