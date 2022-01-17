import React from "react";
import ReactPlayer from "react-player/lazy";
import { useAlert } from "react-alert";
import axios from "axios";
import lottie from "lottie-web";

import "../../styles/upload_video.css";
import { createAPIKit } from "../../utils/APIKit";
import { handleAPIError } from "../../utils/error";
import ButtonsGroup from "./buttons";
import ProgressBar from "./progress_bar";
import Recaptcha from "./recaptcha";

const VIDEO_HEIGHT = 360;
const VIDEO_WIDTH = 640;
const VIDEO_MAX_SIZE = 500 * 1000 * 1000;
const VIDEO_MIN_DURATION = 5;
const VIDEO_MAX_DURATION = 60;
const POST_TITLE_LENGTH = 80;

const Game = ({ game, selectGame }) => {
  return (
    <span
      className="Upload-game"
      onClick={() => {
        selectGame(game);
      }}
    >
      <img
        src={game.logo_url}
        style={{ borderRadius: 20 }}
        height={40}
        alt="Shinobi"
      />
      <span style={{ marginLeft: 10 }}>{game.name}</span>
    </span>
  );
};

class UploadVideo extends React.Component {
  videoRef = React.createRef();
  recaptchaRef = React.createRef();
  animationRef = React.createRef();

  cancelTokenSource = axios.CancelToken.source();

  state = {
    fileKey: null,
    title: "",
    searchText: "",
    games: [],
    chosenGame: null,
    progress: 0,
    disable: false,
    isUploading: false,
    error: "",
    showingAnimation: false,
  };

  loadAnimation = () => {
    const callback = () => {
      const anim = lottie.loadAnimation({
        container: this.animationRef.current,
        path: "/animations/81296-success.json",
      });
      anim.setSpeed(0.5);
      setTimeout(() => {
        this.setState({ showingAnimation: false }, () => {
          anim.destroy();
        });
      }, 6000);
    };

    this.setState({ showingAnimation: true }, callback);
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

  selectGame = (game) => {
    this.setState({ chosenGame: game, searchText: "", games: [] });
  };

  handleTitleChange = (event) => {
    this.setState({ title: event.target.value });
  };

  handleGameChange = (event) => {
    if (event.target.value === "") {
      this.setState({ searchText: "", games: [] });
      return;
    }
    const callback = async () => {
      const onSuccess = (response) => {
        const { games } = response.data?.payload;
        this.setState({ games });
        if (games.length === 0) {
          if (this.state.searchText === "") {
            this.setState({ error: "" });
          } else {
            this.setState({
              error: `Sorry, we don't have "${this.state.searchText}" game. Let us know on Discord or Reddit`,
            });
          }
        }
      };

      const APIKit = await createAPIKit();
      APIKit.post(
        "/profile/games/search/",
        { search: this.state.searchText },
        { cancelToken: this.cancelTokenSource.token }
      )
        .then(onSuccess)
        .catch((e) => {
          this.props.showAlert(handleAPIError(e));
        });
    };

    this.setState({ searchText: event.target.value, error: "" }, callback);
  };

  handleCancel = async () => {
    await this.recaptchaRef.current.reset();
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

    if (this.state.chosenGame === null) {
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
    const player = this.videoRef.current.getInternalPlayer();
    const splitList = this.props.videoInfo.name.split(".");

    try {
      const APIKit = await createAPIKit();
      const s3_presigned_response = await APIKit.post(
        "/clips/presigned/web/",
        {
          recaptcha_token: token,
          clip_size: this.props.videoInfo.size,
          clip_type: splitList[splitList.length - 1],
          game_code: this.state.chosenGame.id,
          title: this.state.title,
          clip_height: player.videoHeight || 720,
          clip_width: player.videoWidth || 720,
          duration: clipDuration,
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
            // Show success animation
            this.loadAnimation();

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

  render = () => {
    const defInputStyle = { width: VIDEO_WIDTH - 100 };
    const defCountStyle = {
      fontSize: 12,
      position: "relative",
      bottom: 20,
      left: VIDEO_WIDTH - 30,
    };

    let inputStyle =
      this.state.title.length > POST_TITLE_LENGTH
        ? { color: "red", ...defInputStyle }
        : { ...defInputStyle };
    let countStyle =
      this.state.title.length > POST_TITLE_LENGTH
        ? { color: "red", ...defCountStyle }
        : { ...defCountStyle };

    return (
      <div className="Upload">
        {this.state.showingAnimation && (
          <div className="Upload-animation-parent">
            <div className="Upload-animation" ref={this.animationRef} />
          </div>
        )}
        {this.state.chosenGame ? (
          <div className="Upload-chosen-game" style={{ width: VIDEO_WIDTH }}>
            <img
              src={this.state.chosenGame.logo_url}
              style={{ borderRadius: 20 }}
              height={40}
              alt="Shinobi"
            />
            <span style={{ marginLeft: 10 }}>{this.state.chosenGame.name}</span>
            <span
              style={{ position: "absolute", right: 10 }}
              onClick={() => {
                if (!this.state.disable) {
                  this.setState({ chosenGame: null });
                }
              }}
            >
              <ion-icon name="close-circle-outline"></ion-icon>
            </span>
          </div>
        ) : (
          <>
            <div style={{ height: 30, color: "red", marginBottom: 10 }}>
              {this.state.error && <span className="">{this.state.error}</span>}
            </div>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <ion-icon name="game-controller-outline"></ion-icon>
                </span>
              </div>
              <input
                className="form-control"
                style={{ width: VIDEO_WIDTH - 100 }}
                value={this.state.searchText}
                onChange={this.handleGameChange}
                type="search"
                placeholder="Choose Game"
                required
                disabled={this.state.disable}
              />
            </div>
          </>
        )}

        {this.state.games.length > 0 && (
          <div
            className="Upload-games-list"
            style={{ width: VIDEO_WIDTH - 100 }}
          >
            {this.state.games.map((game) => (
              <Game key={game.id} game={game} selectGame={this.selectGame} />
            ))}
          </div>
        )}

        <div className="input-group mb-3" style={{ marginTop: 40 }}>
          <span className="input-group-text">Clip Title</span>
          <input
            className="form-control"
            style={inputStyle}
            value={this.state.title}
            onChange={this.handleTitleChange}
            type="text"
            placeholder="One tap headshots y'all!"
            required
            disabled={this.state.disable}
          />
        </div>
        <span style={countStyle}>{this.state.title.length}/80</span>

        <ReactPlayer
          ref={this.videoRef}
          height={VIDEO_HEIGHT}
          width={VIDEO_WIDTH}
          controls
          url={this.props.videoUrl}
        />
        <Recaptcha recaptchaRef={this.recaptchaRef} />
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
  };
}

const Wrapper = (props) => {
  let alert = useAlert();
  return (
    <UploadVideo showAlert={(message) => alert.show(message)} {...props} />
  );
};

export default Wrapper;
