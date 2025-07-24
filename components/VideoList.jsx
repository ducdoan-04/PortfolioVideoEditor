export default function VideoList({ videos }) {
  return (
    <div>
      {videos.length > 0 ? (
        videos.map((video) => (
          <div key={video.id} style={{ margin: '10px 0', padding: '10px', border: '1px solid #ccc' }}>
            <h2>{video.title}</h2>
            <p>{video.description}</p>
            {video.thumbnail_url && (
              <img src={`${process.env.NEXT_PUBLIC_API_URL}${video.thumbnail_url}`} alt={video.title} width="200" />
            )}
          </div>
        ))
      ) : (
        <p>Không có video nào.</p>
      )}
    </div>
  );
}