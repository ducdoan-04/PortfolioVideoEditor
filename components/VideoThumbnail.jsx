import { useState } from 'react';

const DEFAULT_THUMBNAIL = '/images/default-video-thumb.jpg';

export default function VideoThumbnail({ video, className = "w-full h-full object-cover" }) {
  const [imageError, setImageError] = useState(false);

  const getThumbnailUrl = (thumbnailUrl) => {
    if (!thumbnailUrl) return DEFAULT_THUMBNAIL;

    if (thumbnailUrl.startsWith('https://res.cloudinary.com')) {
      return thumbnailUrl;
    }

    if (thumbnailUrl.startsWith('http') || thumbnailUrl.startsWith('/')) {
      return thumbnailUrl;
    }

    return `/${thumbnailUrl}`;
  };

  const thumbnailUrl = imageError
    ? DEFAULT_THUMBNAIL
    : getThumbnailUrl(video?.thumbnail_url || video?.thumbnail);

  return (
    <img
      src={thumbnailUrl}
      alt={video?.title || 'Video Thumbnail'}
      className={className}
      onError={() => {
        if (!imageError) setImageError(true);
      }}
    />
  );
}
