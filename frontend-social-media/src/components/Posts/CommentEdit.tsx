import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchCommentById, updateComment } from "../../api/post-api";
import "../../styles/Posts/CommentEdit.css"



const CommentEdit = () => {
    const { postId, commentId } = useParams<{ postId: string; commentId: string }>();
    const navigate = useNavigate();
  
    const [comment, setComment] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
  
    useEffect(() => {
      const loadComment = async () => {
        try {
          const data = await fetchCommentById(Number(postId), Number(commentId));
          setComment(data.comment);
        } catch (error) {
          setError("Failed to fetch comment data");
        }
      };
  
      loadComment();
    }, [postId, commentId]);
  
    const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setComment(event.target.value);
    };
  
    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
  
      setLoading(true);
      try {
        await updateComment(Number(commentId), Number(postId), { comment });
        navigate(`/posts/${postId}`); // Redirect back to post after editing
      } catch (error) {
        setError("Failed to update the comment");
      } finally {
        setLoading(false);
      }
    };
  
    if (!comment) {
      return <div className="loading-message">Loading comment...</div>;
    }
  
    return (
      <div className="comment-edit-container">
        <h1>Edit Comment</h1>
        <form onSubmit={handleSubmit} className="comment-edit-form">
          <div className="form-group">
            <label htmlFor="comment" className="form-label">Comment:</label>
            <textarea
              id="comment"
              value={comment}
              onChange={handleCommentChange}
              placeholder="Edit your comment"
              className="comment-input"
            />
          </div>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Updating..." : "Update Comment"}
          </button>
        </form>
        {error && <div className="error-message">{error}</div>}
      </div>
    );
  };
  
  export default CommentEdit;