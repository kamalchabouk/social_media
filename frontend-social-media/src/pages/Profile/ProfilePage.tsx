import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchUserProfile } from "../../api/profile-api";
import { useAuthentication } from "../../api/auth";
import { FaPen } from "react-icons/fa";
import "../../styles/Profile.css";


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

const ProfilePage = () => {

  const { isAuthorized, userId } = useAuthentication();

  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    getUserProfile();
  }, [id]);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>{error}</p>;

  return (
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
      <p className="name">
        <strong>Name:</strong> {profile?.name || "No name provided"}
      </p>
      <p className="bio">
        <strong>Bio:</strong> {profile?.bio || "No bio available"}
      </p>
      <p className="birth-date">
        <strong>Birth Date:</strong> {profile?.birth_date || "Not provided"}
      </p>
      <p className="location">
        <strong>Location:</strong> {profile?.location || "No location provided"}
      </p>
      <p className="followers">
      <strong>Followers:</strong> {Array.isArray(profile?.followers) ? profile.followers.length : profile?.followers}
      </p>
      
      <button className="follow-btn">
        {profile?.is_following ? "Unfollow" : "Follow"}
      </button>
      

    </div>
  );
};

export default ProfilePage;
