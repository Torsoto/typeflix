import Navbar from "../components/UI/Navbar.jsx";
import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import { Link } from 'react-router-dom';
import LeaderboardTable from "../components/UI/LeaderboardTable.jsx";

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

    return (
        <div className="main-bg">
            <Navbar />
            <div className="m-auto max-w-7xl">
                <div className="flex items-center justify-center">
                    {isLoading ? (
                        <div className="flex items-center justify-center mt-8">
                            <CircularProgress style={{ color: 'white' }} />
                        </div>
                    ) : (
                        <LeaderboardTable leaderboardData={leaderboardData}/>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Leaderboard;
