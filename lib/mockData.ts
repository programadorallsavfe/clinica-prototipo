// Mock data centralizado para toda la aplicación
export interface Paciente {
  id: number;
  nombre: string;
  apellidos: string;
  documento: string;
  telefono: string;
  email: string;
  atenciones: number;
  deuda: string;
  estadoCuenta: 'activa' | 'inactiva' | 'bloqueada';
  verificado: boolean;
  tieneCuenta: boolean;
  ultimaCita: string;
  proximaCita: string | null;
  especialidad: string;
  doctor: string;
  consultorio: string;
  saldo: number;
  ultimoPago: string;
  cotizacionesAbiertas: number;
  cotizacionesAceptadas: number;
  ultimaCompra: string;
  tiempoPromedioCita: string;
  origen: string;
  actualizadoPor: string;
  fechaActualizacion: string;
  // Campos adicionales del formulario
  extranjero?: boolean;
  convenio?: string;
  numeroInterno?: string;
  sexo?: 'masculino' | 'femenino' | 'otro';
  fechaNacimiento?: string;
  ciudad?: string;
  distrito?: string;
  direccion?: string;
  actividadProfesion?: string;
  empleador?: string;
  observaciones?: string;
  apoderado?: string;
  referencia?: string;
  servicios?: string[];
  rutApoderado?: string;
}

export interface Cita {
  id: string;
  pacienteId: number; // Referencia al paciente
  hora: string;
  fecha: string;
  atencion: {
    doctor: string;
    tipo: 'Consulta' | 'Examen';
    especialidad: string;
  };
  estado: 'programada' | 'confirmada_whatsapp' | 'confirmada_telefono' | 'confirmada_email' | 'en_sala_espera' | 'atendiendose' | 'atendida' | 'no_asiste' | 'anulada';
  situacion: 'pagada' | 'no_pagada' | 'parcial';
  fechaLlegada?: string;
  observaciones?: string;
  monto?: number;
  formaPago?: string;
}

