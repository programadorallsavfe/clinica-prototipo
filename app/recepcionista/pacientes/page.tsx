'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Users, 
  UserPlus, 
  Clock, 

  Calendar, 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal,
  Phone,
  Mail,
  MapPin,
  FileText,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  MessageSquare,
  CreditCard,
  Package,
  History,
  Shield,
  Star,
  TrendingUp,
  UserCheck,
  UserX,
  Bell,
  Plus,
  Wallet,
  ReceiptText,
  UserRoundSearch,
  Globe,
  CalendarDays,
  ClipboardList,
  ArrowUpRight,
  Heart,
  Zap,
  Target,
  Award,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { AddPacientesModal } from '@/components/modals/add-pacientes-modal';
import { pacientesData, getKPIs } from '@/lib/mockData';

// Componentes SVG profesionales
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 256 259" fill="currentColor">
    <path d="m67.663 221.823 4.185 2.093c17.44 10.463 36.971 15.346 56.503 15.346 61.385 0 111.609-50.224 111.609-111.609 0-29.297-11.859-57.897-32.785-78.824-20.927-20.927-48.83-32.785-78.824-32.785-61.385 0-111.61 50.224-110.912 112.307 0 20.926 6.278 41.156 16.741 58.594l2.79 4.186-11.16 41.156 41.853-10.464Z" fill="#00E676"/>
    <path d="M219.033 37.668C195.316 13.254 162.531 0 129.048 0 57.898 0 .698 57.897 1.395 128.35c0 22.322 6.278 43.947 16.742 63.478L0 258.096l67.663-17.439c18.834 10.464 39.76 15.347 60.688 15.347 70.453 0 127.653-57.898 127.653-128.35 0-34.181-13.254-66.269-36.97-89.986ZM129.048 234.38c-18.834 0-37.668-4.882-53.712-14.648l-4.185-2.093-40.458 10.463 10.463-39.76-2.79-4.186C7.673 134.63 22.322 69.058 72.546 38.365c50.224-30.692 115.097-16.043 145.79 34.181 30.692 50.224 16.043 115.097-34.18 145.79-16.045 10.463-35.576 16.043-55.108 16.043Zm61.385-77.428-7.673-3.488s-11.16-4.883-18.136-8.371c-.698 0-1.395-.698-2.093-.698-2.093 0-3.488.698-4.883 1.396 0 0-.697.697-10.463 11.858-.698 1.395-2.093 2.093-3.488 2.093h-.698c-.697 0-2.092-.698-2.79-1.395l-3.488-1.395c-7.673-3.488-14.648-7.674-20.229-13.254-1.395-1.395-3.488-2.79-4.883-4.185-4.883-4.883-9.766-10.464-13.253-16.742l-.698-1.395c-.697-.698-.697-1.395-1.395-2.79 0-1.395 0-2.79.698-3.488 0 0 2.79-3.488 4.882-5.58 1.396-1.396 2.093-3.488 3.488-4.883 1.395-2.093 2.093-4.883 1.395-6.976-.697-3.488-9.068-22.322-11.16-26.507-1.396-2.093-2.79-2.79-4.883-3.488H83.01c-1.396 0-2.79.698-4.186.698l-.698.697c-1.395.698-2.79 2.093-4.185 2.79-1.395 1.396-2.093 2.79-3.488 4.186-4.883 6.278-7.673 13.951-7.673 21.624 0 5.58 1.395 11.161 3.488 16.044l.698 2.093c6.278 13.253 14.648 25.112 25.81 35.575l2.79 2.79c2.092 2.093 4.185 3.488 5.58 5.58 14.649 12.557 31.39 21.625 50.224 26.508 2.093.697 4.883.697 6.976 1.395h6.975c3.488 0 7.673-1.395 10.464-2.79 2.092-1.395 3.487-1.395 4.882-2.79l1.396-1.396c1.395-1.395 2.79-2.092 4.185-3.487 1.395-1.395 2.79-2.79 3.488-4.186 1.395-2.79 2.092-6.278 2.79-9.765v-4.883s-.698-.698-2.093-1.395Z" fill="#FFF"/>
  </svg>
);

const GmailIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 49.4 512 399.42" fill="currentColor">
    <g fill="none" fillRule="evenodd">
      <g fillRule="nonzero">
        <path fill="#4285f4" d="M34.91 448.818h81.454V251L0 163.727V413.91c0 19.287 15.622 34.91 34.91 34.91z"/>
        <path fill="#34a853" d="M395.636 448.818h81.455c19.287 0 34.909-15.622 34.909-34.909V163.727L395.636 251z"/>
        <path fill="#fbbc04" d="M395.636 99.727V251L512 163.727v-46.545c0-43.142-49.25-67.782-83.782-41.891z"/>
      </g>
      <path fill="#ea4335" d="M116.364 251V99.727L256 204.455 395.636 99.727V251L256 355.727z"/>
      <path fill="#c5221f" fillRule="nonzero" d="M0 117.182v46.545L116.364 251V99.727L83.782 75.291C49.25 49.4 0 74.04 0 117.18z"/>
    </g>
  </svg>
);

const DniIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2v12h16V6H4zm2 2h8v2H6V8zm0 4h8v2H6v-2zm0 4h5v2H6v-2z"/>
  </svg>
);


const UsersIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01.99L14 10.5c-.47-.62-1.21-.99-2.01-.99H9.46c-.8 0-1.54.37-2.01.99L6 10.5c-.47-.62-1.21-.99-2.01-.99H2.46c-.8 0-1.54.37-2.01.99L0 10.5v9.5h2v6h2v-6h2v6h2v-6h2v6h2v-6h2v6h2v-6h2v6h2z"/>
  </svg>
);

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
  </svg>
);

const ShieldIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C15.4,11.5 16,12.4 16,13V16C16,16.6 15.6,17 15,17H9C8.4,17 8,16.6 8,16V13C8,12.4 8.4,11.5 9,11.5V10C9,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.2,9.2 10.2,10V11.5H13.8V10C13.8,9.2 12.8,8.2 12,8.2Z"/>
  </svg>
);

export default function UsuariosPage() {
  // Estados para filtros y funcionalidad
  const [filtros, setFiltros] = useState({
    busqueda: '',
    estado: 'todos',
    verificacion: 'todos',
    origen: 'todos',
    fechaDesde: '',
    fechaHasta: '',
    especialidad: 'todos',
    consultorio: 'todos'
  });
  const [dateRange, setDateRange] = useState('30d');
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [selectedPatients, setSelectedPatients] = useState<number[]>([]);
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);

  // KPIs calculados desde datos centralizados
  const kpis = getKPIs();

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'activa':
        return <Badge variant="default" className="bg-success text-success-foreground">Activa</Badge>;
      case 'inactiva':
        return <Badge variant="secondary">Inactiva</Badge>;
      case 'bloqueada':
        return <Badge variant="destructive">Bloqueada</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  const getVerificacionBadge = (verificado: boolean) => {
    return verificado ? 
      <Badge variant="default" className="bg-success text-success-foreground">
        <CheckCircle className="w-3 h-3 mr-1" />
        Verificado
      </Badge> :
      <Badge variant="outline">
        <XCircle className="w-3 h-3 mr-1" />
        No verificado
      </Badge>;
  };

  // Funciones de manejo de filtros
  const handleFiltroChange = (campo: string, valor: string) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const limpiarFiltros = () => {
    setFiltros({
      busqueda: '',
      estado: 'todos',
      verificacion: 'todos',
      origen: 'todos',
      fechaDesde: '',
      fechaHasta: '',
      especialidad: 'todos',
      consultorio: 'todos'
    });
  };

  // Funciones de manejo de eventos
  const handleNewPatient = () => {
    console.log('Creando nuevo paciente...');
    setShowNewPatientModal(true);
  };

  const handlePatientCreated = () => {
    // Recargar datos o actualizar la lista de pacientes
    console.log('Paciente creado exitosamente');
    // Aquí podrías recargar los datos si fuera necesario
  };

  const handleExportCSV = () => {
    console.log('Exportando datos a CSV...');
    const csvData = pacientesData.map(p => ({
      id: p.id,
      nombre: p.nombre,
      apellidos: p.apellidos,
      documento: p.documento,
      telefono: p.telefono,
      email: p.email,
      atenciones: p.atenciones,
      deuda: p.deuda,
      estado: p.estadoCuenta,
      verificado: p.verificado ? 'Sí' : 'No'
    }));
    console.log('Datos para CSV:', csvData);
  };

  const handleWhatsAppReminder = () => {
    console.log('Enviando recordatorios por WhatsApp...');
    const pacientesConCita = pacientesData.filter(p => p.proximaCita);
    console.log('Pacientes con cita próxima:', pacientesConCita.length);
  };

  const handleViewPatient = (patientId: number) => {
    console.log(`Viendo detalles del paciente ${patientId}`);
    // Aquí se abriría un drawer o modal con los detalles del paciente
  };

  const handleEditPatient = (patientId: number) => {
    console.log(`Editando paciente ${patientId}`);
    // Aquí se abriría un modal de edición o se navegaría a la página de edición
  };

  const handleMoreActions = (patientId: number) => {
    console.log(`Más acciones para paciente ${patientId}`);
    // Aquí se mostraría un dropdown con más opciones
  };

  const handleSegmentClick = (segment: string) => {
    console.log(`Aplicando segmento: ${segment}`);
    setSelectedSegment(selectedSegment === segment ? null : segment);
    
    // Aplicar filtros según el segmento
    switch (segment) {
      case 'pending-yape':
        setFiltros(prev => ({
          ...prev,
          estado: 'todos',
          verificacion: 'todos',
          origen: 'todos'
        }));
        break;
      case 'open-quote':
        setFiltros(prev => ({
          ...prev,
          estado: 'activa',
          verificacion: 'todos',
          origen: 'todos'
        }));
        break;
      case 'no-show':
        setFiltros(prev => ({
          ...prev,
          estado: 'inactiva',
          verificacion: 'todos',
          origen: 'todos'
        }));
        break;
      case 'vip':
        setFiltros(prev => ({
          ...prev,
          estado: 'activa',
          verificacion: 'verificado',
          origen: 'todos'
        }));
        break;
    }
  };

  const handlePatientSelect = (patientId: number) => {
    setSelectedPatients(prev => 
      prev.includes(patientId) 
        ? prev.filter(id => id !== patientId)
        : [...prev, patientId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPatients.length === filteredPacientes.length) {
      setSelectedPatients([]);
    } else {
      setSelectedPatients(filteredPacientes.map(p => p.id));
    }
  };

  // Filtrado de pacientes
  const filteredPacientes = useMemo(() => {
    return pacientesData.filter(paciente => {
      const coincideBusqueda = !filtros.busqueda || 
        paciente.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
        paciente.apellidos.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
        paciente.documento.includes(filtros.busqueda) ||
        paciente.telefono.includes(filtros.busqueda) ||
        paciente.email.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
        paciente.id.toString().includes(filtros.busqueda);

      const coincideEstado = filtros.estado === 'todos' || paciente.estadoCuenta === filtros.estado;
      
      const coincideVerificacion = filtros.verificacion === 'todos' || 
        (filtros.verificacion === 'verificado' && paciente.verificado) ||
        (filtros.verificacion === 'no-verificado' && !paciente.verificado);

      const coincideOrigen = filtros.origen === 'todos' || paciente.origen.toLowerCase() === filtros.origen;

      const coincideEspecialidad = filtros.especialidad === 'todos' || paciente.especialidad === filtros.especialidad;

      const coincideConsultorio = filtros.consultorio === 'todos' || paciente.consultorio === filtros.consultorio;

      const coincideFecha = !filtros.fechaDesde || !filtros.fechaHasta || 
        (paciente.ultimaCita >= filtros.fechaDesde && paciente.ultimaCita <= filtros.fechaHasta);

      return coincideBusqueda && coincideEstado && coincideVerificacion && coincideOrigen && 
             coincideEspecialidad && coincideConsultorio && coincideFecha;
    });
  }, [pacientesData, filtros]);


        return (
    <div className="space-y-8 p-6 bg-background min-h-screen">
      {/* Header con KPIs */}
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-primary">
              Gestión de Pacientes
            </h1>
            <p className="text-muted-foreground text-base lg:text-lg">
              Control operativo y analítica de pacientes
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-full sm:w-40 hover:border-primary/50 transition-colors duration-200">
                <CalendarDays className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Ultima semana </SelectItem>
                <SelectItem value="30d">Últimos 30 días</SelectItem>
                <SelectItem value="90d">Últimos 90 días</SelectItem>
                <SelectItem value="1y">Último año</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={handleNewPatient}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 w-full sm:w-auto"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Nuevo Paciente</span>
              <span className="sm:hidden">Nuevo</span>
            </Button>
          </div>
        </div>

        {/* KPIs Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-6">
          <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.03] border-border/50 bg-background">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Pacientes</CardTitle>
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-200">
                <UsersIcon className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{kpis.totalPacientes.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Plus className="h-3 w-3 text-success" />
                +{kpis.nuevosHoy} nuevos hoy
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Citas Próximas</CardTitle>
              <CalendarIcon className="h-4 w-4 text-info" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{kpis.conCitaProxima}</div>
              <p className="text-xs text-muted-foreground">24-48 horas</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pagos Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{kpis.pagosPendientes}</div>
              <p className="text-xs text-muted-foreground">Validar Yape</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tiempo Promedio</CardTitle>
              <Clock className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{kpis.tiempoPromedioCita}</div>
              <p className="text-xs text-muted-foreground">Por cita</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tratamiento Activo</CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{kpis.conTratamientoActivo}</div>
              <p className="text-xs text-muted-foreground">Pacientes</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tendencia</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">+12%</div>
              <p className="text-xs text-muted-foreground">vs mes anterior</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <Card className="shadow-xl border-border/50 bg-background">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros Avanzados
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Filtra y busca información específica del sistema
              </CardDescription>
            </div>
            {/* Indicador de filtros activos */}
            {Object.values(filtros).some(valor => valor !== '' && valor !== 'todos') && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  Filtros activos
                </Badge>
                <Button 
                  onClick={limpiarFiltros} 
                  variant="ghost" 
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Limpiar
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Búsqueda general */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Búsqueda</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, email..."
                  value={filtros.busqueda}
                  onChange={(e) => handleFiltroChange('busqueda', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filtro por estado */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Estado</label>
              <Select value={filtros.estado} onValueChange={(value) => handleFiltroChange('estado', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar estado">
                    {filtros.estado === 'todos' ? 'Todos los estados' :
                     filtros.estado === 'activa' ? 'Activa' :
                     filtros.estado === 'inactiva' ? 'Inactiva' :
                     filtros.estado === 'bloqueada' ? 'Bloqueada' :
                     'Seleccionar estado'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="activa">Activa</SelectItem>
                  <SelectItem value="inactiva">Inactiva</SelectItem>
                  <SelectItem value="bloqueada">Bloqueada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por verificación */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Verificación</label>
              <Select value={filtros.verificacion} onValueChange={(value) => handleFiltroChange('verificacion', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar verificación">
                    {filtros.verificacion === 'todos' ? 'Todos' :
                     filtros.verificacion === 'verificado' ? 'Verificado' :
                     filtros.verificacion === 'no-verificado' ? 'No verificado' :
                     'Seleccionar verificación'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="verificado">Verificado</SelectItem>
                  <SelectItem value="no-verificado">No verificado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por origen */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Origen</label>
              <Select value={filtros.origen} onValueChange={(value) => handleFiltroChange('origen', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar origen">
                    {filtros.origen === 'todos' ? 'Todos los orígenes' :
                     filtros.origen === 'web' ? 'Web' :
                     filtros.origen === 'whatsapp' ? 'WhatsApp' :
                     filtros.origen === 'referido' ? 'Referido' :
                     'Seleccionar origen'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los orígenes</SelectItem>
                  <SelectItem value="web">Web</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="referido">Referido</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por especialidad */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Especialidad</label>
              <Select value={filtros.especialidad} onValueChange={(value) => handleFiltroChange('especialidad', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar especialidad">
                    {filtros.especialidad === 'todos' ? 'Todas las especialidades' :
                     filtros.especialidad === 'Cardiología' ? 'Cardiología' :
                     filtros.especialidad === 'Dermatología' ? 'Dermatología' :
                     filtros.especialidad === 'Ginecología' ? 'Ginecología' :
                     filtros.especialidad === 'Neurología' ? 'Neurología' :
                     'Seleccionar especialidad'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas las especialidades</SelectItem>
                  <SelectItem value="Cardiología">Cardiología</SelectItem>
                  <SelectItem value="Dermatología">Dermatología</SelectItem>
                  <SelectItem value="Ginecología">Ginecología</SelectItem>
                  <SelectItem value="Neurología">Neurología</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por consultorio */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Consultorio</label>
              <Select value={filtros.consultorio} onValueChange={(value) => handleFiltroChange('consultorio', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar consultorio">
                    {filtros.consultorio === 'todos' ? 'Todos los consultorios' :
                     filtros.consultorio === 'A-101' ? 'A-101' :
                     filtros.consultorio === 'A-102' ? 'A-102' :
                     filtros.consultorio === 'B-201' ? 'B-201' :
                     filtros.consultorio === 'B-202' ? 'B-202' :
                     'Seleccionar consultorio'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los consultorios</SelectItem>
                  <SelectItem value="A-101">A-101</SelectItem>
                  <SelectItem value="A-102">A-102</SelectItem>
                  <SelectItem value="B-201">B-201</SelectItem>
                  <SelectItem value="B-202">B-202</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por fecha desde */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Fecha Desde</label>
              <Input
                type="date"
                value={filtros.fechaDesde}
                onChange={(e) => handleFiltroChange('fechaDesde', e.target.value)}
              />
            </div>

            {/* Filtro por fecha hasta */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Fecha Hasta</label>
              <Input
                type="date"
                value={filtros.fechaHasta}
                onChange={(e) => handleFiltroChange('fechaHasta', e.target.value)}
              />
            </div>

            {/* Botones de acción */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground opacity-0">Acciones</label>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        
        {/* Filtros activos */}
        {Object.values(filtros).some(valor => valor !== '' && valor !== 'todos') && (
          <div className="px-6 pb-4">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-muted-foreground">Filtros aplicados:</span>
              {filtros.busqueda && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Búsqueda: &quot;{filtros.busqueda}&quot;
                </Badge>
              )}
              {filtros.estado !== 'todos' && (
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Estado: {filtros.estado}
                </Badge>
              )}
              {filtros.verificacion !== 'todos' && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  Verificación: {filtros.verificacion === 'verificado' ? 'Verificado' : 'No verificado'}
                </Badge>
              )}
              {filtros.origen !== 'todos' && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  Origen: {filtros.origen}
                </Badge>
              )}
              {filtros.especialidad !== 'todos' && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                  Especialidad: {filtros.especialidad}
                </Badge>
              )}
              {filtros.consultorio !== 'todos' && (
                <Badge variant="secondary" className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200">
                  Consultorio: {filtros.consultorio}
                </Badge>
              )}
              {filtros.fechaDesde && (
                <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                  Desde: {filtros.fechaDesde}
                </Badge>
              )}
              {filtros.fechaHasta && (
                <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                  Hasta: {filtros.fechaHasta}
                </Badge>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Tabla de Pacientes */}
      <Card className="shadow-xl border-border/50 bg-background">
        <CardHeader className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-lg lg:text-xl flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <UsersIcon className="w-5 h-5 text-primary" />
              </div>
              Lista de Pacientes
            </CardTitle>
            <CardDescription className="text-sm lg:text-base">
              {filteredPacientes.length} pacientes encontrados
              {selectedPatients.length > 0 && (
                <span className="ml-2 text-primary font-medium">
                  ({selectedPatients.length} seleccionados)
                </span>
              )}
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 lg:gap-3">
            {selectedPatients.length > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSelectAll}
                className="hover:bg-primary/10 hover:text-primary transition-colors duration-200 w-full sm:w-auto"
              >
                <span className="hidden sm:inline">
                  {selectedPatients.length === filteredPacientes.length ? 'Deseleccionar' : 'Seleccionar'} Todos
                </span>
                <span className="sm:hidden">
                  {selectedPatients.length === filteredPacientes.length ? 'Deseleccionar' : 'Seleccionar'}
                </span>
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExportCSV}
              className="hover:bg-primary/10 hover:text-primary transition-colors duration-200 w-full sm:w-auto"
            >
              <Download className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Exportar CSV</span>
              <span className="sm:hidden">CSV</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleWhatsAppReminder}
              className="hover:bg-primary/10 hover:text-primary transition-colors duration-200 w-full sm:w-auto"
            >
              <Bell className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Recordatorio WhatsApp</span>
              <span className="sm:hidden">WhatsApp</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead className="w-[200px]">Nombre</TableHead>
                  <TableHead className="w-[200px]">Apellidos</TableHead>
                  <TableHead className="w-[100px]">Atenciones</TableHead>
                  <TableHead className="w-[120px]">Deudan</TableHead>
                  <TableHead className="w-[250px]">Contacto</TableHead>
                  <TableHead className="w-[100px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPacientes.map((paciente) => (
                  <TableRow 
                    key={paciente.id}
                    className={`hover:bg-muted/50 transition-colors duration-200 ${
                      selectedPatients.includes(paciente.id) ? 'bg-primary/5' : ''
                    }`}
                  >
                    <TableCell className="font-medium">
                      {paciente.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <UsersIcon className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-medium">{paciente.nombre}</span>
                        {paciente.verificado && (
                          <CheckCircle className="w-4 h-4 text-success" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-foreground">{paciente.apellidos}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {paciente.atenciones}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`font-medium ${
                        paciente.deuda === 'No tiene' 
                          ? 'text-success' 
                          : 'text-destructive'
                      }`}>
                        {paciente.deuda}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <DniIcon className="w-3 h-3 text-muted-foreground" />
                          <span className="text-foreground">{paciente.documento}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <WhatsAppIcon className="w-3 h-3 text-muted-foreground" />
                          <span className="text-foreground">{paciente.telefono}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <GmailIcon className="w-3 h-3 text-muted-foreground" />
                          <span className="text-foreground truncate">{paciente.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewPatient(paciente.id)}
                          className="hover:bg-primary/10 hover:text-primary transition-colors duration-200 p-1"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditPatient(paciente.id)}
                          className="hover:bg-primary/10 hover:text-primary transition-colors duration-200 p-1"
                          title="Editar paciente"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleMoreActions(paciente.id)}
                          className="hover:bg-primary/10 hover:text-primary transition-colors duration-200 p-1"
                          title="Más acciones"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AddPacientesModal
        isOpen={showNewPatientModal}
        onClose={() => setShowNewPatientModal(false)}
        onSuccess={handlePatientCreated}
      />
    </div>
  );
}