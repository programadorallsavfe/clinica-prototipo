'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable, Columna } from '@/components/data-table';
import { getSession } from '@/lib/auth';
import { 
  generateId, getCurrentTimestamp, logAuditoria
} from '@/lib/storage';
import { 
  Heart, Activity, Thermometer, Weight, Ruler, 
  AlertTriangle, CheckCircle, XCircle, Eye, Edit, 
  Plus, Search, Filter, User, Calendar, Clock,
  Stethoscope, Shield, Zap, TrendingUp, TrendingDown,
  FileText, UserCheck, Phone, MapPin, CalendarDays, Pill
} from 'lucide-react';

// Interfaces para Triaje
interface Triaje {
  id: string;
  pacienteId: string;
  citaId: string;
  fecha: string;
  hora: string;
  presionSistolica: number;
  presionDiastolica: number;
  presionArterialMedia: number;
  frecuenciaCardiaca: number;
  frecuenciaRespiratoria: number;
  temperatura: number;
  saturacion: number;
  peso: number;
  talla: number;
  imc: number;
  alertas: string[];
  antecedentesImportantes: string[];
  observaciones: string;
  completado: boolean;
  fechaRegistro: string;
  registradoPor: string;
}

interface Paciente {
  id: string;
  nombres: string;
  apellidos: string;
  dni: string;
  fechaNacimiento: string;
  edad: number;
  telefono: string;
  email: string;
  direccion: string;
  antecedentesMedicos: string[];
  alergias: string[];
  medicamentos: string[];
}

interface Cita {
  id: string;
  pacienteId: string;
  doctorId: string;
  especialidad: string;
  fecha: string;
  hora: string;
  estado: 'programada' | 'en_curso' | 'atendida' | 'cancelada';
  motivo: string;
  triajeCompletado: boolean;
}

