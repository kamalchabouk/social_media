import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPostById } from "../../api/post-api";
import { Link } from "react-router-dom";
import DeletePost from "../../components/Posts/DeletePost";
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
        <DeletePost postId={post.id} authorId={post.author_id} onDelete={handlePostDelete} />
      </div>

      {/* Post Body */}
      <div className="post-body-container">
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

      {/* Delete Button - Only for Post Owner */}
      

      <hr />

      <h3>Comments</h3>
      {post.comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        post.comments.map((comment) => (
          <div key={comment.id} className="comment">
            <div className="comment-header">
              <Link to={`/profile/${comment.author_id}`}>
                <img
                  src={
                    comment.comment_author_picture
                      ? `${import.meta.env.VITE_API_URL}${comment.comment_author_picture}`
                      : "/path/to/default/profile-pic.png"
                  }
                  alt="Comment Author"
                  className="post-author-img"
                />
                <p className="comment-author">
                  <strong>{comment.author_username}</strong>
                </p>
                <p className="comment-date">
                  {new Date(comment.created_on).toLocaleString()}
                </p>
              </Link>
            </div>

            <p className="comment-body">{comment.comment}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default PostDetail;
