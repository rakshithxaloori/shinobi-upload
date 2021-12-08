import React from "react";

import "./styles/home.css";

import GLoginBtn from "./components/google_login";
import BrowseVideo from "./components/browse_video";

import UserContext from "./userContext";

const Home = () => {
  const context = React.useContext(UserContext);
  const { user } = context;
  const [videoInfo, setVideoInfo] = React.useState({});

  return (
    <div className="Home">
      {user?.username ? (
        videoInfo === {} ? (
          <BrowseVideo setVideoInfo={setVideoInfo} />
        ) : null
      ) : (
        <GLoginBtn />
      )}
    </div>
  );
};

export default Home;
