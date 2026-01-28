import { useState, useEffect } from 'react'
import api from '@/services/api'
import { useToast } from '@/hooks/useToast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import FormField from '@/components/FormField'
import LoadingState from '@/components/LoadingState'
import { Church, Save, Loader2 } from 'lucide-react'

const initialForm = {
  address: '',
  phone: '',
  email: '',
  officeHoursWeekday: '',
  officeHoursWeekend: '',
  bankAccount: '',
}

function ParishInfo() {
  const { toast } = useToast()
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const result = await api.getParishInfo()
      setForm({
        address: result.address || '',
        phone: result.phone || '',
        email: result.email || '',
        officeHoursWeekday: result.officeHoursWeekday || '',
        officeHoursWeekend: result.officeHoursWeekend || '',
        bankAccount: result.bankAccount || '',
      })
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

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.updateParishInfo(form)
      toast({ title: 'Zapisano', description: 'Dane parafii zostały zaktualizowane', variant: 'success' })
    } catch (err) {
      toast({ title: 'Błąd', description: err.message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingState rows={1} />

  return (
    <div className="max-w-2xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <Church className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div>
              <CardTitle>Dane parafii</CardTitle>
              <CardDescription>
                Informacje kontaktowe wyświetlane na stronie
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            label="Adres"
            name="address"
            type="textarea"
            value={form.address}
            onChange={handleChange}
            placeholder="ul. Przykładowa 1&#10;42-100 Przystajń"
            rows={3}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Telefon"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="+48 34 123 45 67"
            />
            <FormField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="parafia@example.pl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Godziny kancelarii (dni powszednie)"
              name="officeHoursWeekday"
              value={form.officeHoursWeekday}
              onChange={handleChange}
              placeholder="Pon-Pt: 9:00-12:00"
            />
            <FormField
              label="Godziny kancelarii (weekend)"
              name="officeHoursWeekend"
              value={form.officeHoursWeekend}
              onChange={handleChange}
              placeholder="Sob: 9:00-11:00"
            />
          </div>

          <FormField
            label="Numer konta bankowego"
            name="bankAccount"
            value={form.bankAccount}
            onChange={handleChange}
            placeholder="00 0000 0000 0000 0000 0000 0000"
          />

          <div className="pt-4 border-t">
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

export default ParishInfo
