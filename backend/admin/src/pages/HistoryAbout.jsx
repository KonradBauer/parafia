import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Save, Upload, X, Church } from 'lucide-react'
import api from '@/services/api'

function HistoryAbout() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState(null)

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    content: '',
    imageUrl: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await api.getHistoryAbout()
      if (data) {
        setFormData({
          title: data.title || '',
          subtitle: data.subtitle || '',
          content: data.content || '',
          imageUrl: data.imageUrl || ''
        })
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Blad wczytywania danych' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const result = await api.uploadFile(file)
      setFormData(prev => ({ ...prev, imageUrl: result.url }))
      setMessage({ type: 'success', text: 'Zdjecie wyslane' })
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      await api.updateHistoryAbout(formData)
      setMessage({ type: 'success', text: 'Zapisano zmiany' })
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg flex items-center justify-between ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Church className="w-5 h-5" />
            Sekcja "O parafii" na stronie Historia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title and Subtitle */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subtitle">Napis nad tytulem</Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                placeholder="np. O parafii"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Tytul sekcji</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="np. Parafia Trojcy Przenajswietszej"
              />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Tresc (mozna uzyc nowej linii dla oddzielnych akapitow)</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              placeholder="Opis parafii i jej historia..."
              rows={8}
            />
          </div>

          {/* Image */}
          <div className="space-y-2">
            <Label>Zdjecie kosciola</Label>
            <div className="flex items-start gap-4">
              {formData.imageUrl ? (
                <div className="relative w-48 h-36 bg-muted rounded-lg overflow-hidden">
                  <img
                    src={formData.imageUrl}
                    alt="Zdjecie kosciola"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleChange('imageUrl', '')}
                    className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="w-48 h-36 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                  <Church className="w-12 h-12" />
                </div>
              )}
              <div>
                <Label htmlFor="image-upload" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted transition-colors">
                    {uploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    <span>{uploading ? 'Wysylanie...' : 'Wybierz zdjecie'}</span>
                  </div>
                </Label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Zapisz zmiany
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default HistoryAbout
