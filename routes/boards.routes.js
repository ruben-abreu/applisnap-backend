const mongoose = require('mongoose');
const router = require('express').Router();
const User = require('../models/User.model');
const Boards = require('../models/Boards.model');
const Lists = require('../models/Lists.model');
const Jobs = require('../models/Jobs.model');

router.post('/boards', async (req, res, next) => {
  const { boardName, userId, lists, jobs } = req.body;
  try {
    const newBoard = await Boards.create({
      boardName,
      userId,
      lists,
      jobs,
    });

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndUpdate(userId, {
      $push: { boards: newBoard },
    });

    console.log('New Board', newBoard);
    console.log('Updated User', user);

    res.status(201).json(newBoard);
  } catch (error) {
    console.log('An error occurred creating the board', error);
    next(error);
  }
});

router.get('/boards', async (req, res, next) => {
  try {
    const allBoards = await Boards.find({}).populate('lists').populate('jobs');

    console.log('All Boards', allBoards);
    res.status(200).json(allBoards);
  } catch (error) {
    console.log('Error retrieving all jobs', error);
    next(error);
  }
});

router.get('/boards/:boardId', async (req, res, next) => {
  const { boardId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      return res.status(400).json({ message: 'Id is not valid' });
    }
    const board = await Boards.findById(boardId)
      .populate('lists')
      .populate('jobs');

    if (!board) {
      return res.status(404).json({ message: 'No board found' });
    }
    res.json(board);
  } catch (error) {
    console.log('An error ocurred getting the board', error);
    next(error);
  }
});

router.put('/boards/:boardId', async (req, res, next) => {
  const { boardId } = req.params;
  const { boardName, userId, lists, jobs } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      return res.status(400).json({ message: 'Id is not valid' });
    }
    const updatedBoard = await Boards.findByIdAndUpdate(
      boardId,
      {
        boardName,
        userId,
        lists,
        jobs,
      },
      { new: true }
    );

    if (!updatedBoard) {
      return res.status(404).json({ message: 'Board not found!' });
    }
    res.json(updatedBoard);
  } catch (error) {
    console.log('An error occurred updating the board', error);
    next(error);
  }
});

router.delete('/boards/:boardId', async (req, res, next) => {
  const { boardId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      return res.status(400).json({ message: 'Id is not valid' });
    }

    await Lists.deleteMany({ boardId });
    await Jobs.deleteMany({ boardId });

    await User.updateMany({}, { $pull: { boards: boardId } });

    await Boards.findByIdAndDelete(boardId);
    res.json({ message: 'Board deleted successfully' });
  } catch (error) {
    console.log('An error occurred deleting the board', error);
    next(error);
  }
});

module.exports = router;