// Datos centralizados de pacientes
export const pacientesData: Paciente[] = [
  {
    id: 7725,
    nombre: 'BERTHA',
    apellidos: 'EUGENIO ESPINOZA',
    documento: '73248573',
    telefono: '+51 987 654 321',
    email: 'maria.gonzalez@email.com',
    atenciones: 12,
    deuda: 'No tiene',
    estadoCuenta: 'activa',
    verificado: true,
    tieneCuenta: true,
    ultimaCita: '2024-01-15',
    proximaCita: '2024-01-22',
    especialidad: 'Cardiología',
    doctor: 'Dr. Carlos Mendoza',
    consultorio: 'A-101',
    saldo: 50,
    ultimoPago: '2024-01-10',
    cotizacionesAbiertas: 0,
    cotizacionesAceptadas: 2,
    ultimaCompra: '2024-01-12',
    tiempoPromedioCita: '42 min',
    origen: 'WhatsApp',
    actualizadoPor: 'Recepcionista Ana',
    fechaActualizacion: '2024-01-15',
    // Campos adicionales
    extranjero: false,
    convenio: 'rimac',
    numeroInterno: 'P-001',
    sexo: 'femenino',
    fechaNacimiento: '1990-03-15',
    ciudad: 'Lima',
    distrito: 'Miraflores',
    direccion: 'Av. Larco 1234',
    actividadProfesion: 'Ingeniera',
    empleador: 'Empresa ABC',
    observaciones: 'Paciente frecuente',
    servicios: ['cardiologia', 'ginecologia']
  },
  {
    id: 7726,
    nombre: 'JUAN CARLOS',
    apellidos: 'RODRÍGUEZ MARTÍNEZ',
    documento: '87654321',
    telefono: '+51 912 345 678',
    email: 'juan.rodriguez@email.com',
    atenciones: 8,
    deuda: 'No tiene',
    estadoCuenta: 'activa',
    verificado: false,
    tieneCuenta: false,
    ultimaCita: '2024-01-14',
    proximaCita: '2024-01-25',
    especialidad: 'Dermatología',
    doctor: 'Dra. Laura Silva',
    consultorio: 'A-102',
    saldo: 150,
    ultimoPago: '2024-01-14',
    cotizacionesAbiertas: 1,
    cotizacionesAceptadas: 0,
    ultimaCompra: '2024-01-14',
    tiempoPromedioCita: '38 min',
    origen: 'Web',
    actualizadoPor: 'Dr. Carlos Mendoza',
    fechaActualizacion: '2024-01-14',
    // Campos adicionales
    extranjero: false,
    convenio: 'pacifico',
    numeroInterno: 'P-002',
    sexo: 'masculino',
    fechaNacimiento: '1985-07-22',
    ciudad: 'Lima',
    distrito: 'San Isidro',
    direccion: 'Av. Javier Prado 5678',
    actividadProfesion: 'Abogado',
    empleador: 'Estudio Jurídico XYZ',
    servicios: ['dermatologia']
  },
  {
    id: 7727,
    nombre: 'ANA PATRICIA',
    apellidos: 'MORALES VEGA',
    documento: '11223344',
    telefono: '+51 945 123 456',
    email: 'ana.morales@email.com',
    atenciones: 1,
    deuda: 'No tiene',
    estadoCuenta: 'activa',
    verificado: true,
    tieneCuenta: true,
    ultimaCita: '2024-01-16',
    proximaCita: '2024-01-28',
    especialidad: 'Ginecología',
    doctor: 'Dra. Carmen Vega',
    consultorio: 'B-201',
    saldo: 320,
    ultimoPago: '2024-01-16',
    cotizacionesAbiertas: 0,
    cotizacionesAceptadas: 3,
    ultimaCompra: '2024-01-16',
    tiempoPromedioCita: '55 min',
    origen: 'Referido',
    actualizadoPor: 'Recepcionista Ana',
    fechaActualizacion: '2024-01-16',
    // Campos adicionales
    extranjero: false,
    convenio: 'sin-convenio',
    numeroInterno: 'P-003',
    sexo: 'femenino',
    fechaNacimiento: '1988-11-10',
    ciudad: 'Lima',
    distrito: 'La Molina',
    direccion: 'Calle Las Flores 987',
    actividadProfesion: 'Médica',
    empleador: 'Clínica San Juan',
    observaciones: 'Colega médico',
    servicios: ['ginecologia', 'obstetricia']
  },
  {
    id: 7728,
    nombre: 'ROBERTO',
    apellidos: 'SILVA TORRES',
    documento: '55667788',
    telefono: '+51 998 765 432',
    email: 'roberto.silva@email.com',
    atenciones: 5,
    deuda: 'S/ 180',
    estadoCuenta: 'inactiva',
    verificado: false,
    tieneCuenta: false,
    ultimaCita: '2023-12-20',
    proximaCita: null,
    especialidad: 'Neurología',
    doctor: 'Dr. Miguel Herrera',
    consultorio: 'B-202',
    saldo: 0,
    ultimoPago: '2023-12-20',
    cotizacionesAbiertas: 2,
    cotizacionesAceptadas: 1,
    ultimaCompra: '2023-12-20',
    tiempoPromedioCita: '60 min',
    origen: 'Web',
    actualizadoPor: 'Dr. Miguel Herrera',
    fechaActualizacion: '2023-12-20',
    // Campos adicionales
    extranjero: false,
    convenio: 'backus',
    numeroInterno: 'P-004',
    sexo: 'masculino',
    fechaNacimiento: '1975-05-08',
    ciudad: 'Lima',
    distrito: 'Surco',
    direccion: 'Av. Primavera 2468',
    actividadProfesion: 'Empresario',
    empleador: 'Grupo Empresarial Silva',
    observaciones: 'Deuda pendiente',
    servicios: ['neurologia']
  }
];

