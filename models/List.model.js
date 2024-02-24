const { Schema, model } = require('mongoose');

const listSchema = new Schema({
  listName: String,
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  boardId: { type: Schema.Types.ObjectId, ref: 'Board' },
  jobId: [{ type: Schema.Types.ObjectId, ref: 'Job' }],
});

module.exports = model('List', listSchema);
