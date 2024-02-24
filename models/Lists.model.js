const { Schema, model } = require('mongoose');

const listSchema = new Schema({
  listName: String,
  userId: { type: Schema.Types.ObjectId, ref: 'Users' },
  boardId: { type: Schema.Types.ObjectId, ref: 'Boards' },
  jobId: [{ type: Schema.Types.ObjectId, ref: 'Jobs' }],
});

module.exports = model('Lists', listSchema);
