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
import { Clock, Loader2 } from 'lucide-react'

const dayTypeOptions = [
  { value: 'sunday', label: 'Niedziela / Święto' },
  { value: 'weekday', label: 'Dzień powszedni' },
  { value: 'holiday', label: 'Święto kościelne' },
]

const initialForm = {
  time: '',
  dayType: 'sunday',
  description: '',
  sortOrder: 0,
}

function MassTimes() {
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
      const result = await api.getMassTimes()
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
      time: item.time || '',
      dayType: item.dayType || 'sunday',
      description: item.description || '',
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
        sortOrder: parseInt(form.sortOrder) || 0,
      }
      if (selected) {
        await api.updateMassTime(selected.id, payload)
        toast({ title: 'Zapisano', description: 'Godzina Mszy została zaktualizowana', variant: 'success' })
      } else {
        await api.createMassTime(payload)
        toast({ title: 'Dodano', description: 'Godzina Mszy została dodana', variant: 'success' })
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
      await api.deleteMassTime(selected.id)
      toast({ title: 'Usunięto', description: 'Godzina Mszy została usunięta', variant: 'success' })
      setDeleteOpen(false)
      fetchData()
    } catch (err) {
      toast({ title: 'Błąd', description: err.message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const getDayTypeLabel = (type) => {
    const option = dayTypeOptions.find(o => o.value === type)
    return option?.label || type
  }

  const getDayTypeBadge = (type) => {
    const variants = {
      sunday: 'default',
      weekday: 'secondary',
      holiday: 'outline',
    }
    return <Badge variant={variants[type] || 'default'}>{getDayTypeLabel(type)}</Badge>
  }

  const columns = [
    {
      key: 'time',
      label: 'Godzina',
      className: 'w-[100px]',
      render: (value) => <span className="font-mono font-medium">{value}</span>,
    },
    {
      key: 'dayType',
      label: 'Typ dnia',
      className: 'w-[180px]',
      render: (value) => getDayTypeBadge(value),
    },
    {
      key: 'description',
      label: 'Opis',
      render: (value) => value || '-',
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
      <PageHeader onAdd={openAdd} addLabel="Dodaj godzinę" />

      <DataTable
        columns={columns}
        data={data}
        onEdit={openEdit}
        onDelete={openDelete}
        emptyTitle="Brak godzin Mszy"
        emptyDescription="Nie dodano jeszcze żadnych godzin Mszy św."
        emptyIcon={Clock}
        onAdd={openAdd}
        addLabel="Dodaj godzinę"
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selected ? 'Edytuj godzinę Mszy' : 'Dodaj godzinę Mszy'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Godzina"
                name="time"
                type="time"
                value={form.time}
                onChange={handleChange}
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
              label="Typ dnia"
              name="dayType"
              type="select"
              value={form.dayType}
              onChange={handleChange}
              options={dayTypeOptions}
              required
            />

            <FormField
              label="Opis (opcjonalnie)"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="np. Msza z udziałem dzieci"
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
        title="Usuń godzinę Mszy"
        description={`Czy na pewno chcesz usunąć Mszę o godz. ${selected?.time}?`}
      />
    </>
  )
}

export default MassTimes
