import React, { useState, useRef } from "react";
import styled from "styled-components";
import logo from "../assets/Stick.png";
import song from "../assets/daina3.mp3";

const HomeContainer = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100vh;
  width: 100%;
  background-color: #121212;
  color: white;
  padding: 20px;

  img {
    width: 80%;
    max-width: 750px;
    margin-bottom: 2rem;
  }

  h2 {
    font-size: 3rem;
    margin-bottom: 1rem;
    font-weight: bold;
  }

  p {
    font-size: 1.5rem;
    color: #ccc;
    margin-bottom: 1rem;
  }
`;

const PromptOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  font-size: 2rem;
  font-weight: bold;
  cursor: pointer;
  z-index: 10;
`;

const StyledLink = styled.a`
  display: inline-block;
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffcc00;
  background: rgba(255, 255, 255, 0.1);
  padding: 10px 20px;
  border-radius: 10px;
  text-decoration: none;
  transition: 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

export default function Home() {
    const [showPrompt, setShowPrompt] = useState(true);
    const audioRef = useRef(null);

    const handleStart = () => {
        setShowPrompt(false); // Hide the prompt

        if (audioRef.current) {
            audioRef.current.play().then(() => {
                console.log("Audio is playing! 🎶");
            }).catch((err) => {
                console.error("Playback failed, retrying...", err);
            });
        }
    };

    return (
        <>
            {showPrompt && (
                <PromptOverlay onClick={handleStart}>
                    🎉 Nu kon pradedam gimtadeini! 🎶
                </PromptOverlay>
            )}

            {!showPrompt && (
                <HomeContainer>
                    <img src={logo} alt="ChadHub Logo" />
                    <h2>Jokubinskai, su gimtadeiniu!</h2>
                    <audio ref={audioRef} onCanPlayThrough={() => audioRef.current.play()}>
                        <source src={song} type="audio/mp3" />
                    </audio>
                    <p>Daug laimės norim palinkėti</p>
                    <p>Gyvenimui patikti kad mokėtum.</p>
                    <p>Neužmirštuolės žiedu kad širdis žydėtų,</p>
                    <p>Kad visada geri draugai šalia sėdėtų.</p>
                    <h3>
                        <StyledLink href="https://insanefits.com">
                            🎁 50 -- DOVANA -- 50 🎁
                        </StyledLink>
                    </h3>
                </HomeContainer>
            )}
        </>
    );
}
