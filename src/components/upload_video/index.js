import React from "react";
import ReactPlayer from "react-player/lazy";
import { useAlert } from "react-alert";
import axios from "axios";

import "../../styles/upload_video.css";
import { createAPIKit } from "../../utils/APIKit";
import { handleAPIError } from "../../utils/error";
import ButtonsGroup from "./buttons";
import ProgressBar from "./progress_bar";

const VIDEO_HEIGHT = 360;
const VIDEO_WIDTH = 640;
const VIDEO_MAX_SIZE = 500 * 1000 * 1000;
const VIDEO_MIN_DURATION = 5;
const VIDEO_MAX_DURATION = 60;

class UploadVideo extends React.Component {
  videoRef = React.createRef();

  cancelTokenSource = axios.CancelToken.source();

  state = {
    fileKey: null,
    title: "",
    progress: 0,
    disable: false,
    isUploading: false,
  };

  handleTitleChange = (event) => {
    this.setState({ title: event.target.value });
  };

  handleCancel = () => {
    this.props.setVideoInfo(null);
  };

  handleUplaod = async () => {
    if (this.props.videoInfo.size > VIDEO_MAX_SIZE) {
      this.props.showAlert("Select a file with size less than 500 MB");
      return;
    }

    const clipDuration = this.videoRef.current.getDuration();
    if (
      clipDuration < VIDEO_MIN_DURATION ||
      clipDuration >= VIDEO_MAX_DURATION + 1
    ) {
      this.props.showAlert("Clip must be b/w 5 and 60 seconds long");
      return;
    }

    // Check title length
    if (this.state.title === "") {
      this.props.showAlert("Title can't be empty");
      return;
    }

    // Get a presigned url
    this.setState({ disable: true, isUploading: true });
    const player = this.videoRef.current.getInternalPlayer();
    const splitList = this.props.videoInfo.name.split(".");

    try {
      const APIKit = await createAPIKit();
      const s3_presigned_response = await APIKit.post(
        "/clips/presigned/",
        {
          clip_size: this.props.videoInfo.size,
          clip_type: splitList[splitList.length - 1],
          game_code: "30035",
          title: this.state.title,
          clip_height: player.videoHeight,
          clip_width: player.videoWidth,
        },
        { cancelToken: this.cancelTokenSource.token }
      );

      if (s3_presigned_response.status === 200) {
        const url_payload = s3_presigned_response.data.payload;
        this.setState({ fileKey: url_payload.fields.key });
        try {
          const uploadProgress = (event) => {
            const progress = Math.round((100 * event.loaded) / event.total);
            // console.log(progress);
            this.setState({ progress });
          };

          const uploadSuccess = async () => {
            console.log(this.state.fileKey);
            APIKit.post(
              "/clips/success/",
              { file_key: this.state.fileKey },
              { cancelToken: this.cancelTokenSource.token }
            )
              .then(() => {
                this.props.showAlert("Clip Uploaded!");
              })
              .catch((e) => {
                this.props.showAlert(handleAPIError(e));
              });
          };

          const uploadFailure = (error) => {
            this.setState({ disable: false, isUploading: false });
            this.props.showAlert(handleAPIError(error));
          };

          const formData = new FormData();
          // append the fields in url_payload in formData
          Object.keys(url_payload.fields).forEach((key) => {
            formData.append(key, url_payload.fields[key]);
          });

          // append the file
          formData.append("file", this.props.videoInfo);

          axios
            .post(url_payload.url, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              onUploadProgress: uploadProgress,
            })
            .then(uploadSuccess)
            .catch(uploadFailure);
        } catch (e) {
          this.setState({ disable: false, isUploading: false });
          this.props.showAlert("Something went wrong. Upload failed");
        }
      }
    } catch (e) {
      this.setState({ disable: false, isUploading: false });
      this.props.showAlert(handleAPIError(e));
    }
  };

  render = () => (
    <div className="Upload">
      <div className="input-group mb-3">
        <span
          className="input-group-text"
          id="basic-addon1"
          style={{ fontWeight: "bold" }}
        >
          Clip Title
        </span>
        <input
          className="form-control"
          style={{ width: VIDEO_WIDTH - 100 }}
          value={this.state.title}
          onChange={this.handleTitleChange}
          type="text"
          maxLength={40}
          placeholder="One tap headshots yall!"
          required
          disabled={this.state.disable}
        />
      </div>
      <ReactPlayer
        ref={this.videoRef}
        height={VIDEO_HEIGHT}
        width={VIDEO_WIDTH}
        controls
        url={this.props.videoUrl}
      />
      {this.state.isUploading ? (
        <ProgressBar progress={this.state.progress} />
      ) : (
        <ButtonsGroup
          disable={this.state.disable}
          handleCancel={this.handleCancel}
          handleUpload={this.handleUplaod}
        />
      )}
    </div>
  );
}

const Wrapper = (props) => {
  let alert = useAlert();
  return (
    <UploadVideo showAlert={(message) => alert.show(message)} {...props} />
  );
};

export default Wrapper;
