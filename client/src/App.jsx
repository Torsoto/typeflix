import React, { useEffect, useState } from "react";
import "./styles/App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile.jsx";
import Training from "./pages/Training";
import { Route, Routes, Navigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../db/firebase.js";
import AuthContext from "../src/components/context/AuthContext.jsx";

function App() {
    const [userId, setUserId] = useState("");
    const [userData, setUserData] = useState(null);
    const [text, setText] = useState(`TEST TEST TEST TEST TEST TEST TEST TEST TEST`);
    const [isLoggedIn, setIsLoggedIn] = useState({});
    const [gradientColor, setGradientColor] = React.useState('#313131');
    const [Img, setImg] = useState("https://i.imgur.com/oQUOXS8.png");
    const [time, setTime] = useState(60);
    const [avatarUrl, setAvatarUrl] = useState("");
    const [title, setTitle] = useState(null);
    const [selectedLevelIndex, setSelectedLevelIndex] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("jwt");
        if (token) {
            fetch("http://localhost:3000/validate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.valid) {
                        login(data.token);
                        setUserId(data.username);
                    } else {
                        logout();
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                    logout();
                });
        } else {
            logout();
        }
    }, []);

    useEffect(() => {
        if (userId.length > 0) {
            fetchData().then((data) => {
                setUserData(data);
                setAvatarUrl(data.avatar);
            });
        }
    }, [userId]);

    const googleSignIn = (email) => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                const idToken = user.getIdToken();

                fetch("http://localhost:3000/googleLogin", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email: email, id: user.uid }),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.token) {
                            localStorage.setItem("jwt", data.token);
                            login(data.username);
                        } else {
                            throw new Error("Error generating JWT token");
                        }
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                    });
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    const login = (newUser) => {
        console.log(newUser)
        setUserId(newUser);
        setIsLoggedIn(true);
    };

    const logout = () => {
        setUserId("");
        setIsLoggedIn(false);
        localStorage.removeItem("jwt");
    };

    const fetchData = async () => {
        try {
            const response = await fetch(`http://localhost:3000/${userId}`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return await response.json();
        } catch (error) {
            console.error("There has been a problem with your fetch operation: ", error.message);
        }
    };

    return (
        <>
            <AuthContext.Provider
                value={{
                    googleSignIn,
                    logout,
                    login,
                    isLoggedIn,
                    text,
                    setText,
                    gradientColor,
                    setGradientColor,
                    setImg,
                    Img,
                    time,
                    setTime,
                    userId,
                    userData,
                    avatarUrl,
                    setAvatarUrl,
                    title,
                    setTitle,
                    selectedLevelIndex,
                    setSelectedLevelIndex,
                }}
            >
                <Routes>
                    <Route path="/login"
                           element={isLoggedIn ? <Navigate to="/" /> : <Login />}
                    />
                    <Route path="/signup"
                           element={isLoggedIn ? null : <Signup />}
                    />
                    <Route path="/"
                           element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/settings"
                        element={isLoggedIn ? <Settings /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/profile"
                        element={isLoggedIn ? <Profile /> : <Navigate to="/login" />}
                    />
                    <Route path="/training"
                           element={isLoggedIn ? <Training /> : <Navigate to="/login" />}
                    />
                </Routes>
            </AuthContext.Provider>
        </>
    );
}

export default App;
