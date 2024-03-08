const { Schema, model } = require('mongoose');

const boardSchema = new Schema({
  boardName: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'Users' },
  lists: [{ type: Schema.Types.ObjectId, ref: 'Lists' }],
  jobs: [{ type: Schema.Types.ObjectId, ref: 'Jobs' }],
  roles: [{ type: Schema.Types.ObjectId, ref: 'Roles' }],
});

module.exports = model('Boards', boardSchema);
