import { getToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

//helper for making authenticated requests
export const apiFetch = async (
    endpoint: string,
    options: RequestInit = {} 
): Promise<Response> => {
    const token = getToken();

    const headers: HeadersInit = {
        "Content-Type": "application/json" , 
        ...(token && {Authorization: `Bearer ${token}`}),
    };

    return fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

};

