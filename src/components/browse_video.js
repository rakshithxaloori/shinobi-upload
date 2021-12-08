import React from "react";

import "../styles/browse_video.css";

const BrowseVideo = ({ setVideoInfo }) => {
  const [disable, setDisable] = React.useState(false);

  const hiddenFileInput = React.useRef(null);

  const handleClick = () => {
    setDisable(true);
    console.log("handleClick");
    hiddenFileInput.current.click();
  };

  const handleChange = (event) => {
    console.log("handleChange");
    const fileUploaded = event.target.files[0];
    console.log(fileUploaded);
    setVideoInfo(fileUploaded);
  };

  return (
    <div className="Container">
      <button className="Button" onClick={handleClick} disabled={disable}>
        <ion-icon name="albums-outline"></ion-icon>
        <p className="Button-text">Select a clip</p>
      </button>
      <input
        type="file"
        accept="video/mp4,video/quicktime,video/wmv,video/avi"
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default BrowseVideo;
