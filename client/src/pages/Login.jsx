import "../styles/Login.css";
import LogoNav from "../components/Login/LogoNav";
import googleLogo from "../assets/google-logo.svg";
import {getAuth, GoogleAuthProvider, signInWithPopup,} from "firebase/auth";
import React, {useState} from "react";
import { BeatLoader } from "react-spinners";
import Notification from "../components/UI/Notification/Notification.jsx";
import {ERROR_MAP} from "../components/UI/Notification/ERROR_MAP.js";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '' });
  const googleProvider = new GoogleAuthProvider();
  const auth = getAuth();

  const handleLogin = () => {
    setLoading(true);
    fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        identifier: email,
        password: password
      })
    })
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            throw new Error(data.error);
          } else {
            localStorage.setItem('jwt', data.token);
            window.location.href = "/";
          }
        })
        .catch((error) => {
          setNotification({ show: true, message: ERROR_MAP[error.message] || "An error occurred during login. Please try again." });
        })
        .finally(() => {
          setLoading(false);  // stop loading regardless of success or error
        });
  };

  const handelGoogleLogin = () => {
    setLoading(true);  // start loading
    signInWithPopup(auth, googleProvider).then(() => {
      window.location.href = "/";
    }).finally(() => {
      setLoading(false);  // stop loading regardless of success or error
    });
  };

  const closeNotification = () => {
    setNotification({ show: false, message: '' });
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
                Email
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
                    'Login'
                )}
              </button>
              <div className="flex items-center justify-between mt-5">
                <div className="flex-1 bg-gray-500">
                  <hr
                      className="text-gray-500"
                      style={{ height: "1px", borderColor: "transparent" }}
                  />
                </div>
                <span className="mx-5 text-gray-500">or continue with</span>
                <div className="flex-1 w-1/4 bg-gray-500">
                  <hr
                      className="text-gray-500"
                      style={{ height: "1px", borderColor: "transparent" }}
                  />
                </div>
              </div>
              <button
                  onClick={handelGoogleLogin}
                  className="flex items-center justify-center w-full py-3 my-5 text-black bg-white rounded-full"
              >
                <img
                    src={googleLogo}
                    alt="Google Logo"
                    className="w-6 h-6 mr-2"
                />
                Google
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
        {notification.show && <Notification message={notification.message} onClose={closeNotification} />}
      </>
  );
}

export default Login;
