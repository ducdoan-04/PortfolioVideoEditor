"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import apiService from "@/lib/api"
import Image from "next/image"

export default function ProfileManagement() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    greeting: "",
    description: "",
    video_tools: "",
    photo_tools: "",
    experience_years: 0,
    satisfaction_rate: 0,
    toeic_score: 0,
    facebook_url: "",
    instagram_url: "",
    zalo_url: "",
    avatar_url: ""
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setLoading(true)
    const response = await apiService.getProfile()
    if (response.success && response.data) {
      setProfile(response.data)
      setFormData(response.data)
    }
    setLoading(false)
  }

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    const token = localStorage.getItem('admin-token')
    
    // Create FormData in case we add image upload later, or just send JSON for now
    // Since API route supports both, JSON is simpler for just URLs
    const response = await apiService.updateProfile(formData, token)
    
    if (response.success) {
      toast.success("Đã cập nhật Profile thành công!")
      setProfile(response.data)
      setFormData(response.data)
    } else {
      toast.error(response.message || "Lỗi khi cập nhật Profile")
    }
    setSaving(false)
  }

  if (loading) return <div>Đang tải thông tin...</div>

  return (
    <Card className="shadow-lg border-blue-100">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <CardTitle className="text-xl text-blue-800 flex justify-between items-center">
          Quản lý Thông tin Cá nhân
          <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-700">Thông tin cơ bản</h3>
            
            <div className="space-y-2">
              <Label htmlFor="name">Họ và Tên</Label>
              <Input id="name" value={formData.name || ""} onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="greeting">Lời chào (Greeting)</Label>
              <Input id="greeting" value={formData.greeting || ""} onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả bản thân</Label>
              <Textarea id="description" rows={4} value={formData.description || ""} onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar_url">Link ảnh đại diện (Avatar URL)</Label>
              <Input id="avatar_url" value={formData.avatar_url || ""} onChange={handleInputChange} />
              {formData.avatar_url && (
                <div className="mt-2 relative w-32 h-32 rounded-full overflow-hidden border">
                  <Image src={formData.avatar_url} alt="Avatar Preview" fill className="object-cover" unoptimized />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-gray-700">Kỹ năng & Số liệu</h3>
              
              <div className="space-y-2">
                <Label htmlFor="video_tools">Công cụ Video Editing</Label>
                <Input id="video_tools" value={formData.video_tools || ""} onChange={handleInputChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="photo_tools">Công cụ Photo Editing</Label>
                <Input id="photo_tools" value={formData.photo_tools || ""} onChange={handleInputChange} />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experience_years">Năm kinh nghiệm</Label>
                  <Input id="experience_years" type="number" value={formData.experience_years || 0} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="satisfaction_rate">% Hài lòng</Label>
                  <Input id="satisfaction_rate" type="number" value={formData.satisfaction_rate || 0} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="toeic_score">Điểm TOEIC</Label>
                  <Input id="toeic_score" type="number" value={formData.toeic_score || 0} onChange={handleInputChange} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-gray-700">Mạng xã hội</h3>
              
              <div className="space-y-2">
                <Label htmlFor="facebook_url">Facebook Link</Label>
                <Input id="facebook_url" value={formData.facebook_url || ""} onChange={handleInputChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram_url">Instagram Link</Label>
                <Input id="instagram_url" value={formData.instagram_url || ""} onChange={handleInputChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zalo_url">Zalo Link</Label>
                <Input id="zalo_url" value={formData.zalo_url || ""} onChange={handleInputChange} />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
