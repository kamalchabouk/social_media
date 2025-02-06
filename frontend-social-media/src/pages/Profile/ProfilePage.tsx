import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchUserProfile } from "../../api/profile-api";
import "../../styles/Profile.css";

type UserProfile = {
  user: number;
  user_name: string;
  name: string | null;
  bio: string | null;
  birth_date: string | null;
  location: string | null;
  picture: string;
  number_of_followers: number;
  is_following: boolean;
};

const ProfilePage = () => {
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
      <h1>{profile?.user_name}'s Profile</h1>
      <img src={profile?.picture} alt="Profile" className="profile-picture" />
      <p>
        <strong>Name:</strong> {profile?.name || "No name provided"}
      </p>
      <p>
        <strong>Bio:</strong> {profile?.bio || "No bio available"}
      </p>
      <p>
        <strong>Birth Date:</strong> {profile?.birth_date || "Not provided"}
      </p>
      <p>
        <strong>Location:</strong> {profile?.location || "No location provided"}
      </p>
      <p>
        <strong>Followers:</strong> {profile?.number_of_followers}
      </p>

      <button className="follow-btn">
        {profile?.is_following ? "Unfollow" : "Follow"}
      </button>
    </div>
  );
};

export default ProfilePage;
