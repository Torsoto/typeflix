import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import "../../styles/LevelSelection.css";
import HomeGame from "./HomeGame.jsx";
import AuthContext from "../context/AuthContext.jsx";

const LevelSelection = () => {
    const [movies, setMovies] = useState([]);
    const [fadeOut, setFadeOut] = useState(false);
    const [title, setTitle] = useState(null);
    const [poster, setPoster] = useState(null);
    const [levels, setLevels] = useState([]);
    const [showLevels, setShowLevels] = useState(false);
    const [showHomeGame, setShowHomeGame] = useState(false);
    const { setText } = useContext(AuthContext);

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
            }, 500);
        }
        return () => {
            clearTimeout(timer1);
        };
    }, [fadeOut]);

    const fetchMovieList = async () => {
        try {
            const response = await axios.get("http://localhost:3000/movies");
            setMovies(response.data);
        } catch (error) {
            console.error("Error fetching movie list:", error);
        }
    };

    const handleMovieClick = async (movieName, img) => {
        setPoster(img);
        setTitle(movieName);
        try {
            const response = await axios.get(
                `http://localhost:3000/movies/${movieName}/countlevels`
            );
            console.log(`Levels for movie ${movieName}:`, response.data.count);

            // Update the levels state
            setLevels(Array(response.data.count).fill().map((_, i) => i + 1));

            // Trigger the fade-out animation
            setFadeOut(true);
        } catch (error) {
            console.error(`Error fetching levels for movie ${movieName}:`, error);
        }
    };

    const renderMovies = () => {
        return movies.map((movie, index) => (
            <div
                key={index}
                className={`flex flex-col items-center m-2 ${
                    fadeOut ? "fade-out" : "fade-in"
                }`}
            >
                <div
                    className="min-w-[376px] min-h-[224px] bg-cover bg-center rounded-md border-4 border-white cursor-pointer"
                    style={{ backgroundImage: `url('${movie.poster}')` }}
                    onClick={() => handleMovieClick(movie.title, movie.poster)}
                ></div>
                <p className="text-white text-center text-xl font-medium mt-4">
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
                        `http://localhost:3000/movies/${encodeURIComponent(title)}/levels/${level}`
                    );
                    const data = await response.json();
                    console.log(data.text);
                    setText(data.text);

                    // Transition to HomeGame component
                    setShowHomeGame(true);
                } catch (error) {
                    console.error(error);
                }
            };

            return (
                <div
                    key={level}
                    className={`flex flex-col items-center m-2 ${
                        fadeOut ? "fade-out" : "fade-in"
                    }`}
                >
                    <div
                        className="min-w-[376px] min-h-[224px] rounded-md border-4 border-white cursor-pointer relative"
                        style={{ boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.3)' }}
                        onClick={handleLevelSelection}
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url('${poster}')`, filter: 'blur(5px)' }}
                        ></div>
                        <p
                            className="text-white text-center text-xl font-medium absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
                        >
                            Level {level}
                        </p>
                    </div>
                </div>
            );
        });
    };

    return (
        <div className="h-[85%]">
            {showHomeGame ? <HomeGame /> : (
                <div className="h-[85%] mx-auto text-white">
                    <div className="text-2xl text-center font-medium">
                        <p className="my-16">{showLevels ? 'Select Level' : 'Select Movie'}</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-[52px]">
                        {showLevels ? renderLevels() : renderMovies()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LevelSelection;
