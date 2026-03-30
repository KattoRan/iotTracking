import axios, {
    type AxiosInstance,
    type AxiosResponse,
    AxiosHeaders,
} from "axios";
import type { InternalAxiosRequestConfig } from "axios";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

/* ========= PUBLIC CLIENT ========= */
export const publicClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

/* ========= PRIVATE CLIENT ========= */
export const privateClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

/* ========= REQUEST INTERCEPTOR ========= */
privateClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // ⚠️ Chỉ chạy ở client
        if (typeof window !== "undefined") {
            const token = sessionStorage.getItem("token");

            config.headers = new AxiosHeaders(config.headers || {});

            if (token) {
                config.headers.set("Authorization", `Bearer ${token}`);
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

/* ========= RESPONSE INTERCEPTOR ========= */
privateClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
        if (
            typeof window !== "undefined" &&
            error.response?.status === 401
        ) {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");

            // optional: redirect về login
            // window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);