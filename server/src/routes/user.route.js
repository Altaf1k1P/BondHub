import { Router } from "express"
import {
    register, 
    login, 
    logout, 
    refreshAccessToken, 
    getCurrentUser, 
    recommendFriends, 
    searchUsers, 
    sendFriendRequest, 
    fetchFriendRequest,
    respondToFriendRequest, 
    getFriendList ,
    unfollowUser
} from "../controller/user.controller.js"
import {verifyJWT} from '../middleware/auth.middleware.js'

const router = Router();

// Register a new user
router.route('/auth/signup').post(register)

router.route("/auth/refresh-token").post(refreshAccessToken)

// Login user
router.route('/auth/login').post(login)

// Logout user
router.route('/logout').post(verifyJWT, logout)


router.route("/current-user").get(verifyJWT, getCurrentUser)

// Get recommended friends
router.route("/recommend-friends/:userId").get(verifyJWT, recommendFriends)

// Search users
router.route("/search-users").get(verifyJWT, searchUsers)

// POST route for sending friend requests
router.post('/send-friend-request', verifyJWT, sendFriendRequest);

// Fetch friend requests
router.route("/fetch-friend-requests").get(verifyJWT, fetchFriendRequest)

// Respond to friend request
router.route("/respond-to-friend-request").post(verifyJWT, respondToFriendRequest)

// Unfollow user
router.route("/unfollow-user").post(verifyJWT, unfollowUser)
// Get friend list
router.route("/get-friend-list/:userId").get(verifyJWT, getFriendList);



export default router;

