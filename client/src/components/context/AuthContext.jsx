import {useContext, createContext, useState, useEffect} from "react";
import {GoogleAuthProvider, signInWithPopup, signOut} from "firebase/auth";
import { auth } from "../../../db/firebase";

const AuthContext = createContext()

export const AuthContextProvider = ({children}) => {
    const [userId, setUserId] = useState({})
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
        console.log("Logged in", isLoggedIn, userId);
    }

    const logout = () => {
        setUserId({});
        setIsLoggedIn(false);
        console.log("Logged out", isLoggedIn, userId);
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
                    } else {
                        logout();
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    logout();
                });
        }
        console.log(isLoggedIn)
    }, []);

    return (
    <AuthContext.Provider value={{googleSignIn, logout, login, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  )
}

export const UserAuth = () => useContext(AuthContext)