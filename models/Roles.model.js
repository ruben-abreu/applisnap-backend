const { Schema, model } = require('mongoose');

const roleSchema = new Schema({
  roleName: String,
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  boardId: { type: Schema.Types.ObjectId, ref: 'Boards' },
  listId: { type: Schema.Types.ObjectId, ref: 'Lists' },
  jobs: [{ type: Schema.Types.ObjectId, ref: 'Jobs' }],
});

module.exports = model('Roles', roleSchema);
