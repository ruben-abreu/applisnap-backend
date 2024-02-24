/* const mongoose = require('mongoose');
const router = require('express').Router();
const Role = require('../models/Role.model');
const List = require('../models/List.model');
const User = require('../models/User.model');
const Board = require('../models/Board.model');
const Job = require('../models/Job.model');

// POST

router.post('/jobs', async (req, res, next) => {
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
    const newJob = await Job.create({
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
    });

    await List.findByIdAndUpdate(listId, {
      $push: { job: newJob },
    });

    console.log('New Job', newJob);
    return res.status(201).json(newJob);
  } catch (error) {
    console.log('An error occurred creating the job', error);
    next(error);
  }
});

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
});

module.exports = router;
 */
