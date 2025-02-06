import React from "react";
import "../style/Profile.css"; // Import styles

type ProfileHeaderProps = {
    user_name: string;
    picture: string;
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user_name, picture }) => {
    return (
        <div className="profile-header">
            <img src={picture} alt="Profile" className="profile-picture" />
            <h1>{user_name}'s Profile</h1>
        </div>
    );
};

export default ProfileHeader;
