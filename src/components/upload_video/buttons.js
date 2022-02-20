import React from "react";
import { IoCloseCircleOutline, IoCloudUploadOutline } from "react-icons/io5";

import "../../styles/upload_video.css";

const ButtonsGroup = ({ disable, handleCancel, handleUpload }) => (
  <div className="Upload-btn-grp">
    <button className="Upload-btn" onClick={handleCancel} disabled={disable}>
      <IoCloseCircleOutline className="Upload-icon" />
      <p className="Upload-btn-text">Cancel</p>
    </button>
    <button
      className="Upload-btn Btn-Upload"
      onClick={handleUpload}
      disabled={disable}
    >
      <IoCloudUploadOutline className="Upload-icon" />
      <p className="Upload-btn-text">Upload</p>
    </button>
  </div>
);

export default ButtonsGroup;
