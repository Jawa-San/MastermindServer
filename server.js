const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI; // You'll need to add this to your .env file
// Remove useNewUrlParser and useUnifiedTopology
mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));


// Create Schema for calendar state
const CalendarStateSchema = new mongoose.Schema({
    // This will store your entire calendar state as an object
    state: {
        type: Object,
        required: true
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

// Create model
const CalendarState = mongoose.model('CalendarState', CalendarStateSchema);

// Endpoint to get the current state
app.get('/calendarState', async (req, res) => {
    try {
        const state = await CalendarState.findOne();
        if (!state) {
            // If no state exists, return empty object or default state
            return res.json({});
        }
        res.json(state.state);
    } catch (err) {
        console.error('Error reading state:', err);
        res.status(500).send('Error reading state from database');
    }
});

// Endpoint to update the state
app.post('/updateCalendarState', async (req, res) => {
    try {
        const newState = req.body;
        await CalendarState.findOneAndUpdate(
            {}, // empty filter to update first document
            { 
                state: newState,
                lastUpdated: new Date()
            },
            { upsert: true, new: true } // create if doesn't exist, return updated doc
        );
        res.send('State updated successfully');
    } catch (err) {
        console.error('Error updating state:', err);
        res.status(500).send('Error updating state in database');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});