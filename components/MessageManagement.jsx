'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import {
  Mail,
  Trash2,
  Clock,
  CheckCircle2,
  MessageSquare,
  User,
  Film,
  Copy,
  Check,
  Database
} from 'lucide-react'

const SETUP_SQL = `CREATE TABLE IF NOT EXISTS project_briefs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  contact_info VARCHAR(255),
  project_type VARCHAR(255),
  details TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE project_briefs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public all access for project_briefs" ON project_briefs FOR ALL USING (true) WITH CHECK (true);`

export default function MessageManagement({
  messages = [],
  tableMissing = false,
  onMessagesChange
}) {
  const [copiedSql, setCopiedSql] = useState(false)
  const [filterStatus, setFilterStatus] = useState('ALL')

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      const data = await response.json()
      if (data.success) {
        toast.success('Đã cập nhật trạng thái yêu cầu!')
        onMessagesChange && onMessagesChange()
      } else {
        toast.error(data.message || 'Không thể cập nhật trạng thái')
      }
    } catch (error) {
      console.error('Error updating message status:', error)
      toast.error('Lỗi kết nối server')
    }
  }

  const handleDeleteMessage = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa yêu cầu dự án này?')) return

    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      if (data.success) {
        toast.success('Đã xóa yêu cầu dự án!')
        onMessagesChange && onMessagesChange()
      } else {
        toast.error(data.message || 'Không thể xóa yêu cầu')
      }
    } catch (error) {
      console.error('Error deleting message:', error)
      toast.error('Lỗi kết nối server')
    }
  }

  const copySql = () => {
    navigator.clipboard.writeText(SETUP_SQL)
    setCopiedSql(true)
    toast.success('Đã sao chép lệnh SQL!')
    setTimeout(() => setCopiedSql(false), 2000)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'new':
        return (
          <Badge className="bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/25">
            Mới nhận
          </Badge>
        )
      case 'contacted':
        return (
          <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25">
            Đã liên hệ
          </Badge>
        )
      case 'completed':
        return (
          <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
            Hoàn thành
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const filteredMessages = messages.filter(
    (m) => filterStatus === 'ALL' || m.status === filterStatus
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card/80 backdrop-blur-md p-4 rounded-2xl border border-border/80">
        <div>
          <h2 className="text-xl font-bold">Yêu cầu Dự án từ Khách hàng (Project Briefs)</h2>
          <p className="text-xs text-muted-foreground">
            Danh sách các yêu cầu hợp tác được gửi từ biểu mẫu liên hệ trên trang Portfolio
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-44 h-10 rounded-xl bg-background">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả ({messages.length})</SelectItem>
              <SelectItem value="new">
                Mới nhận ({messages.filter((m) => m.status === 'new').length})
              </SelectItem>
              <SelectItem value="contacted">
                Đã liên hệ ({messages.filter((m) => m.status === 'contacted').length})
              </SelectItem>
              <SelectItem value="completed">
                Hoàn thành ({messages.filter((m) => m.status === 'completed').length})
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {tableMissing && (
        <Card className="rounded-2xl border-amber-500/40 bg-amber-500/5">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <Database className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="font-bold text-base">
                    Cần khởi tạo bảng `project_briefs` trên Supabase
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Hãy sao chép đoạn lệnh SQL dưới đây (hoặc từ file{' '}
                    <code>supabase_messages_setup.sql</code>) và chạy trong mục{' '}
                    <strong>SQL Editor</strong> của Supabase để bắt đầu lưu trữ tin nhắn:
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={copySql}
                className="rounded-xl shrink-0"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-4 h-4 mr-1.5 text-emerald-500" />
                    Đã chép
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1.5" />
                    Copy SQL
                  </>
                )}
              </Button>
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto">
              {SETUP_SQL}
            </pre>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredMessages.map((msg) => (
          <Card
            key={msg.id}
            className="rounded-2xl bg-card/85 backdrop-blur-md border-border/80 hover:border-indigo-500/40 hover:shadow-lg transition-all"
          >
            <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base">{msg.name}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        <span>
                          {msg.created_at
                            ? new Date(msg.created_at).toLocaleString('vi-VN')
                            : 'Vừa xong'}
                        </span>
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(msg.status)}
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {msg.project_type && (
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20">
                      <Film className="w-3.5 h-3.5" />
                      <span>{msg.project_type}</span>
                    </div>
                  )}
                  {msg.contact_info && (
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-secondary text-foreground border border-border">
                      <Mail className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{msg.contact_info}</span>
                    </div>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-secondary/45 border border-border/60 text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
                  {msg.details}
                </div>
              </div>

              <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                <Select
                  value={msg.status || 'new'}
                  onValueChange={(val) => handleStatusChange(msg.id, val)}
                >
                  <SelectTrigger className="w-36 h-8 text-xs rounded-xl bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Mới nhận</SelectItem>
                    <SelectItem value="contacted">Đã liên hệ</SelectItem>
                    <SelectItem value="completed">Hoàn thành</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteMessage(msg.id)}
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

      {!tableMissing && filteredMessages.length === 0 && (
        <Card className="bg-card/60 border-dashed border-border py-14 text-center rounded-2xl">
          <CardContent className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-secondary mx-auto flex items-center justify-center text-muted-foreground">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Chưa có yêu cầu dự án nào</h3>
            <p className="text-sm text-muted-foreground">
              Khi khách hàng gửi form liên hệ trên trang chủ, nội dung sẽ xuất hiện tại đây.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
