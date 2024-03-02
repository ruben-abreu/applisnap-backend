const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    firstName: { type: String, required: [true, 'First name is required.'] },
    lastName: { type: String, required: [true, 'Last name is required.'] },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
    },
    imgURL: { type: String, default: '' },
    imgPublicId: { type: String, default: '' },
    boards: [{ type: Schema.Types.ObjectId, ref: 'Boards' }],
    lists: [{ type: Schema.Types.ObjectId, ref: 'Lists' }],
    jobs: [{ type: Schema.Types.ObjectId, ref: 'Jobs' }],
    roles: [{ type: Schema.Types.ObjectId, ref: 'Roles' }],
  },
  {
    timestamps: true,
  }
);

const User = model('User', userSchema);

module.exports = User;
