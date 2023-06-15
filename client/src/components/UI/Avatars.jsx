export const Avatars = ({ handleSelectAvatar, handleToggleAvatarOptions }) => {
    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div className="bg-white p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Select an Avatar</h3>
                <div className="flex flex-wrap">
                    <button
                        className="w-16 h-16 rounded-full overflow-hidden mr-2 mb-2"
                        onClick={() => handleSelectAvatar("lorelei")}
                    >
                        <img
                            src={`https://api.dicebear.com/6.x/lorelei/svg`}
                            alt="Avatar 1"
                        />
                    </button>
                    <button
                        className="w-16 h-16 rounded-full overflow-hidden mr-2 mb-2"
                        onClick={() => handleSelectAvatar("pixel-art")}
                    >
                        <img
                            src={`https://api.dicebear.com/6.x/pixel-art/svg`}
                            alt="Avatar 2"
                        />
                    </button>
                    <button
                        className="w-16 h-16 rounded-full overflow-hidden mr-2 mb-2"
                        onClick={() => handleSelectAvatar("micah")}
                    >
                        <img
                            src={`https://api.dicebear.com/6.x/micah/svg`}
                            alt="Avatar 3"
                        />
                    </button>
                    <button
                        className="w-16 h-16 rounded-full overflow-hidden mr-2 mb-2"
                        onClick={() => handleSelectAvatar("adventurer")}
                    >
                        <img
                            src={`https://api.dicebear.com/6.x/adventurer/svg`}
                            alt="Avatar 4"
                        />
                    </button>
                    <button
                        className="w-16 h-16 rounded-full overflow-hidden mr-2 mb-2"
                        onClick={() => handleSelectAvatar("big-ears")}
                    >
                        <img
                            src={`https://api.dicebear.com/6.x/big-ears/svg`}
                            alt="Avatar 5"
                        />
                    </button>
                    <button
                        className="w-16 h-16 rounded-full overflow-hidden mr-2 mb-2"
                        onClick={() => handleSelectAvatar("personas")}
                    >
                        <img
                            src={`https://api.dicebear.com/6.x/personas/svg`}
                            alt="Avatar 6"
                        />
                    </button>
                    <button
                        className="w-16 h-16 rounded-full overflow-hidden mr-2 mb-2"
                        onClick={() => handleSelectAvatar("thumbs")}
                    >
                        <img
                            src={`https://api.dicebear.com/6.x/thumbs/svg`}
                            alt="Avatar 7"
                        />
                    </button>
                    <button
                        className="w-16 h-16 rounded-full overflow-hidden mr-2 mb-2"
                        onClick={() => handleSelectAvatar("bottts")}
                    >
                        <img
                            src={`https://api.dicebear.com/6.x/bottts/svg`}
                            alt="Avatar 8"
                        />
                    </button>
                    <button
                        className="w-16 h-16 rounded-full overflow-hidden mr-2 mb-2"
                        onClick={() => handleSelectAvatar("pixel-art")}
                    >
                        <img
                            src={`https://api.dicebear.com/6.x/pixel-art/svg`}
                            alt="Avatar 9"
                        />
                    </button>
                    <button
                        className="w-16 h-16 rounded-full overflow-hidden mr-2 mb-2"
                        onClick={() => handleSelectAvatar("fun-emoji")}
                    >
                        <img
                            src={`https://api.dicebear.com/6.x/fun-emoji/svg`}
                            alt="Avatar 10"
                        />
                    </button>
                </div>
                <button
                    className="mt-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
                    onClick={handleToggleAvatarOptions}
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}