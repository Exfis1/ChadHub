import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/chadhub.png";

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is logged in by looking for the token in localStorage
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []); // Runs on mount to set the login state initially

    const handleLogout = () => {
        // Clear the token from localStorage
        localStorage.removeItem("token");
        setIsLoggedIn(false); // Update the state to reflect logout
        navigate("/"); // Redirect to the home page
    };

    const styles = {
        header: {
            width: "100%", // Make header span the full width of the page
            position: "fixed", // Fix the topbar to the top of the page
            top: 0,
            left: 0,
            zIndex: 1000, // Ensure it appears above all other content
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem 2rem",
            backgroundColor: "#1f1f1f",
            color: "white",
        },
        logo: {
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            color: "white",
            fontSize: "1.5rem",
            fontWeight: "bold",
        },
        logoImage: {
            height: "40px",
            marginRight: "0.5rem",
        },
        nav: {
            display: "flex",
            gap: "1rem",
        },
        navLink: {
            textDecoration: "none",
            color: "#00aced",
            fontSize: "1.2rem",
        },
        navButton: {
            background: "none",
            border: "none",
            color: "#00aced",
            fontSize: "1.2rem",
            cursor: "pointer",
            padding: 0,
        },
        spacer: {
            height: "70px", // Adjust the height to match the header's height
        },
    };

    return (
        <>
            {/* Spacer to push content below fixed header */}
            <div style={styles.spacer}></div>
            <header style={styles.header}>
                <Link to="/" style={styles.logo}>
                    <img src={logo} alt="ChadHub Logo" style={styles.logoImage} />
                    ChadHub
                </Link>
                <nav style={styles.nav}>
                    <Link to="/" style={styles.navLink}>
                        Home
                    </Link>
                    <Link to="/topics" style={styles.navLink}>
                        Topics
                    </Link>
                    {isLoggedIn ? (
                        <>
                            <Link to="/profile" style={styles.navLink}>
                                Profile
                            </Link>
                            <button onClick={handleLogout} style={styles.navButton}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={styles.navLink}>
                                Login
                            </Link>
                            <Link to="/register" style={styles.navLink}>
                                Register
                            </Link>
                        </>
                    )}
                </nav>
            </header>
        </>
    );
};

export default Header;