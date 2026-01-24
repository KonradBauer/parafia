import { useState, useEffect } from 'react'
import api from '@/services/api'
import { useToast } from '@/hooks/useToast'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import LoadingState from '@/components/LoadingState'
import DeleteConfirm from '@/components/DeleteConfirm'
import { Mail, MailOpen, Trash2, Eye, Phone, AtSign } from 'lucide-react'

function Messages() {
  const { toast } = useToast()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewOpen, setViewOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const result = await api.getMessages()
      setData(result)
    } catch (err) {
      toast({ title: 'Błąd', description: err.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const openView = async (item) => {
    setSelected(item)
    setViewOpen(true)

    // Mark as read if unread
    if (!item.isRead) {
      try {
        await api.markMessageRead(item.id)
        setData((prev) =>
          prev.map((m) => (m.id === item.id ? { ...m, isRead: 1 } : m))
        )
      } catch (err) {
        console.error('Failed to mark as read:', err)
      }
    }
  }

  const openDelete = (item) => {
    setSelected(item)
    setDeleteOpen(true)
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await api.deleteMessage(selected.id)
      toast({ title: 'Usunięto', description: 'Wiadomość została usunięta', variant: 'success' })
      setDeleteOpen(false)
      setViewOpen(false)
      fetchData()
    } catch (err) {
      toast({ title: 'Błąd', description: err.message, variant: 'destructive' })
    } finally {
      setDeleting(false)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const unreadCount = data.filter((m) => !m.isRead).length

  if (loading) return <LoadingState rows={5} />

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Wiadomości</h2>
          {unreadCount > 0 && (
            <Badge variant="secondary">{unreadCount} nowych</Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Wiadomości wysłane przez formularz kontaktowy
        </p>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-1">Brak wiadomości</h3>
          <p className="text-sm text-muted-foreground">
            Nie otrzymano jeszcze żadnych wiadomości.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((message) => (
            <Card
              key={message.id}
              className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                !message.isRead ? 'border-l-4 border-l-secondary' : ''
              }`}
              onClick={() => openView(message)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    {message.isRead ? (
                      <MailOpen className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <Mail className="w-5 h-5 text-secondary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-medium truncate">{message.name}</span>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(message.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-primary truncate mb-1">
                      {message.subject}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {message.message}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      openDelete(message)
                    }}
                    className="text-destructive hover:text-destructive flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selected?.subject}</DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">{selected.name}</p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <AtSign className="w-3 h-3" />
                      {selected.email}
                    </span>
                    {selected.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {selected.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                Wysłano: {formatDate(selected.createdAt)}
              </div>

              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap">{selected.message}</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewOpen(false)}>
              Zamknij
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setViewOpen(false)
                setDeleteOpen(true)
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Usuń
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteConfirm
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        loading={deleting}
        title="Usuń wiadomość"
        description={`Czy na pewno chcesz usunąć wiadomość od ${selected?.name}?`}
      />
    </>
  )
}

export default Messages
