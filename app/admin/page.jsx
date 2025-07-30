"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  LogOut, 
  Upload, 
  Video, 
  Image as ImageIcon,
  Users
} from "lucide-react"
import Image from "next/image"
import VideoThumbnail from "@/components/VideoThumbnail"

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [videos, setVideos] = useState([])
  const [categories, setCategories] = useState([])
  const [showAddVideo, setShowAddVideo] = useState(false)
  const [showEditVideo, setShowEditVideo] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [loginStatus, setLoginStatus] = useState('')
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    video_id: "",
    software: "",
    category: "",
    thumbnail: null
  })

  // Check authentication on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        setIsLoggedIn(false)
        setIsLoading(false)
        return
      }

      // Verify token with backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setIsLoggedIn(true)
        fetchData()
      } else {
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')
        setIsLoggedIn(false)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setIsLoggedIn(false)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchData = async () => {
    try {
      const [videosRes, categoriesRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/videos`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`)
      ])

      const videosData = await videosRes.json()
      const categoriesData = await categoriesRes.json()

      if (videosData.success) {
        setVideos(videosData.data.videos)
      }
      if (categoriesData.success) {
        setCategories(categoriesData.data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load data')
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginStatus('Đang đăng nhập...')
    
    const formData = new FormData(e.target)
    const username = formData.get('username')
    const password = formData.get('password')

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem('adminToken', data.token)
        localStorage.setItem('adminUser', JSON.stringify(data.user))
        setIsLoggedIn(true)
        setSuccessMessage(data.message || 'Đăng nhập thành công!')
        setShowSuccessDialog(true)
        fetchData()
      } else {
        setLoginStatus(data.message || 'Đăng nhập thất bại')
        toast.error(data.message || 'Login failed')
        console.log('Login failed:', data)
      }
    } catch (error) {
      console.error('Login error:', error)
      setLoginStatus('Lỗi kết nối server')
      toast.error('Login failed')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    setIsLoggedIn(false)
    toast.success('Logged out successfully')
  }

  const handleAddVideo = async (e) => {
    e.preventDefault()
    toast.loading('Đang thêm video...')
    
    try {
      const formDataToSend = new FormData()
      
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          formDataToSend.append(key, formData[key])
        }
      })

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/videos`, {
        method: 'POST',
        body: formDataToSend
      })

      const data = await response.json()

      if (data.success) {
        toast.dismiss()
        toast.success('Thêm video thành công!')
        setShowAddVideo(false)
        setFormData({
          title: "",
          description: "",
          video_id: "",
          software: "",
          category: "",
          thumbnail: null
        })
        fetchData()
      } else {
        toast.dismiss()
        toast.error(data.message || 'Thêm video thất bại')
      }
    } catch (error) {
      console.error('Add video error:', error)
      toast.dismiss()
      toast.error('Lỗi kết nối server')
    }
  }

  const handleEditVideo = async (e) => {
    e.preventDefault()
    toast.loading('Đang cập nhật video...')
    
    try {
      const formDataToSend = new FormData()
      
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          formDataToSend.append(key, formData[key])
        }
      })

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/videos/${selectedVideo.id}`, {
        method: 'PUT',
        body: formDataToSend
      })

      const data = await response.json()

      if (data.success) {
        toast.dismiss()
        toast.success('Cập nhật video thành công!')
        setShowEditVideo(false)
        setSelectedVideo(null)
        setFormData({
          title: "",
          description: "",
          video_id: "",
          software: "",
          category: "",
          thumbnail: null
        })
        fetchData()
      } else {
        toast.dismiss()
        toast.error(data.message || 'Cập nhật video thất bại')
      }
    } catch (error) {
      console.error('Update video error:', error)
      toast.dismiss()
      toast.error('Lỗi kết nối server')
    }
  }

  const handleDeleteVideo = async (videoId) => {
    if (!confirm('Bạn có chắc muốn xóa video này?')) return

    toast.loading('Đang xóa video...')
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/videos/${videoId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        toast.dismiss()
        toast.success('Xóa video thành công!')
        fetchData()
      } else {
        toast.dismiss()
        toast.error(data.message || 'Xóa video thất bại')
      }
    } catch (error) {
      console.error('Delete video error:', error)
      toast.dismiss()
      toast.error('Lỗi kết nối server')
    }
  }

  const openEditVideo = (video) => {
    setSelectedVideo(video)
    setFormData({
      title: video.title,
      description: video.description,
      video_id: video.video_id,
      software: video.software,
      category: video.category,
      thumbnail: null
    })
    setShowEditVideo(true)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({ ...prev, thumbnail: file }))
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
            <p className="text-gray-600">Enter your credentials to access the admin panel</p>
          </CardHeader>
          <CardContent>
                      <form onSubmit={handleLogin} className="space-y-4">

            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                placeholder="Enter username"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Enter password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loginStatus === 'Đang đăng nhập...'}>
              {loginStatus === 'Đang đăng nhập...' ? 'Đang đăng nhập...' : 'Login'}
            </Button>
            {loginStatus && (
              <div className={`text-sm p-2 rounded ${
                loginStatus.includes('thành công') 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : loginStatus.includes('Đang đăng nhập') 
                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                {loginStatus}
              </div>
            )}
          </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {videos.length} Videos
              </Badge>
              {(() => {
                const userStr = localStorage.getItem('adminUser')
                if (userStr) {
                  const user = JSON.parse(userStr)
                  return (
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      {user.username} ({user.role})
                    </Badge>
                  )
                }
                return null
              })()}
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => window.location.href = '/'}
                className="flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>View Site</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Video className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Videos</p>
                  <p className="text-2xl font-bold text-gray-900">{videos.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Categories</p>
                  <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">-</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Video Management</h2>
          <Button
            onClick={() => setShowAddVideo(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Video</span>
          </Button>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Card key={video.id} className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="relative">
                  <div className="w-full h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                    <VideoThumbnail video={video} />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => openEditVideo(video)}
                        className="bg-white text-gray-900 hover:bg-gray-100"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteVideo(video.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{video.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {video.category || 'Unknown'}
                    </Badge>
                    <span className="text-xs text-gray-500">{video.duration || 'N/A'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {videos.length === 0 && (
          <div className="text-center py-12">
            <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No videos yet</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first video</p>
            <Button onClick={() => setShowAddVideo(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Video
            </Button>
          </div>
        )}
      </div>

      {/* Add Video Modal */}
      <Dialog open={showAddVideo} onOpenChange={setShowAddVideo}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Video</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddVideo} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
                placeholder="Enter video title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter video description"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="video_id">YouTube Video ID</Label>
              <Input
                id="video_id"
                value={formData.video_id}
                onChange={(e) => setFormData(prev => ({ ...prev, video_id: e.target.value }))}
                required
                placeholder="Enter YouTube video ID"
              />
            </div>
            <div>
              <Label htmlFor="software">Software Used</Label>
              <Input
                id="software"
                value={formData.software}
                onChange={(e) => setFormData(prev => ({ ...prev, software: e.target.value }))}
                placeholder="e.g., Capcut Pc, Premiere Pro, After Effects"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="thumbnail">Thumbnail Image</Label>
              <Input
                id="thumbnail"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              <p className="text-sm text-gray-500 mt-1">Upload a thumbnail image for the video</p>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowAddVideo(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <Upload className="w-4 h-4 mr-2" />
                Add Video
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Video Modal */}
      <Dialog open={showEditVideo} onOpenChange={setShowEditVideo}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Video</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditVideo} className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
                placeholder="Enter video title"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter video description"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-video_id">YouTube Video ID</Label>
              <Input
                id="edit-video_id"
                value={formData.video_id}
                onChange={(e) => setFormData(prev => ({ ...prev, video_id: e.target.value }))}
                required
                placeholder="Enter YouTube video ID"
              />
            </div>
            <div>
              <Label htmlFor="edit-software">Software Used</Label>
              <Input
                id="edit-software"
                value={formData.software}
                onChange={(e) => setFormData(prev => ({ ...prev, software: e.target.value }))}
                placeholder="e.g., Capcut Pc, Premiere Pro, After Effects"
              />
            </div>
            <div>
              <Label htmlFor="edit-category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-thumbnail">Thumbnail Image (optional)</Label>
              <Input
                id="edit-thumbnail"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              <p className="text-sm text-gray-500 mt-1">Upload a new thumbnail image (leave empty to keep current)</p>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowEditVideo(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <Edit className="w-4 h-4 mr-2" />
                Update Video
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Success Login Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              </div>
              Đăng nhập thành công!
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">{successMessage}</p>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setShowSuccessDialog(false)}>
              Tiếp tục
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Toaster for notifications */}
      <Toaster />
    </div>
  )
} 