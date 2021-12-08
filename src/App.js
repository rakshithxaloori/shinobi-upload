import React from "react";
import axios from "axios";

import Home from "./home";
import Header from "./header";
import Footer from "./footer";

import "./App.css";
import { getUser, removeUser, setUser } from "./utils/token";
import UserContext from "./userContext";
import { createAPIKit } from "./utils/APIKit";
import { showAlert } from "./utils/alert";
import { handleAPIError } from "./utils/error";

function App() {
  let cancelTokenSource = axios.CancelToken.source();

  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "RESTORE_TOKEN":
          setUser({ user: action.user, token: action.token });
          return {
            isLoggedIn: true,
            user: action.user,
            token: action.token,
          };
        case "INVALID_TOKEN":
          removeUser();
          return {
            isLoggedIn: false,
            user: null,
            token: null,
          };
        case "SIGN_IN":
          setUser({ user: action.user, token: action.token });
          return {
            isLoggedIn: true,
            user: action.user,
            token: action.token,
          };
        case "SIGN_OUT":
          removeUser();
          return {
            isLoggedIn: false,
            user: null,
            token: null,
          };
        default:
          return {
            isLoggedIn: false,
            user: null,
            token: null,
          };
      }
    },
    {
      isLoggedIn: false,
      user: null,
      token: null,
    }
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      const userToken = getUser()?.token;

      try {
        // After restoring token, we may need to validate it
        if (userToken) {
          const onSuccess = (response) => {
            const user = response.data?.payload;
            dispatch({ type: "RESTORE_TOKEN", user: user, token: userToken });
          };

          const onFailure = async (error) => {
            if (error.response) {
              const { status, data } = error.response;
              if (status < 500) {
                showAlert(data.detail);
                dispatch({ type: "INVALID_TOKEN" });
              } else {
                showAlert("Trouble connecting to the internet", 5000);
              }
            } else {
              showAlert(handleAPIError(error));
            }
          };

          const APIKit = await createAPIKit();
          APIKit.get("auth/valid/", { cancelToken: cancelTokenSource.token })
            .then(onSuccess)
            .catch(onFailure);
        } else {
          dispatch({ type: "INVALID_TOKEN" });
        }
      } catch (e) {
        // Restoring token failed
        dispatch({ type: "INVALID_TOKEN" });
      }
    };

    bootstrapAsync();

    return () => {
      cancelTokenSource.cancel();
    };
  }, []);

  const authContext = React.useMemo(
    () => ({
      loginUser: (newUserObj) => {
        dispatch({
          type: "SIGN_IN",
          user: { username: newUserObj.username, picture: newUserObj.picture },
          token: newUserObj.token_key,
        });
      },
      logoutUser: () => {
        dispatch({
          type: "SIGN_OUT",
        });
      },
    }),
    []
  );

  return (
    <div className="App">
      <UserContext.Provider value={{ ...authContext, user: state.user }}>
        <Header />
        <Home />
        <Footer />
      </UserContext.Provider>
    </div>
  );
}

export default App;
