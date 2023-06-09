import React, { useEffect, useState } from "react";
import "./styles/App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Signup from "./pages/Signup";
import {AuthContextProvider} from "./components/context/AuthContext.jsx";

function App() {
  return (
    <>
        <AuthContextProvider>
            <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/signup" element={<Signup />}></Route>
                <Route path="/settings" element={<Settings></Settings>}></Route>
            </Routes>
        </AuthContextProvider>
    </>
  );
}

export default App;
