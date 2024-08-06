import React, { useState } from 'react';
import { toBlob } from 'html-to-image';

function MemeGenerator() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [embedUrl, setEmbedUrl] = useState('');
  const [error, setError] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateMeme = () => {
    fetch('https://via.placeholder.com/150')
      .then(res => res.blob())
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
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-center text-4xl font-extrabold mb-8">Meme Generator</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <input 
          type="file" 
          onChange={handleImageUpload} 
          className="my-4 w-full p-2 bg-gray-700 rounded text-white border border-gray-600" 
        />
        {selectedImage && (
          <div id="meme" className="relative w-full h-64 mb-4">
            <img src={selectedImage} alt="meme" className="object-cover w-full h-full rounded-lg" />
            <p className="absolute top-2 left-0 right-0 text-center text-white font-extrabold text-2xl drop-shadow-lg">{topText}</p>
            <p className="absolute bottom-2 left-0 right-0 text-center text-white font-extrabold text-2xl drop-shadow-lg">{bottomText}</p>
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
        
        <button 
          onClick={handleGenerateMeme} 
          className="mt-6 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition duration-200"
        >
          Generate Meme
        </button>

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
    </div>
  );
}

export default MemeGenerator;


