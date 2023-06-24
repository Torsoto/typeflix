import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";

const LeaderboardTable = ({ leaderboardData }) => {
    const [leaderboardAvatars, setLeaderboardAvatars] = useState({});

    useEffect(() => {
        const fetchLeaderboardAvatars = async () => {
            const usernames = Object.keys(leaderboardData);
            const avatarResponses = await Promise.all(
                usernames.map(username =>
                    fetch(`http://localhost:3000/getAvatar?username=${username}`)
                        .then(response => response.json())
                        .then(data => ({ username, avatar: data.avatar }))
                )
            );

            const avatars = {};
            avatarResponses.forEach(response => {
                avatars[response.username] = response.avatar;
            });

            setLeaderboardAvatars(avatars);
        };

        fetchLeaderboardAvatars();

    }, [leaderboardData]);


    return (
        <div className="flex flex-col w-full max-w-md px-4 py-2 mt-8">
            <div className="overflow-hidden bg-gray-800 rounded-lg shadow">
                <table className="min-w-full divide-y divide-[#8d8d8d]">
                    <thead className="bg-[#414141]">
                        <tr>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
                                Username
                            </th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-white uppercase">
                                WPM
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-[#414141]">
                        {Object.entries(leaderboardData).map(([username, wpm], i) => (
                            <tr key={username} className={i % 2 === 0 ? 'bg-[#414141]' : 'bg-[#515151]'}>
                                <td className="flex items-center px-6 py-4 text-sm text-white">
                                    <img
                                        src={leaderboardAvatars[username]}
                                        alt="Avatar"
                                        className="w-8 h-8 bg-white rounded-full"
                                    />
                                    <div className="ml-2">
                                        <Link to={`/${username}`}>
                                            {username}
                                        </Link>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-right text-white">{wpm}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeaderboardTable;
