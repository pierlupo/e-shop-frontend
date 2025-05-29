import type {AxiosError} from "axios";
import React, {useState} from "react";
import {login as loginService} from "../../services/authService.ts";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../../hooks/UseAuth.ts";
import {EnvelopeIcon, LockClosedIcon} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import LayoutWrapper from "../LayoutWrapper";


const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const {login} = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(""); // still clear state in case it's used elsewhere

        try {
            const response = await loginService({ email, password });
            const user = response.data.user;
            const token = response.data.token;
            login(token, user);
            toast.success(`Welcome ${user.firstname || "user"}!`);
            navigate("/home");
        } catch (error) {
            const err = error as AxiosError<{ message?: string }>;
            const message:string = `${err.response?.data?.message}...\nPlease try again !` ;
            toast.error(message);
            setError(message); // optional
        }
    };

    return (
        <LayoutWrapper className="dark:bg-gray-600">
        <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold mb-6 text-center dark:text-amber-50">Login</h2>
            {error && (
                <p className="mb-4 text-red-600 text-center font-semibold">{error}</p>
            )}
            <div className="flex flex-col items-center">
            {/* Email */}
            <div className="mb-4 w-80">
                <label htmlFor="email" className="block mb-1 font-medium dark:text-amber-50">
                    Email
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
                        placeholder="Enter your email"
                    />
                </div>
            </div>
            {/* Password */}
            <div className="mb-6 w-80">
                <label className="block mb-1 font-medium dark:text-amber-50" htmlFor="password">
                    Password
                </label>
                <div className="relative">
                    <LockClosedIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-amber-50 dark:placeholder-gray-400"
                        placeholder="Enter your password"
                    />
                </div>
            </div>
            <button
                type="submit"
                className="w-80 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition mb-4 mx-auto block"
            >
                Login
            </button>
            <p className="text-sm text-center dark:text-amber-50">
                Don’t have an account ? {" "}
                <Link to="/signup" className="text-blue-600 hover:underline">
                    Signup here
                </Link>
            </p>
            </div>
        </form>
            </LayoutWrapper>
    );
};

export default Login;