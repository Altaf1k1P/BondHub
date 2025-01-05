import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { sendFriendRequest, cancelFriendRequest } from "../store/userSlice.js";

function SendFriendRequestButton({ senderId, receiverId }) {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [requestSent, setRequestSent] = useState(false); // Track if the request has been sent

    const handleSendRequest = async () => {
        setIsLoading(true);
        try {
            console.log({ senderId, receiverId }); // Debugging
            await dispatch(sendFriendRequest({ senderId, receiverId }));
            setRequestSent(true); // Mark the request as sent
        } catch (error) {
            console.error("Error sending friend request:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelRequest = async () => {
        setIsLoading(true);
        try {
            console.log({ senderId, receiverId }); // Debugging
            await dispatch(cancelFriendRequest({ senderId, receiverId }));
            setRequestSent(false); // Mark the request as canceled
        } catch (error) {
            console.error("Error canceling friend request:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={requestSent ? handleCancelRequest : handleSendRequest}
            className="btn btn-primary"
            disabled={isLoading}  // Disable button while loading
        >
            {isLoading
                ? "Sending..."
                : requestSent
                ? "Cancel Send"
                : "Send Friend Request"}
        </button>
    );
}

export default SendFriendRequestButton;
