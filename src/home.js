import React from "react";

import "./styles/home.css";

import GLoginBtn from "./components/google_login";
import BrowseVideo from "./components/browse_video";
import UploadVideo from "./components/upload_video";

import UserContext from "./userContext";

const Home = () => {
  const context = React.useContext(UserContext);
  const { user } = context;

  const [videoUrl, setVideoUrl] = React.useState(null);
  const [videoInfo, setVideoInfo] = React.useState(null);

  const updateSelectedVideo = (newVideoInfo) => {
    setVideoUrl(URL.createObjectURL(newVideoInfo) || null);
    setVideoInfo(newVideoInfo);
  };

  return (
    <div className="Home">
      <h1 className="Title">Upload a game clip!</h1>
      {user?.username ? (
        videoInfo === null ? (
          <BrowseVideo setVideoInfo={updateSelectedVideo} />
        ) : (
          <UploadVideo
            videoUrl={videoUrl}
            videoInfo={videoInfo}
            setVideoInfo={setVideoInfo}
          />
        )
      ) : (
        <GLoginBtn />
      )}
    </div>
  );
};

export default Home;
