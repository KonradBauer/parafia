import { useState, useEffect } from 'react'
import api from '@/services/api'
import { useToast } from '@/hooks/useToast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import {
  BookOpen,
  Pencil,
  Trash2,
  Plus,
  X,
  Loader2,
  Calendar,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'

const initialForm = {
  startDate: '',
  endDate: '',
  intentions: [],
}

const initialIntention = {
  date: '',
  time: '',
  intention: '',
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
  const [expandedWeeks, setExpandedWeeks] = useState({})

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const result = await api.getIntentions()
      setData(result)
      // Expand first week by default
      if (result.length > 0) {
        setExpandedWeeks({ [result[0].id]: true })
      }
    } catch (err) {
      toast({ title: 'Błąd', description: err.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const toggleWeek = (weekId) => {
    setExpandedWeeks((prev) => ({
      ...prev,
      [weekId]: !prev[weekId],
    }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleIntentionChange = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      intentions: prev.intentions.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }))
  }

  const addIntention = () => {
    // Pre-fill date based on week range
    const newIntention = {
      ...initialIntention,
      date: form.startDate || '',
    }
    setForm((prev) => ({
      ...prev,
      intentions: [...prev.intentions, newIntention],
    }))
  }

  const removeIntention = (index) => {
    setForm((prev) => ({
      ...prev,
      intentions: prev.intentions.filter((_, i) => i !== index),
    }))
  }

  const openAdd = () => {
    setSelected(null)
    const today = new Date()
    const nextSunday = new Date(today)
    nextSunday.setDate(today.getDate() + (7 - today.getDay()))
    const nextSaturday = new Date(nextSunday)
    nextSaturday.setDate(nextSunday.getDate() + 6)

    setForm({
      startDate: nextSunday.toISOString().split('T')[0],
      endDate: nextSaturday.toISOString().split('T')[0],
      intentions: [],
    })
    setDialogOpen(true)
  }

  const openEdit = (week) => {
    setSelected(week)
    setForm({
      startDate: week.startDate || '',
      endDate: week.endDate || '',
      intentions: week.intentions?.map((i) => ({
        date: i.date || '',
        time: i.time || '',
        intention: i.intention || '',
      })) || [],
    })
    setDialogOpen(true)
  }

  const openDelete = (week) => {
    setSelected(week)
    setDeleteOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (selected) {
        await api.updateIntention(selected.id, form)
        toast({ title: 'Zapisano', description: 'Tydzień intencji został zaktualizowany', variant: 'success' })
      } else {
        await api.createIntention(form)
        toast({ title: 'Dodano', description: 'Tydzień intencji został dodany', variant: 'success' })
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
      toast({ title: 'Usunięto', description: 'Tydzień intencji został usunięty', variant: 'success' })
      setDeleteOpen(false)
      fetchData()
    } catch (err) {
      toast({ title: 'Błąd', description: err.message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const formatDateRange = (start, end) => {
    const formatDate = (dateStr) => {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      return date.toLocaleDateString('pl-PL', {
        day: 'numeric',
        month: 'long',
      })
    }
    return `${formatDate(start)} - ${formatDate(end)}`
  }

  const formatDayName = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('pl-PL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
  }

  const groupIntentionsByDate = (intentions) => {
    const groups = {}
    intentions?.forEach((i) => {
      if (!groups[i.date]) {
        groups[i.date] = []
      }
      groups[i.date].push(i)
    })
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
  }

  if (loading) return <LoadingState rows={3} />

  return (
    <>
      <PageHeader onAdd={openAdd} addLabel="Dodaj tydzień" />

      {data.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-1">Brak intencji</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Nie dodano jeszcze żadnych tygodni z intencjami.
          </p>
          <Button onClick={openAdd}>Dodaj tydzień</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((week) => (
            <Card key={week.id}>
              <CardHeader
                className="cursor-pointer"
                onClick={() => toggleWeek(week.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {expandedWeeks[week.id] ? (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    )}
                    <div>
                      <CardTitle className="text-base">
                        {formatDateRange(week.startDate, week.endDate)}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {week.intentions?.length || 0} intencji
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        openEdit(week)
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        openDelete(week)
                      }}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {expandedWeeks[week.id] && week.intentions?.length > 0 && (
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {groupIntentionsByDate(week.intentions).map(([date, intentions]) => (
                      <div key={date} className="bg-muted/50 rounded-lg p-3">
                        <h4 className="font-medium text-sm text-primary mb-2 capitalize">
                          {formatDayName(date)}
                        </h4>
                        <div className="space-y-1">
                          {intentions.map((intention, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-3 text-sm"
                            >
                              <span className="font-mono text-muted-foreground w-12 flex-shrink-0">
                                {intention.time}
                              </span>
                              <span>{intention.intention}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {selected ? 'Edytuj tydzień intencji' : 'Dodaj tydzień intencji'}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-4 space-y-6">
            {/* Week dates */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Data początkowa (niedziela)"
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={handleChange}
                required
              />
              <FormField
                label="Data końcowa (sobota)"
                name="endDate"
                type="date"
                value={form.endDate}
                onChange={handleChange}
                required
              />
            </div>

            {/* Intentions */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Intencje mszalne</h3>
                <Button type="button" variant="outline" size="sm" onClick={addIntention}>
                  <Plus className="w-4 h-4 mr-1" />
                  Dodaj intencję
                </Button>
              </div>

              {form.intentions.length === 0 ? (
                <div className="text-center py-8 bg-muted/50 rounded-lg">
                  <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Brak intencji. Kliknij "Dodaj intencję" aby rozpocząć.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {form.intentions.map((intention, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-[120px_80px_1fr_auto] gap-2 items-start bg-muted/50 p-3 rounded-lg"
                    >
                      <Input
                        type="date"
                        value={intention.date}
                        onChange={(e) =>
                          handleIntentionChange(index, 'date', e.target.value)
                        }
                        min={form.startDate}
                        max={form.endDate}
                      />
                      <Input
                        type="time"
                        value={intention.time}
                        onChange={(e) =>
                          handleIntentionChange(index, 'time', e.target.value)
                        }
                      />
                      <Input
                        type="text"
                        value={intention.intention}
                        onChange={(e) =>
                          handleIntentionChange(index, 'intention', e.target.value)
                        }
                        placeholder="Treść intencji..."
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeIntention(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="border-t pt-4">
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
        title="Usuń tydzień intencji"
        description={`Czy na pewno chcesz usunąć tydzień ${formatDateRange(
          selected?.startDate,
          selected?.endDate
        )} wraz ze wszystkimi intencjami?`}
      />
    </>
  )
}

export default Intentions
