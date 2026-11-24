'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import {
  Phone,
  Mail,
  Facebook,
  Instagram,
  Rocket,
  CheckCircle,
  Building,
  Play,
  X,
  Send,
  Sun,
  Moon,
  Film,
  Sparkles,
  Search,
  Layers,
  Wand2,
  Palette,
  Clock,
  Eye,
  Calendar,
  ExternalLink,
  Copy,
  Check,
  Shield,
  ArrowUpRight,
  Video,
  Sliders,
  Volume2,
  Clapperboard,
  Menu,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import apiService from '@/lib/api'

const t = {
  EN: {
    wait: "Please wait a moment...",
    myName: "HO DUC DOAN",
    roleBadge: "Creative Video Editor & Visual Storyteller",
    available: "Available for Freelance & Studio Projects",
    navAbout: "About",
    navSkills: "Toolkit",
    navShowcase: "Portfolio",
    navRecent: "Recent",
    navContact: "Contact",
    exploreBtn: "Explore Portfolio",
    contact: "Start a Project",
    videoTools: "Video & Motion Stack",
    videoToolsDesc: "High-precision timeline editing, motion graphics, VFX compositing & color grading.",
    photoTools: "Photo & Design Stack",
    photoToolsDesc: "Thumbnail art direction, retouching, key visuals & brand graphics.",
    experience: "Years of Experience",
    experienceSub: "Commercial, Social & Cinematic",
    satisfaction: "Client Satisfaction",
    satisfactionSub: "On-time delivery & high retention",
    toeicSub: "Global client communication",
    workflowTitle: "Production & Field Skills",
    workflowSub: "Beyond the editing timeline — full-scale visual production on location",
    workflowBadge: "VIDEOGRAPHY • PHOTOGRAPHY • AERIAL DRONE",
    wf1Title: "Videography & Gimbal",
    wf1Tag: "Camera Operation",
    wf1Desc: "Dynamic camera movement, gimbal stabilization, and cinematic framing for events, travel, and commercial shoots.",
    wf2Title: "Professional Photography",
    wf2Tag: "Stills & Portraits",
    wf2Desc: "Capturing sharp portraits, event highlights, lifestyle moments, and high-impact visual assets.",
    wf3Title: "Flycam / Aerial Drone",
    wf3Tag: "Aerial Cinematography",
    wf3Desc: "Piloting drones for sweeping aerial perspectives, smooth tracking shots, and breathtaking landscape establecer cuts.",
    showcase: "Featured Portfolio",
    showcaseDesc: "Explore my curated video editing projects across commercial, cinematic, and social formats.",
    allCategories: "All Works",
    searchPlaceholder: "Search projects by title, tool, or style...",
    noVideosFound: "No projects match your current filter.",
    resetFilter: "Reset Filters",
    recent: "Latest Releases",
    recentDesc: "Freshly rendered cuts and recent collaborations from my editing suite.",
    tools: "Software Used",
    desc: "Project Overview",
    noDesc: "Crafted with precision editing, dynamic pacing, and custom sound design.",
    views: "views",
    date: "Released",
    years: "Years",
    love: "Ready to Elevate Your Next Video?",
    loveSub: "Let's collaborate to transform your raw footage into high-retention visual stories.",
    quickBriefTitle: "Send a Quick Project Brief",
    yourName: "Your Name / Brand",
    yourContact: "Your Email or Phone / Zalo",
    projectType: "Project Type (e.g., Commercial, Reels, YouTube, Wedding)",
    projectDetails: "Tell me about your timeline, style reference, or goals...",
    sendBrief: "Send Project Brief",
    sendingBrief: "Sending...",
    briefSentSuccess: "Your project brief has been sent! I'll contact you soon.",
    copied: "Copied to clipboard!",
    watchOnYoutube: "Watch on YouTube",
    closeModal: "Close Player",
    projectsCount: "projects",
    adminPortal: "Admin",
    showMore: "Show More",
    showLess: "Show Less"
  },
  VIE: {
    wait: "Please wait a moment...",
    myName: "HỒ ĐỨC ĐOAN",
    roleBadge: "Video Editor & Visual Storyteller",
    available: "Sẵn sàng nhận dự án Freelance & Hợp tác",
    navAbout: "Giới thiệu",
    navSkills: "Kỹ năng",
    navShowcase: "Dự án",
    navRecent: "Mới nhất",
    navContact: "Liên hệ",
    exploreBtn: "Xem Dự Án",
    contact: "Liên hệ hợp tác",
    videoTools: "Công cụ Dựng phim & Kỹ xảo",
    videoToolsDesc: "Dựng phim đa thể loại, chuyển cảnh mượt mà, Motion Graphics và chỉnh màu điện ảnh.",
    photoTools: "Công cụ Thiết kế & Hình ảnh",
    photoToolsDesc: "Thiết kế Thumbnail thu hút, retouch chân dung và xử lý đồ họa thương hiệu.",
    experience: "Năm kinh nghiệm",
    experienceSub: "TVC, Social Media & Cinematic",
    satisfaction: "Khách hàng hài lòng",
    satisfactionSub: "Đúng tiến độ & chất lượng cam kết",
    toeicSub: "Giao tiếp & đọc hiểu tài liệu quốc tế",
    workflowTitle: "Kỹ năng Sản xuất & Hiện trường",
    workflowSub: "Không chỉ hậu kỳ — làm chủ thiết bị ghi hình thực tế từ mặt đất đến bầu trời",
    workflowBadge: "QUAY VIDEO • CHỤP ẢNH • BAY FLYCAM",
    wf1Title: "Quay Video (Videography)",
    wf1Tag: "Quay phim & Gimbal",
    wf1Desc: "Làm chủ góc máy, bố cục khung hình và chuyển động Gimbal mượt mà cho dự án sự kiện, du lịch, phóng sự và TVC.",
    wf2Title: "Chụp Ảnh (Photography)",
    wf2Tag: "Nhiếp ảnh & Bố cục",
    wf2Desc: "Chụp ảnh chân dung, sự kiện, ngoại cảnh và sản phẩm với khả năng bắt khoảnh khắc tự nhiên, sắc nét.",
    wf3Title: "Bay Flycam (Aerial Drone)",
    wf3Tag: "Quay phim trên không",
    wf3Desc: "Điều khiển Flycam chuyên nghiệp, mang lại những cú máy toàn cảnh từ trên cao hùng vĩ và đậm chất điện ảnh.",
    showcase: "Dự án Nổi bật",
    showcaseDesc: "Khám phá các sản phẩm được đầu tư tỉ mỉ về nhịp điệu, màu sắc và cảm xúc thị giác.",
    allCategories: "Tất cả dự án",
    searchPlaceholder: "Tìm kiếm dự án theo tên, mô tả...",
    noVideosFound: "Không tìm thấy dự án nào phù hợp với bộ lọc hiện tại.",
    resetFilter: "Xem tất cả dự án",
    recent: "Dự án Gần đây",
    recentDesc: "Những sản phẩm mới nhất vừa được hoàn thiện và xuất bản.",
    tools: "Công cụ sử dụng",
    desc: "Mô tả dự án",
    noDesc: "Sản phẩm được hoàn thiện kỹ lưỡng về nhịp dựng, màu sắc và âm thanh.",
    views: "lượt xem",
    date: "Ngày đăng",
    years: "Năm",
    love: "Bạn ấn tượng với phong cách của tôi?",
    loveSub: "Hãy kết nối ngay để cùng tạo nên những sản phẩm video chất lượng và bứt phá lượt xem.",
    quickBriefTitle: "Gửi yêu cầu dự án nhanh",
    yourName: "Tên của bạn / Thương hiệu",
    yourContact: "Email hoặc Số điện thoại / Zalo liên hệ",
    projectType: "Thể loại video (VD: Reels/TikTok, YouTube, TVC, Sự kiện...)",
    projectDetails: "Chia sẻ ngắn gọn về ý tưởng, số lượng video hoặc thời gian mong muốn...",
    sendBrief: "Gửi yêu cầu dự án",
    sendingBrief: "Đang gửi...",
    briefSentSuccess: "Đã gửi yêu cầu dự án thành công! Tôi sẽ liên hệ lại sớm nhất.",
    copied: "Đã sao chép!",
    watchOnYoutube: "Mở trên YouTube",
    closeModal: "Đóng",
    projectsCount: "dự án",
    adminPortal: "Quản trị",
    showMore: "Xem thêm",
    showLess: "Thu gọn"
  }
}

