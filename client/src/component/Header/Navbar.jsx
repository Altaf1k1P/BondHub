import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Logout from "./Logout"; // Logout component
import Search from "./search.jsx";

function Navbar() {
    const { isAuthenticated, user } = useSelector((state) => state.users);

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container-fluid">
                <Link className="navbar-brand fw-bold" to="/">
                    <i className="bi bi-people-fill"></i> BondHub
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        {isAuthenticated ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link text-light" to="/">
                                        Home
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-light" to={`/friends/${user?.userId}`}>
                                        Friends
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-light" to="/notifications">
                                        <i className="bi bi-bell"></i>
                                    </Link>
                                </li>
                                <li className="nav-item nav-item-custom d-flex align-items-center">
                                    <Search />
                                </li>
                                <li className="nav-item">
                                    <Logout />
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link text-light" to="/signin">
                                        Sign In
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-light" to="/login">
                                        Login
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
