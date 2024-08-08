const functions = require('firebase-functions');
const express = require('express');
const {createMeme, uploadToImgur} = require('./memeService'); 
const app = express();

// Your Express routes
app.get('/:topText/:bottomText', async (req, res) => {
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
      res.status(500).send('Failed to upload image to Imgur');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while generating the meme');
  }
});

// Export the Express app as a Firebase Function
exports.memeGenerator = functions.https.onRequest(app);