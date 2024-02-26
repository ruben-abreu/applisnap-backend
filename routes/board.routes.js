const mongoose = require('mongoose');
const router = require('express').Router();
const User = require('../models/User.model');
const Boards = require('../models/Boards.model');

// POST
router.post('/boards', async (req, res, next) => {
  const { boardName, userId } = req.body;
  try {
    const newBoard = await Boards.create({
      boardName,
      userId,
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

/* 
// GET

router.get('/jobs', async (req, res, next) => {
  try {
    const allJobs = await Job.find({});
    console.log('All Jobs', allJobs);
    res.status(200).json(allJobs);
  } catch (error) {
    console.log('Error retrieving all jobs', error);
    next(error);
  }
});

// GET by ID

router.get('/jobs/:jobId', async (req, res, next) => {
  const { jobId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: 'Id is not valid' });
    }
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: 'No job found' });
    }
    res.json(job);
  } catch (error) {
    console.log('An error ocurred getting the job', error);
    next(error);
  }
});

// PUT

router.put('/jobs/:jobId', async (req, res, next) => {
  const { jobId } = req.params;
  const {
    companyName,
    logoURL,
    jobURL,
    jobDescription,
    workModel,
    workLocation,
    notes,
    customLabel,
    date,
    starred,
    userId,
    boardId,
    listId,
    roleId,
  } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: 'Id is not valid' });
    }
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      {
        companyName,
        logoURL,
        jobURL,
        jobDescription,
        workModel,
        workLocation,
        notes,
        customLabel,
        date,
        starred,
        userId,
        boardId,
        listId,
        roleId,
      },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found!' });
    }
    res.json(updatedJob);
  } catch (error) {
    console.log('An error occurred updating the job', error);
    next(error);
  }
});

// Delete

router.delete('/jobs/:jobId', async (req, res, next) => {
  const { jobId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: 'Id is not valid' });
    }
    await Project.findByIdAndDelete(jobId);
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.log('An error occurred deleting the job', error);
    next(error);
  }
}); */

module.exports = router;
