import React from "react";
import MyImage from "../../assets/images/CSUN_Lock-Up_Horizontal_PMS186 (1).png";

const Logo: React.FC = () => {
  return (
    <div>
      <img
        src={MyImage}
        alt="Logo"
        style={{
          width: "500px",
          height: "80.78px",
        }}
      />
    </div>
  );
};

export default Logo;
