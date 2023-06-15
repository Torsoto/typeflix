import "../styles/Signup.css";
import LogoNav from "../components/UI/LogoNav";
import React, { useContext, useState } from "react";
import { BeatLoader } from "react-spinners"; // import the spinner
import Notification from "../components/Notification/Notification.jsx";
import { ERROR_MAP } from "../components/Notification/ERROR_MAP.js";
import AuthContext from "../components/context/AuthContext.jsx";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [loading, setLoading] = useState(false); // new loading state
  const [notification, setNotification] = useState({
    show: false,
    message: "",
  });
  const { login } = useContext(AuthContext);

  const validateEmail = (e) => {
    setEmail(e.target.value);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (e.target.value.length > 2) {
      setEmailError(!emailRegex.test(e.target.value));
    }
  };

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true); // start loading
    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.toLowerCase(),
          email: email.toLowerCase(),
          password: password,
        }),
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      } else {
        console.log(`Successfully created new user with id: ${data.uid}`);
        localStorage.setItem("jwt", data.token);
        login(data.token);
        window.location.href = "/";
      }
    } catch (error) {
      console.log(error.message);
      setNotification({
        show: true,
        message:
          ERROR_MAP[error.message] ||
          "An error occurred during signup. Please try again.",
      });
    } finally {
      setLoading(false); // stop loading regardless of success or error
    }
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
              Sign up
            </h1>
            <h1 className="my-2 text-base font-medium leading-8 text-left text-white align-top">
              Username
            </h1>
            <input
              type="text"
              className="w-full px-4 py-3 my-2 text-black bg-white rounded-full"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <h1 className="my-2 text-base font-medium leading-8 text-left text-white align-top">
              Email
            </h1>
            <input
              type="email"
              className={`w-full px-4 py-3 my-2 text-black bg-white rounded-full transition-all duration-200 ${
                emailError ? "email-input-error" : ""
              }`}
              placeholder="Enter your email"
              value={email}
              onChange={validateEmail}
            />
            {emailError && <p className="text-red-500">Invalid Email</p>}
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
            <h1 className="my-2 text-base font-medium leading-8 text-left text-white align-top">
              Confirm Password
            </h1>
            <input
              type="password"
              className="w-full px-4 py-3 my-2 mb-5 text-black bg-white rounded-full"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              onClick={handleSignup}
              className="flex items-center justify-center w-full py-3 my-8 font-bold text-white bg-black rounded-full"
              disabled={loading}
            >
              {loading ? (
                <div className="h-[24px]">
                  <BeatLoader color="#FFFFFF" size={8} />
                </div>
              ) : (
                "Sign up"
              )}
            </button>
            <div className="flex items-center justify-center "></div>
            <div className="flex items-center justify-center ">
              <span className="text-gray-500">Already have an account?</span>
              <a href="/login" className="ml-2 text-white">
                Log in
              </a>
            </div>
          </div>
        </div>
      </div>
      {notification.show && <Notification message={notification.message} />}
    </>
  );
}

export default Signup;
