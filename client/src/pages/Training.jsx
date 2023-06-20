import Navbar from "../components/UI/Navbar.jsx";
import TrainingGame from "../components/Game/TrainingGame.jsx"
import React, { useContext, useEffect } from "react";

function Training() {

    return (
        <div className="my-auto">
            <Navbar />
            <div className="m-auto max-w-7xl">
                <TrainingGame />
            </div>
        </div>
    );
};

export default Training;
