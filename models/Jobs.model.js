const { Schema, model } = require('mongoose');

const jobsSchema = new Schema({
  companyName: String,
  roleName: String,
  logoURL: String,
  jobURL: String,
  jobDescription: String,
  workModel: { type: String, enum: ['On-Site', 'Remote', 'Hybrid'] },
  workLocation: String,
  notes: String,
  customLabel: String,
  date: {
    created: Date,
    applied: Date,
    interviews: [Date],
    offer: Date,
    rejected: Date,
  },
  starred: Boolean,
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  boardId: { type: Schema.Types.ObjectId, ref: 'Boards' },
  listId: { type: Schema.Types.ObjectId, ref: 'Lists' },
  roleId: { type: Schema.Types.ObjectId, ref: 'Roles' },
});

module.exports = model('Jobs', jobsSchema);
