'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Calculator, 
  CreditCard, 
  FileText, 
  Download,
  Plus,
  Filter,
  Search,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Settings
} from 'lucide-react';
import { Colaborador, Comision, ReporteComisiones } from '@/lib/types';
import { ReportesColaboradoresCard } from '@/components/reportes-colaboradores-card';
import { CalculadoraComisiones } from '@/components/calculadora-comisiones';
import { SistemaPagosSimulator } from '@/components/sistema-pagos-simulator';

// Mock data para colaboradores
const mockColaboradores: Colaborador[] = [
  {
    id: '1',
    nombre: 'María',
    apellidos: 'González',
    documento: '12345678',
    telefono: '999888777',
    email: 'maria.gonzalez@clinica.com',
    tipo: 'medico',
    especialidad: 'Ginecología',
    porcentajeComision: 15,
    activo: true,
    fechaRegistro: '2023-01-15',
    fechaUltimaComision: '2024-01-20',
    totalComisionesPagadas: 15000,
    totalComisionesPendientes: 2500
  },
  {
    id: '2',
    nombre: 'Ana',
    apellidos: 'Rodríguez',
    documento: '87654321',
    telefono: '999777666',
    email: 'ana.rodriguez@clinica.com',
    tipo: 'referidor',
    porcentajeComision: 10,
    activo: true,
    fechaRegistro: '2023-03-10',
    fechaUltimaComision: '2024-01-18',
    totalComisionesPagadas: 8500,
    totalComisionesPendientes: 1200
  },
  {
    id: '3',
    nombre: 'Carlos',
    apellidos: 'Mendoza',
    documento: '11223344',
    telefono: '999666555',
    email: 'carlos.mendoza@clinica.com',
    tipo: 'medico',
    especialidad: 'Obstetricia',
    porcentajeComision: 20,
    activo: true,
    fechaRegistro: '2023-02-20',
    fechaUltimaComision: '2024-01-22',
    totalComisionesPagadas: 22000,
    totalComisionesPendientes: 3800
  },
  {
    id: '4',
    nombre: 'Patricia',
    apellidos: 'Vargas',
    documento: '55667788',
    telefono: '999555444',
    email: 'patricia.vargas@clinica.com',
    tipo: 'colaborador_externo',
    porcentajeComision: 8,
    activo: false,
    fechaRegistro: '2023-05-15',
    fechaUltimaComision: '2023-12-15',
    totalComisionesPagadas: 3200,
    totalComisionesPendientes: 0
  }
];

// Mock data para comisiones
const mockComisiones: Comision[] = [
  {
    id: '1',
    colaboradorId: '1',
    pacienteId: '1',
    citaId: '1',
    servicioId: '1',
    tipoServicio: 'Consulta Ginecológica',
    montoServicio: 150,
    porcentajeComision: 15,
    montoComision: 22.50,
    estado: 'pendiente',
    fechaServicio: '2024-01-20',
    fechaCalculo: '2024-01-21',
    observaciones: 'Primera consulta'
  },
  {
    id: '2',
    colaboradorId: '2',
    pacienteId: '2',
    citaId: '2',
    servicioId: '2',
    tipoServicio: 'Control Prenatal',
    montoServicio: 120,
    porcentajeComision: 10,
    montoComision: 12.00,
    estado: 'calculada',
    fechaServicio: '2024-01-18',
    fechaCalculo: '2024-01-19',
    observaciones: 'Control de seguimiento'
  },
  {
    id: '3',
    colaboradorId: '3',
    pacienteId: '3',
    citaId: '3',
    servicioId: '3',
    tipoServicio: 'Ecografía Obstétrica',
    montoServicio: 200,
    porcentajeComision: 20,
    montoComision: 40.00,
    estado: 'pagada',
    fechaServicio: '2024-01-15',
    fechaCalculo: '2024-01-16',
    fechaPago: '2024-01-17',
    observaciones: 'Ecografía de segundo trimestre'
  },
  {
    id: '4',
    colaboradorId: '1',
    pacienteId: '4',
    citaId: '4',
    servicioId: '4',
    tipoServicio: 'Laboratorio',
    montoServicio: 80,
    porcentajeComision: 15,
    montoComision: 12.00,
    estado: 'pendiente',
    fechaServicio: '2024-01-22',
    fechaCalculo: '2024-01-23',
    observaciones: 'Perfil hormonal'
  }
];

// Mock data para reportes
const mockReportes: ReporteComisiones[] = [
  {
    colaboradorId: '1',
    nombreColaborador: 'María González',
    periodo: 'enero-2024',
    totalServicios: 25,
    totalMontoServicios: 3750,
    totalComisiones: 562.50,
    comisionesPagadas: 337.50,
    comisionesPendientes: 225.00,
    detalleComisiones: mockComisiones.filter(c => c.colaboradorId === '1')
  },
  {
    colaboradorId: '2',
    nombreColaborador: 'Ana Rodríguez',
    periodo: 'enero-2024',
    totalServicios: 18,
    totalMontoServicios: 2160,
    totalComisiones: 216.00,
    comisionesPagadas: 96.00,
    comisionesPendientes: 120.00,
    detalleComisiones: mockComisiones.filter(c => c.colaboradorId === '2')
  }
];

