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

// ============================================
// GESTIÓN DE ATENCIONES MÉDICAS
// ============================================

import { AtencionMedica } from './types';

export const atencionesStorage = new StorageManager<AtencionMedica>('atenciones_medicas');

// Obtener atenciones de un paciente específico
export const getAtencionesByPaciente = (pacienteId: string | number): AtencionMedica[] => {
  const pid = typeof pacienteId === 'number' ? pacienteId.toString() : pacienteId;
  return atencionesStorage.getAll().filter((a: AtencionMedica) => a.pacienteId === pid);
};

// Función auxiliar para parsear fecha en formato "DD MMM YYYY"
const parsearFechaEspanol = (fechaStr: string): Date | null => {
  try {
    const meses: { [key: string]: number } = {
      'ENE': 0, 'FEB': 1, 'MAR': 2, 'ABR': 3, 'MAY': 4, 'JUN': 5,
      'JUL': 6, 'AGO': 7, 'SEP': 8, 'OCT': 9, 'NOV': 10, 'DIC': 11
    };
    const partes = fechaStr.trim().split(' ');
    if (partes.length === 3) {
      const dia = parseInt(partes[0]);
      const mes = meses[partes[1].toUpperCase()];
      const anio = parseInt(partes[2]);
      if (!isNaN(dia) && mes !== undefined && !isNaN(anio)) {
        return new Date(anio, mes, dia);
      }
    }
  } catch (e) {
    console.error('Error parseando fecha:', fechaStr, e);
  }
  return null;
};

// Obtener atenciones de hoy para un paciente
export const getAtencionesHoy = (pacienteId: string | number): AtencionMedica[] => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  return getAtencionesByPaciente(pacienteId).filter(a => {
    const fechaAtencion = parsearFechaEspanol(a.fecha);
    if (!fechaAtencion) return false;
    fechaAtencion.setHours(0, 0, 0, 0);
    return fechaAtencion.getTime() === hoy.getTime();
  });
};

// Obtener atenciones recientes (últimos 30 días)
export const getAtencionesRecientes = (pacienteId: string | number, dias: number = 30): AtencionMedica[] => {
  const fechaLimite = new Date();
  fechaLimite.setDate(fechaLimite.getDate() - dias);
  fechaLimite.setHours(0, 0, 0, 0);
  
  return getAtencionesByPaciente(pacienteId).filter(a => {
    const fechaAtencion = parsearFechaEspanol(a.fecha);
    if (!fechaAtencion) return false;
    return fechaAtencion >= fechaLimite;
  }).sort((a, b) => {
    const fechaA = parsearFechaEspanol(a.fecha);
    const fechaB = parsearFechaEspanol(b.fecha);
    if (!fechaA || !fechaB) return 0;
    return fechaB.getTime() - fechaA.getTime();
  });
};

