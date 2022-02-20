import React from "react";
import { useAlert } from "react-alert";
import axios from "axios";

import "../../styles/upload_video.css";
import { createAPIKit } from "../../utils/APIKit";
import { handleAPIError } from "../../utils/error";
import ButtonsGroup from "./buttons";
import ProgressBar from "./progress_bar";
import Recaptcha from "./recaptcha";
import {
  POST_TITLE_LENGTH,
  VIDEO_MAX_SIZE,
  VIDEO_MIME_TYPES,
} from "../../utils";
import Title from "./title";
import SelectGame from "./select_game";
import Tags from "./tags";
import Share from "../share_clip";

const VIDEO_MIN_DURATION = 5;
const VIDEO_MAX_DURATION = 60;

class UploadVideo extends React.Component {
  videoRef = React.createRef();
  recaptchaRef = React.createRef();
  animationRef = React.createRef();

  cancelTokenSource = axios.CancelToken.source();

  state = {
    fileKey: null,
    title: "",
    game: null,
    tags: [],
    progress: 0,
    disable: false,
    isUploading: false,
    error: "",
    warning: "",
    post_id: "",
    showShare: false,
  };

  postStatusListener = undefined;

  checkCompressed = async () => {
    if (this.state.post_id === "") return;

    const onSuccess = (response) => {
      const { status } = response.data.payload;
      if (status === null) {
        // Post doesn't exist
        clearInterval(this.postStatusListener);
      } else if (status === true) {
        // Display post link
        // Clear interval
        this.setState({ showShare: true });
        clearInterval(this.postStatusListener);
      } else if (status === false) {
        // Continue
      }
      console.log(status);
    };

    const APIKit = await createAPIKit();
    APIKit.post(
      "/feed/post/status/",
      { post_id: this.state.post_id },
      { cancelToken: this.cancelTokenSource.token }
    )
      .then(onSuccess)
      .catch((e) => {});
  };

  unloadListener = (ev) => {
    if (this.state.isUploading) {
      ev.preventDefault();
      ev.returnValue = "Uploading a clip. Are you sure you want to close?";
    }
  };

  componentDidMount = () => {
    window.addEventListener("beforeunload", this.unloadListener);
  };

  componentWillUnmount = () => {
    window.removeEventListener("beforeunload", this.unloadListener);
  };

  handleCancel = async () => {
    await this.recaptchaRef.current.reset();
    this.props.setVideoInfo(null);
  };

  handleUpload = async () => {
    if (VIDEO_MIME_TYPES.includes(this.props.videoInfo.type) === false) {
      this.props.showAlert("Select an ogg, mp4, mov or webm video");
      return;
    }

    if (this.props.videoInfo.size > VIDEO_MAX_SIZE) {
      this.props.showAlert("Select a file with size less than 500 MB");
      return;
    }

    const clipDuration = this.videoRef.current.duration;
    if (isNaN(clipDuration)) {
      this.setState({
        warning: `The clip won't appear in feed, if it's is less than ${VIDEO_MIN_DURATION} or more than ${VIDEO_MAX_DURATION} seconds`,
      });
    } else if (
      clipDuration < VIDEO_MIN_DURATION ||
      clipDuration >= VIDEO_MAX_DURATION + 1
    ) {
      this.props.showAlert("Clip must be b/w 5 and 60 seconds long");
      return;
    }

    if (this.state.game === null) {
      this.props.showAlert("Choose a game");
      return;
    }

    // Check title length
    if (this.state.title === "") {
      this.props.showAlert("Title can't be empty");
      return;
    }

    if (this.state.title.length > POST_TITLE_LENGTH) {
      this.props.showAlert("Title has to be less than 80 characters");
    }

    const token = await this.recaptchaRef.current.executeAsync();

    // Get a presigned url
    this.setState({ disable: true, isUploading: true });
    const splitList = this.props.videoInfo.name.split(".");

    try {
      const APIKit = await createAPIKit();
      const s3_presigned_response = await APIKit.post(
        "/clips/presigned/web/",
        {
          recaptcha_token: token,
          clip_size: this.props.videoInfo.size,
          clip_type: splitList[splitList.length - 1],
          game_code: this.state.game.id,
          title: this.state.title,
          tags: this.state.tags.map((tag) => tag.username),
          clip_height: this.videoRef.current.videoHeight || 0,
          clip_width: this.videoRef.current.videoWidth || 0,
          duration: clipDuration || 0,
        },
        { cancelToken: this.cancelTokenSource.token }
      );

      if (s3_presigned_response.status === 200) {
        const { url, post_id } = s3_presigned_response.data.payload;
        this.setState({ post_id, fileKey: url.fields.key });
        try {
          const uploadProgress = (event) => {
            const progress = Math.round((100 * event.loaded) / event.total);
            this.setState({ progress });
          };

          const uploadSuccess = async () => {
            // Show success animation
            this.postStatusListener = setInterval(
              this.checkCompressed,
              10 * 1000
            );

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
          // append the fields in url in formData
          Object.keys(url.fields).forEach((key) => {
            formData.append(key, url.fields[key]);
          });

          // append the file
          formData.append("file", this.props.videoInfo);

          axios
            .post(url.url, formData, {
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

  render = () => {
    return (
      <div className="Upload">
        {this.state.showingAnimation && (
          <div className="Upload-animation-parent">
            <div className="Upload-animation" ref={this.animationRef} />
          </div>
        )}
        <span>{this.props.videoInfo.name}</span>
        <div style={{ height: 30, marginBottom: 10 }}>
          {this.state.error ? (
            <span style={{ color: "red" }}>{this.state.error}</span>
          ) : this.state.warning ? (
            <span style={{ color: "#ffc107" }}>{this.state.warning}</span>
          ) : null}
        </div>

        <Title
          title={this.state.title}
          setTitle={(title) => this.setState({ title })}
          disable={this.state.disable}
        />

        <SelectGame
          game={this.state.game}
          setGame={(game) => this.setState({ game })}
          disable={this.state.disable}
          setError={(error) => this.setState({ error })}
        />

        <Tags
          tags={this.state.tags}
          setTags={(newTags) => this.setState({ tags: newTags })}
          disable={this.state.disable}
        />

        <video ref={this.videoRef} hidden>
          <source src={this.props.videoUrl} />
        </video>
        <Recaptcha recaptchaRef={this.recaptchaRef} />
        {this.state.isUploading ? (
          this.state.progress < 100 ? (
            <ProgressBar progress={this.state.progress} />
          ) : this.state.showShare ? (
            <Share
              title={this.state.title}
              game_name={this.state.game.name}
              post_id={this.state.post_id}
            />
          ) : (
            <span>Creating a shareable link...</span>
          )
        ) : (
          <ButtonsGroup
            disable={this.state.disable}
            handleCancel={this.handleCancel}
            handleUpload={this.handleUpload}
          />
        )}
      </div>
    );
  };
}

const Wrapper = (props) => {
  let alert = useAlert();
  return (
    <UploadVideo showAlert={(message) => alert.show(message)} {...props} />
  );
};

export default Wrapper;
