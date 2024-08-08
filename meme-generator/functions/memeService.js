const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const fs = require('fs');

const IMGUR_CLIENT_ID = '2c1b6d3f1c226c9'; // Replace with your Imgur Client ID

// Register the Impact font
registerFont(path.join(__dirname, 'fonts', 'Impact.ttf'), { family: 'Impact' });

const getRandomTemplate = () => {
  const templateDirectory = path.join(__dirname, 'templates');
  const templates = fs.readdirSync(templateDirectory);
  const randomIndex = Math.floor(Math.random() * templates.length);
  return path.join(templateDirectory, templates[randomIndex]);
};

const createMeme = async (topText, bottomText) => {
  const width = 500; // Width of the image
  const height = 500; // Height of the image
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Load a random meme template image
  const randomTemplatePath = getRandomTemplate();
  const image = await loadImage(randomTemplatePath);

  // Draw the base image
  ctx.drawImage(image, 0, 0, width, height);

  // Set up text styles with Impact font
  ctx.font = 'bold 30px Impact'; // Use the Impact font
  ctx.fillStyle = 'white'; // White text
  ctx.strokeStyle = 'black'; // Black outline
  ctx.lineWidth = 2;
  ctx.textAlign = 'center';

  // Add top text
  ctx.fillText(topText.toUpperCase(), width / 2, 50);
  ctx.strokeText(topText.toUpperCase(), width / 2, 50);

  // Add bottom text
  ctx.fillText(bottomText.toUpperCase(), width / 2, height - 30);
  ctx.strokeText(bottomText.toUpperCase(), width / 2, height - 30);

  // Return the generated image as a buffer
  return canvas.toBuffer();
};

const uploadToImgur = async (imageBuffer) => {
  const fetch = (await import('node-fetch')).default;
  
  const response = await fetch('https://api.imgur.com/3/image', {
    method: 'POST',
    headers: {
      Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
    },
    body: imageBuffer,
  });

  const data = await response.json();
  return data;
};

module.exports = { createMeme, uploadToImgur };