// Zalo Icon Component
function ZaloIcon({ className = "w-5 h-5" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className={className}>
      <g fill="none" fillRule="nonzero">
        <path
          transform="scale(5.33333,5.33333)"
          d="M29,43h-10c-7.732,0 -14,-6.268 -14,-14v-10c0,-5.88471 3.63593,-10.91138 8.78037,-12.98053c0.00188,-0.00182 0.00375,-0.00365 0.00563,-0.00547c1.613,-0.648 3.369,-1.014 5.214,-1.014h10c7.732,0 14,6.268 14,14v10c0,3.014 -0.962,5.799 -2.583,8.084c-0.00623,0.00379 -0.01246,0.00759 -0.0187,0.01137c-2.53574,3.56814 -6.6879,5.90463 -11.3983,5.90463z"
          fill="#2962ff"
        />
        <g transform="scale(5.33333,5.33333)">
          <path
            d="M29,5h-10c-1.845,0 -3.601,0.366 -5.214,1.014c-3.333,3.236 -5.786,8.514 -5.786,12.986c0,6.771 0.936,10.735 3.712,14.607c0.216,0.301 0.357,0.653 0.376,1.022c0.043,0.835 -0.129,2.365 -1.634,3.742c-0.162,0.148 -0.059,0.419 0.16,0.428c0.942,0.041 2.843,-0.014 4.797,-0.877c0.557,-0.246 1.191,-0.203 1.729,0.083c3.313,1.759 7.193,1.995 10.86,1.995c4.676,0 9.339,-1.04 12.417,-2.916c1.621,-2.285 2.583,-5.07 2.583,-8.084v-10c0,-7.732 -6.268,-14 -14,-14z"
            fill="#ffffff"
          />
          <path
            d="M36.75,27c-2.067,0 -3.75,-1.683 -3.75,-3.75c0,-2.067 1.683,-3.75 3.75,-3.75c2.067,0 3.75,1.683 3.75,3.75c0,2.067 -1.683,3.75 -3.75,3.75zM36.75,21c-1.24,0 -2.25,1.01 -2.25,2.25c0,1.24 1.01,2.25 2.25,2.25c1.24,0 2.25,-1.01 2.25,-2.25c0,-1.24 -1.01,-2.25 -2.25,-2.25z"
            fill="#2962ff"
          />
          <path d="M31.5,27h-1c-0.276,0 -0.5,-0.224 -0.5,-0.5v-8.5h1.5z" fill="#2962ff" />
          <path
            d="M27,19.75v0.519c-0.629,-0.476 -1.403,-0.769 -2.25,-0.769c-2.067,0 -3.75,1.683 -3.75,3.75c0,2.067 1.683,3.75 3.75,3.75c0.847,0 1.621,-0.293 2.25,-0.769v0.269c0,0.276 0.224,0.5 0.5,0.5h1v-7.25zM24.75,25.5c-1.24,0 -2.25,-1.01 -2.25,-2.25c0,-1.24 1.01,-2.25 2.25,-2.25c1.24,0 2.25,1.01 2.25,2.25c0,1.24 -1.01,2.25 -2.25,2.25z"
            fill="#2962ff"
          />
          <path
            d="M21.25,18h-8v1.5h5.321l-5.571,6.5h0.026c-0.163,0.211 -0.276,0.463 -0.276,0.75v0.25h7.5c0.276,0 0.5,-0.224 0.5,-0.5v-1h-5.321l5.571,-6.5h-0.026c0.163,-0.211 0.276,-0.463 0.276,-0.75z"
            fill="#2962ff"
          />
        </g>
      </g>
    </svg>
  )
}

