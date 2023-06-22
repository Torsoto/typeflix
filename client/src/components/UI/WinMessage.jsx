import React from 'react';
import { TfiReload } from "react-icons/tfi"
import { IoMdArrowForward } from "react-icons/io"

const WinMessage = ({ isFinished, timeTaken, wpm, onNextLevel, onRetry }) => {
    if (!isFinished) return null;

    return (
        <div className="text-2xl">
            <div className="flex flex-col gap-4">
                <div className='mt-8 text-center'>
                    Congratulations! You beat this level in {timeTaken} seconds with {wpm} WPM!
                </div>
                <div className='flex gap-4 text-center opacity-80 place-content-center'>
                    <button
                        className="px-4 py-2 text-white transition-all duration-100 ease-in-out rounded-3xl hover:scale-110"
                        onClick={onRetry}
                        title='Retry'
                    >
                        <TfiReload size={28} />
                    </button>
                    <button
                        className="px-4 py-2 font-bold text-white transition-all duration-100 ease-in-out rounded hover:scale-125"
                        onClick={onNextLevel}
                        title='next Level'
                    >
                        <IoMdArrowForward size={38} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WinMessage;
