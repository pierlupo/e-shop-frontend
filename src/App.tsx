import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.tsx";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Home from "./pages/Home";
import { useAuth } from "./components/auth/AuthContext";

const App: React.FC = () => {
    const {isAuthenticated} = useAuth();

    return (
        <>
            <Navbar/>
            <Routes>
                <Route path="/" element={isAuthenticated ? <Home/> : <Navigate to="/login"/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/signup" element={<Signup/>}/>
            </Routes>
        </>
    );
}

export default App;