import React from "react";
import GoogleLogin from "react-google-login";

import "../styles/google_login.css";

const GLoginBtn = () => {
  const responseGoogle = (response) => {
    console.log(response);
  };

  return (
    <GoogleLogin
      theme="dark"
      clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID}
      buttonText="Signin with Google"
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
      cookiePolicy={"single_host_origin"}
    />
  );
};

export default GLoginBtn;
