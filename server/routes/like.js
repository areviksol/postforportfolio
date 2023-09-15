import express from 'express'
import * as likeController from '../controllers/like.js'

const router = express.Router();

router.post('/', likeController.createLike);

router.get('/', likeController.getLikes);

router.get('/:id', likeController.getLikeById);

router.put('/:id', likeController.updateLike);

router.delete('/:id', likeController.deleteLike);

export default router;
