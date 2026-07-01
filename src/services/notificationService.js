import axios from "axios";

const BASE_URL = "/evaluation-service";

export const getToken = () => {
    let token = localStorage.getItem("token");
    if (token && token.startsWith("eyJ")) return token;

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
            const val = localStorage.getItem(key);
            if (val && typeof val === "string") {
                const match = val.match(/(eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+)/);
                if (match) {
                    return match[1];
                }
            }
        }
    }
    return null;
};

export const getNotifications = async (params = {}) => {
    const token = getToken();

    const response = await axios.get(`${BASE_URL}/notifications`, {
        params,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data.notifications;
};