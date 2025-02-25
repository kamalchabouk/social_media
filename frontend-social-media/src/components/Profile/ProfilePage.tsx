import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchUserProfile, fetchUserPosts } from "../../api/profile-api";
import { useAuthentication } from "../../api/auth";
import { FaPen } from "react-icons/fa";
import "../../styles/Profile.css";
import "../../styles/Posts/PostListPage.css"; 

type UserProfile = {
  user: number;
  user_name: string;
  name: string | null;
  bio: string | null;
  birth_date: string | null;
  location: string | null;
  picture: string;
  followers: number;
  is_following: boolean;
};

type Post = {
  id: number;
  body: string;
  shared_body: string | null;
  created_on: string;
  shared_on: string | null;
  author_username: string;
  visibility: string;
  shared_user_username: string | null;
  images: { id: number; image: string }[];
  video: string | null;
  likes_count: number;
  dislikes_count: number;
  tags: string[];
};

const ProfilePage = () => {
  const { isAuthorized, userId } = useAuthentication();
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        if (!id) return;
        const data = await fetchUserProfile(id);
        setProfile(data.profile);
      } catch (error: any) {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    const getUserPosts = async () => {
      try {
        if (!id) return;
        const postsData = await fetchUserPosts(id);
        setPosts(postsData);
      } catch (error: any) {
        console.error("Failed to load user posts.");
      } finally {
        setLoadingPosts(false);
      }
    };

    getUserProfile();
    getUserPosts();
  }, [id]);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>{error}</p>;

return (
  <div>
    {/* Profile Section */}
    <div className="profile-container">
      <h1 className="profile-title">
        <span>{profile?.user_name}'s Profile</span>
        {isAuthorized && profile?.user === userId && (
          <Link to={`/profile/${userId}/edit`} className="edit-profile-btn">
            <FaPen />
          </Link>
        )}
      </h1>
      <img src={profile?.picture} alt="Profile" className="profile-picture" />
      <p className="name"><strong>Name:</strong> {profile?.name || "No name provided"}</p>
      <p className="bio"><strong>Bio:</strong> {profile?.bio || "No bio available"}</p>
      <p className="birth-date"><strong>Birth Date:</strong> {profile?.birth_date || "Not provided"}</p>
      <p className="location"><strong>Location:</strong> {profile?.location || "No location provided"}</p>
      <p className="followers"><strong>Followers:</strong> {profile?.followers}</p>
      <button className="follow-btn">{profile?.is_following ? "Unfollow" : "Follow"}</button>
    </div>

    {/* Posts Section */}
    <div className="post-list-container">
      <h2>{profile?.user_name}'s Posts</h2>
      {loadingPosts ? (
        <p>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="post">
            <h3 className="post-author">{profile?.user_name}</h3>
            <p className="post-body">{post.body}</p>
            {post.shared_body && <blockquote className="post-shared">{post.shared_body}</blockquote>}
            <p className="post-meta">{new Date(post.created_on).toLocaleDateString()} | Likes: {post.likes_count} | Dislikes: {post.dislikes_count}</p>
            {post.images.length > 0 && (
              <div className="post-images">
                {post.images.map((img) => (
                  <img key={img.id} src={img.image} alt="Post" />
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  </div>
);

};

export default ProfilePage;