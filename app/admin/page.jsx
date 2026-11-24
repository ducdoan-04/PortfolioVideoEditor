"use client"

import { useState, useEffect, useMemo } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  LogOut,
  Upload,
  Video,
  Users,
  Tag,
  UserCircle,
  Clapperboard,
  Sun,
  Moon,
  Search,
  Clock,
  Sparkles,
  ExternalLink,
  X,
  MessageSquare
} from "lucide-react"
import Image from "next/image"
import VideoThumbnail from "@/components/VideoThumbnail"
import AdminLogin from "./login/page.jsx"
import CategoryManagement from "@/components/CategoryManagement"
import UserManagement from "@/components/UserManagement"
import ProfileManagement from "@/components/ProfileManagement"
import MessageManagement from "@/components/MessageManagement"

export default function AdminPage() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [videos, setVideos] = useState([])
  const [categories, setCategories] = useState([])
  const [users, setUsers] = useState([])
  const [messages, setMessages] = useState([])
  const [messagesTableMissing, setMessagesTableMissing] = useState(false)
  const [showAddVideo, setShowAddVideo] = useState(false)
  const [showEditVideo, setShowEditVideo] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("ALL")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    video_id: "",
    software: "",
    category: "",
    extra: "",
    thumbnail: null
  })
  const [activeTab, setActiveTab] = useState("videos")

  useEffect(() => {
    setMounted(true)
    checkAuth()
  }, [])

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('admin-token')
      if (token && !isLoggedIn) {
        checkAuth()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [isLoggedIn])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('admin-token')
      if (!token) {
        setIsLoggedIn(false)
        setIsLoading(false)
        return
      }

      const response = await fetch(`/api/admin/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setIsLoggedIn(true)
        fetchData()
      } else {
        localStorage.removeItem('admin-token')
        localStorage.removeItem('admin-user')
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
      const [videosRes, categoriesRes, usersRes, messagesRes] = await Promise.all([
        fetch(`/api/videos?all=true`),
        fetch(`/api/categories`),
        fetch(`/api/users`),
        fetch(`/api/messages`)
      ])

      const videosData = await videosRes.json()
      const categoriesData = await categoriesRes.json()
      const usersData = await usersRes.json()
      const messagesData = await messagesRes.json()

      if (videosData.success) {
        setVideos(videosData.data.videos || [])
      }
      if (categoriesData.success) {
        setCategories(categoriesData.data || [])
      }
      if (usersData.success) {
        setUsers(usersData.data || [])
      }
      if (messagesData.success) {
        setMessages(messagesData.data || [])
        setMessagesTableMissing(!!messagesData.tableMissing)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Không thể tải dữ liệu quản trị')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin-token')
    localStorage.removeItem('admin-user')
    setIsLoggedIn(false)
    toast.success('Đã đăng xuất thành công')
  }

  const handleDeleteAllVideos = async () => {
    toast.loading('Đang xóa tất cả videos...')

    try {
      const response = await fetch(`/api/videos`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        toast.dismiss()
        toast.success(`Đã xóa tất cả videos thành công! (${data.deletedCount} videos)`)
        fetchData()
      } else {
        toast.dismiss()
        toast.error(data.message || 'Xóa tất cả videos thất bại')
      }
    } catch (error) {
      console.error('Error deleting all videos:', error)
      toast.dismiss()
      toast.error('Lỗi kết nối server')
    }
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

      const response = await fetch(`/api/videos`, {
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
          extra: "",
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
        if (key !== 'thumbnail' && formData[key] !== null && formData[key] !== '') {
          formDataToSend.append(key, formData[key])
        }
      })

      if (formData.thumbnail && formData.thumbnail instanceof File) {
        formDataToSend.append('thumbnail', formData.thumbnail)
      }

      const response = await fetch(`/api/videos/${selectedVideo.id}`, {
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
          extra: "",
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
      const response = await fetch(`/api/videos/${videoId}`, {
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
      title: video.title || "",
      description: video.description || "",
      video_id: video.video_id || "",
      software: video.software || "",
      category: video.category || "",
      extra: video.extra || video.duration || "",
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

  const filteredVideos = useMemo(() => {
    if (!Array.isArray(videos)) return []
    return videos.filter((v) => {
      const matchesCat =
        filterCategory === "ALL" ||
        (v.category || "").toLowerCase() === filterCategory.toLowerCase()
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        (v.title && v.title.toLowerCase().includes(q)) ||
        (v.description && v.description.toLowerCase().includes(q)) ||
        (v.software && v.software.toLowerCase().includes(q)) ||
        (v.video_id && v.video_id.toLowerCase().includes(q))
      return matchesCat && matchesSearch
    })
  }, [videos, filterCategory, searchQuery])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 p-1 shadow-xl">
            <div className="w-full h-full rounded-full bg-card flex items-center justify-center overflow-hidden">
              <Image
                src="/images/loding-gif.gif"
                alt="Loading"
                width={280}
                height={280}
                className="w-full h-full object-contain"
                unoptimized
              />
            </div>
          </div>
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            Đang tải bảng điều khiển quản trị...
          </p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return <AdminLogin />
  }

  return (
    <div className="min-h-screen bg-background text-foreground bg-studio-grid">
      {/* Top Sticky Studio Header */}
      <header className="sticky top-0 z-40 bg-card/85 dark:bg-slate-900/85 backdrop-blur-xl border-b border-border/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Clapperboard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base md:text-lg font-extrabold tracking-tight">
                  ĐOAN<span className="text-indigo-600 dark:text-indigo-400">.STUDIO</span>
                </h1>
                <Badge className="bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 border border-indigo-500/25 text-xs">
                  Admin Panel
                </Badge>
              </div>
              {(() => {
                const userStr = typeof window !== 'undefined' ? localStorage.getItem('admin-user') : null
                if (userStr) {
                  try {
                    const user = JSON.parse(userStr)
                    return (
                      <p className="text-xs text-muted-foreground">
                        Xin chào, <span className="font-semibold text-foreground">{user.username}</span> ({user.role})
                      </p>
                    )
                  } catch {
                    return null
                  }
                }
                return null
              })()}
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {mounted && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                className="h-9 w-9 rounded-xl bg-secondary/60 border-border/60"
                title="Đổi giao diện Sáng / Tối"
              >
                {resolvedTheme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700" />
                )}
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => (window.location.href = '/')}
              className="rounded-xl h-9 flex items-center gap-1.5 border-border/80"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Xem Portfolio</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="rounded-xl h-9 flex items-center gap-1.5 text-rose-600 dark:text-rose-400 border-rose-500/25 hover:bg-rose-500/10"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Đăng xuất</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Overview Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card/85 backdrop-blur-md border-border/80 shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Video className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Tổng số Video
                </p>
                <p className="text-2xl font-extrabold">{videos.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/85 backdrop-blur-md border-border/80 shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Tag className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Danh mục
                </p>
                <p className="text-2xl font-extrabold">{categories.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/85 backdrop-blur-md border-border/80 shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Tài khoản Active
                </p>
                <p className="text-2xl font-extrabold">
                  {users.filter((user) => user.is_active).length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/85 backdrop-blur-md border-border/80 shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Trạng thái
                </p>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Supabase Online
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 bg-card/80 backdrop-blur-md p-1.5 rounded-2xl border border-border/80 w-fit">
          {[
            { id: "videos", label: "Quản lý Video", icon: Video, count: videos.length },
            { id: "categories", label: "Danh mục", icon: Tag, count: categories.length },
            { id: "messages", label: "Yêu cầu Dự án", icon: MessageSquare, count: messages.length },
            { id: "profile", label: "Hồ sơ Cá nhân", icon: UserCircle },
            { id: "users", label: "Tài khoản", icon: Users, count: users.length }
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/70"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {typeof tab.count === "number" && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-md ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* ================= TAB: VIDEOS ================= */}
        {activeTab === "videos" && (
          <div className="space-y-6">
            {/* Toolbar: Search, Category Filter & Actions */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-card/80 backdrop-blur-md p-4 rounded-2xl border border-border/80">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm theo tên video, YouTube ID, phần mềm..."
                    className="pl-10 pr-8 h-10 rounded-xl bg-background"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Category Filter */}
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full sm:w-48 h-10 rounded-xl bg-background">
                    <SelectValue placeholder="Tất cả danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Tất cả danh mục</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2.5">
                {videos.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (
                        confirm(
                          "Bạn có chắc muốn xóa TẤT CẢ videos? Hành động này không thể hoàn tác!"
                        )
                      ) {
                        handleDeleteAllVideos()
                      }
                    }}
                    className="rounded-xl h-10 text-rose-600 dark:text-rose-400 border-rose-500/25 hover:bg-rose-500/10"
                  >
                    <Trash2 className="w-4 h-4 mr-1.5" />
                    <span>Xóa tất cả</span>
                  </Button>
                )}

                <Button
                  onClick={() => {
                    setFormData({
                      title: "",
                      description: "",
                      video_id: "",
                      software: "",
                      category: "",
                      extra: "",
                      thumbnail: null
                    })
                    setShowAddVideo(true)
                  }}
                  className="rounded-xl h-10 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  <span>Thêm Video mới</span>
                </Button>
              </div>
            </div>

            {/* Videos Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <Card
                  key={video.id}
                  className="group overflow-hidden rounded-2xl bg-card/85 backdrop-blur-md border-border/80 hover:border-indigo-500/40 hover:shadow-xl transition-all flex flex-col"
                >
                  <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                    <VideoThumbnail
                      video={video}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />

                    {/* Category Badge */}
                    <Badge className="absolute top-3 left-3 bg-slate-950/80 text-white border border-white/10 text-xs">
                      {video.category || "Chưa phân loại"}
                    </Badge>

                    {/* Duration Badge */}
                    {(video.duration || video.extra) && (
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-slate-950/80 text-slate-200 text-xs font-mono flex items-center gap-1 border border-white/10">
                        <Clock className="w-3 h-3 text-indigo-400" />
                        {video.duration || video.extra}
                      </span>
                    )}

                    {/* YouTube ID Link */}
                    {video.video_id && (
                      <a
                        href={`https://www.youtube.com/watch?v=${video.video_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-black/70 text-slate-200 hover:text-white text-[11px] font-mono flex items-center gap-1"
                      >
                        <span>ID: {video.video_id}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <h3 className="font-bold text-base md:text-lg line-clamp-1">
                        {video.title}
                      </h3>
                      <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                        {video.description || "Chưa có mô tả"}
                      </p>
                      {video.software && (
                        <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium pt-1 truncate">
                          {video.software}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-border/60 flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditVideo(video)}
                        className="rounded-xl h-8 px-3 text-xs font-semibold"
                      >
                        <Edit className="w-3.5 h-3.5 mr-1.5" />
                        Chỉnh sửa
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteVideo(video.id)}
                        className="rounded-xl h-8 px-3 text-xs font-semibold text-rose-600 dark:text-rose-400 border-rose-500/25 hover:bg-rose-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                        Xóa
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredVideos.length === 0 && (
              <Card className="bg-card/60 border-dashed border-border py-14 text-center rounded-2xl">
                <CardContent className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-secondary mx-auto flex items-center justify-center text-muted-foreground">
                    <Video className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold">Không tìm thấy video nào</h3>
                  <p className="text-sm text-muted-foreground">
                    Hãy thử đổi từ khóa tìm kiếm hoặc thêm dự án video mới.
                  </p>
                  <Button
                    onClick={() => setShowAddVideo(true)}
                    className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white mt-2"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm Video đầu tiên
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === "categories" && (
          <CategoryManagement categories={categories} onCategoriesChange={fetchData} />
        )}

        {activeTab === "messages" && (
          <MessageManagement
            messages={messages}
            tableMissing={messagesTableMissing}
            onMessagesChange={fetchData}
          />
        )}

        {activeTab === "users" && (
          <UserManagement users={users} onUsersChange={fetchData} />
        )}

        {activeTab === "profile" && <ProfileManagement />}
      </main>

      {/* Add Video Modal */}
      <Dialog open={showAddVideo} onOpenChange={setShowAddVideo}>
        <DialogContent className="max-w-2xl rounded-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Thêm dự án Video mới</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddVideo} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="title">Tiêu đề Video *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                  placeholder="Nhập tiêu đề dự án"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="video_id">YouTube Video ID *</Label>
                <Input
                  id="video_id"
                  value={formData.video_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, video_id: e.target.value }))}
                  required
                  placeholder="VD: dQw4w9WgXcQ"
                  className="rounded-xl font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="category">Danh mục</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Chọn danh mục" />
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
              <div className="space-y-1.5">
                <Label htmlFor="extra">Thời lượng (Tùy chọn)</Label>
                <Input
                  id="extra"
                  value={formData.extra}
                  onChange={(e) => setFormData(prev => ({ ...prev, extra: e.target.value }))}
                  placeholder="VD: 02:15"
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="software">Phần mềm sử dụng</Label>
              <Input
                id="software"
                value={formData.software}
                onChange={(e) => setFormData(prev => ({ ...prev, software: e.target.value }))}
                placeholder="VD: CapCut PC, Premiere Pro, After Effects"
                className="rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Mô tả dự án</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Nhập mô tả chi tiết về dự án..."
                rows={3}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="thumbnail">Ảnh Thumbnail</Label>
              <Input
                id="thumbnail"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="cursor-pointer rounded-xl"
              />
              <p className="text-xs text-muted-foreground">
                Tải lên ảnh bìa 16:9 cho dự án video của bạn
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddVideo(false)}
                className="rounded-xl"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                Thêm Video
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Video Modal */}
      <Dialog open={showEditVideo} onOpenChange={setShowEditVideo}>
        <DialogContent className="max-w-2xl rounded-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Chỉnh sửa thông tin Video</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditVideo} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="edit-title">Tiêu đề Video *</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                  placeholder="Nhập tiêu đề dự án"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-video_id">YouTube Video ID *</Label>
                <Input
                  id="edit-video_id"
                  value={formData.video_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, video_id: e.target.value }))}
                  required
                  placeholder="Nhập YouTube Video ID"
                  className="rounded-xl font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="edit-category">Danh mục</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Chọn danh mục" />
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
              <div className="space-y-1.5">
                <Label htmlFor="edit-extra">Thời lượng (Tùy chọn)</Label>
                <Input
                  id="edit-extra"
                  value={formData.extra}
                  onChange={(e) => setFormData(prev => ({ ...prev, extra: e.target.value }))}
                  placeholder="VD: 02:00, 04:15"
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-software">Phần mềm sử dụng</Label>
              <Input
                id="edit-software"
                value={formData.software}
                onChange={(e) => setFormData(prev => ({ ...prev, software: e.target.value }))}
                placeholder="VD: CapCut PC, Premiere Pro, After Effects"
                className="rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-description">Mô tả dự án</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Nhập mô tả chi tiết..."
                rows={3}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-thumbnail">Ảnh Thumbnail</Label>

              {selectedVideo && selectedVideo.thumbnail_url && (
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-secondary/50 border border-border">
                  <div className="relative w-28 h-16 bg-slate-900 rounded-lg overflow-hidden shrink-0">
                    <img
                      src={selectedVideo.thumbnail_url}
                      alt="Current thumbnail"
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                      onError={(e) => {
                        e.target.src = '/placeholder.jpg'
                      }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <p className="font-semibold text-foreground">Thumbnail hiện tại</p>
                    <p>Chọn ảnh mới bên dưới nếu bạn muốn thay đổi.</p>
                  </div>
                </div>
              )}

              <Input
                id="edit-thumbnail"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="cursor-pointer rounded-xl"
              />

              {formData.thumbnail && formData.thumbnail instanceof File && (
                <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/25 rounded-xl">
                  <p className="text-xs text-indigo-600 dark:text-indigo-300">
                    <strong>Đã chọn file mới:</strong> {formData.thumbnail.name}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditVideo(false)}
                className="rounded-xl"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                Lưu cập nhật
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
