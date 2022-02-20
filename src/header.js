import React from "react";
import {
  IoCaretUpOutline,
  IoCaretDownOutline,
  IoExitOutline,
} from "react-icons/io5";

import "./styles/header.css";
import UserContext from "./userContext";
import { defaultIconStyle } from "./utils/styles";

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
            {isOpen ? <IoCaretUpOutline /> : <IoCaretDownOutline />}
          </div>
          <div
            className={`dropdown-menu${isOpen ? " show" : ""}`}
            aria-labelledby="navbarDropdown"
          >
            <span
              className="dropdown-item Header-Dropdown-Item"
              onClick={logoutUser}
            >
              <IoExitOutline style={defaultIconStyle} />
              <p>Logout</p>
            </span>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
