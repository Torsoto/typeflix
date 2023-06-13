import React, { useEffect, useState } from "react";
import "./styles/App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile.jsx";
import { Route, Routes } from "react-router-dom";
import {GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import {auth} from "../db/firebase.js";
import AuthContext from "../src/components/context/AuthContext.jsx";

function App() {
    const [userId, setUserId] = useState("");
    const [text, setText] = useState(`The bush began to shake. Brad couldn't see what was causing it to shake, but he didn't care. he had a pretty good idea about what was going on and what was happening. He was so confident that he approached the bush carefree and with a smile on his face. That all changed the instant he realized what was actually behind the bush. She sat in the darkened room waiting. It was now a standoff. He had the power to put her in the room, but not the power to make her repent. It wasn't fair and no matter how long she had to endure the darkness, she wouldn't change her attitude. At three years old, Sandy's stubborn personality had already bloomed into full view.`
        .toLowerCase()
        .split(""));
    const [isLoggedIn, setIsLoggedIn] = useState({})

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
        <AuthContext.Provider value={{googleSignIn, logout, login, isLoggedIn, userId, text, setText }}>
            <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/signup" element={<Signup />}></Route>
                <Route path="/settings" element={<Settings></Settings>}></Route>
                <Route path="/profile" element={<Profile></Profile>}></Route>
            </Routes>
        </AuthContext.Provider>
    </>
  );
}

export default App;
