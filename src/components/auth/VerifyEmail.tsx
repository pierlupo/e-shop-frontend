import {useEffect, useRef} from "react";
import {toast} from "react-hot-toast";
import {useNavigate, useSearchParams} from "react-router-dom";
import apiClient from "../../utils/apiClient.ts";
import {AUTH_API_URL} from "../../config/config";

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;
        const token = searchParams.get("token");
        if (!token) {
            toast.error("Missing verification token.");
            navigate("/login");
            return;
        }
        apiClient
            .post(`${AUTH_API_URL}/verify-email?token=${token}`)
            .then(() => {
                toast.success("Email verified, you may now log in.");
            })
            .catch(() => {
                toast.error("Verification failed. Token may be invalid or expired.");
            })
            .finally(() => {
                navigate("/login");
            });
    }, [navigate, searchParams]);

    return null;
}