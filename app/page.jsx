'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Phone, Mail, Facebook, Instagram, Youtube, Rocket, CheckCircle, Building, Play, X, User } from 'lucide-react'

// Video Modal Component
function VideoModal({ isOpen, onClose, videoId, title, software, description }) {
  if (!isOpen || !videoId) return null

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-0 bg-white flex flex-col md:flex-col">
        {/* Video bên trái */}
        <div className="relative md:w-3/3 w-full" style={{ paddingBottom: "56.25%" }}>
          <iframe
            src={embedUrl}
            title={title}
            className="absolute top-0 left-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        {/* Mô tả bên phải */}
        <div className="md:w-3/3 w-full text-white flex flex-col">
          <DialogHeader className="pr-1 pl-4 pt-0 pb-0">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-black text-2xl">{title}</DialogTitle>
              <Button variant="ghost" size="sm" onClick={onClose} className="text-black bg-red-200 hover:bg-red-500 rounded-sm">
                <X className="w-2 h-2" />
              </Button>
            </div>
          </DialogHeader>
          <div className="block text-sm text-gray-600 mb-4 ml-4">
            <p className="pt-2"><a style={{ textDecoration: "none", color: "black" }}>Tools:</a> {software || "Capcut Pc, Premiere Pro, After Effects"}</p>
            <p className="pt-2"><a style={{ textDecoration: "none", color: "black" }}>Description:</a> {description || "No description available"}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function VideoEditorPortfolio() {
  const [activeCategory, setActiveCategory] = useState(null)
  const [currentData, setCurrentData] = useState([])
  const [categories, setCategories] = useState([])
  const [recentProjects, setRecentProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [videosLoading, setVideosLoading] = useState(false)
  const [videoModal, setVideoModal] = useState({
    isOpen: false,
    videoId: null,
    title: "",
    software: "",
    description: "",
  })

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
        
        const categoriesResp = await fetch(`${apiUrl}/api/categories`);
        const categoriesData = await categoriesResp.json();
        if (categoriesData.success) {
          const mappedCategories = categoriesData.data.map(cat => ({
            id: cat.id,
            name: cat.name,
            description: cat.description,
            color: cat.color,
            created_at: cat.created_at,
            active: cat.id === 1,
          }));
          setCategories(mappedCategories);
          
          // Set default category to first category
          if (mappedCategories.length > 0) {
            setActiveCategory(mappedCategories[0].id);
            console.log('Setting default category:', mappedCategories[0].name, mappedCategories[0].id);
          }
        }

        const videosResp = await fetch(`${apiUrl}/api/videos?category=${encodeURIComponent(categoriesData.success && categoriesData.data.length > 0 ? categoriesData.data[0].name : '')}`);
        const videosData = await videosResp.json();
        if (videosData.success) {
          console.log('Videos fetched:', videosData.data.videos.length);
          setCurrentData(videosData.data.videos.map(video => {
            const thumbnailUrl = video.thumbnail_url 
              ? `${apiUrl}${video.thumbnail_url}`
              : "/backgroundVideo/1.jpg";
            console.log('Video thumbnail URL:', thumbnailUrl);
            return {
              ...video,
              thumbnail: thumbnailUrl,
              duration: video.duration || "N/A",
            };
          }));
        }

        const recentResp = await fetch(`${apiUrl}/api/videos/recent?limit=2`);
        const recentData = await recentResp.json();
        if (recentData.success) {
          setRecentProjects(recentData.data.map(video => ({
            ...video,
            thumbnail: video.thumbnail_url 
              ? `${apiUrl}${video.thumbnail_url}`
              : "/backgroundVideo/1.jpg",
            views: video.views ? `${video.views}K` : "N/A",
            date: video.created_at ? new Date(video.created_at).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }) : "N/A",
          })));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle category change
  const handleCategoryChange = async (categoryId) => {
    setActiveCategory(categoryId);
    setVideosLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      const resp = await fetch(`${apiUrl}/api/videos?category=${encodeURIComponent(categories.find(cat => cat.id === categoryId)?.name || '')}`);
      const data = await resp.json();
      if (data.success) {
        setCurrentData(data.data.videos.map(video => ({
          ...video,
          thumbnail: video.thumbnail_url 
            ? `${apiUrl}${video.thumbnail_url}`
            : "/backgroundVideo/1.jpg",
          duration: video.duration || "N/A",
        })));
      }
    } catch (error) {
      console.error("Error fetching category data:", error);
    } finally {
      setVideosLoading(false);
    }
  };

  const openVideoModal = (videoId, title, software, description) => {
    setVideoModal({ isOpen: true, videoId, title, software, description })
  }

  const closeVideoModal = () => {
    setVideoModal({ isOpen: false, videoId: null, title: "", software: "", description: "" })
  }

  const handleLogin = () => {
    window.location.href = '/admin'
  }

  if (loading) return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Page Title */}
      <div className="bg-white px-6 py-3 border-b">
        <div className="max-w-6xl mx-auto flex justify-between items-center" style={{display: "none"}}>
          <h1 className="text-gray-400 font-medium">DoanPortfolio (My Fav {"<3"})</h1>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={handleLogin}
              className="flex items-center space-x-2"
            >
              <User className="w-4 h-4" />
              <span>Admin</span>
            </Button>
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">✓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto bg-white pt-8">
        {/* Header Section */}
        <div className="relative px-8 pt-12 pb-8 flex justify-center">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-12 md:gap-16">
            {/* Left Side - Profile Image and Socials */}
            <div className="relative flex flex-col items-center">
              <a href="tel:+84919261712" className="absolute -top-0 md:mt-6 -left-0 flex items-center gap-2 z-20">
                <div className="w-11 h-11 bg-white shadow-md rounded-xl flex items-center justify-center">
                  <Phone className="w-6 h-6 text-blue-500" />
                </div>
                <span className="text-gray-600 text-sm font-medium" style={{ display: "none" }}>+84919261712</span>
              </a>
              <a href="mailto:ho.duc.doan@gmail.com" className="absolute -top-0 md:mt-5 right-0 md:mb-4 flex justify-end md:justify-start z-20">
                <div className="w-12 h-12 bg-white shadow-md rounded-xl flex items-center justify-center">
                  <Mail className="w-7 h-7 text-red-500" />
                </div>
              </a>

              <div className="absolute -inset-12 pointer-events-none">
                <div className="w-80 h-80 border-2 border-blue-500 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                <div className="w-60 h-60 border border-blue-200 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>

              <div className="relative z-10">
                <div className="w-64 h-64">
                  <div className="rounded-full bg-blue-500 mt-2"></div>
                  <div className="w-60 h-61 overflow-hidden pb-2 mt-2">
                    <Image
                      src="/images/profile-photo.png"
                      alt="Ho Duc Doan"
                      width={240}
                      height={240}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 z-10">
                <div className="bg-white rounded-2xl px-8 py-4 shadow-lg flex gap-6 items-center">
                  <a href="https://www.facebook.com/doan.12.02.04" className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors" aria-label="Facebook">
                    <Facebook className="w-6 h-6 text-white" />
                  </a>
                  <a href="https://www.instagram.com/ducdoan.04/" className="w-12 h-12 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity" aria-label="Instagram">
                    <Instagram className="w-6 h-6 text-white" />
                  </a>
                  <a href="https://id.zalo.me/0919261712" className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors" aria-label="YouTube">
                    <Youtube className="w-6 h-6 text-white" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="flex-1 w-full md:w-auto pt-8 md:pt-4 relative">
              <h1 className="text-4xl md:text-5xl font-bold text-black mb-2 mt-8 md:mt-0">HO DUC DOAN</h1>
              <p className="text-gray-500 font-medium text-lg mb-2">Hi there!</p>
              <p className="text-gray-600 leading-relaxed mb-6 max-w-lg">
                I'm Doan a passionate video editor with 4 years of experience in various styles, from corporate to cinematic and social media content. Check out my work to see how I bring stories to life.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="font-semibold text-gray-800">Video Editing Tools:</span>
                    <span className="text-gray-600 ml-1">Capcut Pc, Premiere Pro, After Effects</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="font-semibold text-gray-800">Photo Editing Tools:</span>
                    <span className="text-gray-600 ml-1">Photoshop, Illustrator</span>
                  </div>
                </div>
              </div>

              <a href="mailto:ducdoan04.work@gmail.com" className="mb-4">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-medium text-base">
                  Contact me now
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="px-8 py-16 bg-white">
          <div className="flex justify-center gap-20">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-black">4 years</div>
                <div className="text-gray-600 text-sm">Work Experience</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-black">95%</div>
                <div className="text-gray-600 text-sm">Employers Satisfaction</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                <Building className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-black">5.5</div>
                <div className="text-gray-600 text-sm">IELTS</div>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Section */}
        <div className="pt-4 pb-1 px-8 py-12 text-center">
          <h2 className="text-3xl font-bold text-black mb-4">My Portfolio</h2>
          <p className="text-gray-600 mb-12">Have a look on my products, I'm sure you will love it.</p>

          {/* Category Navigation */}
          <div className="flex justify-center gap-4 flex-wrap mb-12">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "ghost"}
                onClick={() => {
                  console.log('Category clicked:', category.name, category.id);
                  handleCategoryChange(category.id);
                }}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  activeCategory === category.id
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {videosLoading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <Card key={`skeleton-${index}`} className="animate-pulse">
                  <CardContent className="p-0">
                    <div className="w-full h-48 bg-gray-200 rounded-t-lg"></div>
                    <div className="p-6">
                      <div className="h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-1"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              currentData.map((item, index) => (
                <Card
                  key={index}
                  className="group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                  onClick={() => openVideoModal(item.video_id, item.title, item.software, item.description)}
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        crossOrigin="anonymous"
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          console.log('Image load error for:', item.thumbnail);
                          console.log('Error details:', e.target.src);
                          e.target.src = "/placeholder.jpg"
                        }}
                        onLoad={() => {
                          console.log('Image loaded successfully:', item.thumbnail);
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg">
                          <Play className="w-8 h-8 text-white ml-1" />
                        </div>
                      </div>
                      <Badge className="absolute top-3 right-3 bg-black bg-opacity-80 text-white text-xs px-2 py-1">
                        {item.duration || "N/A"}
                      </Badge>
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-gray-900 mb-2 text-lg">{item.title}</h3>
                      <p className="text-sm text-gray-600"><a href="" style={{ textDecoration: "none", color: "black" }}>Tools:</a> {item.software || "Capcut Pc, Premiere Pro, After Effects"}</p>
                      <p className="text-sm text-gray-600"><a href="" style={{ textDecoration: "none", color: "black" }}>Description:</a> {item.description || "No description available"}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Featured Project for Underwater category */}
          {activeCategory === "underwater" && (
            <div className="mb-16">
              <Card
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 max-w-md mx-auto"
                onClick={() => openVideoModal("QjR3DDjnijM", "Freelancing Dao Phu Quy", "Capcut Pc, Premiere Pro, After Effects", "Recent underwater freelancing project at Dao Phu Quy island.")}
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src="/backgroundVideo/3.jpg"
                      alt="Freelancing Dao Phu Quy"
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg">
                        <Play className="w-8 h-8 text-white ml-1" />
                      </div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="text-2xl font-bold mb-2">FREELANCING</div>
                        <div className="bg-orange-500 px-4 py-1 rounded text-sm font-semibold">DAO PHU QUY</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-bold text-gray-900 mb-2">Freelancing Dao Phu Quy</h3>
                    <p className="text-sm text-gray-600">{recentProjects.find(p => p.video_id === "QjR3DDjnijM")?.date || "N/A"}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Recent Projects Section */}
        <div className="bg-gray-50 px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">Recent Projects</h2>
            <p className="text-gray-600">These are my latest projects, hope you love it.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {recentProjects.map((project, index) => (
              <Card
                key={index}
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                onClick={() => openVideoModal(project.video_id, project.title, project.software, project.description)}
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      crossOrigin="anonymous"
                      className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        console.log('Recent project image error:', project.thumbnail);
                        e.target.src = "/placeholder.jpg"
                      }}
                      onLoad={() => {
                        console.log('Recent project image loaded:', project.thumbnail);
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg">
                        <Play className="w-6 h-6 text-white ml-1" />
                      </div>
                    </div>
                    <Badge className="absolute top-3 right-3 bg-red-600 text-white text-xs px-2 py-1">
                      {project.views || "N/A"} views
                    </Badge>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 mb-2">{project.title}</h3>
                    <p className="text-sm text-gray-600"><a href="" style={{ textDecoration: "none", color: "black" }}>Tools:</a> {project.software || "Capcut Pc, Premiere Pro, After Effects"}</p>
                    <p className="text-sm text-gray-600"><a href="" style={{ textDecoration: "none", color: "black" }}>Date:</a> {project.date || "N/A"}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white px-8 py-16 text-center">
          <h2 className="text-2xl font-bold text-black mb-6">You love my products???</h2>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white px-10 py-4 rounded-full font-medium text-lg mb-8">
            Contact me now
          </Button>
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Phone className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700 font-medium">+84919261772</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Mail className="w-5 h-5 text-red-600" />
              <span className="text-gray-700 font-medium">ducdoan04.work@gmail.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={videoModal.isOpen}
        onClose={closeVideoModal}
        videoId={videoModal.videoId}
        title={videoModal.title}
        software={videoModal.software}
        description={videoModal.description}
      />
    </div>
  )
}