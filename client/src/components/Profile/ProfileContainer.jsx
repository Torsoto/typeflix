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
  const [validFollowing, setValidFollowing] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [followersCount, setFollowersCount] = useState(0);

  //check if the following-user still exists
  useEffect(() => {
    Promise.all(
      following.map((followingUser) =>
        fetch(`http://localhost:3000/checkUserExists?username=${followingUser}`)
          .then((response) => response.json())
          .then((data) => data.exists && followingUser)
      )
    ).then((data) => {
      setValidFollowing(data.filter((item) => item));
    });
  }, [following]);

  // Initializes component state based on the provided username and the currently logged-in user.
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

  // Fetches the list of users that the specified user is following and updates the 'following' state.
  useEffect(() => {
    fetch("http://localhost:3000/getFollowing?username=" + username.username)
      .then((response) => response.json())
      .then((data) => setFollowing(data))
      .catch((e) => console.error(e));
  }, []);

  // Updates the user icon state whenever the customUserData state changes.
  useEffect(() => {
    setUserIcon(customUserData.avatar);
  }, [customUserData]);

  // Sends a request to the server to follow the specified user and updates the component state accordingly.
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

  // Sends a request to the server to unfollow the specified user and updates the component state accordingly.
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

  // Fetches the list of followers for the specified user and updates the 'followers' state.
  const handleShowFollowers = () => {
    setShowFollowers(true);
    fetch(`http://localhost:3000/getFollowers?username=${username.username}`)
      .then((response) => response.json())
      .then((data) => setFollowers(data))
      .catch((e) => console.error(e));
  };

  // Hides the list of followers.
  const handleCloseFollowers = () => {
    setShowFollowers(false);
  };

  // Fetches the number of followers for the specified user and updates the 'followersCount' state.
  useEffect(() => {
    fetch(
      `http://localhost:3000/getFollowersCount?username=${username.username}`
    )
      .then((response) => response.json())
      .then((data) => setFollowersCount(data.count))
      .catch((e) => console.error(e));
  }, [username]);

  // Fetches the avatars of all users that the specified user is following and updates the 'followingAvatars' state.
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
    <div className="flex justify-center main-container">
      <div>
        <h1 className="font-medium h1-s">{customUserData.username}</h1>
        <div className="flex">
          <div className="min-w-[550px] min-h-[400px] p-8 rounded-lg profil-box-bg">
            <div className="flex">
              <div className="flex flex-col justify-around text-center">
                <img
                  src={avatarUrl ? userIcon : plainProfileImage}
                  alt="Avatar"
                  className="rounded-full w-[120px] h-[120px] bg-white"
                />
                <div className="h-[35px] flex justify-center items-center">
                  <h3
                    className="followAccount h3-s py-[10px]"
                    onClick={handleShowFollowers}
                  >
                    {followersCount} followers
                  </h3>
                </div>
                {showFollowers && (
                  <div className="popup ">
                    <div className="rounded-lg popup-content">
                      <span className="close" onClick={handleCloseFollowers}>
                        &times;
                      </span>
                      <ul>
                        {followers.map((follower) => (
                          <li key={follower}>{follower}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                {!isSameProfile && (
                  <button
                    className={`button-s px-2 py-1 font-semibold ${isFollowing
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
                  <p>
                    Best WPM:{" "}
                    <span className="text-white">{customUserData.bestwpm}</span>
                  </p>
                  <p>
                    Avg. WPM:{" "}
                    <span className="text-white">
                      {customUserData.avgwpm !== undefined
                        ? Number.isInteger(customUserData.avgwpm)
                          ? customUserData.avgwpm
                          : customUserData.avgwpm.toFixed(2)
                        : "0"}
                    </span>
                  </p>
                  <p>
                    Games Played:{" "}
                    <span className="text-white">
                      {customUserData.gamesplayed}
                    </span>
                  </p>
                  <p>
                    Levels Completed:{" "}
                    <span className="text-white">
                      {customUserData.themescompleted}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="h2-s">Last Played:</h2>
            </div>
          </div>
        </div>
      </div>
      {validFollowing.length > 0 && (
        <div className="following-container">
          <h1 className="font-medium h1-s">Following</h1>
          <div className="following">
            {validFollowing.map((followingUser) => {
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
