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
import PageHeader from '@/components/PageHeader'
import LoadingState from '@/components/LoadingState'
import DeleteConfirm from '@/components/DeleteConfirm'
import FormField from '@/components/FormField'
import { Image, Pencil, Trash2, Loader2 } from 'lucide-react'

const categoryOptions = [
  { value: 'events', label: 'Wydarzenia' },
  { value: 'church', label: 'Kościół' },
  { value: 'parish', label: 'Parafia' },
  { value: 'other', label: 'Inne' },
]

const initialForm = {
  title: '',
  description: '',
  imageUrl: '',
  date: '',
  category: 'other',
  sortOrder: 0,
}

function Gallery() {
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
      const result = await api.getGallery()
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
      description: item.description || '',
      imageUrl: item.imageUrl || '',
      date: item.date || '',
      category: item.category || 'other',
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
        await api.updateGalleryItem(selected.id, payload)
        toast({ title: 'Zapisano', description: 'Zdjęcie zostało zaktualizowane', variant: 'success' })
      } else {
        await api.createGalleryItem(payload)
        toast({ title: 'Dodano', description: 'Zdjęcie zostało dodane', variant: 'success' })
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
      await api.deleteGalleryItem(selected.id)
      toast({ title: 'Usunięto', description: 'Zdjęcie zostało usunięte', variant: 'success' })
      setDeleteOpen(false)
      fetchData()
    } catch (err) {
      toast({ title: 'Błąd', description: err.message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const getCategoryLabel = (cat) => {
    const option = categoryOptions.find(o => o.value === cat)
    return option?.label || cat
  }

  if (loading) return <LoadingState rows={6} type="cards" />

  return (
    <>
      <PageHeader onAdd={openAdd} addLabel="Dodaj zdjęcie" />

      {data.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Image className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-1">Brak zdjęć w galerii</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Nie dodano jeszcze żadnych zdjęć do galerii.
          </p>
          <Button onClick={openAdd}>Dodaj zdjęcie</Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image className="w-12 h-12 text-muted-foreground" />
                )}
              </div>
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-medium text-sm truncate flex-1">{item.title}</h3>
                  <Badge variant="outline" className="text-xs shrink-0">
                    {getCategoryLabel(item.category)}
                  </Badge>
                </div>
                {item.description && (
                  <p className="text-xs text-muted-foreground truncate mb-2">
                    {item.description}
                  </p>
                )}
                {item.date && (
                  <p className="text-xs text-muted-foreground mb-2">{item.date}</p>
                )}
                <div className="flex justify-end gap-1 pt-2 border-t">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openDelete(item)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
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
              {selected ? 'Edytuj zdjęcie' : 'Dodaj zdjęcie'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <FormField
              label="Tytuł"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Nazwa zdjęcia"
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

            {form.imageUrl && (
              <div className="rounded-md overflow-hidden border">
                <img
                  src={form.imageUrl}
                  alt="Podgląd"
                  className="w-full h-32 object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              </div>
            )}

            <FormField
              label="Opis"
              name="description"
              type="textarea"
              value={form.description}
              onChange={handleChange}
              placeholder="Opis zdjęcia..."
              rows={2}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Kategoria"
                name="category"
                type="select"
                value={form.category}
                onChange={handleChange}
                options={categoryOptions}
              />
              <FormField
                label="Data"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
              />
            </div>

            <FormField
              label="Kolejność"
              name="sortOrder"
              type="number"
              value={form.sortOrder}
              onChange={handleChange}
              placeholder="0"
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
        title="Usuń zdjęcie"
        description={`Czy na pewno chcesz usunąć zdjęcie "${selected?.title}"?`}
      />
    </>
  )
}

export default Gallery
