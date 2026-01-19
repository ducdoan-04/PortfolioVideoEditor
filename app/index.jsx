import { useEffect, useState } from 'react';
import VideoList from '../components/VideoList';

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/videos`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setVideos(data.data.videos);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return 
                      <div>
                          <div className="min-h-screen bg-gray-200 flex items-center justify-center">
                            <div className="relative">

                              {/* Chat bubble */}
                              <div className="absolute -top-6 left-1/3 translate-x-8">
                                <div className="relative bg-white px-6 py-3 rounded-2xl shadow-md">
                                  <p className="text-gray-700 text-base font-medium whitespace-nowrap">
                                    Please wait a moment<span className="animate-pulse">...</span>
                                  </p>  

                                  {/* Tail */}
                                  <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white rotate-45"></div>
                                </div>
                              </div>

                              {/* Avatar */}
                              <div className="w-50 h-52 rounded-full bg-blue-500  flex items-center justify-center overflow-hidden">
                                <Image
                                  src="/images/loding-gif.gif"
                                  alt="Loading"
                                  width={400}
                                  height={400}
                                  className="w-full h-full object-contain"
                                />
                              </div>

                            </div>
                        </div>
                      </div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Video Portfolio</h1>
      <VideoList videos={videos} />
    </div>
  );
}