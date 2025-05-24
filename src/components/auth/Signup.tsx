import React, { useState } from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import {
    EnvelopeIcon,
    LockClosedIcon,
    UserIcon,
    UserCircleIcon
} from '@heroicons/react/24/outline';


const Signup: React.FC = () => {
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const response = await axios.post("http://localhost:9193/api/v1/auth/signup", {
                firstname,
                lastname,
                email,
                password,
            });

            setSuccess("Signup successful! You can now log in.");
        } catch (err: any) {
            setError(err.response?.data?.message || "Signup failed");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto mt-20 p-8 border rounded-lg shadow-lg bg-white"
        >
            <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>

            {error && (
                <p className="mb-4 text-red-600 text-center font-semibold">{error}</p>
            )}
            {success && (
                <p className="mb-4 text-green-600 text-center font-semibold">{success}</p>
            )}

            {/* Firstname */}
            <div className="mb-4">
                <label htmlFor="firstname" className="block mb-1 font-medium">
                    Firstname:
                </label>
                <div className="relative">
                    <UserIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        id="firstname"
                        type="text"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                        required
                        className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your first name"
                    />
                </div>
            </div>

            {/* Lastname */}
            <div className="mb-4">
                <label htmlFor="lastname" className="block mb-1 font-medium">
                    Lastname:
                </label>
                <div className="relative">
                    <UserCircleIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        id="lastname"
                        type="text"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                        required
                        className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your last name"
                    />
                </div>
            </div>

            {/* Email */}
            <div className="mb-4">
                <label htmlFor="email" className="block mb-1 font-medium">
                    Email:
                </label>
                <div className="relative">
                    <EnvelopeIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your email"
                    />
                </div>
            </div>

            {/* Password */}
            <div className="mb-6">
                <label htmlFor="password" className="block mb-1 font-medium">
                    Password:
                </label>
                <div className="relative">
                    <LockClosedIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your password"
                    />
                </div>
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition mb-4"
            >
                Signup
            </button>
            <p className="text-sm text-center">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:underline">
                    Login here
                </Link>
            </p>
        </form>
    );
};

export default Signup;