import React from "react";

import "./styles/header.css";
import UserContext from "./userContext";

const Header = () => {
  const context = React.useContext(UserContext);
  const { user } = context;
  console.log("HEADER user", user);
  return (
    <div className="Header">
      <a className="Header-link" href="/">
        <img
          className="Header-logo"
          src={process.env.PUBLIC_URL + "logo512.png"}
          height={40}
          alt="Shinobi"
        />
        <p className="Header-text">Shinobi</p>
      </a>
      {user?.username && (
        <div className="Header-user">
          <img
            className="Header-user-picture"
            src={user.picture}
            height={40}
            style={{ borderRadius: 20 }}
            alt={user.username}
          />
          <p className="Header-user-username">{user.username}</p>
        </div>
      )}
    </div>
  );
};

export default Header;
