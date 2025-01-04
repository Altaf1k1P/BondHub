import React from 'react';
import { useDispatch } from 'react-redux';
import { logoutUser } from "../../store/userSlice";
import { useNavigate } from 'react-router-dom';

function Logout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
      dispatch(logoutUser());
      localStorage.removeItem("accessToken"); // Remove token from localStorage
      navigate("/login"); // Redirect to login page
    };
  
    return (
      <button className="btn btn-danger" onClick={handleLogout}>
        Logout
      </button>
    );
}

export default Logout;
