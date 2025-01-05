import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFriends, unfollow } from "../store/userSlice.js";
import { useParams } from "react-router-dom";

function FriendList() {
    const dispatch = useDispatch();
    const { friends, isLoading, error } = useSelector((state) => state.users);
    const { userId } = useParams();
    
    useEffect(() => {
        if (userId) {
            dispatch(fetchFriends(userId));
        }
    }, [dispatch, userId]);

    const defaultProfilePicture = "/defaultAvtar.webp"; // Path to default image in public folder

    const handleUnfollow = (receiverId) => {
        const senderId = userId; // Assuming the senderId is the logged-in user
        dispatch(unfollow({ senderId, receiverId }));
    };

    return (
        <div>
            <h2>Your Friends</h2>
            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error.message}</p>
            ) : friends.length > 0 ? (
                friends.map((friend) => (
                    <div key={friend?._id}>
                        <img
                            src={friend?.profilePicture || defaultProfilePicture}
                            alt="Profile"
                            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                        />
                        <p>{friend?.username}</p>
                        <button onClick={() => handleUnfollow(friend._id)}>Unfriend</button>
                    </div>
                ))
            ) : (
                <p>No friends yet.</p>
            )}
        </div>
    );
}

export default FriendList;
