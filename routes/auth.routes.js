const router = require('express').Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const Roles = require('../models/Roles.model.js');
const Lists = require('../models/Lists.model.js');
const Jobs = require('../models/Jobs.model.js');
const Boards = require('../models/Boards.model.js');
const { isAuthenticated } = require('../middleware/jwt.middleware');
const {
  fileUploader,
  cloudinaryConfig,
} = require('../config/cloudinary.config');
const nodemailer = require('nodemailer');

const saltRounds = 10;

router.post('/signup', async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    if (
      firstName === '' ||
      lastName === '' ||
      email === '' ||
      password === ''
    ) {
      return res.status(400).json({ message: 'All fields are mandatory' });
    }

    const emailRegex = /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Provide valid email address' });
    }

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          'Password must have at least 8 characters, must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number.',
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res
        .status(400)
        .json({ message: 'The provided email is already registered' });
    }

    const salt = bcrypt.genSaltSync(saltRounds);

    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    res.json({
      _id: newUser._id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      imgURL: newUser.imgURL,
      imgPublicId: newUser.imgPublicId,
      boards: newUser.boards,
      lists: newUser.lists,
      jobs: newUser.jobs,
      roles: newUser.roles,
    });
  } catch (error) {
    console.log('Error creating the user', error);
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (email === '' || password === '') {
      return res.status(400).json({ message: 'All fields are mandatory' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ message: 'Provided email is not registered' });
    }

    const isPasswordCorrect = bcrypt.compareSync(password, user.password);

    if (isPasswordCorrect) {
      const payload = {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        imgURL: user.imgURL,
        imgPublicId: user.imgPublicId,
        boards: user.boards,
        lists: user.lists,
        jobs: user.jobs,
        roles: user.roles,
      };

      const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
        algorithm: 'HS256',
        expiresIn: '6h',
      });

      res.status(200).json({
        authToken,
        userId: payload._id,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        imgURL: payload.imgURL,
        imgPublicId: payload.imgPublicId,
        boards: payload.boards,
        lists: payload.lists,
        jobs: payload.jobs,
        roles: payload.roles,
      });
    } else {
      return res.status(401).json({
        message: 'Unable to authenticate user, password is not correct.',
      });
    }
  } catch (error) {
    console.log('An error occurred login in the user', error);
    next(error);
  }
});

router.get('/verify', isAuthenticated, (req, res, next) => {
  try {
    console.log('req.payload', req.payload);
    res.json(req.payload);
  } catch (error) {
    next(error);
  }
});

router.get('/users/:userId', async (req, res, next) => {
  const { userId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Id is not valid' });
    }

    const user = await User.findById(userId)
      .populate('boards')
      .populate('lists')
      .populate('jobs')
      .populate('roles');

    if (!user) {
      return res.status(404).json({ message: 'No user was found' });
    }

    const {
      _id,
      firstName,
      lastName,
      email,
      imgURL,
      imgPublicId,
      boards,
      lists,
      jobs,
      roles,
    } = user;

    const responseData = {
      _id,
      firstName,
      lastName,
      email,
      imgURL,
      imgPublicId,
      boards,
      lists,
      jobs,
      roles,
    };

    res.json(responseData);
  } catch (error) {
    console.log('Error fetching user', error);
    next(error);
  }
});

