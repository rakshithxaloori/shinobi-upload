import React from "react";
import { IoLogoDiscord, IoLogoReddit } from "react-icons/io5";

import "./styles/footer.css";
const ICON_SIZE = 24;

const Footer = () => (
  <div className="Footer">
    <div className="Footer-container">
      <div className="Footer-row">
        <div className="Footer-column">
          <a
            className="Footer-link"
            rel="noopener noreferrer"
            target="_blank"
            href="https://shinobi.cc/legal/privacy-policy"
          >
            Privacy Policy
          </a>
          <a
            className="Footer-link"
            rel="noopener noreferrer"
            target="_blank"
            href="https://shinobi.cc/legal/terms"
          >
            Terms & Conditions
          </a>
          <a
            className="Footer-link"
            rel="noopener noreferrer"
            target="_blank"
            href="https://shinobi.cc/account/delete"
          >
            Delete Account
          </a>
        </div>
        <div className="Footer-column">
          <a
            className="Footer-link"
            rel="noopener noreferrer"
            target="_blank"
            href="https://www.reddit.com/r/ShinobiApp/"
          >
            <IoLogoReddit size={ICON_SIZE} />
            <span style={{ marginLeft: "10px" }}>Reddit</span>
          </a>
          <a
            className="Footer-link"
            rel="noopener noreferrer"
            target="_blank"
            href={process.env.REACT_APP_DISCORD_INVITE_LINK}
          >
            <IoLogoDiscord size={ICON_SIZE} />
            <span style={{ marginLeft: "10px" }}>Discord</span>
          </a>
        </div>
        <div className="Footer-column">
          <a href="https://play.google.com/store/apps/details?id=cc.shinobi.android">
            <img
              src={process.env.PUBLIC_URL + "PlayStore.png"}
              height={77}
              alt="Play Store"
            />
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default Footer;
