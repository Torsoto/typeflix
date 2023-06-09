import React, {useContext, useEffect, useState} from 'react';
import "../styles/Home.css";
import Navbar from "../components/Home/Navbar.jsx";
import AuthContext from "../components/context/AuthContext.jsx";

function Profile() {
    const [userData, setUserData] = useState(null);
    const { userId } = useContext(AuthContext);

    useEffect(() => {
        console.log(userId)
        console.log(`http://localhost:3000/${userId}`)
        fetch(`http://localhost:3000/${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => setUserData(data))
            .catch(error => console.error('There has been a problem with your fetch operation: ', error.message));
    }, [userId]);

    return (
        <>
            <div className="main-bg">
                <div className="h-[90%] m-auto max-w-7xl">
                    <Navbar />
                    <div>
                        {/* Here you can use the user data. For example: */}
                        {userData && <p>Welcome, {userData.username}!</p>}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Profile;
