import {EyeIcon, EyeSlashIcon} from "@heroicons/react/24/outline/index";
import { isAxiosError} from "axios";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {login as loginService} from "../../services/authService.ts";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../../hooks/useAuth.ts";
import {EnvelopeIcon, LockClosedIcon} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import LayoutWrapper from "../LayoutWrapper";


const Login: React.FC = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const {login} = useAuth();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(""); // still clears state in case it's used elsewhere
        try {
            const response = await loginService({email, password});
            const user = response.data.user;
            const token = response.data.token;
            login(token, user);
            toast.success(`${t('login_succeeded')}\n${t('welcome_msg', { name: user.firstname })}`);
            navigate("/home");
        } catch (error) {
            if (isAxiosError(error)) {
                const backendMessageRaw = error.response?.data?.message;
                // Map English backend message to localized translation
                const backendMessage =
                    backendMessageRaw === 'Bad credentials' ? t('default_error_msg') : backendMessageRaw || t('default_error_msg');
                const message = `${backendMessage}\n${t('login_err_msg')}`;
                toast.error(message);
                setError(message);
            } else {
                const message = `${t('default_error_msg')}\n${t('login_err_msg')}`;
                toast.error(message);
                setError(message);
            }
        }
    }

    return (
        <LayoutWrapper className="dark:bg-gray-600">
        <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold mb-6 text-center dark:text-amber-50">{t('login_title')}</h2>
            {error && (
                <p className="mb-4 text-red-600 text-center font-semibold">{error}</p>
            )}
            <div className="flex flex-col items-center">
            {/* Email */}
            <div className="mb-4 w-80">
                <label htmlFor="email" className="block mb-1 font-medium dark:text-amber-50">
                    {t('login_email_label')}
                </label>
                <div className="relative">
                    <EnvelopeIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                    <input
                        id="email"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-amber-50 dark:placeholder-gray-400"
                        placeholder={t('login_email_placeholder')}
                    />
                </div>
            </div>
            {/* Password */}
            <div className="mb-6 w-80">
                <label className="block mb-1 font-medium dark:text-amber-50" htmlFor="password">
                    {t('login_pwd_label')}
                </label>
                <div className="relative">
                    <LockClosedIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-amber-50 dark:placeholder-gray-400"
                        placeholder={t('login_pwd_placeholder')}
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
            <button
                type="submit"
                className="w-80 bg-blue-600 text-amber-50 py-2 rounded hover:bg-blue-700 transition mb-4 mx-auto block"
            >
                {t('login_btn')}
            </button>
            <p className="text-sm text-center dark:text-amber-50">
                {t('signup_msg')}{" "}
                <Link to="/signup" className="text-blue-500 hover:underline ml-1">
                    {t('signup_link')}
                </Link>
            </p>
                <Link to="/forgot-password" className="text-sm text-blue-500 hover:underline">
                    {t('forgotten_pwd')}
                </Link>
            </div>
        </form>
            </LayoutWrapper>
    );
};

export default Login;