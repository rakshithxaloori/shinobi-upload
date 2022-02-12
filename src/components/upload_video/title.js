import React from "react";

import { POST_TITLE_LENGTH, VIDEO_WIDTH } from "../../utils";

const Title = ({ title, setTitle, disable }) => {
  const defInputStyle = { width: VIDEO_WIDTH - 100 };
  const defCountStyle = {
    fontSize: 12,
    position: "relative",
    bottom: 20,
    left: VIDEO_WIDTH - 70,
  };
  let inputStyle =
    title.length > POST_TITLE_LENGTH
      ? { color: "red", ...defInputStyle }
      : { ...defInputStyle };
  let countStyle =
    title.length > POST_TITLE_LENGTH
      ? { color: "red", ...defCountStyle }
      : { ...defCountStyle };

  return (
    <div>
      <div className="input-group mb-3" style={{ marginTop: 40 }}>
        <div className="input-group-prepend">
          <span className="input-group-text">
            <ion-icon name="document-text-outline"></ion-icon>
          </span>
        </div>
        <input
          className="form-control"
          style={inputStyle}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder="Clip Title"
          required
          disabled={disable}
        />
      </div>
      <span style={countStyle}>{title.length}/80</span>
    </div>
  );
};

export default Title;
