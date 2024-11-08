
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Profile.css'; 

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserData(user);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const updatedUser = { ...userData };
      await axios.put(`http://localhost:8080/users/update/${userData.id}`, updatedUser);
      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false); 
  };

  const handleDeleteClick = async () => {
    try {
      await axios.delete(`http://localhost:8080/users/delete/${userData.id}`);
      alert("Account deleted successfully!");
      localStorage.removeItem("user");
      navigate("/signup"); 
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

 
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <div className="profile-field">
        <label>First Name:</label>
        {isEditing ? (
          <input
            type="text"
            name="firstName"
            value={userData.firstName}
            onChange={handleChange}
          />
        ) : (
          <span>{userData.firstName}</span>
        )}
      </div>
      <div className="profile-field">
        <label>Last Name:</label>
        {isEditing ? (
          <input
            type="text"
            name="lastName"
            value={userData.lastName}
            onChange={handleChange}
          />
        ) : (
          <span>{userData.lastName}</span>
        )}
      </div>
      <div className="profile-field">
        <label>Email:</label>
        {isEditing ? (
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
          />
        ) : (
          <span>{userData.email}</span>
        )}
      </div>
      <div className="profile-field">
        <label>Password:</label>
        {isEditing ? (
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"} 
              name="password"
              value={userData.password}
              onChange={handleChange}
            />
            <button type="button" onClick={togglePasswordVisibility}>
              {showPassword ? "Hide" : "Show"} Password
            </button>
          </div>
        ) : (
          <span>**********</span> 
        )}
      </div>
      <div className="profile-buttons">
        {isEditing ? (
          <>
            <button onClick={handleSaveClick}>Save</button>
            <button onClick={handleCancelClick}>Cancel</button>
          </>
        ) : (
          <button onClick={handleEditClick}>Edit</button>
        )}
        <button onClick={handleDeleteClick}>Delete Account</button>
      </div>
    </div>
  );
};

export default Profile;
