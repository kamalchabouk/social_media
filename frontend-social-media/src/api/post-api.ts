import axios from "axios";

const API_POST_BASE_URL = "http://127.0.0.1:8000/social/";

export const fetchPosts = async () => {
  try {
    const token = localStorage.getItem("access");
    console.log("Fetching posts with token:", token); // Debug log

    const response = await axios.get(`${API_POST_BASE_URL}posts/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Posts fetched successfully:", response.data); // Debug log
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching posts:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.error || "Failed to fetch posts");
  }
};

export const createPost = async (postData: FormData) => {
  try {
    const token = localStorage.getItem("access"); // Get token
    if (!token) throw new Error("No access token found");

    console.log("Creating post with token:", token); // Debug log
    console.log("Post data:", postData); // Debug log

    const response = await axios.post(
      `${API_POST_BASE_URL}post/create/`,
      postData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include token
          "Content-Type": "multipart/form-data", // Required for file uploads
        },
      }
    );

    console.log("Post created successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Error creating post:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.error || "Failed to create post");
  }
};
export const fetchPostById = async (postId: number) => {
    try {
      const response = await axios.get(`${API_POST_BASE_URL}post/${postId}/`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching post:", error.response?.data || error.message);
      throw new Error("Failed to fetch post");
    }
  };
  export const createComment = async (commentData: { post: number; comment: string }) => {
    try {
      const token = localStorage.getItem("access");  // Ensure token is fetched
      if (!token) {
        throw new Error("No access token found");  // Handle error if token is missing
      }
  
      const response = await fetch(`${API_POST_BASE_URL}post/${commentData.post}/comment/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,  // Pass token in Authorization header
        },
        body: JSON.stringify(commentData),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Failed to create comment: ${response.status}`);
      }
  
      return await response.json();  // Return the response data
    } catch (error) {
      console.error("Error creating comment:", error);
      throw error;
    }
  };
  

  export const deletePost = async (postId: number) => {
    const token = localStorage.getItem("access");

    console.log("Token: ", token);
  
    const response = await fetch(`${API_POST_BASE_URL}post/${postId}/delete/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, 
      },
    });
  
    if (!response.ok) {
      throw new Error(`Error deleting post: ${response.statusText}`);
    }
  
    return response.json();
};

  
export const updatePost = async (postId: number, postData: FormData) => {
  try {
    const token = localStorage.getItem("access");
    if (!token) throw new Error("No access token found");

    const response = await axios.put(
      `${API_POST_BASE_URL}post/${postId}/edit/`,
      postData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Required for file uploads
        },
      }
    );

    console.log("Post updated successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error updating post:", error.response?.data || error.message);
    throw new Error("Failed to update post");
  }
};
  
  
  
  
  