import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile_Button: React.FC = () => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownVisible((prevState) => !prevState);
  };

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        padding: "10px",
      }}
    >
      <button
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#D9D9D9",
          border: "5px",
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          top: "12.9px",
          right: "30px",
        }}
        onClick={toggleDropdown}
      >
        <img
          src="src\assets\images\image 3.png"
          alt="Profile"
          style={{
            width: "200%",
            height: "150%",
            objectFit: "cover",
          }}
        />
      </button>
      {/* Dropdown Menu */}
      {isDropdownVisible && (
        <div
          style={{
            position: "absolute",
            top: "80px",
            right: "0px",
            backgroundColor: "#EAEAEA",
            border: "3px solid #CFCFCF",
            padding: "10px",
            borderRadius: "5px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            zIndex: 1,
          }}
        >
          <button
            onClick={handleLogout}
            style={{
              background: "#D22030",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              color: "white",
              fontFamily: "Helvetica, Arial, sans-serif",

              padding: "8px 12px",
            }}
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile_Button;
