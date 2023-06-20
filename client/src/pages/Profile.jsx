import "../styles/Profile.css";
import React, { useContext, useEffect, useState } from "react";
import "../styles/Home.css";
import Navbar from "../components/UI/Navbar.jsx";
import AuthContext from "../components/context/AuthContext.jsx";
import { ProfileContainer } from "../components/Profile/ProfileContainer.jsx";
import { useParams } from "react-router-dom";

function Profile() {
  const { username } = useParams();
  const { userData } = useContext(AuthContext);

  return (
    <>
      <div className="main-bg">
        <Navbar />
        <div className="m-auto max-w-7xl">
          <div className="h-[90%] m-auto max-w-7xl">
            {userData &&
              <ProfileContainer username={username} />
            }
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
