import React, { useState, useEffect } from "react";
import type {User} from "../../interfaces/User.ts";

interface EditUserDialogProps {
    user: User;
    onClose: () => void;
    onSubmit: (updatedUser: Partial<User>) => void;
}

export default function EditUserDialog({ user, onClose, onSubmit }: EditUserDialogProps) {
    const [formData, setFormData] = useState<Partial<User>>({});

    useEffect(() => {
        setFormData(user); // initialize form with user data
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submitting updated user:", formData);
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-700 p-6 rounded shadow-md w-96">
                <h2 className="text-lg font-semibold mb-4">Edit User</h2>

                <label className="block mb-2">
                    Firstname
                    <input
                        type="text"
                        name="firstname"
                        value={formData.firstname ?? ""}
                        onChange={handleChange}
                        className="w-full mt-1 p-2 border rounded"
                    />
                </label>

                <label className="block mb-2">
                    Lastname
                    <input
                        type="text"
                        name="lastname"
                        value={formData.lastname ?? ""}
                        onChange={handleChange}
                        className="w-full mt-1 p-2 border rounded"
                    />
                </label>

                {/* Add more fields as needed */}

                <div className="mt-4 flex justify-end space-x-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}