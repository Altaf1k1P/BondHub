import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { sendFriendRequest } from "../store/userSlice.js";

function SendFriendRequestButton({ senderId, receiverId }) {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const handleSendRequest = async () => {
        setIsLoading(true);
        try {
            console.log({ senderId, receiverId }); // Debugging
            await dispatch(sendFriendRequest({ senderId, receiverId }));
        } catch (error) {
            console.error("Error sending friend request:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button 
            onClick={handleSendRequest} 
            className="btn btn-primary"
            disabled={isLoading}  // Disable button while loading
        >
            {isLoading ? "Sending..." : "Send Friend Request"}
        </button>
    );
}

export default SendFriendRequestButton;
