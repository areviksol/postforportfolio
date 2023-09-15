import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import executeMongoOperation from '../util.js';

export const createComment = async (req, res) => {
    try {
      const newComment = new Comment(req.body);
      const postId = req.body._id;
      const operation = newComment.save();
  
      const result = await executeMongoOperation(operation);
  
      if (result.error) {
        return res.status(500).json({ error: result.message });
      }
  
      await Post.findByIdAndUpdate(postId, { $push: { comments: newComment } });
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

export const getComments = async (req, res) => {
    try {
      const operation = Comment.find();
  
      const result = await executeMongoOperation(operation);
  
      if (result.error) {
        return res.status(500).json({ error: result.message });
      }
  
      res.status(200).json(result);
    } catch (error) {
      console.error('Controller Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

export const getCommentById = async (req, res) => {
    try {
      const operation = Comment.findById(req.params.id);
  
      const result = await executeMongoOperation(operation);
  
      if (result.error) {
        return res.status(500).json({ error: result.message });
      }
  
      if (!result.data) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      await Post.findByIdAndUpdate(postId, { $push: { comments: newComment } });
      res.status(200).json(result.data);
    } catch (error) {
      console.error('Controller Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
    

export const updateComment = async (req, res) => {
    try {
      const operation = Comment.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
  
      const result = await executeMongoOperation(operation);
  
      if (result.error) {
        return res.status(500).json({ error: result.message });
      }
  
      if (!result.data) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      await Post.findByIdAndUpdate(postId, { $push: { comments: newComment } });
      res.status(200).json(result.data);
    } catch (error) {
      console.error('Controller Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

export const deleteComment = async (req, res) => {
    try {
      const operation = Comment.findByIdAndRemove(req.params.id);
  
      const result = await executeMongoOperation(operation);
  
      if (result.error) {
        return res.status(500).json({ error: result.message });
      }
  
      if (!result.data) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      await Post.findByIdAndUpdate(postId, { $push: { comments: newComment } });
      res.status(204).send();
    } catch (error) {
      console.error('Controller Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };  

