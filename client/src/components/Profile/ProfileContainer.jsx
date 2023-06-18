import plainProfileImage from "../../assets/profile.svg";
import React, {useContext, useEffect, useState} from "react";
import AuthContext from "../context/AuthContext.jsx";
import userIcon from "../../assets/profile.svg";

export const ProfileContainer = (username) => {

    const { fetchData, userData, avatarUrl } = useContext(AuthContext);
    const [customUserData, setCustomUserData] = useState("");
    const [isSameProfile, setIsSameProfile] = useState(false);
    const [friends, setFriends] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [userIcon, setUserIcon] = useState("");

    useEffect(() => {
        if (userData.username === username.username) {
            setCustomUserData(userData);
            setIsSameProfile(true);
            setUserIcon(avatarUrl);
        } else {
            fetchData(username.username)
                .then((response) => {
                    setCustomUserData(response);
                    setIsSameProfile(false);
                    if (userData.friends) {
                        setIsFollowing(userData.friends.includes(username.username));
                    }
                });
        }
    }, []);

    useEffect(() => {
        fetch('http://localhost:3000/getFriends?username=' + username.username)
            .then(response => response.json())
            .then(data => setFriends(data))
            .catch(e => console.error(e));
    }, []);

    useEffect(() => {
        setUserIcon(customUserData.avatar);
    }, [customUserData]);

    const handleAddFriend = async () => {
        const response = await fetch('http://localhost:3000/addFriend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: userData.username,
                friendUsername: customUserData.username,
            }),
        });

        const responseData = await response.json();
        if (response.ok ||response.status === 409) {
            setIsFollowing(true);
        } else {
            alert(responseData.error);
        }
    }

    const handleRemoveFriend = async () => {
        const response = await fetch('http://localhost:3000/removeFriend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: userData.username,
                friendUsername: customUserData.username,
            }),
        });

        const responseData = await response.json();
        if (response.ok ||response.status === 409) {
            setIsFollowing(false);
        } else {
            alert(responseData.error);
        }
    }

    return (
        <div className="flex main-container">
            <div>
                <h1 className="h1-s font-medium">{customUserData.username}</h1>
                <div className="flex">
                    <div className="min-w-[550px] min-h-[400px] p-8 rounded-lg profil-box-bg">
                        <div className="flex">
                            <div className="text-center flex justify-between flex-col">
                                <img
                                    src={avatarUrl ? userIcon : plainProfileImage}
                                    alt="Avatar"
                                    className="rounded-full w-[120px] h-[120px]"
                                />
                                <h3 className="h3-s py-[10px]">0 followers</h3>
                                {!isSameProfile &&
                                    <button
                                        className={`button-s px-2 py-1 font-semibold ${isFollowing ? "bg-white text-black" : "bg-black text-white"} rounded-full`}
                                        onClick={isFollowing ? handleRemoveFriend : handleAddFriend}
                                    >
                                        {isFollowing ? "Unfollow" : "Follow"}
                                    </button>
                                }
                            </div>
                            <div className="flex">
                                <div className="values-container ml-[50px]">
                                    <p>Best WPM: {customUserData.bestwpm}</p>
                                    <p>Avg. WPM: {customUserData.avgwpm}</p>
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
            {friends.length > 0 && (
                <div className="friends-container">
                    <h1 className="h1-s font-medium">Friends</h1>
                    <div className="friends">
                        {friends.map((friend) => (
                            <div key={friend} className="user-avatar flex text-white gap-[12px]">
                                <img
                                    src={plainProfileImage}
                                    alt="Avatar"
                                    className="rounded-full w-[40px] h-[40px]"
                                />
                                <h1 className="-mt-[-6.5px]">{friend}</h1>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}