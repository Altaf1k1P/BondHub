import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { FriendRequest } from "../models/friendRequest.model.js";
import { FriendList } from "../models/friendList.model.js";
import jwt from "jsonwebtoken";

// Generate access and refresh tokens
const genrateAccessAndRefreshToken = async (userId) => {
    try {
        // Ensure the user exists
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // Generate tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Save the refresh token to the user document
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Error generating tokens: " + error.message);
    }
};

//user search
const searchUsers = async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: "Query parameter is required" });
    }

    try {
        const users = await User.find({
            $or: [
                { username: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } },
            ],
        }).select("username email profilePicture");

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Server error: " + error.message });
    }
};

// User registration
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate input fields
        if (!username || !email || !password) {
            return res.status(400).json({ error: "Please provide all required fields" });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Create new user
        const user = await User.create({ username, email, password });
        res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        //console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
};

const login = async (req, res) => {
    const { identifier, password } = req.body;
  
    if (!identifier || !password) {
      return res.status(400).json({ error: "Please provide email/username and password" });
    }
  
    try {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
      const user = await User.findOne(isEmail ? { email: identifier } : { username: identifier });
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const isPasswordCorrect = await user.isPasswordCorrect(password);
      if (!isPasswordCorrect) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
  
      const accessToken = await user.generateAccessToken();
      const refreshToken = await user.generateRefreshToken();
      const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    };
      res.status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: "Login successful",
        user: {
          userId: user._id,
          username: user.username,
          email: user.email,
          profilePicture: user.profilePicture,
        },
        tokens: { accessToken, refreshToken },
      });
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ error: "Server error. Please try again later." });
    }
  };
  
  

// User logout
const logout = async (req, res) => {
    try {
        // Clear refresh token from user
        await User.findByIdAndUpdate(req.user._id, { refreshToken: "" }, { new: true });

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        };

        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json({ message: "User logged out" });
    } catch (error) {
        //console.error(error);
        res.status(500).json({ error: "Something went wrong while logging out" });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        return res
  .status(200)
  .json({"data":req.user})
    } catch (error) {
        //console.error(error);
        res.status(500).json({ error: "Something went wrong while get current user" });
    }
}

// Refresh access token
const refreshAccessToken = async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized: No refresh token provided");
    }

    try {
        // Verify refresh token
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        
        const user = await User.findById(decodedToken._id);
        if (!user) {
           // console.error(`User not found for id: ${decodedToken._id}`);
            throw new ApiError(401, "Invalid refresh token: User not found");
        }

        if (incomingRefreshToken !== user.refreshToken) {
            //console.error(`Refresh token mismatch for user: ${user._id}`);
            throw new ApiError(403, "Refresh token is invalid or expired");
        }

        // Generate new access and refresh tokens
        const { accessToken, refreshToken: newRefreshToken } = await genrateAccessAndRefreshToken(user._id);

        // Update user's refresh token in the database
        user.refreshToken = newRefreshToken;
        await user.save({ validateBeforeSave: false });

        // Set cookies and return response
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        };

        res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(new ApiResponse(
                200,
                { accessToken, refreshToken: newRefreshToken },
                "Access token refreshed successfully"
            ));

    } catch (error) {
        //console.error("Error in refreshAccessToken:", error);
        if (error instanceof jwt.JsonWebTokenError) {
            throw new ApiError(401, "Invalid refresh token: " + error.message);
        }
        throw new ApiError(500, error.message || "Error refreshing access token");
    }
};
// Send Friend Request
const sendFriendRequest = async (req, res) => {
    const { senderId, receiverId } = req.body;

    if (senderId === receiverId) {
        return res.status(400).json({ error: "You cannot send a friend request to yourself" });
    }

    try {
        // Check if both sender and receiver exist
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (!sender || !receiver) {
            return res.status(404).json({ error: "User not found" });
        }

        const existingRequest = await FriendRequest.findOne({ sender: senderId, receiver: receiverId });

        if (existingRequest) {
            return res.status(400).json({ error: "Friend request already sent" });
        }

        const friendRequest = await FriendRequest.create({ sender: senderId, receiver: receiverId });
        res.status(201).json({ message: "Friend request sent", friendRequest });
    } catch (error) {
        res.status(500).json({ error: "Server error: " + error.message });
    }
};

