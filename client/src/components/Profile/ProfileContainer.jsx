import plainProfileImage from "../../assets/profile.svg";
import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext.jsx";
import userIcon from "../../assets/profile.svg";

export const ProfileContainer = (username) => {
  const { fetchData, userData, avatarUrl, updateUserData } =
    useContext(AuthContext);
  const [customUserData, setCustomUserData] = useState("");
  const [isSameProfile, setIsSameProfile] = useState(false);
  const [following, setFollowing] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [userIcon, setUserIcon] = useState("");
  const [followingAvatars, setFollowingAvatars] = useState([]);

  useEffect(() => {
    if (userData.username === username.username) {
      setCustomUserData(userData);
      setIsSameProfile(true);
      setUserIcon(avatarUrl);
    } else {
      setIsSameProfile(false);
    }
    fetchData(username.username).then((response) => {
      setCustomUserData(response);
      setUserIcon(customUserData.avatar);
      if (userData.following) {
        setIsFollowing(userData.following.includes(username.username));
      }
    });
  }, []);

  useEffect(() => {
    fetch("http://localhost:3000/getFollowing?username=" + username.username)
      .then((response) => response.json())
      .then((data) => setFollowing(data))
      .catch((e) => console.error(e));
  }, []);

  useEffect(() => {
    setUserIcon(customUserData.avatar);
  }, [customUserData]);

  const handleFollow = async () => {
    const response = await fetch("http://localhost:3000/follow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: userData.username,
        toFollowUsername: customUserData.username,
      }),
    });

    const responseData = await response.json();
    if (response.ok || response.status === 409) {
      setIsFollowing(true);
      updateUserData(userData.username);
    } else {
      alert(responseData.error);
    }
  };

  const handleUnfollow = async () => {
    const response = await fetch("http://localhost:3000/unfollow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: userData.username,
        toUnfollowUsername: customUserData.username,
      }),
    });

    const responseData = await response.json();
    if (response.ok || response.status === 409) {
      setIsFollowing(false);
      updateUserData(userData.username);
    } else {
      alert(responseData.error);
    }
  };

  useEffect(() => {
    Promise.all(
      following.map((followingUser) =>
        fetch(`http://localhost:3000/getAvatar?username=${followingUser}`)
          .then((response) => response.text())
          .then((data) => ({ following: followingUser, avatar: data }))
      )
    ).then((data) => {
      setFollowingAvatars(data);
      console.log(data);
    });
  }, [following]);

  return (
    <div className="flex main-container justify-center">
      <div>
        <h1 className="h1-s font-medium">{customUserData.username}</h1>
        <div className="flex">
          <div className="min-w-[550px] min-h-[400px] p-8 rounded-lg profil-box-bg">
            <div className="flex">
              <div className="text-center flex justify-around flex-col">
                <img
                  src={avatarUrl ? userIcon : plainProfileImage}
                  alt="Avatar"
                  className="rounded-full w-[120px] h-[120px] bg-white"
                />
                <h3 className="h3-s py-[10px]">0 followers</h3>
                {!isSameProfile && (
                  <button
                    className={`button-s px-2 py-1 font-semibold ${
                      isFollowing
                        ? "bg-white text-black"
                        : "bg-black text-white"
                    } rounded-full`}
                    onClick={isFollowing ? handleUnfollow : handleFollow}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </button>
                )}
              </div>
              <div className="flex">
                <div className="values-container ml-[50px]">
                  <p>Best WPM: {customUserData.bestwpm}</p>
                  <p>
                    Avg. WPM:{" "}
                    {customUserData.avgwpm !== undefined
                      ? customUserData.avgwpm.toFixed(2)
                      : "0"}
                  </p>
                  <p>Games Played: {customUserData.gamesplayed}</p>
                  <p>Levels Completed: {customUserData.themescompleted}</p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="h2-s">Last Played:</h2>
            </div>
          </div>
        </div>
      </div>
      {following.length > 0 && (
        <div className="following-container">
          <h1 className="h1-s font-medium">Following</h1>
          <div className="following">
            {following.map((followingUser) => {
              const followingAvatar = followingAvatars.find(
                (item) => item.following === followingUser
              )?.avatar;
              return (
                <div
                  key={followingUser}
                  className="user-avatar flex text-white gap-[12px]"
                >
                  <img
                    src={followingAvatar || plainProfileImage}
                    alt="Avatar"
                    className="rounded-full w-[50px] h-[50px] bg-white"
                  />
                  <a href={`/${followingUser}`}>
                    <p className="mt-[9px] text-xl">{followingUser}</p>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
