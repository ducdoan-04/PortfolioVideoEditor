// API Service for Video Editor Portfolio Frontend
// Kết nối với backend API

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiService {
  // Helper method để handle API calls
  async apiCall(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API call failed');
      }
      
      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      // Return fallback data structure for frontend compatibility
      return {
        success: false,
        data: [],
        error: error.message
      };
    }
  }

  // Transform backend data to frontend format
  transformVideoData(backendVideo) {
    return {
      title: backendVideo.title,
      subtitle: backendVideo.subtitle || "Video Project",
      thumbnail: backendVideo.thumbnail_url || "/backgroundVideo/1.jpg",
      duration: backendVideo.duration || "2:00",
      videoId: backendVideo.video_id,
      Software: backendVideo.software || "Capcut Pc, Premiere Pro, After Effects",
      description: backendVideo.description || "This is a description of the project",
      views: backendVideo.views || 0,
      likes: backendVideo.likes || 0,
      date: backendVideo.created_at ? new Date(backendVideo.created_at).toLocaleDateString() : new Date().toLocaleDateString()
    };
  }

  // ============ VIDEO APIs ============

  // Lấy tất cả videos với phân trang
  async getVideos(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const result = await this.apiCall(`/videos?${queryParams}`);
    if (result.success && result.data && result.data.videos) {
      return {
        ...result,
        data: {
          ...result.data,
          videos: result.data.videos.map(video => this.transformVideoData(video))
        }
      };
    }
    return result;
  }

  // Lấy videos theo category
  async getVideosByCategory(category, params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const result = await this.apiCall(`/videos/category/${category}?${queryParams}`);
    if (result.success && result.data && result.data.videos) {
      return {
        ...result,
        data: {
          ...result.data,
          videos: result.data.videos.map(video => this.transformVideoData(video))
        }
      };
    }
    return result;
  }

  // Lấy chi tiết một video
  async getVideo(id) {
    const result = await this.apiCall(`/videos/${id}`);
    if (result.success && result.data) {
      return {
        ...result,
        data: this.transformVideoData(result.data)
      };
    }
    return result;
  }

  // Lấy recent projects
  async getRecentVideos(limit = 5) {
    const result = await this.apiCall(`/videos/recent?limit=${limit}`);
    if (result.success && result.data) {
      return {
        ...result,
        data: result.data.map(video => this.transformVideoData(video))
      };
    }
    return result;
  }

  // Lấy featured videos
  async getFeaturedVideos(limit = 10) {
    const result = await this.apiCall(`/videos/featured?limit=${limit}`);
    if (result.success && result.data) {
      return {
        ...result,
        data: result.data.map(video => this.transformVideoData(video))
      };
    }
    return result;
  }

  // Lấy featured videos (videos có views cao nhất)
  async getFeaturedVideos(limit = 10) {
    return this.apiCall(`/videos/featured?limit=${limit}`);
  }

  // Lấy recent videos
  async getRecentVideos(limit = 5) {
    return this.apiCall(`/videos/recent?limit=${limit}`);
  }

  // Tìm kiếm videos
  async searchVideos(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return this.apiCall(`/videos/search?${queryParams}`);
  }

  // Thêm video mới
  async createVideo(videoData) {
    return this.apiCall('/videos', {
      method: 'POST',
      body: JSON.stringify(videoData),
    });
  }

  // Cập nhật video
  async updateVideo(id, videoData) {
    return this.apiCall(`/videos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(videoData),
    });
  }

  // Xóa video
  async deleteVideo(id) {
    return this.apiCall(`/videos/${id}`, {
      method: 'DELETE',
    });
  }

  // ============ CATEGORY APIs ============

  // Lấy tất cả categories
  async getCategories() {
    return this.apiCall('/categories');
  }

  // ============ UPLOAD APIs ============

  // Upload file
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    return this.apiCall('/upload', {
      method: 'POST',
      headers: {}, // Không set Content-Type cho FormData
      body: formData,
    });
  }

  // ============ STATS APIs ============

  // Lấy thống kê tổng quan
  async getStats() {
    return this.apiCall('/stats');
  }

  // ============ HEALTH CHECK ============

  // Health check
  async healthCheck() {
    return this.apiCall('/health');
  }
}

// Export singleton instance
const apiService = new ApiService();
export default apiService;

// Export individual methods for convenience
export const {
  getVideos,
  getVideosByCategory,
  getVideo,
  getFeaturedVideos,
  getRecentVideos,
  searchVideos,
  createVideo,
  updateVideo,
  deleteVideo,
  getCategories,
  uploadFile,
  getStats,
  healthCheck,
} = apiService;

// ============ REACT HOOKS ============

import { useState, useEffect } from 'react';

// Custom hook để lấy videos theo category
export function useVideosByCategory(category, params = {}) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    async function fetchVideos() {
      try {
        setLoading(true);
        const response = await getVideosByCategory(category, params);
        setVideos(response.data.videos);
        setPagination(response.data.pagination);
        setError(null);
      } catch (err) {
        setError(err.message);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    }

    if (category) {
      fetchVideos();
    }
  }, [category, JSON.stringify(params)]);

  return { videos, loading, error, pagination };
}

// Custom hook để lấy featured videos
export function useFeaturedVideos(limit = 10) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFeaturedVideos() {
      try {
        setLoading(true);
        const response = await getFeaturedVideos(limit);
        setVideos(response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedVideos();
  }, [limit]);

  return { videos, loading, error };
}

// Custom hook để lấy recent videos
export function useRecentVideos(limit = 5) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRecentVideos() {
      try {
        setLoading(true);
        const response = await getRecentVideos(limit);
        setVideos(response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    }

    fetchRecentVideos();
  }, [limit]);

  return { videos, loading, error };
}

// Custom hook để search videos
export function useSearchVideos(searchParams = {}) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const search = async (params = searchParams) => {
    try {
      setLoading(true);
      const response = await searchVideos(params);
      setVideos(response.data.videos);
      setPagination(response.data.pagination);
      setError(null);
    } catch (err) {
      setError(err.message);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  return { videos, loading, error, pagination, search };
}
