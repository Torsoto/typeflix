import "../../styles/App.css";

export const Avatars = ({ handleSelectAvatar, handleToggleAvatarOptions, userId }) => {
    console.log(userId);
    const avatarNames = [
        "adventurer-neutral",
        "big-ears",
        "bottts",
        "fun-emoji",
        "lorelei",
        "micah",
        "notionists-neutral",
        "personas",
        "pixel-art",
        "thumbs",
    ];

    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div className="bg-white p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Select an Avatar</h3>
                <div className="flex flex-wrap">
                    {avatarNames.map((name, index) => (
                        <button
                            key={index}
                            className="w-16 h-16 rounded-full overflow-hidden mr-2 mb-2"
                            onClick={() => handleSelectAvatar(name)}
                        >
                            <img
                                src={`https://api.dicebear.com/6.x/${name}/svg?seed=${userId}`}
                                alt={`Avatar ${index + 1}`}
                            />
                        </button>
                    ))}
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