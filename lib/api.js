// API Service for Video Editor Portfolio Frontend
// Kết nối với Supabase
import { supabase } from './supabase';

class ApiService {
  // Transform Supabase data to frontend format
  transformVideoData(backendVideo) {
    return {
      ...backendVideo,
      id: backendVideo.id,
      title: backendVideo.title,
      subtitle: backendVideo.subtitle || "Video Project",
      thumbnail: backendVideo.thumbnail_url || "/backgroundVideo/1.jpg",
      thumbnail_url: backendVideo.thumbnail_url || "/backgroundVideo/1.jpg",
      duration: backendVideo.extra || backendVideo.duration || null,
      videoId: backendVideo.video_id,
      video_id: backendVideo.video_id,
      software: backendVideo.software || "Capcut Pc, Premiere Pro, After Effects",
      Software: backendVideo.software || "Capcut Pc, Premiere Pro, After Effects",
      description: backendVideo.description || "This is a description of the project",
      views: backendVideo.views || 0,
      likes: backendVideo.likes || 0,
      date: backendVideo.created_at ? new Date(backendVideo.created_at).toLocaleDateString() : new Date().toLocaleDateString(),
      category: backendVideo.category,
      created_at: backendVideo.created_at,
      updated_at: backendVideo.updated_at
    };
  }

  // ============ VIDEO APIs ============

  // Lấy tất cả videos với phân trang
  async getVideos(params = {}) {
    const page = parseInt(params.page, 10) || 1;
    const limit = parseInt(params.limit, 10) || 10;
    const offset = (page - 1) * limit;

    let query = supabase.from('videos').select('*', { count: 'exact' });

    if (params.category) {
      query = query.eq('category', params.category);
    }
    
    if (params.search) {
      query = query.or(`title.ilike.%${params.search}%,description.ilike.%${params.search}%`);
    }

    if (params.all !== 'true') {
      query = query.range(offset, offset + limit - 1);
    }
    
    query = query.order('updated_at', { ascending: false });

    const { data, count, error } = await query;

    if (error) {
      console.error('getVideos Error:', error);
      return { success: false, data: { videos: [] }, error: error.message };
    }

    return {
      success: true,
      data: {
        videos: data.map(video => this.transformVideoData(video)),
        pagination: { page, limit, total: count || 0, totalPages: Math.ceil((count || 0) / limit) }
      }
    };
  }

  // Lấy videos theo category
  async getVideosByCategory(category, params = {}) {
    return this.getVideos({ ...params, category });
  }

  // Lấy chi tiết một video
  async getVideo(id) {
    const { data, error } = await supabase.from('videos').select('*').eq('id', id).single();
    if (error) {
      console.error('getVideo Error:', error);
      return { success: false, error: error.message };
    }
    return {
      success: true,
      data: this.transformVideoData(data)
    };
  }

  // Lấy featured videos (videos có views cao nhất)
  async getFeaturedVideos(limit = 10) {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('views', { ascending: false })
      .order('likes', { ascending: false })
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('getFeaturedVideos Error:', error);
      return { success: false, data: [], error: error.message };
    }

