import React from "react";
import { useAlert } from "react-alert";

import "./styles/home.css";

import GLoginBtn from "./components/google_login";
import BrowseVideo from "./components/browse_video";
import UploadVideo from "./components/upload_video";

import UserContext from "./userContext";
import { VIDEO_MAX_SIZE, VIDEO_MIME_TYPES } from "./utils";

const Home = () => {
  const alert = useAlert();
  const context = React.useContext(UserContext);
  const { user } = context;

  const [videoUrl, setVideoUrl] = React.useState(null);
  const [videoInfo, setVideoInfo] = React.useState(null);

  const updateSelectedVideo = async (videoFile) => {
    // TODO if videoFile.type not VIDEO_MIME_TYPES, convert
    // Else upload directly
    if (VIDEO_MIME_TYPES.includes(videoFile.type) === false) {
      alert.show("Select an avi, ogg, mp4, mov or webm video");
      return;
    }
    if (videoFile.size > VIDEO_MAX_SIZE) {
      alert.show(
        `Choose a video smaller than ${VIDEO_MAX_SIZE / (1000 * 1000)} MB`
      );
      return;
    }
    setVideoUrl(URL.createObjectURL(videoFile) || null);
    setVideoInfo(videoFile);
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
