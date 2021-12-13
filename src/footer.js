import React from "react";

import "./styles/footer.css";

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
            href="https://www.reddit.com/r/shinobi_app/"
          >
            <ion-icon name="logo-reddit" />
            <span style={{ marginLeft: "10px" }}>Reddit</span>
          </a>
        </div>
        <div className="Footer-column">
          <a href="https://play.google.com/store/apps/details?id=cc.shinobi.android">
            <img
              src={process.env.PUBLIC_URL + "PlayStore.png"}
              height={55}
              alt="Play Store"
            />
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default Footer;
