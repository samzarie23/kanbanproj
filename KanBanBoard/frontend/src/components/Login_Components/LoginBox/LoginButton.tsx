import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


interface CustomJwtPayload {
  role: string;
}

const LoginButton: React.FC = () => {
  const [show2FAField, setShow2FAField] = useState(false);
  const [twoFACode, setTwoFACode] = useState("");
  const [showLoginFields, setShowLoginFields] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleClick = () => {
    setShowLoginFields(true);
  };

  const handleLogin = async () => {
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Response Data:", data);

      if (response.ok && data.message === 'login successful') {
        setSuccess("Login successful!");
        setShow2FAField(true);
      } else {
        setError("Incorrect email or password, please try again.");
      }
    } catch (error) {
      setError("An error occurred during login.");
      console.log(error);
    }
  };

  const handle2FAVerification = async () => {
    setError("");
    setSuccess("");
    try {
      const response = await fetch("http://localhost:3000/api/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code: twoFACode }),
      });

      const data = await response.json();
      if (response.ok && data.message === '2FA code correct') {
        setSuccess("2FA code correct");
        localStorage.setItem("token", data.token);
        console.log(success);
        

        
        const decodedToken = jwtDecode<CustomJwtPayload>(data.token);
        const userRole = decodedToken.role

        if (userRole === "admin") {
          navigate("/admin-landing");
        } else if (userRole === "employee") {
          navigate("/employee-landing");
        }
      } else {
        setError("Two Factor Code incorrect. Check the code and try again.");
      }
    } catch (error) {
      setError("Error occurred when trying to verify 2FA");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/*Login Button */}
      {!showLoginFields && (
        <button
          onClick={handleClick}
          style={{
            backgroundColor: "black",
            color: "white",
            fontSize: "25px",
            fontWeight: "bold",
            fontFamily: "Helvetica, Arial, sans-serif",
            width: "350px",
            padding: "15px",
            border: "none",
            borderRadius: "5px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            marginTop: "-75px",
          }}
        >
          <span>Login</span>
        </button>
      )}
      {/* Email & Password Fields with Login Button */}
      {showLoginFields && (
        <div style={{ marginTop: "20px", width: "350px" }}>
          {/* Email Input */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "18px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              marginBottom: "10px",
              marginTop: "-50px",
            }}
          />

          {/* Password Input */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "18px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              marginBottom: "20px",
            }}
          />

          {/* Login Button */}
          <button
            onClick={handleLogin}
            style={{
              backgroundColor: "black",
              color: "white",
              fontSize: "20px",
              fontWeight: "bold",
              fontFamily: "Helvetica, Arial, sans-serif",
              width: "100%",
              padding: "12px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Login
          </button>
          {/*2FA Popup */}
          {show2FAField && (
            <div style={{ marginTop: "20px", width: "350px" }}>
              <input
                type="text"
                placeholder="Enter 2FA code"
                value={twoFACode}
                onChange={(e) => setTwoFACode(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  fontSize: "18px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  marginBottom: "20px",
                }}
              />
              <button
                onClick={handle2FAVerification}
                style={{
                  backgroundColor: "black",
                  color: "white",
                  fontSize: "20px",
                  fontWeight: "bold",
                  width: "100%",
                  padding: "12px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Verify Two Factor Authorization
              </button>
            </div>
          )}
          {/*Error Message if login fails*/}
          <div
            style={{
              marginTop: "15px",
              color: "red",
              fontWeight: "bold",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginButton;