const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    name: { type: String, required: [true, 'Name is required.'] },
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
