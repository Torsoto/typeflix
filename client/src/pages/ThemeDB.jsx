import React, { useState, useEffect } from "react";
import Navbar from "../components/UI/Navbar.jsx";

const ThemeDB = () => {
    const [movies, setMovies] = useState([]);
    const [data, setData] = useState([]);

    // use fetch movie list and store in movies
    useEffect(() => {
        fetchMovieList().then((data) => {
            setMovies(data);
            console.log(data);
        });
    }, []);

    // fetch data about movies from backend
    useEffect(() => {
        const fetchMovieData = async () => {
            try {
                const response = await fetch("http://localhost:3000/getomdbi");

                if (!response.ok) {
                    throw new Error("Failed to fetch movie data");
                }

                const data = await response.json();
                setData(data);
            } catch (error) {
                console.error("Error fetching movie data:", error);
            }
        };

        fetchMovieData();
    }, []);

    // fetch movie list
    const fetchMovieList = async () => {
        try {
            const response = await fetch("http://localhost:3000/movies");
            return await response.json();
        } catch (error) {
            console.error("Error fetching movie list:", error);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="grid grid-cols-3 gap-4 p-4 text-white">
                {data.map((movie, index) => (
                    <div key={index} className="flex flex-col p-2">
                        <img
                            src={movies.find((m) => m.title === movie.Title).poster}
                            alt={movie.Title}
                            className="object-cover h-64 rounded-lg w-96"
                        />
                        <h2 className="mt-2 text-xl font-bold">{movie.Title}</h2>
                        <ul className="mt-2 text-sm">
                            <li>Year: {movie.Year}</li>
                            <li>Rated: {movie.Rated}</li>
                            <li>Released: {movie.Released}</li>
                            <li>Runtime: {movie.Runtime}</li>
                            <li>Genre: {movie.Genre}</li>
                            <li>Director: {movie.Director}</li>
                            <li>Writer: {movie.Writer}</li>
                            <li>Actors: {movie.Actors}</li>
                            <li>Language: {movie.Language}</li>
                            <li>Country: {movie.Country}</li>
                            <li>Awards: {movie.Awards}</li>
                        </ul>
                    </div>
                ))}
            </div>
            <footer className="flex gap-1 text-lg text-white place-content-center opacity-60"> Data from <a target="_blank" className="" href="https://www.omdbapi.com/"><p className="transition-all duration-100 ease-in-out hover:scale-105">omdbi</p></a></footer>
        </div>
    );
};

export default ThemeDB;
