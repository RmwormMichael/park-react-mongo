import { Loader2 } from 'lucide-react'

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
}

export default function LoadingSpinner({
  message,
  size = 'lg',
  padding = true,
  containerClassName = '',
}) {
  return (
    <div className={`${padding ? 'py-12' : ''} text-center ${containerClassName}`}>
      <Loader2
        className={`${sizeMap[size] || sizeMap.lg} text-emerald-500 animate-spin mx-auto`}
      />
      {message && (
        <p className="mt-2 text-gray-600">{message}</p>
      )}
    </div>
  )
}
