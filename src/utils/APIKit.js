import axios from "axios";
import { getUser } from "./token";

export let API_ENDPOINT = undefined;
if (process.env.REACT_APP_CI_CD_STAGE === "production")
  API_ENDPOINT = `https://${process.env.REACT_APP_BASE_API_ENDPOINT}`;
else API_ENDPOINT = `http://${process.env.REACT_APP_BASE_API_ENDPOINT}`;

export const createAPIKit = async () => {
  let APIKit = axios.create({
    baseURL: API_ENDPOINT,
    timeout: 10000,
    headers: { "X-Api-Key": process.env.REACT_APP_API_KEY },
  });

  let token = getUser()?.token;
  if (token !== null && token !== undefined) {
    APIKit.defaults.headers.common["Authorization"] = `Token ${token}`;
  }
  return APIKit;
};
