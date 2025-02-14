import axios from "axios";

const API_PROFILE_BASE_URL = "http://127.0.0.1:8000/users/api"; 

export const fetchUserProfile = async (userId: string) => {
    try {
        const response = await axios.get(`${API_PROFILE_BASE_URL}/profile/${userId}/`);
        return response.data;  // API returns { user, profile, number_of_followers, is_following }
    } catch (error: any) {
        console.error("Error fetching user profile:", error.response?.data || error.message);
        throw new Error(error.response?.data?.error || "Failed to fetch profile");
    }
};


export const editUserProfile = async (userId: string, formData: FormData) => {
    try {
      const token = localStorage.getItem("access");
      
      const response = await axios.put(
        `${API_PROFILE_BASE_URL}/profile/${userId}/edit/`, 
        formData, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      return response.data;
    } catch (error: any) {
      console.error("Error updating profile:", error.response?.data || error.message);
      if (error.response?.data) {
        const errors = error.response.data;
        let errorMessages: string[] = [];
  
        // Extract field-specific errors
        for (const field in errors) {
          if (Array.isArray(errors[field])) {
            errorMessages.push(`${field}: ${errors[field].join(", ")}`);
          }
        }
  
        throw new Error(errorMessages.length ? errorMessages.join(" | ") : "Failed to update profile");
      }
  
      throw new Error("Failed to update profile");
    }
  };
  
  