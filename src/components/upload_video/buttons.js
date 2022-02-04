import React from "react";

import "../../styles/upload_video.css";

const ButtonsGroup = ({ disable, handleCancel, handleUpload }) => (
  <div className="Upload-btn-grp">
    <button className="Upload-btn" onClick={handleCancel} disabled={disable}>
      <ion-icon name="close-circle-outline" className="Upload-icon" />
      <p className="Upload-btn-text">Cancel</p>
    </button>
    <button
      className="Upload-btn Btn-Upload"
      onClick={handleUpload}
      disabled={disable}
    >
      <ion-icon name="cloud-upload-outline" className="Upload-icon" />
      <p className="Upload-btn-text">Upload</p>
    </button>
  </div>
);

export default ButtonsGroup;
