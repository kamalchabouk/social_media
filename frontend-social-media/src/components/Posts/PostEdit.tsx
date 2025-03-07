import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPostById, updatePost } from "../../api/post-api";
import { Post } from "../Posts/PostList"; 
import "../../styles/Posts/PostEdit.css"

const PostEdit = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  
  const [post, setPost] = useState<Post | null>(null);
  const [body, setBody] = useState<string>("");
  const [images, setImages] = useState<FileList | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadPost = async () => {
      try {
        const data = await fetchPostById(Number(postId));
        setPost(data);
        setBody(data.body);
      } catch (error) {
        setError("Failed to fetch post data");
      }
    };

    loadPost();
  }, [postId]);

  const handleBodyChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(event.target.value);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImages(event.target.files);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!post) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("body", body);
    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }
    }

    try {
      await updatePost(post.id, formData); 
      navigate(`/posts/${postId}`);
    } catch (error) {
      setError("Failed to update the post");
    } finally {
      setLoading(false);
    }
  };

  if (!post) {
    return <div>Loading post...</div>;
  }

  return (
    <div className="post-edit-container">
      <h1>Edit Post</h1>
      <form onSubmit={handleSubmit} className="post-edit-form">
        <div className="form-group">
          <label htmlFor="body">Body:</label>
          <textarea
            id="body"
            value={body}
            onChange={handleBodyChange}
            placeholder="Enter post content"
            className="post-body-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="images">Images:</label>
          <input
            type="file"
            id="images"
            multiple
            onChange={handleImageChange}
            className="post-image-input"
          />
        </div>
        <button type="submit" className="post-submit-button" disabled={loading}>
          {loading ? "Updating..." : "Update Post"}
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default PostEdit;
