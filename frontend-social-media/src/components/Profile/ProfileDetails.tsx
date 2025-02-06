import React from "react";

type ProfileDetailsProps = {
    name: string | null;
    bio: string | null;
    birth_date: string | null;
    location: string | null;
    number_of_followers: number;
};

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ name, bio, birth_date, location, number_of_followers }) => {
    return (
        <div className="profile-details">
            <p><strong>Name:</strong> {name || "No name provided"}</p>
            <p><strong>Bio:</strong> {bio || "No bio available"}</p>
            <p><strong>Birth Date:</strong> {birth_date || "Not provided"}</p>
            <p><strong>Location:</strong> {location || "No location provided"}</p>
            <p><strong>Followers:</strong> {number_of_followers}</p>
        </div>
    );
};

export default ProfileDetails;
