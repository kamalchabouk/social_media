import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Post, Comment } from "../../components/Posts/PostList";
import { fetchPosts } from "../../api/post-api";
import CreatePost from "../../components/Posts/CreatePost";
import CreateComment from "../../components/Posts/CreateComment";
import "../../styles/Posts/PostListPage.css";
import DeletePost from "../../components/Posts/DeletePost";

const PostList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      console.log("Loading posts...");
      const data = await fetchPosts();
      console.log("Posts data fetched:", data);
      setPosts(data);
    } catch (err: any) {
      console.error("Error loading posts:", err.message);
      setError(err.message);
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="post-list-container">
      <CreatePost />
      <h2 className="text-xl font-bold mb-4">Posts</h2>
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="post">
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
              </Link>
              <div className="post-author-details">
                <Link to={`/profile/${post.author_id}`} className="post-author-name">
                  {post.author_username}
                </Link>
                <span className="post-date">
                  {new Date(post.created_on).toLocaleString()}
                </span>
              </div>
              <DeletePost
                postId={post.id}
                authorId={post.author_id}
                onDelete={(deletedPostId) => {
                  setPosts((prevPosts) =>
                    prevPosts.filter((post) => post.id !== deletedPostId)
                  );
                }}
              />
            </div>

            <Link to={`/posts/${post.id}`} className="post-body-link">
              {post.shared_body && (
                <blockquote className="post-shared-body">
                  {post.shared_body}
                </blockquote>
              )}
              <p className="post-body">{post.body}</p>
            </Link>

            {post.video && (
              <div className="post-video">
                <video controls>
                  <source
                    src={`${import.meta.env.VITE_API_URL}${post.video}`}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}

            {post.images.length > 0 && (
              <div className="post-images">
                {post.images.map((img) => (
                  <img
                    key={img.id}
                    src={img.image}
                    alt="Post"
                    className="post-image"
                    onClick={() => handleImageClick(img.image)}
                  />
                ))}
              </div>
            )}

            {post.tags.length > 0 && (
              <div className="post-tags">
                {post.tags.map((tag) => (
                  <span key={tag.id} className="post-tag">
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}

            <div className="post-footer">
              <button className="post-action-button">
                👍 {post.likes_count}
              </button>
              <button className="post-action-button">
                👎 {post.dislikes_count}
              </button>
              <button
                className="post-action-button"
                onClick={() => setShowCommentForm(!showCommentForm)}
              >
                💬 Comment
              </button>
              {showCommentForm && (
                <CreateComment postId={post.id} onCommentAdded={loadPosts} />
              )}
              <button className="post-action-button">🔗 Share</button>
            </div>

            {post.comments && post.comments.length > 0 && (
              <div className="comments-section">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="comment">
                    <Link to={`/profile/${comment.author_id}`} className="comment-author">
                      <img
                        src={
                          comment.comment_author_picture
                            ? `${import.meta.env.VITE_API_URL}${comment.comment_author_picture}`
                            : "/path/to/default/profile-pic.png"
                        }
                        alt="Comment Author"
                        className="comment-author-img"
                      />
                    </Link>
                    <div className="comment-bubble">
                      <Link to={`/profile/${comment.author_id}`} className="comment-author-name">
                        {comment.author_username}
                      </Link>
                      <span className="comment-date">
                        {new Date(comment.created_on).toLocaleString()}
                      </span>
                      <p className="comment-body">{comment.comment}</p>
                    </div>

                    {/* Display likes and dislikes for each comment */}
                    <div className="comment-actions">
                      <button className="comment-action-button">
                        👍 {comment.likes_count}
                      </button>
                      <button className="comment-action-button">
                        👎 {comment.dislikes_count}
                      </button>
                    </div>

                    {/* Display comment tags */}
                    {comment.tags.length > 0 && (
                      <div className="comment-tags">
                        {comment.tags.map((tag, index) => (
                          <span key={index} className="comment-tag">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Display replies to the comment */}
                    {comment.replies.length > 0 && (
                      <div className="replies-section">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="reply">
                            <Link to={`/profile/${reply.author_id}`} className="reply-author">
                              <img
                                src={
                                  reply.comment_author_picture
                                    ? `${import.meta.env.VITE_API_URL}${reply.comment_author_picture}`
                                    : "/path/to/default/profile-pic.png"
                                }
                                alt="Reply Author"
                                className="reply-author-img"
                              />
                            </Link>
                            <div className="reply-bubble">
                              <Link to={`/profile/${reply.author_id}`} className="reply-author-name">
                                {reply.author_username}
                              </Link>
                              <span className="reply-date">
                                {new Date(reply.created_on).toLocaleString()}
                              </span>
                              <p className="reply-body">{reply.comment}</p>
                            </div>

                            {/* Display likes and dislikes for replies */}
                            <div className="reply-actions">
                              <button className="reply-action-button">
                                👍 {reply.likes_count}
                              </button>
                              <button className="reply-action-button">
                                👎 {reply.dislikes_count}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}

      {selectedImage && (
        <div className="image-modal" onClick={closeModal}>
          <div className="image-modal-content">
            <img src={selectedImage} alt="Full-size" className="full-image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default PostList;
