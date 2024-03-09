const { Schema, model } = require('mongoose');

const boardSchema = new Schema({
  boardName: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'Users' },
  lists: [{ type: Schema.Types.ObjectId, ref: 'Lists' }],
  jobs: [{ type: Schema.Types.ObjectId, ref: 'Jobs' }],
});

module.exports = model('Boards', boardSchema);
