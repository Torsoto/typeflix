import { useEffect, useState } from "react";

export const DropdownMenu = () => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const logout = () => {
        localStorage.removeItem('jwt');
    }

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        console.log(token)
        if (token ) {
            fetch('http://localhost:3000/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token })
            })
                .then(response => response.json())
                .then(data => setIsLoggedIn(data.valid))
                .catch(error => {
                    console.error('Error:', error);
                    setIsLoggedIn(false);
                });
        }
    }, []);

  return (
    <div className="absolute w-[152px]">
      <div
        className="absolute z-10 mt-2 w-40 origin-top-right rounded-md bg-neutral-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-left"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
      >
        <div className="py-1" role="none">
          {isLoggedIn ? (
              <div>
                <a
                    href="/profile"
                    className="text-white block px-4 py-2 text-sm"
                    role="menuitem"
                >
                  Profile
                </a>
                <a href="/settings" className="text-white block px-4 py-2 text-sm">
                  Settings
                </a>
                <a href="/"
                   className="text-white block px-4 py-2 text-sm"
                    onClick={logout}>
                  Log out
                </a>
              </div>
          ) : (
              <a href="/login" className="text-white block px-4 py-2 text-sm">
                Login
              </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default DropdownMenu;