// Inicializar datos de ejemplo para atenciones médicas
export const initializeAtencionesData = () => {
  if (atencionesStorage.getAll().length === 0) {
    // Atenciones para paciente ID 1 (ejemplo)
    const atencionesEjemplo: Omit<AtencionMedica, 'id'>[] = [
      {
        numero: '15798',
        pacienteId: '1',
        tipo: 'Examen ECOGRAFIA OBSTETRICA',
        tipoCategoria: 'control',
        fecha: '22 OCT 2025',
        hora: '09:30 hrs',
        profesional: 'DR. JOSE CARLOS CASTILLO',
        estado: 'atendida',
        recurso: 'Sin asignar',
        sucursal: 'FEMINIS SALUD',
        convenio: 'Sin convenio',
        progreso: 100,
        totalAtenciones: 5,
        atencionActual: 2,
        controlEmbarazo: {
          fase: 2,
          semanas: 14,
          trimestre: 2,
          fechaUltimaRegla: '15 JUL 2025',
          fechaProbableParto: '22 ABR 2026',
          proximoControl: '15 NOV 2025',
          observaciones: 'Control prenatal trimestre 2 - Ecografía morfológica'
        },
        etiquetas: ['Control prenatal', 'Trimestre 2', 'Ecografía'],
        evolucionClinica: 'Paciente gestante de 14 semanas. Ecografía morfológica dentro de parámetros normales. Frecuencia cardíaca fetal: 145 lpm. Movimientos fetales presentes. Líquido amniótico normal.',
        ordenesMedicas: [
          {
            id: 1,
            autor: 'Dr. Castillo',
            fecha: '18/10/2025 - 09:45',
            atencion: '#15798',
            contenido: [
              'GLUCOSA EN SANGRE',
              'HEMOGLOBINA Y HEMATOCRITO',
              'GRUPO SANGUÍNEO Y FACTOR RH'
            ]
          }
        ],
        prescripciones: [
          {
            id: 1,
            autor: 'Dr. Castillo',
            fecha: '18/10/2025 - 09:50',
            atencion: '#15798',
            contenido: [
              'ÁCIDO FÓLICO 5mg - 1 tableta diaria',
              'SULFATO FERROSO 300mg - 1 cápsula diaria',
              'CALCIO 600mg - 1 tableta cada 12 horas'
            ]
          }
        ],
        fechaCreacion: new Date().toISOString(),
        creadoPor: 'admin'
      },
      {
        numero: '15794',
        pacienteId: '1',
        tipo: 'Consulta Ginecológica',
        tipoCategoria: 'consulta',
        fecha: '22 OCT 2025',
        hora: '08:00 hrs',
        profesional: 'DR. JOSE CARLOS CASTILLO',
        estado: 'atendida',
        recurso: 'Sin asignar',
        sucursal: 'FEMINIS SALUD',
        convenio: 'Sin convenio',
        progreso: 100,
        totalAtenciones: 1,
        atencionActual: 1,
        etiquetas: ['Primera consulta', 'Confirmación embarazo'],
        evolucionClinica: 'Paciente refiere amenorrea de 8 semanas. Test de embarazo positivo. Se confirma embarazo por ecografía transvaginal. Embrión único viable de 8.2 semanas por LCN. Frecuencia cardíaca: 165 lpm.',
        ordenesMedicas: [
          {
            id: 1,
            autor: 'Dr. Castillo',
            fecha: '18/10/2025 - 08:38',
            atencion: '#15794',
            contenido: [
              'PERFIL TIROIDEO (TSH, T3, T4)',
              'EXAMEN DE ORINA COMPLETO',
              'UROCULTIVO'
            ]
          }
        ],
        prescripciones: [
          {
            id: 1,
            autor: 'Dr. Castillo',
            fecha: '18/10/2025 - 08:40',
            atencion: '#15794',
            contenido: [
              'ÁCIDO FÓLICO 5mg - 1 tableta diaria en ayunas',
              'Evitar automedicación',
              'Reposo relativo',
              'Control en 4 semanas'
            ]
          }
        ],
        fechaCreacion: new Date().toISOString(),
        creadoPor: 'admin'
      },
      {
        numero: '15820',
        pacienteId: '1',
        tipo: 'Control Prenatal - Fase 3',
        tipoCategoria: 'control',
        fecha: '15 NOV 2025',
        hora: '10:00 hrs',
        profesional: 'DR. JOSE CARLOS CASTILLO',
        estado: 'programada',
        recurso: 'Consultorio 2',
        sucursal: 'FEMINIS SALUD',
        convenio: 'Sin convenio',
        progreso: 0,
        totalAtenciones: 5,
        atencionActual: 3,
        controlEmbarazo: {
          fase: 3,
          semanas: 18,
          trimestre: 2,
          proximoControl: '13 DIC 2025',
          observaciones: 'Control prenatal rutinario - Revisión de resultados de laboratorio'
        },
        etiquetas: ['Control prenatal', 'Trimestre 2', 'Fase 3'],
        fechaCreacion: new Date().toISOString(),
        creadoPor: 'admin'
      },
      {
        numero: '15750',
        pacienteId: '1',
        tipo: 'Control Prenatal - Fase 1',
        tipoCategoria: 'control',
        fecha: '10 OCT 2025',
        hora: '11:00 hrs',
        profesional: 'DR. JOSE CARLOS CASTILLO',
        estado: 'atendida',
        recurso: 'Consultorio 1',
        sucursal: 'FEMINIS SALUD',
        convenio: 'Sin convenio',
        progreso: 100,
        totalAtenciones: 5,
        atencionActual: 1,
        controlEmbarazo: {
          fase: 1,
          semanas: 10,
          trimestre: 1,
          fechaUltimaRegla: '15 JUL 2025',
          fechaProbableParto: '22 ABR 2026',
          proximoControl: '22 OCT 2025',
          observaciones: 'Primer control prenatal - Confirmación de embarazo'
        },
        etiquetas: ['Control prenatal', 'Trimestre 1', 'Primera visita'],
        evolucionClinica: 'Primera consulta prenatal. Paciente refiere amenorrea de 10 semanas. Confirma embarazo único viable por ecografía. Se solicitan estudios de laboratorio de rutina.',
        fechaCreacion: new Date().toISOString(),
        creadoPor: 'admin'
      },
      {
        numero: '15725',
        pacienteId: '1',
        tipo: 'Consulta por Síntomas',
        tipoCategoria: 'consulta',
        fecha: '25 SEP 2025',
        hora: '14:30 hrs',
        profesional: 'DR. JOSE CARLOS CASTILLO',
        estado: 'atendida',
        recurso: 'Consultorio 1',
        sucursal: 'FEMINIS SALUD',
        convenio: 'Sin convenio',
        progreso: 100,
        totalAtenciones: 1,
        atencionActual: 1,
        etiquetas: ['Consulta general', 'Síntomas'],
        evolucionClinica: 'Paciente acude por náuseas matutinas y dolor abdominal leve. Se recomienda reposo y seguimiento.',
        prescripciones: [
          {
            id: 1,
            autor: 'Dr. Castillo',
            fecha: '25/09/2025 - 14:45',
            atencion: '#15725',
            contenido: [
              'DIMENHIDRINATO 50mg - 1 tableta cada 8 horas si náuseas',
              'Dieta blanda',
              'Hidratación abundante'
            ]
          }
        ],
        fechaCreacion: new Date().toISOString(),
        creadoPor: 'admin'
      }
    ];

    atencionesEjemplo.forEach(atencion => {
      atencionesStorage.create(atencion as AtencionMedica);
    });
  }
};