const { Schema, model } = require('mongoose');

const roleSchema = new Schema({
  roleName: String,
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  boardId: { type: Schema.Types.ObjectId, ref: 'Board' },
  listId: { type: Schema.Types.ObjectId, ref: 'List' },
  jobId: [{ type: Schema.Types.ObjectId, ref: 'Jobs' }],
});

module.exports = model('Job', roleSchema);
