import React from 'react';
import { TfiReload } from "react-icons/tfi"

const FailMessage = ({ hasFailed, onRetry }) => {
    if (!hasFailed) return null;

    return (
        <div className="text-2xl">
            <div className="flex flex-col gap-4">
                <div className='mt-8 text-center'>
                    You failed this level!
                </div>
                <div className='text-center opacity-80 place-content-center'>
                    <button
                        className="px-4 py-2 text-white transition-all duration-100 ease-in-out rounded-3xl hover:scale-110"
                        onClick={onRetry}
                        title='Retry'
                    >
                        <TfiReload size={28} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FailMessage;
