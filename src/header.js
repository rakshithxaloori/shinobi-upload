import React from "react";

import "./styles/header.css";
import UserContext from "./userContext";

const Header = () => {
  const context = React.useContext(UserContext);
  const { logoutUser, user } = context;
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="Header navbar navbar-dark bg-dark navbar-collapse">
      <a className="Header-link navbar-brand" href="/">
        <img
          src={process.env.PUBLIC_URL + "logo512.png"}
          style={{ borderRadius: 20 }}
          height={40}
          alt="Shinobi"
        />
        <p className="Header-text">Shinobi</p>
      </a>
      {user?.username && (
        <div className="dropdown">
          <div
            className="Header-user ml-auto"
            id="navbarDropdown"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            onClick={toggleOpen}
          >
            <p className="Header-user-username">{user.username}</p>
            <img
              className="Header-user-picture"
              src={user.picture}
              height={24}
              style={{ borderRadius: 20 }}
              alt={user.username}
            />
            <ion-icon
              name={isOpen ? "caret-up-outline" : "caret-down-outline"}
              size="small"
            ></ion-icon>
          </div>
          <div
            className={`dropdown-menu${isOpen ? " show" : ""}`}
            aria-labelledby="navbarDropdown"
          >
            <span
              className="dropdown-item Header-Dropdown-Item"
              onClick={logoutUser}
            >
              <ion-icon name="exit-outline"></ion-icon>
              <p>Logout</p>
            </span>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
