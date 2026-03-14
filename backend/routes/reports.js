const express = require('express');
const router = express.Router();
const Report = require('../models/Report');

const MOCK_REPORTS = [
    {
        id: 'mock1',
        category: 'Dark Area',
        location: 'Jagatpura Rly Station Backdoor, Jaipur',
        desc: 'Street lights are non-functional for the last 3 days. Area is completely dark after 7 PM.',
        time: '2 hours ago',
        status: 'Reported',
        severity: 'Warning'
    },
    {
        id: 'mock2',
        category: 'Suspicious Activity',
        location: 'Clock Tower Market, Jodhpur',
        desc: 'Group of people loitering and making passing comments near the parking area.',
        time: '5 hours ago',
        status: 'Under Review',
        severity: 'Danger'
    },
    {
        id: 'mock3',
        category: 'Harassment',
        location: 'Fateh Sagar Lake Promenade, Udaipur',
        desc: 'Followed by an unidentified individual for 100 meters. Safely reached a crowded shop.',
        time: '1 day ago',
        status: 'Resolved',
        severity: 'Danger'
    }
];

// Get all reports
router.get('/', async (req, res) => {
    if (!req.isDbConnected) {
        return res.json(MOCK_REPORTS);
    }
    try {
        const reports = await Report.find().sort({ createdAt: -1 });
        res.json(reports);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Create a report
router.post('/', async (req, res) => {
    if (!req.isDbConnected) {
        return res.json({ ...req.body, id: Date.now(), time: 'Just now', status: 'Reported (Demo Mode)' });
    }
    try {
        const { category, location, description, severity } = req.body;
        const newReport = new Report({
            category,
            location,
            description,
            severity
        });
        const report = await newReport.save();
        res.json(report);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
