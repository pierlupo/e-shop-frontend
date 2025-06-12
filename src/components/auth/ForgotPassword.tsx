import {EnvelopeIcon} from "@heroicons/react/24/outline/index";
import React, {useState} from "react";
import {toast} from "react-hot-toast";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";
import LayoutWrapper from "../../components/LayoutWrapper.tsx";
import apiClient from "../../utils/apiClient.ts";
import {USERS_API_URL} from "../../config/config";

export default function ForgotPassword() {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            await apiClient.post(`${USERS_API_URL}/forgot-password?email=${email}`);
            toast.success(t('forgotten_pwd_email_sent_success_toast'));
        } catch (err) {
            console.error(err)
            toast.error(t('forgotten_pwd_email_sent_error_toast'));
        }
    };

    return (
        <LayoutWrapper className="dark:bg-gray-600">
        <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold mb-6 text-center dark:text-amber-50">{t('forgotten_pwd_title')}</h2>
            {error && (
                <p className="mb-4 text-red-600 text-center font-semibold">{error}</p>
            )}
        <div className="flex flex-col items-center">
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
                <button
                    type="submit"
                    className="w-80 bg-blue-600 text-amber-50 py-2 rounded hover:bg-blue-700 transition mb-4 mx-auto block"
                >
                    {t('forgotten_pwd_send_link_btn')}
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
}