import axios from "axios";

const API_PROFILE_BASE_URL = "http://127.0.0.1:8000/users/api"; 

export const fetchUserProfile = async (userId: string) => {
    try {
        const response = await axios.get(`${API_PROFILE_BASE_URL}/profile/${userId}/`);
        return response.data;  // The API returns { user, profile, number_of_followers, is_following }
    } catch (error: any) {
        console.error("Error fetching user profile:", error.response?.data || error.message);
        throw new Error(error.response?.data?.error || "Failed to fetch profile");
    }
};
