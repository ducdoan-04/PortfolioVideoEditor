"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Save, UserCircle, Sparkles, Share2 } from "lucide-react"
import apiService from "@/lib/api"
import Image from "next/image"

export default function ProfileManagement() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    greeting: "",
    greeting_vi: "",
    description: "",
    description_vi: "",
    video_tools: "",
    photo_tools: "",
    experience_years: 0,
    satisfaction_rate: 0,
    toeic_score: 0,
    email: "",
    phone: "",
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

    const response = await apiService.updateProfile(formData, token)

    if (response.success) {
      toast.success("Đã cập nhật Hồ sơ cá nhân thành công!")
      setProfile(response.data)
      setFormData(response.data)
    } else {
      toast.error(response.message || "Lỗi khi cập nhật Profile")
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <Card className="rounded-2xl bg-card/80 border-border p-12 text-center">
        <p className="text-muted-foreground animate-pulse">Đang tải thông tin hồ sơ...</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card/80 backdrop-blur-md p-4 rounded-2xl border border-border/80">
        <div>
          <h2 className="text-xl font-bold">Quản lý Hồ sơ Cá nhân (Profile)</h2>
          <p className="text-xs text-muted-foreground">
            Cập nhật thông tin giới thiệu, công cụ, thống kê và liên hệ hiển thị trên trang chủ
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Basic Info */}
        <Card className="lg:col-span-7 rounded-2xl bg-card/85 backdrop-blur-md border-border/80 shadow-sm">
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <UserCircle className="w-5 h-5 text-indigo-500" />
              <span>Thông tin giới thiệu (Song ngữ VIE / EN)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Họ và Tên hiển thị</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="avatar_url">Link ảnh đại diện (Avatar URL)</Label>
                <Input
                  id="avatar_url"
                  value={formData.avatar_url || ""}
                  onChange={handleInputChange}
                  placeholder="/images/profile-photo-1.png"
                  className="rounded-xl"
                />
              </div>
            </div>

            {formData.avatar_url && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 border border-border/60">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-border shrink-0">
                  <Image
                    src={formData.avatar_url}
                    alt="Avatar Preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  <p className="font-semibold text-foreground">Xem trước ảnh đại diện</p>
                  <p className="truncate max-w-xs">{formData.avatar_url}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="greeting_vi">Lời chào (Tiếng Việt)</Label>
                <Input
                  id="greeting_vi"
                  value={formData.greeting_vi || ""}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Xin chào!"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="greeting">Lời chào (Tiếng Anh)</Label>
                <Input
                  id="greeting"
                  value={formData.greeting || ""}
                  onChange={handleInputChange}
                  placeholder="Hi there!"
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description_vi">Mô tả bản thân (Tiếng Việt)</Label>
              <Textarea
                id="description_vi"
                rows={4}
                value={formData.description_vi || ""}
                onChange={handleInputChange}
                placeholder="Nhập giới thiệu bản thân bằng tiếng Việt..."
                className="rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Mô tả bản thân (Tiếng Anh)</Label>
              <Textarea
                id="description"
                rows={4}
                value={formData.description || ""}
                onChange={handleInputChange}
                placeholder="Enter English bio..."
                className="rounded-xl"
              />
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Skills, Metrics & Social Links */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="rounded-2xl bg-card/85 backdrop-blur-md border-border/80 shadow-sm">
            <CardHeader className="border-b border-border/60 pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                <span>Kỹ năng & Số liệu nổi bật</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="video_tools">Công cụ Video Editing (cách nhau bởi dấu phẩy)</Label>
                <Input
                  id="video_tools"
                  value={formData.video_tools || ""}
                  onChange={handleInputChange}
                  placeholder="CapCut PC, Premiere Pro, After Effects"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="photo_tools">Công cụ Photo & Design (cách nhau bởi dấu phẩy)</Label>
                <Input
                  id="photo_tools"
                  value={formData.photo_tools || ""}
                  onChange={handleInputChange}
                  placeholder="Photoshop, Illustrator, Evoto"
                  className="rounded-xl"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 pt-1">
                <div className="space-y-1.5">
                  <Label htmlFor="experience_years" className="text-xs">Năm KN</Label>
                  <Input
                    id="experience_years"
                    type="number"
                    value={formData.experience_years || 0}
                    onChange={handleInputChange}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="satisfaction_rate" className="text-xs">% Hài lòng</Label>
                  <Input
                    id="satisfaction_rate"
                    type="number"
                    value={formData.satisfaction_rate || 0}
                    onChange={handleInputChange}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="toeic_score" className="text-xs">Điểm TOEIC</Label>
                  <Input
                    id="toeic_score"
                    type="number"
                    value={formData.toeic_score || 0}
                    onChange={handleInputChange}
                    className="rounded-xl"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl bg-card/85 backdrop-blur-md border-border/80 shadow-sm">
            <CardHeader className="border-b border-border/60 pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Share2 className="w-5 h-5 text-indigo-500" />
                <span>Liên hệ & Mạng xã hội</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={handleInputChange}
                    placeholder="ducdoan04.work@gmail.com"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone || ""}
                    onChange={handleInputChange}
                    placeholder="+84919261712"
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="facebook_url">Facebook URL</Label>
                <Input
                  id="facebook_url"
                  value={formData.facebook_url || ""}
                  onChange={handleInputChange}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="instagram_url">Instagram URL</Label>
                <Input
                  id="instagram_url"
                  value={formData.instagram_url || ""}
                  onChange={handleInputChange}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="zalo_url">Zalo URL</Label>
                <Input
                  id="zalo_url"
                  value={formData.zalo_url || ""}
                  onChange={handleInputChange}
                  className="rounded-xl"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
