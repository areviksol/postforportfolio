import mongoose from 'mongoose';
import Post from '../models/Post.js';
import executeMongoOperation from '../util.js';
import Comment from '../models/Comment.js';
import sharp from 'sharp'
import imageType from 'image-type'
import path from 'path'
function getFileExtension(filename) {
  return path.extname(filename).toLowerCase();
}
export const createPost = async (req, res) => {
    try {
    const { title, body } = req.body;
    const image = req.file;
    let imageBuffer = null;
    let resizedImage;
    if (image) {
      imageBuffer = image.buffer;
      resizedImage = await sharp(image.buffer)
      .resize({ width: 800 }) 
      .jpeg({ quality: 90 })
      .toBuffer();
    }  

    const newPost = new Post({
      title,
      body,
      image: resizedImage,
    });

    await newPost.save();
    console.log("new post is ", newPost);
    res.status(201).json(newPost);
    console.log('New post created successfully.');
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(400).json({ error: error.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query._page);
    const limit = parseInt(req.query._limit) || 10;

    const startIndex = (page - 1) * limit;

    const operation = Post.find()
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const result = await executeMongoOperation(operation);

    if (result && result.error) {
      return res.status(500).json({ error: result.message });
    }
    console.log("result is ", result)
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getPostById = async (req, res) => {
  try {
    const postId = req.params._id;
    const operation = Post.findById(postId);
    const result = await executeMongoOperation(operation);
    if (result.error) {
      console.log(5, 'Post not found');
      return res.status(500).json({ error: result.message });
    }
    if (!result) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { title, body } = req.body;
    const postId = req.params._id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { title, body },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const deletePost = async (req, res) => {
  try {
    console.log("id is", req.params._id)
    const operation = Post.findByIdAndRemove(req.params._id);
    const result = await executeMongoOperation(operation);
    if (result.error) {
      console.log('result is ', result)
      return res.status(500).json({ error: result.message });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCommentsByPostId = async (req, res) => {
  try {
    const { message, parentId } = req.body;
    const postId = req.params._id;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const comment = new Comment({
      message,
      parentId,
      postId,
    });

    await comment.save();

    await Post.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });

    return res.status(201).json({
      _id: comment._id,
      message: comment.message,
      userId: comment.userId,
      parentId: comment.parentId,
      postId: comment.postId,
      likeCount: 0,
      likedByMe: false,
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateComment = async (req, res) => {
  const { body, params } = req;

  if (!body.message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  const postId = req.params.postId;
  const commentId = params.commentId;

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    comment.message = body.message;

    await comment.save();
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const updatedComments = post.comments.map((c) => {
      if (c._id.toString() === commentId) {
        return comment;
      }
      return c;
    });

    post.comments = updatedComments;

    await post.save();

    res.status(200).json({
      message: comment.message,
      updatedComment: comment,
      updatedComments: updatedComments,
    });
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createComment = async (req, res) => {
  try {
    const { message, parentId } = req.body;
    const postId = req.params.postId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const comment = new Comment({
      message,
      parentId,
      postId,
    });

    await comment.save();
    post.comments.push(comment);

    post.commentCount += 1;

    await post.save();

    res.status(201).json({
      _id: comment._id,
      message: comment.message,
      parentId: comment.parentId,
      postId: comment.postId,
      likeCount: 0,
      likedByMe: false,
      createdAt: comment.createdAt,
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const deleteComment = async (req, res) => {
  const postId = req.params.postId;
  const commentId = req.params.commentId;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'comment not found' });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    async function deleteCommentRecursively(commentId) {
      const childComments = await Comment.find({ parentId: commentId });
      for (const childComment of childComments) {
        await deleteCommentRecursively(childComment._id);
        await childComment.deleteOne();
      }
    }
    await deleteCommentRecursively(commentId);


    post.comments = post.comments.filter(
      (c) => {
        if (c._id.toString() !== commentId) {
          return c;
        }
      })
    post.commentCount -= 1;

    await post.save();
    await comment.deleteOne();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
export const rateComment = async (req, res) => {
  try {
    const { commentId, rating } = req.body;
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    comment.rating = rating;
    await comment.save();

    const post = await Post.findById(comment.postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const comments = await Comment.find({ post: post._id });
    const totalRatings = comments.reduce((sum, comment) => sum + comment.rating, 0);
    const newRank = totalRatings / comments.length;

    post.rank = newRank;
    await post.save();
    console.log("REER");
    res.status(200).json({ message: 'Rating saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error saving rating' });
  }
};

