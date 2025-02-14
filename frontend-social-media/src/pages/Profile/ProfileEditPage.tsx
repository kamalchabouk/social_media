import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchUserProfile, editUserProfile } from "../../api/profile-api";
import "../../styles/ProfileEditPage.css";
import "font-awesome/css/font-awesome.min.css";

const ProfileEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State to store profile details
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    birth_date: "",
    location: "",
    pictureUrl: null as string | null,
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [picture, setPicture] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (!id) return;
        const data = await fetchUserProfile(id);
        console.log("Fetched Profile Data:", data); // Debugging log

        if (data.profile) {
          setProfile({
            name: data.profile.name || "",
            bio: data.profile.bio || "",
            birth_date: data.profile.birth_date
              ? formatDateForInput(data.profile.birth_date)
              : "",
            location: data.profile.location || "",
            pictureUrl: data.profile.picture || null,
          });

          setPreview(data.profile.picture || null);
        } else {
          console.error("Profile key missing in API response", data);
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
        setError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [id]);

  // Function to format date correctly
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";

    const parts = dateString.split("/");
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`; // Convert "01/01/1999" → "1999-01-01"
    }

    return dateString; // Assume it's already correct
  };

  useEffect(() => {
    console.log("Profile State Updated:", profile);
  }, [profile]); // Debugging: Check when profile state updates

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile picture change
  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setPicture(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append("name", profile.name);
    formData.append("bio", profile.bio);
    formData.append("birth_date", profile.birth_date);
    formData.append("location", profile.location);
    if (picture) formData.append("picture", picture);

    try {
      await editUserProfile(id!, formData);
      alert("Profile updated successfully!");
      navigate(`/profile/${id}`);
    } catch (error: any) {
      setError(error.response?.data || "Failed to update profile.");
    }
  };

  return (
    <div className="profile-container">
      <h2>Edit Profile</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleUpdateProfile}>
          {error && <p className="error">{error}</p>}
          <label>Profile Picture:</label>
          {preview ? (
            <div className="profile-preview-container">
              <img
                src={preview}
                alt="Profile Preview"
                className="profile-preview"
              />
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="remove-pic-btn"
              >
                <i className="fa fa-trash fa-xs"></i> {/* Smaller trash icon */}
              </button>
            </div>
          ) : (
            <input
              type="file"
              accept="image/*"
              onChange={handlePictureChange}
            />
          )}

          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
          />

          <label>Bio:</label>
          <input
            type="text"
            name="bio"
            value={profile.bio}
            onChange={handleChange}
          />

          <label>Birth Date:</label>
          <input
            type="date"
            name="birth_date"
            value={profile.birth_date}
            onChange={handleChange}
          />

          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={profile.location}
            onChange={handleChange}
          />

          <button type="submit">Save Changes</button>
        </form>
      )}
    </div>
  );
};

export default ProfileEditPage;
