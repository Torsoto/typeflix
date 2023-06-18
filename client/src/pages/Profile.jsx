import "../styles/Profile.css";
import React, { useContext, useEffect, useState } from "react";
import "../styles/Home.css";
import Navbar from "../components/UI/Navbar.jsx";
import AuthContext from "../components/context/AuthContext.jsx";
import {ProfileContainer} from "../components/Profile/ProfileContainer.jsx";

function Profile() {
  const { userData } = useContext(AuthContext);

  return (
    <>
      <div className="main-bg">
          <div className="m-auto max-w-7xl">
              <Navbar />
                <div className="h-[90%] m-auto max-w-7xl">
                  {userData &&
                      // <ProfileContainer username="tolga"/>
                      <ProfileContainer username={userData.username}/>
                  }
                </div>
          </div>
      </div>
    </>
  );
}

export default Profile;
