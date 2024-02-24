const { Schema, model } = require('mongoose');

const boardSchema = new Schema({
  boardName: String,
  userId: { type: Schema.Types.ObjectId, ref: 'Users' },
  listId: [{ type: Schema.Types.ObjectId, ref: 'Lists' }],
});

module.exports = model('Boards', boardSchema);
