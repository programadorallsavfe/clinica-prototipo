'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Sparkles
} from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('todos');
  const [verificationFilter, setVerificationFilter] = useState('todos');
  const [originFilter, setOriginFilter] = useState('todos');
  const [dateRange, setDateRange] = useState('30d');
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [selectedPatients, setSelectedPatients] = useState<number[]>([]);
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);

  // Mock data para demostración
  const kpis = {
    totalPacientes: 1247,
    nuevosHoy: 12,
    conCitaProxima: 45,
    pagosPendientes: 8,
    tiempoPromedioCita: '45 min',
    conTratamientoActivo: 89,
    ingresosMes: 45680,
    satisfaccionPromedio: 4.8
  };

  const pacientes = [
    {
      id: 1,
      nombre: 'María González Pérez',
      documento: '73248573',
      telefono: '+51 987 654 321',
      email: 'maria.gonzalez@email.com',
      edad: 34,
      sexo: 'F',
      estadoCuenta: 'activa',
      verificado: true,
      tieneCuenta: true,
      ultimaCita: '2024-01-15',
      proximaCita: '2024-01-22',
      especialidad: 'Cardiología',
      doctor: 'Dr. Carlos Mendoza',
      saldo: 0,
      deuda: 0,
      ultimoPago: '2024-01-10',
      cotizacionesAbiertas: 0,
      cotizacionesAceptadas: 2,
      ultimaCompra: '2024-01-12',
      tiempoPromedioCita: '42 min',
      origen: 'WhatsApp',
      etiquetas: ['VIP', 'Recurrente'],
      actualizadoPor: 'Recepcionista Ana',
      fechaActualizacion: '2024-01-15'
    },
    {
      id: 2,
      nombre: 'Juan Carlos Rodríguez',
      documento: '87654321',
      telefono: '+51 912 345 678',
      email: 'juan.rodriguez@email.com',
      edad: 28,
      sexo: 'M',
      estadoCuenta: 'activa',
      verificado: false,
      tieneCuenta: false,
      ultimaCita: '2024-01-14',
      proximaCita: '2024-01-25',
      especialidad: 'Dermatología',
      doctor: 'Dra. Laura Silva',
      saldo: 150,
      deuda: 0,
      ultimoPago: '2024-01-14',
      cotizacionesAbiertas: 1,
      cotizacionesAceptadas: 0,
      ultimaCompra: '2024-01-14',
      tiempoPromedioCita: '38 min',
      origen: 'Web',
      etiquetas: ['Nuevo'],
      actualizadoPor: 'Dr. Carlos Mendoza',
      fechaActualizacion: '2024-01-14'
    },
    {
      id: 3,
      nombre: 'Ana Patricia Morales',
      documento: '11223344',
      telefono: '+51 945 123 456',
      email: 'ana.morales@email.com',
      edad: 45,
      sexo: 'F',
      estadoCuenta: 'activa',
      verificado: true,
      tieneCuenta: true,
      ultimaCita: '2024-01-16',
      proximaCita: '2024-01-28',
      especialidad: 'Ginecología',
      doctor: 'Dra. Carmen Vega',
      saldo: 320,
      deuda: 0,
      ultimoPago: '2024-01-16',
      cotizacionesAbiertas: 0,
      cotizacionesAceptadas: 3,
      ultimaCompra: '2024-01-16',
      tiempoPromedioCita: '55 min',
      origen: 'Referido',
      etiquetas: ['VIP', 'Alto Riesgo'],
      actualizadoPor: 'Recepcionista Ana',
      fechaActualizacion: '2024-01-16'
    },
    {
      id: 4,
      nombre: 'Roberto Silva Torres',
      documento: '55667788',
      telefono: '+51 998 765 432',
      email: 'roberto.silva@email.com',
      edad: 52,
      sexo: 'M',
      estadoCuenta: 'inactiva',
      verificado: false,
      tieneCuenta: false,
      ultimaCita: '2023-12-20',
      proximaCita: null,
      especialidad: 'Neurología',
      doctor: 'Dr. Miguel Herrera',
      saldo: 0,
      deuda: 180,
      ultimoPago: '2023-12-20',
      cotizacionesAbiertas: 2,
      cotizacionesAceptadas: 1,
      ultimaCompra: '2023-12-20',
      tiempoPromedioCita: '60 min',
      origen: 'Web',
      etiquetas: ['Deuda'],
      actualizadoPor: 'Dr. Miguel Herrera',
      fechaActualizacion: '2023-12-20'
    }
  ];

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

  // Funciones de manejo de eventos
  const handleNewPatient = () => {
    console.log('Creando nuevo paciente...');
    setShowNewPatientModal(true);
    // Aquí se abriría un modal o se navegaría a una página de creación
  };

  const handleExportCSV = () => {
    console.log('Exportando datos a CSV...');
    const csvData = pacientes.map(p => ({
      nombre: p.nombre,
      documento: p.documento,
      telefono: p.telefono,
      email: p.email,
      estado: p.estadoCuenta,
      verificado: p.verificado ? 'Sí' : 'No',
      saldo: `S/ ${p.saldo}`,
      deuda: `S/ ${p.deuda}`
    }));
    console.log('Datos para CSV:', csvData);
  };

  const handleWhatsAppReminder = () => {
    console.log('Enviando recordatorios por WhatsApp...');
    const pacientesConCita = pacientes.filter(p => p.proximaCita);
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
        setSelectedFilter('todos');
        setVerificationFilter('todos');
        setOriginFilter('todos');
        break;
      case 'open-quote':
        setSelectedFilter('activa');
        setVerificationFilter('todos');
        setOriginFilter('todos');
        break;
      case 'no-show':
        setSelectedFilter('inactiva');
        setVerificationFilter('todos');
        setOriginFilter('todos');
        break;
      case 'vip':
        setSelectedFilter('activa');
        setVerificationFilter('verificado');
        setOriginFilter('todos');
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
    return pacientes.filter(paciente => {
      const matchesSearch = searchTerm === '' || 
        paciente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paciente.documento.includes(searchTerm) ||
        paciente.telefono.includes(searchTerm) ||
        paciente.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = selectedFilter === 'todos' || paciente.estadoCuenta === selectedFilter;
      
      const matchesVerification = verificationFilter === 'todos' || 
        (verificationFilter === 'verificado' && paciente.verificado) ||
        (verificationFilter === 'no-verificado' && !paciente.verificado);

      const matchesOrigin = originFilter === 'todos' || paciente.origen.toLowerCase() === originFilter;

      return matchesSearch && matchesStatus && matchesVerification && matchesOrigin;
    });
  }, [searchTerm, selectedFilter, verificationFilter, originFilter, pacientes]);

  const getEtiquetaBadge = (etiqueta: string) => {
    switch (etiqueta) {
      case 'VIP':
        return <Badge className="bg-purple-500 text-white border-0 shadow-sm">VIP</Badge>;
      case 'Recurrente':
        return <Badge className="bg-blue-500 text-white border-0 shadow-sm">Recurrente</Badge>;
      case 'Nuevo':
        return <Badge className="bg-green-500 text-white border-0 shadow-sm">Nuevo</Badge>;
      case 'Alto Riesgo':
        return <Badge className="bg-orange-500 text-white border-0 shadow-sm">Alto Riesgo</Badge>;
      case 'Deuda':
        return <Badge className="bg-red-500 text-white border-0 shadow-sm">Deuda</Badge>;
      default:
        return <Badge variant="secondary">{etiqueta}</Badge>;
    }
  };

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
                <SelectItem value="7d">Últimos 7 días</SelectItem>
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
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg bg-primary/10">
              <Filter className="w-5 h-5 text-primary" />
            </div>
            Filtros y Búsqueda Avanzada
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Search className="w-4 h-4 text-primary" />
                Búsqueda Global
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Nombre, DNI, teléfono, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 hover:border-primary/50 focus:border-primary transition-colors duration-200"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <UserRoundSearch className="w-4 h-4 text-primary" />
                Estado de Cuenta
              </label>
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="hover:border-primary/50 transition-colors duration-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="activa">Activa</SelectItem>
                  <SelectItem value="inactiva">Inactiva</SelectItem>
                  <SelectItem value="bloqueada">Bloqueada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-primary" />
                Verificación
              </label>
              <Select value={verificationFilter} onValueChange={setVerificationFilter}>
                <SelectTrigger className="hover:border-primary/50 transition-colors duration-200">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="verificado">Verificado</SelectItem>
                  <SelectItem value="no-verificado">No verificado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                Origen
              </label>
              <Select value={originFilter} onValueChange={setOriginFilter}>
                <SelectTrigger className="hover:border-primary/50 transition-colors duration-200">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="web">Web</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="referido">Referido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Segmentos guardados */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Segmentos Guardados
            </label>
            <div className="flex flex-wrap gap-2 lg:gap-3">
              <Badge 
                variant="outline" 
                className={`cursor-pointer hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:scale-105 ${
                  selectedSegment === 'pending-yape' ? 'bg-primary/10 text-primary border-primary' : ''
                }`}
                onClick={() => handleSegmentClick('pending-yape')}
              >
                <Wallet className="w-3 h-3 mr-1" />
                Pendientes validar Yape
              </Badge>
              <Badge 
                variant="outline" 
                className={`cursor-pointer hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:scale-105 ${
                  selectedSegment === 'open-quote' ? 'bg-primary/10 text-primary border-primary' : ''
                }`}
                onClick={() => handleSegmentClick('open-quote')}
              >
                <ReceiptText className="w-3 h-3 mr-1" />
                Con cotización abierta
              </Badge>
              <Badge 
                variant="outline" 
                className={`cursor-pointer hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:scale-105 ${
                  selectedSegment === 'no-show' ? 'bg-primary/10 text-primary border-primary' : ''
                }`}
                onClick={() => handleSegmentClick('no-show')}
              >
                <UserX className="w-3 h-3 mr-1" />
                No muestran en 6+ meses
              </Badge>
              <Badge 
                variant="outline" 
                className={`cursor-pointer hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:scale-105 ${
                  selectedSegment === 'vip' ? 'bg-primary/10 text-primary border-primary' : ''
                }`}
                onClick={() => handleSegmentClick('vip')}
              >
                <Award className="w-3 h-3 mr-1" />
                Pacientes VIP
              </Badge>
            </div>
          </div>
        </CardContent>
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
          <div className="space-y-4">
            {filteredPacientes.map((paciente) => (
              <div 
                key={paciente.id} 
                className={`border border-border rounded-xl p-4 lg:p-6 hover:bg-muted/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.01] ${
                  selectedPatients.includes(paciente.id) ? 'ring-2 ring-primary/50 bg-primary/5' : ''
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start lg:items-center">
                  {/* Información del Paciente */}
                  <div className="lg:col-span-3">
                    <div className="flex items-center gap-3 lg:gap-4">
                      <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                          <UsersIcon className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
                        </div>
                        {paciente.verificado && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 lg:w-4 lg:h-4 bg-success rounded-full border-2 border-background flex items-center justify-center">
                            <CheckCircle className="w-2 h-2 lg:w-2.5 lg:h-2.5 text-success-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-foreground text-base lg:text-lg truncate">{paciente.nombre}</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:gap-3 mt-1 lg:mt-2">
                          {getVerificacionBadge(paciente.verificado)}
                          <span className="text-xs lg:text-sm text-muted-foreground flex items-center gap-1">
                            <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-muted-foreground rounded-full"></span>
                            {paciente.edad} años, {paciente.sexo === 'M' ? 'Masculino' : 'Femenino'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Documento y Contacto */}
                  <div className="lg:col-span-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 lg:gap-3 text-xs lg:text-sm">
                        <div className="p-1 lg:p-1.5 rounded-lg bg-muted/50 flex-shrink-0">
                          <DniIcon className="w-3 h-3 lg:w-4 lg:h-4 text-muted-foreground" />
                        </div>
                        <span className="text-foreground font-medium truncate">{paciente.documento}</span>
                      </div>
                      <div className="flex items-center gap-2 lg:gap-3 text-xs lg:text-sm">
                        <div className="p-1 lg:p-1.5 rounded-lg bg-muted/50 flex-shrink-0">
                          <WhatsAppIcon className="w-3 h-3 lg:w-4 lg:h-4 text-muted-foreground" />
                        </div>
                        <span className="text-foreground font-medium truncate">{paciente.telefono}</span>
                      </div>
                      <div className="flex items-center gap-2 lg:gap-3 text-xs lg:text-sm">
                        <div className="p-1 lg:p-1.5 rounded-lg bg-muted/50 flex-shrink-0">
                          <GmailIcon className="w-3 h-3 lg:w-4 lg:h-4 text-muted-foreground" />
                        </div>
                        <span className="text-foreground font-medium truncate">{paciente.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Estado y Cuenta */}
                  <div className="lg:col-span-2">
                    <div className="space-y-2 lg:space-y-3">
                      <div className="flex items-center gap-2 lg:gap-3">
                        <div className="p-1.5 lg:p-2 rounded-lg bg-primary/10 flex-shrink-0">
                          <ShieldIcon className="w-3 h-3 lg:w-4 lg:h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="mb-1 lg:mb-2">
                            {getEstadoBadge(paciente.estadoCuenta)}
                          </div>
                          <div className="text-xs lg:text-sm">
                            <span className="text-muted-foreground">Cuenta: </span>
                            <span className={`font-medium ${paciente.tieneCuenta ? "text-success" : "text-muted-foreground"}`}>
                              {paciente.tieneCuenta ? "Sí" : "No"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Citas */}
                  <div className="lg:col-span-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1 lg:p-1.5 rounded-lg bg-info/10 flex-shrink-0">
                          <CalendarIcon className="w-3 h-3 lg:w-4 lg:h-4 text-info" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs lg:text-sm">
                            <span className="text-muted-foreground">Última: </span>
                            <span className="text-foreground font-medium">{paciente.ultimaCita}</span>
                          </div>
                          <div className="text-xs lg:text-sm">
                            <span className="text-muted-foreground">Próxima: </span>
                            <span className="text-foreground font-medium">
                              {paciente.proximaCita || 'Sin cita programada'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground pl-4 lg:pl-6 truncate">
                        {paciente.especialidad} - {paciente.doctor}
                      </div>
                    </div>
                  </div>

                  {/* Pagos y Compras */}
                  <div className="lg:col-span-2">
                    <div className="space-y-2 lg:space-y-3">
                        <div className="flex items-center gap-2 lg:gap-3">
                          <div className="p-1.5 lg:p-2 rounded-lg bg-success/10 flex-shrink-0">
                          </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 lg:gap-2">
                            <span className={`font-bold text-base lg:text-lg ${paciente.saldo > 0 ? "text-success" : "text-foreground"}`}>
                              S/ {paciente.saldo.toLocaleString()}
                            </span>
                            {paciente.deuda > 0 && (
                              <span className="text-destructive font-medium text-xs lg:text-sm">
                                (Deuda: S/ {paciente.deuda.toLocaleString()})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2 pl-4 lg:pl-6">
                        <Calendar className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">Último pago: {paciente.ultimoPago}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs pl-4 lg:pl-6">
                        <div className="p-1 rounded bg-info/10 flex-shrink-0">
                          <Package className="w-3 h-3 text-info" />
                        </div>
                        <span className="text-foreground truncate">Última compra: {paciente.ultimaCompra}</span>
                      </div>
                    </div>
                  </div>

                  {/* Etiquetas y Acciones */}
                  <div className="lg:col-span-1">
                    <div className="space-y-3 lg:space-y-4">
                      <div className="flex flex-wrap gap-1 lg:gap-2">
                        {paciente.etiquetas.map((etiqueta, index) => (
                          <div key={index}>
                            {getEtiquetaBadge(etiqueta)}
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-center lg:justify-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewPatient(paciente.id)}
                          className="hover:bg-primary/10 hover:text-primary transition-colors duration-200 p-1.5 lg:p-2"
                          title="Ver detalles"
                        >
                          <Eye className="w-3 h-3 lg:w-4 lg:h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditPatient(paciente.id)}
                          className="hover:bg-primary/10 hover:text-primary transition-colors duration-200 p-1.5 lg:p-2"
                          title="Editar paciente"
                        >
                          <Edit className="w-3 h-3 lg:w-4 lg:h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleMoreActions(paciente.id)}
                          className="hover:bg-primary/10 hover:text-primary transition-colors duration-200 p-1.5 lg:p-2"
                          title="Más acciones"
                        >
                          <MoreHorizontal className="w-3 h-3 lg:w-4 lg:h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}