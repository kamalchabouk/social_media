import React, { useEffect } from "react";

interface EditProfileDetailsProps {
  name: string;
  setName: (value: string) => void;
  bio: string;
  setBio: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  birthDate: string;
  setBirthDate: (value: string) => void;
  picture: File | null;
  setPicture: React.Dispatch<React.SetStateAction<File | null>>;
  preview: string | null;
  setPreview: React.Dispatch<React.SetStateAction<string | null>>;
  loading: boolean;
  error: string | null;
  currentProfile: {
    name: string;
    bio: string;
    location: string;
    birth_date: string;
    pictureUrl: string | null;
  };
  handleUpdateProfile: (e: React.FormEvent) => Promise<void>;
  handleDeletePicture: () => void;
}

const EditProfileDetails: React.FC<EditProfileDetailsProps> = ({
  name,
  bio,
  location,
  birthDate,
  picture,
  preview,
  loading,
  error,
  setName,
  setBio,
  setLocation,
  setBirthDate,
  setPicture,
  setPreview,
  currentProfile,
  handleUpdateProfile,
  handleDeletePicture,
}) => {
  // Ensure profile data is set when loaded
  useEffect(() => {
    setName(currentProfile.name);
    setBio(currentProfile.bio);
    setLocation(currentProfile.location);
    setBirthDate(currentProfile.birth_date);
    setPreview(currentProfile.pictureUrl);
  }, [currentProfile]);

  return (
    <form onSubmit={handleUpdateProfile}>
      {error && <p className="error">{error}</p>}

      <label>Name:</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

      <label>Bio:</label>
      <input type="text" value={bio} onChange={(e) => setBio(e.target.value)} />

      <label>Birth Date:</label>
      <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />

      <label>Location:</label>
      <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />

      <label>Profile Picture:</label>
      {preview && <img src={preview} alt="Profile Preview" className="profile-preview" />}
      <input type="file" accept="image/*" onChange={(e) => setPicture(e.target.files?.[0] || null)} />

      <button type="submit">Save Changes</button>
    </form>
  );
};

export default EditProfileDetails;
