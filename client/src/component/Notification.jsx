import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFriendRequests, respondToFriendRequest } from "../store/userSlice";

function Notifications() {
    const dispatch = useDispatch();
    const { friendRequests, isLoading } = useSelector((state) => state.users);

    const defaultProfilePicture = "/defaultAvtar.webp";
    useEffect(() => {
        dispatch(fetchFriendRequests());
    }, [dispatch]);

    const handleResponse = (requestId, action) => {
        console.log("Sending response:", { requestId, action });
        dispatch(respondToFriendRequest({ requestId, action }));
    };
    

    return (
        <div>
            <h2>Friend Requests</h2>
            {isLoading ? (
                <p>Loading...</p>
            ) : friendRequests.length > 0 ? (
                friendRequests.map((request) => (
                    <div key={request._id}>
                        <img 
                            src={request.sender.profilePicture || defaultProfilePicture} 
                            alt="Profile" 
                            style={{ width: "50px", height: "50px", borderRadius: "50%" }} 
                        />
                        <p>{request.sender.username}</p>
                        <button onClick={() => handleResponse(request._id, "accepted")}>Accept</button>
                        <button onClick={() => handleResponse(request._id, "rejected")}>Reject</button>
                    </div>
                ))
            ) : (
                <p>No new friend requests.</p>
            )}
        </div>
    );
}

export default Notifications;
