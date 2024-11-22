import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface ImageData {
  imageUrl: string;
  temperature: string;
  timestamp: string;
}

const ImagePreview = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecentImages = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/images?limit=3');
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      const data = await response.json();
      setImages(data.images);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching images');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecentImages();
    
    // Listen for new image uploads
    const handleImageUploaded = () => {
      fetchRecentImages();
    };
    
    window.addEventListener('imageUploaded', handleImageUploaded);
    
    // Poll for new images every 30 seconds
    const interval = setInterval(fetchRecentImages, 30000);
    
    return () => {
      window.removeEventListener('imageUploaded', handleImageUploaded);
      clearInterval(interval);
    };
  }, [fetchRecentImages]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="w-full bg-white/5 backdrop-blur-sm p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Recent Images</h2>
      <div className="grid grid-cols-3 gap-4">
        {images.map((image) => (
          <div 
            key={image.timestamp} 
            className="relative group cursor-pointer"
          >
            <div className="aspect-square relative overflow-hidden rounded-lg">
              <Image
                src={image.imageUrl}
                alt={`Temperature: ${image.temperature}°C`}
                fill
                className="object-cover transition-transform group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={false}
                quality={50}
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm">
              <div>{image.temperature}°C</div>
              <div className="text-xs">
                {new Date(image.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImagePreview;