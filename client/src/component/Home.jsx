import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecommendations } from "../store/userSlice";

function Home() {
    const dispatch = useDispatch();
    const { user,recommendations, isLoading } = useSelector((state) => state.users);


    const defaultProfilePicture = "/defaultAvtar.webp";
    useEffect(() => {
        dispatch(fetchRecommendations(user._id));
    }, [dispatch]);

    return (
        <div>
            <h2>Mutual Friends</h2>
            {isLoading ? (
                <p>Loading...</p>
            ) : recommendations.length > 0 ? (
                recommendations.map((user) => (
                    <div key={user._id}>
                        <img 
                            src={user.profilePicture || defaultProfilePicture} 
                            alt="Profile" 
                            style={{ width: "50px", height: "50px", borderRadius: "50%" }} 
                        />
                        <p>{user.username}</p>
                        <button>Send Friend Request</button>
                    </div>
                ))
            ) : (
                <p>No mutual friends yet.</p>
            )}
        </div>
    );
}

export default Home;
