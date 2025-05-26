import React, { useState } from "react";
import Loader from "../components/Loader.tsx";
import { useAuth } from "../components/auth/AuthContext";
import { userService } from "../services/UserService";
import type { User } from "../interfaces/User";
import { PencilSquareIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import ConfirmationDialog from "./ConfirmationDialog";

const Profile: React.FC = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState<User | null>(user);
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [dialogContext, setDialogContext] = useState<"save" | "password" | null>(null);

    if (!user || !formData) return <Loader />;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            if (!user || !user.id) {
                console.error("User ID is undefined");
                console.log("Logging in user:", user);
                return;
            }
            const updatedUser = await userService.updateUser(formData.id, formData);
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setMessage("Profile updated successfully.");
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage("Failed to update profile.");
        }
    };

    const handleConfirm = async () => {
        if (dialogContext === "save") {
            await handleSave();
        } else if (dialogContext === "password") {
            if (newPassword !== confirmPassword) {
                setPasswordMessage("Passwords do not match.");
                return;
            }

            try {
                await userService.changePassword(user!.id, {
                    currentPassword,
                    newPassword,
                });
                setPasswordMessage("Password updated successfully.");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } catch (err) {
                console.error(err);
                setPasswordMessage("Failed to update password.");
            }
        }
        setIsConfirmDialogOpen(false);
        setDialogContext(null);
    };

    const handleCancel = () => {
        setIsConfirmDialogOpen(false);
        setDialogContext(null);
    };


    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">My Profile</h2>

            <div className="space-y-4">
                <div>
                    <label className="block font-semibold">Firstname</label>
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
                    <label className="block font-semibold">Lastname</label>
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
                            onClick={() => {
                                setDialogContext("save");
                                setIsConfirmDialogOpen(true);
                            }}
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
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                        <PencilSquareIcon className="w-5 h-5 text-white" />
                        Edit Profile
                    </button>
                )}
            </div>
            <div className="mt-10 border-t pt-6">
                <h2 className="text-2xl font-bold mb-4">Change Password</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block font-semibold">Current Password</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div>
                        <label className="block font-semibold">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div>
                        <label className="block font-semibold">Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>

                <button
                    onClick={() => {
                        setDialogContext("password");
                        setIsConfirmDialogOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-blue-600 mt-6"
                >
                    <LockClosedIcon className="w-5 h-5 text-white"/>
                    Change Password
                </button>

                {passwordMessage && (
                    <p className="mt-2 text-sm text-blue-600">{passwordMessage}</p>
                )}
            </div>
            <ConfirmationDialog
                isOpen={isConfirmDialogOpen}
                title={dialogContext === "save" ? "Confirm and save change(s) ?" : "Confirm and save your new password ?"}
                message={
                    dialogContext === "save"
                        ? "Are you sure you want to save the change(s) to your profile ?"
                        : "Are you sure you want to change your password ?"
                }
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </div>
    );
};

export default Profile;