router.put('/users/:userId', async (req, res, next) => {
  const { password } = req.body;
  const { userId } = req.params;
  console.log(`password on the server: ${password}`);

  try {
    if (password) {
      const passwordRegex =
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          message:
            'Password must have at least 8 characters, must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number.',
        });
      }

      const salt = bcrypt.genSaltSync(saltRounds);

      const hashedPassword = bcrypt.hashSync(password, salt);

      const updatedPassword = await User.findByIdAndUpdate(
        userId,
        {
          password: hashedPassword,
        },
        { new: true }
      );

      const {
        firstName,
        lastName,
        email,
        imgURL,
        imgPublicId,
        boards,
        lists,
        jobs,
        roles,
      } = updatedPassword;

      const responseData = {
        firstName,
        lastName,
        email,
        imgURL,
        imgPublicId,
        boards,
        lists,
        jobs,
        roles,
      };

      return res.json(responseData);
    }

    if (req.body.imgURL) {
      const updatedImage = await User.findByIdAndUpdate(
        userId,
        {
          imgURL: req.body.imgURL,
          imgPublicId: req.body.imgPublicId,
        },
        { new: true }
      );
      const {
        firstName,
        lastName,
        email,
        imgURL,
        imgPublicId,
        boards,
        lists,
        jobs,
        roles,
      } = updatedImage;

      const responseData = {
        firstName,
        lastName,
        email,
        imgURL,
        imgPublicId,
        boards,
        lists,
        jobs,
        roles,
      };

      res.json(responseData);
    }
  } catch (error) {
    if (password) {
      console.log('Error changing password', error);
    }
    if (req.body.imgURL) {
      console.log('Error uploading image', error);
    }
    next(error);
  }
});

router.put('/forgot-password', async (req, res, next) => {
  if (process.env.GOOGLE_APP_EMAIL && process.env.GOOGLE_APP_PW) {
    const email = req.body.email;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ error: 'User with this email does not exist' });
      }

      const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
        expiresIn: '30m',
      });

      let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.GOOGLE_APP_EMAIL,
          pass: process.env.GOOGLE_APP_PW,
        },
      });

      const data = {
        from: {
          name: 'AppliSnap',
          address: process.env.GOOGLE_APP_EMAIL,
        },
        to: email,
        subject: 'Reset Account Password Link',
        html: `
        <h3>Please click the link below to reset your password</h3>
        <p>${process.env.CLIENT_URL}/reset-password/${token}</p>
        `,
      };

      await user.updateOne({ resetLink: token });

      await transporter.sendMail(data);

      return res.status(200).json({
        message:
          'Please check your email inbox and spam, you will receive a reset link in the next few minutes',
      });
    } catch (error) {
      next(error);
      return res.status(400).json({ error: 'Reset password link error' });
    }
  } else {
    return res.status(400).json({
      error:
        'You have not set up an account to send an email or a reset password key for jwt',
    });
  }
});

router.put('/reset-password', async (req, res, next) => {
  const { token, password } = req.body;
  console.log('Received Token:', token);
  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await User.findOne({ resetLink: token });

    if (!user || !decodedToken) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          'Password must have at least 8 characters, must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number.',
      });
    }

    const salt = bcrypt.genSaltSync(saltRounds);

    const hashedPassword = bcrypt.hashSync(password, salt);

    user.password = hashedPassword;
    user.resetLink = undefined;
    await user.save();

    return res.status(200).json({ message: 'Your password has been changed' });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'Reset Password Error' });
  }
});

router.post('/upload', fileUploader.single('file'), (req, res) => {
  try {
    const imgURL = req.file && req.file.path;

    if (!imgURL) {
      throw new Error('Image upload failed');
    }

    const imgPublicId = `applisnap-profile-images/${
      imgURL.split('/').pop().split('.')[0]
    }`;

    res.status(200).json({ imgURL, imgPublicId });
  } catch (error) {
    console.log('Error uploading the image', error);
    res.status(500).json({ message: 'An error occurred uploading the image' });
  }
});

router.delete('/deleteImage', async (req, res, next) => {
  const { imgPublicId } = req.body;

  try {
    await cloudinaryConfig.destroy(imgPublicId);

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.log('Error deleting image', error);
    next(error);
  }
});

router.delete('/users/:userId', async (req, res, next) => {
  const { userId } = req.params;

  try {
    await Boards.deleteMany({ userId });
    await Lists.deleteMany({ userId });
    await Jobs.deleteMany({ userId });
    await Roles.deleteMany({ userId });

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User account deleted' });
  } catch (error) {
    console.log('Error deleting user account', error);
    next(error);
  }
});

module.exports = router;
