import React, { useState } from "react";
import { useAuth } from "../components/auth/AuthContext";
import { userService } from "../services/UserService";
import type { User } from "../interfaces/User";

const Profile: React.FC = () => {
    const { user, logout } = useAuth();
    const [formData, setFormData] = useState<User | null>(user);
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState("");

    if (!user || !formData) return <div>Loading...</div>;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const updatedUser = await userService.updateUser(formData.id, formData);
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setMessage("Profile updated successfully.");
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage("Failed to update profile.");
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">My Profile</h2>

            <div className="space-y-4">
                <div>
                    <label className="block font-semibold">First Name</label>
                    <input
                        type="text"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block font-semibold">Last Name</label>
                    <input
                        type="text"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block font-semibold">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full p-2 border rounded"
                    />
                </div>
            </div>

            {message && (
                <p className="mt-4 text-sm text-green-600">{message}</p>
            )}

            <div className="mt-6 flex space-x-4">
                {isEditing ? (
                    <>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Save Changes
                        </button>
                        <button
                            onClick={() => {
                                setFormData(user); // reset changes
                                setIsEditing(false);
                                setMessage("");
                            }}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                        Edit Profile
                    </button>
                )}

                <button
                    onClick={logout}
                    className="ml-auto px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Profile;