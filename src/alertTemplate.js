import React from "react";
import { IoAlertCircleOutline } from "react-icons/io5";
import { defaultIconStyle } from "./utils/styles";

const alertStyle = {
  backgroundColor: "#151515",
  color: "white",
  padding: "10px",
  borderRadius: "10px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const AlertTemplate = ({ message, style }) => {
  return (
    <div style={{ ...alertStyle, ...style }}>
      <IoAlertCircleOutline style={defaultIconStyle} />
      <span>{message}</span>
    </div>
  );
};

export default AlertTemplate;
