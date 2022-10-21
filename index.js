require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});


const isValidUrl = urlString => {
  var urlPattern = new RegExp('^(https?:\\/\\/)?' + // validate protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // validate fragment locator
  return !!urlPattern.test(urlString);
}
const isShortInArray = (short) => {
  return links.find(link => link.short_url == short) !== undefined
}
const isLinkInArray = (url) => {
  return links.find(link => link.original_url == url) !== undefined
}
const getOriginalByShort = (short) => {
  return links.find(link => link.short_url == short).original_url
}

var links = []
app.post('/api/shorturl', (req, res) => {
  const newLink = req.body.url
  if (isValidUrl(newLink)) {
    if (!isLinkInArray(newLink)) {
      const object = {
        original_url: newLink,
        short_url: links.length.toString()
      }
      links.push(object)
      res.send(object)
    }
  } else {
    res.send({
      error: "Invalid URL"
    })
  }
  console.log(links);
})

app.get('/api/shorturl/:url?', (req, res) => {
  // res.redirect("https://www.freecodecamp.org/")
  let shortUrl = req.params.url;
  if (isShortInArray(shortUrl)) {
    const original = getOriginalByShort(shortUrl)
    if (isLinkInArray(getOriginalByShort(shortUrl))) {
      res.redirect(original);
    }
  }

})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
