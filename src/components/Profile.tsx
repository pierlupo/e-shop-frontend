import {isAxiosError} from "axios";
import React, {useState, useEffect} from "react";
import {toast} from "react-hot-toast";
import {useTranslation} from "react-i18next";
import type {Role} from "../interfaces/Role.ts";
import {getRoleColor, getRoleIcon} from "../utils/roleHelpers.tsx";
import Loader from "../components/Loader.tsx";
import {useAuth} from "../hooks/useAuth.ts";
import {userService} from "../services/userService.ts";
import type {User} from "../interfaces/User";
import {
    PencilSquareIcon,
    EnvelopeIcon,
    LockClosedIcon,
    UserIcon,
    UserCircleIcon,
    EyeIcon,
    EyeSlashIcon
} from '@heroicons/react/24/outline';
import ConfirmationDialog from "./ConfirmationDialog";
import LayoutWrapper from "./LayoutWrapper.tsx";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getFullAvatarUrl = (avatarUrl: string | null | undefined): string | null => {
    if (!avatarUrl) return null;
    if (avatarUrl.startsWith("http")) return avatarUrl;
    return `${BASE_URL}${avatarUrl}`;
};

const Profile: React.FC = () => {
    const {user, setUser, logout} = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<User | null>(user);
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState("");
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [dialogContext, setDialogContext] = useState<"save" | "password" | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(getFullAvatarUrl(formData?.avatarUrl));
    const [avatarError, setAvatarError] = useState(false);
    const [error, setError] = useState("");
    const {t} = useTranslation();

    useEffect(() => {
        if (formData?.avatarUrl) {
            setAvatarPreview(getFullAvatarUrl(formData.avatarUrl));
        }
    }, [formData?.avatarUrl]);

    useEffect(() => {
        setFormData(user);
        setAvatarPreview(getFullAvatarUrl(user?.avatarUrl));
    }, [user]);

    useEffect(() => {
        if (avatarFile) {
            const url = URL.createObjectURL(avatarFile);
            setAvatarPreview(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [avatarFile]);

    if (!user || !formData) return <Loader/>;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            if (!user || !user.id) return;
            let updatedAvatarUrl: string | null = formData.avatarUrl;
            if (avatarFile) {
                updatedAvatarUrl = await userService.uploadAvatar(user.id, avatarFile);
            }
            const emailChanged = user.email !== formData.email;
            const updatedUser: User = await userService.updateUser(user.id, {
                ...formData,
                avatarUrl: updatedAvatarUrl,
                emailVerified: emailChanged ? false : user.emailVerified
            });
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setFormData(updatedUser);
            setAvatarPreview(getFullAvatarUrl(updatedUser.avatarUrl));
            setAvatarFile(null);
            setUser(updatedUser);
            setMessage(t("profile_update_success_msg"));
            setIsEditing(false);
            if (emailChanged) {
                toast.success(t("profile_email_updated_logout_msg"));
                setTimeout(() => logout(), 2000);
            }
        } catch (error) {
            console.error(t("profile_update_error_msg"), error);
            setMessage(t("profile_update_error_msg"));
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirm = async () => {
        if (dialogContext === "save") {
            await handleSave();
        } else if (dialogContext === "password") {
            if (newPassword !== confirmPassword) {
                setPasswordMessage(t("profile_pwd_non_identical"));
                return;
            }
            if (!passwordRegex.test(newPassword)) {
                setError(t("profile_pwd_regex_msg"));
                return;
            }
            try {
                await userService.changePassword(user!.id, {
                    currentPassword,
                    newPassword,
                });
                toast.success(t('profile_change_pwd_success'));
                setMessage(t("profile_change_pwd_success"));
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } catch (error) {
                if (isAxiosError(error)) {
                    const backendMessageRaw = error.response?.data?.message;
                    // Map English backend message to localized translation
                    const backendMessage =
                        backendMessageRaw === 'Current password is incorrect' ? t('profile_change_pwd_error') : backendMessageRaw || t('profile_change_pwd_error');
                    const message = `${backendMessage}\n${t('login_err_msg')}`;
                    toast.error(message);
                    setPasswordMessage("Failed to update password.");
                }
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

    const UserRolesDisplay = ({roles}: { roles: Role[] }) => (
        <div className="flex items-center justify-center gap-2 ">
            {roles.map(role => (
                <span key={role.id}
                      className={`${getRoleColor(role.name)}`}>
                    {role.name.replace("ROLE_", "")}
                    {getRoleIcon(role.name)}
                </span>
            ))}
        </div>
    );

    const UserRegistrationInfo = ({registrationDate}: { registrationDate: string }) => {
        const formattedDate = new Date(registrationDate).toLocaleDateString();
        return <div className="dark:text-amber-50 mt-2">{t('profile_registration_date')}{formattedDate}</div>;
    };

    const handleSendVerificationEmail = async () => {
        try {
            if (!user?.id) {
                toast.error("User ID is missing, cannot send verification email.");
                return;
            }
            await userService.sendVerificationEmail(user.id);
            toast.success("Verification email sent!");
        } catch (err) {
            console.error(err);
            toast.error("Could not send verification email.");
        }
    };

    return (
        <LayoutWrapper className="dark:bg-gray-600">
            <div className="flex flex-col items-center">
                <h1 className="text-2xl font-bold mb-4 dark:text-amber-50">{t('profile_title')}</h1>
                {/* Messages */}
                {message && (
                    <p className="mt-4  text-green-600 text-center font-semibold">{message}</p>
                )}
                {error && (<p className="mb-4 text-red-600 text-center font-semibold">{error}</p>)}
                {passwordMessage && (<p className="mt-2 text-red-600 text-center font-semibold">{passwordMessage}</p>)}
                <div className="space-y-6 mt-4 flex flex-col items-center">
                    {/* Avatar + Name + Roles + Date */}
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-300 cursor-pointer"
                             onClick={() => setIsEditing(true)}
                             title={t('profile_click_to_change_avatar')}>
                            {avatarPreview ? (
                                <img
                                    src={avatarError ? "/default-avatar.png" : avatarPreview || "/default-avatar.png"}
                                    alt="User Avatar"
                                    className="object-cover w-full h-full"
                                    onError={() => setAvatarError(true)}
                                />
                            ) : (
                                <div
                                    className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-400">
                                    {t('profile_no_avatar')}
                                </div>
                            )}
                        </div>
                        {(isEditing) && (
                            <label
                                htmlFor="avatarUpload"
                                className="cursor-pointer px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                {t('profile_upload_avatar')}
                                <input
                                    id="avatarUpload"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        handleAvatarChange(e);
                                    }}
                                    className="hidden"
                                />
                            </label>
                        )}
                        <div className="text-center">
                            <h3 className="font-bold dark:text-amber-50 mb-1">{formData.firstname}</h3>
                            <UserRolesDisplay roles={formData.roles}/>
                            {user.registrationDate && (
                                <UserRegistrationInfo registrationDate={user.registrationDate}/>
                            )}
                        </div>
                    </div>
                    {/* Form Fields */}
                    <div className="flex flex-col space-y-4 items-center">
                        {/* Firstname */}
                        <div className="relative w-80">
                            <UserIcon
                                className="w-5 h-5 absolute left-3 top-11 transform -translate-y-1/2 text-gray-400"/>
                            <label
                                className="block font-semibold dark:text-amber-50">{t('profile_firstname_label')}</label>
                            <input
                                type="text"
                                name="firstname"
                                value={formData.firstname}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full pl-10 p-2 border rounded dark:bg-gray-700 dark:text-amber-50 dark:placeholder-gray-400"
                            />
                        </div>
                        {/* Lastname */}
                        <div className="relative w-80">
                            <UserCircleIcon
                                className="w-5 h-5 absolute left-3 top-11 transform -translate-y-1/2 text-gray-400"/>
                            <label
                                className="block font-semibold dark:text-amber-50">{t('profile_lastname_label')}</label>
                            <input
                                type="text"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full pl-10 p-2 border rounded dark:bg-gray-700 dark:text-amber-50 dark:placeholder-gray-400"
                            />
                        </div>
                        {/* Email */}
                        <div className="relative w-80">
                            <EnvelopeIcon
                                className="w-5 h-5 absolute left-3 top-11 transform -translate-y-1/2 text-gray-400"/>
                            <label className="block font-semibold dark:text-amber-50">{t('profile_email_label')}</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full pl-10 p-2 border rounded dark:bg-gray-700 dark:text-amber-50 dark:placeholder-gray-400"
                            />
                        </div>
                        {/* Email Verification Status */}
                        <p className="mt-1 text-start dark:text-amber-50 w-80">
                            <span
                                className="font-semibold dark:text-amber-50">{t('profile_email_verif_label')}</span>{" "}
                            {user.emailVerified ? (
                                <span className="text-green-600 font-semibold inline-flex items-center gap-1 ml-2">
                            <span className="text-base mr-2">✅</span> {t('profile_email_verif_yes')}
                            </span>
                            ) : (
                                <span className="text-red-600 font-semibold inline-flex items-center gap-1 ml-2">
                            <span className="text-base mr-2">❌</span> {t('profile_email_verif_no')}
                                    <button
                                        onClick={handleSendVerificationEmail}
                                        className="ml-2 px-2 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 transition"
                                    >
                                {t('profile_email_verif_btn')}
                            </button>
                            </span>
                            )}
                        </p>
                    </div>
                </div>
                {/* Buttons */}
                <div className="mt-6 flex space-x-4">
                    {isEditing ? (
                        <>
                            <button
                                onClick={() => {
                                    setDialogContext("save");
                                    setIsConfirmDialogOpen(true);
                                }}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                disabled={isLoading}
                            >
                                {isLoading ? "Saving..." : t('profile_save_changes_btn')}
                            </button>
                            <button
                                onClick={() => {
                                    setFormData(user); // reset changes
                                    setIsEditing(false);
                                    setMessage("");
                                }}
                                className="w-full px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                                disabled={isLoading}
                            >
                                {t('profile_cancel_btn')}
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => {
                                setIsEditing(true);
                                setPasswordMessage("");
                                setMessage("");
                                setError("");
                            }}
                            className="w-80 flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        >
                            <PencilSquareIcon className="w-5 h-5 text-white"/>
                            {t('profile_edit_btn')}
                        </button>
                    )}
                </div>
                <div className="mt-10 border-t pt-6">
                    <h2 className="text-2xl font-bold mb-4 dark:text-amber-50">{t('change_pwd_title')}</h2>
                    <div className="relative mb-4 w-80">
                        <label className="block font-semibold dark:text-amber-50">{t('profile_current_pwd')}</label>
                        <LockClosedIcon
                            className="w-5 h-5 absolute left-3 top-11 transform -translate-y-1/2 text-gray-400"/>
                        <input
                            type={showCurrentPassword ? "text" : "password"}
                            name="currentPassword"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full pl-10 pr-10 p-2 border rounded dark:bg-gray-700 dark:text-amber-50 dark:placeholder-gray-400"
                            placeholder={t('signup_pwd_placeholder')}
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrentPassword(prev => !prev)}
                            aria-label="Toggle password visibility"
                            title="Show/Hide password"
                            className="absolute right-3 top-11 transform -translate-y-1/2 text-gray-400"
                        >
                            {showCurrentPassword ? (<EyeSlashIcon className="w-5 h-5"/>) : (
                                <EyeIcon className="w-5 h-5"/>)}
                        </button>
                    </div>
                    <div className="relative mb-4 w-80">
                        <LockClosedIcon
                            className="w-5 h-5 absolute left-3 top-11 transform -translate-y-1/2 text-gray-400"/>
                        <label className="block font-semibold dark:text-amber-50">{t('profile_new_pwd')}</label>
                        <input
                            type={showNewPassword ? "text" : "password"}
                            name="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full pl-10 pr-10 p-2 border rounded dark:bg-gray-700 dark:text-amber-50 dark:placeholder-gray-400"
                            placeholder={t('profile_new_pwd')}
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword((prev) => !prev)}
                            aria-label="Toggle new password visibility"
                            title="Show/Hide password"
                            className="absolute right-3 top-11 transform -translate-y-1/2 text-gray-400"
                        >
                            {showNewPassword ? <EyeSlashIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>}
                        </button>
                    </div>
                    <div className="relative mb-4 w-80">
                        <label className="block font-semibold dark:text-amber-50">{t('profile_confirm_new_pwd')}</label>
                        <LockClosedIcon
                            className="w-5 h-5 absolute left-3 top-11 transform -translate-y-1/2 text-gray-400"/>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full pl-10 pr-10 p-2 border rounded dark:bg-gray-700 dark:text-amber-50 dark:placeholder-gray-400"
                            placeholder={t('signup_confirm_pwd_placeholder')}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(prev => !prev)}
                            aria-label="Toggle confirmed password visibility"
                            title="Show/Hide password"
                            className="absolute right-3 top-11 -translate-y-1/2 text-gray-400 transition-colors duration-150"
                        >
                            {showConfirmPassword ? (<EyeSlashIcon className="w-5 h-5"/>) : (
                                <EyeIcon className="w-5 h-5"/>)}
                        </button>
                    </div>
                </div>
                <button
                    onClick={() => {
                        setDialogContext("password");
                        setIsConfirmDialogOpen(true);
                    }}
                    className="w-80 flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 mt-6"
                    disabled={isLoading}
                >
                    <LockClosedIcon className="w-5 h-5 text-white"/>
                    {isLoading ? "Updating..." : t('profile_change_pwd_btn')}
                </button>
            </div>
            <ConfirmationDialog
                isOpen={isConfirmDialogOpen}
                title={dialogContext === "save" ? t("profile_dialog_title") : t("profile_confirm_dialog_pwd_title")}
                message={
                    dialogContext === "save"
                        ? t("profile_confirm_dialog_subject")
                        : t("profile_change_pwd_dialog")
                }
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </LayoutWrapper>
    );
};

export default Profile;