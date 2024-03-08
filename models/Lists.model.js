const { Schema, model } = require('mongoose');

const listSchema = new Schema({
  listName: {
    type: String,
    required: true,
    enum: ['Wishlist', 'Applied', 'Interviews', 'Offers', 'Rejected'],
  },
  userId: { type: Schema.Types.ObjectId, ref: 'Users' },
  boardId: { type: Schema.Types.ObjectId, ref: 'Boards' },
  jobs: [{ type: Schema.Types.ObjectId, ref: 'Jobs' }],
  roles: [{ type: Schema.Types.ObjectId, ref: 'Roles' }],
});

module.exports = model('Lists', listSchema);
