import React from "react";
import { useAuth } from "../components/auth/AuthContext.tsx";

const Profile: React.FC = () => {
    const { user, logout } = useAuth();

    if (!user) return <div>Loading...</div>;

    return (
        <div>
            <h2>Welcome, {user.firstname}</h2>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

export default Profile;