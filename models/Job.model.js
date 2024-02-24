const { Schema, model } = require('mongoose');

const jobSchema = new Schema({
  companyName: String,
  logoURL: String,
  jobURL: String,
  jobDescription: String,
  workModel: ['Remote', 'Hybrid', 'On-site'],
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

module.exports = model('Job', jobSchema);
