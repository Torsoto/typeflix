import "../styles/Signup.css";
import LogoNav from "../components/Login/LogoNav";
import googleLogo from "../assets/google-logo.svg";
import React, { useState } from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const googleProvider = new GoogleAuthProvider();
  const auth = getAuth();

  const validateEmail = (e) => {
    setEmail(e.target.value);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (e.target.value.length > 2) {
      setEmailError(!emailRegex.test(e.target.value));
    }
  };

  const handelGoogleSignUp = async () => {
    await signInWithPopup(auth, googleProvider).then(() => {
      window.location.href = "/";
    });
  };

  const handleSignup = () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    fetch("http://localhost:3000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
      }),
    })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            throw new Error(data.error);
          } else {
            // Alert with the user's uid
            console.log(`Successfully created new user with id: ${data.uid}`);

            // You can do something with the user's uid here if you want
            window.location.href = "/";
          }
        })
        .catch((error) => {
          // An error occurred during registration...
          alert(error.message);
        });
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
              >
                Sign up
              </button>
              <div className="flex items-center justify-center my-5">
                <div className="w-16 h-0.5 bg-white"></div>
                <p className="mx-5 text-white">or</p>
                <div className="w-16 h-0.5 bg-white"></div>
              </div>
              <button
                  onClick={handelGoogleSignUp}
                  className="flex items-center justify-center w-full py-3 my-5 text-black bg-white rounded-full"
              >
                <img src={googleLogo} alt="" className="w-6 h-6 mr-3" />
                Sign up with Google
              </button>
            </div>
          </div>
        </div>
      </>
  );
}

export default Signup;
