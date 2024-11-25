const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const filePath = path.join(__dirname, 'calendarState.json');

// Endpoint to get the current state
app.get('/calendarState', (req, res) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading file');
    }
    res.send(JSON.parse(data));
  });
});

// Endpoint to update the state
app.post('/updateCalendarState', (req, res) => {
  const newState = req.body;
  fs.writeFile(filePath, JSON.stringify(newState, null, 2), 'utf8', (err) => {
    if (err) {
      return res.status(500).send('Error writing file');
    }
    res.send('State updated successfully');
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
