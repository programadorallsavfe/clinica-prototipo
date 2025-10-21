export interface Lead {
  id: string
  nombre: string
  telefono: string
  email?: string
  canal: 'whatsapp' | 'web' | 'telefono' | 'presencial'
  motivo: string
  estado: 'nuevo' | 'contactado' | 'cotizado' | 'convertido'
  fechaCreacion: string
  creadoPor: string
}

export interface Cotizacion {
  id: string
  leadId?: string
  pacienteId?: string
  especialidadId: string
  doctorId: string
  fechaPropuesta: string
  horaPropuesta: string
  precio: number
  estado: 'enviada' | 'aceptada' | 'rechazada' | 'expirada'
  comentarios?: string
  fechaCaducidad: string
  fechaCreacion: string
  creadoPor: string
  fechaEnvio: string
}

export interface Cita {
  id: string
  pacienteId: string
  doctorId: string
  especialidadId: string
  fecha: string
  horaInicio: string
  horaFin: string
  horaInicioReal?: string
  horaFinReal?: string
  duracionMinutos: number
  duracionReal?: number
  estado: 'programada' | 'en_curso' | 'atendida' | 'cancelada'
  precio: number
  estadoPago: 'pendiente' | 'pagado' | 'parcial'
  motivo?: string
  fechaCreacion: string
  creadoPor: string
}

export interface Paciente {
  id: string
  usuarioId: string
  nombres: string
  apellidos: string
  documento: string
  telefono: string
  email: string
  preferenciaContacto: 'whatsapp' | 'email' | 'telefono'
  fechaRegistro: string
  activo: boolean
}

export interface Usuario {
  id: string
  username: string
  password: string
  rol: 'paciente' | 'recepcionista' | 'medico' | 'farmacia' | 'administrador'
  email: string
  telefono: string
  activo: boolean
  fechaCreacion: string
}

export interface Doctor {
  id: string
  usuarioId?: string
  nombres: string
  apellidos: string
  especialidadId: string
  email: string
  telefono: string
  activo: boolean
}

export interface Especialidad {
  id: string
  nombre: string
  precioBase: number
  descripcion?: string
  activo: boolean
}

export interface Consultorio {
  id: string
  nombre: string
  ubicacion: string
  activo: boolean
}

export interface RegistroClinico {
  id: string
  pacienteId: string
  doctorId: string
  citaId: string
  diagnostico: string
  tratamiento: string
  observaciones?: string
  fechaCreacion: string
}

export interface Pago {
  id: string
  pacienteId: string
  citaId: string
  monto: number
  metodo: 'efectivo' | 'tarjeta' | 'transferencia' | 'yape'
  estado: 'pendiente' | 'pagado' | 'cancelado'
  fechaCreacion: string
}

export interface Orden {
  id: string
  pacienteId: string
  tipo: 'medicamento' | 'examen' | 'procedimiento'
  descripcion: string
  cantidad: number
  precio: number
  estado: 'pendiente' | 'procesada' | 'entregada'
  fechaCreacion: string
  items?: { nombre: string; cantidad: number; precio: number }[]
  total?: number
}

class StorageManager<T> {
  private key: string

  constructor(key: string) {
    this.key = key
  }

  private getData(): T[] {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(this.key)
    return data ? JSON.parse(data) : []
  }

  private setData(data: T[]): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.key, JSON.stringify(data))
  }

  getAll(): T[] {
    return this.getData()
  }

  getById(id: string): T | undefined {
    const data = this.getData()
    return data.find((item: T) => (item as { id: string }).id === id)
  }

  find(predicate: (item: T) => boolean): T[] {
    const data = this.getData()
    return data.filter(predicate)
  }

  findOne(predicate: (item: T) => boolean): T | undefined {
    const data = this.getData()
    return data.find(predicate)
  }

  create(item: T): T {
    const data = this.getData()
    data.push(item)
    this.setData(data)
    return item
  }

  update(id: string, updates: Partial<T>): T | undefined {
    const data = this.getData()
    const index = data.findIndex((item: T) => (item as { id: string }).id === id)
    if (index !== -1) {
      data[index] = { ...data[index], ...updates }
      this.setData(data)
      return data[index]
    }
    return undefined
  }

  delete(id: string): boolean {
    const data = this.getData()
    const filtered = data.filter((item: T) => (item as { id: string }).id !== id)
    this.setData(filtered)
    return filtered.length !== data.length
  }
}

