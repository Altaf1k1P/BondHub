import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecommendations, sendFriendRequest } from "../store/userSlice.js";

function Home() {
    const dispatch = useDispatch();
    const { user,recommendations, isLoading } = useSelector((state) => state.users);

 const handleSendFriendRequest = (receiverId) => {
        if (user && user._id) {
            dispatch(sendFriendRequest({ senderId: user.userId, receiverId }));
        }
    };
    const defaultProfilePicture = "/defaultAvtar.webp";
    useEffect(() => {
        dispatch(fetchRecommendations(user.userId));
    }, [dispatch]);

    return (
        <div>
            <h2>Mutual Friends</h2>
            <p>please search for recommendations</p>
            {isLoading ? (
                <p>Loading...</p>
            ) : recommendations.length > 0 ? (
                recommendations.map((user) => (
                    <div key={user.userId}>
                        <img 
                            src={user.profilePicture || defaultProfilePicture} 
                            alt="Profile" 
                            style={{ width: "50px", height: "50px", borderRadius: "50%" }} 
                        />
                        <p>{user.username}</p>
                        <button
                                        onClick={() => handleSendFriendRequest(user.userId)}
                                        className="btn btn-primary"
                                    >
                                        Send Friend Request
                                    </button>
                    </div>
                ))
            ) : (
                <p>No mutual friends yet.</p>
            )}
        </div>
    );
}

export default Home;