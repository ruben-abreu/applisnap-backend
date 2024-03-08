const mongoose = require('mongoose');
const router = require('express').Router();
const User = require('../models/User.model');
const Boards = require('../models/Boards.model');
const Lists = require('../models/Lists.model');

router.post('/lists', async (req, res, next) => {
  const { listName, userId, boardId } = req.body;
  try {
    const newList = await Lists.create({
      listName,
      userId,
      boardId,
    });

    const listNameOptions = [
      'Wishlist',
      'Applied',
      'Interviews',
      'Offers',
      'Rejected',
    ];

    if (!listNameOptions.includes(listName)) {
      return res.status(404).json({ message: 'Invalid list name' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const board = await Boards.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    await User.findByIdAndUpdate(userId, {
      $push: { lists: newList._id },
    });

    await Boards.findByIdAndUpdate(boardId, {
      $push: { lists: newList._id },
    });

    console.log('New List', newList);
    console.log('Updated User', user);
    console.log('Updated Board', board);

    res.status(201).json(newList);
  } catch (error) {
    console.log('An error occurred creating the list', error);
    next(error);
  }
});

router.get('/lists', async (req, res, next) => {
  try {
    const allLists = await Lists.find({}).populate('jobs').populate('roles');
    console.log('All Lists', allLists);
    res.status(200).json(allLists);
  } catch (error) {
    console.log('Error retrieving all lists', error);
    next(error);
  }
});

router.get('/lists/:listId', async (req, res, next) => {
  const { listId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(listId)) {
      return res.status(400).json({ message: 'Id is not valid' });
    }
    const list = await Lists.findById(listId)
      .populate('jobs')
      .populate('roles');

    if (!list) {
      return res.status(404).json({ message: 'No list found' });
    }
    res.json(list);
  } catch (error) {
    console.log('An error occurred getting the list', error);
    next(error);
  }
});

router.put('/lists/:listId', async (req, res, next) => {
  const { listId } = req.params;
  const { listName, userId, boardId } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(listId)) {
      return res.status(400).json({ message: 'Id is not valid' });
    }

    const updatedList = await Lists.findByIdAndUpdate(
      listId,
      { listName, userId, boardId },
      { new: true }
    );

    if (!updatedList) {
      return res.status(404).json({ message: 'List not found' });
    }

    res.status(200).json(updatedList);
  } catch (error) {
    console.error('An error occurred updating the list', error);
    next(error);
  }
});

module.exports = router;
