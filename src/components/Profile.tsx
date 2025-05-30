import React, {useState, useEffect} from "react";
import {useTranslation} from "react-i18next";
import Loader from "../components/Loader.tsx";
import {useAuth} from "../hooks/UseAuth.ts";
import {userService} from "../services/userService.ts";
import type {User} from "../interfaces/User";
import {PencilSquareIcon, LockClosedIcon} from '@heroicons/react/24/outline';
import ConfirmationDialog from "./ConfirmationDialog";
import LayoutWrapper from "./LayoutWrapper.tsx";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getFullAvatarUrl = (avatarUrl: string | null | undefined): string | null => {
    if (!avatarUrl) return null;
    if (avatarUrl.startsWith("http")) return avatarUrl;
    return `${BASE_URL}${avatarUrl}`;
};

const Profile: React.FC = () => {
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState<User | null>(user);
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [dialogContext, setDialogContext] = useState<"save" | "password" | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(getFullAvatarUrl(formData?.avatarUrl));
    const [avatarError, setAvatarError] = useState(false);
    const {t} = useTranslation();

    useEffect(() => {
        if (formData?.avatarUrl) {
            setAvatarPreview(getFullAvatarUrl(formData.avatarUrl));
        }
    }, [formData?.avatarUrl]);

    if (!user || !formData) return <Loader />;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            if (!user || !user.id) return;
            let updatedAvatarUrl:string|null = formData.avatarUrl;
            if (avatarFile) {
                updatedAvatarUrl = await userService.uploadAvatar(user.id, avatarFile);
            }
            const updatedUser:User = await userService.updateUser(user.id, {
                ...formData,
                avatarUrl: updatedAvatarUrl,
            });
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setFormData(updatedUser);
            setAvatarPreview(getFullAvatarUrl(updatedUser.avatarUrl));
            setAvatarFile(null);
            setUser(updatedUser);
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

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    return (
        <LayoutWrapper className="dark:bg-gray-600">
            <div className="flex flex-col items-center ">
            <h2 className="text-2xl font-bold mb-4 dark:text-amber-50">{t('profile_title')}</h2>
            <div className="space-y-4">
                <div className="mb-6 flex items-center space-x-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-300">
                        {avatarPreview ? (
                            <img src={avatarError ? "/default-avatar.png" : avatarPreview || "/default-avatar.png"}
                                 alt="User Avatar"
                                 className="object-cover w-full h-full"
                                 onError={() => setAvatarError(true)} />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-400">
                                {t('profile_no_avatar')}
                            </div>
                        )}
                    </div>
                    {isEditing && (
                        <label
                            htmlFor="avatarUpload"
                            className="cursor-pointer px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            {t('profile_upload_avatar')}
                            <input
                                id="avatarUpload"
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                        </label>
                    )}
                </div>
                <div>
                    <label className="block font-semibold dark:text-amber-50">{t('profile_firstname_label')}</label>
                    <input
                        type="text"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-80 p-2 border rounded dark:bg-gray-700 dark:text-amber-50 dark:placeholder-gray-400"
                    />
                </div>

                <div>
                    <label className="block font-semibold dark:text-amber-50">{t('profile_lastname_label')}</label>
                    <input
                        type="text"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-80 p-2 border rounded dark:bg-gray-700 dark:text-amber-50 dark:placeholder-gray-400"
                    />
                </div>

                <div>
                    <label className="block font-semibold dark:text-amber-50">{t('profile_email_label')}</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-80 p-2 border rounded dark:bg-gray-700 dark:text-amber-50 dark:placeholder-gray-400"
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
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            {t('profile_save_changes_btn')}
                        </button>
                        <button
                            onClick={() => {
                                setFormData(user); // reset changes
                                setIsEditing(false);
                                setMessage("");
                            }}
                            className="w-full px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                        >
                            {t('profile_cancel_btn')}
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="w-80 flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                        <PencilSquareIcon className="w-5 h-5 text-white" />
                        {t('profile_edit_btn')}
                    </button>
                )}
            </div>
            <div className="mt-10 border-t pt-6">
                <h2 className="text-2xl font-bold mb-4 dark:text-amber-50">{t('change_pwd_title')}</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block font-semibold dark:text-amber-50">{t('profile_current_pwd')}</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-80 p-2 border rounded dark:bg-gray-700 dark:text-amber-50 dark:placeholder-gray-400"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold dark:text-amber-50">{t('profile_new_pwd')}</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-80 p-2 border rounded dark:bg-gray-700 dark:text-amber-50 dark:placeholder-gray-400"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold dark:text-amber-50">{t('profile_confirm_new_pwd')}</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-80 p-2 border rounded dark:bg-gray-700 dark:text-amber-50 dark:placeholder-gray-400"
                        />
                    </div>
                </div>
                <button
                    onClick={() => {
                        setDialogContext("password");
                        setIsConfirmDialogOpen(true);
                    }}
                    className="w-80 flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-blue-600 mt-6"
                >
                    <LockClosedIcon className="w-5 h-5 text-white"/>
                    {t('profile_change_pwd_btn')}
                </button>
                {passwordMessage && (
                    <p className="mt-2 text-sm text-blue-600">{passwordMessage}</p>
                )}
            </div>
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
            </LayoutWrapper>
    );
};

export default Profile;