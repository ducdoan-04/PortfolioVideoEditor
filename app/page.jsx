'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Phone, Mail, Facebook, Instagram, Youtube, Rocket, CheckCircle, Building, Play, X, User, Send } from 'lucide-react'
import apiService from '@/lib/api'

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
        const categoriesData = await apiService.getCategories();
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

          if (mappedCategories.length > 0) {
            setActiveCategory(mappedCategories[0].id);
          }
        }

        const initialCategory = categoriesData.success && categoriesData.data.length > 0 ? categoriesData.data[0].name : '';
        const videosData = await apiService.getVideosByCategory(initialCategory);
        if (videosData.success) {
          setCurrentData(videosData.data.videos.map(video => ({
            ...video,
            thumbnail: video.thumbnail || "/backgroundVideo/1.jpg",
            duration: video.duration || "N/A",
          })));
        }

        const recentData = await apiService.getRecentVideos(2);
        if (recentData.success) {
          setRecentProjects(recentData.data.map(video => ({
            ...video,
            thumbnail: video.thumbnail || "/backgroundVideo/1.jpg",
            views: video.views ? `${video.views}K` : "N/A",
            date: video.date || "N/A",
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
      const categoryName = categories.find(cat => cat.id === categoryId)?.name || '';
      const data = await apiService.getVideosByCategory(categoryName);
      if (data.success) {
        setCurrentData(data.data.videos.map(video => ({
          ...video,
          thumbnail: video.thumbnail || "/backgroundVideo/1.jpg",
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

  if (loading) return (
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
              unoptimized={true}
            />
          </div>

        </div>
      </div>
    </div>
  );
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Page Title */}
      <div className="bg-white px-6 py-3 border-b hidden md:block">
        <div className="max-w-6xl mx-auto flex justify-between items-center" style={{ display: "none" }}>
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
      <div className="max-w-6xl mx-auto bg-white mt-0 md:pt-8">
        {/* Header Section */}
        <div className="relative px-8 pt-12 pb-6 md:pb-8 flex justify-center">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-16">
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
                  <div className="w-60 h-61 overflow-hidden pb-2 mt-2 relative">
                    <Image
                      src="/images/profile-photo-1.png"
                      alt="Ho Duc Doan"
                      width={240}
                      height={240}
                      className="w-full h-full object-cover"
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 z-10">
                <div className="bg-white rounded-2xl px-8 py-4 shadow-lg flex gap-6 items-center">
                  <a href="https://www.facebook.com/ducdoan.24" className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors" aria-label="Facebook">
                    <Facebook className="w-6 h-6 text-white" />
                  </a>
                  <a href="https://www.instagram.com/ducdoan.04/" className="w-12 h-12 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity" aria-label="Instagram">
                    <Instagram className="w-6 h-6 text-white" />
                  </a>
                  <a href="https://zalo.me/0919261712" className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hover:scale-105 transition-colors" aria-label="Zalo">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0,0,256,256" className="w-full h-full" fillRule="nonzero"><g fill="none" fillRule="nonzero" stroke="none" strokeWidth="none" strokeLinecap="butt" strokeLinejoin="none" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" style={{ mixBlendMode: "normal" }}><path transform="scale(5.33333,5.33333)" d="M29,43h-10c-7.732,0 -14,-6.268 -14,-14v-10c0,-5.88471 3.63593,-10.91138 8.78037,-12.98053c0.00188,-0.00182 0.00375,-0.00365 0.00563,-0.00547c1.613,-0.648 3.369,-1.014 5.214,-1.014h10c7.732,0 14,6.268 14,14v10c0,3.014 -0.962,5.799 -2.583,8.084c-0.00623,0.00379 -0.01246,0.00759 -0.0187,0.01137c-2.53574,3.56814 -6.6879,5.90463 -11.3983,5.90463z" fill="#3160ff" stroke="#3160ff" strokeWidth="2" strokeLinejoin="round"></path><g transform="scale(5.33333,5.33333)" stroke="none" strokeWidth="1" strokeLinejoin="miter"><path d="M15,36v-29.173l-1.211,-0.811c-5.149,2.067 -8.789,7.096 -8.789,12.984v10c0,7.732 6.268,14 14,14h10c4.722,0 8.883,-2.348 11.417,-5.931v-1.069z" fill="#2962ff"></path><path d="M29,5h-10c-1.845,0 -3.601,0.366 -5.214,1.014c-3.333,3.236 -5.786,8.514 -5.786,12.986c0,6.771 0.936,10.735 3.712,14.607c0.216,0.301 0.357,0.653 0.376,1.022c0.043,0.835 -0.129,2.365 -1.634,3.742c-0.162,0.148 -0.059,0.419 0.16,0.428c0.942,0.041 2.843,-0.014 4.797,-0.877c0.557,-0.246 1.191,-0.203 1.729,0.083c3.313,1.759 7.193,1.995 10.86,1.995c4.676,0 9.339,-1.04 12.417,-2.916c1.621,-2.285 2.583,-5.07 2.583,-8.084v-10c0,-7.732 -6.268,-14 -14,-14z" fill="#eeeeee"></path><path d="M36.75,27c-2.067,0 -3.75,-1.683 -3.75,-3.75c0,-2.067 1.683,-3.75 3.75,-3.75c2.067,0 3.75,1.683 3.75,3.75c0,2.067 -1.683,3.75 -3.75,3.75zM36.75,21c-1.24,0 -2.25,1.01 -2.25,2.25c0,1.24 1.01,2.25 2.25,2.25c1.24,0 2.25,-1.01 2.25,-2.25c0,-1.24 -1.01,-2.25 -2.25,-2.25z" fill="#2962ff"></path><path d="M31.5,27h-1c-0.276,0 -0.5,-0.224 -0.5,-0.5v-8.5h1.5z" fill="#2962ff"></path><path d="M27,19.75v0.519c-0.629,-0.476 -1.403,-0.769 -2.25,-0.769c-2.067,0 -3.75,1.683 -3.75,3.75c0,2.067 1.683,3.75 3.75,3.75c0.847,0 1.621,-0.293 2.25,-0.769v0.269c0,0.276 0.224,0.5 0.5,0.5h1v-7.25zM24.75,25.5c-1.24,0 -2.25,-1.01 -2.25,-2.25c0,-1.24 1.01,-2.25 2.25,-2.25c1.24,0 2.25,1.01 2.25,2.25c0,1.24 -1.01,2.25 -2.25,2.25z" fill="#2962ff"></path><path d="M21.25,18h-8v1.5h5.321l-5.571,6.5h0.026c-0.163,0.211 -0.276,0.463 -0.276,0.75v0.25h7.5c0.276,0 0.5,-0.224 0.5,-0.5v-1h-5.321l5.571,-6.5h-0.026c0.163,-0.211 0.276,-0.463 0.276,-0.75z" fill="#2962ff"></path></g></g></svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="flex-1 w-full md:w-auto pt-0 md:pt-4 relative">
              <h1 className="text-4xl md:text-5xl font-bold text-black mb-2 mt-1 md:mt-0">HO DUC DOAN</h1>
              <p className="text-gray-500 font-medium text-lg mb-2">Hi there!</p>
              <p className="text-gray-600 leading-relaxed mb-6 max-w-lg">
                I'm Doan a passionate video editor with 3 years of experience in various styles, from corporate to cinematic and social media content. Check out my work to see how I bring stories to life.
              </p>

              <div className="space-y-3 mb-4 md:mb-8">
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
                    <span className="text-gray-600 ml-1">Photoshop, Illustrator, Evoto</span>
                  </div>
                </div>
              </div>

              <a href="mailto:ducdoan04.work@gmail.com" className="mb-4 justify-center md:justify-start flex">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-medium text-base">
                  Contact me now
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="px-4 md:px-8 pb-6 md:pb-16 pt-1 md:pt-16 bg-white">
          <div className="flex flex-row md:flex-row justify-center items-center gap-0 md:gap-20">
            <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4 w-full md:w-auto justify-center md:justify-start">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Rocket className="w-7 h-7 md:w-8 md:h-8 text-white" />
              </div>
              <div className="text-center md:text-left">
                <div className="text-xl md:text-2xl font-bold text-black">3 years</div>
                <div className="text-gray-600 text-xs md:text-sm">Work Experience</div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4 w-full md:w-auto justify-center md:justify-start">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-7 h-7 md:w-8 md:h-8 text-white" />
              </div>
              <div className="text-center md:text-left">
                <div className="text-xl md:text-2xl font-bold text-black">99%</div>
                <div className="text-gray-600 text-xs md:text-sm">Customer Satisfaction</div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4 w-full md:w-auto justify-center md:justify-start">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Building className="w-7 h-7 md:w-8 md:h-8 text-white" />
              </div>
              <div className="text-center md:text-left">
                <div className="text-xl md:text-2xl font-bold text-black">600+</div>
                <div className="text-gray-600 text-xs md:text-sm">TOEIC</div>
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
                className={`px-6 py-3 rounded-full font-medium transition-all ${activeCategory === category.id
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
          <a href="mailto:ducdoan04.work@gmail.com" className="text-blue-500 hover:underline">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white px-10 py-4 rounded-full font-medium text-lg mb-8">Contact me now</Button>
          </a>
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Phone className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700 font-medium">(+84) 919261712</span>
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