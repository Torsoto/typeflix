import React from 'react';
import "../../styles/App.css";

function Notification({ message }) {
    return (
        <div className="fixed bottom-5 right-5 bg-red-700 border border-red-900 shadow-lg rounded-md p-5 w-120 transition-all transform ease-in-out duration-500">
            <div className="flex justify-between items-center">
                <p className="text-white">{message}</p>
            </div>
        </div>
    );
}

export default Notification;
