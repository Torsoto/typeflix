import Navbar from "../components/UI/Navbar.jsx";
import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/joy';
import LeaderboardTable from "../components/UI/LeaderboardTable.jsx";

function Leaderboard() {
    const [leaderboardData, setLeaderboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // fetch global Leaderboard
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
                    <div className="flex items-center justify-center mt-8" style={{ width: 200, height: 200 }}>
                    </div>
                    {isLoading ? (
                        <div className="flex items-center justify-center mt-8" style={{ width: 200, height: 200 }}>
                            <CircularProgress color="neutral" variant="plain" size="lg" value={60}/>
                        </div>
                    ) : (
                        <LeaderboardTable leaderboardData={leaderboardData} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Leaderboard;
