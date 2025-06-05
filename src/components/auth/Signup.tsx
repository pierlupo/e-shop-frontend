import type {AxiosError} from "axios";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {signup as signupService} from "../../services/authService.ts";
import {Link, useNavigate} from "react-router-dom";
import {
    EnvelopeIcon,
    LockClosedIcon,
    UserIcon,
    UserCircleIcon,
    EyeIcon,
    EyeSlashIcon
} from '@heroicons/react/24/outline';
import {toast} from 'react-hot-toast';
import LayoutWrapper from "../LayoutWrapper";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

const Signup: React.FC = () => {
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    const {t} = useTranslation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (!passwordRegex.test(password)) {
            setError("Password must be at least 8 characters long and include an uppercase letter, a number, and a special character.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        try {
            await signupService({firstname, lastname, email, password});
            toast.success("Signup successful! Please verify your email.");
            navigate("/login");
            setSuccess(""); // not needed anymore unless redirection wanted
        } catch (error) {
            const err = error as AxiosError<{ message?: string }>;
            const message: string = err.response?.data?.message || "Signup failed";
            toast.error(message);
            setError(message); // optional
        }
    };

    return (
        <LayoutWrapper className="dark:bg-gray-600">
            <form onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold mb-6 text-center dark:text-amber-50">{t('signup_title')}</h2>
                {error && (
                    <p className="mb-4 text-red-600 text-center font-semibold">{error}</p>
                )}
                {success && (
                    <p className="mb-4 text-green-600 text-center font-semibold">{success}</p>
                )}
                <div className="flex flex-col items-center">
                    {/* Firstname */}
                    <div className="mb-4 w-80">
                        <label htmlFor="firstname" className="block mb-1 font-medium dark:text-amber-50">
                            {t('signup_firstname_label')}
                        </label>
                        <div className="relative">
                            <UserIcon
                                className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                            <input
                                id="firstname"
                                type="text"
                                value={firstname}
                                onChange={(e) => setFirstname(e.target.value)}
                                required
                                className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-amber-50 dark:placeholder-gray-400"
                                placeholder={t('signup_firstname_placeholder')}
                            />
                        </div>
                    </div>
                    {/* Lastname */}
                    <div className="mb-4 w-80">
                        <label htmlFor="lastname" className="block mb-1 font-medium dark:text-amber-50">
                            {t('signup_lastname_label')}
                        </label>
                        <div className="relative">
                            <UserCircleIcon
                                className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                            <input
                                id="lastname"
                                type="text"
                                value={lastname}
                                onChange={(e) => setLastname(e.target.value)}
                                required
                                className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-amber-50 dark:placeholder-gray-400"
                                placeholder={t('signup_lastname_placeholder')}
                            />
                        </div>
                    </div>
                    {/* Email */}
                    <div className="mb-4 w-80">
                        <label htmlFor="email" className="block mb-1 font-medium dark:text-amber-50">
                            {t('signup_email_label')}
                        </label>
                        <div className="relative">
                            <EnvelopeIcon
                                className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-amber-50 dark:placeholder-gray-400"
                                placeholder={t('signup_email_placeholder')}
                            />
                        </div>
                    </div>
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                        <LockClosedIcon className="w-5 h-5 absolute left-3 top-11 transform -translate-y-1/2 text-gray-400" />
                        <label className="block font-semibold dark:text-amber-50">{t('signup_confirm_password')}</label>
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
                            className="absolute right-3 top-11 -translate-y-1/2 text-gray-400 transition-colors duration-150"
                        >
                            {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="w-80 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition mb-4">
                        {t('signup_btn')}
                    </button>
                    <p className="text-sm text-center dark:text-amber-50">
                        {t('login_msg')}{" "}
                        <Link to="/login" className="text-blue-500 hover:underline ml-1">
                            {t('login_link')}
                        </Link>
                    </p>
                </div>
            </form>
        </LayoutWrapper>
    );
};

export default Signup;