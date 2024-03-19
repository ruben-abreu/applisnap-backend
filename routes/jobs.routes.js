const mongoose = require('mongoose');
const router = require('express').Router();
const User = require('../models/User.model');
const Boards = require('../models/Boards.model');
const Lists = require('../models/Lists.model');
const Jobs = require('../models/Jobs.model');

router.post('/jobs', async (req, res, next) => {
  const {
    companyName,
    roleName,
    domain,
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
  } = req.body;

  try {
    console.log('Incoming userId:', userId);
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newJob = await Jobs.create({
      companyName,
      roleName,
      domain,
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
    });

    const board = await Boards.findById(boardId);
    const list = await Boards.findById(listId);

    await Boards.findByIdAndUpdate(boardId, {
      $push: { jobs: newJob },
    });

    await Lists.findByIdAndUpdate(listId, {
      $push: { jobs: newJob },
    });

    await User.findByIdAndUpdate(userId, {
      $push: { jobs: newJob },
    });

    console.log('New Job:', newJob);
    console.log('Updated User:', user);
    console.log('Updated Board:', board);
    console.log('Updated List:', list);

    res.status(201).json(newJob);
  } catch (error) {
    console.log('An error occurred:', error);
    next(error);
  }
});

router.get('/jobs', async (req, res, next) => {
  const { userId } = req.body;

  try {
    const allJobs = await Jobs.find({ userId: userId });
    console.log('All Jobs', allJobs);
    res.status(200).json(allJobs);
  } catch (error) {
    console.log('Error retrieving all jobs', error);
    next(error);
  }
});

router.get('/jobs/:jobId', async (req, res, next) => {
  const { jobId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: 'Id is not valid' });
    }
    const job = await Jobs.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: 'No job found' });
    }
    res.json(job);
  } catch (error) {
    console.log('An error ocurred getting the job', error);
    next(error);
  }
});

router.put('/jobs/:jobId', async (req, res, next) => {
  const { jobId } = req.params;
  const {
    companyName,
    roleName,
    domain,
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
  } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: 'Id is not valid' });
    }

    const job = await Jobs.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found!' });
    }
    const prevListId = job.listId;
    const prevBoardId = job.boardId;

    const updatedJob = await Jobs.findByIdAndUpdate(
      jobId,
      {
        companyName,
        roleName,
        domain,
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
      },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found!' });
    }

    if (listId !== prevListId) {
      await Lists.updateOne({ _id: prevListId }, { $pull: { jobs: jobId } });

      await Lists.updateOne({ _id: listId }, { $addToSet: { jobs: jobId } });
    }

    if (boardId !== prevBoardId) {
      await Boards.updateOne({ _id: prevBoardId }, { $pull: { jobs: jobId } });

      await Boards.updateOne({ _id: boardId }, { $addToSet: { jobs: jobId } });
    }

    res.json(updatedJob);
  } catch (error) {
    console.log('An error occurred updating the job', error);
    next(error);
  }
});

router.delete('/jobs/:jobId', async (req, res, next) => {
  const { jobId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: 'Id is not valid' });
    }

    await Jobs.findByIdAndDelete(jobId);

    await User.updateMany({}, { $pull: { jobs: jobId } });

    await Lists.updateMany({}, { $pull: { jobs: jobId } });

    await Boards.updateMany({}, { $pull: { jobs: jobId } });

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.log('An error occurred deleting the job', error);
    next(error);
  }
});

module.exports = router;
