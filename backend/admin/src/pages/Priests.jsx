import { useState, useEffect } from 'react'
import api from '@/services/api'
import { useToast } from '@/hooks/useToast'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import PageHeader from '@/components/PageHeader'
import LoadingState from '@/components/LoadingState'
import DeleteConfirm from '@/components/DeleteConfirm'
import FormField from '@/components/FormField'
import FileUpload from '@/components/FileUpload'
import { User, Pencil, Trash2, Phone, Loader2 } from 'lucide-react'

const initialForm = {
  name: '',
  role: '',
  phone: '',
  photo: '',
}

function Priests() {
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
      const result = await api.getPriests()
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

  const handlePhotoChange = (url) => {
    setForm((prev) => ({ ...prev, photo: url }))
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
      role: item.role || '',
      phone: item.phone || '',
      photo: item.photo || '',
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
      const payload = { ...form }
      if (selected) {
        await api.updatePriest(selected.id, payload)
        toast({ title: 'Zapisano', description: 'Duszpasterz został zaktualizowany', variant: 'success' })
      } else {
        await api.createPriest(payload)
        toast({ title: 'Dodano', description: 'Duszpasterz został dodany', variant: 'success' })
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
      await api.deletePriest(selected.id)
      toast({ title: 'Usunięto', description: 'Duszpasterz został usunięty', variant: 'success' })
      setDeleteOpen(false)
      fetchData()
    } catch (err) {
      toast({ title: 'Błąd', description: err.message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingState rows={3} type="cards" />

  return (
    <>
      <PageHeader onAdd={openAdd} addLabel="Dodaj duszpasterza" />

      {data.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-1">Brak duszpasterzy</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Nie dodano jeszcze żadnych duszpasterzy.
          </p>
          <Button onClick={openAdd}>Dodaj duszpasterza</Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.map((priest) => (
            <Card key={priest.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                    {priest.photo ? (
                      <img
                        src={priest.photo}
                        alt={priest.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-10 h-10 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{priest.name}</h3>
                    <p className="text-sm text-muted-foreground">{priest.role}</p>
                    {priest.phone && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-2">
                        <Phone className="w-3 h-3" />
                        {priest.phone}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-1 mt-3 pt-3 border-t">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(priest)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openDelete(priest)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selected ? 'Edytuj duszpasterza' : 'Dodaj duszpasterza'}
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
              label="Funkcja"
              name="role"
              value={form.role}
              onChange={handleChange}
              placeholder="Proboszcz"
              required
            />

            <FormField
              label="Telefon"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="+48 123 456 789"
            />

            <div className="space-y-2">
              <Label>Zdjęcie</Label>
              <FileUpload
                value={form.photo}
                onChange={handlePhotoChange}
              />
            </div>
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
        title="Usuń duszpasterza"
        description={`Czy na pewno chcesz usunąć ${selected?.name}?`}
      />
    </>
  )
}

export default Priests
