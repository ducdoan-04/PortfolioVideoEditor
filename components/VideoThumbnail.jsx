import { useState } from 'react';
import { Video } from 'lucide-react';

export default function VideoThumbnail({ video, className = "w-full h-full object-cover" }) {
  const [imageError, setImageError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(0);

  // Danh sách các URL để thử
  const getImageUrls = (thumbnailUrl) => {
    if (!thumbnailUrl) return [];
    
    const filename = thumbnailUrl.split('/').pop();
    return [
      // Next.js API route
      `/api/images/${filename}`,
      // Backend API endpoint
      `http://localhost:3001/api/images/${filename}`,
      // Direct uploads path
      `http://localhost:3001${thumbnailUrl}`,
      // Public path (nếu có)
      thumbnailUrl.startsWith('/backgroundVideo/') ? thumbnailUrl : null,
    ].filter(Boolean);
  };

  const urls = getImageUrls(video.thumbnail_url);
  
  if (!video.thumbnail_url || imageError) {
    return (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
        <div className="text-center">
          <Video className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <span className="text-xs text-gray-500">No thumbnail</span>
        </div>
      </div>
    );
  }

  const handleError = () => {
    if (currentSrc < urls.length - 1) {
      setCurrentSrc(currentSrc + 1);
    } else {
      setImageError(true);
    }
  };

  return (
    <img 
      src={urls[currentSrc]}
      alt={video.title}
      className={className}
      onError={handleError}
    />
  );
} 