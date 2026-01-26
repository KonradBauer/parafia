import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
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
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import LoadingState from '@/components/LoadingState'
import DeleteConfirm from '@/components/DeleteConfirm'
import {
  BookOpen,
  Plus,
  Trash2,
  Loader2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Save,
  ArrowLeft,
} from 'lucide-react'

const MONTHS = [
  { value: 1, label: 'Styczeń' },
  { value: 2, label: 'Luty' },
  { value: 3, label: 'Marzec' },
  { value: 4, label: 'Kwiecień' },
  { value: 5, label: 'Maj' },
  { value: 6, label: 'Czerwiec' },
  { value: 7, label: 'Lipiec' },
  { value: 8, label: 'Sierpień' },
  { value: 9, label: 'Wrzesień' },
  { value: 10, label: 'Październik' },
  { value: 11, label: 'Listopad' },
  { value: 12, label: 'Grudzień' },
]

function Intentions() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Current view
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(null)

  // Form for editing month's intentions
  // Each intention has: id (from DB or null for new), date, time, intention, isNew, isModified
  const [intentions, setIntentions] = useState([])
  const [monthId, setMonthId] = useState(null)
  const [hasChanges, setHasChanges] = useState(false)

  // Modals
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [intentionToDelete, setIntentionToDelete] = useState(null)
  const [saveModalOpen, setSaveModalOpen] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  // Handle browser back/forward and page unload
  useEffect(() => {
    if (!hasChanges || selectedMonth === null) return

    const handleBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasChanges, selectedMonth])

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

  const getIntentionsCount = (year, month) => {
    const monthData = data.find(d => d.year === year && d.month === month)
    return monthData?.intentions?.length || 0
  }

  const enterMonth = (month) => {
    setSelectedMonth(month)
    const monthData = data.find(d => d.year === currentYear && d.month === month)
    if (monthData) {
      setMonthId(monthData.id)
      setIntentions(monthData.intentions?.map(i => ({
        id: i.id,
        date: i.date || '',
        time: i.time || '',
        intention: i.intention || '',
        isNew: false,
        isModified: false,
      })) || [])
    } else {
      setMonthId(null)
      setIntentions([])
    }
    setHasChanges(false)
  }

  const tryGoBack = () => {
    if (hasChanges) {
      setPendingNavigation('back')
      setSaveModalOpen(true)
    } else {
      doGoBack()
    }
  }

  const doGoBack = () => {
    setSelectedMonth(null)
    setIntentions([])
    setMonthId(null)
    setHasChanges(false)
  }

  const handleSaveModalSave = async () => {
    setSaveModalOpen(false)
    await handleSave()
    if (pendingNavigation === 'back') {
      doGoBack()
    } else if (pendingNavigation) {
      navigate(pendingNavigation)
    }
    setPendingNavigation(null)
  }

  const handleSaveModalDiscard = () => {
    setSaveModalOpen(false)
    setHasChanges(false)
    if (pendingNavigation === 'back') {
      doGoBack()
    } else if (pendingNavigation) {
      navigate(pendingNavigation)
    }
    setPendingNavigation(null)
  }

  const handleSaveModalCancel = () => {
    setSaveModalOpen(false)
    setPendingNavigation(null)
  }

  const handleIntentionChange = (index, field, value) => {
    setIntentions(prev => prev.map((item, i) =>
      i === index ? { ...item, [field]: value, isModified: !item.isNew } : item
    ))
    setHasChanges(true)
  }

  const getDefaultDate = () => {
    const day = new Date().getDate()
    const daysInMonth = new Date(currentYear, selectedMonth, 0).getDate()
    const safeDay = Math.min(day, daysInMonth)
    return `${currentYear}-${String(selectedMonth).padStart(2, '0')}-${String(safeDay).padStart(2, '0')}`
  }

  const addIntention = () => {
    setIntentions(prev => [...prev, {
      id: null,
      date: getDefaultDate(),
      time: '',
      intention: '',
      isNew: true,
      isModified: false,
    }])
    setHasChanges(true)
  }

  const openDeleteModal = (index) => {
    setIntentionToDelete(index)
    setDeleteModalOpen(true)
  }

  const confirmDeleteIntention = async () => {
    if (intentionToDelete === null) return

    const intention = intentions[intentionToDelete]
    setDeleteModalOpen(false)

    // If it's an existing intention (has ID), delete from database immediately
    if (intention.id && monthId) {
      setDeleting(true)
      try {
        // Get current intentions without the deleted one
        const remainingIntentions = intentions
          .filter((_, i) => i !== intentionToDelete)
          .filter(i => i.date && i.time && i.intention)
          .map(i => ({ date: i.date, time: i.time, intention: i.intention }))

        // Update the month with remaining intentions
        await api.updateIntention(monthId, {
          year: currentYear,
          month: selectedMonth,
          intentions: remainingIntentions,
        })

        toast({ title: 'Usunięto', description: 'Intencja została usunięta', variant: 'success' })

        // Refresh data
        const refreshedData = await api.getIntentions()
        setData(refreshedData)

        // Reload current month's intentions
        const monthData = refreshedData.find(d => d.year === currentYear && d.month === selectedMonth)
        if (monthData) {
          setMonthId(monthData.id)
          setIntentions(monthData.intentions?.map(i => ({
            id: i.id,
            date: i.date || '',
            time: i.time || '',
            intention: i.intention || '',
            isNew: false,
            isModified: false,
          })) || [])
        } else {
          setIntentions([])
        }
        setHasChanges(false)
      } catch (err) {
        toast({ title: 'Błąd', description: err.message, variant: 'destructive' })
      } finally {
        setDeleting(false)
      }
    } else {
      // New intention - just remove from local state
      setIntentions(prev => prev.filter((_, i) => i !== intentionToDelete))
      // Check if there are still changes
      const remaining = intentions.filter((_, i) => i !== intentionToDelete)
      const stillHasChanges = remaining.some(i => i.isNew || i.isModified)
      setHasChanges(stillHasChanges)
    }

    setIntentionToDelete(null)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = {
        year: currentYear,
        month: selectedMonth,
        intentions: intentions
          .filter(i => i.date && i.time && i.intention)
          .map(i => ({ date: i.date, time: i.time, intention: i.intention })),
      }

      if (monthId) {
        await api.updateIntention(monthId, payload)
      } else {
        await api.createIntention(payload)
      }

      toast({ title: 'Zapisano', description: 'Intencje zostały zapisane', variant: 'success' })
      setHasChanges(false)

      // Refresh data
      const refreshedData = await api.getIntentions()
      setData(refreshedData)

      // Update current month's intentions
      const monthData = refreshedData.find(d => d.year === currentYear && d.month === selectedMonth)
      if (monthData) {
        setMonthId(monthData.id)
        setIntentions(monthData.intentions?.map(i => ({
          id: i.id,
          date: i.date || '',
          time: i.time || '',
          intention: i.intention || '',
          isNew: false,
          isModified: false,
        })) || [])
      }
    } catch (err) {
      toast({ title: 'Błąd', description: err.message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const getDateConstraints = () => {
    if (!selectedMonth) return { min: '', max: '' }
    const firstDay = `${currentYear}-${String(selectedMonth).padStart(2, '0')}-01`
    const lastDay = new Date(currentYear, selectedMonth, 0).getDate()
    const lastDayStr = `${currentYear}-${String(selectedMonth).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
    return { min: firstDay, max: lastDayStr }
  }

  const formatDayName = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' })
  }

  const prevYear = () => setCurrentYear(y => y - 1)
  const nextYear = () => setCurrentYear(y => y + 1)

  const currentMonthNum = new Date().getMonth() + 1
  const currentYearNum = new Date().getFullYear()

  if (loading) return <LoadingState rows={6} type="cards" />

  // INSIDE MONTH VIEW
  if (selectedMonth !== null) {
    const monthName = MONTHS.find(m => m.value === selectedMonth)?.label

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={tryGoBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{monthName} {currentYear}</h1>
            <p className="text-sm text-muted-foreground">
              {intentions.length} intencji
              {hasChanges && <span className="text-amber-600 ml-2">(niezapisane zmiany)</span>}
            </p>
          </div>
          <Button onClick={handleSave} disabled={saving || !hasChanges}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Zapisz
          </Button>
        </div>

        {/* Intentions list */}
        {intentions.length === 0 ? (
          <div className="text-center py-12 bg-muted/50 rounded-lg">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-4">Brak intencji w tym miesiącu.</p>
            <Button variant="outline" onClick={addIntention}>
              <Plus className="w-4 h-4 mr-2" />
              Dodaj pierwszą intencję
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {intentions.map((intention, index) => (
              <Card key={intention.id || `new-${index}`} className={intention.isNew ? 'border-amber-300 bg-amber-50/50' : ''}>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-[150px_100px_1fr_auto] gap-3 items-start">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Data</label>
                      <Input
                        type="date"
                        value={intention.date}
                        onChange={(e) => handleIntentionChange(index, 'date', e.target.value)}
                        min={getDateConstraints().min}
                        max={getDateConstraints().max}
                      />
                      {intention.date && (
                        <span className="text-xs text-muted-foreground mt-1 block">
                          {formatDayName(intention.date)}
                        </span>
                      )}
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Godzina</label>
                      <Input
                        type="time"
                        value={intention.time}
                        onChange={(e) => handleIntentionChange(index, 'time', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">
                        Intencja
                        {intention.isNew && <span className="text-amber-600 ml-1">(nowa - wymaga zapisu)</span>}
                      </label>
                      <Input
                        type="text"
                        value={intention.intention}
                        onChange={(e) => handleIntentionChange(index, 'intention', e.target.value)}
                        placeholder="Treść intencji..."
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteModal(index)}
                        disabled={deleting}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button variant="outline" onClick={addIntention} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Dodaj intencję
            </Button>
          </div>
        )}

        {/* Delete confirmation modal */}
        <DeleteConfirm
          open={deleteModalOpen}
          onOpenChange={setDeleteModalOpen}
          onConfirm={confirmDeleteIntention}
          loading={deleting}
          title="Usuń intencję"
          description={intentionToDelete !== null && intentions[intentionToDelete]
            ? intentions[intentionToDelete].isNew
              ? `Czy na pewno chcesz usunąć nową intencję "${intentions[intentionToDelete].intention || 'bez treści'}"?`
              : `Czy na pewno chcesz usunąć intencję "${intentions[intentionToDelete].intention || 'bez treści'}"? Ta operacja jest nieodwracalna.`
            : 'Czy na pewno chcesz usunąć tę intencję?'}
        />

        {/* Save changes modal */}
        <Dialog open={saveModalOpen} onOpenChange={setSaveModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Niezapisane zmiany</DialogTitle>
              <DialogDescription>
                Masz niezapisane zmiany. Co chcesz zrobić?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-2 sm:gap-0">
              <Button variant="outline" onClick={handleSaveModalCancel}>
                Anuluj
              </Button>
              <Button variant="destructive" onClick={handleSaveModalDiscard}>
                Odrzuć zmiany
              </Button>
              <Button onClick={handleSaveModalSave}>
                <Save className="w-4 h-4 mr-2" />
                Zapisz
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // MONTHS LIST VIEW
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={prevYear}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold">{currentYear}</h1>
        <Button variant="outline" size="icon" onClick={nextYear}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {MONTHS.map((month) => {
          const count = getIntentionsCount(currentYear, month.value)
          const isCurrent = currentYear === currentYearNum && month.value === currentMonthNum

          return (
            <Card
              key={month.value}
              className={`cursor-pointer hover:shadow-lg transition-shadow ${
                isCurrent ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => enterMonth(month.value)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {month.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {count > 0 ? `${count} intencji` : 'Brak intencji'}
                </p>
                {isCurrent && (
                  <span className="text-xs text-primary font-medium">Bieżący miesiąc</span>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default Intentions
