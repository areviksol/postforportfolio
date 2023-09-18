import express from 'express'
import * as postController from '../controllers/post.js'
import multer from "multer";

const storage = multer.memoryStorage(); 
const upload = multer({ storage });
const router = express.Router();

router.post('/', upload.single('image'), postController.createPost); 

router.get('/', postController.getPosts); 

router.get('/:_id', postController.getPostById); 

router.put('/:_id', postController.updatePost);

router.delete('/:_id', postController.deletePost);

router.get('/:_id/comments', postController.getCommentsByPostId); 

router.put('/:postId/comments/:commentId', postController.updateComment)

// router.get('/:postId/image', postController.getImageByPostId);

router.post('/:postId/comments', postController.createComment)

router.delete('/:postId/comments/:commentId', postController.deleteComment)
router.post('/rate-comment', postController.rateComment)

export default router;
 