export default function ColaboradoresPage() {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>(mockColaboradores);
  const [comisiones, setComisiones] = useState<Comision[]>(mockComisiones);
  const [reportes, setReportes] = useState<ReporteComisiones[]>(mockReportes);
  const [filtros, setFiltros] = useState({
    busqueda: '',
    tipo: 'todos',
    estado: 'todos'
  });

  // Filtrar colaboradores
  const colaboradoresFiltrados = colaboradores.filter(colaborador => {
    const coincideBusqueda = !filtros.busqueda || 
      colaborador.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      colaborador.apellidos.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      colaborador.email.toLowerCase().includes(filtros.busqueda.toLowerCase());
    
    const coincideTipo = filtros.tipo === 'todos' || colaborador.tipo === filtros.tipo;
    const coincideEstado = filtros.estado === 'todos' || 
      (filtros.estado === 'activo' && colaborador.activo) ||
      (filtros.estado === 'inactivo' && !colaborador.activo);

    return coincideBusqueda && coincideTipo && coincideEstado;
  });

  // Estadísticas generales
  const estadisticas = {
    totalColaboradores: colaboradores.length,
    colaboradoresActivos: colaboradores.filter(c => c.activo).length,
    totalComisionesPendientes: comisiones.filter(c => c.estado === 'pendiente').length,
    totalMontoPendiente: comisiones
      .filter(c => c.estado === 'pendiente')
      .reduce((sum, c) => sum + c.montoComision, 0),
    totalComisionesPagadas: comisiones
      .filter(c => c.estado === 'pagada')
      .reduce((sum, c) => sum + c.montoComision, 0)
  };

  const handleVerDetalleColaborador = (colaboradorId: string) => {
    console.log('Ver detalles del colaborador:', colaboradorId);
  };

  const handleCalcularComisiones = (colaboradorId: string, periodo: string) => {
    console.log('Calcular comisiones para:', colaboradorId, periodo);
    // Simular cálculo de comisiones
    const nuevasComisiones: Comision[] = [
      {
        id: `calc_${Date.now()}`,
        colaboradorId,
        pacienteId: '1',
        citaId: '1',
        servicioId: '1',
        tipoServicio: 'Consulta Médica',
        montoServicio: 150,
        porcentajeComision: 15,
        montoComision: 22.50,
        estado: 'calculada',
        fechaServicio: '2024-01-20',
        fechaCalculo: new Date().toISOString(),
        observaciones: 'Calculado automáticamente'
      }
    ];
    setComisiones(prev => [...prev, ...nuevasComisiones]);
  };

  const handleGenerarReporte = (colaboradorId: string, periodo: string) => {
    console.log('Generar reporte para:', colaboradorId, periodo);
  };

  const handleProcesarPago = (comisionId: string, metodoPago: string, monto: number) => {
    console.log('Procesar pago:', comisionId, metodoPago, monto);
    // Simular procesamiento de pago
    setComisiones(prev => prev.map(comision => 
      comision.id === comisionId 
        ? { 
            ...comision, 
            estado: 'pagada',
            fechaPago: new Date().toISOString(),
            metodoPago: metodoPago as Comision['metodoPago']
          }
        : comision
    ));
  };

  const handleVerificarPago = (pagoId: string) => {
    console.log('Verificar pago:', pagoId);
  };

  const getTipoColaboradorTexto = (tipo: string) => {
    switch (tipo) {
      case 'medico': return 'Médico';
      case 'referidor': return 'Referidor';
      case 'colaborador_externo': return 'Colaborador Externo';
      default: return tipo;
    }
  };

  const getTipoColaboradorColor = (tipo: string) => {
    switch (tipo) {
      case 'medico': return 'bg-blue-500';
      case 'referidor': return 'bg-green-500';
      case 'colaborador_externo': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          Colaboradores y Comisiones
        </h1>
        <p className="text-muted-foreground text-lg">
          Gestión de colaboradores, cálculo de comisiones y procesamiento de pagos
        </p>
      </div>

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Colaboradores</CardTitle>
            <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors duration-200">
              <Users className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{estadisticas.totalColaboradores}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {estadisticas.colaboradoresActivos} activos
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Comisiones Pendientes</CardTitle>
            <div className="p-2 rounded-lg bg-yellow-500/10 group-hover:bg-yellow-500/20 transition-colors duration-200">
              <Clock className="h-4 w-4 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{estadisticas.totalComisionesPendientes}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Por procesar
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monto Pendiente</CardTitle>
            <div className="p-2 rounded-lg bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors duration-200">
              <DollarSign className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              S/ {estadisticas.totalMontoPendiente.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Por pagar
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Comisiones Pagadas</CardTitle>
            <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors duration-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              S/ {estadisticas.totalComisionesPagadas.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Este mes
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Reportes</CardTitle>
            <div className="p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors duration-200">
              <FileText className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{reportes.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Generados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Gestión */}
      <Tabs defaultValue="colaboradores" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="colaboradores">Colaboradores</TabsTrigger>
          <TabsTrigger value="comisiones">Cálculo de Comisiones</TabsTrigger>
          <TabsTrigger value="pagos">Sistema de Pagos</TabsTrigger>
          <TabsTrigger value="reportes">Reportes</TabsTrigger>
        </TabsList>

        {/* Tab Colaboradores */}
        <TabsContent value="colaboradores" className="space-y-6">
          {/* Filtros */}
          <Card>
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filtros de Búsqueda
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Filtra y busca colaboradores específicos
                  </CardDescription>
                </div>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Colaborador
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Búsqueda</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar colaboradores..."
                      value={filtros.busqueda}
                      onChange={(e) => setFiltros(prev => ({ ...prev, busqueda: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Tipo</label>
                  <Select value={filtros.tipo} onValueChange={(value) => setFiltros(prev => ({ ...prev, tipo: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los tipos</SelectItem>
                      <SelectItem value="medico">Médico</SelectItem>
                      <SelectItem value="referidor">Referidor</SelectItem>
                      <SelectItem value="colaborador_externo">Colaborador Externo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Estado</label>
                  <Select value={filtros.estado} onValueChange={(value) => setFiltros(prev => ({ ...prev, estado: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los estados</SelectItem>
                      <SelectItem value="activo">Activo</SelectItem>
                      <SelectItem value="inactivo">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Colaboradores */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {colaboradoresFiltrados.map((colaborador) => (
              <Card key={colaborador.id} className="hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-foreground">
                          {colaborador.nombre} {colaborador.apellidos}
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                          {getTipoColaboradorTexto(colaborador.tipo)}
                          {colaborador.especialidad && ` • ${colaborador.especialidad}`}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={colaborador.activo ? 'border-green-500 text-green-500' : 'border-gray-500 text-gray-500'}
                    >
                      {colaborador.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Información de Contacto */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{colaborador.telefono}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{colaborador.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Registrado: {new Date(colaborador.fechaRegistro).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Información de Comisiones */}
                  <div className="p-3 bg-muted/50 rounded-lg border border-border">
                    <h4 className="font-medium text-foreground mb-2">Información de Comisiones</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Porcentaje:</div>
                        <div className="text-foreground font-medium">{colaborador.porcentajeComision}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Pagadas:</div>
                        <div className="text-foreground font-medium">
                          S/ {colaborador.totalComisionesPagadas.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Pendientes:</div>
                        <div className="text-foreground font-medium">
                          S/ {colaborador.totalComisionesPendientes.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Última Comisión:</div>
                        <div className="text-foreground font-medium">
                          {colaborador.fechaUltimaComision ? new Date(colaborador.fechaUltimaComision).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleVerDetalleColaborador(colaborador.id)}
                        className="text-xs"
                      >
                        <User className="h-3 w-3 mr-1" />
                        Ver Detalles
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleCalcularComisiones(colaborador.id, 'enero-2024')}
                        className="text-xs"
                      >
                        <Calculator className="h-3 w-3 mr-1" />
                        Calcular
                      </Button>
                    </div>
                    {colaborador.totalComisionesPendientes > 0 && (
                      <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                        <Clock className="h-3 w-3 mr-1" />
                        Pendiente
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {colaboradoresFiltrados.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No se encontraron colaboradores</h3>
                <p className="text-sm text-muted-foreground">Intenta ajustar los filtros de búsqueda</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab Cálculo de Comisiones */}
        <TabsContent value="comisiones" className="space-y-6">
          <CalculadoraComisiones
            colaboradores={colaboradores}
            onCalcularComisiones={handleCalcularComisiones}
            onGenerarReporte={handleGenerarReporte}
          />
        </TabsContent>

        {/* Tab Sistema de Pagos */}
        <TabsContent value="pagos" className="space-y-6">
          <SistemaPagosSimulator
            comisiones={comisiones}
            onProcesarPago={handleProcesarPago}
            onVerificarPago={handleVerificarPago}
          />
        </TabsContent>

        {/* Tab Reportes */}
        <TabsContent value="reportes" className="space-y-6">
          <ReportesColaboradoresCard
            colaboradores={colaboradores}
            comisiones={comisiones}
            reportes={reportes}
            onVerDetalleColaborador={handleVerDetalleColaborador}
            onCalcularComisiones={handleCalcularComisiones}
            onProcesarPago={handleProcesarPago}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
