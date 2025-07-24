"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, Mail, Facebook, Instagram, Youtube, Rocket, CheckCircle, Building, Play } from "lucide-react"

// 
// const portfolioCategories = [
//   { id: "my-fav", name: "My Fav <3", active: true },
//   { id: "travel", name: "Travel", active: false },
//   { id: "trailer", name: "Trailer", active: false },
//   { id: "MV", name: "Real Estate", active: false },
//   { id: "wedding", name: "Underwater", active: false },
//   { id: "brand", name: "Brand", active: false },
//   { id: "shorts", name: "Shorts", active: false },
// ]
const portfolioCategories = [
  { id: "my-fav", name: "My Fav <3", active: true },
  { id: "travel", name: "Travel", active: false },
  { id: "tutorial", name: "Tutorial", active: false },
  { id: "real-estate", name: "Trailer", active: false },
  { id: "underwater", name: "Wedding", active: false },
  { id: "brand", name: "Brand", active: false },
  { id: "shorts", name: "Shorts", active: false },
]

const portfolioData = {
  "my-fav": [
    {
      title: "CORPORATE HOUSING",
      subtitle: "Business Promo",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Corporate+Housing",
      duration: "2:15",
    },
    {
      title: "Digital Nomad 2023",
      subtitle: "Lifestyle Brand",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Digital+Nomad",
      duration: "4:45",
    },
    {
      title: "HOC LAN DAO PHU QUY",
      subtitle: "Freelancing Dao Phu Quy",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Hoc+Lan+Dao+Phu+Quy",
      duration: "5:20",
    },
    {
      title: "VIDEO EDITOR",
      subtitle: "Promotional Video",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Video+Editor+Promo",
      duration: "3:30",
    },
  ],
  travel: [
    {
      title: "TAJIKISTAN HISOR",
      subtitle: "Travel Vlog",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Tajikistan+Travel",
      duration: "8:45",
    },
    {
      title: "SAM MAY BA LAT",
      subtitle: "Travel Adventure",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Sam+May+Ba+Lat",
      duration: "6:30",
    },
    {
      title: "XUYEN VIET",
      subtitle: "Vietnam Journey",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Xuyen+Viet",
      duration: "12:15",
    },
    {
      title: "AM THANH BA LAT",
      subtitle: "Sound of Ba Lat",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Am+Thanh+Ba+Lat",
      duration: "4:20",
    },
    {
      title: "PHUOT VIET NAM",
      subtitle: "Vietnam Adventure",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Phuot+Viet+Nam",
      duration: "10:30",
    },
    {
      title: "DA LAT JOURNEY",
      subtitle: "Highland Adventure",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Da+Lat+Journey",
      duration: "7:15",
    },
  ],
  tutorial: [
    {
      title: "HIEU BO SUA VIDEO",
      subtitle: "Video Editing Tutorial",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Video+Tutorial",
      duration: "15:30",
    },
    {
      title: "Nghien Cuu Thi Khoa Youtube",
      subtitle: "YouTube Research",
      thumbnail: "/placeholder.svg?height=200&width=300&text=YouTube+Research",
      duration: "22:45",
    },
    {
      title: "Tap Khoa Youtube Chuan SEO",
      subtitle: "YouTube SEO Course",
      thumbnail: "/placeholder.svg?height=200&width=300&text=YouTube+SEO",
      duration: "18:20",
    },
    {
      title: "After Effects Basics",
      subtitle: "Motion Graphics Tutorial",
      thumbnail: "/placeholder.svg?height=200&width=300&text=After+Effects",
      duration: "25:10",
    },
  ],
  "real-estate": [
    {
      title: "An Gia Homestay",
      subtitle: "Property Tour",
      thumbnail: "/placeholder.svg?height=200&width=300&text=An+Gia+Homestay",
      duration: "3:45",
    },
    {
      title: "Dalant Villa",
      subtitle: "Luxury Property",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Dalant+Villa",
      duration: "4:20",
    },
    {
      title: "Moonlight House",
      subtitle: "Night Property",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Moonlight+House",
      duration: "2:55",
    },
  ],
  underwater: [
    {
      title: "Floating Freelancing",
      subtitle: "Underwater Scene",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Floating+Freelancing",
      duration: "2:30",
    },
    {
      title: "Hair Freelancing",
      subtitle: "Underwater Scene",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Hair+Freelancing",
      duration: "1:45",
    },
    {
      title: "Heart Freelancing",
      subtitle: "Underwater Scene",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Heart+Freelancing",
      duration: "3:15",
    },
  ],
  brand: [
    {
      title: "PHUOT VAN BIEN DT 201",
      subtitle: "Brand Campaign",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Phuot+Van+Bien",
      duration: "3:30",
    },
    {
      title: "CORPORATE HOUSING",
      subtitle: "Business Promo",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Corporate+Brand",
      duration: "2:15",
    },
  ],
  shorts: [
    {
      title: "Quick Edit Tips",
      subtitle: "Short Tutorial",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Quick+Tips",
      duration: "0:45",
    },
    {
      title: "Color Grading Fast",
      subtitle: "Quick Guide",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Color+Grading",
      duration: "0:30",
    },
    {
      title: "Transition Effects",
      subtitle: "Quick Tutorial",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Transitions",
      duration: "0:55",
    },
    {
      title: "Audio Sync Tips",
      subtitle: "Quick Guide",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Audio+Sync",
      duration: "0:40",
    },
  ],
}

