import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchUsers, sendFriendRequest } from "../../store/userSlice.js";

function Search() {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const { isLoading, error, recommendations, user } = useSelector((state) => state.users);


    const defaultProfilePicture = "/defaultAvtar.webp";
    // Trigger search as the user types with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (query.trim() !== "") {
                dispatch(searchUsers(query));
            }
        }, 500); // Debounce delay: 500ms

        return () => clearTimeout(timeoutId); // Cleanup timeout
    }, [query, dispatch]);

    const handleSendFriendRequest = (receiverId) => {
        if (user && user.userId) {
            dispatch(sendFriendRequest({ senderId: user._id, receiverId }));
        }
    };

    return (
        <div className="search-container">
            <input
                type="text"
                placeholder="Search users..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-input"
            />
            {isLoading && <p className="loading-message">Searching...</p>}
            {error && <p className="error-message">Error: {error}</p>}
            <div className="search-results">
                {query.trim() && recommendations.length > 0 ? (
                    <ul>
                        {recommendations.map((user) => (
                            <li key={user?.userId} className="search-result-item">
                                 <img 
                            src={user.profilePicture || defaultProfilePicture} 
                            alt="Profile" 
                            style={{ width: "50px", height: "50px", borderRadius: "50%" }} 
                        />
                                <div>
                                    <p className="username">{user.username}</p>
                                    <p className="email">{user.email}</p>
                                    <button
                                        onClick={() => handleSendFriendRequest(user?.userId)}
                                        className="btn btn-primary"
                                    >
                                        Send Friend Request
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : query.trim() && !isLoading && <p>No users found.</p>}
            </div>
        </div>
    );
}

export default Search;