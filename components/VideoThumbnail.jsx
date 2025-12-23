import { useState } from 'react';
import { Video } from 'lucide-react';

export default function VideoThumbnail({ video, className = "w-full h-full object-cover" }) {
  const [imageError, setImageError] = useState(false);

  // Nếu thumbnail_url là URL Cloudinary (hoặc đầy đủ), dùng trực tiếp
  // Nếu là đường dẫn cũ từ /uploads, thử nhiều URL
  const getThumbnailUrl = (thumbnailUrl) => {
    if (!thumbnailUrl) return null;
    
    // Nếu là URL Cloudinary (bắt đầu với https://res.cloudinary.com), dùng trực tiếp
    if (thumbnailUrl.startsWith('https://res.cloudinary.com')) {
      return thumbnailUrl;
    }
    
    // Nếu là URL đầy đủ (http/https), dùng trực tiếp
    if (thumbnailUrl.startsWith('http')) {
      return thumbnailUrl;
    }
    
    // Nếu là đường dẫn tương đối cũ, thử qua backend
    const filename = thumbnailUrl.split('/').pop();
    return `http://localhost:3001${thumbnailUrl}`;
  };

  const thumbnailUrl = getThumbnailUrl(video.thumbnail_url);
  
  if (!thumbnailUrl || imageError) {
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
    setImageError(true);
  };

  return (
    <img 
      src={thumbnailUrl}
      alt={video.title}
      className={className}
      onError={handleError}
    />
  );
} 