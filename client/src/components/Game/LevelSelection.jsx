import React, { useContext, useEffect, useState } from "react";
import "../../styles/LevelSelection.css";
import Game from "./Game.jsx";
import AuthContext from "../context/AuthContext.jsx";
import { IoIosArrowBack } from "react-icons/io";

const LevelSelection = () => {
  const [movies, setMovies] = useState([]);
  const [fadeOut, setFadeOut] = useState(false);
  const [title, setTitle] = useState(null);
  const [poster, setPoster] = useState(null);
  const [levels, setLevels] = useState([]);
  const [showLevels, setShowLevels] = useState(false);
  const [selectedLevelIndex, setSelectedLevelIndex] = useState(false);
  const [showHomeGame, setShowHomeGame] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false);
  const [gameOpacity, setGameOpacity] = useState(0);

  const { setText, setGradientColor, setImg } = useContext(AuthContext);

  useEffect(() => {
    fetchMovieList();
  }, []);

  useEffect(() => {
    let timer1 = null;
    if (fadeOut) {
      timer1 = setTimeout(() => {
        setMovies([]);
        setShowLevels(true);
        setFadeOut(false);
      }, 200);
    }
    return () => {
      clearTimeout(timer1);
    };
  }, [fadeOut]);

  const fetchMovieList = async () => {
    try {
      const response = await fetch("http://localhost:3000/movies");
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error("Error fetching movie list:", error);
    }
  };

  const handleMovieClick = async (movieName, img) => {
    setPoster(img);
    setTitle(movieName);
    try {
      const response = await fetch(
        `http://localhost:3000/movies/${movieName}`
      );
      const data = await response.json();

      // Update the levels state
      setLevels(
        Array(data.count)
          .fill()
          .map((_, i) => i + 1)
      );

      setGradientColor(data.color)
      console.log(data)
      setShowBackButton(true);
      setFadeOut(true);
    } catch (error) {
      console.error(`Error fetching levels for movie ${movieName}:`, error);
    }
  };

  const handleBackClick = () => {
    if (showHomeGame) {
      // If the game is currently being shown, go back to the level selection
      setShowHomeGame(false);
      setShowLevels(true);
      setGameOpacity(0);
    } else {
      // If the level selection is being shown, go back to the movie selection
      setGradientColor('#313131')
      setShowLevels(false);
      setShowBackButton(false);
      fetchMovieList();
    }
  };

  const renderMovies = () => {
    return movies.map((movie, index) => (
      <div
        key={index}
        className={`flex flex-col items-center m-2 ${fadeOut ? "fade-out" : "fade-in"
          }`}
      >
        <div
          className="min-w-[376px] min-h-[224px] bg-cover bg-center rounded-3xl border-4 border-white cursor-pointer"
          style={{ backgroundImage: `url('${movie.poster}')` }}
          onClick={() => handleMovieClick(movie.title, movie.poster)}
        ></div>
        <p className="mt-4 text-xl font-medium text-center text-white">
          {movie.title}
        </p>
      </div>
    ));
  };

  const renderLevels = () => {
    return levels.map((level) => {
      const handleLevelSelection = async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/movies/${encodeURIComponent(
              title
            )}/levels/${level}`
          );
          const data = await response.json();
          console.log(data.text);
          setText(data.text);
          setImg(data.img);
          setSelectedLevelIndex(level)
          setFadeOut(true);  // trigger the fade-out transition

          setTimeout(() => {
            setFadeOut(false);  // stop the fade-out transition
            setShowLevels(false);  // hide the level options
            setShowHomeGame(true);  // show the home game
            setGameOpacity(1);  // fully show the home game (after the fade-in transition)
            setShowBackButton(true);  // show the back button
          }, 200);
        } catch (error) {
          console.error(error);
        }
      };

      return (
        <div
          key={level}
          className={`flex flex-col items-center m-2 ${fadeOut ? "fade-out" : "fade-in"
            }`}
        >
          <div
            className="min-w-[376px] min-h-[224px] rounded-3xl cursor-pointer relative"
            style={{ position: "relative", overflow: "hidden" }}
            onClick={handleLevelSelection}
          >
            <div
              className="absolute inset-0 bg-center bg-cover rounded-3xl"
              style={{
                backgroundImage: `url('${poster}')`,
                filter: "blur(5px)",
              }}
            ></div>
            <div
              className="absolute inset-0 border-4 border-white rounded-3xl"
              style={{ boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.3)", zIndex: 1 }}
            ></div>
            <p
              className="absolute z-10 text-xl font-medium text-center text-white transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
              style={{ textShadow: "0px 1px 6px #000000" }}
            >
              Level {level}
            </p>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="h-[100%]">
      <div className="mx-auto text-white">
        <div className="text-2xl font-medium text-center">
          <div className="grid grid-cols-3">
            <div className="flex items-center">
              {showBackButton && (
                <button
                  style={{
                    opacity: fadeOut ? "0" : "1",
                    transition: "opacity 0.5s",
                  }}
                  onClick={handleBackClick}
                >
                  <div className="flex flex-row items-center justify-center text-xl font-normal">
                    <IoIosArrowBack className="mr-1" /> Back
                  </div>
                </button>
              )}
            </div>
            <p className="my-10">
              {!showHomeGame
                ? (showLevels ? `Select Level` : "Select Movie")
                : `Level ${selectedLevelIndex}`
              }
            </p>
          </div>
        </div>
        {showHomeGame ? (
          <div style={{ opacity: gameOpacity, transition: "all 0.3s" }} className={fadeOut ? "fade-out" : "fade-in"}>
            <Game />
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-[52px] pb-[50px] overflow-hidden">
            {showLevels ? renderLevels() : renderMovies()}
          </div>
        )}
      </div>
    </div>
  );
};

export default LevelSelection;
