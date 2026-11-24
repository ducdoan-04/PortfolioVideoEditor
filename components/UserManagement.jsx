'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Plus, Edit, Trash2, User, Shield, Mail } from 'lucide-react'

export default function UserManagement({ users = [], onUsersChange }) {
  const [showAddUser, setShowAddUser] = useState(false)
  const [showEditUser, setShowEditUser] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
    is_active: true
  })

  const handleAddUser = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(`/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Đã thêm tài khoản thành công!')
        setShowAddUser(false)
        setFormData({ username: '', email: '', password: '', role: 'user', is_active: true })
        onUsersChange && onUsersChange()
      } else {
        toast.error(data.message || 'Thêm tài khoản thất bại')
      }
    } catch (error) {
      console.error('Error adding user:', error)
      toast.error('Lỗi khi thêm tài khoản')
    }
  }

  const handleEditUser = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Cập nhật tài khoản thành công!')
        setShowEditUser(false)
        setSelectedUser(null)
        setFormData({ username: '', email: '', password: '', role: 'user', is_active: true })
        onUsersChange && onUsersChange()
      } else {
        toast.error(data.message || 'Cập nhật tài khoản thất bại')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      toast.error('Lỗi khi cập nhật tài khoản')
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!confirm('Bạn có chắc muốn xóa tài khoản này?')) return

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Đã xóa tài khoản!')
        onUsersChange && onUsersChange()
      } else {
        toast.error(data.message || 'Xóa tài khoản thất bại')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Lỗi khi xóa tài khoản')
    }
  }

  const openEditUser = (user) => {
    setSelectedUser(user)
    setFormData({
      username: user.username,
      email: user.email || '',
      password: '',
      role: user.role,
      is_active: user.is_active
    })
    setShowEditUser(true)
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card/80 backdrop-blur-md p-4 rounded-2xl border border-border/80">
        <div>
          <h2 className="text-xl font-bold">Quản lý Tài khoản Hệ thống</h2>
          <p className="text-xs text-muted-foreground">
            Phân quyền quản trị viên và trạng thái kích hoạt tài khoản
          </p>
        </div>
        <Button
          onClick={() => {
            setFormData({ username: '', email: '', password: '', role: 'user', is_active: true })
            setShowAddUser(true)
          }}
          className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Thêm Tài khoản
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {users.map((user) => (
          <Card
            key={user.id}
            className="rounded-2xl bg-card/85 backdrop-blur-md border-border/80 hover:border-indigo-500/40 hover:shadow-lg transition-all"
          >
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">{user.username}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3" />
                      <span>{user.email || 'Chưa cập nhật email'}</span>
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs font-mono">
                  #{user.id}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  className={
                    user.role === 'admin'
                      ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/25'
                      : 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/25'
                  }
                >
                  <Shield className="w-3 h-3 mr-1" />
                  {user.role}
                </Badge>
                <Badge
                  className={
                    user.is_active
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25'
                      : 'bg-slate-500/15 text-slate-500 border border-slate-500/25'
                  }
                >
                  {user.is_active ? 'Đang hoạt động' : 'Tạm khóa'}
                </Badge>
              </div>

              <div className="pt-3 border-t border-border/60 flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditUser(user)}
                  className="rounded-xl h-8 px-3 text-xs font-semibold"
                >
                  <Edit className="w-3.5 h-3.5 mr-1.5" />
                  Sửa
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteUser(user.id)}
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

      {/* Add User Dialog */}
      <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
        <DialogContent className="rounded-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle>Thêm Tài khoản mới</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="username">Tên đăng nhập *</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Nhập username"
                className="rounded-xl"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Nhập email"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Mật khẩu *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Nhập mật khẩu"
                className="rounded-xl"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="role">Vai trò</Label>
                <Select value={formData.role} onValueChange={(value) => handleSelectChange('role', value)}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="is_active">Trạng thái</Label>
                <Select
                  value={formData.is_active.toString()}
                  onValueChange={(value) => handleSelectChange('is_active', value === 'true')}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Hoạt động</SelectItem>
                    <SelectItem value="false">Tạm khóa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddUser(false)}
                className="rounded-xl"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Thêm Tài khoản
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditUser} onOpenChange={setShowEditUser}>
        <DialogContent className="rounded-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa Tài khoản</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditUser} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-username">Tên đăng nhập *</Label>
              <Input
                id="edit-username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Nhập username"
                className="rounded-xl"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Nhập email"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-password">Mật khẩu mới (để trống nếu giữ nguyên)</Label>
              <Input
                id="edit-password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Nhập mật khẩu mới"
                className="rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="edit-role">Vai trò</Label>
                <Select value={formData.role} onValueChange={(value) => handleSelectChange('role', value)}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-status">Trạng thái</Label>
                <Select
                  value={formData.is_active.toString()}
                  onValueChange={(value) => handleSelectChange('is_active', value === 'true')}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Hoạt động</SelectItem>
                    <SelectItem value="false">Tạm khóa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditUser(false)}
                className="rounded-xl"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Lưu cập nhật
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
