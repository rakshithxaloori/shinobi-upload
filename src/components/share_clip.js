import React from "react";
import { useAlert } from "react-alert";
import { BsFacebook, BsReddit, BsTwitter } from "react-icons/bs";
import { HiOutlineClipboardCheck, HiOutlineClipboard } from "react-icons/hi";
import UserContext from "../userContext";

const SOCIALS_ICON_SIZE = 30;
const CLIPBOARD_ICON_SIZE = 26;

const Share = ({ title, game_name, post_id }) => {
  const context = React.useContext(UserContext);
  const { user } = context;
  const alert = useAlert();
  const [copied, setCopied] = React.useState(false);

  post_id = "SHgoDBdaE5L0";
  title = "test share";
  game_name = "Test Game";

  const shinobi_url = `https://shinobi.cc/clip/${post_id}`;

  // REFERENCE https://developers.facebook.com/docs/sharing/reference/share-dialog

  const reddit_title = title;
  const reddit_text = `${user?.username} | Shinobi\n${shinobi_url}`;

  const twitter_text = `${title}\nA ${game_name} clip by ${user?.username} | Shinobi\n${shinobi_url}`;

  const copyTextToClipboard = async (text) => {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  };

  const clickCopy = async () => {
    await copyTextToClipboard(shinobi_url);
    alert.show("Copied");
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 5000);
  };

  return (
    <div style={{ margin: 20 }}>
      <section
        style={{
          display: "flex",
          flexDirection: "row",
          marginTop: 10,
          marginBottom: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span
          style={{
            paddingLeft: 5,
            paddingRight: 5,
          }}
        >
          {shinobi_url}
        </span>
        <span onClick={clickCopy}>
          {copied ? (
            <HiOutlineClipboardCheck size={CLIPBOARD_ICON_SIZE} />
          ) : (
            <HiOutlineClipboard size={CLIPBOARD_ICON_SIZE} />
          )}
        </span>
      </section>
      <section
        style={{
          display: "flex",
          flexDirection: "row",
          marginTop: 10,
          marginBottom: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <a
          href="https://facebook.com"
          rel="noopener noreferrer"
          target="_blank"
          style={styles.icon}
        >
          <BsFacebook size={SOCIALS_ICON_SIZE} color="#4267B2" />
        </a>
        <a
          href={`https://reddit.com/submit?title=${encodeURI(
            reddit_title
          )}&text=${encodeURI(reddit_text)}`}
          rel="noopener noreferrer"
          target="_blank"
          style={styles.icon}
        >
          <BsReddit size={SOCIALS_ICON_SIZE} color="#FF5700" />
        </a>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURI(
            twitter_text
          )}`}
          rel="noopener noreferrer"
          target="_blank"
          style={styles.icon}
        >
          <BsTwitter size={SOCIALS_ICON_SIZE} color="#1DA1F2" />
        </a>
      </section>
    </div>
  );
};

const styles = {
  icon: { margin: 10 },
};

export default Share;
