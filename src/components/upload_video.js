import React from "react";
import { Player } from "video-react";

import "../../node_modules/video-react/dist/video-react.css";
import "../styles/upload_video.css";

class UploadVideo extends React.Component {
  state = { disable: false };

  handleCancel = () => {
    this.props.setVideoInfo(null);
  };

  handleUplaod = () => {
    // Get a presigned url
    // Post the video
  };

  render = () => {
    return (
      <div className="Upload">
        <Player
          playsInline
          fluid={false}
          height={360}
          width={640}
          src={URL.createObjectURL(this.props.videoInfo)}
        />
        <div className="Upload-btn-grp">
          <button
            className="Upload-btn"
            onClick={this.handleCancel}
            disabled={this.state.disable}
          >
            <ion-icon name="close-circle-outline" className="Upload-icon" />
            <p className="Upload-btn-text">Clear Clip</p>
          </button>
          <button
            className="Upload-btn Btn-Upload"
            onClick={this.handleUplaod}
            disabled={this.state.disable}
          >
            <ion-icon name="cloud-upload-outline" className="Upload-icon" />
            <p className="Upload-btn-text">Upload clip</p>
          </button>
        </div>
      </div>
    );
  };
}

export default UploadVideo;
