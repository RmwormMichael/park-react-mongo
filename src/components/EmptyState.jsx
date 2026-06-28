import { AlertCircle } from 'lucide-react'

const sizeMap = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
}

export default function EmptyState({
  message,
  icon: Icon = AlertCircle,
  suggestion,
  size = 'lg',
  padding = true,
  containerClassName = '',
}) {
  return (
    <div className={`${padding ? 'py-12' : ''} text-center ${containerClassName}`}>
      <Icon className={`${sizeMap[size] || sizeMap.lg} text-gray-400 mx-auto mb-4`} />
      <p className="text-gray-600">{message}</p>
      {suggestion && (
        <p className="text-sm text-gray-500 mt-1">{suggestion}</p>
      )}
    </div>
  )
}
