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
import RichTextEditor from '@/components/RichTextEditor'
import { BookOpen, Loader2 } from 'lucide-react'

const initialForm = {
  title: '',
  content: '',
}

function Intentions() {
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
      const result = await api.getIntentions()
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
      title: item.title || '',
      content: item.content || '',
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
        await api.updateIntention(selected.id, form)
        toast({ title: 'Zapisano', description: 'Intencje zostały zaktualizowane', variant: 'success' })
      } else {
        await api.createIntention(form)
        toast({ title: 'Dodano', description: 'Intencje zostały dodane', variant: 'success' })
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
      await api.deleteIntention(selected.id)
      toast({ title: 'Usunięto', description: 'Intencje zostały usunięte', variant: 'success' })
      setDeleteOpen(false)
      fetchData()
    } catch (err) {
      toast({ title: 'Błąd', description: err.message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const columns = [
    {
      key: 'title',
      label: 'Tytuł',
      render: (value) => (
        <span className="font-medium">{value || 'Bez tytułu'}</span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Data utworzenia',
      className: 'w-[150px]',
      render: (value) => formatDate(value),
    },
  ]

  if (loading) return <LoadingState rows={5} />

  return (
    <>
      <PageHeader onAdd={openAdd} addLabel="Dodaj intencje" />

      <DataTable
        columns={columns}
        data={data}
        onEdit={openEdit}
        onDelete={openDelete}
        emptyTitle="Brak intencji"
        emptyDescription="Nie dodano jeszcze żadnych intencji."
        emptyIcon={BookOpen}
        onAdd={openAdd}
        addLabel="Dodaj intencje"
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selected ? 'Edytuj intencje' : 'Dodaj intencje'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <FormField
              label="Tytuł (opcjonalnie)"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="np. Intencje na tydzień 26.01-02.02"
            />

            <RichTextEditor
              label="Treść"
              value={form.content}
              onChange={(html) => setForm((prev) => ({ ...prev, content: html }))}
              required
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
        title="Usuń intencje"
        description={`Czy na pewno chcesz usunąć intencje "${selected?.title || 'Bez tytułu'}"?`}
      />
    </>
  )
}

export default Intentions
