const { Schema, model } = require('mongoose');

const boardSchema = new Schema({
  boardName: String,
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  listId: [{ type: Schema.Types.ObjectId, ref: 'List' }],
});

module.exports = model('Board', boardSchema);
