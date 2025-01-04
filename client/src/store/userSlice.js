import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../helper/axiosInstance.js";



// Initial State
const initialState = {
    user: null, // Stores authenticated user data
    isAuthenticated: false, // Stores authentication status
    friends: [], // Stores user's friends list
    friendRequests: [], // Stores pending friend requests
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
            console.log("loginUser", response.data);
            localStorage.setItem("accessToken", response.data.tokens.accessToken); // Save token
            
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
);

// Fetch Current User
export const fetchCurrentUser = createAsyncThunk(
    "user/fetchCurrentUser",
    async (_, thunkAPI) => {
        try {
            const response = await axiosInstance.get(`${API_URL}/auth/me`, { withCredentials: true });
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
            const response = await axiosInstance.get(`${API_URL}/friends/${userId}`);
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
            const response = await axiosInstance.post(`${API_URL}/friends/send-friend-request`, { senderId, receiverId });
            return response.data;
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
            const response = await axiosInstance.get(`${API_URL}/friends/recommend/${userId}`);
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
    },
    extraReducers: (builder) => {
        // Registration
        builder.addCase(registerUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(registerUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isAuthenticated = true;
            console.log("status",state.isAuthenticated);
            
            state.user = action.payload.user;
        });
        builder.addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Login
        builder.addCase(loginUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(loginUser.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.isAuthenticated = true; 
            console.log(state.isAuthenticated);
            
            state.user = payload.user;// Save the user data
        });
        builder.addCase(loginUser.rejected, (state, {payload}) => {
            state.isLoading = false;
            state.error = payload;
        });

        // Fetch Current User
        builder.addCase(fetchCurrentUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchCurrentUser.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.user = payload;
        });
        builder.addCase(fetchCurrentUser.rejected, (state, {payload}) => {
            state.isLoading = false;
            state.error = payload;
        });

        // Fetch Friends
        builder.addCase(fetchFriends.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchFriends.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.friends = payload.friends;
        });
        builder.addCase(fetchFriends.rejected, (state, {payload}) => {
            state.isLoading = false;
            state.error = payload;
        });

        // Send Friend Request
        builder.addCase(sendFriendRequest.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(sendFriendRequest.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.friendRequests.push(payload.friendRequest);
        });
        builder.addCase(sendFriendRequest.rejected, (state,{payload}) => {
            state.isLoading = false;
            state.error = payload;
        });

        // Fetch Recommendations
        builder.addCase(fetchRecommendations.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchRecommendations.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.recommendations = payload;
        });
        builder.addCase(fetchRecommendations.rejected, (state, {payload}) => {
            state.isLoading = false;
            state.error = payload;
        });
    },
});

export const { logoutUser } = userSlice.actions;

export default userSlice.reducer;
