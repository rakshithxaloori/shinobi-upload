import axios from "axios";

const createErrorStr = (error) => {
  console.log(error);
  if (error.response) {
    // Request made and server responded
    console.log("ERROR DATA", error.response.data);
    console.log("ERROR STATUS", error.response.status);
    if (error.response.status >= 500) return "Server Error";
    else return error.response.data.detail;
  } else if (error.request) {
    // The request was made but no response was received
    console.log("The request was made but no response was received");
    return "No Internet Connection";
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log("ERROR MESSAGE", error.message);
    return error.message;
  }
};

export const handleAPIError = (error) => {
  if (!axios.isCancel(error)) {
    const errorStr = createErrorStr(error);
    console.log(errorStr);
    return errorStr;
  }
  return null;
};
