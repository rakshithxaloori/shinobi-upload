import React from "react";

import "./styles/header.css";

const Header = () => (
  <div className="Header">
    <a className="Header-link" href="/">
      <img
        src={process.env.PUBLIC_URL + "logo512.png"}
        height={40}
        className="Header-logo"
        alt="Shinobi"
      />
      <p className="Header-text">Shinobi</p>
    </a>
  </div>
);

export default Header;
