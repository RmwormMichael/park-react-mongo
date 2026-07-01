export const ROLES = {
  ADMIN: 'Administrador',
  VIGILANTE: 'Vigilante',
  INSTRUCTOR: 'Instructor',
  APRENDIZ: 'Aprendiz',
  VISITANTE: 'Visitante',
}

export function hasRole(user, ...roles) {
  if (!user?.idRolName) return false
  return roles.includes(user.idRolName)
}

export const isAdmin = (user) => hasRole(user, ROLES.ADMIN)

export const isAdminOrVigilante = (user) => hasRole(user, ROLES.ADMIN, ROLES.VIGILANTE)

export const isBasicRole = (user) => hasRole(user, ROLES.APRENDIZ, ROLES.INSTRUCTOR, ROLES.VISITANTE)
