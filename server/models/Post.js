import mongoose from "mongoose";
import { commentSchema } from "./Comment.js";

const postSchema = new mongoose.Schema({
  title: String,
  body: String,
  comments: [commentSchema],
  rank: Number,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
});

const Post = mongoose.model('Post', postSchema);

export default Post;
