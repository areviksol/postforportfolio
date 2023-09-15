import mongoose from "mongoose";
import Like from "./Like.js";

export const commentSchema = new mongoose.Schema({
    message: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'post' },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'comments', default: null },
    likes: [Like.schema], 
    rating: Number
});

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
