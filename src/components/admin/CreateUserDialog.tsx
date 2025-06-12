import {
    UserIcon,
    UserCircleIcon,
    EnvelopeIcon,
    //LockClosedIcon
} from "@heroicons/react/24/outline";
//import {EyeIcon, EyeSlashIcon} from "@heroicons/react/24/outline/index";
import React, {useState} from "react";
import ModalPortal from "../../components/ModalPortal";
import useEscapeClose from "../../hooks/useEscapeClose";
import {useTranslation} from "react-i18next";

interface UserCreateRequest {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    roles: string[];
}

interface CreateUserDialogProps {
    onClose: () => void;
    onSubmit: (data: UserCreateRequest) => void;
}

export default function CreateUserDialog({ onClose, onSubmit }: CreateUserDialogProps) {
    // const [password, setPassword] = useState("");
    // const [confirmPassword, setConfirmPassword] = useState("");
    // const [showPassword, setShowPassword] = useState(false);
    // const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const {t} = useTranslation();
    const [formData, setFormData] = useState<UserCreateRequest>({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        roles: ["ROLE_USER"]
    });

    // const [availableRoles] = useState(["ROLE_USER", "ROLE_ADMIN"]);
    useEscapeClose(onClose);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    // const toggleRole = (role: string) => {
    //     setFormData((prev) => ({
    //         ...prev,
    //         roles: prev.roles.includes(role)
    //             ? prev.roles.filter((r) => r !== role)
    //             : [...prev.roles, role]
    //     }));
    // };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <ModalPortal>
            <div
                className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
                onClick={onClose}
            >
                <form
                    onSubmit={handleSubmit}
                    className="bg-gray-100 dark:bg-gray-700 p-6 rounded shadow-md w-96"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h2 className="text-2xl font-bold mb-6 text-center dark:text-amber-50">
                        {t("admin_create_user_title") ?? "Create New User"}
                    </h2>

                    {/* Firstname */}
                    <div className="mb-4 w-80">
                        <label className="block mb-1 font-medium dark:text-amber-50">
                            {t("signup_firstname_label")}
                        </label>
                        <div className="relative">
                            <UserIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                            <input
                                name="firstname"
                                value={formData.firstname}
                                onChange={handleChange}
                                required
                                className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-amber-50"
                                placeholder={t("signup_firstname_placeholder")}
                            />
                        </div>
                    </div>
                    {/* Lastname */}
                    <div className="mb-4 w-80">
                        <label className="block mb-1 font-medium dark:text-amber-50">
                            {t("signup_lastname_label")}
                        </label>
                        <div className="relative">
                            <UserCircleIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                            <input
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                required
                                className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-amber-50"
                                placeholder={t("signup_lastname_placeholder")}
                            />
                        </div>
                    </div>
                    {/* Email */}
                    <div className="mb-4 w-80">
                        <label className="block mb-1 font-medium dark:text-amber-50">
                            {t("signup_email_label")}
                        </label>
                        <div className="relative">
                            <EnvelopeIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-amber-50"
                                placeholder={t("signup_email_placeholder")}
                            />
                        </div>
                    </div>
                    {/*/!* Password *!/*/}
                    {/*<div className="mb-4 w-80">*/}
                    {/*    <label htmlFor="password" className="block mb-1 font-medium dark:text-amber-50">*/}
                    {/*        {t('signup_pwd_label')}*/}
                    {/*    </label>*/}
                    {/*    <div className="relative">*/}
                    {/*        <LockClosedIcon*/}
                    {/*            className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"*/}
                    {/*        />*/}
                    {/*        <input*/}
                    {/*            id="password"*/}
                    {/*            type={showPassword ? "text" : "password"}*/}
                    {/*            value={password}*/}
                    {/*            onChange={(e) => setPassword(e.target.value)}*/}
                    {/*            required*/}
                    {/*            className="w-full pl-10 pr-10 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-amber-50 dark:placeholder-gray-400"*/}
                    {/*            placeholder={t('signup_pwd_placeholder')}*/}
                    {/*        />*/}
                    {/*        <button*/}
                    {/*            type="button"*/}
                    {/*            onClick={() => setShowPassword(prev => !prev)}*/}
                    {/*            aria-label="Toggle password visibility"*/}
                    {/*            title="Show/Hide password"*/}
                    {/*            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-150"*/}
                    {/*        >*/}
                    {/*            {showPassword ? (<EyeSlashIcon className="w-5 h-5" />) : (<EyeIcon className="w-5 h-5" />)}*/}
                    {/*        </button>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    {/*<div className="relative mb-4 w-80">*/}
                    {/*    <LockClosedIcon className="w-5 h-5 absolute left-3 top-11 transform -translate-y-1/2 text-gray-400" />*/}
                    {/*    <label className="block font-semibold mb-1 dark:text-amber-50">{t('signup_confirm_password')}</label>*/}
                    {/*    <input*/}
                    {/*        type={showConfirmPassword ? "text" : "password"}*/}
                    {/*        name="confirmPassword"*/}
                    {/*        value={confirmPassword}*/}
                    {/*        onChange={(e) => setConfirmPassword(e.target.value)}*/}
                    {/*        className="w-full pl-10 pr-10 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-amber-50 dark:placeholder-gray-400"*/}
                    {/*        placeholder={t('signup_confirm_pwd_placeholder')}*/}
                    {/*    />*/}
                    {/*    <button*/}
                    {/*        type="button"*/}
                    {/*        onClick={() => setShowConfirmPassword((prev) => !prev)}*/}
                    {/*        className="absolute right-3 top-11 -translate-y-1/2 text-gray-400 transition-colors duration-150"*/}
                    {/*    >*/}
                    {/*        {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}*/}
                    {/*    </button>*/}
                    {/*</div>*/}
                    {/*/!* Roles *!/*/}
                    {/*<div className="mb-4">*/}
                    {/*    <label className="block mb-1 font-medium dark:text-amber-50">*/}
                    {/*        Roles*/}
                    {/*    </label>*/}
                    {/*    {availableRoles.map((role) => (*/}
                    {/*        <label key={role} className="flex items-center space-x-2 text-sm dark:text-amber-50">*/}
                    {/*            <input*/}
                    {/*                type="checkbox"*/}
                    {/*                checked={formData.roles.includes(role)}*/}
                    {/*                onChange={() => toggleRole(role)}*/}
                    {/*            />*/}
                    {/*            <span>{role.replace("ROLE_", "")}</span>*/}
                    {/*        </label>*/}
                    {/*    ))}*/}
                    {/*</div>*/}
                    {/* Buttons */}
                    <div className="mt-4 flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded font-medium border border-gray-300
                                        bg-gray-100 text-gray-800 hover:bg-gray-200
                                        focus:ring-2 focus:ring-gray-400
                                        dark:bg-gray-600 dark:text-amber-50 dark:hover:bg-gray-700"
                        >
                            {t("cancel_btn")}
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-amber-50 rounded hover:bg-blue-700"
                        >
                            {t("admin_create_user_btn") ?? "Create User"}
                        </button>
                    </div>
                </form>
            </div>
        </ModalPortal>
    );
}