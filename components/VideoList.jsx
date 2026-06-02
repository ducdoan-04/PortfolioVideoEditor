export default function VideoList({ videos }) {
  return (
    <div>
      {videos.length > 0 ? (
        videos.map((video) => {
          // Hỗ trợ cả Cloudinary URLs (đầy đủ) và URLs cũ
          let thumbnailUrl = video.thumbnail_url;
          if (thumbnailUrl && !thumbnailUrl.startsWith('http')) {
            thumbnailUrl = `${video.thumbnail_url}`;
          }

          return (
            <div key={video.id} style={{ margin: '10px 0', padding: '10px', border: '1px solid #ccc' }}>
              <h2>{video.title}</h2>
              <p>{video.description}</p>
              {thumbnailUrl && (
                <img src={thumbnailUrl} alt={video.title} width="200" />
              )}
            </div>
          );
        })
      ) : (
        <p>Không có video nào.</p>
      )}
    </div>
  );
}