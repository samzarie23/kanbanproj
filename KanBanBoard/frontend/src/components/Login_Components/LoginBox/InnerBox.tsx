import React from "react";
import LoginButton from "./LoginButton";

const InnerBox: React.FC = () => {
  return (
    <div
      style={{
        width: "400px",
        height: "450px",
        backgroundColor: "white",
        borderRadius: "15px",
        border: "0px solid black",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        marginTop: "20px",
      }}
    >
      <LoginButton />
    </div>
  );
};

export default InnerBox;
