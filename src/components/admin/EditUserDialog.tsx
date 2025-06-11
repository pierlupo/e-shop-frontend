import {UserCircleIcon, UserIcon} from "@heroicons/react/24/outline/index";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import ConfirmationDialog from "../../components/ConfirmationDialog.tsx";
import ModalPortal from "../../components/ModalPortal.tsx";
import useEscapeClose from "../../hooks/useEscapeClose.ts";
import type {User} from "../../interfaces/User.ts";

interface EditUserDialogProps {
    user: User;
    onClose: () => void;
    onSubmit: (updatedUser: Partial<User>, updatedRoles: string[] | null) => void;
}

export default function EditUserDialog({ user, onClose, onSubmit }: EditUserDialogProps) {
    const [formData, setFormData] = useState<Partial<User>>(() => user);
    const {t} = useTranslation();
    const [showConfirm, setShowConfirm] = useState(false);
    const [availableRoles] = useState(["ROLE_USER", "ROLE_ADMIN"]);
    const [selectedRoles, setSelectedRoles] = useState<string[]>(() =>
        user.roles.map((r) => r.name)
    );

    useEscapeClose(onClose);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowConfirm(true);
    };

    useEffect(() => {
        setFormData(user);
    }, [user, user.id]);

    const toggleRole = (role: string) => {
        setSelectedRoles((prev) =>
            prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
        );
    };

    return (
        <ModalPortal>
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center dark:bg-gray-600 z-50"
            onClick={onClose}
        >
            <form  onSubmit={handleSubmit}
                   className="bg-gray-100 dark:bg-gray-700 p-6 rounded shadow-md w-96"
                   onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-6 text-center dark:text-amber-50">{t("edit_user_title")}</h2>
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
                            name="firstname"
                            type="text"
                            value={formData.firstname ?? ""}
                            onChange={handleChange}
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
                        <UserCircleIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                        <input
                            id="lastname"
                            name="lastname"
                            type="text"
                            value={formData.lastname ?? ""}
                            onChange={handleChange}
                            required
                            className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-amber-50 dark:placeholder-gray-400"
                            placeholder={t('signup_lastname_placeholder')}
                        />
                    </div>
                </div>
                {/* Roles */}
                <div className="mb-4">
                    <label className="block mb-1 font-medium dark:text-amber-50">
                        Roles
                    </label>
                    {availableRoles.map((role) => (
                        <label key={role} className="flex items-center space-x-2 text-sm dark:text-amber-50">
                            <input
                                type="checkbox"
                                checked={selectedRoles.includes(role)}
                                onChange={() => toggleRole(role)}
                            />
                            <span>{role.replace("ROLE_", "")}</span>
                        </label>
                    ))}
                </div>
                {/* Add more fields as needed */}
                <div className="mt-4 flex justify-end space-x-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded font-medium border border-gray-300
                                                bg-gray-100 text-gray-800 hover:bg-gray-200
                                                focus:ring-2 focus:ring-gray-400
                                                dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700"
                    >
                        {t("cancel_btn")}
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        {t("profile_save_changes_btn")}
                    </button>
                </div>
            </form>
        </div>
        <ConfirmationDialog
            isOpen={showConfirm}
            title={t("profile_dialog_title")}
            message={
                <>
                    {t("confirm_edit_user_msg_1")}
                    <br />
                    {t("confirm_edit_user_msg_2")}
                </>
            }
            onConfirm={() => {
                setShowConfirm(false);
                const rolesChanged = JSON.stringify(user.roles.map(r => r.name).sort()) !== JSON.stringify(selectedRoles.sort());
                onSubmit(formData, rolesChanged ? selectedRoles : null);
            }}
            onCancel={() => setShowConfirm(false)}
        />
        </ModalPortal>
    );
}