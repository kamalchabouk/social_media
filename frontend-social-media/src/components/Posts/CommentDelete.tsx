import { useState } from "react";
import { deleteComment } from "../../api/post-api";
import { useAuthentication } from "../../api/auth";


interface DeleteCommentProps {
    commentId: number;
    postId: number;
    authorId: number; // Add authorId to check if the logged-in user is the one who made the comment
    onDelete: () => void; // Callback to refresh after deletion
    className?: string;
  }
  
  const DeleteComment: React.FC<DeleteCommentProps> = ({
    commentId,
    postId,
    authorId,
    onDelete,
    className,
  }) => {
    const { userId } = useAuthentication(); // Use the custom hook to get the logged-in user ID
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
    // If the logged-in user is not the author of the comment, do not display the delete button
    if (userId !== authorId) {
      return null;
    }
  
    const handleDelete = async () => {
      if (!window.confirm("Are you sure you want to delete this comment?")) return;
  
      setLoading(true);
      setError(null);
      try {
        await deleteComment(commentId, postId); // Call the API to delete the comment
        onDelete(); // Call the onDelete callback to refresh the UI
      } catch (err: any) {
        setError(err.message); // Handle errors
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div>
        <button
          className={`comment-delete-button ${className}`}
          onClick={handleDelete}
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    );
  };
  
  export default DeleteComment;