const functions = require('firebase-functions');
const express = require('express');
const { createMeme, uploadToImgur } = require('./memeService'); 
const app = express();

// Middleware to log all incoming requests
app.use((req, res, next) => {
  console.log('Received request for:', req.originalUrl);
  next();
});

// Your Express route for generating memes
app.get('/api/:topText/:bottomText', async (req, res) => {
  const topText = decodeURIComponent(req.params.topText);
  const bottomText = decodeURIComponent(req.params.bottomText);

  console.log('Received topText:', topText);
  console.log('Received bottomText:', bottomText);

  try {
    const memeImageBuffer = await createMeme(topText, bottomText);
    const imgurResponse = await uploadToImgur(memeImageBuffer);
    if (imgurResponse.success) {
      res.redirect(imgurResponse.data.link);
    } else {
      console.error('Failed to upload image to Imgur:', imgurResponse.data.error);
      res.status(500).send('Failed to upload image to Imgur');
    }
  } catch (error) {
    console.error('Error generating meme:', error);
    res.status(500).send('An error occurred while generating the meme');
  }
});

// Fallback route for catching unmatched routes
app.use((req, res) => {
  console.log('No matching route for:', req.originalUrl);
  res.status(404).send('Route not found');
});

// Export the Express app as a Firebase Function
exports.memeGenerator = functions.https.onRequest(app);
