import React from "react";
import GoogleLogin from "react-google-login";
import axios from "axios";

import "../styles/google_login.css";

import { createAPIKit } from "../utils/APIKit";
import { handleAPIError } from "../utils/error";
import UserContext from "../userContext";

const GLoginBtn = () => {
  const context = React.useContext(UserContext);
  const cancelTokenSource = axios.CancelToken.source();

  React.useEffect(() => {
    return () => {
      cancelTokenSource.cancel();
    };
  });

  const success = async (response) => {
    const { accessToken } = response;
    console.log(accessToken, response);

    const onSuccess = (api_response) => {
      context.loginUser(api_response.data.payload);
    };

    const APIKit = await createAPIKit();
    APIKit.post(
      "/auth/login/google/",
      {
        access_token: accessToken,
      },
      { cancelToken: cancelTokenSource.token }
    )
      .then(onSuccess)
      .catch((e) => {
        handleAPIError(e);
      });
  };

  const fail = (response) => {
    console.log(response.error);
  };

  return (
    <GoogleLogin
      theme="dark"
      prompt="consent"
      clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID}
      buttonText="Signin with Google"
      onSuccess={success}
      onFailure={fail}
      cookiePolicy={"single_host_origin"}
    />
  );
};

export default GLoginBtn;
