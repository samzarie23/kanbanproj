import React from "react";
import { useNavigate } from "react-router-dom"; 

interface Props {
  title: string;
  showButton?: boolean; 
  buttonLabel?: string; 
  onButtonClick?: () => void; 
}

const Dashboard_Bar: React.FC<Props> = ({
  title,
  showButton = false,
  buttonLabel = "Go", 
  onButtonClick, 
}) => {
  const navigate = useNavigate();

  const handleNavigateToAdminLanding = () => {
    navigate("/admin-landing");
  };

  
  const handleButtonClick = onButtonClick || handleNavigateToAdminLanding;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        color: "white",
        backgroundColor: "black",
        width: "100%",
        height: "30px",
        paddingLeft: "20px",
        marginTop: "5px",
        fontSize: "18px",
        fontWeight: "bold",
        fontFamily: "Helvetica, Arial, sans-serif",
      }}
    >
      <div>{title}</div>
      {showButton && (
        <button
          onClick={handleButtonClick}
          style={{
            marginLeft: "0px",
            backgroundColor: "black",
            color: "white",
            padding: "0px 60px",
            border: "none",
            cursor: "pointer",
            fontSize: "18px",
          
          fontFamily: "Helvetica, Arial, sans-serif",
          }}
        >
          {buttonLabel}
        </button>
      )}
    </div>
  );
};

export default Dashboard_Bar;
