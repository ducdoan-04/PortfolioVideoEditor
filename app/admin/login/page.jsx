'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
  Eye,
  EyeOff,
  User,
  Lock,
  ArrowLeft,
  Clapperboard,
  Sun,
  Moon,
  ShieldCheck
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem('admin-token', data.token)
        localStorage.setItem('admin-user', JSON.stringify(data.user))
        toast.success('Đăng nhập thành công!')
        setTimeout(() => {
          window.location.href = '/admin'
        }, 100)
      } else {
        toast.error(data.message || 'Đăng nhập thất bại')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Lỗi kết nối server')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-background text-foreground bg-studio-grid flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient Orbs */}
      <div className="fixed -top-32 -left-32 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed -bottom-32 -right-32 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar Actions */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        {mounted && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="h-10 w-10 rounded-xl bg-card/80 backdrop-blur-md border-border"
            aria-label="Toggle theme"
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </Button>
        )}
      </div>

      <Card className="w-full max-w-md shadow-2xl border border-border/80 bg-card/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl relative z-10 overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-600 via-blue-500 to-purple-600" />
        <CardHeader className="text-center pt-8 pb-6 space-y-3">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white">
              <Clapperboard className="h-8 w-8" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Studio Control Panel</span>
            </div>
            <CardTitle className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Đăng nhập Quản trị
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Quản lý dự án video, danh mục và hồ sơ cá nhân
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pb-8 px-6 sm:px-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-semibold">
                Tên đăng nhập
              </Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Nhập username"
                  className="pl-10 h-11 rounded-xl bg-background/80 border-border"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold">
                Mật khẩu
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Nhập mật khẩu"
                  className="pl-10 pr-11 h-11 rounded-xl bg-background/80 border-border"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  <span>Đang xác thực...</span>
                </div>
              ) : (
                'Đăng nhập hệ thống'
              )}
            </Button>
          </form>

          <div className="pt-2 border-t border-border/60 text-center">
            <Button
              variant="ghost"
              onClick={() => router.push('/')}
              className="text-muted-foreground hover:text-foreground rounded-xl text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại trang Portfolio
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
