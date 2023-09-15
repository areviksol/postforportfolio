import express from 'express';
import * as userController from '../controllers/user.js';
import User from '../models/User.js';
import Token from '../models/Token.js';

const router = express.Router();

router.post('/', userController.createUser);

router.get('/', userController.getUsers);

router.get('/:_id', userController.getUserById);

router.put('/:_id', userController.updateUser);

router.delete('/:_id', userController.deleteUser);

router.get("/:id/verify/:token/", async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.params.id });
		if (!user) return res.status(400).send({ message: "Invalid link" });

		const token = await Token.findOne({
			userId: user._id,
			token: req.params.token,
		});
		console.log('token is ', req.params.token)
		if (!token) return res.status(400).send({ message: "Invalid link" });

		await User.updateOne({ _id: user._id, verified: true });
		await token.remove();

		res.status(200).send({ message: "Email verified successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});
export default router;
