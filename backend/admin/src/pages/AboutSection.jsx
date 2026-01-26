import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Save, Upload, X, Info } from 'lucide-react'
import api from '@/services/api'

function AboutSection() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState(null)

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    content: '',
    imageUrl: '',
    stat1Label: '',
    stat1Value: '',
    stat2Label: '',
    stat2Value: '',
    stat3Label: '',
    stat3Value: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await api.getAboutSection()
      if (data) {
        setFormData({
          title: data.title || '',
          subtitle: data.subtitle || '',
          content: data.content || '',
          imageUrl: data.imageUrl || '',
          stat1Label: data.stat1Label || '',
          stat1Value: data.stat1Value || '',
          stat2Label: data.stat2Label || '',
          stat2Value: data.stat2Value || '',
          stat3Label: data.stat3Label || '',
          stat3Value: data.stat3Value || ''
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
      await api.updateAboutSection(formData)
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
            <Info className="w-5 h-5" />
            Sekcja "O nas" na stronie glownej
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
                placeholder="np. O nas"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Tytul sekcji</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="np. Nasza Parafia"
              />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Tresc</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              placeholder="Opis parafii..."
              rows={6}
            />
          </div>

          {/* Image */}
          <div className="space-y-2">
            <Label>Zdjecie</Label>
            <div className="flex items-start gap-4">
              {formData.imageUrl ? (
                <div className="relative w-48 h-36 bg-muted rounded-lg overflow-hidden">
                  <img
                    src={formData.imageUrl}
                    alt="Zdjecie sekcji"
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
                  Brak zdjecia
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

          {/* Statistics */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Statystyki (3 kafelki)</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Stat 1 */}
              <div className="p-4 border rounded-lg space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="stat1Value">Wartosc 1</Label>
                  <Input
                    id="stat1Value"
                    value={formData.stat1Value}
                    onChange={(e) => handleChange('stat1Value', e.target.value)}
                    placeholder="np. 500+"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stat1Label">Opis 1</Label>
                  <Input
                    id="stat1Label"
                    value={formData.stat1Label}
                    onChange={(e) => handleChange('stat1Label', e.target.value)}
                    placeholder="np. lat historii"
                  />
                </div>
              </div>

              {/* Stat 2 */}
              <div className="p-4 border rounded-lg space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="stat2Value">Wartosc 2</Label>
                  <Input
                    id="stat2Value"
                    value={formData.stat2Value}
                    onChange={(e) => handleChange('stat2Value', e.target.value)}
                    placeholder="np. 1000+"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stat2Label">Opis 2</Label>
                  <Input
                    id="stat2Label"
                    value={formData.stat2Label}
                    onChange={(e) => handleChange('stat2Label', e.target.value)}
                    placeholder="np. parafian"
                  />
                </div>
              </div>

              {/* Stat 3 */}
              <div className="p-4 border rounded-lg space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="stat3Value">Wartosc 3</Label>
                  <Input
                    id="stat3Value"
                    value={formData.stat3Value}
                    onChange={(e) => handleChange('stat3Value', e.target.value)}
                    placeholder="np. 4"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stat3Label">Opis 3</Label>
                  <Input
                    id="stat3Label"
                    value={formData.stat3Label}
                    onChange={(e) => handleChange('stat3Label', e.target.value)}
                    placeholder="np. Msze dziennie"
                  />
                </div>
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

export default AboutSection
