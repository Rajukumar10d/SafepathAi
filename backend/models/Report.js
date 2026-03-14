const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    category: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    severity: { type: String, enum: ['Low', 'Medium', 'High', 'Danger', 'Warning', 'Info'], default: 'Info' },
    status: { type: String, enum: ['Reported', 'Under Review', 'Resolved'], default: 'Reported' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', ReportSchema);
