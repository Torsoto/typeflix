import Navbar from "../components/UI/Navbar.jsx";
import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import { Link } from 'react-router-dom';

function Leaderboard() {
    const [leaderboardData, setLeaderboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [leaderboardAvatars, setLeaderboardAvatars] = useState({});

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await fetch("http://localhost:3000/getLeaderboard");
                const data = await response.json();
                setLeaderboardData(data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching leaderboard:", error);
            }
        };

        fetchLeaderboard();
    }, []);

    useEffect(() => {
        const fetchLeaderboardAvatars = async () => {
            const usernames = Object.keys(leaderboardData);
            const avatarResponses = await Promise.all(
                usernames.map(username =>
                    fetch(`http://localhost:3000/getAvatar?username=${username}`)
                        .then(response => response.text())
                        .then(avatar => ({ username, avatar }))
                )
            );

            const avatars = {};
            avatarResponses.forEach(response => {
                avatars[response.username] = response.avatar;
            });

            setLeaderboardAvatars(avatars);
        };

        if (leaderboardData) {
            fetchLeaderboardAvatars();
        }
    }, [leaderboardData]);

    return (
        <div className="main-bg">
            <div className="m-auto max-w-7xl">
                <Navbar />
                <div className="flex justify-center items-center">
                    {isLoading ? (
                        <div className="mt-8 flex justify-center items-center">
                            <CircularProgress />
                        </div>
                    ) : (
                        <div className="flex flex-col w-full px-4 py-2 mt-8 max-w-md">
                            <div className="overflow-hidden rounded-lg shadow">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase tracking-wider">
                                            Username
                                        </th>
                                        <th className="px-6 py-3 text-xs font-medium text-right text-gray-500 uppercase tracking-wider">
                                            WPM
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {Object.entries(leaderboardData).map(([username, wpm], i) => (
                                        <tr key={username} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="px-6 py-4 text-sm text-gray-900 flex items-center">
                                                <img
                                                    src={leaderboardAvatars[username]}
                                                    alt="Avatar"
                                                    className="rounded-full w-8 h-8 bg-white"
                                                />
                                                <div className="ml-2">
                                                    <Link to={`/${username}`}>
                                                        {username}
                                                    </Link>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 text-right">{wpm}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Leaderboard;
