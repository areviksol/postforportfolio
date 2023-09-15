import express from 'express';
import * as commentController from '../controllers/comment.js';

const router = express.Router();

router.post('/', commentController.createComment);

router.get('/', commentController.getComments);

router.get('/:_id', commentController.getCommentById);

router.put('/:_id', commentController.updateComment);

router.delete('/:_id', commentController.deleteComment);


export default router;
