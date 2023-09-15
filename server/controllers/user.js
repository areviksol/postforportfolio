import User, { validate } from '../models/User.js';
import executeMongoOperation from '../util.js';
import crypto from 'crypto';
import bcrypt from'bcrypt'
import Token from '../models/Token.js';
import sendEmail from '../routes/sendEmail.js'
export const createUser = async (req, res) => {
  try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		let user = await User.findOne({ email: req.body.email });
		if (user)
			return res
				.status(409)
				.send({ message: "User with given email already Exist!" });

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		user = await new User({ ...req.body, password: hashPassword }).save();

		const token = await new Token({
			userId: user._id,
			token: crypto.randomBytes(32).toString("hex"),
		}).save();
		const url = `${process.env.BASE_URL}users/${user.id}/verify/${token.token}`;
		await sendEmail(user.email, "Verify Email", url);

		res
			.status(201)
			.send({ message: "An Email sent to your account please verify" });
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: error.message });
	}
};

export const getUsers = async (req, res) => {
  try {
    const operation = User.find();
    const result = await executeMongoOperation(operation);

    if (result.error) {
      return res.status(500).json({ error: result.message });
    }

    res.status(200).json(result.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const operation = User.findById(req.params._id);
    const result = await executeMongoOperation(operation);
    if (result.error) {
      return res.status(500).json({ error: result.message });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const operation = User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    const result = await executeMongoOperation(operation);

    if (result.error) {
      return res.status(500).json({ error: result.message });
    }

    if (!result.data) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(result.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const operation = User.findByIdAndRemove(req.params.id);
    const result = await executeMongoOperation(operation);

    if (result.error) {
      return res.status(500).json({ error: result.message });
    }

    if (!result.data) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
