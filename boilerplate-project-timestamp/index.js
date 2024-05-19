// index.js
// where your node app starts

// init project
const express = require('express');
const app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.get('/api/:date', (req, res) => {
  let input = req.params.date
  let unixTime
  let utcTime

  if (!isNaN(input)) {

    if (input >= -62167219200000 && input <= 62167219200000) {
      unixTime = Number(input)
      utcTime = (new Date(unixTime)).toUTCString()
    } else {
      return res.json({ error: "Invalid Date" })
    }

  } else if (typeof input === 'string') {

    let date = new Date(input)
    if (date.toUTCString() !== "Invalid Date") {

      utcTime = date.toUTCString()
      unixTime = date.getTime()
    } else {
      return res.json({ error: "Invalid Date" })
    }
  }

  let result = {
    unix: unixTime,
    utc: utcTime
  }

  res.json(result)
})

app.get('/api', (req, res)=>{
  res.json({
    unix: new Date().getTime(),
    utc: new Date().toUTCString()
  })
})

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
