const express = require('express');
const mongodb = require('mongodb');
const env = require("../../../Env");
const url = env[0].MONGO_URL;

const router = express.Router();

// Get Posts
router.get('/', async (req, res) => {
  await loadPostsCollection(function (dbCollection) {
    dbCollection.find({}).toArray(function (err, result) {
      res.send(result);
    });
  });
});

// Add Post
router.post('/', async (req, res) => {
  await loadPostsCollection(function (dbCollection) {
    dbCollection.insertOne({
      text: req.body.text,
      createdAt: new Date()
    });
  });
  res.status(201).send();
});

// Edit Post --- this currently functions but only if the user inputs the exact right id. The error check is non-functional and causes the app to crash.
// router.put('/:id', async (req, res) => {
//   await loadPostsCollection(function (dbCollection) {
//     const found = dbCollection.some((post) => post._id === parseInt(req.params.id));

//     if (found) {
//       dbCollection.updateOne(
//         { _id: new mongodb.ObjectId(req.params.id) },
//         {
//           $set: {
//             "text": req.body.text
//           }
//         }
//       );
//       res.status(200).send();
//     } else {
//       res.status(400);
//     }
//   });
// });

// Delete Post
router.delete('/:id', async (req, res) => {
  await loadPostsCollection(function (dbCollection) {
    dbCollection.deleteOne({ _id: new mongodb.ObjectId(req.params.id) });
    res.status(200).send();
  });
});

async function loadPostsCollection(
  successCallback) {
  mongodb.MongoClient.connect(url, function (err, dbInstance) {
    const dbObject = dbInstance.db('vue-express');
    const dbCollection = dbObject.collection('posts');
    console.log("[MongoDB connection] SUCCESS");
    successCallback(dbCollection);
  });
}

module.exports = router;