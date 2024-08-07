import React, { useState } from 'react';
import { toBlob, toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import Footer from './Footer'

function MemeGenerator() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [textColor, setTextColor] = useState('text-white'); // Default color is white
  const [highlightColor, setHighlightColor] = useState(''); // Default is no highlight
  const [topFontSize, setTopFontSize] = useState('text-2xl'); // Default font size for top text is medium
  const [bottomFontSize, setBottomFontSize] = useState('text-2xl'); // Default font size for bottom text is medium
  const [embedUrl, setEmbedUrl] = useState('');
  const [error, setError] = useState('');
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result);
      setIsImageLoaded(false); // Reset image load state
    };
    reader.readAsDataURL(file);
  };
  
  const handleImageLoad = () => {
    setIsImageLoaded(true); // Set the image as loaded
  };

  const handleGenerateMeme = () => {
    if (!isImageLoaded) {
      setError('Please wait for the image to load.');
      return;
    }
  
    toBlob(document.getElementById('meme'))
      .then((blob) => {
    toBlob(document.getElementById('meme'))
      .then((blob) => {
        const formData = new FormData();
        formData.append('image', blob);

        return fetch('https://api.imgur.com/3/image', {
          method: 'POST',
          headers: {
            Authorization: 'Client-ID 2c1b6d3f1c226c9',
          },
          body: formData,
        });
      })
      .then(response => response.json())
      .then(data => {
        console.log(data); // Log the response
        if (data.success) {
          setEmbedUrl(data.data.link);
          setError('');
        } else {
          setError(`Failed to upload image. Error: ${data.data.error.message}`);
        }
      })
      .catch((err) => {
        setError(`An error occurred: ${err.message}`);
      });
    })
    .catch((err) => {
      setError(`An error occurred: ${err.message}`);
    });
};

const handleDownloadMeme = () => {
  toPng(document.getElementById('meme'))
    .then((dataUrl) => {
      if (/Mobi|Android/i.test(navigator.userAgent)) {
        // For mobile users
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'meme.png';
        link.click();

        setError('Long press the image and choose "Save Image" to save to your camera roll.');
      } else {
        // For desktop users
        saveAs(dataUrl, 'meme.png');
      }
    })
    .catch((err) => {
      setError(`An error occurred while downloading the image: ${err.message}`);
    });
};

  const textColors = [
    { color: 'text-white', label: 'White', bgClass: 'bg-white' },
    { color: 'text-black', label: 'Black', bgClass: 'bg-black' },
    { color: 'text-red-600', label: 'Red', bgClass: 'bg-red-600' },
    { color: 'text-blue-600', label: 'Blue', bgClass: 'bg-blue-600' },
  ];

  const highlightColors = [
    { color: '', label: 'No Highlight', bgClass: '' },
    { color: 'bg-white', label: 'White Highlight', bgClass: 'bg-white' },
    { color: 'bg-black', label: 'Black Highlight', bgClass: 'bg-black' },
  ];

  const fontSizes = [
    { size: 'text-xl', label: 'Small' },
    { size: 'text-2xl', label: 'Medium' }, // Default
    { size: 'text-4xl', label: 'Large' },
    { size: 'text-6xl', label: 'Goober' },
  ];

  const getTextShadow = () => {
    return textColor === 'text-black' ? '' : 'font-outline-2';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-12 flex flex-col items-center justify-center">
      <h1 className="text-center text-4xl font-extrabold mb-8">Meme Generator</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <input 
          type="file" 
          onChange={handleImageUpload} 
          className="my-4 w-full p-2 bg-gray-700 rounded text-white border border-gray-600" 
        />
        {selectedImage && (
          <div id="meme" className="relative w-full h-64 mb-4">
            <img src={selectedImage} alt="meme" className="object-cover w-full h-full rounded-lg" onLoad={handleImageLoad} />
            <p className={`absolute top-2 left-0 right-0 text-center font-extrabold drop-shadow-lg ${textColor} ${highlightColor} ${topFontSize} ${getTextShadow()}`}>{topText}</p>
            <p className={`absolute bottom-2 left-0 right-0 text-center font-extrabold drop-shadow-lg ${textColor} ${highlightColor} ${bottomFontSize} ${getTextShadow()}`}>{bottomText}</p>
          </div>
        )}
        <input
          type="text"
          placeholder="Top Text"
          value={topText}
          onChange={(e) => setTopText(e.target.value)}
          className="my-2 w-full p-2 bg-gray-700 rounded text-white border border-gray-600"
        />
        <input
          type="text"
          placeholder="Bottom Text"
          value={bottomText}
          onChange={(e) => setBottomText(e.target.value)}
          className="my-2 w-full p-2 bg-gray-700 rounded text-white border border-gray-600"
        />

        <div className="mt-4">
          <label className="text-sm font-semibold mb-2">Text Color:</label>
          <div className="flex space-x-4 mb-4">
            {textColors.map((option, index) => (
              <div
                key={index}
                className={`w-10 h-10 rounded-full cursor-pointer ${option.bgClass} ${textColor === option.color ? 'ring-2 ring-white' : ''}`}
                onClick={() => setTextColor(option.color)}
                title={option.label}
              />
            ))}
          </div>

          <label className="text-sm font-semibold mb-2">Text Highlight:</label>
          <div className="flex space-x-4 mb-4">
            {highlightColors.map((option, index) => (
              <div
                key={index}
                className={`w-10 h-10 rounded-full cursor-pointer border ${option.color ? 'border-black' : ''} ${option.bgClass} ${highlightColor === option.color ? 'ring-2 ring-white' : ''}`}
                onClick={() => setHighlightColor(option.color)}
                title={option.label}
              />
            ))}
          </div>

          <label className="text-sm font-semibold mb-2">Top Text Font Size:</label>
          <div className="grid grid-cols-2 gap-4 mb-4 md:grid-cols-4">
            {fontSizes.map((option, index) => (
              <button
                key={index}
                className={`py-2 px-4 rounded-lg cursor-pointer ${topFontSize === option.size ? 'bg-blue-600' : 'bg-gray-700'} text-white`}
                onClick={() => setTopFontSize(option.size)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <label className="text-sm font-semibold mb-2">Bottom Text Font Size:</label>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {fontSizes.map((option, index) => (
              <button
                key={index}
                className={`py-2 px-4 rounded-lg cursor-pointer ${bottomFontSize === option.size ? 'bg-blue-600' : 'bg-gray-700'} text-white`}
                onClick={() => setBottomFontSize(option.size)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col mt-6">
          <button 
            onClick={handleGenerateMeme} 
            className="py-2 mb-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition duration-200"
          >
            Generate Meme
          </button>

          <button 
            onClick={handleDownloadMeme} 
            className="py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition duration-200"
          >
            Download Meme
          </button>
        </div>

        {embedUrl && (
          <div className="mt-6 p-4 bg-gray-700 rounded-lg shadow-inner">
            <p className="text-center font-semibold">Embed Link:</p>
            <input 
              type="text" 
              value={embedUrl} 
              readOnly 
              className="w-full p-2 mt-2 bg-gray-800 rounded text-white border border-gray-600"
            />
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-700 rounded-lg">
            <p className="text-center">{error}</p>
          </div>
        )}
      </div>
      <Footer></Footer>
    </div>
  );
}

export default MemeGenerator;




