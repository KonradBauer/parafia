import { useState, useEffect } from 'react'
import api from '@/services/api'
import { useToast } from '@/hooks/useToast'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
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
import { Image, Pencil, Trash2, Loader2, FolderPlus, Folder, ArrowLeft, Plus } from 'lucide-react'

// Get current date in YYYY-MM-DD format
const getCurrentDate = () => {
  const now = new Date()
  return now.toISOString().split('T')[0]
}

const initialPhotoForm = {
  title: '',
  description: '',
  imageUrl: '',
  date: getCurrentDate(),
}

const initialCategoryForm = {
  name: '',
}

function Gallery() {
  const { toast } = useToast()
  const [categories, setCategories] = useState([])
  const [photos, setPhotos] = useState([])
  const [allPhotos, setAllPhotos] = useState([])
  const [loading, setLoading] = useState(true)

  // Current view: null = categories list, number = inside category
  const [currentCategoryId, setCurrentCategoryId] = useState(null)
  const [currentCategory, setCurrentCategory] = useState(null)

  // Dialogs
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false)
  const [photoDeleteOpen, setPhotoDeleteOpen] = useState(false)
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [categoryDeleteOpen, setCategoryDeleteOpen] = useState(false)

  // Selected items
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)

  // Forms
  const [photoForm, setPhotoForm] = useState(initialPhotoForm)
  const [categoryForm, setCategoryForm] = useState(initialCategoryForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchCategories()
    fetchAllPhotos()
  }, [])

  useEffect(() => {
    if (currentCategoryId) {
      fetchPhotos(currentCategoryId)
      const cat = categories.find(c => c.id === currentCategoryId)
      setCurrentCategory(cat)
    } else {
      setPhotos([])
      setCurrentCategory(null)
    }
  }, [currentCategoryId, categories])

  const fetchCategories = async () => {
    try {
      const result = await api.getGalleryCategories()
      setCategories(result)
    } catch (err) {
      toast({ title: 'Błąd', description: err.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const fetchAllPhotos = async () => {
    try {
      const result = await api.getGallery()
      setAllPhotos(result)
    } catch (err) {
      // ignore
    }
  }

  const fetchPhotos = async (categoryId) => {
    try {
      const result = await api.getGallery()
      const filtered = result.filter(p => p.categoryId === categoryId)
      setPhotos(filtered)
    } catch (err) {
      toast({ title: 'Błąd', description: err.message, variant: 'destructive' })
    }
  }

  const getPhotosCount = (categoryId) => {
    return allPhotos.filter(p => p.categoryId === categoryId).length
  }

  // Category handlers
  const openAddCategory = () => {
    setSelectedCategory(null)
    setCategoryForm(initialCategoryForm)
    setCategoryDialogOpen(true)
  }

  const openEditCategory = (category, e) => {
    e.stopPropagation()
    setSelectedCategory(category)
    setCategoryForm({ name: category.name || '' })
    setCategoryDialogOpen(true)
  }

  const openDeleteCategory = (category, e) => {
    e.stopPropagation()
    setSelectedCategory(category)
    setCategoryDeleteOpen(true)
  }

  const handleSaveCategory = async () => {
    setSaving(true)
    try {
      if (selectedCategory) {
        await api.updateGalleryCategory(selectedCategory.id, categoryForm)
        toast({ title: 'Zapisano', description: 'Album został zaktualizowany', variant: 'success' })
      } else {
        await api.createGalleryCategory(categoryForm)
        toast({ title: 'Dodano', description: 'Album został utworzony', variant: 'success' })
      }
      setCategoryDialogOpen(false)
      fetchCategories()
    } catch (err) {
      toast({ title: 'Błąd', description: err.message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteCategory = async () => {
    setSaving(true)
    try {
      await api.deleteGalleryCategory(selectedCategory.id)
      toast({ title: 'Usunięto', description: 'Album został usunięty', variant: 'success' })
      setCategoryDeleteOpen(false)
      fetchCategories()
      fetchAllPhotos()
    } catch (err) {
      toast({ title: 'Błąd', description: err.message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  // Photo handlers
  const openAddPhoto = () => {
    setSelectedPhoto(null)
    setPhotoForm({ ...initialPhotoForm, date: getCurrentDate() })
    setPhotoDialogOpen(true)
  }

  const openEditPhoto = (photo) => {
    setSelectedPhoto(photo)
    setPhotoForm({
      title: photo.title || '',
      description: photo.description || '',
      imageUrl: photo.imageUrl || '',
      date: photo.date || getCurrentDate(),
    })
    setPhotoDialogOpen(true)
  }

  const openDeletePhoto = (photo) => {
    setSelectedPhoto(photo)
    setPhotoDeleteOpen(true)
  }

  const handlePhotoFormChange = (e) => {
    const { name, value } = e.target
    setPhotoForm(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (url) => {
    setPhotoForm(prev => ({ ...prev, imageUrl: url }))
  }

  const handleSavePhoto = async () => {
    setSaving(true)
    try {
      const payload = {
        title: photoForm.title,
        description: photoForm.description,
        imageUrl: photoForm.imageUrl,
        date: photoForm.date || getCurrentDate(),
        categoryId: currentCategoryId,
      }
      if (selectedPhoto) {
        await api.updateGalleryItem(selectedPhoto.id, payload)
        toast({ title: 'Zapisano', description: 'Zdjęcie zostało zaktualizowane', variant: 'success' })
      } else {
        await api.createGalleryItem(payload)
        toast({ title: 'Dodano', description: 'Zdjęcie zostało dodane', variant: 'success' })
      }
      setPhotoDialogOpen(false)
      fetchPhotos(currentCategoryId)
      fetchAllPhotos()
    } catch (err) {
      toast({ title: 'Błąd', description: err.message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleDeletePhoto = async () => {
    setSaving(true)
    try {
      await api.deleteGalleryItem(selectedPhoto.id)
      toast({ title: 'Usunięto', description: 'Zdjęcie zostało usunięte', variant: 'success' })
      setPhotoDeleteOpen(false)
      fetchPhotos(currentCategoryId)
      fetchAllPhotos()
    } catch (err) {
      toast({ title: 'Błąd', description: err.message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const enterCategory = (categoryId) => {
    setCurrentCategoryId(categoryId)
  }

  const goBack = () => {
    setCurrentCategoryId(null)
  }

  if (loading) return <LoadingState rows={6} type="cards" />

  // INSIDE ALBUM VIEW
  if (currentCategoryId && currentCategory) {
    return (
      <>
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={goBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{currentCategory.name}</h1>
            <p className="text-sm text-muted-foreground">{photos.length} zdjęć</p>
          </div>
          <Button onClick={openAddPhoto}>
            <Plus className="w-4 h-4 mr-2" />
            Dodaj zdjęcie
          </Button>
        </div>

        {photos.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Image className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">Brak zdjęć</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Ten album nie zawiera jeszcze żadnych zdjęć.
            </p>
            <Button onClick={openAddPhoto}>Dodaj zdjęcie</Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {photos.map((photo) => (
              <Card key={photo.id} className="overflow-hidden">
                <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden">
                  {photo.imageUrl ? (
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image className="w-12 h-12 text-muted-foreground" />
                  )}
                </div>
                <CardContent className="p-3">
                  <h3 className="font-medium text-sm truncate mb-1">{photo.title}</h3>
                  {photo.description && (
                    <p className="text-xs text-muted-foreground truncate mb-2">
                      {photo.description}
                    </p>
                  )}
                  {photo.date && (
                    <p className="text-xs text-muted-foreground mb-2">{photo.date}</p>
                  )}
                  <div className="flex justify-end gap-1 pt-2 border-t">
                    <Button variant="ghost" size="sm" onClick={() => openEditPhoto(photo)}>
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDeletePhoto(photo)}
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

        {/* Add/Edit Photo Dialog */}
        <Dialog open={photoDialogOpen} onOpenChange={setPhotoDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {selectedPhoto ? 'Edytuj zdjęcie' : 'Dodaj zdjęcie'}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <FormField
                label="Tytuł"
                name="title"
                value={photoForm.title}
                onChange={handlePhotoFormChange}
                placeholder="Nazwa zdjęcia"
                required
              />

              <div className="space-y-2">
                <Label>Zdjęcie</Label>
                <FileUpload
                  value={photoForm.imageUrl}
                  onChange={handleImageChange}
                />
              </div>

              <FormField
                label="Opis (opcjonalnie)"
                name="description"
                type="textarea"
                value={photoForm.description}
                onChange={handlePhotoFormChange}
                placeholder="Opis zdjęcia..."
                rows={2}
              />

              <FormField
                label="Data (opcjonalnie)"
                name="date"
                type="date"
                value={photoForm.date}
                onChange={handlePhotoFormChange}
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setPhotoDialogOpen(false)} disabled={saving}>
                Anuluj
              </Button>
              <Button onClick={handleSavePhoto} disabled={saving || !photoForm.title.trim()}>
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {selectedPhoto ? 'Zapisz' : 'Dodaj'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Photo Confirm */}
        <DeleteConfirm
          open={photoDeleteOpen}
          onOpenChange={setPhotoDeleteOpen}
          onConfirm={handleDeletePhoto}
          loading={saving}
          title="Usuń zdjęcie"
          description={`Czy na pewno chcesz usunąć zdjęcie "${selectedPhoto?.title}"?`}
        />
      </>
    )
  }

  // ALBUMS LIST VIEW
  return (
    <>
      <PageHeader onAdd={openAddCategory} addLabel="Dodaj album" />

      {categories.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <FolderPlus className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-1">Brak albumów</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Utwórz pierwszy album, aby dodawać zdjęcia.
          </p>
          <Button onClick={openAddCategory}>Dodaj album</Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => enterCategory(category.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Folder className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {getPhotosCount(category.id)} zdjęć
                    </p>
                  </div>
                </div>
                <div className="flex justify-end gap-1 mt-4 pt-4 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => openEditCategory(category, e)}
                  >
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => openDeleteCategory(category, e)}
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

      {/* Add/Edit Album Dialog */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {selectedCategory ? 'Edytuj album' : 'Dodaj album'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Nazwa albumu</Label>
              <Input
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ name: e.target.value })}
                placeholder="np. Boże Ciało 2024"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCategoryDialogOpen(false)} disabled={saving}>
              Anuluj
            </Button>
            <Button onClick={handleSaveCategory} disabled={saving || !categoryForm.name.trim()}>
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {selectedCategory ? 'Zapisz' : 'Dodaj'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Album Confirm */}
      <DeleteConfirm
        open={categoryDeleteOpen}
        onOpenChange={setCategoryDeleteOpen}
        onConfirm={handleDeleteCategory}
        loading={saving}
        title="Usuń album"
        description={`Czy na pewno chcesz usunąć album "${selectedCategory?.name}"? Wszystkie zdjęcia w tym albumie zostaną usunięte.`}
      />
    </>
  )
}

export default Gallery
