import React, {useEffect, useState} from "react";
import "./styles/App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile.jsx";
import Training from "./pages/Training";
import {Route, Routes} from "react-router-dom";
import {GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import {auth} from "../db/firebase.js";
import AuthContext from "../src/components/context/AuthContext.jsx";

function App() {
    const [userId, setUserId] = useState("");
    const [userData, setUserData] = useState(null);
    const [text, setText] = useState(`TEST TEST TEST TEST TEST TEST TEST TEST TEST`);
    const [isLoggedIn, setIsLoggedIn] = useState({})
    const [gradientColor, setGradientColor] = React.useState('#313131');
    const [Img, setImg] = useState("https://i.imgur.com/oQUOXS8.png");
    const [time, setTime] = useState(60);
    const [avatarUrl, setAvatarUrl] = useState("");

    useEffect(() => {
        if (userId.length > 0) {
            fetchData().then((data) =>{
                setUserData(data);
                setAvatarUrl(data.avatar);
            })
        }
    }, [userId]);

    const fetchData = async () => {
        try {
            const response = await fetch(`http://localhost:3000/${userId}`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return await response.json();
        } catch (error) {
            console.error(
                "There has been a problem with your fetch operation: ",
                error.message
            );
        }
    };

    const googleSignIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then(() => {
                window.location.href = "/";
            })
            .then(() => {
                login();
            })
            .then(r => console.log(r)).catch(e => console.log(e))
    }

    const login = (newUser) => {
        setUserId(newUser);
        setIsLoggedIn(true);
    }

    const logout = () => {
        setUserId("");
        setIsLoggedIn(false);
        localStorage.removeItem('jwt');
    }

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        if (token) {
            fetch('http://localhost:3000/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.valid) {
                        login(data.token);
                        setUserId(data.username);
                    } else {
                        logout();
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    logout();
                });
        } else {
            logout();
        }
    }, []);

    return (
        <>
            <AuthContext.Provider value={{ googleSignIn, logout, login, isLoggedIn, text, setText, gradientColor, setGradientColor, setImg, Img, time, setTime, userId, userData, avatarUrl, setAvatarUrl }}>
                <Routes>
                    <Route path="/" element={<Home />}></Route>
                    <Route path="/login" element={<Login />}></Route>
                    <Route path="/signup" element={<Signup />}></Route>
                    <Route path="/settings" element={<Settings></Settings>}></Route>
                    <Route path="/profile" element={<Profile></Profile>}></Route>
                    <Route path="/training" element={<Training />}></Route>
                </Routes>
            </AuthContext.Provider>
        </>
    );
}

export default App;