// Helper to split comma-separated software tools into clean badges
function parseTools(toolsString, fallback = "CapCut PC, Premiere Pro, After Effects") {
  const raw = toolsString && toolsString.trim() ? toolsString : fallback
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

// Live Studio Clock Component
function LiveStudioClock() {
  const [timeStr, setTimeStr] = useState('')

  useEffect(() => {
    const updateClock = () => {
      const now = new Date()
      const hh = String(now.getHours()).padStart(2, '0')
      const mm = String(now.getMinutes()).padStart(2, '0')
      const ss = String(now.getSeconds()).padStart(2, '0')
      setTimeStr(`${hh}:${mm}:${ss}`)
    }
    updateClock()
    const interval = setInterval(updateClock, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-2">
      {/* <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" /> */}
      <Clock className="w-3.5 h-3.5 text-indigo-500" />
      <span className="font-semibold text-foreground tabular-nums">
        {timeStr || '00:00:00'}
      </span>
    </div>
  )
}

// Cinema Theater Video Modal Component
function VideoModal({ isOpen, onClose, videoId, title, software, description, category, duration, lang }) {
  if (!isOpen || !videoId) return null

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3`
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`
  const toolsList = parseTools(software)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] p-0 overflow-hidden bg-card/95 dark:bg-slate-900/95 border border-border/90 text-foreground shadow-2xl rounded-3xl backdrop-blur-xl [&>button]:hidden">
        {/* Top Accent Gradient Bar */}
        <div className="h-1 w-full bg-gradient-to-r from-indigo-600 via-blue-500 to-purple-600" />

        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 md:px-6 py-3.5 bg-card/90 dark:bg-slate-900/90 border-b border-border/70">
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex h-2.5 w-2.5 shrink-0 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
            <DialogHeader className="p-0 text-left min-w-0">
              <DialogTitle className="text-base md:text-lg font-extrabold text-foreground truncate">
                {title}
              </DialogTitle>
            </DialogHeader>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-500/20 transition-all"
            >
              <span>{t[lang].watchOnYoutube}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <Button
              variant="outline"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-xl border-border/80 text-muted-foreground hover:text-rose-600 hover:border-rose-500/40 hover:bg-rose-500/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* 16:9 Video Player */}
        <div className="relative w-full bg-black" style={{ paddingBottom: "56.25%" }}>
          <iframe
            src={embedUrl}
            title={title}
            className="absolute top-0 left-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Metadata Footer */}
        <div className="p-5 md:p-6 bg-secondary/35 dark:bg-slate-900/95 border-t border-border/70 flex flex-col md:flex-row gap-5 justify-between items-start">
          <div className="space-y-1.5 flex-1">
            <div className="text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-2">
              <Film className="w-3.5 h-3.5" />
              <span>{t[lang].desc}</span>
              {duration && duration !== 'N/A' && (
                <span className="text-muted-foreground font-mono">• {duration}</span>
              )}
            </div>
            <p className="text-sm md:text-base text-foreground/90 leading-relaxed whitespace-pre-line">
              {description && description.trim() !== (title || '').trim()
                ? description
                : t[lang].noDesc}
            </p>
          </div>

          <div className="w-full md:w-72 shrink-0 space-y-2.5 bg-card dark:bg-slate-950/70 p-4 rounded-2xl border border-border/80 shadow-sm">
            <div className="text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1.5">
              <Wand2 className="w-3.5 h-3.5" />
              <span>{t[lang].tools}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {toolsList.map((tool, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-500/10 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300 border border-indigo-500/20"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function VideoEditorPortfolio() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [allVideos, setAllVideos] = useState([])
  const [currentData, setCurrentData] = useState([])
  const [categories, setCategories] = useState([])
  const [recentProjects, setRecentProjects] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [videosLoading, setVideosLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(6)
  const [copiedField, setCopiedField] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sendingBrief, setSendingBrief] = useState(false)
  const [briefForm, setBriefForm] = useState({
    name: '',
    contactInfo: '',
    projectType: '',
    details: ''
  })
  const [videoModal, setVideoModal] = useState({
    isOpen: false,
    videoId: null,
    title: "",
    software: "",
    description: "",
    category: "",
    duration: ""
  })
  const [lang, setLang] = useState('EN')

  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, categoriesData, allVideosData, recentData] = await Promise.all([
          apiService.getProfile(),
          apiService.getCategories(),
          apiService.getVideos({ all: 'true' }),
          apiService.getRecentVideos(4)
        ])

        if (profileData.success && profileData.data) {
          setProfile(profileData.data)
        }

        let mappedCategories = []
        if (categoriesData.success) {
          mappedCategories = categoriesData.data.map((cat) => ({
            id: cat.id,
            name: cat.name,
            description: cat.description,
            color: cat.color || '#6366f1',
            created_at: cat.created_at,
          }))
          setCategories(mappedCategories)
        }

        const defaultCat =
          mappedCategories.find(
            (cat) =>
              cat.id === 1 ||
              (cat.name || '').toLowerCase().includes('my fav')
          ) || mappedCategories[0]

        if (defaultCat) {
          setActiveCategory(defaultCat.id)
        }

        if (allVideosData.success && allVideosData.data?.videos) {
          const mappedVideos = allVideosData.data.videos.map((video) => ({
            ...video,
            thumbnail: video.thumbnail || video.thumbnail_url || "/images/default-video-thumb.jpg",
            duration: video.duration || video.extra || null,
          }))
          setAllVideos(mappedVideos)

          if (defaultCat) {
            const initialFiltered = mappedVideos.filter(
              (v) =>
                (v.category || '').trim().toLowerCase() ===
                (defaultCat.name || '').trim().toLowerCase()
            )
            setCurrentData(initialFiltered)
          } else {
            setCurrentData(mappedVideos)
          }
        }

        if (recentData.success && recentData.data) {
          setRecentProjects(
            recentData.data.map((video) => ({
              ...video,
              thumbnail: video.thumbnail || video.thumbnail_url || "/images/default-video-thumb.jpg",
              views: video.views ? `${video.views}K` : null,
              date: video.date || "N/A",
            }))
          )
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Handle category change
  const handleCategoryChange = async (categoryId) => {
    setActiveCategory(categoryId)
    setVisibleCount(6)
    if (categoryId === 'ALL') {
      setCurrentData(allVideos)
      return
    }

    const selectedCat = categories.find((cat) => cat.id === categoryId)
    const categoryName = selectedCat?.name || ''

    // Filter immediately from allVideos if loaded, otherwise fetch from API
    if (allVideos.length > 0) {
      const filtered = allVideos.filter(
        (v) => (v.category || '').toLowerCase() === categoryName.toLowerCase()
      )
      setCurrentData(filtered)
    } else {
      setVideosLoading(true)
      try {
        const data = await apiService.getVideosByCategory(categoryName)
        if (data.success) {
          setCurrentData(
            data.data.videos.map((video) => ({
              ...video,
              thumbnail: video.thumbnail || "/backgroundVideo/1.jpg",
              duration: video.duration || null,
            }))
          )
        }
      } catch (error) {
        console.error("Error fetching category data:", error)
      } finally {
        setVideosLoading(false)
      }
    }
  }

  // Filter currentData by searchQuery
  const displayedVideos = useMemo(() => {
    if (!searchQuery.trim()) return currentData
    const q = searchQuery.toLowerCase().trim()
    return currentData.filter(
      (item) =>
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.software && item.software.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q))
    )
  }, [currentData, searchQuery])

  // Category count helper
  const getCategoryCount = (catName) => {
    if (!allVideos.length) return null
    return allVideos.filter(
      (v) => (v.category || '').toLowerCase() === (catName || '').toLowerCase()
    ).length
  }

  const openVideoModal = (item) => {
    setVideoModal({
      isOpen: true,
      videoId: item.video_id,
      title: item.title,
      software: item.software,
      description: item.description,
      category: item.category,
      duration: item.duration
    })
  }

  const closeVideoModal = () => {
    setVideoModal({
      isOpen: false,
      videoId: null,
      title: "",
      software: "",
      description: "",
      category: "",
      duration: ""
    })
  }

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    toast.success(t[lang].copied)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleSendBrief = async (e) => {
    e.preventDefault()
    setSendingBrief(true)
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: briefForm.name,
          contact_info: briefForm.contactInfo,
          project_type: briefForm.projectType,
          details: briefForm.details
        })
      })
      const result = await response.json()

      if (result.success) {
        toast.success(t[lang].briefSentSuccess)
        setBriefForm({ name: '', contactInfo: '', projectType: '', details: '' })
      } else if (result.tableMissing) {
        // Fallback to mailto if SQL table hasn't been initialized yet
        const targetEmail = profile?.email || 'ducdoan04.work@gmail.com'
        const subject = encodeURIComponent(
          `[Portfolio Inquiry] ${briefForm.projectType || 'Video Editing Project'} - ${briefForm.name || 'Client'}`
        )
        const body = encodeURIComponent(
          `Xin chào Đoan,\n\nTôi là: ${briefForm.name}\nLiên hệ: ${briefForm.contactInfo}\nThể loại dự án: ${briefForm.projectType}\n\nChi tiết dự án:\n${briefForm.details}\n`
        )
        window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`
      } else {
        toast.error(result.message || 'Gửi yêu cầu thất bại, vui lòng thử lại.')
      }
    } catch (error) {
      console.error('Send brief error:', error)
      toast.error('Lỗi kết nối server')
    } finally {
      setSendingBrief(false)
    }
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  const phoneValue = profile?.phone || '+84919261712'
  const emailValue = profile?.email || 'ducdoan04.work@gmail.com'
  const facebookUrl = profile?.facebook_url || 'https://www.facebook.com/ducdoan.24'
  const instagramUrl = profile?.instagram_url || 'https://www.instagram.com/ducdoan.04/'
  const zaloUrl = profile?.zalo_url || 'https://zalo.me/0919261712'
  const videoToolsList = parseTools(profile?.video_tools, 'CapCut PC, Premiere Pro, After Effects')
  const photoToolsList = parseTools(profile?.photo_tools, 'Photoshop, Illustrator, Evoto')

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col items-center">
          {/* Speech Bubble */}
          <div className="relative mb-5 bg-card/95 backdrop-blur-md border border-border px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
            </span>
            <p className="text-foreground text-sm md:text-base font-medium">
              {t[lang].wait}
            </p>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-card border-r border-b border-border rotate-45" />
          </div>

          {/* Seamless Circular Avatar GIF */}
          <div className="w-44 h-44 rounded-full bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 p-1 shadow-2xl shadow-indigo-500/25">
            <div className="w-full h-full rounded-full bg-[#fbfbf9] flex items-center justify-center overflow-hidden">
              <Image
                src="/images/loding-gif.gif"
                alt="Loading"
                width={320}
                height={320}
                className="w-full h-full object-cover scale-105"
                unoptimized={true}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden bg-studio-grid">
      {/* Ambient Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[450px] h-[450px] rounded-full bg-indigo-500/15 dark:bg-indigo-500/15 blur-[130px] pointer-events-none z-0" />
      <div className="fixed top-[35%] right-[-10%] w-[400px] h-[400px] rounded-full bg-blue-500/10 dark:bg-cyan-500/10 blur-[130px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-purple-500/10 dark:bg-purple-600/10 blur-[140px] pointer-events-none z-0" />

      {/* Floating Glass Navbar */}
      <header className="sticky top-0 z-50 w-full px-4 pt-3 pb-2">
        <nav className="max-w-6xl mx-auto bg-card/80 dark:bg-slate-900/75 backdrop-blur-xl border border-border/80 rounded-2xl px-4 md:px-6 h-16 flex items-center justify-between shadow-lg shadow-black/[0.03] dark:shadow-black/30">
          {/* Brand Logo */}
          <a href="#about" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Clapperboard className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-sm md:text-base leading-none">
                DEV<span className="text-indigo-600 dark:text-indigo-400">STU</span>
              </span>
              <span className="text-[11px] text-muted-foreground font-mono mt-0.5">
                VIDEO EDITOR
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { href: '#about', label: t[lang].navAbout },
              { href: '#skills', label: t[lang].navSkills },
              { href: '#showcase', label: t[lang].navShowcase },
              { href: '#recent', label: t[lang].navRecent },
              { href: '#contact', label: t[lang].navContact },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-3.5 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/70 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right Controls: Language, Theme, Admin, CTA */}
          <div className="flex items-center gap-2">
            {/* Language Switch */}
            <div className="bg-secondary/80 p-1 rounded-xl flex items-center border border-border/60">
              <button
                onClick={() => setLang('VIE')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${lang === 'VIE'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                VIE
              </button>
              <button
                onClick={() => setLang('EN')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${lang === 'EN'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                EN
              </button>
            </div>

            {/* Theme Toggle */}
            {mounted && (
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="h-9 w-9 rounded-xl bg-secondary/60 border-border/60 hover:bg-secondary"
                aria-label="Toggle theme"
              >
                {resolvedTheme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700" />
                )}
              </Button>
            )}

            {/* Admin Portal Link */}
            {/* <Button
              variant="ghost"
              size="icon"
              onClick={() => (window.location.href = '/admin')}
              className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground"
              title={t[lang].adminPortal}
            >
              <Shield className="w-4 h-4" />
            </Button> */}

            {/* Primary CTA (Desktop) */}
            <a href="#contact" className="hidden sm:block">
              <Button className="h-9 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs md:text-sm font-semibold shadow-md shadow-indigo-500/20">
                {t[lang].contact}
              </Button>
            </a>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9 rounded-xl"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </nav>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden max-w-6xl mx-auto mt-2 bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-4 shadow-xl flex flex-col gap-2">
            {[
              { href: '#about', label: t[lang].navAbout },
              { href: '#skills', label: t[lang].navSkills },
              { href: '#showcase', label: t[lang].navShowcase },
              { href: '#recent', label: t[lang].navRecent },
              { href: '#contact', label: t[lang].navContact },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-secondary transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* Main Content Container */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-8 pb-16 space-y-12 md:space-y-16">
        {/* ================= HERO SECTION ================= */}
        <section id="about" className="scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Bio & Actions */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Availability Badge */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>{t[lang].available}</span>
              </div>

              {/* Greeting & Name */}
              <div className="space-y-2">
                <p className="text-indigo-600 dark:text-indigo-400 font-semibold text-base md:text-lg tracking-wide">
                  {lang === 'VIE' && profile?.greeting_vi
                    ? profile.greeting_vi
                    : profile?.greeting || "Hi there, I'm"}
                </p>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-none">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-800 to-indigo-600 dark:from-white dark:via-slate-100 dark:to-indigo-400">
                    {t[lang].myName || profile?.name || "HO DUC DOAN"}
                  </span>
                </h1>
                <div className="pt-1 flex items-center justify-center lg:justify-start gap-2 text-muted-foreground font-medium text-sm md:text-base">
                  <Film className="w-4 h-4 text-indigo-500" />
                  <span>{t[lang].roleBadge}</span>
                </div>
              </div>

              {/* Bio Description */}
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0 whitespace-pre-line">
                {lang === 'VIE' && profile?.description_vi
                  ? profile.description_vi
                  : profile?.description ||
                  "I'm Doan, a passionate video editor with 3+ years of experience crafting commercial, cinematic, and high-retention social media content. Check out my work to see how I bring stories to life."}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <a href="#showcase">
                  <Button
                    size="lg"
                    className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-7 h-12 font-semibold shadow-lg shadow-indigo-500/25 flex items-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>{t[lang].exploreBtn}</span>
                  </Button>
                </a>
                <a href="#contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-xl px-6 h-12 font-semibold border-border/80 bg-card/60 hover:bg-secondary flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{t[lang].contact}</span>
                  </Button>
                </a>
              </div>

              {/* Social & Direct Contact Strip */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-card border border-border hover:border-blue-500/50 hover:bg-blue-500/5 transition-all text-xs font-medium shadow-sm"
                >
                  <Facebook className="w-4 h-4 text-blue-600" />
                  <span>Facebook</span>
                </a>
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-card border border-border hover:border-pink-500/50 hover:bg-pink-500/5 transition-all text-xs font-medium shadow-sm"
                >
                  <Instagram className="w-4 h-4 text-pink-500" />
                  <span>Instagram</span>
                </a>
                <a
                  href={zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-card border border-border hover:border-blue-500/50 hover:bg-blue-500/5 transition-all text-xs font-medium shadow-sm"
                >
                  <ZaloIcon className="w-4 h-4" />
                  <span>Zalo</span>
                </a>
                <a
                  href={`tel:${phoneValue}`}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-card border border-border hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all text-xs font-medium shadow-sm"
                >
                  <Phone className="w-4 h-4 text-emerald-500" />
                  <span>{phoneValue}</span>
                </a>
              </div>
            </div>

            {/* Right Column: Cinematic Studio Portrait Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm">
                {/* Decorative Back Frame */}
                <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-indigo-500/25 via-blue-500/15 to-purple-500/25 blur-xl pointer-events-none" />

                <div className="relative rounded-3xl bg-card/90 dark:bg-slate-900/90 border border-border/90 p-4 shadow-2xl backdrop-blur-xl">
                  {/* Top Monitor HUD Bar */}
                  <div className="flex items-center justify-between px-2 pb-3 mb-3 border-b border-border/60 text-xs font-mono text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="font-semibold text-foreground">REC</span>
                      <LiveStudioClock />
                    </div>
                    <span className="px-2 py-0.5 rounded bg-secondary text-[11px] font-semibold text-foreground">
                      4K • 60FPS
                    </span>
                  </div>

                  {/* Portrait Container with Real Clapperboard Background & 3D Floating Icons */}
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#070B14] border border-border/60 select-none group/scene">
                    {/* 1. Real Clapperboard Studio Background Image */}
                    <img
                      src="/images/avatar-bg.jpg"
                      alt="Studio Backdrop"
                      className="absolute inset-0 w-full h-full object-cover scale-[1.02] filter brightness-95"
                    />

                    {/* 2. Sky-Blue / Cyan Rim-Light Glow Behind Subject */}
                    <div className="absolute top-[42%] left-[54%] -translate-x-1/2 -translate-y-1/2 w-[58%] h-[58%] rounded-full bg-[#2ea8ff]/45 blur-2xl pointer-events-none z-[5]" />
                    <div className="absolute top-[28%] left-[58%] -translate-x-1/2 -translate-y-1/2 w-[38%] h-[38%] rounded-full bg-cyan-300/40 blur-2xl pointer-events-none z-[5]" />

                    {/* 3. All 5 Floating 3D Software Icons (Layer z-10, Behind Subject Cutout) */}
                    {/* After Effects (Ae) - Upper Left */}
                    <div
                      className="animate-float-ae absolute top-[21%] left-[12%] z-10 w-[23%] aspect-square rounded-[22%] overflow-hidden drop-shadow-[0_0_22px_rgba(75,95,255,0.85)] after:content-[''] after:absolute after:inset-0 after:rounded-[22%] after:shadow-[inset_0_4px_8px_rgba(255,255,255,0.45),inset_0_-6px_10px_rgba(0,0,0,0.65)] after:pointer-events-none"
                      title="Adobe After Effects"
                    >
                      <img
                        src="/logo app/Adobe_After_Effects_CC_icon.png"
                        alt="After Effects"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* CapCut - Upper Right (Tucked behind right side of head with 3D Bevel & Cyan Glow) */}
                    <div
                      className="animate-float-cc absolute top-[7%] right-[15%] z-10 w-[23%] aspect-square rounded-[22%] overflow-hidden drop-shadow-[0_0_24px_rgba(56,189,248,0.9)] after:content-[''] after:absolute after:inset-0 after:rounded-[22%] after:shadow-[inset_0_4px_8px_rgba(255,255,255,1),inset_0_-7px_12px_rgba(2,132,199,0.65),inset_0_0_10px_rgba(56,189,248,0.4)] after:border after:border-white/70 after:pointer-events-none"
                      title="CapCut PC"
                    >
                      <img
                        src="/logo app/cc.png"
                        alt="CapCut"
                        className="w-full h-full object-cover scale-[1.21] filter contrast-105 brightness-95"
                      />
                    </div>

                    {/* Premiere Pro (Pr) - Middle Right (Tucked behind left shoulder) */}
                    <div
                      className="animate-float-pr absolute top-[40%] right-[4%] z-10 w-[23%] aspect-square rounded-[22%] overflow-hidden opacity-90 drop-shadow-[0_0_25px_rgba(65,105,255,0.9)] after:content-[''] after:absolute after:inset-0 after:rounded-[22%] after:shadow-[inset_0_4px_8px_rgba(255,255,255,0.4),inset_0_-6px_10px_rgba(0,0,0,0.7)] after:pointer-events-none"
                      title="Adobe Premiere Pro"
                    >
                      <img
                        src="/logo app/Adobe_Premiere_Pro_CC_icon.png"
                        alt="Premiere Pro"
                        className="w-full h-full object-cover scale-[1.03]"
                      />
                    </div>

                    {/* Photoshop (Ps) - Bottom Left (Tucked behind right arm) */}
                    <div
                      className="animate-float-ps absolute bottom-[6%] left-[1.5%] z-10 w-[26.5%] aspect-square rounded-[22%] overflow-hidden drop-shadow-[0_0_25px_rgba(49,168,255,0.85)] after:content-[''] after:absolute after:inset-0 after:rounded-[22%] after:shadow-[inset_0_4px_8px_rgba(255,255,255,0.45),inset_0_-6px_10px_rgba(0,0,0,0.65)] after:pointer-events-none"
                      title="Adobe Photoshop"
                    >
                      <img
                        src="/logo app/Adobe_Photoshop_CC_icon.png"
                        alt="Photoshop"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Illustrator (Ai) - Bottom Right Corner */}
                    <div
                      className="animate-float-ai absolute -bottom-[7%] -right-[7%] z-10 w-[35%] aspect-square flex items-center justify-center pointer-events-none"
                      title="Adobe Illustrator"
                    >
                      <img
                        src="/logo app/ai.png"
                        alt="Illustrator"
                        className="w-full h-full object-contain drop-shadow-[0_0_22px_rgba(255,154,0,0.7)]"
                      />
                    </div>

                    {/* 4. Main Cutout Portrait Image (Foreground z-20, overlapping icons) */}
                    <div className="relative z-20 w-full h-full flex items-end justify-center pointer-events-none">
                      <Image
                        src={profile?.avatar_url || "/images/profile-photo-1.png"}
                        alt={profile?.name || "Ho Duc Doan"}
                        width={500}
                        height={500}
                        className="w-[82%] h-[96%] object-contain object-bottom drop-shadow-[0_-2px_18px_rgba(56,189,248,0.35)] group-hover/scene:scale-[1.03] transition-transform duration-700"
                        unoptimized={!!profile?.avatar_url}
                      />
                    </div>
                  </div>

                  {/* Mini Tool Pills inside Studio Card */}
                  <div className="mt-3.5 pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-muted-foreground">Core Suite:</span>
                    <div className="flex flex-wrap justify-end gap-1.5">
                      {videoToolsList.slice(0, 3).map((tool, i) => (
                        <span
                          key={i}
                          className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= BENTO STATS & TOOLKIT SECTION ================= */}
        <section id="skills" className="scroll-mt-24 space-y-5">
          {/* 3 Bento Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card className="bg-card/80 backdrop-blur-md border-border/80 hover:border-indigo-500/40 transition-all shadow-sm overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-28 h-28 bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-indigo-500/20 transition-all" />
              <CardContent className="p-6 flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 text-indigo-600 dark:text-indigo-400">
                  <Rocket className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-3xl font-extrabold tracking-tight">
                    {profile?.experience_years ?? 3}+ {t[lang].years}
                  </div>
                  <div className="text-sm font-semibold text-foreground mt-0.5">
                    {t[lang].experience}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {t[lang].experienceSub}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-md border-border/80 hover:border-emerald-500/40 transition-all shadow-sm overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-emerald-500/20 transition-all" />
              <CardContent className="p-6 flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-3xl font-extrabold tracking-tight">
                    {profile?.satisfaction_rate ?? 99}%
                  </div>
                  <div className="text-sm font-semibold text-foreground mt-0.5">
                    {t[lang].satisfaction}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {t[lang].satisfactionSub}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-md border-border/80 hover:border-blue-500/40 transition-all shadow-sm overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-blue-500/20 transition-all" />
              <CardContent className="p-6 flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400">
                  <Building className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-3xl font-extrabold tracking-tight">
                    {profile?.toeic_score ?? 600}+
                  </div>
                  <div className="text-sm font-semibold text-foreground mt-0.5">
                    TOEIC Certificate
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {t[lang].toeicSub}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Software Stack Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Card className="bg-card/80 backdrop-blur-md border-border/80 shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
                      <Video className="w-4 h-4" />
                      <span>Post-Production</span>
                    </div>
                    <h3 className="text-xl font-bold">{t[lang].videoTools}</h3>
                    <p className="text-sm text-muted-foreground">{t[lang].videoToolsDesc}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {videoToolsList.map((tool, index) => (
                    <div
                      key={index}
                      className="px-3.5 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-sm font-semibold flex items-center gap-2"
                    >
                      <span className="w-2 h-2 rounded-full bg-indigo-500" />
                      <span>{tool}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-md border-border/80 shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider">
                      <Palette className="w-4 h-4" />
                      <span>Visual & Graphics</span>
                    </div>
                    <h3 className="text-xl font-bold">{t[lang].photoTools}</h3>
                    <p className="text-sm text-muted-foreground">{t[lang].photoToolsDesc}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {photoToolsList.map((tool, index) => (
                    <div
                      key={index}
                      className="px-3.5 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300 text-sm font-semibold flex items-center gap-2"
                    >
                      <span className="w-2 h-2 rounded-full bg-purple-500" />
                      <span>{tool}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Production & Field Skills Strip (Quay Video, Chụp Ảnh, Bay Flycam) */}
          <Card className="bg-card/80 backdrop-blur-md border-border/80 shadow-sm overflow-hidden">
            <CardContent className="p-6 md:p-8 space-y-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>Multi-Disciplinary Creator</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold">{t[lang].workflowTitle}</h3>
                  <p className="text-sm text-muted-foreground">{t[lang].workflowSub}</p>
                </div>
                <Badge variant="outline" className="w-fit text-xs font-mono px-3 py-1 bg-secondary/50">
                  {t[lang].workflowBadge}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* 1. Quay Video */}
                <div className="group p-5 rounded-2xl bg-secondary/45 hover:bg-secondary/70 border border-border/70 hover:border-indigo-500/40 transition-all space-y-3.5 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                      <Video className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20">
                      {t[lang].wf1Tag}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-base md:text-lg">{t[lang].wf1Title}</h4>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                      {t[lang].wf1Desc}
                    </p>
                  </div>
                </div>

                {/* 2. Chụp Ảnh */}
                <div className="group p-5 rounded-2xl bg-secondary/45 hover:bg-secondary/70 border border-border/70 hover:border-purple-500/40 transition-all space-y-3.5 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-5 h-5"
                      >
                        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                        <circle cx="12" cy="13" r="3" />
                      </svg>
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20">
                      {t[lang].wf2Tag}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-base md:text-lg">{t[lang].wf2Title}</h4>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                      {t[lang].wf2Desc}
                    </p>
                  </div>
                </div>

                {/* 3. Bay Flycam */}
                <div className="group p-5 rounded-2xl bg-secondary/45 hover:bg-secondary/70 border border-border/70 hover:border-cyan-500/40 transition-all space-y-3.5 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:scale-105 transition-transform">
                      {/* Quadcopter Drone SVG Icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-5 h-5"
                      >
                        <path d="M10 10 5 5" />
                        <path d="m14 10 5-5" />
                        <path d="m14 14 5 5" />
                        <path d="m10 14-5 5" />
                        <rect width="4" height="4" x="10" y="10" rx="1" />
                        <circle cx="5" cy="5" r="2.5" />
                        <circle cx="19" cy="5" r="2.5" />
                        <circle cx="19" cy="19" r="2.5" />
                        <circle cx="5" cy="19" r="2.5" />
                      </svg>
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/20">
                      {t[lang].wf3Tag}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-base md:text-lg">{t[lang].wf3Title}</h4>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                      {t[lang].wf3Desc}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ================= PORTFOLIO SHOWCASE SECTION ================= */}
        <section id="showcase" className="scroll-mt-24 space-y-6">
          {/* Section Header & Search Bar */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Showreel & Works</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                {t[lang].showcase}
              </h2>
              <p className="text-muted-foreground text-sm md:text-base">
                {t[lang].showcaseDesc}
              </p>
            </div>

            {/* Live Search Box */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setVisibleCount(6)
                }}
                placeholder={t[lang].searchPlaceholder}
                className="pl-10 pr-9 h-11 rounded-xl bg-card/80 border-border/80"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setVisibleCount(6)
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {categories.map((category) => {
              const isActive = activeCategory === category.id
              const count = getCategoryCount(category.name)
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                    : 'bg-card border border-border/80 text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                    }`}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: isActive ? '#ffffff' : category.color || '#6366f1' }}
                  />
                  <span>{category.name}</span>
                  {count !== null && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-md ${isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-secondary text-muted-foreground'
                        }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              )
            })}

            <button
              onClick={() => handleCategoryChange('ALL')}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${activeCategory === 'ALL'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                : 'bg-card border border-border/80 text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                }`}
            >
              <span>{t[lang].allCategories}</span>
              {allVideos.length > 0 && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-md ${activeCategory === 'ALL'
                    ? 'bg-white/20 text-white'
                    : 'bg-secondary text-muted-foreground'
                    }`}
                >
                  {allVideos.length}
                </span>
              )}
            </button>
          </div>

          {/* Video Grid */}
          {videosLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={`skeleton-${index}`} className="overflow-hidden border-border/60 animate-pulse">
                  <div className="aspect-video w-full bg-muted" />
                  <CardContent className="p-5 space-y-3">
                    <div className="h-5 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : displayedVideos.length === 0 ? (
            <Card className="bg-card/60 border-dashed border-border py-16 text-center">
              <CardContent className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-secondary mx-auto flex items-center justify-center text-muted-foreground">
                  <Film className="w-7 h-7" />
                </div>
                <p className="text-muted-foreground font-medium">{t[lang].noVideosFound}</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setActiveCategory('ALL')
                    setSearchQuery('')
                    setCurrentData(allVideos)
                  }}
                  className="rounded-xl"
                >
                  {t[lang].resetFilter}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedVideos.slice(0, visibleCount).map((item, index) => {
                  const itemTools = parseTools(item.software)
                  return (
                    <Card
                      key={item.id || index}
                      onClick={() => openVideoModal(item)}
                      className="group cursor-pointer overflow-hidden rounded-2xl bg-card/85 backdrop-blur-md border-border/80 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col"
                    >
                      {/* 16:9 Thumbnail Container */}
                      <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          crossOrigin="anonymous"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = "/images/default-video-thumb.jpg"
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

                        {/* Category Pill */}
                        {item.category && (
                          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/75 backdrop-blur-md text-white text-[11px] font-semibold border border-white/10">
                            {item.category}
                          </span>
                        )}

                        {/* Duration Badge */}
                        {item.duration && item.duration !== 'N/A' && (
                          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-slate-200 text-[11px] font-mono flex items-center gap-1 border border-white/10">
                            <Clock className="w-3 h-3 text-indigo-400" />
                            {item.duration}
                          </span>
                        )}

                        {/* Center Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-xl shadow-indigo-600/40 scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300">
                            <Play className="w-6 h-6 fill-current ml-0.5" />
                          </div>
                        </div>
                      </div>

                      {/* Card Details */}
                      <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <h3 className="font-bold text-lg leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                            {item.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                            {item.description || t[lang].noDesc}
                          </p>
                        </div>

                        {/* Software Pills */}
                        <div className="pt-3 border-t border-border/60 flex flex-wrap gap-1.5">
                          {itemTools.slice(0, 3).map((tool, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-0.5 rounded-md bg-secondary text-secondary-foreground text-[11px] font-medium"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Load 6 More / Collapse Buttons */}
              {displayedVideos.length > 6 && (
                <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
                  {visibleCount < displayedVideos.length && (
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setVisibleCount((prev) => prev + 6)}
                      className="group rounded-xl px-7 h-11 font-semibold bg-card/90 backdrop-blur-md border-border/80 hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-indigo-500/10 flex items-center gap-2"
                    >
                      <span>
                        {t[lang].showMore} (+{Math.min(6, displayedVideos.length - visibleCount)} {t[lang].projectsCount})
                      </span>
                      <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform duration-300" />
                    </Button>
                  )}

                  {visibleCount > 6 && (
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        setVisibleCount(6)
                        document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth' })
                      }}
                      className="group rounded-xl px-6 h-11 font-semibold bg-card/90 backdrop-blur-md border-border/80 text-foreground hover:border-rose-500/50 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-rose-500/10 flex items-center gap-2"
                    >
                      <span>{t[lang].showLess}</span>
                      <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform duration-300" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </section>

        {/* ================= RECENT PROJECTS SECTION ================= */}
        {recentProjects.length > 0 && (
          <section id="recent" className="scroll-mt-24 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <Clock className="w-4 h-4" />
                <span>Fresh From The Timeline</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                {t[lang].recent}
              </h2>
              <p className="text-muted-foreground text-sm md:text-base">
                {t[lang].recentDesc}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recentProjects.slice(0, 4).map((project, index) => {
                const projTools = parseTools(project.software)
                return (
                  <Card
                    key={project.id || index}
                    onClick={() => openVideoModal(project)}
                    className="group cursor-pointer overflow-hidden rounded-2xl bg-card/85 backdrop-blur-md border-border/80 hover:border-indigo-500/50 hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row"
                  >
                    <div className="relative sm:w-56 md:w-60 aspect-video sm:aspect-auto shrink-0 overflow-hidden bg-slate-900">
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        crossOrigin="anonymous"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = "/images/default-video-thumb.jpg"
                        }}
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                        <div className="w-11 h-11 rounded-full bg-white/90 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </div>
                      {project.views && project.views !== 'N/A' && (
                        <Badge className="absolute top-2.5 left-2.5 bg-rose-600/90 text-white border-0 text-[11px]">
                          <Eye className="w-3 h-3 mr-1" />
                          {project.views} {t[lang].views}
                        </Badge>
                      )}
                    </div>

                    <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                          <span className="font-medium text-indigo-600 dark:text-indigo-400">
                            {project.category || 'Video Project'}
                          </span>
                          {project.date && project.date !== 'N/A' && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {project.date}
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-base md:text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                          {project.title}
                        </h3>
                        <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                          {project.description || t[lang].noDesc}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/60">
                        {projTools.slice(0, 3).map((tool, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-secondary text-secondary-foreground text-[11px] font-medium"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </section>
        )}

        {/* ================= CONTACT & COLLABORATION SECTION ================= */}
        <section id="contact" className="scroll-mt-24">
          <div className="rounded-3xl bg-card/90 dark:bg-slate-900/90 border border-border/90 p-6 sm:p-10 md:p-12 shadow-xl relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Column: Direct Contact Info */}
              <div className="lg:col-span-6 space-y-6">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Let&apos;s Collaborate</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                    {t[lang].love}
                  </h2>
                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                    {t[lang].loveSub}
                  </p>
                </div>

                {/* Contact Cards */}
                <div className="space-y-3">
                  {/* Email Card */}
                  <div className="p-4 rounded-2xl bg-secondary/50 border border-border/70 flex items-center justify-between gap-3">
                    <a
                      href={`mailto:${emailValue}`}
                      className="flex items-center gap-3.5 min-w-0 group"
                    >
                      <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shrink-0">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs text-muted-foreground font-medium">Email</div>
                        <div className="text-sm md:text-base font-bold truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {emailValue}
                        </div>
                      </div>
                    </a>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(emailValue, 'email')}
                      className="h-9 w-9 rounded-xl shrink-0"
                    >
                      {copiedField === 'email' ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>

                  {/* Phone Card */}
                  <div className="p-4 rounded-2xl bg-secondary/50 border border-border/70 flex items-center justify-between gap-3">
                    <a
                      href={`tel:${phoneValue}`}
                      className="flex items-center gap-3.5 min-w-0 group"
                    >
                      <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 shrink-0">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs text-muted-foreground font-medium">Phone / Zalo</div>
                        <div className="text-sm md:text-base font-bold truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {phoneValue}
                        </div>
                      </div>
                    </a>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(phoneValue, 'phone')}
                      className="h-9 w-9 rounded-xl shrink-0"
                    >
                      {copiedField === 'phone' ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Social Channels */}
                <div className="pt-2 flex flex-wrap gap-3">
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[120px] p-3.5 rounded-2xl bg-secondary/40 border border-border/60 hover:border-blue-500/50 flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <Facebook className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-semibold">Facebook</span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>

                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[120px] p-3.5 rounded-2xl bg-secondary/40 border border-border/60 hover:border-pink-500/50 flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <Instagram className="w-5 h-5 text-pink-500" />
                      <span className="text-sm font-semibold">Instagram</span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>

                  <a
                    href={zaloUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[120px] p-3.5 rounded-2xl bg-secondary/40 border border-border/60 hover:border-blue-500/50 flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <ZaloIcon className="w-5 h-5" />
                      <span className="text-sm font-semibold">Zalo Chat</span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Right Column: Quick Project Brief Form */}
              <div className="lg:col-span-6">
                <form
                  onSubmit={handleSendBrief}
                  className="p-6 rounded-2xl bg-background/80 border border-border/80 space-y-4 shadow-sm"
                >
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Send className="w-4 h-4 text-indigo-500" />
                    <span>{t[lang].quickBriefTitle}</span>
                  </h3>

                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        placeholder={t[lang].yourName}
                        value={briefForm.name}
                        onChange={(e) => setBriefForm({ ...briefForm, name: e.target.value })}
                        required
                        className="h-11 rounded-xl bg-card"
                      />
                      <Input
                        placeholder={t[lang].yourContact}
                        value={briefForm.contactInfo}
                        onChange={(e) =>
                          setBriefForm({ ...briefForm, contactInfo: e.target.value })
                        }
                        required
                        className="h-11 rounded-xl bg-card"
                      />
                    </div>
                    <div>
                      <Input
                        placeholder={t[lang].projectType}
                        value={briefForm.projectType}
                        onChange={(e) =>
                          setBriefForm({ ...briefForm, projectType: e.target.value })
                        }
                        required
                        className="h-11 rounded-xl bg-card"
                      />
                    </div>
                    <div>
                      <Textarea
                        placeholder={t[lang].projectDetails}
                        rows={4}
                        value={briefForm.details}
                        onChange={(e) => setBriefForm({ ...briefForm, details: e.target.value })}
                        required
                        className="rounded-xl bg-card resize-none"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={sendingBrief}
                    className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{sendingBrief ? t[lang].sendingBrief : t[lang].sendBrief}</span>
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-card/40 backdrop-blur-sm py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clapperboard className="w-4 h-4 text-indigo-500" />
            <span className="font-bold text-foreground">
              {profile?.name || "HỒ ĐỨC ĐOAN"}
            </span>
            <span>• Creative Video Editor Portfolio</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#about" className="hover:text-foreground transition-colors">
              {t[lang].navAbout}
            </a>
            <a href="#showcase" className="hover:text-foreground transition-colors">
              {t[lang].navShowcase}
            </a>
            {/* <a href="/admin" className="hover:text-foreground transition-colors">
              {t[lang].adminPortal}
            </a> */}
          </div>
        </div>
      </footer>

      {/* Theater Video Modal */}
      <VideoModal
        isOpen={videoModal.isOpen}
        onClose={closeVideoModal}
        videoId={videoModal.videoId}
        title={videoModal.title}
        software={videoModal.software}
        description={videoModal.description}
        category={videoModal.category}
        duration={videoModal.duration}
        lang={lang}
      />
    </div>
  )
}
