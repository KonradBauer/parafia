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
import { Calendar, Loader2 } from 'lucide-react'

const initialForm = {
  title: '',
  date: '',
  time: '',
  description: '',
}

function Events() {
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
      const result = await api.getEvents()
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
      time: item.time || '',
      description: item.description || '',
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
        await api.updateEvent(selected.id, form)
        toast({ title: 'Zapisano', description: 'Wydarzenie zostało zaktualizowane', variant: 'success' })
      } else {
        await api.createEvent(form)
        toast({ title: 'Dodano', description: 'Wydarzenie zostało dodane', variant: 'success' })
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
      await api.deleteEvent(selected.id)
      toast({ title: 'Usunięto', description: 'Wydarzenie zostało usunięte', variant: 'success' })
      setDeleteOpen(false)
      fetchData()
    } catch (err) {
      toast({ title: 'Błąd', description: err.message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const isPast = (date) => {
    const today = new Date().toISOString().split('T')[0]
    return date < today
  }

  const columns = [
    {
      key: 'title',
      label: 'Tytuł',
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <span className={`font-medium ${isPast(row.date) ? 'text-muted-foreground' : ''}`}>
            {value}
          </span>
          {isPast(row.date) && <Badge variant="outline">Minione</Badge>}
        </div>
      ),
    },
    {
      key: 'date',
      label: 'Data',
      className: 'w-[120px]',
    },
    {
      key: 'time',
      label: 'Godzina',
      className: 'w-[100px]',
      render: (value) => value || '-',
    },
    {
      key: 'description',
      label: 'Opis',
      render: (value) => (
        <span className="text-muted-foreground text-sm truncate max-w-[250px] block">
          {value || '-'}
        </span>
      ),
    },
  ]

  if (loading) return <LoadingState rows={5} />

  return (
    <>
      <PageHeader onAdd={openAdd} addLabel="Dodaj wydarzenie" />

      <DataTable
        columns={columns}
        data={data}
        onEdit={openEdit}
        onDelete={openDelete}
        emptyTitle="Brak wydarzeń"
        emptyDescription="Nie dodano jeszcze żadnych wydarzeń."
        emptyIcon={Calendar}
        onAdd={openAdd}
        addLabel="Dodaj wydarzenie"
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selected ? 'Edytuj wydarzenie' : 'Dodaj wydarzenie'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <FormField
              label="Tytuł"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Nazwa wydarzenia"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Data"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                required
              />
              <FormField
                label="Godzina"
                name="time"
                type="time"
                value={form.time}
                onChange={handleChange}
              />
            </div>

            <FormField
              label="Opis"
              name="description"
              type="textarea"
              value={form.description}
              onChange={handleChange}
              placeholder="Opis wydarzenia..."
              rows={4}
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
        title="Usuń wydarzenie"
        description={`Czy na pewno chcesz usunąć wydarzenie "${selected?.title}"?`}
      />
    </>
  )
}

export default Events