export default function TriajePage() {
  const [triajes, setTriajes] = useState<Triaje[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [sessionUser, setSessionUser] = useState<{ userId: string; username: string } | null>(null);
  
  // Estados de formularios
  const [showNuevoTriaje, setShowNuevoTriaje] = useState(false);
  const [showEditarTriaje, setShowEditarTriaje] = useState(false);
  const [triajeSeleccionado, setTriajeSeleccionado] = useState<Triaje | null>(null);
  const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | null>(null);
  
  // Estados de filtros
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [filtroFecha, setFiltroFecha] = useState('');

  useEffect(() => {
    const session = getSession();
    setSessionUser(session);
    cargarDatos();
    inicializarDatosMock();
  }, []);

  const inicializarDatosMock = () => {
    // Verificar si ya hay datos para no duplicar
    const triajesExistentes = getTriajesFromStorage();
    if (triajesExistentes.length === 0) {
      const triajesMock: Triaje[] = [
        {
          id: generateId('triaje'),
          pacienteId: 'pac-001',
          citaId: 'cita-001',
          fecha: new Date().toISOString().split('T')[0],
          hora: '09:00',
          presionSistolica: 120,
          presionDiastolica: 80,
          presionArterialMedia: 93,
          frecuenciaCardiaca: 72,
          frecuenciaRespiratoria: 16,
          temperatura: 36.5,
          saturacion: 98,
          peso: 70,
          talla: 1.70,
          imc: 24.2,
          alertas: [],
          antecedentesImportantes: ['Hipertensión controlada'],
          observaciones: 'Paciente en buenas condiciones generales, sin signos de alarma',
          completado: true,
          fechaRegistro: getCurrentTimestamp(),
          registradoPor: sessionUser?.userId || 'system',
        },
        {
          id: generateId('triaje'),
          pacienteId: 'pac-002',
          citaId: 'cita-002',
          fecha: new Date().toISOString().split('T')[0],
          hora: '10:30',
          presionSistolica: 140,
          presionDiastolica: 95,
          presionArterialMedia: 110,
          frecuenciaCardiaca: 85,
          frecuenciaRespiratoria: 20,
          temperatura: 37.2,
          saturacion: 95,
          peso: 85,
          talla: 1.65,
          imc: 31.2,
          alertas: ['Presión arterial elevada', 'IMC en rango de obesidad', 'Temperatura ligeramente elevada'],
          antecedentesImportantes: ['Diabetes tipo 2', 'Obesidad'],
          observaciones: 'Paciente con signos vitales alterados, requiere evaluación médica inmediata',
          completado: true,
          fechaRegistro: getCurrentTimestamp(),
          registradoPor: sessionUser?.userId || 'system',
        },
        {
          id: generateId('triaje'),
          pacienteId: 'pac-003',
          citaId: 'cita-003',
          fecha: new Date().toISOString().split('T')[0],
          hora: '11:15',
          presionSistolica: 0,
          presionDiastolica: 0,
          presionArterialMedia: 0,
          frecuenciaCardiaca: 0,
          frecuenciaRespiratoria: 0,
          temperatura: 0,
          saturacion: 0,
          peso: 0,
          talla: 0,
          imc: 0,
          alertas: [],
          antecedentesImportantes: [],
          observaciones: '',
          completado: false,
          fechaRegistro: getCurrentTimestamp(),
          registradoPor: sessionUser?.userId || 'system',
        },
        {
          id: generateId('triaje'),
          pacienteId: 'pac-004',
          citaId: 'cita-004',
          fecha: new Date().toISOString().split('T')[0],
          hora: '14:00',
          presionSistolica: 95,
          presionDiastolica: 60,
          presionArterialMedia: 72,
          frecuenciaCardiaca: 55,
          frecuenciaRespiratoria: 14,
          temperatura: 36.2,
          saturacion: 99,
          peso: 55,
          talla: 1.60,
          imc: 21.5,
          alertas: ['Presión arterial baja', 'Frecuencia cardíaca baja'],
          antecedentesImportantes: ['Hipotensión', 'Anemia'],
          observaciones: 'Paciente con presión arterial baja, monitorear durante la consulta',
          completado: true,
          fechaRegistro: getCurrentTimestamp(),
          registradoPor: sessionUser?.userId || 'system',
        },
        {
          id: generateId('triaje'),
          pacienteId: 'pac-005',
          citaId: 'cita-005',
          fecha: new Date().toISOString().split('T')[0],
          hora: '15:30',
          presionSistolica: 160,
          presionDiastolica: 100,
          presionArterialMedia: 120,
          frecuenciaCardiaca: 95,
          frecuenciaRespiratoria: 22,
          temperatura: 37.8,
          saturacion: 92,
          peso: 95,
          talla: 1.75,
          imc: 31.0,
          alertas: ['Presión arterial muy elevada', 'Temperatura elevada', 'Saturación baja', 'IMC en rango de obesidad'],
          antecedentesImportantes: ['Hipertensión severa', 'Obesidad mórbida', 'Apnea del sueño'],
          observaciones: 'Paciente con crisis hipertensiva, requiere atención médica urgente',
          completado: true,
          fechaRegistro: getCurrentTimestamp(),
          registradoPor: sessionUser?.userId || 'system',
        },
        {
          id: generateId('triaje'),
          pacienteId: 'pac-006',
          citaId: 'cita-006',
          fecha: new Date().toISOString().split('T')[0],
          hora: '16:45',
          presionSistolica: 110,
          presionDiastolica: 70,
          presionArterialMedia: 83,
          frecuenciaCardiaca: 78,
          frecuenciaRespiratoria: 18,
          temperatura: 36.8,
          saturacion: 97,
          peso: 65,
          talla: 1.68,
          imc: 23.0,
          alertas: [],
          antecedentesImportantes: ['Asma controlada'],
          observaciones: 'Paciente estable, signos vitales dentro de parámetros normales',
          completado: true,
          fechaRegistro: getCurrentTimestamp(),
          registradoPor: sessionUser?.userId || 'system',
        },
        {
          id: generateId('triaje'),
          pacienteId: 'pac-007',
          citaId: 'cita-007',
          fecha: new Date().toISOString().split('T')[0],
          hora: '17:20',
          presionSistolica: 0,
          presionDiastolica: 0,
          presionArterialMedia: 0,
          frecuenciaCardiaca: 0,
          frecuenciaRespiratoria: 0,
          temperatura: 0,
          saturacion: 0,
          peso: 0,
          talla: 0,
          imc: 0,
          alertas: [],
          antecedentesImportantes: [],
          observaciones: '',
          completado: false,
          fechaRegistro: getCurrentTimestamp(),
          registradoPor: sessionUser?.userId || 'system',
        }
      ];

      // Guardar triajes mock
      triajesMock.forEach(triaje => {
        saveTriajeToStorage(triaje);
      });
    }
  };

  const getTriajesFromStorage = (): Triaje[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem('clinica_triajes');
    return data ? JSON.parse(data) : [];
  };

  const saveTriajeToStorage = (triaje: Triaje) => {
    if (typeof window === 'undefined') return;
    const triajes = getTriajesFromStorage();
    triajes.push(triaje);
    localStorage.setItem('clinica_triajes', JSON.stringify(triajes));
  };

  const updateTriajeInStorage = (id: string, updates: Partial<Triaje>) => {
    if (typeof window === 'undefined') return;
    const triajes = getTriajesFromStorage();
    const index = triajes.findIndex(t => t.id === id);
    if (index !== -1) {
      triajes[index] = { ...triajes[index], ...updates };
      localStorage.setItem('clinica_triajes', JSON.stringify(triajes));
    }
  };

  const cargarDatos = () => {
    setTriajes(getTriajesFromStorage());
    // Cargar pacientes y citas mock
    setPacientes([
      {
        id: 'pac-001',
        nombres: 'María',
        apellidos: 'González Pérez',
        dni: '12345678',
        fechaNacimiento: '1985-03-15',
        edad: 39,
        telefono: '987654321',
        email: 'maria.gonzalez@email.com',
        direccion: 'Av. Principal 123, Lima',
        antecedentesMedicos: ['Hipertensión'],
        alergias: ['Penicilina'],
        medicamentos: ['Losartán 50mg']
      },
      {
        id: 'pac-002',
        nombres: 'Carlos',
        apellidos: 'Rodríguez Silva',
        dni: '87654321',
        fechaNacimiento: '1978-07-22',
        edad: 46,
        telefono: '912345678',
        email: 'carlos.rodriguez@email.com',
        direccion: 'Jr. Los Olivos 456, Lima',
        antecedentesMedicos: ['Diabetes tipo 2', 'Obesidad'],
        alergias: ['Sulfamidas'],
        medicamentos: ['Metformina 850mg', 'Glimepirida 2mg']
      },
      {
        id: 'pac-003',
        nombres: 'Ana',
        apellidos: 'Martínez López',
        dni: '11223344',
        fechaNacimiento: '1992-11-08',
        edad: 32,
        telefono: '923456789',
        email: 'ana.martinez@email.com',
        direccion: 'Av. Arequipa 789, Lima',
        antecedentesMedicos: [],
        alergias: [],
        medicamentos: []
      },
      {
        id: 'pac-004',
        nombres: 'Luis',
        apellidos: 'Fernández Torres',
        dni: '55667788',
        fechaNacimiento: '1990-05-12',
        edad: 34,
        telefono: '934567890',
        email: 'luis.fernandez@email.com',
        direccion: 'Calle Real 234, Surco, Lima',
        antecedentesMedicos: ['Hipotensión', 'Anemia'],
        alergias: ['Ibuprofeno'],
        medicamentos: ['Hierro 100mg', 'Ácido fólico 5mg']
      },
      {
        id: 'pac-005',
        nombres: 'Roberto',
        apellidos: 'Vargas Silva',
        dni: '99887766',
        fechaNacimiento: '1975-12-03',
        edad: 49,
        telefono: '945678901',
        email: 'roberto.vargas@email.com',
        direccion: 'Jr. San Martín 456, Callao, Lima',
        antecedentesMedicos: ['Hipertensión severa', 'Obesidad mórbida', 'Apnea del sueño'],
        alergias: ['Aspirina'],
        medicamentos: ['Amlodipino 10mg', 'Metformina 1000mg', 'CPAP']
      },
      {
        id: 'pac-006',
        nombres: 'Sofia',
        apellidos: 'Herrera Morales',
        dni: '44332211',
        fechaNacimiento: '1988-08-18',
        edad: 36,
        telefono: '956789012',
        email: 'sofia.herrera@email.com',
        direccion: 'Av. Universitaria 789, San Miguel, Lima',
        antecedentesMedicos: ['Asma controlada'],
        alergias: ['Polen'],
        medicamentos: ['Salbutamol inhalador']
      },
      {
        id: 'pac-007',
        nombres: 'Miguel',
        apellidos: 'Castro Ruiz',
        dni: '11223399',
        fechaNacimiento: '1995-01-25',
        edad: 29,
        telefono: '967890123',
        email: 'miguel.castro@email.com',
        direccion: 'Av. Javier Prado 567, San Isidro, Lima',
        antecedentesMedicos: [],
        alergias: [],
        medicamentos: []
      }
    ]);
    setCitas([
      {
        id: 'cita-001',
        pacienteId: 'pac-001',
        doctorId: 'doc-001',
        especialidad: 'Medicina General',
        fecha: new Date().toISOString().split('T')[0],
        hora: '09:00',
        estado: 'en_curso',
        motivo: 'Control de hipertensión',
        triajeCompletado: true
      },
      {
        id: 'cita-002',
        pacienteId: 'pac-002',
        doctorId: 'doc-001',
        especialidad: 'Medicina General',
        fecha: new Date().toISOString().split('T')[0],
        hora: '10:30',
        estado: 'en_curso',
        motivo: 'Control de diabetes',
        triajeCompletado: true
      },
      {
        id: 'cita-003',
        pacienteId: 'pac-003',
        doctorId: 'doc-001',
        especialidad: 'Medicina General',
        fecha: new Date().toISOString().split('T')[0],
        hora: '11:15',
        estado: 'programada',
        motivo: 'Consulta general',
        triajeCompletado: false
      },
      {
        id: 'cita-004',
        pacienteId: 'pac-004',
        doctorId: 'doc-002',
        especialidad: 'Cardiología',
        fecha: new Date().toISOString().split('T')[0],
        hora: '14:00',
        estado: 'en_curso',
        motivo: 'Evaluación de hipotensión',
        triajeCompletado: true
      },
      {
        id: 'cita-005',
        pacienteId: 'pac-005',
        doctorId: 'doc-003',
        especialidad: 'Medicina Interna',
        fecha: new Date().toISOString().split('T')[0],
        hora: '15:30',
        estado: 'en_curso',
        motivo: 'Crisis hipertensiva',
        triajeCompletado: true
      },
      {
        id: 'cita-006',
        pacienteId: 'pac-006',
        doctorId: 'doc-004',
        especialidad: 'Neumología',
        fecha: new Date().toISOString().split('T')[0],
        hora: '16:45',
        estado: 'en_curso',
        motivo: 'Control de asma',
        triajeCompletado: true
      },
      {
        id: 'cita-007',
        pacienteId: 'pac-007',
        doctorId: 'doc-001',
        especialidad: 'Medicina General',
        fecha: new Date().toISOString().split('T')[0],
        hora: '17:20',
        estado: 'programada',
        motivo: 'Consulta preventiva',
        triajeCompletado: false
      }
    ]);
  };

  const calcularPresionArterialMedia = (sistolica: number, diastolica: number): number => {
    return Math.round((2 * diastolica + sistolica) / 3);
  };

  const calcularIMC = (peso: number, talla: number): number => {
    return Math.round((peso / (talla * talla)) * 10) / 10;
  };

  const validarSignosVitales = (triaje: Partial<Triaje>): string[] => {
    const alertas: string[] = [];
    
    // Presión arterial
    if (triaje.presionSistolica && (triaje.presionSistolica < 90 || triaje.presionSistolica > 140)) {
      alertas.push('Presión sistólica fuera de rango normal (90-140 mmHg)');
    }
    if (triaje.presionDiastolica && (triaje.presionDiastolica < 60 || triaje.presionDiastolica > 90)) {
      alertas.push('Presión diastólica fuera de rango normal (60-90 mmHg)');
    }
    
    // Frecuencia cardíaca
    if (triaje.frecuenciaCardiaca && (triaje.frecuenciaCardiaca < 60 || triaje.frecuenciaCardiaca > 100)) {
      alertas.push('Frecuencia cardíaca fuera de rango normal (60-100 lpm)');
    }
    
    // Frecuencia respiratoria
    if (triaje.frecuenciaRespiratoria && (triaje.frecuenciaRespiratoria < 12 || triaje.frecuenciaRespiratoria > 20)) {
      alertas.push('Frecuencia respiratoria fuera de rango normal (12-20 rpm)');
    }
    
    // Temperatura
    if (triaje.temperatura && (triaje.temperatura < 36.1 || triaje.temperatura > 37.2)) {
      alertas.push('Temperatura fuera de rango normal (36.1-37.2°C)');
    }
    
    // Saturación
    if (triaje.saturacion && triaje.saturacion < 95) {
      alertas.push('Saturación de oxígeno baja (<95%)');
    }
    
    // IMC
    if (triaje.imc) {
      if (triaje.imc < 18.5) {
        alertas.push('IMC bajo peso (<18.5)');
      } else if (triaje.imc > 30) {
        alertas.push('IMC en rango de obesidad (>30)');
      }
    }
    
    return alertas;
  };

  const crearNuevoTriaje = (formData: FormData) => {
    const presionSistolica = parseFloat(formData.get('presionSistolica') as string);
    const presionDiastolica = parseFloat(formData.get('presionDiastolica') as string);
    const peso = parseFloat(formData.get('peso') as string);
    const talla = parseFloat(formData.get('talla') as string);
    
    const presionArterialMedia = calcularPresionArterialMedia(presionSistolica, presionDiastolica);
    const imc = calcularIMC(peso, talla);
    
    const nuevoTriaje: Triaje = {
      id: generateId('triaje'),
      pacienteId: formData.get('pacienteId') as string,
      citaId: formData.get('citaId') as string,
      fecha: formData.get('fecha') as string,
      hora: formData.get('hora') as string,
      presionSistolica,
      presionDiastolica,
      presionArterialMedia,
      frecuenciaCardiaca: parseFloat(formData.get('frecuenciaCardiaca') as string),
      frecuenciaRespiratoria: parseFloat(formData.get('frecuenciaRespiratoria') as string),
      temperatura: parseFloat(formData.get('temperatura') as string),
      saturacion: parseFloat(formData.get('saturacion') as string),
      peso,
      talla,
      imc,
      alertas: [],
      antecedentesImportantes: (formData.get('antecedentesImportantes') as string).split(',').filter(a => a.trim()),
      observaciones: formData.get('observaciones') as string,
      completado: true,
      fechaRegistro: getCurrentTimestamp(),
      registradoPor: sessionUser?.userId || '',
    };

    // Validar signos vitales y generar alertas
    nuevoTriaje.alertas = validarSignosVitales(nuevoTriaje);

    saveTriajeToStorage(nuevoTriaje);
    if (sessionUser) {
      logAuditoria(
        sessionUser.userId, 
        sessionUser.username, 
        'Crear triaje', 
        'Triaje', 
        nuevoTriaje.id, 
        undefined, 
        nuevoTriaje as unknown as Record<string, unknown>
      );
    }
    
    setShowNuevoTriaje(false);
    cargarDatos();
  };

  const getPacienteNombre = (pacienteId: string) => {
    const paciente = pacientes.find(p => p.id === pacienteId);
    return paciente ? `${paciente.nombres} ${paciente.apellidos}` : 'Paciente no encontrado';
  };

  const getCitaInfo = (citaId: string) => {
    const cita = citas.find(c => c.id === citaId);
    return cita ? `${cita.especialidad} - ${cita.motivo}` : 'Cita no encontrada';
  };

  // Filtrar triajes
  const triajesFiltrados = triajes.filter(triaje => {
    const cumpleBusqueda = filtroBusqueda === '' || 
      getPacienteNombre(triaje.pacienteId).toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
      getCitaInfo(triaje.citaId).toLowerCase().includes(filtroBusqueda.toLowerCase());
    
    const cumpleEstado = filtroEstado === 'todos' || 
      (filtroEstado === 'completado' && triaje.completado) ||
      (filtroEstado === 'pendiente' && !triaje.completado);
    
    const cumpleFecha = filtroFecha === '' || triaje.fecha === filtroFecha;
    
    return cumpleBusqueda && cumpleEstado && cumpleFecha;
  });

  // Estadísticas
  const estadisticas = {
    total: triajes.length,
    completados: triajes.filter(t => t.completado).length,
    pendientes: triajes.filter(t => !t.completado).length,
    conAlertas: triajes.filter(t => t.alertas.length > 0).length,
  };

  const getEstadoBadge = (completado: boolean) => {
    if (completado) {
      return <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Completado</Badge>;
    } else {
      return <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Pendiente</Badge>;
    }
  };

  const columnas: Columna<Triaje>[] = [
    {
      key: 'pacienteId',
      titulo: 'Paciente',
      sortable: true,
      render: (triaje: Triaje) => {
        const paciente = pacientes.find(p => p.id === triaje.pacienteId);
        const cita = citas.find(c => c.id === triaje.citaId);
        return (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border-2 border-primary/20">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-foreground truncate">{getPacienteNombre(triaje.pacienteId)}</div>
              <div className="text-sm text-muted-foreground truncate">{paciente?.dni}</div>
              <div className="text-xs text-muted-foreground truncate">{cita?.especialidad}</div>
            </div>
          </div>
        );
      },
    },
    {
      key: 'fecha',
      titulo: 'Fecha y Hora',
      sortable: true,
      render: (triaje: Triaje) => (
        <div className="text-sm">
          <div className="flex items-center gap-2 text-foreground">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            {new Date(triaje.fecha).toLocaleDateString('es-PE')}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground mt-1">
            <Clock className="h-4 w-4" />
            {triaje.hora}
          </div>
        </div>
      ),
    },
    {
      key: 'signosVitales',
      titulo: 'Signos Vitales',
      render: (triaje: Triaje) => (
        <div className="text-sm space-y-2">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-red-500" />
            <span className="font-medium">{triaje.presionSistolica}/{triaje.presionDiastolica}</span>
            <span className="text-xs text-muted-foreground">mmHg</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-500" />
            <span className="font-medium">{triaje.frecuenciaCardiaca}</span>
            <span className="text-xs text-muted-foreground">lpm</span>
          </div>
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-orange-500" />
            <span className="font-medium">{triaje.temperatura}°C</span>
          </div>
          <div className="flex items-center gap-2">
            <Weight className="h-4 w-4 text-green-500" />
            <span className="font-medium">{triaje.peso}kg</span>
            <span className="text-xs text-muted-foreground">IMC: {triaje.imc}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'alertas',
      titulo: 'Estado de Salud',
      render: (triaje: Triaje) => (
        <div className="space-y-2">
          {triaje.alertas.length > 0 ? (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <Badge variant="destructive" className="text-xs">
                  {triaje.alertas.length} alerta(s)
                </Badge>
              </div>
              <div className="space-y-1">
                {triaje.alertas.slice(0, 2).map((alerta, index) => (
                  <p key={index} className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 px-2 py-1 rounded">
                    • {alerta}
                  </p>
                ))}
                {triaje.alertas.length > 2 && (
                  <p className="text-xs text-muted-foreground">
                    +{triaje.alertas.length - 2} más...
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs">
                Sin alertas
              </Badge>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'completado',
      titulo: 'Estado',
      render: (triaje: Triaje) => (
        <div className="space-y-2">
          {getEstadoBadge(triaje.completado)}
          {triaje.completado && (
            <div className="text-xs text-muted-foreground">
              Registrado: {new Date(triaje.fechaRegistro).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'acciones',
      titulo: 'Acciones',
      render: (triaje: Triaje) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setTriajeSeleccionado(triaje);
              // Aquí se podría abrir un modal de vista
            }}
            className="h-8 w-8 p-0"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setTriajeSeleccionado(triaje);
              setShowEditarTriaje(true);
            }}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          {!triaje.completado && (
            <Button
              size="sm"
              variant="default"
              onClick={() => {
                setTriajeSeleccionado(triaje);
                setShowEditarTriaje(true);
              }}
              className="h-8 px-3 text-xs"
            >
              Completar
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (!sessionUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Módulo de Triaje</h1>
          <p className="text-muted-foreground">Registro de signos vitales y evaluación inicial de pacientes</p>
        </div>
        <Button onClick={() => setShowNuevoTriaje(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Triaje
        </Button>
      </div>

      {/* Estadísticas Mejoradas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-foreground">{estadisticas.total}</p>
                <p className="text-sm font-medium text-muted-foreground">Total Triajes</p>
                <p className="text-xs text-muted-foreground mt-1">Hoy: {new Date().toLocaleDateString('es-PE')}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Stethoscope className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-500/5 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-foreground">{estadisticas.completados}</p>
                <p className="text-sm font-medium text-muted-foreground">Completados</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  {estadisticas.total > 0 ? Math.round((estadisticas.completados / estadisticas.total) * 100) : 0}% del total
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-orange-500 bg-gradient-to-r from-orange-500/5 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-foreground">{estadisticas.pendientes}</p>
                <p className="text-sm font-medium text-muted-foreground">Pendientes</p>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                  Requieren atención inmediata
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-red-500 bg-gradient-to-r from-red-500/5 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-foreground">{estadisticas.conAlertas}</p>
                <p className="text-sm font-medium text-muted-foreground">Con Alertas</p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  Signos vitales alterados
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Panel de Alertas Críticas */}
      {estadisticas.conAlertas > 0 && (
        <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
              <AlertTriangle className="h-5 w-5" />
              Alertas Críticas Activas
            </CardTitle>
            <CardDescription className="text-red-600 dark:text-red-400">
              {estadisticas.conAlertas} paciente(s) con signos vitales fuera de rango normal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {triajes.filter(t => t.alertas.length > 0).slice(0, 3).map(triaje => (
                <div key={triaje.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-foreground">{getPacienteNombre(triaje.pacienteId)}</h4>
                    <Badge variant="destructive" className="text-xs">
                      {triaje.alertas.length} alerta(s)
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    {triaje.alertas.slice(0, 2).map((alerta, index) => (
                      <p key={index} className="text-xs text-red-600 dark:text-red-400">
                        • {alerta}
                      </p>
                    ))}
                    {triaje.alertas.length > 2 && (
                      <p className="text-xs text-muted-foreground">
                        +{triaje.alertas.length - 2} más...
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs principales */}
      <Tabs defaultValue="triajes" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="triajes">Registro de Triajes</TabsTrigger>
          <TabsTrigger value="alertas">Alertas por Antecedentes</TabsTrigger>
        </TabsList>

        {/* Tab Triajes */}
        <TabsContent value="triajes" className="space-y-4">
          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros de Búsqueda
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="busqueda">Buscar</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="busqueda"
                      placeholder="Paciente o especialidad..."
                      value={filtroBusqueda}
                      onChange={(e) => setFiltroBusqueda(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="estado">Estado</Label>
                  <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los estados</SelectItem>
                      <SelectItem value="completado">Completados</SelectItem>
                      <SelectItem value="pendiente">Pendientes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="fecha">Fecha</Label>
                  <Input
                    id="fecha"
                    type="date"
                    value={filtroFecha}
                    onChange={(e) => setFiltroFecha(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabla de Triajes */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Triajes</CardTitle>
              <CardDescription>
                {triajesFiltrados.length} de {triajes.length} triajes encontrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                data={triajesFiltrados as unknown as Record<string, unknown>[]}
                columnas={columnas as unknown as Columna<Record<string, unknown>>[]}
                itemsPorPagina={10}
                keyExtractor={(triaje: Record<string, unknown>) => triaje.id as string}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Alertas por Antecedentes */}
        <TabsContent value="alertas" className="space-y-6">
          {/* Estadísticas de Antecedentes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-red-500 bg-gradient-to-r from-red-500/5 to-transparent">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {pacientes.filter(p => p.antecedentesMedicos.length > 0).length}
                    </p>
                    <p className="text-sm font-medium text-muted-foreground">Con Antecedentes</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                    <Heart className="h-5 w-5 text-red-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-yellow-500 bg-gradient-to-r from-yellow-500/5 to-transparent">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {pacientes.filter(p => p.alergias.length > 0).length}
                    </p>
                    <p className="text-sm font-medium text-muted-foreground">Con Alergias</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-500/5 to-transparent">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {pacientes.filter(p => p.medicamentos.length > 0).length}
                    </p>
                    <p className="text-sm font-medium text-muted-foreground">En Tratamiento</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Pill className="h-5 w-5 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Alertas por Antecedentes de Importancia
              </CardTitle>
              <CardDescription>
                Pacientes con antecedentes médicos que requieren atención especial y monitoreo continuo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {pacientes.map(paciente => {
                  const tieneAntecedentes = paciente.antecedentesMedicos.length > 0 || paciente.alergias.length > 0 || paciente.medicamentos.length > 0;
                  const triajePaciente = triajes.find(t => t.pacienteId === paciente.id);
                  
                  return (
                    <Card key={paciente.id} className={`border-l-4 ${tieneAntecedentes ? 'border-l-orange-500 bg-orange-50/50 dark:bg-orange-950/10' : 'border-l-gray-300 bg-gray-50/50 dark:bg-gray-950/10'}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border-2 border-primary/20">
                                <User className="h-8 w-8 text-primary" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-foreground">
                                  {paciente.nombres} {paciente.apellidos}
                                </h3>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>DNI: {paciente.dni}</span>
                                  <span>•</span>
                                  <span>{paciente.edad} años</span>
                                  <span>•</span>
                                  <span>{paciente.telefono}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                                    {paciente.edad} años
                                  </Badge>
                                  {triajePaciente && (
                                    <Badge variant={triajePaciente.completado ? "secondary" : "destructive"}>
                                      {triajePaciente.completado ? 'Triaje Completado' : 'Triaje Pendiente'}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <Heart className="h-4 w-4 text-red-500" />
                                  <Label className="text-sm font-semibold text-foreground">Antecedentes Médicos</Label>
                                </div>
                                <div className="space-y-2">
                                  {paciente.antecedentesMedicos.length > 0 ? (
                                    paciente.antecedentesMedicos.map((antecedente, index) => (
                                      <div key={index} className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                        <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 text-xs">
                                          {antecedente}
                                        </Badge>
                                      </div>
                                    ))
                                  ) : (
                                    <span className="text-sm text-muted-foreground italic">Ninguno registrado</span>
                                  )}
                                </div>
                              </div>
                              
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                  <Label className="text-sm font-semibold text-foreground">Alergias</Label>
                                </div>
                                <div className="space-y-2">
                                  {paciente.alergias.length > 0 ? (
                                    paciente.alergias.map((alergia, index) => (
                                      <div key={index} className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 text-xs">
                                          {alergia}
                                        </Badge>
                                      </div>
                                    ))
                                  ) : (
                                    <span className="text-sm text-muted-foreground italic">Ninguna registrada</span>
                                  )}
                                </div>
                              </div>
                              
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <Pill className="h-4 w-4 text-blue-500" />
                                  <Label className="text-sm font-semibold text-foreground">Medicamentos</Label>
                                </div>
                                <div className="space-y-2">
                                  {paciente.medicamentos.length > 0 ? (
                                    paciente.medicamentos.map((medicamento, index) => (
                                      <div key={index} className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs">
                                          {medicamento}
                                        </Badge>
                                      </div>
                                    ))
                                  ) : (
                                    <span className="text-sm text-muted-foreground italic">Ninguno registrado</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            {paciente.direccion && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>{paciente.direccion}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-col items-center gap-2">
                            <Button size="sm" variant="outline" className="w-full">
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Detalle
                            </Button>
                            <Button size="sm" variant="outline" className="w-full">
                              <FileText className="h-4 w-4 mr-2" />
                              Historial
                            </Button>
                            {!triajePaciente?.completado && (
                              <Button size="sm" variant="default" className="w-full">
                                <Plus className="h-4 w-4 mr-2" />
                                Realizar Triaje
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal Nuevo Triaje */}
      {showNuevoTriaje && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Registrar Nuevo Triaje</CardTitle>
              <CardDescription>Completar evaluación inicial del paciente</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); crearNuevoTriaje(new FormData(e.currentTarget)); }} className="space-y-6">
                {/* Información del Paciente */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Información del Paciente</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="pacienteId">Paciente</Label>
                      <Select name="pacienteId" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar paciente" />
                        </SelectTrigger>
                        <SelectContent>
                          {pacientes.map(paciente => (
                            <SelectItem key={paciente.id} value={paciente.id}>
                              {paciente.nombres} {paciente.apellidos} - {paciente.dni}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="citaId">Cita</Label>
                      <Select name="citaId" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar cita" />
                        </SelectTrigger>
                        <SelectContent>
                          {citas.map(cita => (
                            <SelectItem key={cita.id} value={cita.id}>
                              {getPacienteNombre(cita.pacienteId)} - {cita.especialidad}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="fecha">Fecha</Label>
                      <Input id="fecha" name="fecha" type="date" required />
                    </div>
                    
                    <div>
                      <Label htmlFor="hora">Hora</Label>
                      <Input id="hora" name="hora" type="time" required />
                    </div>
                  </div>
                </div>

                {/* Signos Vitales */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Signos Vitales</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="presionSistolica">Presión Sistólica (mmHg)</Label>
                      <Input id="presionSistolica" name="presionSistolica" type="number" min="50" max="250" required />
                    </div>
                    
                    <div>
                      <Label htmlFor="presionDiastolica">Presión Diastólica (mmHg)</Label>
                      <Input id="presionDiastolica" name="presionDiastolica" type="number" min="30" max="150" required />
                    </div>
                    
                    <div>
                      <Label htmlFor="frecuenciaCardiaca">Frecuencia Cardíaca (lpm)</Label>
                      <Input id="frecuenciaCardiaca" name="frecuenciaCardiaca" type="number" min="40" max="200" required />
                    </div>
                    
                    <div>
                      <Label htmlFor="frecuenciaRespiratoria">Frecuencia Respiratoria (rpm)</Label>
                      <Input id="frecuenciaRespiratoria" name="frecuenciaRespiratoria" type="number" min="8" max="40" required />
                    </div>
                    
                    <div>
                      <Label htmlFor="temperatura">Temperatura (°C)</Label>
                      <Input id="temperatura" name="temperatura" type="number" step="0.1" min="30" max="45" required />
                    </div>
                    
                    <div>
                      <Label htmlFor="saturacion">Saturación de Oxígeno (%)</Label>
                      <Input id="saturacion" name="saturacion" type="number" min="70" max="100" required />
                    </div>
                    
                    <div>
                      <Label htmlFor="peso">Peso (kg)</Label>
                      <Input id="peso" name="peso" type="number" step="0.1" min="10" max="300" required />
                    </div>
                    
                    <div>
                      <Label htmlFor="talla">Talla (m)</Label>
                      <Input id="talla" name="talla" type="number" step="0.01" min="0.5" max="2.5" required />
                    </div>
                  </div>
                </div>

                {/* Antecedentes y Observaciones */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Antecedentes y Observaciones</h3>
                  <div>
                    <Label htmlFor="antecedentesImportantes">Antecedentes de Importancia</Label>
                    <Input 
                      id="antecedentesImportantes" 
                      name="antecedentesImportantes" 
                      placeholder="Separar por comas: Hipertensión, Diabetes, etc."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="observaciones">Observaciones</Label>
                    <Textarea 
                      id="observaciones" 
                      name="observaciones" 
                      placeholder="Observaciones adicionales del triaje..."
                      rows={3}
                    />
                  </div>
                </div>
                
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setShowNuevoTriaje(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Registrar Triaje
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