// Datos centralizados de citas
export const citasData: Cita[] = [
  {
    id: '1',
    pacienteId: 7725, // BERTHA EUGENIO ESPINOZA
    hora: '08:00',
    fecha: '2024-01-22',
    atencion: {
      doctor: 'Dr. CASTILLO ROBLES, JOSE',
      tipo: 'Consulta',
      especialidad: 'Cardiología'
    },
    estado: 'atendida',
    situacion: 'pagada',
    monto: 150,
    formaPago: 'Efectivo'
  },
  {
    id: '2',
    pacienteId: 7726, // JUAN CARLOS RODRÍGUEZ MARTÍNEZ
    hora: '08:00',
    fecha: '2024-01-22',
    atencion: {
      doctor: 'Dr(a). SEGUIMIENTO. TOPICO',
      tipo: 'Examen',
      especialidad: 'Dermatología'
    },
    estado: 'confirmada_telefono',
    situacion: 'no_pagada',
    monto: 80
  },
  {
    id: '3',
    pacienteId: 7727, // ANA PATRICIA MORALES VEGA
    hora: '08:05',
    fecha: '2024-01-22',
    atencion: {
      doctor: 'Dr(a). SEGUIMIENTO. TOPICO',
      tipo: 'Examen',
      especialidad: 'Ginecología'
    },
    estado: 'confirmada_telefono',
    situacion: 'no_pagada',
    monto: 120
  },
  {
    id: '4',
    pacienteId: 7725, // BERTHA EUGENIO ESPINOZA (segunda cita)
    hora: '08:10',
    fecha: '2024-01-22',
    atencion: {
      doctor: 'Dr(a). SEGUIMIENTO. TOPICO',
      tipo: 'Examen',
      especialidad: 'Ginecología'
    },
    estado: 'confirmada_telefono',
    situacion: 'no_pagada',
    monto: 90
  },
  {
    id: '5',
    pacienteId: 7726, // JUAN CARLOS RODRÍGUEZ MARTÍNEZ (segunda cita)
    hora: '08:15',
    fecha: '2024-01-22',
    atencion: {
      doctor: 'Dr(a). SEGUIMIENTO. TOPICO',
      tipo: 'Examen',
      especialidad: 'Dermatología'
    },
    estado: 'atendida',
    situacion: 'pagada',
    monto: 80,
    formaPago: 'Tarjeta'
  },
  {
    id: '6',
    pacienteId: 7727, // ANA PATRICIA MORALES VEGA (segunda cita)
    hora: '08:20',
    fecha: '2024-01-22',
    atencion: {
      doctor: 'Dr(a). SEGUIMIENTO. TOPICO',
      tipo: 'Examen',
      especialidad: 'Ginecología'
    },
    estado: 'atendida',
    situacion: 'pagada',
    monto: 120,
    formaPago: 'Yape'
  },
  {
    id: '7',
    pacienteId: 7725, // BERTHA EUGENIO ESPINOZA (tercera cita)
    hora: '10:30',
    fecha: '2024-01-22',
    atencion: {
      doctor: 'Dr(a). MEJIA GASTELO. JACKELINE',
      tipo: 'Consulta',
      especialidad: 'Ginecología'
    },
    estado: 'en_sala_espera',
    situacion: 'pagada',
    fechaLlegada: '10:25',
    monto: 150,
    formaPago: 'Efectivo'
  },
  {
    id: '8',
    pacienteId: 7726, // JUAN CARLOS RODRÍGUEZ MARTÍNEZ (tercera cita)
    hora: '11:00',
    fecha: '2024-01-22',
    atencion: {
      doctor: 'Dr(a). MEJIA GASTELO. JACKELINE',
      tipo: 'Consulta',
      especialidad: 'Dermatología'
    },
    estado: 'en_sala_espera',
    situacion: 'pagada',
    fechaLlegada: '10:58',
    monto: 180,
    formaPago: 'Transferencia'
  }
];

// Funciones utilitarias para obtener datos relacionados
export const getPacienteById = (id: number): Paciente | undefined => {
  return pacientesData.find(paciente => paciente.id === id);
};

export const getCitasByPacienteId = (pacienteId: number): Cita[] => {
  return citasData.filter(cita => cita.pacienteId === pacienteId);
};

