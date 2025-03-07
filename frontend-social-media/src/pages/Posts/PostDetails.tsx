import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPostById } from "../../api/post-api";
import { Link } from "react-router-dom";
import DeletePost from "../../components/Posts/DeletePost";
import { FaPen } from "react-icons/fa";
import { useAuthentication } from "../../api/auth";
import DeleteComment from "../../components/Posts/CommentDelete";
import "../../styles/Posts/PostDetails.css";


interface Post {
  id: number;
  body: string;
  author_id: number;
  author_username: string;
  author_picture: string | null;
  created_on: string;
  images: { id: number; image: string }[]; // Add images here
  comments: Comment[];
}

interface Comment {
  id: number;
  comment: string;
  author_id: number;
  author_username: string;
  comment_author_picture: string | null;
  created_on: string;
}

const PostDetail = () => {
  const { isAuthorized, userId } = useAuthentication();
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPostDetails = async () => {
      try {
        const postData = await fetchPostById(Number(postId));
        setPost(postData);
      } catch (err: any) {
        setError(err.message);
      }
    };
    loadPostDetails();
  }, [postId]);

  const handlePostDelete = (deletedPostId: number) => {
    // Logic to remove the post from the UI after deletion
    console.log("Post deleted with ID:", deletedPostId);
    setPost(null); // This removes the post from the UI
  };

  if (error) return <p className="text-red-500">{error}</p>;
  if (!post) return <p>Loading...</p>;

  return (
    <div className="post-detail-container">
      <div className="post-header">
        <Link to={`/profile/${post.author_id}`} className="post-author">
          <img
            src={
              post.author_picture
                ? `${import.meta.env.VITE_API_URL}${post.author_picture}`
                : "/path/to/default/profile-pic.png"
            }
            alt="Profile"
            className="post-author-img"
          />
          <div>
            <p className="post-author">{post.author_username} </p>
            <p className="post-date">
              {new Date(post.created_on).toLocaleString()}
            </p>
          </div>
        </Link>
      </div>

      {/* Post Body */}
      <div className="post-body-container">
        {isAuthorized && post.author_id === userId && (
          <Link to={`/posts/${post.id}/edit`} className="edit-profile-btn">
            <FaPen />
          </Link>
        )}
        <DeletePost
          postId={post.id}
          authorId={post.author_id}
          onDelete={handlePostDelete}
          className="delete-button-post-details"
        />
        <p className="post-body">{post.body}</p>
      </div>

      {/* Post Images */}
      {post.images.length > 0 && (
        <div className="post-images-container">
          {post.images.map((img) => (
            <img key={img.id} src={img.image} alt="Post" className="post-image" />
          ))}
        </div>
      )}

      <hr />

      <h3>Comments</h3>
      {post.comments.length === 0 ? (
  <p>No comments yet.</p>
) : (
  post.comments.map((comment) => (
    <div key={comment.id} className="post-details-comment">
      <div className="post-details-comment-header">
        <Link to={`/profile/${comment.author_id}`}>
          <img
            src={
              comment.comment_author_picture
                ? `${import.meta.env.VITE_API_URL}${comment.comment_author_picture}`
                : "/path/to/default/profile-pic.png"
            }
            alt="Comment Author"
            className="post-details-comment-author-avatar"
          />
          <div>
            <p className="post-details-comment-author">
              <strong>{comment.author_username}</strong>
            </p>
            <p className="post-details-comment-date">
              {new Date(comment.created_on).toLocaleString()}
            </p>
          </div>
        </Link>
      </div>

      <p className="post-details-comment-body">{comment.comment}</p>
      
      {/* Edit and Delete buttons for the comment */}
      {isAuthorized && comment.author_id === userId && (
        <Link to={`/posts/${post.id}/comment/${comment.id}/edit`} className="edit-profile-btn">
          <FaPen />
        </Link>
      )}
      
      {isAuthorized && comment.author_id === userId && (
        <DeleteComment
          commentId={comment.id}
          postId={post.id}
          authorId={comment.author_id}
          onDelete={() => {
            setPost((prevPost) => ({
              ...prevPost!,
              comments: prevPost?.comments.filter((c) => c.id !== comment.id) || [],
            }));
          }}
          className="delete-button-comment-details"
        />
      )}
    </div>
  ))
)}
    </div>
  );
};

export default PostDetail;
