import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import logo from "../assets/ChadHub.png"; // Update the path as needed

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 3rem;
  background-color: #1f1f1f;
  color: white;
  width: 100%;

  .logo {
    display: flex;
    align-items: center;
    gap: 1rem;

    img {
      width: 50px; /* Adjust logo size */
    }

    h1 {
      font-size: 1.8rem;
      font-weight: bold;
    }
  }

  nav {
    display: flex;
    gap: 1.5rem;

    a {
      font-size: 1.2rem;
      color: #f4f4f4;
      transition: color 0.3s;

      &:hover {
        color: #888;
      }
    }
  }
`;

export default function Header() {
    return (
        <HeaderContainer>
            <div className="logo">
                <img src={logo} alt="ChadHub Logo" />
                <h1>ChadHub</h1>
            </div>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/topics">Topics</Link>
                <Link to="/profile">Profile</Link>
            </nav>
        </HeaderContainer>
    );
}