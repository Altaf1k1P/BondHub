import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFriendRequests, respondToFriendRequest } from "../store/userSlice.js";

function Notifications() {
    const dispatch = useDispatch();
    const { friendRequests, isLoading, error } = useSelector((state) => state.users);

    const defaultProfilePicture = "/defaultAvtar.webp";

    useEffect(() => {
        dispatch(fetchFriendRequests());
    }, [dispatch]);

    const handleResponse = (requestId, status) => {
        dispatch(respondToFriendRequest({ requestId, status }));
    };

    return (
        <div>
            <h2>Friend Requests</h2>
            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <div>Error: {error}</div>
            ) : friendRequests.length > 0 ? (
                friendRequests.map((request) => (
                    <div key={request._id} style={{ marginBottom: "10px" }}>
                        <img
                            src={request.sender.profilePicture || defaultProfilePicture}
                            alt="Profile"
                            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                        />
                        <p>{request.sender.username}</p>
                        <button
                            onClick={() => handleResponse(request._id, "accepted")}
                            className="btn btn-success"
                            disabled={isLoading}
                        >
                            Accept
                        </button>
                        <button
                            onClick={() => handleResponse(request._id, "rejected")}
                            className="btn btn-danger"
                            disabled={isLoading}
                        >
                            Reject
                        </button>
                    </div>
                ))
            ) : (
                <p>No new friend requests.</p>
            )}
        </div>
    );
}

export default Notifications;