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
  Calendar as CalendarIcon,
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
      documento: '12345678',
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
                <Users className="h-5 w-5 text-primary" />
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
              <Calendar className="h-4 w-4 text-info" />
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
                <Users className="w-5 h-5 text-primary" />
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
                          <Users className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
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
                          <FileText className="w-3 h-3 lg:w-4 lg:h-4 text-muted-foreground" />
                        </div>
                        <span className="text-foreground font-medium truncate">{paciente.documento}</span>
                      </div>
                      <div className="flex items-center gap-2 lg:gap-3 text-xs lg:text-sm">
                        <div className="p-1 lg:p-1.5 rounded-lg bg-muted/50 flex-shrink-0">
                          <Phone className="w-3 h-3 lg:w-4 lg:h-4 text-muted-foreground" />
                        </div>
                        <span className="text-foreground font-medium truncate">{paciente.telefono}</span>
                      </div>
                      <div className="flex items-center gap-2 lg:gap-3 text-xs lg:text-sm">
                        <div className="p-1 lg:p-1.5 rounded-lg bg-muted/50 flex-shrink-0">
                          <Mail className="w-3 h-3 lg:w-4 lg:h-4 text-muted-foreground" />
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
                          <Shield className="w-3 h-3 lg:w-4 lg:h-4 text-primary" />
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
                          <Calendar className="w-3 h-3 lg:w-4 lg:h-4 text-info" />
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