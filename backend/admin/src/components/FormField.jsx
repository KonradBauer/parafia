import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  options, // for select
  rows = 4, // for textarea
  className = '',
  ...props
}) {
  const id = `field-${name}`

  const handleChange = (e) => {
    if (type === 'checkbox') {
      onChange({ target: { name, value: e } })
    } else if (type === 'select') {
      onChange({ target: { name, value: e } })
    } else {
      onChange(e)
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && type !== 'checkbox' && (
        <Label htmlFor={id}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      {type === 'textarea' ? (
        <Textarea
          id={id}
          name={name}
          value={value || ''}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={error ? 'border-destructive' : ''}
          {...props}
        />
      ) : type === 'select' ? (
        <Select
          value={value || ''}
          onValueChange={handleChange}
          disabled={disabled}
        >
          <SelectTrigger className={error ? 'border-destructive' : ''}>
            <SelectValue placeholder={placeholder || 'Wybierz...'} />
          </SelectTrigger>
          <SelectContent>
            {options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : type === 'checkbox' ? (
        <div className="flex items-center space-x-2">
          <Checkbox
            id={id}
            checked={!!value}
            onCheckedChange={handleChange}
            disabled={disabled}
          />
          <Label htmlFor={id} className="font-normal cursor-pointer">
            {label}
          </Label>
        </div>
      ) : (
        <Input
          id={id}
          type={type}
          name={name}
          value={value || ''}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className={error ? 'border-destructive' : ''}
          {...props}
        />
      )}

      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  )
}

export default FormField
