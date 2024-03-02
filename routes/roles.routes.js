const mongoose = require('mongoose');
const router = require('express').Router();
const User = require('../models/User.model');
const Jobs = require('../models/Jobs.model');
const Roles = require('../models/Roles.model');

router.post('/roles', async (req, res, next) => {
  const { roleName, userId, boardId, listId, jobId } = req.body;
  try {
    const newRole = await Roles.create({
      roleName,
      userId,
      boardId,
      listId,
      jobId,
    });

    const job = await Jobs.find({ _id: { $in: jobId } });
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    newRole.jobs.push(...job.map(job => job._id));
    await newRole.save();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndUpdate(userId, {
      $push: { roles: newRole },
    });

    await Jobs.findByIdAndUpdate(jobId, {
      $push: { roles: newRole },
    });

    console.log('New Role', newRole);
    console.log('Updated User', user);

    res.status(201).json(newRole);
  } catch (error) {
    console.log('An error occurred creating the role', error);
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
    const role = await Roles.findById(roleId);

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
  const { roleName, userId, boardId, listId, jobId } = req.body;

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
        listId,
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
