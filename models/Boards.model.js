const { Schema, model } = require('mongoose');

const boardSchema = new Schema({
  boardName: String,
  userId: { type: Schema.Types.ObjectId, ref: 'Users' },
  lists: [{ type: Schema.Types.ObjectId, ref: 'Lists' }],
  roles: [{ type: Schema.Types.ObjectId, ref: 'Roles' }],
});

module.exports = model('Boards', boardSchema);
