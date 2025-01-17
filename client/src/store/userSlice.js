import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../helper/axiosInstance.js";

// Initial 
const initialState = {
    user: null,
    isAuthenticated: false,
    friends: [],
    friendRequests: [],
    recommendations: [],
    isLoading: false,
    error: null,
};

// Thunks

// User Registration
export const registerUser = createAsyncThunk(
    "user/register",
    async (userData, thunkAPI) => {
        try {
            const response = await axiosInstance.post("/auth/signup", userData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
);

// User Login
export const loginUser = createAsyncThunk(
    "user/login",
    async (credentials, thunkAPI) => {
        try {
            const response = await axiosInstance.post("/auth/login", credentials, { withCredentials: true });
            localStorage.setItem("accessToken", response.data.tokens.accessToken);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
);

// Search Users
export const searchUsers = createAsyncThunk(
    'search/searchUsers',
    async (query, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/search-users', {
                params: { query },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error || 'Failed to search users'
            );
        }
    }
);

// Fetch Current User
export const fetchCurrentUser = createAsyncThunk(
    "user/fetchCurrentUser",
    async (_, thunkAPI) => {
        try {
            const response = await axiosInstance.get(`/auth/me`, { withCredentials: true });
            return response.data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
);

// Fetch Friend List
export const fetchFriends = createAsyncThunk(
    "user/fetchFriends",
    async (userId, thunkAPI) => {
        try {
            const response = await axiosInstance.get(`/get-friend-list/${userId}`);
            //console.log("aa",response);
            
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
);

// Send Friend Request
export const sendFriendRequest = createAsyncThunk(
    "user/sendFriendRequest",
    async ({ senderId, receiverId }, thunkAPI) => {
        try {
            const response = await axiosInstance.post('/send-friend-request', { senderId, receiverId });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
);

// Fetch Friend Requests
export const fetchFriendRequests = createAsyncThunk(
    'users/fetchFriendRequests',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/fetch-friend-requests');
           // console.log(response.data);
            
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


// Respond to Friend Request
export const respondToFriendRequest = createAsyncThunk(
    "user/respondToFriendRequest",
    async ({ requestId, status }, thunkAPI) => {
        try {
            const response = await axiosInstance.post('/respond-to-friend-request', { requestId, status });
           // console.log("friend",response.data );
            
            return { requestId, status, friend: response.data.friend };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
);

// Fetch Friend Recommendations
export const fetchRecommendations = createAsyncThunk(
    "user/fetchRecommendations",
    async (userId, thunkAPI) => {
        try {
            const response = await axiosInstance.get(`/recommend-friends/${userId}`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
);


// Send Friend Request
export const unfollow = createAsyncThunk(
    "user/unfollow",
    async ({ senderId, receiverId }, thunkAPI) => {
        try {
            const response = await axiosInstance.post('/unfollow-user', { senderId, receiverId });
            //console.log(response.data);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
);
// Slice
const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        logoutUser: (state) => {
            state.user = null;
            state.friends = [];
            state.friendRequests = [];
            state.recommendations = [];
            state.isAuthenticated = false;
        },
        clearSearch: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(registerUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(registerUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
        });
        builder.addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        builder.addCase(loginUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(loginUser.fulfilled, (state, { payload }) => {
            state.isLoading = false;
            state.isAuthenticated = true;
            state.user = payload.user;
        });
        builder.addCase(loginUser.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });

        builder.addCase(fetchCurrentUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchCurrentUser.fulfilled, (state, { payload }) => {
            state.isLoading = false;
            state.user = payload;
        });
        builder.addCase(fetchCurrentUser.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });

        builder.addCase(fetchFriends.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchFriends.fulfilled, (state, { payload }) => {
            state.isLoading = false;
            state.friends = payload.friends;
        });
        builder.addCase(fetchFriends.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });

        builder.addCase(sendFriendRequest.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(sendFriendRequest.fulfilled, (state, { payload }) => {
            state.isLoading = false;
            state.friendRequests.push(payload.friendRequest);
        });
        builder.addCase(sendFriendRequest.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });

        builder.addCase(fetchFriendRequests.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchFriendRequests.fulfilled, (state, { payload }) => {
            state.isLoading = false;
            state.friendRequests = payload;
        });
        builder.addCase(fetchFriendRequests.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });

        builder.addCase(fetchRecommendations.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchRecommendations.fulfilled, (state, { payload }) => {
            state.isLoading = false;
            state.recommendations = payload;
        });
        builder.addCase(fetchRecommendations.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });

        builder.addCase(searchUsers.pending, (state) => {
            state.isLoading = true;
            state.error = null;
            state.recommendations = [];
        });
        builder.addCase(searchUsers.fulfilled, (state, { payload }) => {
            state.isLoading = false;
            state.recommendations = payload;
        });
        builder.addCase(searchUsers.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });

        builder.addCase(respondToFriendRequest.fulfilled, (state, { payload }) => {
            state.isLoading = false;
            state.friendRequests = state.friendRequests.filter(request => request._id !== payload.requestId);
            if (payload.status === 'accepted') {
                state.friends.push(payload.friend);
            }
        });
        
        builder.addCase(unfollow.pending, (state, { meta }) => {
            const receiverId = meta.arg.receiverId;
        
            // Optimistically remove the friend from the list
            state.friends = state.friends.filter((friend) => friend.userId !== receiverId);
        
            // Optionally set a specific loading state for unfollow
            state.isLoading = true;
            state.error = null;
        });
        
        builder.addCase(unfollow.fulfilled, (state, { payload }) => {
            // Finalize removal of the friend from the list
            state.isLoading = false;
            state.error = null;
        
            // Ensure the payload confirms the action (e.g., successful server update)
            if (payload?.success) {
                console.log(`Successfully unfollowed user with ID: ${payload.receiverId}`);
            }
        });
        
        builder.addCase(unfollow.rejected, (state, { meta, payload }) => {
            const receiverId = meta.arg.receiverId;
        
            // Rollback: Restore the friend to the list if the unfollow fails
            state.friends.push({ userId: receiverId });
        
            state.isLoading = false;
            state.error = payload || "Failed to unfollow the user. Please try again.";
        });
        
        
    },
});

export const { logoutUser, clearSearch } = userSlice.actions;

export default userSlice.reducer;