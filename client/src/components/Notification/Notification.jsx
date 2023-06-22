import React, { useState } from 'react';
import '../../styles/App.css';
import {IoClose} from "react-icons/io5";

function Notification({ message }) {
    const [showNotification, setShowNotification] = useState(true);

    const handleClose = () => {
        setShowNotification(false);
    };

    return showNotification ? (
        <div className="fixed bottom-5 right-5 z-10 bg-red-700 border border-red-900 shadow-lg rounded-md p-5 w-120 transition-all transform ease-in-out duration-500">
            <div className="flex justify-between items-center">
                <p className="text-white">{message}</p>
                <button onClick={handleClose} className="text-white hover:text-red-200 focus:outline-none absolute top-2 right-2">
                    <IoClose />
                </button>
            </div>
        </div>
    ) : null;
}

export default Notification;