export const getCitasByFecha = (fecha: string): Cita[] => {
  return citasData.filter(cita => cita.fecha === fecha);
};

export const getCitasWithPacienteInfo = (fecha?: string): (Cita & { paciente: Paciente })[] => {
  const citas = fecha ? getCitasByFecha(fecha) : citasData;
  
  return citas.map(cita => {
    const paciente = getPacienteById(cita.pacienteId);
    if (!paciente) {
      throw new Error(`Paciente con ID ${cita.pacienteId} no encontrado`);
    }
    return {
      ...cita,
      paciente: {
        nombre: paciente.nombre,
        telefono: paciente.telefono,
        email: paciente.email,
        documento: paciente.documento
      } as Paciente
    };
  });
};

// KPIs calculados
export const getKPIs = () => {
  const totalPacientes = pacientesData.length;
  const pacientesActivos = pacientesData.filter(p => p.estadoCuenta === 'activa').length;
  const pacientesVerificados = pacientesData.filter(p => p.verificado).length;
  const totalCitas = citasData.length;
  const citasAtendidas = citasData.filter(c => c.estado === 'atendida').length;
  const ingresosMes = citasData
    .filter(c => c.situacion === 'pagada')
    .reduce((sum, cita) => sum + (cita.monto || 0), 0);

  return {
    totalPacientes,
    pacientesActivos,
    pacientesVerificados,
    totalCitas,
    citasAtendidas,
    ingresosMes,
    nuevosHoy: 12,
    conCitaProxima: 45,
    pagosPendientes: 8,
    tiempoPromedioCita: '45 min',
    conTratamientoActivo: 89,
    satisfaccionPromedio: 4.8
  };
};

// Estadísticas de agenda
export const getEstadisticasAgenda = (fecha?: string) => {
  const citas = fecha ? getCitasByFecha(fecha) : citasData;
  
  return {
    totalCitas: citas.length,
    citasAtendidas: citas.filter(c => c.estado === 'atendida').length,
    enEspera: citas.filter(c => c.estado === 'en_sala_espera').length,
    confirmadas: citas.filter(c => c.estado === 'atendida' || c.estado === 'confirmada_whatsapp').length,
    pendientes: citas.filter(c => c.estado === 'confirmada_telefono' || c.estado === 'confirmada_email').length,
    anulaciones: citas.filter(c => c.estado === 'anulada' || c.estado === 'no_asiste').length
  };
};

// Interfaces para Alertas Médicas y Signos Vitales
export interface AlertaMedica {
  id: string;
  pacienteId: number;
  descripcion: string;
  fechaCreacion: string;
  fechaVencimiento?: string;
  activa: boolean;
  prioridad: 'alta' | 'media' | 'baja';
  tipo: 'alergia' | 'medicamento' | 'condicion' | 'restriccion' | 'observacion';
  creadoPor: string;
}

export interface SignoVital {
  id: string;
  pacienteId: number;
  fechaMedicion: string;
  presionArterialSistolica?: number;
  presionArterialDiastolica?: number;
  peso?: number;
  frecuenciaCardiaca?: number;
  altura?: number;
  frecuenciaRespiratoria?: number;
  temperatura?: number;
  saturacionOxigeno?: number;
  evaDolor?: number;
  glucemia?: number;
  observaciones?: string;
  medidoPor: string;
}

