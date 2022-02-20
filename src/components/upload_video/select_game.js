import React from "react";
import { useAlert } from "react-alert";
import { IoCloseCircle, IoGameControllerOutline } from "react-icons/io5";
import axios from "axios";

import { createAPIKit } from "../../utils/APIKit";
import { handleAPIError } from "../../utils/error";
import { VIDEO_WIDTH } from "../../utils";
import { defaultIconStyle } from "../../utils/styles";

const GAME_ICON_SIZE = 30;

const SelectGame = ({ game, setGame, disable, setError }) => {
  let alert = useAlert();
  const [searchText, setSearchText] = React.useState("");
  const [games, setGames] = React.useState([]);
  const [showGames, setShowGames] = React.useState(false);

  React.useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source();
    const fetchGames = async () => {
      const onSuccess = (response) => {
        const { games } = response.data?.payload;
        setGames(games);
        if (games.length === 0) {
          if (searchText === "") {
            setError("");
          } else {
            setError(
              `Sorry, we don't have "${searchText}" game. Let us know on Discord or Reddit`
            );
          }
        }
      };

      const APIKit = await createAPIKit();
      APIKit.post(
        "/profile/games/search/",
        { search: searchText },
        { cancelToken: cancelTokenSource.token }
      )
        .then(onSuccess)
        .catch((e) => {
          alert.show(handleAPIError(e));
        });
    };
    fetchGames();
  }, [searchText]);

  const handleSearchChange = (event) => {
    if (event.target.value === "") {
      setSearchText("");
      setGames([]);
      return;
    }
    setSearchText(event.target.value);
    setError("");
  };

  const selectGame = (game) => {
    setGame(game);
    setSearchText("");
    setGames([]);
    setShowGames(false);
  };

  return (
    <div style={{ width: "100%" }}>
      {game ? (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
            position: "relative",
            borderRadius: 10,
            backgroundColor: "rgba(128, 128, 128, 0.16)",
            padding: "5px",
          }}
        >
          <img
            src={game.logo_url}
            style={{ borderRadius: GAME_ICON_SIZE / 2 }}
            height={GAME_ICON_SIZE}
            alt="Shinobi"
          />
          <span style={{ marginLeft: 10 }}>{game.name}</span>
          <span
            style={{
              position: "absolute",
              right: 10,
              display: "flex",
              alignItems: "center",
            }}
            onClick={() => {
              if (!disable) {
                setGame(null);
              }
            }}
          >
            <IoCloseCircle style={defaultIconStyle} />
          </span>
        </div>
      ) : (
        <div
          style={{ borderWidth: 5, borderColor: "black" }}
          onFocus={() => setShowGames(true)}
        >
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <IoGameControllerOutline style={defaultIconStyle} />
              </span>
            </div>
            <input
              className="form-control"
              style={{ width: VIDEO_WIDTH - 100 }}
              value={searchText}
              onChange={handleSearchChange}
              type="search"
              placeholder="Choose Game"
              required
              disabled={disable}
            />
          </div>
          {showGames && games.length > 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "white",
                boxShadow: "0px 3px 20px rgb(0 0 0 / 0.2)",
                position: "absolute",
                marginLeft: "60px",
                zIndex: 2,
                borderRadius: 10,
                padding: "5px",
                width: VIDEO_WIDTH - 100,
              }}
            >
              {games.map((game) => (
                <Game key={game.id} game={game} selectGame={selectGame} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Game = ({ game, selectGame }) => {
  return (
    <span
      className="Upload-game"
      onClick={() => {
        console.log("ONCLICK");
        selectGame(game);
      }}
    >
      <img
        src={game.logo_url}
        style={{ borderRadius: GAME_ICON_SIZE / 2 }}
        height={GAME_ICON_SIZE}
        alt="Shinobi"
      />
      <span style={{ marginLeft: 10 }}>{game.name}</span>
    </span>
  );
};

export default SelectGame;
