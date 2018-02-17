var express = require('express');
var app = express();
var path = require('path');

app.use('/', express.static(path.join(__dirname, '/../client/dist')))

// viewed at http://localhost:4300
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/../client/dist/index.html'));
});

app.listen(4300);

console.log("Running on port 4300");
