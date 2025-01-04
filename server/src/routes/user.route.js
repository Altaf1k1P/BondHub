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
    respondToFriendRequest, 
    getFriendList 
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

// Send friend request
router.route("/send-friend-request").post(verifyJWT, sendFriendRequest)

// Respond to friend request
router.route("/respond-to-friend-request").post(verifyJWT, respondToFriendRequest)

// Get friend list
router.route("/get-friend-list").get(verifyJWT, getFriendList)


export default router;

