import { Button } from '@/components/ui/button'
import { Plus, Inbox } from 'lucide-react'

function EmptyState({
  icon: Icon = Inbox,
  title = 'Brak danych',
  description = 'Nie znaleziono żadnych elementów.',
  actionLabel,
  onAction
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-sm">
        {description}
      </p>
      {onAction && actionLabel && (
        <Button onClick={onAction}>
          <Plus className="w-4 h-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export default EmptyState
