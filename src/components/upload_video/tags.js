import React from "react";
import { useAlert } from "react-alert";
import { IoCloseCircle, IoPricetag } from "react-icons/io5";
import axios from "axios";

import Modal from "../Modal";

import { createAPIKit } from "../../utils/APIKit";
import { handleAPIError } from "../../utils/error";
import { VIDEO_WIDTH } from "../../utils";
import { defaultIconStyle } from "../../utils/styles";

const PICTURE_SIZE = 30;

const followersListStyle = {
  display: "flex",
  flexDirection: "column",
  backgroundColor: "white",
  boxShadow: "0px 3px 20px rgb(0 0 0 / 0.2)",
  position: "absolute",
  zIndex: 2,
  marginLeft: "60px",
  borderRadius: 10,
  padding: "5px",
  width: VIDEO_WIDTH - 100,
};

const tagStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  position: "relative",
  borderRadius: 10,
  backgroundColor: "rgba(128, 128, 128, 0.16)",
  padding: 8,
  margin: 5,
};

const Tags = ({ tags, setTags, disable }) => {
  let alert = useAlert();
  const [searchText, setSearchText] = React.useState("");
  const [followers, setFollowers] = React.useState([]);
  const [showModal, setShowModal] = React.useState(false);

  const selectFollower = (newTag) => {
    if (tags.length >= 10) {
      alert.show("You can only add upto 10 tags");
      return;
    }
    if (tags.filter((e) => e.username === newTag.username).length > 0)
      alert.show(`${newTag.username} already tagged`);
    else setTags([...tags, newTag]);
    setSearchText("");
    setFollowers([]);
  };

  const removeTag = (removeTag) => {
    const newTags = tags.filter((tag) => tag.username !== removeTag.username);
    setTags(newTags);
  };

  React.useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source();
    const fetchFollowers = async () => {
      const onSuccess = (response) => {
        const { users } = response.data?.payload;
        setFollowers(users);
      };

      const APIKit = await createAPIKit();
      APIKit.get(`profile/search/followers/${searchText}/`, {
        cancelToken: cancelTokenSource.token,
      })
        .then(onSuccess)
        .catch((e) => {
          alert.show(handleAPIError(e));
        });
    };
    if (searchText !== "") fetchFollowers();
    else {
      setFollowers([]);
    }
  }, [searchText]);

  return (
    <div style={{ marginTop: 30 }}>
      {tags.length > 0 && (
        <div
          style={{
            display: "flex",
            height: 40,
            marginLeft: 10,
            alignItems: "center",
            borderWidth: 0,
            backgroundColor: "white",
          }}
          onClick={() => setShowModal(true)}
        >
          <IoPricetag style={defaultIconStyle} />
          <span onClick={() => {}}>
            Tagged {tags[0].username}{" "}
            {tags.length > 1 && `${tags.length - 1} others`}
          </span>
        </div>
      )}
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <span className="input-group-text">
            <IoPricetag style={defaultIconStyle} />
          </span>
        </div>
        <input
          className="form-control"
          style={{ width: VIDEO_WIDTH - 100 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          type="text"
          placeholder="Tag your friends"
          required
          disabled={disable}
        />
      </div>
      {followers.length > 0 && (
        <div style={followersListStyle}>
          {followers.map((follower) => (
            <Follower
              key={follower.user.username}
              follower={follower}
              selectFollower={selectFollower}
            />
          ))}
        </div>
      )}
      {
        <Modal
          title="Tagged in the clip"
          show={showModal}
          handleClose={() => setShowModal(false)}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            {tags.length > 0 &&
              tags.map((tag) => (
                <Tag key={tag.username} tag={tag} removeTag={removeTag} />
              ))}
          </div>
        </Modal>
      }
    </div>
  );
};

const Follower = ({ follower, selectFollower }) => {
  const { user } = follower;
  return (
    <span
      className="Upload-game"
      onClick={() => {
        selectFollower(user);
      }}
    >
      <img
        src={user.picture}
        style={{
          borderRadius: PICTURE_SIZE / 2,
          height: PICTURE_SIZE,
          width: PICTURE_SIZE,
        }}
        height={PICTURE_SIZE}
        alt={user.username}
      />
      <span style={{ marginLeft: 10 }}>{user.username}</span>
    </span>
  );
};

const Tag = ({ tag, removeTag }) => {
  return (
    <span style={tagStyle}>
      <img
        src={tag.picture}
        style={{
          borderRadius: PICTURE_SIZE / 2,
          height: PICTURE_SIZE,
          width: PICTURE_SIZE,
        }}
        height={PICTURE_SIZE}
        alt={tag.username}
      />
      <span style={{ marginLeft: 10 }}>{tag.username}</span>
      <span
        style={{
          position: "absolute",
          right: 10,
          display: "flex",
          alignItems: "center",
        }}
        onClick={() => {
          removeTag(tag);
        }}
      >
        <IoCloseCircle style={defaultIconStyle} />
      </span>
    </span>
  );
};

export default Tags;
