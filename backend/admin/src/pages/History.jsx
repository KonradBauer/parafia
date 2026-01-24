import { useState, useEffect } from 'react'
import api from '@/services/api'
import { useToast } from '@/hooks/useToast'
import { Button } from '@/components/ui/button'
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
import { History as HistoryIcon, Loader2 } from 'lucide-react'

const initialForm = {
  year: '',
  title: '',
  content: '',
  imageUrl: '',
  sortOrder: 0,
}

function History() {
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
      const result = await api.getHistory()
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
    setForm(initialForm)
    setDialogOpen(true)
  }

  const openEdit = (item) => {
    setSelected(item)
    setForm({
      year: item.year || '',
      title: item.title || '',
      content: item.content || '',
      imageUrl: item.imageUrl || '',
      sortOrder: item.sortOrder || 0,
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
      const payload = {
        ...form,
        year: parseInt(form.year) || 0,
        sortOrder: parseInt(form.sortOrder) || 0,
      }
      if (selected) {
        await api.updateHistoryItem(selected.id, payload)
        toast({ title: 'Zapisano', description: 'Wpis historyczny został zaktualizowany', variant: 'success' })
      } else {
        await api.createHistoryItem(payload)
        toast({ title: 'Dodano', description: 'Wpis historyczny został dodany', variant: 'success' })
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
      await api.deleteHistoryItem(selected.id)
      toast({ title: 'Usunięto', description: 'Wpis historyczny został usunięty', variant: 'success' })
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
      key: 'year',
      label: 'Rok',
      className: 'w-[80px]',
      render: (value) => <span className="font-mono font-semibold">{value}</span>,
    },
    {
      key: 'title',
      label: 'Tytuł',
      render: (value) => <span className="font-medium">{value}</span>,
    },
    {
      key: 'content',
      label: 'Treść',
      render: (value) => (
        <span className="text-muted-foreground text-sm truncate max-w-[300px] block">
          {value?.substring(0, 100)}...
        </span>
      ),
    },
    {
      key: 'sortOrder',
      label: 'Kolejność',
      className: 'w-[100px]',
    },
  ]

  if (loading) return <LoadingState rows={5} />

  return (
    <>
      <PageHeader onAdd={openAdd} addLabel="Dodaj wpis" />

      <DataTable
        columns={columns}
        data={data}
        onEdit={openEdit}
        onDelete={openDelete}
        emptyTitle="Brak wpisów historycznych"
        emptyDescription="Nie dodano jeszcze żadnych wpisów do historii parafii."
        emptyIcon={HistoryIcon}
        onAdd={openAdd}
        addLabel="Dodaj wpis"
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selected ? 'Edytuj wpis historyczny' : 'Dodaj wpis historyczny'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Rok"
                name="year"
                type="number"
                value={form.year}
                onChange={handleChange}
                placeholder="np. 1920"
                required
              />
              <FormField
                label="Kolejność"
                name="sortOrder"
                type="number"
                value={form.sortOrder}
                onChange={handleChange}
                placeholder="0"
              />
            </div>

            <FormField
              label="Tytuł"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Tytuł wydarzenia"
              required
            />

            <FormField
              label="Treść"
              name="content"
              type="textarea"
              value={form.content}
              onChange={handleChange}
              placeholder="Opis wydarzenia historycznego..."
              rows={6}
              required
            />

            <FormField
              label="URL zdjęcia"
              name="imageUrl"
              type="url"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://..."
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
        title="Usuń wpis historyczny"
        description={`Czy na pewno chcesz usunąć wpis "${selected?.title}"?`}
      />
    </>
  )
}

export default History
