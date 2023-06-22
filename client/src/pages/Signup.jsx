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
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
  });
  const { login } = useContext(AuthContext);

  // Validates email format:
  // - Starts with one or more alphanumeric characters, dots, underscores, percentage signs, or plus signs
  // - Followed by the at symbol
  // - Followed by one or more alphanumeric characters, dots, or dashes
  // - Ends with a dot and at least two alphabetic characters
  const validateEmail = (e) => {
    setEmail(e.target.value);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (e.target.value.length > 2) {
      setEmailError(!emailRegex.test(e.target.value));
    }
  };

  // Validates username format:
  // - Allows alphanumeric characters, dots, and underscores
  // - Must be between 3 and 20 characters long
  // - Cannot have consecutive dots or underscores
  // - Cannot start or end with a dot or underscore
  const validateUsername = (e) => {
    setUsername(e.target.value);
    const usernameRegex = /^(?=[a-zA-Z0-9._]{3,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
    if (e.target.value.length > 0) {
      setUsernameError(!usernameRegex.test(e.target.value));
    }
  };

  // Validates password format:
  // - Must contain at least one lowercase letter, one uppercase letter, and one digit
  // - Allows alphanumeric characters and dashes
  // - Must be at least 8 characters long
  const validatePassword = (e) => {
    setPassword(e.target.value);
    if(1 === 2){ // REMOVE THE IF STATEMENT BEFORE DEPLOYING
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d-]{8,}$/;
      setPasswordError(!passwordRegex.test(e.target.value));
    }
    setConfirmPasswordError(confirmPassword !== password);
  };

  const validateConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
    setConfirmPasswordError(e.target.value !== password);
  };

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if(usernameError) {
      alert("Invalid username");
      return;
    }

    if(passwordError) {
      alert("Invalid password");
      return;
    }

    setLoading(true);

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
                  className={`w-full px-4 py-3 my-2 text-black bg-white rounded-full transition-all duration-200 ${
                      usernameError ? "input-error" : ""
                  }`}
                  placeholder="Enter your username"
                  value={username}
                  onChange={validateUsername}
              />
              {usernameError && <p className="text-red-500">Invalid Username</p>}
              <h1 className="my-2 text-base font-medium leading-8 text-left text-white align-top">
                Email
              </h1>
              <input
                  type="email"
                  className={`w-full px-4 py-3 my-2 text-black bg-white rounded-full transition-all duration-200 ${
                      emailError ? "input-error" : ""
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
                  className={`w-full px-4 py-3 my-2 text-black bg-white rounded-full transition-all duration-200 ${
                      passwordError ? "input-error" : ""
                  }`}
                  placeholder="Enter your password"
                  value={password}
                  onChange={validatePassword}
              />
              {passwordError && <p className="text-red-500">Invalid Password. Must contain at least 8 characters, one uppercase, one lowercase, one number and one special character.</p>}
              <h1 className="my-2 text-base font-medium leading-8 text-left text-white align-top">
                Confirm Password
              </h1>
              <input
                  type="password"
                  className={`w-full px-4 py-3 my-2 mb-5 text-black bg-white rounded-full transition-all duration-200 ${
                      confirmPasswordError ? "input-error" : ""
                  }`}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={validateConfirmPassword}
              />
              {confirmPasswordError && <p className="text-red-500">Passwords do not match.</p>}
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
