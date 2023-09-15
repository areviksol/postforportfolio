import Like from '../models/Like.js';
import executeMongoOperation from '../util.js';

export const createLike = async (req, res) => {
  try {
    const newLike = new Like(req.body);
    await newLike.save();
    res.status(201).json(newLike);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getLikes = async (req, res) => {
  try {
    const operation = Like.find();
    const result = await executeMongoOperation(operation);

    if (result.error) {
      return res.status(500).json({ error: result.message });
    }

    res.status(200).json(result.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLikeById = async (req, res) => {
  try {
    const operation = Like.findById(req.params.id);
    const result = await executeMongoOperation(operation);

    if (result.error) {
      return res.status(500).json({ error: result.message });
    }

    if (!result.data) {
      return res.status(404).json({ message: 'Like not found' });
    }

    res.status(200).json(result.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateLike = async (req, res) => {
  try {
    const operation = Like.findByIdAndUpdate(req.params.id, req.body, { new: true });
    const result = await executeMongoOperation(operation);

    if (result.error) {
      return res.status(500).json({ error: result.message });
    }

    if (!result.data) {
      return res.status(404).json({ message: 'Like not found' });
    }

    res.status(200).json(result.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteLike = async (req, res) => {
  try {
    const operation = Like.findByIdAndRemove(req.params.id);
    const result = await executeMongoOperation(operation);

    if (result.error) {
      return res.status(500).json({ error: result.message });
    }

    if (!result.data) {
      return res.status(404).json({ message: 'Like not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
