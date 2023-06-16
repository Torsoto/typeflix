import React, { useContext, useEffect, useState } from "react";
import "../styles/Home.css";
import Navbar from "../components/UI/Navbar.jsx";
import AuthContext from "../components/context/AuthContext.jsx";
import "../styles/Profile.css";
import userIcon from "../assets/profile.svg";

function Profile() {
  const { userData } = useContext(AuthContext);

  return (
    <>
      <div className="main-bg">
        <div className="h-[90%] m-auto max-w-7xl">
          <Navbar />
          <div className="flex">
            <div>
              {userData && <h1>{userData.username}</h1>}
              <div className="flex">
                <div class="container  p-8 rounded-lg profil-box-bg">
                  <div style={{ display: "flex" }}>
                    <div style={{ textAlign: "center" }}>
                      <img
                        src={userIcon}
                        alt="Avatar"
                        style={{ width: "120px", height: "120px" }}
                      />
                      <h3 style={{ padding: "px" }}>X followers</h3>
                      <button className="px-2 py-1 font-semibold text-white bg-black rounded-full">
                        Follow
                      </button>
                    </div>
                    <div style={{ display: "flex" }}>
                      <div style={{ marginLeft: "50px" }}>
                        <p>Best WPM: </p>
                        <p>Avg. WPM: </p>
                        <p>Games Played: </p>
                        <p>Levels Completed: </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h2>Last Played:</h2>
                  </div>
                </div>
              </div>
            </div>
            <div class="friends-container">
              <h1>Friends</h1>
              <div class="friends">
                <div class="user-avatar">
                  <img
                    src={userIcon}
                    alt="Avatar"
                    style={{ width: "40px", height: "40px" }}
                  />
                </div>
                <div class="user-avatar">
                  <img
                    src={userIcon}
                    alt="Avatar"
                    style={{ width: "40px", height: "40px" }}
                  />
                </div>
                <div class="user-avatar">
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