// Mock data para Alertas Médicas
export const alertasMedicasData: AlertaMedica[] = [
  {
    id: 'alert_001',
    pacienteId: 1,
    descripcion: 'Alergia a la penicilina - Reacción cutánea severa',
    fechaCreacion: '2024-01-15',
    fechaVencimiento: '2025-01-15',
    activa: true,
    prioridad: 'alta',
    tipo: 'alergia',
    creadoPor: 'Dr. María González'
  },
  {
    id: 'alert_002',
    pacienteId: 1,
    descripcion: 'Diabetes tipo 2 - Controlar glucosa antes de procedimientos',
    fechaCreacion: '2024-01-10',
    activa: true,
    prioridad: 'media',
    tipo: 'condicion',
    creadoPor: 'Dr. Carlos Mendoza'
  },
  {
    id: 'alert_003',
    pacienteId: 2,
    descripcion: 'Hipertensión arterial - Monitorear presión en cada consulta',
    fechaCreacion: '2024-01-12',
    activa: true,
    prioridad: 'media',
    tipo: 'condicion',
    creadoPor: 'Dra. Ana Torres'
  },
  {
    id: 'alert_004',
    pacienteId: 3,
    descripcion: 'Alergia al látex - Usar guantes sin látex',
    fechaCreacion: '2024-01-08',
    activa: true,
    prioridad: 'alta',
    tipo: 'alergia',
    creadoPor: 'Dr. Luis Fernández'
  },
  {
    id: 'alert_005',
    pacienteId: 4,
    descripcion: 'Paciente embarazada - Evitar radiaciones',
    fechaCreacion: '2024-01-20',
    fechaVencimiento: '2024-10-15',
    activa: true,
    prioridad: 'alta',
    tipo: 'condicion',
    creadoPor: 'Dra. Carmen Vásquez'
  },
  {
    id: 'alert_006',
    pacienteId: 7725,
    descripcion: 'Alergia a medicamentos antiinflamatorios - Reacción gastrointestinal severa',
    fechaCreacion: '2024-01-18',
    fechaVencimiento: '2025-01-18',
    activa: true,
    prioridad: 'alta',
    tipo: 'alergia',
    creadoPor: 'Dr. Roberto Silva'
  },
  {
    id: 'alert_007',
    pacienteId: 7725,
    descripcion: 'Hipertensión arterial controlada - Monitorear presión en cada consulta',
    fechaCreacion: '2024-01-15',
    activa: true,
    prioridad: 'media',
    tipo: 'condicion',
    creadoPor: 'Dra. Patricia Morales'
  },
  {
    id: 'alert_008',
    pacienteId: 7725,
    descripcion: 'Paciente diabética - Controlar glucosa antes de procedimientos',
    fechaCreacion: '2024-01-12',
    activa: true,
    prioridad: 'media',
    tipo: 'condicion',
    creadoPor: 'Dr. Miguel Torres'
  }
];

