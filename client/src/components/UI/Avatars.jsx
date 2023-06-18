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
        <div className="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div className="p-4 text-center bg-white rounded-lg">
                <h3 className="mb-4 text-lg font-semibold">Select an Avatar</h3>
                <div className="flex flex-wrap">
                    {avatarNames.map((name, index) => (
                        <button
                            key={index}
                            className="w-16 h-16 mb-2 mr-2 overflow-hidden border-2 border-black rounded-full"
                            onClick={() => handleSelectAvatar(name)}
                        >
                            <img
                                src={`https://api.dicebear.com/6.x/${name}/svg?seed=${userId}`}
                                alt={`Avatar ${index + 1}`}
                            />
                        </button>
                    ))}
                </div>
                <div className="text-center">
                    <button
                        className="px-4 py-1 mt-4 font-semibold text-white bg-gray-500 rounded hover:bg-gray-600"
                        onClick={handleToggleAvatarOptions}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}