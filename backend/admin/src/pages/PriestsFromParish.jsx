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
import { Users, Loader2 } from 'lucide-react'

const initialForm = {
  name: '',
  ordinationYear: '',
  orderName: '',
  notes: '',
}

function PriestsFromParish() {
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
      const result = await api.getPriestsFromParish()
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
      name: item.name || '',
      ordinationYear: item.ordinationYear || '',
      orderName: item.orderName || '',
      notes: item.notes || '',
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
        ordinationYear: parseInt(form.ordinationYear) || 0,
      }
      if (selected) {
        await api.updatePriestFromParish(selected.id, payload)
        toast({ title: 'Zapisano', description: 'Ksiądz został zaktualizowany', variant: 'success' })
      } else {
        await api.createPriestFromParish(payload)
        toast({ title: 'Dodano', description: 'Ksiądz został dodany', variant: 'success' })
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
      await api.deletePriestFromParish(selected.id)
      toast({ title: 'Usunięto', description: 'Ksiądz został usunięty', variant: 'success' })
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
      key: 'name',
      label: 'Imię i nazwisko',
      render: (value) => <span className="font-medium">{value}</span>,
    },
    {
      key: 'ordinationYear',
      label: 'Rok święceń',
      className: 'w-[120px]',
    },
    {
      key: 'orderName',
      label: 'Zakon / Diecezja',
      render: (value) => value || '-',
    },
    {
      key: 'notes',
      label: 'Notatki',
      render: (value) => (
        <span className="text-muted-foreground text-sm truncate max-w-[200px] block">
          {value || '-'}
        </span>
      ),
    },
  ]

  if (loading) return <LoadingState rows={5} />

  return (
    <>
      <PageHeader onAdd={openAdd} addLabel="Dodaj księdza" />

      <DataTable
        columns={columns}
        data={data}
        onEdit={openEdit}
        onDelete={openDelete}
        emptyTitle="Brak księży z parafii"
        emptyDescription="Nie dodano jeszcze żadnych księży pochodzących z parafii."
        emptyIcon={Users}
        onAdd={openAdd}
        addLabel="Dodaj księdza"
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selected ? 'Edytuj księdza' : 'Dodaj księdza'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <FormField
              label="Imię i nazwisko"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="ks. Jan Kowalski"
              required
            />

            <FormField
              label="Rok święceń"
              name="ordinationYear"
              type="number"
              value={form.ordinationYear}
              onChange={handleChange}
              placeholder="1990"
              required
            />

            <FormField
              label="Zakon / Diecezja"
              name="orderName"
              value={form.orderName}
              onChange={handleChange}
              placeholder="np. Diecezja Częstochowska"
            />

            <FormField
              label="Notatki"
              name="notes"
              type="textarea"
              value={form.notes}
              onChange={handleChange}
              placeholder="Dodatkowe informacje..."
              rows={3}
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
        title="Usuń księdza"
        description={`Czy na pewno chcesz usunąć ${selected?.name}?`}
      />
    </>
  )
}

export default PriestsFromParish
