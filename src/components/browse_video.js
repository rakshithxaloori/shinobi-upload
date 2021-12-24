import React from "react";
import axios from "axios";
import { useAlert } from "react-alert";

import "../styles/browse_video.css";

import { createAPIKit } from "../utils/APIKit";
import { handleAPIError } from "../utils/error";

const BrowseVideo = ({ setVideoInfo }) => {
  const alert = useAlert();
  const cancelTokenSource = axios.CancelToken.source();

  const [clipCount, setClipCount] = React.useState(null);
  const [timeLeft, setTimeLeft] = React.useState(null);
  const [disable, setDisable] = React.useState(false);
  const hiddenFileInput = React.useRef(null);

  React.useEffect(() => {
    const fetchClipCount = async () => {
      const onSuccess = (response) => {
        const { quota, time_left } = response.data?.payload;
        setClipCount(quota);
        setTimeLeft(time_left);
      };

      const APIKit = await createAPIKit();
      APIKit.get("clips/check/", { cancelToken: cancelTokenSource.token })
        .then(onSuccess)
        .catch((e) => {
          alert.show(handleAPIError(e));
        });
    };

    fetchClipCount();
  }, []);

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

  return clipCount !== null ? (
    <div className="Browse">
      {clipCount <= 0 ? (
        <p className="Browse-count">
          {timeLeft} until you can upload more clips!
        </p>
      ) : (
        <>
          <button
            className="Browse-btn"
            onClick={handleClick}
            disabled={disable}
          >
            <ion-icon name="albums-outline"></ion-icon>
            <p className="Browse-btn-txt">Select a clip</p>
          </button>
          <input
            type="file"
            accept="video/mp4,video/quicktime,video/wmv,video/avi"
            ref={hiddenFileInput}
            onChange={handleChange}
            style={{ display: "none" }}
          />
        </>
      )}
    </div>
  ) : null;
};

export default BrowseVideo;
