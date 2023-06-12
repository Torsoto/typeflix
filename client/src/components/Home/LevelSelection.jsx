import React, { useEffect, useState } from "react";
import axios from "axios";

const LevelSelection = () => {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        fetchMovieList();
    }, []);

    const fetchMovieList = async () => {
        try {
            const response = await axios.get("http://localhost:3000/movies");
            setMovies(response.data);
        } catch (error) {
            console.error("Error fetching movie list:", error);
        }
    };

    const handleMovieClick = (movieName) => {
        console.log(`Request sent to /showlevels?movie=${movieName}`);
    };

    const renderMovies = () => {
        return movies.map((movie, index) => (
            <div key={index} className="flex flex-col items-center m-2">
                <div
                    className="min-w-[376px] min-h-[224px] bg-cover bg-center rounded-md border-4 border-white cursor-pointer"
                    style={{ backgroundImage: `url('${movie.poster}')` }}
                    onClick={() => handleMovieClick(movie.title)}
                ></div>
                <p className="text-white text-center text-xl font-medium mt-4">{movie.title}</p>
            </div>
        ));
    };

    return (
        <div className="h-[85%] my-20 mx-auto text-white">
            <div className="text-2xl text-center font-medium">
                <p className="my-16">Select Movie</p>
            </div>
            <div className="flex flex-wrap justify-center gap-[52px]">{renderMovies()}</div>
        </div>
    );
};

export default LevelSelection;
