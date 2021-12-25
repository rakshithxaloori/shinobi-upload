import React from "react";

import "../../styles/upload_video.css";

const ProgressBar = ({ progress }) => {
  let dynClassName =
    progress < 100
      ? "progress-bar progress-bar-striped progress-bar-animated bg-success"
      : "progress-bar progress-bar-striped bg-success";
  return (
    <div className="Upload-progress progress" style={{ height: 20 }}>
      <div
        className={dynClassName}
        role="progressbar"
        style={{ width: `${progress}%` }}
        aria-valuenow={progress}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        {progress < 100 ? `${progress}%` : "Upload complete!"}
      </div>
    </div>
  );
};

export default ProgressBar;
