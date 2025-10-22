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

// Tipos para gestión de atenciones médicas
export interface ControlEmbarazo {
  fase: number // 1, 2, 3, 4, 5, etc.
  semanas?: number
  trimestre?: 1 | 2 | 3
  fechaUltimaRegla?: string
  fechaProbableParto?: string
  proximoControl?: string
  observaciones?: string
}

export interface OrdenMedica {
  id: number
  autor: string
  fecha: string
  atencion: string
  contenido: string[]
}

export interface Prescripcion {
  id: number
  autor: string
  fecha: string
  atencion: string
  contenido: string[]
}

export interface AtencionMedica {
  id: string
  numero: string
  pacienteId: string
  tipo: string
  tipoCategoria?: 'consulta' | 'control' | 'procedimiento' | 'emergencia'
  fecha: string
  hora: string
  profesional: string
  profesionalId?: string
  estado: 'programada' | 'en_curso' | 'atendida' | 'cancelada' | 'no_asiste'
  recurso: string
  sucursal: string
  convenio: string
  progreso: number
  totalAtenciones: number
  atencionActual: number
  // Control de embarazo (opcional)
  controlEmbarazo?: ControlEmbarazo
  // Etiquetas personalizables
  etiquetas?: string[]
  // Información clínica
  evolucionClinica?: string
  ordenesMedicas?: OrdenMedica[]
  prescripciones?: Prescripcion[]
  // Metadatos
  fechaCreacion: string
  creadoPor?: string
}