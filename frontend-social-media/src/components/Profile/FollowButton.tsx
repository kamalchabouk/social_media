import React, { useState } from "react";
import "../style/Profile.css"; 

type FollowButtonProps = {
    is_following: boolean;
};

const FollowButton: React.FC<FollowButtonProps> = ({ is_following }) => {
    const [following, setFollowing] = useState(is_following);

    const handleFollowToggle = () => {
        setFollowing(!following);
        // TODO: Add API call to update follow status in the backend
    };

    return (
        <button className="follow-btn" onClick={handleFollowToggle}>
            {following ? "Unfollow" : "Follow"}
        </button>
    );
};

export default FollowButton;
