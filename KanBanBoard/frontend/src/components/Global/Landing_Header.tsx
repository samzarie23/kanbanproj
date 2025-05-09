import React from "react";
import Logo from "./Logo";
import Profile_Button from "./Profile_Button";
import Notification_Button from "./Notification_Button";

const Landing_Header: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <Logo />
      <Profile_Button />
      <Notification_Button />
    </div>
  );
};

export default Landing_Header;
