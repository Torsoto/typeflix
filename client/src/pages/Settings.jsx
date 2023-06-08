import React, { useState } from "react";
import "../styles/Settings.css";
import Login from "./Login";

function Settings() {
  const [selectedNavItem, setSelectedNavItem] = useState(null);

  const navItems = [
    {
      id: 1,
      label: "Account Information",
      content: <div>Account Information Content</div>,
    },
    {
      id: 2,
      label: "Theme",
      content: <div>Theme Content</div>,
    },
    {
      id: 3,
      label: "log out",
      content: (
        <div>
          <button type="button">Log Out</button>
          <a href="Log Out">
            <Login />
          </a>
        </div>
      ),
    },
    {
      id: 4,
      label: "Version",
      content: <div>Version BETA 0.1</div>,
    },
  ];

  return (
    <>
      <div className="main-bg">
        <h1 className="text-4xl text-center shadow-lg text-white">
          {" "}
          Settings{" "}
        </h1>
        <div className="settings-container">
          <div className="nav-bar">
            <ul className="nav-list text-white">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button onClick={() => setSelectedNavItem(item)}>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="settings-content text-white">
            {selectedNavItem ? (
              selectedNavItem.content
            ) : (
              <p>Please select an option from the navigation bar</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;
