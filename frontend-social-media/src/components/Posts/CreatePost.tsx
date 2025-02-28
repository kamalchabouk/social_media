import { useState } from "react";
import { createPost } from "../../api/post-api";
import "../../styles/Posts/CreatePost.css";
const CreatePost = () => {
  const [body, setBody] = useState("");
  const [visibility, setVisibility] = useState("public"); // Default value
  const [images, setImages] = useState<FileList | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append("body", body);
    formData.append("visibility", visibility);

    if (images) {
      Array.from(images).forEach((image) => {
        formData.append("images", image); // Append multiple images
      });
    }

    if (video) {
      formData.append("video", video);
    }

    try {
      await createPost(formData);
      alert("Post created successfully!");
      setBody("");
      setImages(null);
      setVideo(null);
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="create-post-container">
      <h2 className="create-post-title">
        Create a Post{" "}
        <select
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
          className="create-post-select"
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </h2>
      {error && <p className="create-post-error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Share your Thoughts with the World!!"
          className="create-post-textarea"
          required
        />

        {/* Label for Image Input */}
        <label className="create-post-file-label">
          Select Images (Optional)
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setImages(e.target.files)}
          className="create-post-file"
        />
        <div className="create-post-tooltip">
          <span className="create-post-tooltiptext">
            Select photos to attach
          </span>
        </div>

        {/* Label for Video Input */}
        <label className="create-post-file-label">
          Select Video (Optional)
        </label>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideo(e.target.files?.[0] || null)}
          className="create-post-file"
        />
        <div className="create-post-tooltip">
          <span className="create-post-tooltiptext">
            Select a video to attach
          </span>
        </div>

        <button type="submit" className="create-post-button">
          Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
