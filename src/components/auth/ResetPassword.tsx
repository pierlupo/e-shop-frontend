import {EyeIcon, EyeSlashIcon, LockClosedIcon} from "@heroicons/react/24/outline/index";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {useSearchParams, useNavigate} from "react-router-dom";
import {toast} from "react-hot-toast";
import LayoutWrapper from "../../components/LayoutWrapper.tsx";
import apiClient from "../../utils/apiClient.ts";
import {USERS_API_URL} from "../../config/config";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { t } = useTranslation();
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!token) {
            toast.error(t('reset_pwd_toast1_error'));
            return;
        }
        try {
            await apiClient.put(`${USERS_API_URL}/reset-password?token=${token}`, newPassword, {
                headers: { "Content-Type": "text/plain" },
            });
            toast.success(t('reset_pwd_toast_success'));
            navigate("/login");
        } catch (err) {
            console.error(err)
            toast.error(t('reset_pwd_toast_error'));
        }
    };

    return (
        <LayoutWrapper className="dark:bg-gray-600">
            <form onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold mb-6 text-center dark:text-amber-50">{t('reset_pwd_title')}</h2>
                {error && (
                    <p className="mb-4 text-red-600 text-center font-semibold">{error}</p>
                )}
                <div className="flex flex-col items-center">
                    {/* Password */}
                    <div className="mb-6 w-80">
                        <label htmlFor="password" className="block mb-1 font-medium dark:text-amber-50">
                            {t('signup_pwd_label')}
                        </label>
                        <div className="relative">
                            <LockClosedIcon
                                className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            />
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                className="w-full pl-10 pr-10 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-amber-50 dark:placeholder-gray-400"
                                placeholder={t('signup_pwd_placeholder')}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(prev => !prev)}
                                aria-label="Toggle password visibility"
                                title="Show/Hide password"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-150"
                            >
                                {showPassword ? (<EyeSlashIcon className="w-5 h-5" />) : (<EyeIcon className="w-5 h-5" />)}
                            </button>
                        </div>
                    </div>
                    <div className="relative mb-4 w-80">
                        <LockClosedIcon className="w-5 h-5 absolute left-3 top-12 transform -translate-y-1/2 text-gray-400" />
                        <label className="block font-semibold mb-1 dark:text-amber-50">{t('signup_confirm_password')}</label>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full pl-10 pr-10 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-amber-50 dark:placeholder-gray-400"
                            placeholder={t('signup_confirm_pwd_placeholder')}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            className="absolute right-3 top-12 -translate-y-1/2 text-gray-400 transition-colors duration-150"
                        >
                            {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
                    <button
                        type="submit"
                        className="w-80 bg-blue-600 text-amber-50 py-2 rounded hover:bg-blue-700 transition mb-4 mx-auto block"
                    >
                        {t('reset_pwd_btn')}
                    </button>
            </form>
            </LayoutWrapper>
    );
}