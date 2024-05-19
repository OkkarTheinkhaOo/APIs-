require('dotenv').config();
const express = require('express');
const cors = require('cors');
const validator = require('validator')
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
const originalURL = []
const shortUrl = []

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.use(express.urlencoded({extended: true}))

app.post('/api/shorturl',  (req, res)=>{
  const url = req.body.url
  const inOriginal = originalURL.indexOf(url)
  if(!url.includes("https://")&& !url.includes("http://")){
    return res.json({error: "invalid url" })
  }
  if(inOriginal < 0){
    originalURL.push(url)
    shortUrl.push(shortUrl.length)
    return res.json({original_url: url, short_url: shortUrl.length-1})
  }
  return res.json({original_url: url, short_url: shortUrl[inOriginal]})

})

app.get('/api/shorturl/:id', (req, res)=>{
  console.log(req.params.id)
  const inShort = shortUrl.indexOf(parseInt(req.params.id))
  console.log(inShort)
  if(inShort < 0){
    return res.json({error: "invalid url" })
  }
  res.redirect(`${originalURL[inShort]}`)
})



app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
