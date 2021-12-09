import React from "react";

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
      <ion-icon name="alert-circle-outline"></ion-icon>
      <span>{message}</span>
    </div>
  );
};

export default AlertTemplate;
