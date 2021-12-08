import React from "react";

import "./styles/home.css";

import GLoginBtn from "./components/google_login";
import BrowseVideo from "./components/browse_video";
import UploadVideo from "./components/upload_video";

import UserContext from "./userContext";

const Home = () => {
  const context = React.useContext(UserContext);
  const { user } = context;
  const [videoInfo, setVideoInfo] = React.useState(null);

  return (
    <div className="Home">
      {user?.username ? (
        videoInfo === null ? (
          <BrowseVideo setVideoInfo={setVideoInfo} />
        ) : (
          <UploadVideo videoInfo={videoInfo} setVideoInfo={setVideoInfo} />
        )
      ) : (
        <GLoginBtn />
      )}
    </div>
  );
};

export default Home;
