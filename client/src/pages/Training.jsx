import Navbar from "../components/UI/Navbar.jsx";
import TrainingGame from "../components/Game/TrainingGame.jsx"
import React, { useContext, useEffect } from "react";

function Training() {

    return (
        <div className="my-auto">
            <div className="m-auto max-w-7xl">
                <Navbar />
                <TrainingGame />
            </div>
        </div>
    );
};

export default Training;
