import { useState, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useTemperature } from '@/contexts/TemperatureContext';

/**
 * Interface for the upload response from the server
 */
interface UploadResponse {
  metadata: {
    ImageID: string;
    Temperature: string;
    UploadTimestamp: string;
  };
}

/**
 * ImageUpload component that provides drag-and-drop and click-to-upload functionality
 * with image preview and temperature metadata inclusion.
 */
const ImageUpload: React.FC = () => {
  // State management
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const { currentTemperature: temperature } = useTemperature();

  /**
   * Handles the file drop event and processes the uploaded file
   * @param acceptedFiles - Array of files dropped or selected
   */
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  // Initialize dropzone with onDrop handler
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  /**
   * Handles the image upload process including temperature metadata
   * @returns {Promise<void>}
   */
  const uploadImage = async (): Promise<void> => {
    if (!image) return;

    const currentTemp = temperature || 'No temperature reading available';
    console.log('Sending temperature:', currentTemp);

    try {
      const response = await axios.post<UploadResponse>('/api/upload', {
        image,
        fileName,
        temperature: currentTemp,
      });

      console.log('Response metadata:', response.data.metadata);

      alert(
        `Image uploaded successfully.\n\nMetadata:\nImage ID: ${response.data.metadata.ImageID}\nTemperature: ${response.data.metadata.Temperature}\nTimestamp: ${response.data.metadata.UploadTimestamp}`
      );
      
      // Reset states after successful upload
      setImage(null);
      setFileName('');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto rounded-lg shadow-md overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <h1 className="text-2xl font-bold text-white mb-4">Image Upload</h1>
        
        {/* Drop zone area */}
        {!image && (
          <div
            {...getRootProps()}
            className="mt-1 h-48 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
          >
            <input {...getInputProps()} />
            <p>Upload a file or drag and drop</p>
          </div>
        )}

        {/* Image preview and upload button */}
        {image && (
          <div className="mt-4">
            <img 
              src={image} 
              alt="Captured or uploaded image" 
              className="w-full h-auto" 
            />
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
};

export default ImageUpload;
