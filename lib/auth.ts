export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  const session = localStorage.getItem('clinica_session')
  return session !== null
}

export function getSession(): { username: string; rol: string; userId: string } | null {
  if (typeof window === 'undefined') return null
  const session = localStorage.getItem('clinica_session')
  return session ? JSON.parse(session) : null
}

export function generarUsername(nombres: string, apellidos: string): string {
  const nombre = nombres.toLowerCase().split(' ')[0]
  const apellido = apellidos.toLowerCase().split(' ')[0]
  const numero = Math.floor(Math.random() * 1000)
  return `${nombre}.${apellido}${numero}`
}

export function generarPasswordTemporal(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let password = ''
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

export function getRutaPorRol(rol: string): string {
  switch (rol) {
    case 'paciente':
      return '/paciente'
    case 'recepcionista':
      return '/recepcionista'
    case 'medico':
      return '/medico'
    case 'farmacia':
      return '/farmacia'
    case 'administrador':
      return '/admin'
    default:
      return '/auth'
  }
}