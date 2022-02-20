import React from "react";
import { IoAlbumsOutline } from "react-icons/io5";

import "../styles/browse_video.css";
import { VIDEO_MIME_TYPES } from "../utils";
import { defaultIconStyle } from "../utils/styles";

const BrowseVideo = ({ setVideoInfo }) => {
  const [disable, setDisable] = React.useState(false);
  const hiddenFileInput = React.useRef(null);

  const handleFocusBack = () => {
    window.removeEventListener("focus", handleFocusBack);
    setDisable(false);
  };

  const handleClick = () => {
    setDisable(true);
    window.addEventListener("focus", handleFocusBack);
    hiddenFileInput.current.click();
  };

  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];
    setVideoInfo(fileUploaded);
    window.removeEventListener("focus", handleFocusBack);
  };

  return (
    <div className="Browse">
      <button className="Browse-btn" onClick={handleClick} disabled={disable}>
        <IoAlbumsOutline style={defaultIconStyle} />
        <p className="Browse-btn-txt">Select a clip</p>
      </button>
      <input
        type="file"
        accept={VIDEO_MIME_TYPES.join(",")}
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default BrowseVideo;