    return {
      success: true,
      data: data.map(video => this.transformVideoData(video))
    };
  }

  // Lấy recent videos
  async getRecentVideos(limit = 5) {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('getRecentVideos Error:', error);
      return { success: false, data: [], error: error.message };
    }

    return {
      success: true,
      data: data.map(video => this.transformVideoData(video))
    };
  }

  // Tìm kiếm videos
  async searchVideos(params = {}) {
    const page = parseInt(params.page, 10) || 1;
    const limit = parseInt(params.limit, 10) || 10;
    const offset = (page - 1) * limit;

    let query = supabase.from('videos').select('*', { count: 'exact' });

    if (params.q) {
      query = query.or(`title.ilike.%${params.q}%,description.ilike.%${params.q}%,software.ilike.%${params.q}%`);
    }

    if (params.category) {
      query = query.eq('category', params.category);
    }

    const sortField = params.sortBy || 'id';
    const ascending = params.order?.toUpperCase() === 'ASC';
    
    query = query.order(sortField, { ascending }).range(offset, offset + limit - 1);

    const { data, count, error } = await query;

    if (error) {
      console.error('searchVideos Error:', error);
      return { success: false, data: { videos: [] }, error: error.message };
    }

    return {
      success: true,
      data: {
        videos: data.map(video => this.transformVideoData(video)),
        searchQuery: params.q,
        category: params.category,
        pagination: { page, limit, total: count || 0, totalPages: Math.ceil((count || 0) / limit) }
      }
    };
  }

  // Thêm video mới
  async createVideo(videoData) {
    const { data, error } = await supabase.from('videos').insert([videoData]).select();
    if (error) return { success: false, message: error.message };
    return { success: true, message: 'Thêm video thành công', data: data[0] };
  }

  // Cập nhật video
  async updateVideo(id, videoData) {
    const { error } = await supabase.from('videos').update(videoData).eq('id', id);
    if (error) return { success: false, message: error.message };
    return { success: true, message: 'Cập nhật video thành công' };
  }

  // Xóa video
  async deleteVideo(id) {
    const { error } = await supabase.from('videos').delete().eq('id', id);
    if (error) return { success: false, message: error.message };
    return { success: true, message: 'Xóa video thành công' };
  }

  // ============ CATEGORY APIs ============

  // Lấy tất cả categories
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .not('name', 'is', null)
      .neq('name', '')
      .order('id', { ascending: true });

    if (error) return { success: false, data: [] };
    return { success: true, data };
  }

  // ============ UPLOAD APIs ============

  // Upload file
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      return result;
    } catch (error) {
      console.error('Upload Error:', error);
      return { success: false, message: error.message };
    }
  }

  // ============ STATS APIs ============

  // Lấy thống kê tổng quan
  async getStats() {
    // This requires multiple queries or an RPC function in Supabase.
    // For simplicity, we can do multiple queries or skip heavy aggregation on frontend.
    const { count: totalVideos } = await supabase.from('videos').select('*', { count: 'exact', head: true });
    const { data: videosData } = await supabase.from('videos').select('views, likes, category');
    const { count: totalCategories } = await supabase.from('categories').select('*', { count: 'exact', head: true });
    
    let totalViews = 0;
    let totalLikes = 0;
    const categoryStatsMap = {};

    (videosData || []).forEach(v => {
      totalViews += v.views || 0;
      totalLikes += v.likes || 0;
      if (v.category) {
        if (!categoryStatsMap[v.category]) {
          categoryStatsMap[v.category] = { category: v.category, count: 0, total_views: 0, total_likes: 0 };
        }
        categoryStatsMap[v.category].count += 1;
        categoryStatsMap[v.category].total_views += (v.views || 0);
        categoryStatsMap[v.category].total_likes += (v.likes || 0);
      }
    });

    const categoryStats = Object.values(categoryStatsMap).sort((a, b) => b.count - a.count);

    return {
      success: true,
      data: {
        overview: {
          totalVideos: totalVideos || 0,
          totalViews,
          totalLikes,
          totalCategories: totalCategories || 0,
        },
        categoryStats,
      },
    };
  }

  // ============ HEALTH CHECK ============

  // Health check
  async healthCheck() {
    return { success: true, message: 'Server đang hoạt động', timestamp: new Date().toISOString() };
  }

  // ============ PROFILE APIs ============
  async getProfile() {
    try {
      const response = await fetch('/api/profile', { cache: 'no-store' });
      return await response.json();
    } catch (error) {
      console.error('getProfile Error:', error);
      return { success: false, error: error.message };
    }
  }

  async updateProfile(profileData, token) {
    try {
      let body;
      let headers = {
        'Authorization': `Bearer ${token}`
      };

      if (profileData instanceof FormData) {
        body = profileData;
        // don't set Content-Type for FormData, browser does it automatically
      } else {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(profileData);
      }

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers,
        body
      });
      return await response.json();
    } catch (error) {
      console.error('updateProfile Error:', error);
      return { success: false, error: error.message };
    }
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
        const response = await apiService.getVideosByCategory(category, params);
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
        const response = await apiService.getFeaturedVideos(limit);
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
        const response = await apiService.getRecentVideos(limit);
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
      const response = await apiService.searchVideos(params);
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
