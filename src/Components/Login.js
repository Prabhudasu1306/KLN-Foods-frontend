import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import axios from "axios";
import "./Login.css";
import Biryani from '../Images/Biryani.jpg';
import Veg from '../Images/veg.jpg';
import Tiffin from '../Images/Tffin.jpg';
import KLN from '../Images/KLN.jpeg';
import KLN1 from '../Images/KLN1.jpeg';
import KLN5 from '../Images/KLN5.jpeg';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { logIn } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      setMessage("Please enter both email and password.");
      return;
    }
  
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/users/all");
      const users = response.data;
  
      const matchedUser = users.find(
        (user) => user.email === email && user.password === password
      );
  
      if (matchedUser) {
        setMessage("");
        logIn(matchedUser.firstName);
        onLoginSuccess(matchedUser.firstName, matchedUser.email, matchedUser.role);
  
        
        localStorage.setItem("user", JSON.stringify(matchedUser));
  
        if (matchedUser.role === "CUSTOMER") {
          navigate("/home");
        } else if (matchedUser.role === "ADMIN") {
          navigate("/admin");
        }
      } else {
        setMessage("Incorrect email or password.");
      }
    } catch (error) {
      setMessage("Error occurred. Try again later.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setEmail("");
    setPassword("");
    setMessage("");
  };

  return (
    <div className="page-container">
      <div className="left-container">
        <div className="scrolling-images">
          <div className="image-container-inner">
            <img src={KLN} alt="KLN" />
            <img src={KLN1} alt="KLN1" />
            <img src={KLN5} alt="KLN5" />
          </div>
        </div>
      </div>

      <div className="center-container">
        <div className="login-container">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <div className="login-forms">
              <div className="login-input-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="login-input-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {message && <p className="login-error-message">{message}</p>}
            </div>
            <div className="login-button-group">
              <button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Log In"}
              </button>
              <button type="button" onClick={handleClear}>
                Clear
              </button>
            </div>
            <p>
              New member? <Link to="/signup">Sign up</Link>
            </p>
          </form>
        </div>
      </div>

      <div className="right-container food-images">
        <img src={Biryani} alt="Biryani" />
        <img src={Veg} alt="Veg" />
        <img src={Tiffin} alt="Tiffin" />
      </div>
    </div>
  );
};

export default Login;
