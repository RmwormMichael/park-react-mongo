import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { hasRole } from '../utils/permissions'

export default function PrivateRoute({ children, roles }) {
  const { isAuth, user, loading } = useAuth()

  if (loading) return null

  if (!isAuth) return <Navigate to="/login" replace />

  if (roles && !hasRole(user, ...roles)) return <Navigate to="/dashboard" replace />

  return children
}
