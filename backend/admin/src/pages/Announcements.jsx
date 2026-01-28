import { useState, useEffect } from 'react'
import api from '@/services/api'
import { useToast } from '@/hooks/useToast'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import PageHeader from '@/components/PageHeader'
import DataTable from '@/components/DataTable'
import LoadingState from '@/components/LoadingState'
import DeleteConfirm from '@/components/DeleteConfirm'
import FormField from '@/components/FormField'
import { Megaphone, Loader2 } from 'lucide-react'

const initialForm = {
  title: '',
  date: '',
  week: '',
  content: '',
  isNew: false,
}

function Announcements() {
  const { toast } = useToast()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const result = await api.getAnnouncements()
      setData(result)
    } catch (err) {
      toast({ title: 'Błąd', description: err.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const openAdd = () => {
    setSelected(null)
    setForm({ ...initialForm, date: new Date().toISOString().split('T')[0] })
    setDialogOpen(true)
  }

  const openEdit = (item) => {
    setSelected(item)
    setForm({
      title: item.title || '',
      date: item.date || '',
      week: item.week || '',
      content: item.content || '',
      isNew: !!item.isNew,
    })
    setDialogOpen(true)
  }

  const openDelete = (item) => {
    setSelected(item)
    setDeleteOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (selected) {
        await api.updateAnnouncement(selected.id, form)
        toast({ title: 'Zapisano', description: 'Ogłoszenie zostało zaktualizowane', variant: 'success' })
      } else {
        await api.createAnnouncement(form)
        toast({ title: 'Dodano', description: 'Ogłoszenie zostało dodane', variant: 'success' })
      }
      setDialogOpen(false)
      fetchData()
    } catch (err) {
      toast({ title: 'Błąd', description: err.message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setSaving(true)
    try {
      await api.deleteAnnouncement(selected.id)
      toast({ title: 'Usunięto', description: 'Ogłoszenie zostało usunięte', variant: 'success' })
      setDeleteOpen(false)
      fetchData()
    } catch (err) {
      toast({ title: 'Błąd', description: err.message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const columns = [
    {
      key: 'title',
      label: 'Tytuł',
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{value}</span>
          {row.isNew ? <Badge variant="secondary">Nowe</Badge> : null}
        </div>
      ),
    },
    {
      key: 'date',
      label: 'Data',
      className: 'w-[120px]',
    },
    {
      key: 'week',
      label: 'Tydzień',
      className: 'w-[150px]',
      render: (value) => value || '-',
    },
  ]

  if (loading) return <LoadingState rows={5} />

  return (
    <>
      <PageHeader onAdd={openAdd} addLabel="Dodaj ogłoszenie" />

      <DataTable
        columns={columns}
        data={data}
        onEdit={openEdit}
        onDelete={openDelete}
        emptyTitle="Brak ogłoszeń"
        emptyDescription="Nie dodano jeszcze żadnych ogłoszeń."
        emptyIcon={Megaphone}
        onAdd={openAdd}
        addLabel="Dodaj ogłoszenie"
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selected ? 'Edytuj ogłoszenie' : 'Dodaj ogłoszenie'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <FormField
              label="Tytuł"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Tytuł ogłoszenia"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Data"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                required
              />
              <FormField
                label="Tydzień (opcjonalnie)"
                name="week"
                value={form.week}
                onChange={handleChange}
                placeholder="np. I Tydzień Adwentu"
              />
            </div>

            <FormField
              label="Treść"
              name="content"
              type="textarea"
              value={form.content}
              onChange={handleChange}
              placeholder="Treść ogłoszenia..."
              rows={6}
            />

            <FormField
              label="Oznacz jako nowe"
              name="isNew"
              type="checkbox"
              value={form.isNew}
              onChange={handleChange}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              Anuluj
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {selected ? 'Zapisz' : 'Dodaj'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteConfirm
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        loading={saving}
        title="Usuń ogłoszenie"
        description={`Czy na pewno chcesz usunąć ogłoszenie "${selected?.title}"?`}
      />
    </>
  )
}

export default Announcements
