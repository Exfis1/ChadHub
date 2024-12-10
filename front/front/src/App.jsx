import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GlobalStyles } from "./styles/GlobalStyles";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Topics from "./pages/Topics"; // Import Topics Component
import Profile from "./pages/Profile"; // Optional: Import Profile Page if created
import Login from "./pages/Login";
import Register from "./pages/Register";


function App() {
    return (
        <>
            <GlobalStyles />
            <Router>
                <Header />
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/topics" element={<Topics />} /> {/* Use Topics Component */}
                        <Route path="/profile" element={<Profile />} /> {/* Use Profile Component */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Routes>
                </main>
                <Footer />
            </Router>
        </>
    );
}

export default App;