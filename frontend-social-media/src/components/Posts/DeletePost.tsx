import { deletePost } from "../../api/post-api";
import { useAuthentication } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import "../../styles/Posts/PostDelete.css";

type DeletePostProps = {
  postId: number;
  authorId: number;
  onDelete: (deletedPostId: number) => void;
  className?: string;
};

const DeletePost = ({ postId, authorId, onDelete, className }: DeletePostProps) => {
  const { userId } = useAuthentication();
  const navigate = useNavigate();

  if (userId !== authorId) {
    return null;
  }

  const handleDelete = async () => {
    console.log("Delete button clicked!");
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(postId); // Call the API to delete the post
        onDelete(postId); // Call the onDelete callback to remove the post from the UI
        navigate(0); // Reload the page using React Router
      } catch (error) {
        console.error("Failed to delete post:", error);
      }
    }
  };

  return (
    <button className={`post-delete-button ${className}`} onClick={handleDelete}>
      🗑️
    </button>
  );
};

export default DeletePost;
