import React from "react";

import "./styles/header.css";
import UserContext from "./userContext";

const Header = () => {
  const context = React.useContext(UserContext);
  const { user } = context;

  return (
    <nav className="Header navbar navbar-dark bg-dark">
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
        <div className="Header-user ml-auto">
          <p className="Header-user-username">{user.username}</p>
          <img
            className="Header-user-picture"
            src={user.picture}
            height={24}
            style={{ borderRadius: 20 }}
            alt={user.username}
          />
        </div>
      )}
    </nav>
  );
};

export default Header;
