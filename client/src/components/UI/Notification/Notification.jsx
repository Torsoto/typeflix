import React from 'react';

function Notification({ message, onClose }) {
    return (
        <div className="fixed bottom-5 right-5 bg-red-700 border border-red-900 shadow-lg rounded-md p-5 w-120 transition-all transform ease-in-out duration-500">
            <div className="flex justify-between items-center">
                <p className="text-white">{message}</p>
                <button onClick={onClose} className="text-white hover:text-gray-800">
                    <i className="fas fa-times"></i>
                </button>
            </div>
        </div>
    );
}

export default Notification;
