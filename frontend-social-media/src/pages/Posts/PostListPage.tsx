import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Post } from "../../components/Posts/PostList";
import { fetchPosts } from "../../api/post-api";
import CreatePost from "../../components/Posts/CreatePost";
import "../../styles/Posts/PostListPage.css";

const PostList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        console.log("Loading posts...");
        const data = await fetchPosts();
        console.log("Setting posts state:", data);
        setPosts(data);
      } catch (err: any) {
        console.error("Error loading posts:", err.message);
        setError(err.message);
      }
    };
    loadPosts();
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;

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
                <div className="post-author-info">
                  <span className="post-author-name">{post.author_username}</span>
                  <span className="post-date">
                    {new Date(post.created_on).toLocaleString()}
                  </span>
                </div>
              </Link>
            </div>

            {post.shared_body && (
              <blockquote className="post-shared-body">
                {post.shared_body}
              </blockquote>
            )}
            <p className="post-body">{post.body}</p>
            {post.images.length > 0 && (
              <div className="post-images">
                {post.images.map((img) => (
                  <img
                    key={img.id}
                    src={img.image}
                    alt="Post"
                    className="post-image"
                  />
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
              <button className="post-action-button">
                💬 Comment
              </button>
              <button className="post-action-button">
                🔗 Share
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PostList;