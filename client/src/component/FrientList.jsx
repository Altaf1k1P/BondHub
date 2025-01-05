import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFriends } from "../store/userSlice.js";
import { useParams } from "react-router-dom";

function FriendList() {
    const dispatch = useDispatch();
    const { friends, isLoading } = useSelector((state) => state.users);
    const { userId } = useParams();

    useEffect(() => {
        if (userId) {
            dispatch(fetchFriends(userId));
        }
    }, [dispatch, userId]);

    // Default profile picture from the public folder
    const defaultProfilePicture = "/defaultAvtar.webp"; // Path to default image in public folder

    return (
        <div>
            <h2>Your Friends</h2>
            {isLoading ? (
                <p>Loading...</p>
            ) : friends.length > 0 ? (
                friends.map((friend) => (
                    <div key={friend?._id}>
                        <img 
                            src={friend?.profilePicture || defaultProfilePicture} 
                            alt="Profile" 
                            style={{ width: "50px", height: "50px", borderRadius: "50%" }} 
                        />
                        <p>{friend?.username}</p>
                        <button>Unfriend</button>
                    </div>
                ))
            ) : (
                <p>No friends yet.</p>
            )}
        </div>
    );
}

export default FriendList;
