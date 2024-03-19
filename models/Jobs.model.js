const { Schema, model } = require('mongoose');

const jobsSchema = new Schema({
  companyName: { type: String, required: [true, 'Company Name is required.'] },
  roleName: { type: String, required: [true, 'Role Name is required.'] },
  domain: String,
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
});

module.exports = model('Jobs', jobsSchema);