export const leadsStorage = new StorageManager<Lead>('leads')
export const cotizacionesStorage = new StorageManager<Cotizacion>('cotizaciones')
export const citasStorage = new StorageManager<Cita>('citas')
export const pacientesStorage = new StorageManager<Paciente>('pacientes')
export const usuariosStorage = new StorageManager<Usuario>('usuarios')
export const doctoresStorage = new StorageManager<Doctor>('doctores')
export const especialidadesStorage = new StorageManager<Especialidad>('especialidades')
export const consultoriosStorage = new StorageManager<Consultorio>('consultorios')
export const registrosClinicosStorage = new StorageManager<RegistroClinico>('registrosClinicos')
export const pagosStorage = new StorageManager<Pago>('pagos')
export const ordenesStorage = new StorageManager<Orden>('ordenes')

export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function getCurrentTimestamp(): string {
  return new Date().toISOString()
}

export function logAuditoria(
  usuarioId: string,
  username: string,
  accion: string,
  entidad: string,
  entidadId: string,
  datosAnteriores?: Record<string, unknown>,
  datosNuevos?: Record<string, unknown>
): void {
  const log = {
    id: generateId('audit'),
    usuarioId,
    username,
    accion,
    entidad,
    entidadId,
    datosAnteriores,
    datosNuevos,
    timestamp: getCurrentTimestamp(),
  }

  const logs = JSON.parse(localStorage.getItem('auditoria') || '[]')
  logs.push(log)
  localStorage.setItem('auditoria', JSON.stringify(logs))
}

export function initializeDefaultData() {
  if (localStorage.getItem('defaultDataInitialized') !== 'true') {
    // Usuarios
    if (usuariosStorage.getAll().length === 0) {
      usuariosStorage.create({ id: generateId('user'), username: 'admin', password: 'admin123', rol: 'administrador', email: 'admin@clinic.com', telefono: '999999999', fechaCreacion: new Date().toISOString(), activo: true });
      usuariosStorage.create({ id: generateId('user'), username: 'recepcion', password: 'recep123', rol: 'recepcionista', email: 'recepcion@clinic.com', telefono: '888888888', fechaCreacion: new Date().toISOString(), activo: true });
      usuariosStorage.create({ id: generateId('user'), username: 'dr.sanchez', password: 'doctor123', rol: 'medico', email: 'dr.sanchez@clinic.com', telefono: '777777777', fechaCreacion: new Date().toISOString(), activo: true });
      usuariosStorage.create({ id: generateId('user'), username: 'jperez', password: 'paciente123', rol: 'paciente', email: 'jperez@clinic.com', telefono: '666666666', fechaCreacion: new Date().toISOString(), activo: true });
      usuariosStorage.create({ id: generateId('user'), username: 'farmacia', password: 'farma123', rol: 'farmacia', email: 'farmacia@clinic.com', telefono: '555555555', fechaCreacion: new Date().toISOString(), activo: true });
    }

    // Especialidades
    if (especialidadesStorage.getAll().length === 0) {
      especialidadesStorage.create({ id: generateId('esp'), nombre: 'Cardiología', descripcion: 'Especialidad del corazón', precioBase: 120, activo: true });
      especialidadesStorage.create({ id: generateId('esp'), nombre: 'Pediatría', descripcion: 'Especialidad de niños', precioBase: 100, activo: true });
      especialidadesStorage.create({ id: generateId('esp'), nombre: 'Dermatología', descripcion: 'Especialidad de la piel', precioBase: 150, activo: true });
    }

    // Doctores
    if (doctoresStorage.getAll().length === 0) {
      const cardiologiaId = especialidadesStorage.find(e => e.nombre === 'Cardiología')[0]?.id;
      const pediatriaId = especialidadesStorage.find(e => e.nombre === 'Pediatría')[0]?.id;

      doctoresStorage.create({
        id: generateId('doc'),
        nombres: 'Juan',
        apellidos: 'Sanchez',
        especialidadId: cardiologiaId,
        telefono: '987654321',
        email: 'dr.sanchez@clinic.com',
      activo: true,
      });
      doctoresStorage.create({
    id: generateId('doc'),
        nombres: 'Maria',
        apellidos: 'Gomez',
        especialidadId: pediatriaId,
        telefono: '912345678',
        email: 'dr.gomez@clinic.com',
    activo: true,
      });
    }

    // Pacientes
    if (pacientesStorage.getAll().length === 0) {
      const jperezUser = usuariosStorage.findOne(u => u.username === 'jperez');
      if (jperezUser) {
        pacientesStorage.create({
    id: generateId('pac'),
          usuarioId: jperezUser.id,
    nombres: 'Juan',
          apellidos: 'Perez',
          documento: '12345678',
          telefono: '999888777',
          email: 'jperez@clinic.com',
    preferenciaContacto: 'whatsapp',
          fechaRegistro: new Date().toISOString(),
    activo: true,
        });
      }
    }

    localStorage.setItem('defaultDataInitialized', 'true');
  }
}