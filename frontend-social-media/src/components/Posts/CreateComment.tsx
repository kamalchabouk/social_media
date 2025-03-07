import React, { useState } from "react";
import { createComment } from "../../api/post-api";

const CreateComment: React.FC<{ postId: number; onCommentAdded: () => void }> = ({ postId, onCommentAdded }) => {
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) return;

    setLoading(true);
    setError("");

    try {
      await createComment({ post: postId, comment });
      setComment(""); // Clear input
      onCommentAdded(); // Refresh comments
    } catch (err) {
      setError("Failed to post comment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleCommentSubmit}>
      <input
        type="text"
        value={comment}
        onChange={handleCommentChange}
        placeholder="Add a comment..."
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Posting..." : "Post Comment"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default CreateComment;
