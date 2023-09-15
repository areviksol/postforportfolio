import express from 'express'
import * as postController from '../controllers/post.js'

const router = express.Router();

router.post('/', postController.createPost); 

router.get('/', postController.getPosts); 

router.get('/:_id', postController.getPostById); 

router.put('/:_id', postController.updatePost);

router.delete('/:_id', postController.deletePost);

router.get('/:_id/comments', postController.getCommentsByPostId); 

router.put('/:postId/comments/:commentId', postController.updateComment)

router.post('/:postId/comments', postController.createComment)

router.delete('/:postId/comments/:commentId', postController.deleteComment)
router.post('/rate-comment', postController.rateComment)

export default router;
 