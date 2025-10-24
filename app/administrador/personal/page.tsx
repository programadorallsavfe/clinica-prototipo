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
import PersonalCalendar from '@/components/personal-calendar';
import AsistenciasTable from '@/components/asistencias-table';
import IncidenciasTable from '@/components/incidencias-table';
import { getSession } from '@/lib/auth';
import { 
  generateId, getCurrentTimestamp, logAuditoria
} from '@/lib/storage';
import { 
  Users, Plus, Search, Filter, Phone, Mail, MapPin, 
  Calendar, CheckCircle, XCircle, Eye, Edit, Trash2, 
  User, Clock, DollarSign, FileText, AlertTriangle, 
  Activity, TrendingUp, Building2, CreditCard, 
  CalendarDays, Coffee, Briefcase, Award, 
  Calculator, BarChart3, Download, Upload,
  UserCheck, UserX, Clock3, Calendar as CalendarIcon,
  Banknote, Receipt, FileSpreadsheet, PieChart, Shield
} from 'lucide-react';

// Interfaces para Personal
interface Personal {
  id: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento: string;
  edad: number;
  dni: string;
  colegioProfesional?: string;
  registroEspecialista?: string;
  direccion: string;
  telefono: string;
  email: string;
  cargo: 'medico' | 'enfermero' | 'recepcionista' | 'administrador' | 'limpieza' | 'seguridad' | 'contador' | 'otro';
  montoContratado: number;
  codigoEssalud: string;
  afp: 'prima' | 'profuturo' | 'integra' | 'habitat' | 'onp';
  numeroAfp: string;
  fechaIngreso: string;
  estado: 'activo' | 'inactivo' | 'suspendido' | 'vacaciones';
  observaciones?: string;
  fechaRegistro: string;
  fechaActualizacion: string;
  creadoPor: string;
}

interface HorarioPersonal {
  id: string;
  personalId: string;
  diaSemana: 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo';
  horaInicio: string;
  horaFin: string;
  tipo: 'normal' | 'extra' | 'guardia';
  activo: boolean;
  fechaCreacion: string;
}

interface DiaNoLaborable {
  id: string;
  personalId: string;
  fecha: string;
  motivo: 'feriado' | 'permiso' | 'licencia' | 'suspension' | 'otro';
  descripcion: string;
  pagado: boolean;
  fechaCreacion: string;
}

interface Vacacion {
  id: string;
  personalId: string;
  fechaInicio: string;
  fechaFin: string;
  diasSolicitados: number;
  diasDisponibles: number;
  estado: 'solicitada' | 'aprobada' | 'rechazada' | 'tomada';
  motivo?: string;
  fechaSolicitud: string;
  fechaAprobacion?: string;
  aprobadoPor?: string;
}

interface RegistroAsistencia {
  id: string;
  personalId: string;
  fecha: string;
  horaEntrada: string;
  horaSalida?: string;
  horasTrabajadas: number;
  minutosTrabajados: number;
  tardanza: number; // minutos
  falta: boolean;
  observaciones?: string;
  fechaRegistro: string;
}

interface PagoPersonal {
  id: string;
  personalId: string;
  periodo: string; // YYYY-MM
  sueldoBase: number;
  horasExtras: number;
  montoHorasExtras: number;
  bonos: number;
  descuentos: number;
  totalBruto: number;
  essalud: number;
  afp: number;
  totalNeto: number;
  estado: 'pendiente' | 'pagado' | 'cancelado';
  fechaPago?: string;
  observaciones?: string;
  fechaCreacion: string;
}

interface Incidencia {
  id: string;
  personalId: string;
  tipo: 'memorandum' | 'amonestacion' | 'felicitacion' | 'otro';
  titulo: string;
  descripcion: string;
  fecha: string;
  severidad: 'leve' | 'moderada' | 'grave';
  estado: 'activa' | 'resuelta' | 'archivada';
  fechaCreacion: string;
  creadoPor: string;
}

