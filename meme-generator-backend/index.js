const express = require('express');
const { createMeme, uploadToImgur } = require('./memeServkce'); // Import the meme service
const app = express();
const port = 3000;

// Basic route for the home page
app.get('/', (req, res) => {
  res.send('Welcome to the Meme Generator API!');
});

// Dynamic route to handle meme generation and upload to Imgur
app.get('/:topText/:bottomText', async (req, res) => {
  const { topText, bottomText } = req.params;

  try {
    // Generate the meme image
    const memeImageBuffer = await createMeme(topText, bottomText);

    // Upload the image to Imgur
    const imgurResponse = await uploadToImgur(memeImageBuffer);

    if (imgurResponse.success) {
      // Redirect to the Imgur image URL
      res.redirect(imgurResponse.data.link);
    } else {
      res.status(500).send('Failed to upload image to Imgur');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while generating the meme');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});