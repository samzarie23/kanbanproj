import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoBack = () => {
    // If there's a previous page, go back; otherwise, go to home or login
    if (location.key !== "default") {
      navigate(-1);
    } else {
      navigate("/"); 
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>🚫 Unauthorized Access</h1>
      <p>You do not have permission to view this page.</p>
      <button onClick={handleGoBack} style={{ backgroundColor: "#D22030",marginTop: "20px" }}>
        Go Back
      </button>
    </div>
  );
};

export default Unauthorized;