import { useState, useRef, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useTemperature } from '@/contexts/TemperatureContext';
import { useAlert } from '@/contexts/AlertContext';

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
  const [isUploading, setIsUploading] = useState(false);
  const { showAlert } = useAlert();

  /**
   * Handles the file drop event and processes the uploaded file
   * @param acceptedFiles - Array of files dropped or selected
   */
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log('File received:', acceptedFiles[0]);
    const file = acceptedFiles[0];
    
    // Add file validation
    if (!file) {
      console.error('No file received');
      return;
    }

    // Log file details
    console.log('File details:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onerror = (error) => {
      console.error('FileReader error:', error);
    };
    reader.onload = (event) => {
      console.log('File read successfully');
      setImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  // Initialize dropzone with onDrop handler
  const { getRootProps, getInputProps, fileRejections } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxSize: 10 * 1024 * 1024 // 10MB limit
  });

  /**
   * Handles the image upload process including temperature metadata
   * @returns {Promise<void>}
   */
  const uploadImage = async (): Promise<void> => {
    if (!image) {
      showAlert('No image to upload', 'error');
      return;
    }

    setIsUploading(true);
    try {
      const response = await axios.post<UploadResponse>('/api/upload', {
        image,
        fileName,
        temperature: temperature,
      });

      showAlert('Image uploaded successfully!', 'success');
      setImage(null);
      setFileName('');
    } catch (error: unknown) {
      // Type guard for axios error
      if (axios.isAxiosError(error)) {
        showAlert(`Upload failed: ${error.response?.data?.message || error.message}`, 'error');
      } else {
        // For non-axios errors
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        showAlert(`Upload failed: ${errorMessage}`, 'error');
      }
    } finally {
      setIsUploading(false);
    }
  };

  // Log any file rejections
  useEffect(() => {
    if (fileRejections.length > 0) {
      console.log('File rejected:', fileRejections[0].errors);
    }
  }, [fileRejections]);

  return (
    <div className="w-full max-w-md mx-auto bg-white/5 backdrop-blur-sm rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Image Upload</h1>
        
        <div className="h-[280px] flex flex-col">
          {!image ? (
            <div
              {...getRootProps()}
              className="flex-1 flex items-center justify-center px-6 border-2 border-gray-300 border-dashed rounded-md"
            >
              <input {...getInputProps()} />
              <p>Upload a file or drag and drop</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="flex-1 relative">
                <img 
                  src={image} 
                  alt="Captured or uploaded image" 
                  className="absolute inset-0 w-full h-full object-contain" 
                />
              </div>
              <button
                onClick={uploadImage}
                disabled={isUploading}
                className={`mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                  ${isUploading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700'
                  }`}
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
              <p className="text-sm text-gray-600 mt-2">
                Current Temperature: {temperature || 'Loading...'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
