const mongoose = require('mongoose');
const router = require('express').Router();
const User = require('../models/User.model');
const Boards = require('../models/Boards.model');

const Jobs = require('../models/Jobs.model');
const Roles = require('../models/Roles.model');

router.post('/roles', async (req, res, next) => {
  const { roleName, userId, boardId, jobId } = req.body;

  try {
    const existingBoardRole = await Roles.findOne({ boardId, roleName });
    if (existingBoardRole) {
      const updatedRole = await Roles.findByIdAndUpdate(existingBoardRole._id, {
        $push: { jobs: jobId },
      })
        .populate('userId')
        .populate('boardId')
        .populate('jobs');

      res.status(201).json(updatedRole);
    } else {
      const newRole = await Roles.create({
        roleName,
        userId,
        boardId,
        jobId,
      });

      const user = await User.findByIdAndUpdate(userId, {
        $push: { roles: newRole._id },
      });

      const board = await Boards.findByIdAndUpdate(boardId, {
        $push: { roles: newRole._id },
      });

      const job = await Jobs.findByIdAndUpdate(jobId, { roleId: newRole._id });

      console.log('New Role', newRole);
      console.log('Updated User', user);
      console.log('Updated Board', board);
      console.log('Updated Job', job);

      res.status(201).json(newRole);
    }
  } catch (error) {
    console.log('An error occurred creating/updating the role', error);
    next(error);
  }
});

router.get('/roles', async (req, res, next) => {
  try {
    const allRoles = await Roles.find({});
    console.log('All Roles', allRoles);
    res.status(200).json(allRoles);
  } catch (error) {
    console.log('Error retrieving all roles', error);
    next(error);
  }
});

router.get('/roles/:roleId', async (req, res, next) => {
  const { roleId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(roleId)) {
      return res.status(400).json({ message: 'Id is not valid' });
    }
    const role = await Roles.findById(roleId)
      .populate('userId')
      .populate('boardId')
      .populate('jobs');

    if (!role) {
      return res.status(404).json({ message: 'No role found' });
    }
    res.json(role);
  } catch (error) {
    console.log('An error ocurred getting the role', error);
    next(error);
  }
});

router.put('/roles/:roleId', async (req, res, next) => {
  const { roleId } = req.params;
  const { roleName, userId, boardId, jobId } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(roleId)) {
      return res.status(400).json({ message: 'Role is not valid' });
    }

    const updatedRole = await Roles.findByIdAndUpdate(
      roleId,
      {
        roleName,
        userId,
        boardId,
        jobId,
      },
      { new: true }
    );

    const job = await Jobs.find({ _id: { $in: jobId } });
    if (!job) {
      return res.status(404).json({ message: 'Role not found' });
    }

    updatedRole.jobs.push(...job.map(job => job._id));
    await updatedRole.save();

    await Roles.findByIdAndUpdate(updatedRole, { new: true });

    if (!updatedRole) {
      return res.status(404).json({ message: 'Role not found!' });
    }
    res.json(updatedRole);
  } catch (error) {
    console.log('An error occurred updating the role', error);
    next(error);
  }
});

router.delete('/roles/:roleId', async (req, res, next) => {
  const { roleId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(roleId)) {
      return res.status(400).json({ message: 'Id is not valid' });
    }

    await Roles.findByIdAndDelete(roleId);
    res.json({ message: 'Role deleted successfully' });
  } catch (error) {
    console.log('An error occurred deleting the role', error);
    next(error);
  }
});

module.exports = router;