const recentProjects = [
  {
    title: "Freelancing Dao Phu Quy",
    date: "November 30, 2023",
    thumbnail: "/placeholder.svg?height=150&width=200&text=Recent+Project+1",
    views: "2.5K",
  },
  {
    title: "Nghien Cuu Thi Khoa Youtube",
    date: "March 15, 2024",
    thumbnail: "/placeholder.svg?height=150&width=200&text=Recent+Project+2",
    views: "15K",
  },
]

export default function VideoEditorPortfolio() {
  const [activeCategory, setActiveCategory] = useState("my-fav")
  const [currentData, setCurrentData] = useState(portfolioData["my-fav"])

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId)
    setCurrentData(portfolioData[categoryId] || [])
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Page Title */}
      <div className="bg-white px-6 py-3 border-b" style={{ backgroundColor: "white", display: "none" }}>
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-gray-400 font-medium">DoanPortfolio (My Fav {"<3"})</h1>
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">✓</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto bg-white pt-8 ">
        {/* Header Section */}
        <div className="relative px-8 pt-12 pb-8 flex justify-center">
          {/* Main Content Layout */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-12 md:gap-16">
            {/* Left Side - Profile Image and Socials */}
            <div className="relative flex flex-col items-center">
              {/* Phone Number - Top Left */}
              <a href="tel:+84919261712" className="absolute -top-0 -left-9 flex items-center gap-2 z-20">
                <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-600 text-sm font-medium">+84919261712</span>
              </a>
              {/* Gmail Icon - Top Right of Content */}
              <a href="mailto:ho.duc.doan@gmail.com" className="absolute -top-0 right-0 md:mb-4 flex justify-end md:justify-start z-20">
                <div className="w-12 h-12 bg-white shadow-md rounded-xl flex items-center justify-center">
                  <Mail className="w-7 h-7 text-red-500" />
                </div>
              </a>

              {/* Decorative circles around profile */}
              <div className="absolute -inset-12 pointer-events-none" >
                <div className="w-80 h-80 border-2 border-blue-500 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                <div className="w-60 h-60 border   border-blue-200 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                {/* Top right blue dots */}
                <div className="absolute -top-6 right-0 grid grid-cols-4 gap-1" style={{ display: "none" }}>
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  ))}
                </div>
                {/* Bottom left blue dots */}
                <div className="absolute bottom-0 -left-6 grid grid-cols-3 gap-1" style={{ display: "none" }}>
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-blue-200 rounded-full"></div>
                  ))}
                </div>
              </div>

              {/* Profile Image with Blue Border */}
              <div className="relative z-10">
                <div className="w-64 h-64 ">
                  <div className="rounded-full bg-blue-500 mt-2">
                  </div>
                  <div className="w-60 h-61  overflow-hidden pb-2 mt-2">
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
              

              {/* Social Media Icons */}
              <div className="mt-8 z-10">
                <div className="bg-white rounded-2xl px-8 py-4 shadow-lg flex gap-6 items-center">
                  <a href="https://www.facebook.com/doan.12.02.04" className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors" aria-label="Facebook">
                    <Facebook className="w-6 h-6 text-white" />
                  </a>
                  <a href="https://www.instagram.com/ducdoan.04/" className="w-12 h-12 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity" aria-label="Instagram">
                    <Instagram className="w-6 h-6 text-white" />
                  </a>
                  <a href="#" className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors" aria-label="YouTube">
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
                I’m Doan a passionate video editor with 4 years of experience in various styles, from corporate to cinematic and social media content. Check out my work to see how I bring stories to life.
              </p>

              {/* Skills List */}
              <div className="space-y-3 mb-8 ">
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

              {/* Contact Button */}
              <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-medium text-base">
                Contact me now
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="px-8 py-16 bg-white " >
          <div className="flex justify-center gap-20  ">
            {/* Work Experience */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-black">4 years</div>
                <div className="text-gray-600 text-sm">Work Experience</div>
              </div>
            </div>

            {/* Employers Satisfaction */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-black">95%</div>
                <div className="text-gray-600 text-sm">Employers Satisfaction</div>
              </div>
            </div>

            {/* IELTS */}
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
        <div className="px-8 py-12 text-center">
          <h2 className="text-3xl font-bold text-black mb-4">My Portfolio</h2>
          <p className="text-gray-600 mb-12">Have a look on my products, I'm sure you will love it.</p>

          {/* Category Navigation */}
          <div className="flex justify-center gap-4 flex-wrap mb-12">
            {portfolioCategories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "ghost"}
                onClick={() => handleCategoryChange(category.id)}
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
            {currentData.map((item, index) => (
              <Card
                key={index}
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={item.thumbnail || "/placeholder.svg"}
                      alt={item.title}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Play className="w-8 h-8 text-white ml-1" />
                      </div>
                    </div>
                    <Badge className="absolute top-3 right-3 bg-black bg-opacity-80 text-white text-xs px-2 py-1">
                      {item.duration}
                    </Badge>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.subtitle}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Featured Project for Underwater category */}
          {activeCategory === "underwater" && (
            <div className="mb-16">
              <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 max-w-md mx-auto">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src="/placeholder.svg?height=200&width=400&text=HOC+LAN+DAO+PHU+QUY+Featured"
                      alt="HOC LAN DAO PHU QUY"
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Play className="w-8 h-8 text-white ml-1" />
                      </div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="text-2xl font-bold mb-2">HOC LAN</div>
                        <div className="bg-orange-500 px-4 py-1 rounded text-sm font-semibold">DAO PHU QUY</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-bold text-gray-900 mb-2">Freelancing Dao Phu Quy</h3>
                    <p className="text-sm text-gray-600">November 30, 2023</p>
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
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={project.thumbnail || "/placeholder.svg"}
                      alt={project.title}
                      width={300}
                      height={150}
                      className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Play className="w-6 h-6 text-white ml-1" />
                      </div>
                    </div>
                    <Badge className="absolute top-3 right-3 bg-red-600 text-white text-xs px-2 py-1">
                      {project.views} views
                    </Badge>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 mb-2">{project.title}</h3>
                    <p className="text-sm text-gray-600">{project.date}</p>
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
              <span className="text-gray-700 font-medium">+84919261712</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Mail className="w-5 h-5 text-red-600" />
              <span className="text-gray-700 font-medium">ducdoan04.work@gmail.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
