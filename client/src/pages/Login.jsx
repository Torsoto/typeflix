import LogoNav from "../components/UI/LogoNav";
import React, { useContext, useState } from "react";
import { BeatLoader } from "react-spinners";
import Notification from "../components/Notification/Notification.jsx";
import { ERROR_MAP } from "../components/Notification/ERROR_MAP.js";
import AuthContext from "../components/context/AuthContext.jsx";
import "../styles/App.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
  });
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          identifier: email.toLowerCase(),
          password: password,
        }),
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      } else {
        localStorage.setItem("jwt", data.token);
        login(data.token);
        window.location.href = "/";
      }
    } catch (error) {
      setNotification({
        show: true,
        message:
          ERROR_MAP[error.message] ||
          "An error occurred during login. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const closeNotification = () => {
    setNotification({ show: false, message: "" });
  };

  return (
    <>
      <div className="main-bg">
        <div className="m-auto max-w-7xl">
          <a href="/">
            <LogoNav />
          </a>
          <div
            className="flex-col justify-center max-w-md mx-auto my-3"
            style={{
              height: "calc(100vh - 180px)",
            }}
          >
            <h1 className="py-3 mb-10 text-3xl font-bold leading-10 text-left text-white align-top">
              Log in
            </h1>
            <h1 className="my-2 text-base font-medium leading-8 text-left text-white align-top">
              Email or Username
            </h1>
            <input
              type="text"
              className="w-full px-4 py-3 my-2 text-black bg-white rounded-full"
              placeholder="Enter your username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <h1 className="my-2 text-base font-medium leading-8 text-left text-white align-top">
              Password
            </h1>
            <input
              type="password"
              className="w-full px-4 py-3 my-2 text-black bg-white rounded-full"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="flex items-center justify-center w-full py-3 my-8 font-bold text-white bg-black rounded-full"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <div className="h-[24px]">
                  <BeatLoader color="#FFFFFF" size={8} />
                </div>
              ) : (
                "Login"
              )}
            </button>
            <div className="flex items-center justify-center mt-5">
              <span className="text-gray-500">Don’t have an account yet?</span>
              <a href="/signup" className="ml-2 text-white">
                Sign up for free
              </a>
            </div>
          </div>
        </div>
      </div>
      {notification.show && (
        <Notification
          message={notification.message}
          onClose={closeNotification}
        />
      )}
    </>
  );
}

export default Login;
