const express = require('express');
const multer = require('multer');

const app = express();
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } }); // 10 MB limit

app.post('/upload', upload.single('image'), (req, res) => {
  // Handle the uploaded file here
  res.send('File uploaded successfully.');
});

// Your other middleware and routes go here

app.listen(5000, () => {
 //'Server is running on port 5000');
});