// Mock data para Signos Vitales
export const signosVitalesData: SignoVital[] = [
  {
    id: 'vital_001',
    pacienteId: 1,
    fechaMedicion: '2024-01-22T09:30:00',
    presionArterialSistolica: 130,
    presionArterialDiastolica: 85,
    peso: 75.5,
    frecuenciaCardiaca: 78,
    altura: 165,
    frecuenciaRespiratoria: 16,
    temperatura: 36.8,
    saturacionOxigeno: 98,
    evaDolor: 2,
    glucemia: 95,
    observaciones: 'Paciente en buenas condiciones generales',
    medidoPor: 'Enf. Rosa Jiménez'
  },
  {
    id: 'vital_002',
    pacienteId: 1,
    fechaMedicion: '2024-01-20T14:15:00',
    presionArterialSistolica: 128,
    presionArterialDiastolica: 82,
    peso: 75.2,
    frecuenciaCardiaca: 76,
    altura: 165,
    frecuenciaRespiratoria: 15,
    temperatura: 36.6,
    saturacionOxigeno: 99,
    evaDolor: 1,
    glucemia: 92,
    observaciones: 'Control rutinario - valores normales',
    medidoPor: 'Enf. Carlos Ruiz'
  },
  {
    id: 'vital_003',
    pacienteId: 2,
    fechaMedicion: '2024-01-22T10:45:00',
    presionArterialSistolica: 145,
    presionArterialDiastolica: 92,
    peso: 82.3,
    frecuenciaCardiaca: 85,
    altura: 170,
    frecuenciaRespiratoria: 18,
    temperatura: 37.1,
    saturacionOxigeno: 96,
    evaDolor: 4,
    glucemia: 110,
    observaciones: 'Presión arterial elevada - requiere seguimiento',
    medidoPor: 'Enf. María López'
  },
  {
    id: 'vital_004',
    pacienteId: 3,
    fechaMedicion: '2024-01-21T16:20:00',
    presionArterialSistolica: 118,
    presionArterialDiastolica: 75,
    peso: 68.7,
    frecuenciaCardiaca: 72,
    altura: 160,
    frecuenciaRespiratoria: 14,
    temperatura: 36.4,
    saturacionOxigeno: 98,
    evaDolor: 0,
    glucemia: 88,
    observaciones: 'Signos vitales dentro de parámetros normales',
    medidoPor: 'Enf. Patricia Silva'
  },
  {
    id: 'vital_005',
    pacienteId: 4,
    fechaMedicion: '2024-01-22T08:30:00',
    presionArterialSistolica: 125,
    presionArterialDiastolica: 78,
    peso: 71.2,
    frecuenciaCardiaca: 80,
    altura: 162,
    frecuenciaRespiratoria: 17,
    temperatura: 36.9,
    saturacionOxigeno: 97,
    evaDolor: 1,
    glucemia: 98,
    observaciones: 'Embarazo de 28 semanas - signos vitales estables',
    medidoPor: 'Enf. Laura García'
  },
  {
    id: 'vital_006',
    pacienteId: 7725,
    fechaMedicion: '2024-01-22T10:15:00',
    presionArterialSistolica: 142,
    presionArterialDiastolica: 88,
    peso: 68.5,
    frecuenciaCardiaca: 82,
    altura: 158,
    frecuenciaRespiratoria: 16,
    temperatura: 36.7,
    saturacionOxigeno: 96,
    evaDolor: 3,
    glucemia: 125,
    observaciones: 'Presión arterial ligeramente elevada - paciente diabética e hipertensa',
    medidoPor: 'Enf. Ana Rodríguez'
  },
  {
    id: 'vital_007',
    pacienteId: 7725,
    fechaMedicion: '2024-01-20T14:30:00',
    presionArterialSistolica: 138,
    presionArterialDiastolica: 85,
    peso: 68.2,
    frecuenciaCardiaca: 78,
    altura: 158,
    frecuenciaRespiratoria: 15,
    temperatura: 36.5,
    saturacionOxigeno: 98,
    evaDolor: 2,
    glucemia: 118,
    observaciones: 'Control rutinario - valores dentro de parámetros aceptables',
    medidoPor: 'Enf. Carlos Mendoza'
  },
  {
    id: 'vital_008',
    pacienteId: 7725,
    fechaMedicion: '2024-01-18T09:45:00',
    presionArterialSistolica: 145,
    presionArterialDiastolica: 90,
    peso: 68.8,
    frecuenciaCardiaca: 85,
    altura: 158,
    frecuenciaRespiratoria: 17,
    temperatura: 36.8,
    saturacionOxigeno: 95,
    evaDolor: 4,
    glucemia: 135,
    observaciones: 'Presión arterial elevada - requiere ajuste de medicación',
    medidoPor: 'Enf. María González'
  }
];

// Funciones utilitarias para Alertas Médicas
export const getAlertasByPacienteId = (pacienteId: number): AlertaMedica[] => {
  return alertasMedicasData.filter(alerta => alerta.pacienteId === pacienteId && alerta.activa);
};

export const getAlertasActivas = (): AlertaMedica[] => {
  return alertasMedicasData.filter(alerta => alerta.activa);
};

// Funciones utilitarias para Signos Vitales
export const getSignosVitalesByPacienteId = (pacienteId: number): SignoVital[] => {
  return signosVitalesData.filter(signo => signo.pacienteId === pacienteId);
};

export const getUltimosSignosVitales = (pacienteId: number): SignoVital | null => {
  const signos = getSignosVitalesByPacienteId(pacienteId);
  if (signos.length === 0) return null;
  
  // Ordenar por fecha más reciente
  return signos.sort((a, b) => new Date(b.fechaMedicion).getTime() - new Date(a.fechaMedicion).getTime())[0];
};
