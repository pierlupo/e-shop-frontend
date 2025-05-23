import React, { useState } from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import { useAuth } from "../../components/auth/AuthContext";
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("http://localhost:9193/api/v1/auth/login", {
                email,
                password,
            });

            login(response.data.token);
            navigate("/home");
        } catch (err: any) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto mt-20 p-8 border rounded-lg shadow-lg bg-white"
        >
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

            {error && (
                <p className="mb-4 text-red-600 text-center font-semibold">{error}</p>
            )}

            <div className="mb-4">
                <label htmlFor="email" className="block mb-1 font-medium">
                    Email:
                </label>
                <div className="relative">
                    <EnvelopeIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        id="email"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your email"
                    />
                </div>
            </div>

            <div className="mb-6">
                <label className="block mb-1 font-medium" htmlFor="password">
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
                Login
            </button>
            <p className="text-sm text-center">
                Don’t have an account?{" "}
                <Link to="/signup" className="text-blue-600 hover:underline">
                    Signup here
                </Link>
            </p>
        </form>
    );
};

export default Login;