import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

function PageHeader({ title, description, onAdd, addLabel = 'Dodaj' }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        {title && <h2 className="text-lg font-semibold">{title}</h2>}
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {onAdd && (
        <Button onClick={onAdd}>
          <Plus className="w-4 h-4 mr-2" />
          {addLabel}
        </Button>
      )}
    </div>
  )
}

export default PageHeader
