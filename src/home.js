import React from "react";

import "./styles/home.css";

import GLoginBtn from "./components/google_login";

const Home = () => {
  const [section, setSection] = React.useState(0);
  return <div className="Home">{section === 0 ? <GLoginBtn /> : null}</div>;
};

export default Home;
