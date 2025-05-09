import React from "react";
import "./LoginBox.css";
import InnerBox from "./InnerBox";

interface Props {
  Loginy: number;
}

const LoginBox: React.FC<Props> = ({ Loginy }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: `${Loginy}px`,
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "500px",
        height: "665px",
        backgroundColor: "#D22030",
        borderRadius: "30px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        textAlign: "center",
        paddingTop: "5px",
      }}
    >
      <p className="login"> Login</p>
      <InnerBox />
    </div>
  );
};

export default LoginBox;
