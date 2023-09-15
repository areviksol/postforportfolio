import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'comments' },
});

const Like = mongoose.model('Like', likeSchema);
export default Like;
