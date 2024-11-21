import { useState, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useWebSocket } from 'pages/contexts/WebSocketContext';

export default function ImageUpload() {
  const [image, setImage] = useState<string | null>(null);
  const { temperature } = useWebSocket(); // Access the temperature from context
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const uploadImage = async () => {
    if (!image) return;

    try {
      const response = await axios.post('/api/upload', {
        image, // Base64 string of the image
        fileName: 'uploaded-image.jpg', // Add a default file name
        temperature: temperature || 'Unavailable', // Include temperature from context
      });

      alert(
        `Image uploaded successfully.\n\nMetadata:\nImage ID: ${response.data.metadata.ImageID}\nTemperature: ${response.data.metadata.Temperature}\nTimestamp: ${response.data.metadata.UploadTimestamp}`
      );
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto rounded-lg shadow-md overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <h1 className="text-2xl font-bold text-white mb-4">Image Upload</h1>
        {!image && (
          <div
            {...getRootProps()}
            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
          >
            <input {...getInputProps()} />
            <p>Upload a file or drag and drop</p>
          </div>
        )}
        {image && (
          <div className="mt-4">
            <img src={image} alt="Captured or uploaded image" className="w-full h-auto" />
            <button
              onClick={uploadImage}
              className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              Upload
            </button>
            <p className="text-sm text-gray-600 mt-2">
              Current Temperature: {temperature || 'Loading...'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
