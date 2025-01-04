import mongoose,{Schema} from "mongoose";

const friendListSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now },
});

export const FriendList = mongoose.model("FriendList", friendListSchema);
