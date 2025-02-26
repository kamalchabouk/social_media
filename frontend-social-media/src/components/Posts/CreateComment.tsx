import React, { useState } from "react";
import { createComment } from "../../api/post-api";

const CreateComment: React.FC<{ postId: number }> = ({ postId }) => {
  const [comment, setComment] = useState<string>("");

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`Comment input for post ${postId} changed: ${e.target.value}`);
    setComment(e.target.value);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Attempting to submit comment for post ${postId}: ${comment}`);

    if (!comment.trim()) return; // Don't submit if comment is empty

    const commentData = { post: postId, comment: comment }; // ✅ Use post_id instead of post

    console.log("Comment data before submission:", commentData);

    try {
      await createComment(commentData); // ✅ No need to pass `postId` separately
      console.log("Comment submitted successfully for post:", postId);

      setComment(""); // Clear input after submission
      // Optionally trigger a refresh to show the new comment
    } catch (error) {
      console.error("Failed to create comment:", error);
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
      <button type="submit">Post Comment</button>
    </form>
  );
};

export default CreateComment;
