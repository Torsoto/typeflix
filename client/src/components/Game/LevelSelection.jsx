import React, { useContext, useEffect, useState } from "react";
import "../../styles/LevelSelection.css";
import "../../styles/App.css";
import Game from "./Game.jsx";
import AuthContext from "../context/AuthContext.jsx";
import { IoIosArrowBack } from "react-icons/io";
import { GiDaemonSkull } from "react-icons/Gi"
import { IoSkullSharp } from "react-icons/io5"
import { AiFillWarning } from "react-icons/Ai"


const LevelSelection = () => {
  const [movies, setMovies] = useState([]);
  const [fadeOut, setFadeOut] = useState(false);
  const [poster, setPoster] = useState(null);
  const [levels, setLevels] = useState([]);
  const [showLevels, setShowLevels] = useState(false);
  const [showHomeGame, setShowHomeGame] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false);
  const [gameOpacity, setGameOpacity] = useState(0);
  const [openedLevels, setOpenedLevels] = useState(0);

  const { setText, setGradientColor, setImg, setTime, userData, title, setTitle, selectedLevelIndex, setSelectedLevelIndex, setTotalLevelsCount } = useContext(AuthContext);

  useEffect(() => {
    fetchMovieList().then((data) => {
      setMovies(data);
    });
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
      return await response.json();
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
      setTotalLevelsCount(data.count);
      setGradientColor(data.color)
      setShowBackButton(true);
      setFadeOut(true);
    } catch (error) {
      console.error(`Error fetching levels for movie ${movieName}:`, error);
    }
    try {
      const username = userData.username;
      const response = await fetch(
        `http://localhost:3000/levelsOpened/${encodeURIComponent(
          username
        )}/${encodeURIComponent(movieName)}`
      );
      const data = await response.json();
      const levels = data.openedLevels;
      setOpenedLevels(levels);
    } catch (error) {
      console.error(`Error fetching opened levels for user ${userData.username} and movie ${movieName}:`, error);
    }
  };

  const handleBackClick = () => {
    if (showHomeGame) {
      // If the game is currently being shown, go back to the level selection
      setShowHomeGame(false);
      setGameOpacity(0);
      handleMovieClick(title, poster); // re-fetch the levels for the current movie
    } else {
      // If the level selection is being shown, go back to the movie selection
      setGradientColor('#0c0c0c')
      setShowLevels(false);
      setShowBackButton(false);
      fetchMovieList().then((data) => {
        setMovies(data);
      });
    }
  };

  const handleTitleToData = () => {

  }


  const renderMovies = () => {
    return movies.map((movie, index) => (
      <div
        key={index}
        className={`flex flex-col items-center m-2 ${fadeOut ? "fade-out" : "fade-in"
          }`}
      >
        <div
          className="min-w-[376px] transition-all duration-100 ease-in-out hover:scale-105 min-h-[224px] bg-cover bg-center rounded-3xl border-4 border-white cursor-pointer"
          style={{ backgroundImage: `url('${movie.poster}')` }}
          onClick={() => handleMovieClick(movie.title, movie.poster)}
        ></div>
        <p onClick={handleTitleToData} title={`Data about ${movie.title}`} className="mt-4 text-xl font-medium text-center text-white transition-all duration-100 ease-in-out cursor-pointer hover:scale-105">
          {movie.title}
        </p>
      </div>
    ));
  };

  const renderLevels = () => {
    return levels.map((level, index) => {
      const isMiniBoss = level % 3 === 0 && level !== 10;
      const isBigBoss = level === 10;
      const handleLevelSelection = async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/movies/${encodeURIComponent(
              title
            )}/levels/${level}`
          );
          const data = await response.json();
          setText(data.text);
          setImg(data.img);
          setTime(data.time);
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

      const isOpened = index < openedLevels;

      return (
        <div
          key={level}
          className={`flex flex-col items-center m-2 ${fadeOut ? "fade-out" : "fade-in"
            }`}
        >
          <div
            className={`min-w-[376px] transition-all duration-100 ease-in-out hover:scale-105 min-h-[224px] rounded-3xl cursor-pointer relative ${isOpened ? '' : 'opacity-50'}`}
            style={{ position: "relative", overflow: "hidden" }}
            onClick={isOpened ? handleLevelSelection : null}
          >
            {isMiniBoss && (
              <div className="absolute top-0 right-0 z-50 p-2 text-white">
                <IoSkullSharp size={28} />
              </div>
            )}
            {isBigBoss && (
              <div className="absolute top-0 right-0 z-50 p-2 text-white">
                <GiDaemonSkull size={30} />
              </div>
            )}
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
          {isMiniBoss && (
            <p className="flex items-center gap-1 text-base text-red-500">
              <AiFillWarning className="text-red-500" size={16} /> Mini Boss! <AiFillWarning size={16} />
            </p>
          )}
          {isBigBoss && (
            <p className="flex items-center gap-1 text-red-500 text-md">
              <AiFillWarning className="text-red-500" size={16} /> Boss! <AiFillWarning size={16} />
            </p>
          )}
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
                  disabled={fadeOut}
                  style={{
                    opacity: fadeOut ? "0" : "1",
                    transition: "opacity 0.5s",
                  }}
                  onClick={handleBackClick}
                >
                  <span className="flex flex-row items-center justify-center text-xl font-normal">
                    <IoIosArrowBack className="mr-1" /> Back
                  </span>
                </button>
              )}
            </div>
            <p className="my-10 text-2xl font-semibold text-white">
              {!showHomeGame
                ? (showLevels ? `Select Level` : "Select Theme")
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