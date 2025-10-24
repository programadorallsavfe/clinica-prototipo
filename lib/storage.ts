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

// Importar tipos para ventas auxiliares
import { VentaAuxiliar, Producto } from './types'

export const ventasAuxiliaresStorage = new StorageManager<VentaAuxiliar>('ventas_auxiliares')
export const productosStorage = new StorageManager<Producto>('productos')

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
      especialidadesStorage.create({ id: generateId('esp'), nombre: 'Ginecología', descripcion: 'Especialidad de la mujer', precioBase: 130, activo: true });
      especialidadesStorage.create({ id: generateId('esp'), nombre: 'Medicina General', descripcion: 'Consulta general', precioBase: 80, activo: true });
      especialidadesStorage.create({ id: generateId('esp'), nombre: 'Neurología', descripcion: 'Especialidad del sistema nervioso', precioBase: 160, activo: true });
    }

    // Doctores
    if (doctoresStorage.getAll().length === 0) {
      const cardiologiaId = especialidadesStorage.find(e => e.nombre === 'Cardiología')[0]?.id;
      const pediatriaId = especialidadesStorage.find(e => e.nombre === 'Pediatría')[0]?.id;
      const dermatologiaId = especialidadesStorage.find(e => e.nombre === 'Dermatología')[0]?.id;
      const ginecologiaId = especialidadesStorage.find(e => e.nombre === 'Ginecología')[0]?.id;
      const medicinaGeneralId = especialidadesStorage.find(e => e.nombre === 'Medicina General')[0]?.id;
      const neurologiaId = especialidadesStorage.find(e => e.nombre === 'Neurología')[0]?.id;

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
      doctoresStorage.create({
        id: generateId('doc'),
        nombres: 'Carlos',
        apellidos: 'Rodriguez',
        especialidadId: dermatologiaId,
        telefono: '923456789',
        email: 'dr.rodriguez@clinic.com',
        activo: true,
      });
      doctoresStorage.create({
        id: generateId('doc'),
        nombres: 'Ana',
        apellidos: 'Martinez',
        especialidadId: ginecologiaId,
        telefono: '934567890',
        email: 'dr.martinez@clinic.com',
        activo: true,
      });
      doctoresStorage.create({
        id: generateId('doc'),
        nombres: 'Pedro',
        apellidos: 'Lopez',
        especialidadId: medicinaGeneralId,
        telefono: '945678901',
        email: 'dr.lopez@clinic.com',
        activo: true,
      });
      doctoresStorage.create({
        id: generateId('doc'),
        nombres: 'Elena',
        apellidos: 'Fernandez',
        especialidadId: neurologiaId,
        telefono: '956789012',
        email: 'dr.fernandez@clinic.com',
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

      // Crear usuarios adicionales para pacientes
      const usuariosPacientes = [
        { username: 'mgarcia', password: 'mgarcia123', email: 'mgarcia@email.com', telefono: '987654321' },
        { username: 'clopez', password: 'clopez123', email: 'clopez@email.com', telefono: '912345678' },
        { username: 'arodriguez', password: 'arodriguez123', email: 'arodriguez@email.com', telefono: '923456789' },
        { username: 'pfernandez', password: 'pfernandez123', email: 'pfernandez@email.com', telefono: '934567890' },
        { username: 'amartinez', password: 'amartinez123', email: 'amartinez@email.com', telefono: '945678901' },
        { username: 'jgonzalez', password: 'jgonzalez123', email: 'jgonzalez@email.com', telefono: '956789012' },
        { username: 'lhernandez', password: 'lhernandez123', email: 'lhernandez@email.com', telefono: '967890123' },
        { username: 'cramirez', password: 'cramirez123', email: 'cramirez@email.com', telefono: '978901234' }
      ];

      const pacientesData = [
        { nombres: 'María', apellidos: 'García', documento: '23456789', preferenciaContacto: 'whatsapp' as const },
        { nombres: 'Carlos', apellidos: 'López', documento: '34567890', preferenciaContacto: 'email' as const },
        { nombres: 'Ana', apellidos: 'Rodríguez', documento: '45678901', preferenciaContacto: 'telefono' as const },
        { nombres: 'Pedro', apellidos: 'Fernández', documento: '56789012', preferenciaContacto: 'whatsapp' as const },
        { nombres: 'Andrea', apellidos: 'Martínez', documento: '67890123', preferenciaContacto: 'email' as const },
        { nombres: 'José', apellidos: 'González', documento: '78901234', preferenciaContacto: 'whatsapp' as const },
        { nombres: 'Laura', apellidos: 'Hernández', documento: '89012345', preferenciaContacto: 'telefono' as const },
        { nombres: 'Carmen', apellidos: 'Ramírez', documento: '90123456', preferenciaContacto: 'whatsapp' as const }
      ];

      usuariosPacientes.forEach((usuario, index) => {
        const nuevoUsuario = usuariosStorage.create({
          id: generateId('user'),
          username: usuario.username,
          password: usuario.password,
          rol: 'paciente',
          email: usuario.email,
          telefono: usuario.telefono,
          activo: true,
          fechaCreacion: new Date().toISOString(),
        });

        pacientesStorage.create({
          id: generateId('pac'),
          usuarioId: nuevoUsuario.id,
          nombres: pacientesData[index].nombres,
          apellidos: pacientesData[index].apellidos,
          documento: pacientesData[index].documento,
          telefono: usuario.telefono,
          email: usuario.email,
          preferenciaContacto: pacientesData[index].preferenciaContacto,
          fechaRegistro: new Date().toISOString(),
          activo: true,
        });
      });
    }

    // Leads
    if (leadsStorage.getAll().length === 0) {
      const leadsData = [
        { nombre: 'Sofia Mendoza', telefono: '987654321', email: 'sofia.mendoza@email.com', canal: 'whatsapp' as const, motivo: 'Consulta por dolor de cabeza frecuente', estado: 'nuevo' as const },
        { nombre: 'Roberto Silva', telefono: '912345678', email: 'roberto.silva@email.com', canal: 'web' as const, motivo: 'Interesado en consulta de cardiología', estado: 'contactado' as const },
        { nombre: 'Elena Vargas', telefono: '923456789', email: 'elena.vargas@email.com', canal: 'telefono' as const, motivo: 'Consulta pediátrica para su hijo', estado: 'cotizado' as const },
        { nombre: 'Miguel Torres', telefono: '934567890', email: 'miguel.torres@email.com', canal: 'presencial' as const, motivo: 'Revisión dermatológica', estado: 'convertido' as const },
        { nombre: 'Isabel Morales', telefono: '945678901', email: 'isabel.morales@email.com', canal: 'whatsapp' as const, motivo: 'Consulta ginecológica', estado: 'nuevo' as const },
        { nombre: 'Fernando Castro', telefono: '956789012', email: 'fernando.castro@email.com', canal: 'web' as const, motivo: 'Consulta general', estado: 'contactado' as const },
        { nombre: 'Patricia Ruiz', telefono: '967890123', email: 'patricia.ruiz@email.com', canal: 'telefono' as const, motivo: 'Consulta para su madre', estado: 'nuevo' as const },
        { nombre: 'Diego Herrera', telefono: '978901234', email: 'diego.herrera@email.com', canal: 'whatsapp' as const, motivo: 'Consulta de seguimiento', estado: 'cotizado' as const }
      ];

      leadsData.forEach(lead => {
        leadsStorage.create({
          id: generateId('lead'),
          nombre: lead.nombre,
          telefono: lead.telefono,
          email: lead.email,
          canal: lead.canal,
          motivo: lead.motivo,
          estado: lead.estado,
          fechaCreacion: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(), // Últimos 7 días
          creadoPor: 'recepcion',
        });
      });
    }

    // Cotizaciones
    if (cotizacionesStorage.getAll().length === 0) {
      const especialidades = especialidadesStorage.getAll();
      const doctores = doctoresStorage.getAll();
      const leads = leadsStorage.getAll();

      const cotizacionesData = [
        { leadId: leads[0]?.id, especialidadId: especialidades[0]?.id, doctorId: doctores[0]?.id, precio: 120, estado: 'enviada' as const, fechaPropuesta: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], horaPropuesta: '10:00' },
        { leadId: leads[1]?.id, especialidadId: especialidades[1]?.id, doctorId: doctores[1]?.id, precio: 100, estado: 'aceptada' as const, fechaPropuesta: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], horaPropuesta: '14:30' },
        { leadId: leads[2]?.id, especialidadId: especialidades[0]?.id, doctorId: doctores[0]?.id, precio: 120, estado: 'rechazada' as const, fechaPropuesta: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], horaPropuesta: '16:00' },
        { leadId: leads[3]?.id, especialidadId: especialidades[2]?.id, doctorId: doctores[0]?.id, precio: 150, estado: 'expirada' as const, fechaPropuesta: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], horaPropuesta: '11:30' },
        { leadId: leads[4]?.id, especialidadId: especialidades[1]?.id, doctorId: doctores[1]?.id, precio: 100, estado: 'enviada' as const, fechaPropuesta: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], horaPropuesta: '09:00' }
      ];

      cotizacionesData.forEach(cot => {
        if (cot.leadId && cot.especialidadId && cot.doctorId) {
          const fechaCaducidad = new Date();
          fechaCaducidad.setDate(fechaCaducidad.getDate() + 7);
          
          cotizacionesStorage.create({
            id: generateId('cot'),
            leadId: cot.leadId,
            especialidadId: cot.especialidadId,
            doctorId: cot.doctorId,
            fechaPropuesta: cot.fechaPropuesta,
            horaPropuesta: cot.horaPropuesta,
            precio: cot.precio,
            estado: cot.estado,
            comentarios: 'Cotización generada automáticamente',
            fechaCaducidad: fechaCaducidad.toISOString(),
            fechaCreacion: new Date().toISOString(),
            creadoPor: 'recepcion',
            fechaEnvio: new Date().toISOString(),
          });
        }
      });
    }

    // Citas del día
    if (citasStorage.getAll().length === 0) {
      const pacientes = pacientesStorage.getAll();
      const especialidades = especialidadesStorage.getAll();
      const doctores = doctoresStorage.getAll();
      const hoy = new Date().toISOString().split('T')[0];

      const citasData = [
        { pacienteId: pacientes[0]?.id, especialidadId: especialidades[0]?.id, doctorId: doctores[0]?.id, horaInicio: '09:00', duracionMinutos: 30, precio: 120, estado: 'programada' as const, estadoPago: 'pendiente' as const },
        { pacienteId: pacientes[1]?.id, especialidadId: especialidades[1]?.id, doctorId: doctores[1]?.id, horaInicio: '09:30', duracionMinutos: 30, precio: 100, estado: 'en_curso' as const, estadoPago: 'pagado' as const },
        { pacienteId: pacientes[2]?.id, especialidadId: especialidades[0]?.id, doctorId: doctores[0]?.id, horaInicio: '10:00', duracionMinutos: 30, precio: 120, estado: 'atendida' as const, estadoPago: 'pagado' as const },
        { pacienteId: pacientes[3]?.id, especialidadId: especialidades[2]?.id, doctorId: doctores[0]?.id, horaInicio: '10:30', duracionMinutos: 30, precio: 150, estado: 'programada' as const, estadoPago: 'pendiente' as const },
        { pacienteId: pacientes[4]?.id, especialidadId: especialidades[1]?.id, doctorId: doctores[1]?.id, horaInicio: '11:00', duracionMinutos: 30, precio: 100, estado: 'programada' as const, estadoPago: 'pendiente' as const },
        { pacienteId: pacientes[5]?.id, especialidadId: especialidades[0]?.id, doctorId: doctores[0]?.id, horaInicio: '11:30', duracionMinutos: 30, precio: 120, estado: 'cancelada' as const, estadoPago: 'pendiente' as const },
        { pacienteId: pacientes[6]?.id, especialidadId: especialidades[1]?.id, doctorId: doctores[1]?.id, horaInicio: '14:00', duracionMinutos: 30, precio: 100, estado: 'programada' as const, estadoPago: 'pagado' as const },
        { pacienteId: pacientes[7]?.id, especialidadId: especialidades[2]?.id, doctorId: doctores[0]?.id, horaInicio: '14:30', duracionMinutos: 30, precio: 150, estado: 'programada' as const, estadoPago: 'pendiente' as const }
      ];

      citasData.forEach(cita => {
        if (cita.pacienteId && cita.especialidadId && cita.doctorId) {
          const [h, m] = cita.horaInicio.split(':').map(Number);
          const fechaFin = new Date();
          fechaFin.setHours(h, m + cita.duracionMinutos);
          const horaFin = fechaFin.toTimeString().slice(0, 5);

          citasStorage.create({
            id: generateId('cita'),
            pacienteId: cita.pacienteId,
            doctorId: cita.doctorId,
            especialidadId: cita.especialidadId,
            fecha: hoy,
            horaInicio: cita.horaInicio,
            horaFin: horaFin,
            duracionMinutos: cita.duracionMinutos,
            estado: cita.estado,
            precio: cita.precio,
            estadoPago: cita.estadoPago,
            motivo: 'Consulta médica general',
            fechaCreacion: new Date().toISOString(),
            creadoPor: 'recepcion',
            ...(cita.estado === 'en_curso' && { horaInicioReal: new Date().toISOString() }),
            ...(cita.estado === 'atendida' && { 
              horaInicioReal: new Date().toISOString(),
              horaFinReal: new Date().toISOString(),
              duracionReal: cita.duracionMinutos
            })
          });
        }
      });
    }

    // Productos para ventas auxiliares
    if (productosStorage.getAll().length === 0) {
      const productosData = [
        { nombre: 'Paracetamol 500mg', descripcion: 'Analgésico y antipirético', tipo: 'medicamento' as const, precioVenta: 2.50, precioCompra: 1.80, stock: 100, stockMinimo: 20 },
        { nombre: 'Ibuprofeno 400mg', descripcion: 'Antiinflamatorio no esteroideo', tipo: 'medicamento' as const, precioVenta: 3.20, precioCompra: 2.40, stock: 80, stockMinimo: 15 },
        { nombre: 'Amoxicilina 500mg', descripcion: 'Antibiótico de amplio espectro', tipo: 'medicamento' as const, precioVenta: 8.50, precioCompra: 6.20, stock: 50, stockMinimo: 10 },
        { nombre: 'Hemograma Completo', descripcion: 'Análisis de sangre completo', tipo: 'examen' as const, precioVenta: 25.00, precioCompra: 15.00, stock: 999, stockMinimo: 0 },
        { nombre: 'Glicemia en Ayunas', descripcion: 'Medición de glucosa en sangre', tipo: 'examen' as const, precioVenta: 12.00, precioCompra: 8.00, stock: 999, stockMinimo: 0 },
        { nombre: 'Perfil Lipídico', descripcion: 'Análisis de colesterol y triglicéridos', tipo: 'examen' as const, precioVenta: 35.00, precioCompra: 22.00, stock: 999, stockMinimo: 0 },
        { nombre: 'Jeringa 5ml', descripcion: 'Jeringa estéril de 5 mililitros', tipo: 'insumo' as const, precioVenta: 1.50, precioCompra: 0.80, stock: 200, stockMinimo: 50 },
        { nombre: 'Algodón Estéril', descripcion: 'Algodón estéril para curaciones', tipo: 'insumo' as const, precioVenta: 3.00, precioCompra: 2.00, stock: 150, stockMinimo: 30 },
        { nombre: 'Gasas Estériles', descripcion: 'Gasas estériles 10x10cm', tipo: 'insumo' as const, precioVenta: 2.80, precioCompra: 1.90, stock: 100, stockMinimo: 25 },
        { nombre: 'Aspirina 100mg', descripcion: 'Antiagregante plaquetario', tipo: 'medicamento' as const, precioVenta: 1.80, precioCompra: 1.20, stock: 120, stockMinimo: 20 }
      ];

      productosData.forEach(producto => {
        productosStorage.create({
          id: generateId('prod'),
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          tipo: producto.tipo,
          precioVenta: producto.precioVenta,
          precioCompra: producto.precioCompra,
          stock: producto.stock,
          stockMinimo: producto.stockMinimo,
          activo: true,
          fechaCreacion: new Date().toISOString(),
          creadoPor: 'admin'
        });
      });
    }

    localStorage.setItem('defaultDataInitialized', 'true');
  }
}

// Función para forzar la reinicialización de datos de mock
export function forceInitializeMockData() {
  // Limpiar datos existentes
  localStorage.removeItem('defaultDataInitialized');
  localStorage.removeItem('leads');
  localStorage.removeItem('cotizaciones');
  localStorage.removeItem('citas');
  localStorage.removeItem('pacientes');
  localStorage.removeItem('usuarios');
  localStorage.removeItem('doctores');
  localStorage.removeItem('especialidades');
  
  // Reinicializar
  initializeDefaultData();
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