export default function PersonalPage() {
  const [personal, setPersonal] = useState<Personal[]>([]);
  const [horarios, setHorarios] = useState<HorarioPersonal[]>([]);
  const [asistencias, setAsistencias] = useState<RegistroAsistencia[]>([]);
  const [pagos, setPagos] = useState<PagoPersonal[]>([]);
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const [sessionUser, setSessionUser] = useState<{ userId: string; username: string } | null>(null);
  
  // Estados de formularios
  const [showNuevoPersonal, setShowNuevoPersonal] = useState(false);
  const [showEditarPersonal, setShowEditarPersonal] = useState(false);
  const [showHorarios, setShowHorarios] = useState(false);
  const [showVacaciones, setShowVacaciones] = useState(false);
  const [showIncidencias, setShowIncidencias] = useState(false);
  const [personalSeleccionado, setPersonalSeleccionado] = useState<Personal | null>(null);
  
  // Estados de filtros
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [filtroCargo, setFiltroCargo] = useState<string>('todos');

  useEffect(() => {
    const session = getSession();
    setSessionUser(session);
    cargarDatos();
    inicializarDatosMock();
  }, []);

  const calcularEdad = (fechaNacimiento: string): number => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const inicializarDatosMock = () => {
    // Verificar si ya hay datos para no duplicar
    const personalExistentes = getPersonalFromStorage();
    if (personalExistentes.length === 0) {
      const personalMock: Personal[] = [
        {
          id: generateId('pers'),
          nombres: 'Carlos',
          apellidos: 'Sánchez López',
          fechaNacimiento: '1985-03-15',
          edad: calcularEdad('1985-03-15'),
          dni: '12345678',
          colegioProfesional: 'Colegio Médico del Perú',
          registroEspecialista: 'CMP-12345',
          direccion: 'Av. Javier Prado 1234, San Isidro, Lima',
          telefono: '987654321',
          email: 'carlos.sanchez@clinica.com',
          cargo: 'medico',
          montoContratado: 8000,
          codigoEssalud: 'ESS-001',
          afp: 'prima',
          numeroAfp: 'AFP-001',
          fechaIngreso: '2020-01-15',
          estado: 'activo',
          observaciones: 'Médico general con especialización en medicina interna',
          fechaRegistro: getCurrentTimestamp(),
          fechaActualizacion: getCurrentTimestamp(),
          creadoPor: sessionUser?.userId || 'system',
        },
        {
          id: generateId('pers'),
          nombres: 'María',
          apellidos: 'González Pérez',
          fechaNacimiento: '1990-07-22',
          edad: calcularEdad('1990-07-22'),
          dni: '87654321',
          colegioProfesional: 'Colegio de Enfermeros del Perú',
          registroEspecialista: 'CEP-54321',
          direccion: 'Jr. Los Olivos 567, Miraflores, Lima',
          telefono: '912345678',
          email: 'maria.gonzalez@clinica.com',
          cargo: 'enfermero',
          montoContratado: 3500,
          codigoEssalud: 'ESS-002',
          afp: 'profuturo',
          numeroAfp: 'AFP-002',
          fechaIngreso: '2021-03-10',
          estado: 'activo',
          fechaRegistro: getCurrentTimestamp(),
          fechaActualizacion: getCurrentTimestamp(),
          creadoPor: sessionUser?.userId || 'system',
        },
        {
          id: generateId('pers'),
          nombres: 'Ana',
          apellidos: 'Martínez Rodríguez',
          fechaNacimiento: '1988-11-08',
          edad: calcularEdad('1988-11-08'),
          dni: '11223344',
          direccion: 'Av. Arequipa 890, La Molina, Lima',
          telefono: '923456789',
          email: 'ana.martinez@clinica.com',
          cargo: 'recepcionista',
          montoContratado: 2800,
          codigoEssalud: 'ESS-003',
          afp: 'integra',
          numeroAfp: 'AFP-003',
          fechaIngreso: '2022-06-01',
          estado: 'activo',
          fechaRegistro: getCurrentTimestamp(),
          fechaActualizacion: getCurrentTimestamp(),
          creadoPor: sessionUser?.userId || 'system',
        },
        {
          id: generateId('pers'),
          nombres: 'Roberto',
          apellidos: 'Vargas Silva',
          fechaNacimiento: '1982-05-12',
          edad: calcularEdad('1982-05-12'),
          dni: '55667788',
          direccion: 'Calle Real 234, Surco, Lima',
          telefono: '934567890',
          email: 'roberto.vargas@clinica.com',
          cargo: 'administrador',
          montoContratado: 6000,
          codigoEssalud: 'ESS-004',
          afp: 'habitat',
          numeroAfp: 'AFP-004',
          fechaIngreso: '2019-09-15',
          estado: 'activo',
          fechaRegistro: getCurrentTimestamp(),
          fechaActualizacion: getCurrentTimestamp(),
          creadoPor: sessionUser?.userId || 'system',
        },
        {
          id: generateId('pers'),
          nombres: 'Luis',
          apellidos: 'Fernández Torres',
          fechaNacimiento: '1995-12-03',
          edad: calcularEdad('1995-12-03'),
          dni: '99887766',
          direccion: 'Jr. San Martín 456, Callao, Lima',
          telefono: '945678901',
          email: 'luis.fernandez@clinica.com',
          cargo: 'limpieza',
          montoContratado: 1800,
          codigoEssalud: 'ESS-005',
          afp: 'onp',
          numeroAfp: 'ONP-005',
          fechaIngreso: '2023-01-20',
          estado: 'activo',
          fechaRegistro: getCurrentTimestamp(),
          fechaActualizacion: getCurrentTimestamp(),
          creadoPor: sessionUser?.userId || 'system',
        },
        {
          id: generateId('pers'),
          nombres: 'Sofia',
          apellidos: 'Herrera Morales',
          fechaNacimiento: '1993-08-18',
          edad: calcularEdad('1993-08-18'),
          dni: '44332211',
          direccion: 'Av. Universitaria 789, San Miguel, Lima',
          telefono: '956789012',
          email: 'sofia.herrera@clinica.com',
          cargo: 'contador',
          montoContratado: 4500,
          codigoEssalud: 'ESS-006',
          afp: 'prima',
          numeroAfp: 'AFP-006',
          fechaIngreso: '2021-11-05',
          estado: 'vacaciones',
          observaciones: 'Actualmente en vacaciones hasta el 15 de enero',
          fechaRegistro: getCurrentTimestamp(),
          fechaActualizacion: getCurrentTimestamp(),
          creadoPor: sessionUser?.userId || 'system',
        }
      ];

      // Guardar personal mock
      personalMock.forEach(persona => {
        savePersonalToStorage(persona);
      });
    }
  };

  const getPersonalFromStorage = (): Personal[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem('clinica_personal');
    return data ? JSON.parse(data) : [];
  };

  const savePersonalToStorage = (persona: Personal) => {
    if (typeof window === 'undefined') return;
    const personal = getPersonalFromStorage();
    personal.push(persona);
    localStorage.setItem('clinica_personal', JSON.stringify(personal));
  };

  const updatePersonalInStorage = (id: string, updates: Partial<Personal>) => {
    if (typeof window === 'undefined') return;
    const personal = getPersonalFromStorage();
    const index = personal.findIndex(p => p.id === id);
    if (index !== -1) {
      personal[index] = { ...personal[index], ...updates };
      localStorage.setItem('clinica_personal', JSON.stringify(personal));
    }
  };

  const deletePersonalFromStorage = (id: string) => {
    if (typeof window === 'undefined') return;
    const personal = getPersonalFromStorage();
    const filtered = personal.filter(p => p.id !== id);
    localStorage.setItem('clinica_personal', JSON.stringify(filtered));
  };

  const cargarDatos = () => {
    setPersonal(getPersonalFromStorage());
  };

  const crearNuevoPersonal = (formData: FormData) => {
    const fechaNacimiento = formData.get('fechaNacimiento') as string;
    const nuevoPersonal: Personal = {
      id: generateId('pers'),
      nombres: formData.get('nombres') as string,
      apellidos: formData.get('apellidos') as string,
      fechaNacimiento,
      edad: calcularEdad(fechaNacimiento),
      dni: formData.get('dni') as string,
      colegioProfesional: formData.get('colegioProfesional') as string || undefined,
      registroEspecialista: formData.get('registroEspecialista') as string || undefined,
      direccion: formData.get('direccion') as string,
      telefono: formData.get('telefono') as string,
      email: formData.get('email') as string,
      cargo: formData.get('cargo') as Personal['cargo'],
      montoContratado: parseFloat(formData.get('montoContratado') as string),
      codigoEssalud: formData.get('codigoEssalud') as string,
      afp: formData.get('afp') as Personal['afp'],
      numeroAfp: formData.get('numeroAfp') as string,
      fechaIngreso: formData.get('fechaIngreso') as string,
      estado: 'activo',
      observaciones: formData.get('observaciones') as string || undefined,
      fechaRegistro: getCurrentTimestamp(),
      fechaActualizacion: getCurrentTimestamp(),
      creadoPor: sessionUser?.userId || '',
    };

    savePersonalToStorage(nuevoPersonal);
    if (sessionUser) {
      logAuditoria(
        sessionUser.userId, 
        sessionUser.username, 
        'Crear personal', 
        'Personal', 
        nuevoPersonal.id, 
        undefined, 
        nuevoPersonal as unknown as Record<string, unknown>
      );
    }
    
    setShowNuevoPersonal(false);
    cargarDatos();
  };

  const actualizarPersonal = (formData: FormData) => {
    if (!personalSeleccionado) return;

    const fechaNacimiento = formData.get('fechaNacimiento') as string;
    const updates: Partial<Personal> = {
      nombres: formData.get('nombres') as string,
      apellidos: formData.get('apellidos') as string,
      fechaNacimiento,
      edad: calcularEdad(fechaNacimiento),
      dni: formData.get('dni') as string,
      colegioProfesional: formData.get('colegioProfesional') as string || undefined,
      registroEspecialista: formData.get('registroEspecialista') as string || undefined,
      direccion: formData.get('direccion') as string,
      telefono: formData.get('telefono') as string,
      email: formData.get('email') as string,
      cargo: formData.get('cargo') as Personal['cargo'],
      montoContratado: parseFloat(formData.get('montoContratado') as string),
      codigoEssalud: formData.get('codigoEssalud') as string,
      afp: formData.get('afp') as Personal['afp'],
      numeroAfp: formData.get('numeroAfp') as string,
      fechaIngreso: formData.get('fechaIngreso') as string,
      estado: formData.get('estado') as Personal['estado'],
      observaciones: formData.get('observaciones') as string || undefined,
      fechaActualizacion: getCurrentTimestamp(),
    };

    updatePersonalInStorage(personalSeleccionado.id, updates);
    if (sessionUser) {
      logAuditoria(
        sessionUser.userId, 
        sessionUser.username, 
        'Actualizar personal', 
        'Personal', 
        personalSeleccionado.id, 
        personalSeleccionado as unknown as Record<string, unknown>, 
        updates as unknown as Record<string, unknown>
      );
    }
    
    setShowEditarPersonal(false);
    setPersonalSeleccionado(null);
    cargarDatos();
  };

  const eliminarPersonal = (personalId: string) => {
    if (confirm('¿Está seguro de eliminar este miembro del personal?')) {
      deletePersonalFromStorage(personalId);
      if (sessionUser) {
        logAuditoria(
          sessionUser.userId, 
          sessionUser.username, 
          'Eliminar personal', 
          'Personal', 
          personalId, 
          undefined, 
          undefined
        );
      }
      cargarDatos();
    }
  };

  // Filtrar personal
  const personalFiltrado = personal.filter(persona => {
    const cumpleBusqueda = filtroBusqueda === '' || 
      persona.nombres.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
      persona.apellidos.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
      persona.dni.includes(filtroBusqueda) ||
      persona.cargo.toLowerCase().includes(filtroBusqueda.toLowerCase());
    
    const cumpleEstado = filtroEstado === 'todos' || persona.estado === filtroEstado;
    const cumpleCargo = filtroCargo === 'todos' || persona.cargo === filtroCargo;
    
    return cumpleBusqueda && cumpleEstado && cumpleCargo;
  });

  // Estadísticas
  const estadisticas = {
    total: personal.length,
    activos: personal.filter(p => p.estado === 'activo').length,
    medicos: personal.filter(p => p.cargo === 'medico').length,
    enfermeros: personal.filter(p => p.cargo === 'enfermero').length,
    administrativos: personal.filter(p => p.cargo === 'administrador' || p.cargo === 'recepcionista' || p.cargo === 'contador').length,
    otros: personal.filter(p => p.cargo === 'limpieza' || p.cargo === 'seguridad' || p.cargo === 'otro').length,
  };

  const getEstadoBadge = (estado: Personal['estado']) => {
    const configs = {
      activo: { variant: 'secondary' as const, className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
      inactivo: { variant: 'secondary' as const, className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' },
      suspendido: { variant: 'secondary' as const, className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
      vacaciones: { variant: 'secondary' as const, className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
    };
    
    const config = configs[estado];
    return (
      <Badge variant={config.variant} className={config.className}>
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </Badge>
    );
  };

  const getCargoIcon = (cargo: Personal['cargo']) => {
    switch (cargo) {
      case 'medico': return <User className="h-4 w-4" />;
      case 'enfermero': return <UserCheck className="h-4 w-4" />;
      case 'recepcionista': return <Phone className="h-4 w-4" />;
      case 'administrador': return <Building2 className="h-4 w-4" />;
      case 'contador': return <Calculator className="h-4 w-4" />;
      case 'limpieza': return <Coffee className="h-4 w-4" />;
      case 'seguridad': return <Shield className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const columnas: Columna<Personal>[] = [
    {
      key: 'nombres',
      titulo: 'Personal',
      sortable: true,
      render: (persona: Personal) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            {getCargoIcon(persona.cargo)}
          </div>
          <div>
            <div className="font-medium text-foreground">{persona.nombres} {persona.apellidos}</div>
            <div className="text-sm text-muted-foreground">DNI: {persona.dni}</div>
            <div className="text-sm text-muted-foreground">Edad: {persona.edad} años</div>
          </div>
        </div>
      ),
    },
    {
      key: 'cargo',
      titulo: 'Cargo',
      render: (persona: Personal) => (
        <div className="flex items-center gap-2">
          {getCargoIcon(persona.cargo)}
          <span className="capitalize">{persona.cargo}</span>
        </div>
      ),
    },
    {
      key: 'montoContratado',
      titulo: 'Sueldo',
      sortable: true,
      render: (persona: Personal) => (
        <div className="text-right">
          <div className="font-medium text-foreground">S/ {persona.montoContratado.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">mensual</div>
        </div>
      ),
    },
    {
      key: 'fechaIngreso',
      titulo: 'Fecha Ingreso',
      sortable: true,
      render: (persona: Personal) => (
        <div className="text-sm">
          <div className="text-foreground">
            {new Date(persona.fechaIngreso).toLocaleDateString('es-PE')}
          </div>
          <div className="text-muted-foreground">
            {Math.floor((Date.now() - new Date(persona.fechaIngreso).getTime()) / (1000 * 60 * 60 * 24 * 365))} años
          </div>
        </div>
      ),
    },
    {
      key: 'estado',
      titulo: 'Estado',
      render: (persona: Personal) => getEstadoBadge(persona.estado),
    },
    {
      key: 'acciones',
      titulo: 'Acciones',
      render: (persona: Personal) => (
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setPersonalSeleccionado(persona);
              setShowEditarPersonal(true);
            }}
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => eliminarPersonal(persona.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
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
          <h1 className="text-3xl font-bold text-foreground">Gestión de Personal</h1>
          <p className="text-muted-foreground">Administración completa del personal médico y administrativo</p>
        </div>
        <Button onClick={() => setShowNuevoPersonal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Personal
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">{estadisticas.total}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{estadisticas.activos}</p>
                <p className="text-sm text-muted-foreground">Activos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{estadisticas.medicos}</p>
                <p className="text-sm text-muted-foreground">Médicos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{estadisticas.enfermeros}</p>
                <p className="text-sm text-muted-foreground">Enfermeros</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{estadisticas.administrativos}</p>
                <p className="text-sm text-muted-foreground">Administrativos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Coffee className="h-5 w-5 text-teal-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{estadisticas.otros}</p>
                <p className="text-sm text-muted-foreground">Otros</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs principales */}
      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="horarios">Horarios</TabsTrigger>
          <TabsTrigger value="asistencias">Asistencias</TabsTrigger>
          <TabsTrigger value="pagos">Pagos</TabsTrigger>
          <TabsTrigger value="vacaciones">Vacaciones</TabsTrigger>
          <TabsTrigger value="incidencias">Incidencias</TabsTrigger>
        </TabsList>

        {/* Tab Personal */}
        <TabsContent value="personal" className="space-y-4">
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
                      placeholder="Nombre, DNI o cargo..."
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
                      <SelectItem value="activo">Activo</SelectItem>
                      <SelectItem value="inactivo">Inactivo</SelectItem>
                      <SelectItem value="suspendido">Suspendido</SelectItem>
                      <SelectItem value="vacaciones">En Vacaciones</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="cargo">Cargo</Label>
                  <Select value={filtroCargo} onValueChange={setFiltroCargo}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los cargos</SelectItem>
                      <SelectItem value="medico">Médico</SelectItem>
                      <SelectItem value="enfermero">Enfermero</SelectItem>
                      <SelectItem value="recepcionista">Recepcionista</SelectItem>
                      <SelectItem value="administrador">Administrador</SelectItem>
                      <SelectItem value="contador">Contador</SelectItem>
                      <SelectItem value="limpieza">Limpieza</SelectItem>
                      <SelectItem value="seguridad">Seguridad</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabla de Personal */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Personal</CardTitle>
              <CardDescription>
                {personalFiltrado.length} de {personal.length} miembros del personal encontrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                data={personalFiltrado as unknown as Record<string, unknown>[]}
                columnas={columnas as unknown as Columna<Record<string, unknown>>[]}
                itemsPorPagina={10}
                keyExtractor={(persona: Record<string, unknown>) => persona.id as string}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Horarios */}
        <TabsContent value="horarios" className="space-y-4">
          <PersonalCalendar 
            personal={personal.map(p => ({
              id: p.id,
              nombres: p.nombres,
              apellidos: p.apellidos,
              cargo: p.cargo,
              estado: p.estado
            }))}
            horarios={[]}
            asistencias={[]}
            vacaciones={[]}
            incidencias={[]}
          />
        </TabsContent>

        {/* Tab Asistencias */}
        <TabsContent value="asistencias" className="space-y-4">
          <AsistenciasTable 
            personal={personal.map(p => ({
              id: p.id,
              nombres: p.nombres,
              apellidos: p.apellidos,
              cargo: p.cargo,
              estado: p.estado
            }))}
            asistencias={asistencias}
          />
        </TabsContent>

        {/* Tab Pagos */}
        <TabsContent value="pagos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Gestión de Pagos y Nómina
              </CardTitle>
              <CardDescription>
                Cálculo de sueldos, horas extras, bonos, descuentos y pagos AFP/ESSALUD
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Resumen de Nómina */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="text-2xl font-bold text-foreground">
                            S/ {personal.reduce((sum, p) => sum + p.montoContratado, 0).toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">Total Nómina</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Calculator className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-2xl font-bold text-foreground">
                            S/ {(personal.reduce((sum, p) => sum + p.montoContratado, 0) * 0.09).toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">ESSALUD (9%)</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-purple-500" />
                        <div>
                          <p className="text-2xl font-bold text-foreground">
                            S/ {(personal.reduce((sum, p) => sum + p.montoContratado, 0) * 0.13).toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">AFP (13%)</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Receipt className="h-5 w-5 text-orange-500" />
                        <div>
                          <p className="text-2xl font-bold text-foreground">
                            S/ {(personal.reduce((sum, p) => sum + p.montoContratado, 0) * 0.78).toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">Neto a Pagar</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Tabla de Nómina */}
                <Card>
                  <CardHeader>
                    <CardTitle>Detalle de Nómina</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Personal</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Cargo</th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Sueldo Base</th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">ESSALUD</th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">AFP</th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Neto</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {personal.map(persona => (
                            <tr key={persona.id}>
                              <td className="px-4 py-3 text-sm text-foreground">
                                {persona.nombres} {persona.apellidos}
                              </td>
                              <td className="px-4 py-3 text-sm text-foreground capitalize">
                                {persona.cargo}
                              </td>
                              <td className="px-4 py-3 text-sm text-foreground text-right">
                                S/ {persona.montoContratado.toLocaleString()}
                              </td>
                              <td className="px-4 py-3 text-sm text-foreground text-right">
                                S/ {(persona.montoContratado * 0.09).toLocaleString()}
                              </td>
                              <td className="px-4 py-3 text-sm text-foreground text-right">
                                S/ {(persona.montoContratado * 0.13).toLocaleString()}
                              </td>
                              <td className="px-4 py-3 text-sm font-medium text-foreground text-right">
                                S/ {(persona.montoContratado * 0.78).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-2">
                  <Button>
                    <Calculator className="h-4 w-4 mr-2" />
                    Calcular Nómina
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Excel
                  </Button>
                  <Button variant="outline">
                    <Receipt className="h-4 w-4 mr-2" />
                    Generar Boletas
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Vacaciones */}
        <TabsContent value="vacaciones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Gestión de Vacaciones
              </CardTitle>
              <CardDescription>
                Programación y control de vacaciones del personal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Estadísticas de Vacaciones */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-2xl font-bold text-foreground">30</p>
                          <p className="text-sm text-muted-foreground">Días Disponibles</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Coffee className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="text-2xl font-bold text-foreground">2</p>
                          <p className="text-sm text-muted-foreground">En Vacaciones</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-orange-500" />
                        <div>
                          <p className="text-2xl font-bold text-foreground">3</p>
                          <p className="text-sm text-muted-foreground">Solicitudes Pendientes</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Calendario de Vacaciones */}
                <PersonalCalendar 
                  personal={personal.map(p => ({
                    id: p.id,
                    nombres: p.nombres,
                    apellidos: p.apellidos,
                    cargo: p.cargo,
                    estado: p.estado
                  }))}
                  horarios={[]}
                  asistencias={[]}
                  vacaciones={[]}
                  incidencias={[]}
                />

                <div className="flex gap-2">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Solicitar Vacaciones
                  </Button>
                  <Button variant="outline">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Ver Calendario
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Incidencias */}
        <TabsContent value="incidencias" className="space-y-4">
          <IncidenciasTable 
            personal={personal.map(p => ({
              id: p.id,
              nombres: p.nombres,
              apellidos: p.apellidos,
              cargo: p.cargo,
              estado: p.estado
            }))}
            incidencias={incidencias}
          />
        </TabsContent>
      </Tabs>

      {/* Modal Nuevo Personal */}
      {showNuevoPersonal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Registrar Nuevo Personal</CardTitle>
              <CardDescription>Completar información del nuevo miembro del personal</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); crearNuevoPersonal(new FormData(e.currentTarget)); }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nombres">Nombres</Label>
                    <Input id="nombres" name="nombres" required />
                  </div>
                  <div>
                    <Label htmlFor="apellidos">Apellidos</Label>
                    <Input id="apellidos" name="apellidos" required />
                  </div>
                  <div>
                    <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
                    <Input id="fechaNacimiento" name="fechaNacimiento" type="date" required />
                  </div>
                  <div>
                    <Label htmlFor="dni">DNI</Label>
                    <Input id="dni" name="dni" required />
                  </div>
                  <div>
                    <Label htmlFor="colegioProfesional">Colegio Profesional</Label>
                    <Input id="colegioProfesional" name="colegioProfesional" placeholder="Opcional" />
                  </div>
                  <div>
                    <Label htmlFor="registroEspecialista">Registro de Especialista</Label>
                    <Input id="registroEspecialista" name="registroEspecialista" placeholder="Opcional" />
                  </div>
                  <div>
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input id="telefono" name="telefono" required />
                  </div>
                  <div>
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                  <div>
                    <Label htmlFor="cargo">Cargo</Label>
                    <Select name="cargo" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar cargo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="medico">Médico</SelectItem>
                        <SelectItem value="enfermero">Enfermero</SelectItem>
                        <SelectItem value="recepcionista">Recepcionista</SelectItem>
                        <SelectItem value="administrador">Administrador</SelectItem>
                        <SelectItem value="contador">Contador</SelectItem>
                        <SelectItem value="limpieza">Limpieza</SelectItem>
                        <SelectItem value="seguridad">Seguridad</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="montoContratado">Monto Contratado Mensual (S/)</Label>
                    <Input id="montoContratado" name="montoContratado" type="number" step="0.01" required />
                  </div>
                  <div>
                    <Label htmlFor="codigoEssalud">Código ESSALUD</Label>
                    <Input id="codigoEssalud" name="codigoEssalud" required />
                  </div>
                  <div>
                    <Label htmlFor="afp">AFP</Label>
                    <Select name="afp" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar AFP" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="prima">Prima AFP</SelectItem>
                        <SelectItem value="profuturo">Profuturo AFP</SelectItem>
                        <SelectItem value="integra">Integra AFP</SelectItem>
                        <SelectItem value="habitat">Habitat AFP</SelectItem>
                        <SelectItem value="onp">ONP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="numeroAfp">Número AFP</Label>
                    <Input id="numeroAfp" name="numeroAfp" required />
                  </div>
                  <div>
                    <Label htmlFor="fechaIngreso">Fecha de Ingreso</Label>
                    <Input id="fechaIngreso" name="fechaIngreso" type="date" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="direccion">Dirección</Label>
                  <Textarea id="direccion" name="direccion" required />
                </div>
                <div>
                  <Label htmlFor="observaciones">Observaciones</Label>
                  <Textarea id="observaciones" name="observaciones" placeholder="Información adicional..." />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setShowNuevoPersonal(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Registrar Personal
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal Editar Personal */}
      {showEditarPersonal && personalSeleccionado && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Editar Personal</CardTitle>
              <CardDescription>
                Modificar información de: {personalSeleccionado.nombres} {personalSeleccionado.apellidos}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); actualizarPersonal(new FormData(e.currentTarget)); }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nombres">Nombres</Label>
                    <Input id="nombres" name="nombres" defaultValue={personalSeleccionado.nombres} required />
                  </div>
                  <div>
                    <Label htmlFor="apellidos">Apellidos</Label>
                    <Input id="apellidos" name="apellidos" defaultValue={personalSeleccionado.apellidos} required />
                  </div>
                  <div>
                    <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
                    <Input id="fechaNacimiento" name="fechaNacimiento" type="date" defaultValue={personalSeleccionado.fechaNacimiento} required />
                  </div>
                  <div>
                    <Label htmlFor="dni">DNI</Label>
                    <Input id="dni" name="dni" defaultValue={personalSeleccionado.dni} required />
                  </div>
                  <div>
                    <Label htmlFor="colegioProfesional">Colegio Profesional</Label>
                    <Input id="colegioProfesional" name="colegioProfesional" defaultValue={personalSeleccionado.colegioProfesional || ''} />
                  </div>
                  <div>
                    <Label htmlFor="registroEspecialista">Registro de Especialista</Label>
                    <Input id="registroEspecialista" name="registroEspecialista" defaultValue={personalSeleccionado.registroEspecialista || ''} />
                  </div>
                  <div>
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input id="telefono" name="telefono" defaultValue={personalSeleccionado.telefono} required />
                  </div>
                  <div>
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input id="email" name="email" type="email" defaultValue={personalSeleccionado.email} required />
                  </div>
                  <div>
                    <Label htmlFor="cargo">Cargo</Label>
                    <Select name="cargo" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar cargo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="medico">Médico</SelectItem>
                        <SelectItem value="enfermero">Enfermero</SelectItem>
                        <SelectItem value="recepcionista">Recepcionista</SelectItem>
                        <SelectItem value="administrador">Administrador</SelectItem>
                        <SelectItem value="contador">Contador</SelectItem>
                        <SelectItem value="limpieza">Limpieza</SelectItem>
                        <SelectItem value="seguridad">Seguridad</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="montoContratado">Monto Contratado Mensual (S/)</Label>
                    <Input id="montoContratado" name="montoContratado" type="number" step="0.01" defaultValue={personalSeleccionado.montoContratado} required />
                  </div>
                  <div>
                    <Label htmlFor="codigoEssalud">Código ESSALUD</Label>
                    <Input id="codigoEssalud" name="codigoEssalud" defaultValue={personalSeleccionado.codigoEssalud} required />
                  </div>
                  <div>
                    <Label htmlFor="afp">AFP</Label>
                    <Select name="afp" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar AFP" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="prima">Prima AFP</SelectItem>
                        <SelectItem value="profuturo">Profuturo AFP</SelectItem>
                        <SelectItem value="integra">Integra AFP</SelectItem>
                        <SelectItem value="habitat">Habitat AFP</SelectItem>
                        <SelectItem value="onp">ONP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="numeroAfp">Número AFP</Label>
                    <Input id="numeroAfp" name="numeroAfp" defaultValue={personalSeleccionado.numeroAfp} required />
                  </div>
                  <div>
                    <Label htmlFor="fechaIngreso">Fecha de Ingreso</Label>
                    <Input id="fechaIngreso" name="fechaIngreso" type="date" defaultValue={personalSeleccionado.fechaIngreso} required />
                  </div>
                  <div>
                    <Label htmlFor="estado">Estado</Label>
                    <Select name="estado" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="activo">Activo</SelectItem>
                        <SelectItem value="inactivo">Inactivo</SelectItem>
                        <SelectItem value="suspendido">Suspendido</SelectItem>
                        <SelectItem value="vacaciones">En Vacaciones</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="direccion">Dirección</Label>
                  <Textarea id="direccion" name="direccion" defaultValue={personalSeleccionado.direccion} required />
                </div>
                <div>
                  <Label htmlFor="observaciones">Observaciones</Label>
                  <Textarea id="observaciones" name="observaciones" defaultValue={personalSeleccionado.observaciones || ''} />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => {
                    setShowEditarPersonal(false);
                    setPersonalSeleccionado(null);
                  }}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Actualizar Personal
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