const fetchFriendRequest = async (req, res) => {
    const userId = req.user._id;  // Assuming the user is authenticated

    try {
        const requests = await FriendRequest.find({ receiver: userId }).populate('sender', 'username profilePicture');
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ error: "Server error: " + error.message });
    }
}



// Respond to Friend Request
const respondToFriendRequest = async (req, res) => {
    console.log(req.body);
    
    const { requestId, status } = req.body;

    // Validate the status
    if (!["accepted", "rejected"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
    }

    try {
        // Find the friend request by ID and populate sender info
        const request = await FriendRequest.findById(requestId).populate("sender", "username profilePicture email");

        if (!request) {
            return res.status(404).json({ error: "Friend request not found" });
        }

        if (status === "accepted") {
            // Add sender and receiver to each other's friends list
            await User.findByIdAndUpdate(request.sender, {
                $addToSet: { friends: request.receiver }
            });
            await User.findByIdAndUpdate(request.receiver, {
                $addToSet: { friends: request.sender }
            });

            // Optionally: Add the friends to the FriendList collection as well
            await FriendList.findOneAndUpdate(
                { user: request.sender },
                { $addToSet: { friends: request.receiver } },
                { upsert: true }
            );
            await FriendList.findOneAndUpdate(
                { user: request.receiver },
                { $addToSet: { friends: request.sender } },
                { upsert: true }
            );
        }

        if (status === "rejected") {
            // Delete the friend request when rejected
            await FriendRequest.findByIdAndDelete(requestId);
        }

        // Update the request status (accepted or rejected)
        request.status = status;
        await request.save();

        res.status(200).json({ message: `Friend request ${status}` });
    } catch (error) {
        res.status(500).json({ error: "Server error: " + error.message });
    }
};


// Get Friend List
const getFriendList = async (req, res) => {
    console.log("Fetching friend list for user:", req.params.userId);
    const { userId } = req.params;

    try {
        const friendList = await FriendList.findOne({ user: userId }).populate("friends", "username email profilePicture");
          console.log("list", friendList);
          
        if (!friendList) {
            return res.status(404).json({ error: "No friends found" });
        }

        res.status(200).json(friendList);
    } catch (error) {
        res.status(500).json({ error: "Server error: " + error.message });
    }
};

// Recommend Friends
const recommendFriends = async (req, res) => {
    const { requestId, status } = req.body; // `requestId` is the friend request ID, and `status` is 'accept' or 'reject'.

    try {
        const friendRequest = await FriendRequest.findById(requestId);

        if (!friendRequest) {
            return res.status(404).json({ error: "Friend request not found" });
        }

        if (status === 'accept') {
            // Add the sender to the receiver's friend list
            await FriendList.updateOne(
                { user: friendRequest.receiver },
                { $addToSet: { friends: friendRequest.sender } },
                { upsert: true }
            );

            // Add the receiver to the sender's friend list
            await FriendList.updateOne(
                { user: friendRequest.sender },
                { $addToSet: { friends: friendRequest.receiver } },
                { upsert: true }
            );

            // Optionally delete the friend request
            await FriendRequest.findByIdAndDelete(requestId);
            return res.status(200).json({ message: "Friend request accepted successfully" });
        } else if (status === 'reject') {
            // Delete the friend request
            await FriendRequest.findByIdAndDelete(requestId);
            return res.status(200).json({ message: "Friend request rejected successfully" });
        } else {
            return res.status(400).json({ error: "Invalid status" });
        }
    } catch (error) {
        res.status(500).json({ error: "Server error: " + error.message });
    }
};





export { register, login, logout,refreshAccessToken , getCurrentUser, recommendFriends, searchUsers, sendFriendRequest, fetchFriendRequest,respondToFriendRequest, getFriendList };
