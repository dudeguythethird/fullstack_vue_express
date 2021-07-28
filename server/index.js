const express = require('express');
// const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json()); // was bodyParser.json but that is deprecated.
app.use(cors());

const posts = require('./routes/api/posts');

app.use('/api/posts', posts);

//Handle Production
if (process.env.NODE_ENV === 'production') {
  //Static Folder
  app.use(express.static(__dirname + '/public/'));

  //Handle SPA (singlepage application, we need to account for people trying routes at the end of our URL, as our app should have none.)
  app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));