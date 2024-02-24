const { Schema, model } = require('mongoose');

const jobsSchema = new Schema({
  companyName: String,
  logoURL: String,
  jobURL: String,
  jobDescription: String,
  workModel: String,
  workLocation: String,
  notes: String,
  customLabel: String,
  date: Object,
  starred: Boolean,
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  boardId: { type: Schema.Types.ObjectId, ref: 'Board' },
  listId: { type: Schema.Types.ObjectId, ref: 'List' },
  roleId: { type: Schema.Types.ObjectId, ref: 'Role' },
});

module.exports = model('Jobs', jobsSchema);
