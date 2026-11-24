'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Plus, Edit, Trash2, Tag } from 'lucide-react'

export default function CategoryManagement({ categories = [], onCategoriesChange }) {
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [showEditCategory, setShowEditCategory] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#6366F1'
  })

  const handleAddCategory = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(`/api/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Đã thêm danh mục thành công!')
        setShowAddCategory(false)
        setFormData({ name: '', description: '', color: '#6366F1' })
        onCategoriesChange && onCategoriesChange()
      } else {
        toast.error(data.message || 'Thêm danh mục thất bại')
      }
    } catch (error) {
      console.error('Error adding category:', error)
      toast.error('Lỗi khi thêm danh mục')
    }
  }

  const handleEditCategory = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(`/api/categories/${selectedCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Đã cập nhật danh mục!')
        setShowEditCategory(false)
        setSelectedCategory(null)
        setFormData({ name: '', description: '', color: '#6366F1' })
        onCategoriesChange && onCategoriesChange()
      } else {
        toast.error(data.message || 'Cập nhật danh mục thất bại')
      }
    } catch (error) {
      console.error('Error updating category:', error)
      toast.error('Lỗi khi cập nhật danh mục')
    }
  }

  const handleDeleteCategory = async (categoryId) => {
    if (!confirm('Bạn có chắc muốn xóa danh mục này?')) return

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Đã xóa danh mục!')
        onCategoriesChange && onCategoriesChange()
      } else {
        toast.error(data.message || 'Xóa danh mục thất bại')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error('Lỗi khi xóa danh mục')
    }
  }

  const openEditCategory = (category) => {
    setSelectedCategory(category)
    setFormData({
      name: category.name,
      description: category.description || '',
      color: category.color || '#6366F1'
    })
    setShowEditCategory(true)
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card/80 backdrop-blur-md p-4 rounded-2xl border border-border/80">
        <div>
          <h2 className="text-xl font-bold">Quản lý Danh mục Video</h2>
          <p className="text-xs text-muted-foreground">
            Phân loại các dự án trên trang Portfolio công khai
          </p>
        </div>
        <Button
          onClick={() => {
            setFormData({ name: '', description: '', color: '#6366F1' })
            setShowAddCategory(true)
          }}
          className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Thêm Danh mục
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((category) => (
          <Card
            key={category.id}
            className="rounded-2xl bg-card/85 backdrop-blur-md border-border/80 hover:border-indigo-500/40 hover:shadow-lg transition-all"
          >
            <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/15 shadow-sm"
                    style={{ backgroundColor: `${category.color || '#6366F1'}20` }}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: category.color || '#6366F1' }}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">{category.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {category.description || 'Chưa có mô tả cho danh mục này'}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs font-mono">
                  #{category.id}
                </Badge>
              </div>

              <div className="pt-3 border-t border-border/60 flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditCategory(category)}
                  className="rounded-xl h-8 px-3 text-xs font-semibold"
                >
                  <Edit className="w-3.5 h-3.5 mr-1.5" />
                  Sửa
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteCategory(category.id)}
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

      {categories.length === 0 && (
        <Card className="bg-card/60 border-dashed border-border py-12 text-center rounded-2xl">
          <CardContent className="space-y-3">
            <Tag className="w-10 h-10 text-muted-foreground mx-auto" />
            <p className="font-semibold">Chưa có danh mục nào</p>
          </CardContent>
        </Card>
      )}

      {/* Add Category Dialog */}
      <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
        <DialogContent className="rounded-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle>Thêm Danh mục mới</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddCategory} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Tên Danh mục *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="VD: Commercial, Short-form, Cinematic..."
                className="rounded-xl"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description">Mô tả</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Nhập mô tả ngắn gọn"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="color">Màu nhận diện</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="color"
                  name="color"
                  type="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="h-11 w-20 p-1 rounded-xl cursor-pointer"
                />
                <span className="text-xs font-mono text-muted-foreground">
                  {formData.color}
                </span>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddCategory(false)}
                className="rounded-xl"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Thêm Danh mục
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={showEditCategory} onOpenChange={setShowEditCategory}>
        <DialogContent className="rounded-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa Danh mục</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditCategory} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-name">Tên Danh mục *</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nhập tên danh mục"
                className="rounded-xl"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-description">Mô tả</Label>
              <Input
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Nhập mô tả"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-color">Màu nhận diện</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="edit-color"
                  name="color"
                  type="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="h-11 w-20 p-1 rounded-xl cursor-pointer"
                />
                <span className="text-xs font-mono text-muted-foreground">
                  {formData.color}
                </span>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditCategory(false)}
                className="rounded-xl"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Lưu thay đổi
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
