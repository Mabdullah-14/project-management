import axios from "axios";

let triggerBlockUI = null;

export const registerRateLimitTrigger = (fn) => {
    triggerBlockUI = fn;
}

export const API = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true,
});

API.interceptors.response.use(
    (response) => response,

    (error) => {
        if (error.response && error.response.status === 429) { 
            if (triggerBlockUI) {
                const errorMessage = error.response.data.message || 'Too many requests. Please slow down.';
                
                triggerBlockUI(true, errorMessage); 
            }
        }
        return Promise.reject(error);
    }
);
