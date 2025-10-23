'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Building2, 
  DollarSign, 
  FileText, 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Calculator,
  Users,
  TrendingUp
} from "lucide-react";
import { AddLaboratorioMedicoModal } from "@/components/modals/add-laboratorio-medico-modal";
// Interfaces para el módulo de laboratorio
interface Laboratorio {
  id: string;
  nombre: string;
  detalle: string;
  tipo: 'propio' | 'externo' | 'convenio';
  estado: 'habilitado' | 'deshabilitado';
  pacientesAtendidos: number;
  costoPorPaciente: number; // Lo que cobramos al paciente
  porcentajePagoLaboratorio: number; // Porcentaje que pagamos al laboratorio (ej: 20%)
  montoPorPagar: number; // Monto total a pagar al laboratorio
  gananciaClinica: number; // Ganancia total de la clínica
  fechaCreacion: string;
  contacto?: string;
  telefono?: string;
  email?: string;
}

interface PrestacionLaboratorio {
  id: string;
  nombre: string;
  laboratorioId: string;
  costo: number;
  tipo: 'examen' | 'perfil' | 'biopsia' | 'cultivo';
  estado: 'activo' | 'inactivo';
  tiempoEntrega: string;
  requerimientos: string[];
}

interface SolicitudLaboratorio {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  laboratorioId: string;
  laboratorioNombre: string;
  prestaciones: PrestacionLaboratorio[];
  fechaSolicitud: string;
  fechaEntrega?: string;
  estado: 'pendiente' | 'en_proceso' | 'en_revision' | 'finalizada' | 'cancelado';
  montoTotal: number;
  observaciones?: string;
}

// Datos mock para laboratorios
const laboratoriosMock: Laboratorio[] = [
  {
    id: '1',
    nombre: 'FEMINIS SALUD',
    detalle: 'LABORATORIO PROPIO CONVENIO CON TECNOLOGO',
    tipo: 'propio',
    estado: 'habilitado',
    pacientesAtendidos: 1250,
    costoPorPaciente: 100.00, // Lo que cobramos al paciente
    porcentajePagoLaboratorio: 20, // 20% que pagamos al laboratorio
    montoPorPagar: 25000.00, // 1250 * 100 * 0.20 = 25,000
    gananciaClinica: 100000.00, // 1250 * 100 * 0.80 = 100,000
    fechaCreacion: '2024-01-15',
    contacto: 'Dr. María González',
    telefono: '+51 987 654 321',
    email: 'lab@feminis.com'
  },
  {
    id: '2',
    nombre: 'PATOLOGIA GENERAL Y ONCOLOGICA',
    detalle: 'Dra. Luisa Escudero Yong Long',
    tipo: 'convenio',
    estado: 'habilitado',
    pacientesAtendidos: 89,
    costoPorPaciente: 80.00, // Lo que cobramos al paciente
    porcentajePagoLaboratorio: 25, // 25% que pagamos al laboratorio
    montoPorPagar: 1780.00, // 89 * 80 * 0.25 = 1,780
    gananciaClinica: 5340.00, // 89 * 80 * 0.75 = 5,340
    fechaCreacion: '2024-02-20',
    contacto: 'Dra. Luisa Escudero',
    telefono: '+51 987 123 456',
    email: 'luisa.escudero@patologia.com'
  },
  {
    id: '3',
    nombre: 'INSUMOS PROPIOS',
    detalle: 'Examen realizado con reactivos propios',
    tipo: 'propio',
    estado: 'habilitado',
    pacientesAtendidos: 156,
    costoPorPaciente: 60.00, // Lo que cobramos al paciente
    porcentajePagoLaboratorio: 15, // 15% que pagamos al laboratorio (menos porque es propio)
    montoPorPagar: 1404.00, // 156 * 60 * 0.15 = 1,404
    gananciaClinica: 7956.00, // 156 * 60 * 0.85 = 7,956
    fechaCreacion: '2024-03-10',
    contacto: 'Tec. Carlos Mendoza',
    telefono: '+51 987 789 012',
    email: 'carlos.mendoza@feminis.com'
  }
];

// Datos mock para prestaciones basados en la imagen
const prestacionesMock: PrestacionLaboratorio[] = [
  {
    id: '1',
    nombre: 'ACAROS INVESTIGACION',
    laboratorioId: '1',
    costo: 80.00,
    tipo: 'examen',
    estado: 'activo',
    tiempoEntrega: '24 horas',
    requerimientos: ['Muestra de piel']
  },
  {
    id: '2',
    nombre: 'ACIDO ASCORBICO',
    laboratorioId: '1',
    costo: 250.00,
    tipo: 'examen',
    estado: 'activo',
    tiempoEntrega: '48 horas',
    requerimientos: ['Ayuno 8 horas', 'Muestra de sangre']
  },
  {
    id: '3',
    nombre: 'ACIDO FOLICO',
    laboratorioId: '1',
    costo: 70.00,
    tipo: 'examen',
    estado: 'activo',
    tiempoEntrega: '24 horas',
    requerimientos: ['Muestra de sangre']
  },
  {
    id: '4',
    nombre: 'ACIDO URICO EN ORINA SIMPLE',
    laboratorioId: '1',
    costo: 70.00,
    tipo: 'examen',
    estado: 'activo',
    tiempoEntrega: '24 horas',
    requerimientos: ['Muestra de orina']
  },
  {
    id: '5',
    nombre: 'ACIDO URICO EN SUERO',
    laboratorioId: '1',
    costo: 50.00,
    tipo: 'examen',
    estado: 'activo',
    tiempoEntrega: '24 horas',
    requerimientos: ['Muestra de sangre']
  },
  {
    id: '6',
    nombre: 'ACIDO URICO ORINA 24hr',
    laboratorioId: '1',
    costo: 50.00,
    tipo: 'examen',
    estado: 'activo',
    tiempoEntrega: '24 horas',
    requerimientos: ['Recolección 24 horas', 'Muestra de orina']
  },
  {
    id: '7',
    nombre: 'ACIDOS BILIARES',
    laboratorioId: '1',
    costo: 370.00,
    tipo: 'examen',
    estado: 'activo',
    tiempoEntrega: '48 horas',
    requerimientos: ['Ayuno 12 horas', 'Muestra de sangre']
  },
  {
    id: '8',
    nombre: 'ACTH am BASAL',
    laboratorioId: '1',
    costo: 110.00,
    tipo: 'examen',
    estado: 'activo',
    tiempoEntrega: '24 horas',
    requerimientos: ['Muestra de sangre matutina']
  },
  {
    id: '9',
    nombre: 'ACTH pm DOSAJE',
    laboratorioId: '1',
    costo: 185.00,
    tipo: 'examen',
    estado: 'activo',
    tiempoEntrega: '24 horas',
    requerimientos: ['Muestra de sangre vespertina']
  },
  {
    id: '10',
    nombre: 'AGLUTINACIONES EN LAMINA',
    laboratorioId: '1',
    costo: 40.00,
    tipo: 'examen',
    estado: 'activo',
    tiempoEntrega: '24 horas',
    requerimientos: ['Muestra de sangre']
  }
];

// Datos mock para solicitudes
const solicitudesMock: SolicitudLaboratorio[] = [
  {
    id: '1',
    pacienteId: 'P001',
    pacienteNombre: 'María Rodríguez',
    laboratorioId: '1',
    laboratorioNombre: 'FEMINIS SALUD',
    prestaciones: [prestacionesMock[0], prestacionesMock[1]],
    fechaSolicitud: '2024-10-15',
    fechaEntrega: '2024-10-17',
    estado: 'finalizada',
    montoTotal: 145.00,
    observaciones: 'Paciente embarazada, prioridad alta'
  },
  {
    id: '2',
    pacienteId: 'P002',
    pacienteNombre: 'Ana García',
    laboratorioId: '2',
    laboratorioNombre: 'PATOLOGIA GENERAL Y ONCOLOGICA',
    prestaciones: [prestacionesMock[2]],
    fechaSolicitud: '2024-10-16',
    estado: 'en_proceso',
    montoTotal: 180.00,
    observaciones: 'Seguimiento oncológico'
  },
  {
    id: '3',
    pacienteId: 'P003',
    pacienteNombre: 'Carmen López',
    laboratorioId: '1',
    laboratorioNombre: 'FEMINIS SALUD',
    prestaciones: [prestacionesMock[3]],
    fechaSolicitud: '2024-10-17',
    estado: 'pendiente',
    montoTotal: 70.00,
    observaciones: 'Examen de rutina'
  },
  {
    id: '4',
    pacienteId: 'P004',
    pacienteNombre: 'Elena Martínez',
    laboratorioId: '3',
    laboratorioNombre: 'INSUMOS PROPIOS',
    prestaciones: [prestacionesMock[4], prestacionesMock[5]],
    fechaSolicitud: '2024-10-18',
    estado: 'en_revision',
    montoTotal: 100.00,
    observaciones: 'Revisión de resultados'
  }
];

export default function LaboratorioPage() {
  const [laboratorios, setLaboratorios] = useState<Laboratorio[]>(laboratoriosMock);
  const [prestaciones, setPrestaciones] = useState<PrestacionLaboratorio[]>(prestacionesMock);
  const [solicitudes, setSolicitudes] = useState<SolicitudLaboratorio[]>(solicitudesMock);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('todos');
  const [activeTab, setActiveTab] = useState('laboratorios');
  const [isAddLaboratorioMedicoModalOpen, setIsAddLaboratorioMedicoModalOpen] = useState(false);
  // Función para calcular el monto por pagar al laboratorio
  const calcularMontoPorPagar = (pacientesAtendidos: number, costoPorPaciente: number, porcentajePago: number): number => {
    return pacientesAtendidos * costoPorPaciente * (porcentajePago / 100);
  };

  // Función para calcular la ganancia de la clínica
  const calcularGananciaClinica = (pacientesAtendidos: number, costoPorPaciente: number, porcentajePago: number): number => {
    return pacientesAtendidos * costoPorPaciente * ((100 - porcentajePago) / 100);
  };

  // Función para actualizar los cálculos
  const actualizarCalculos = (laboratorioId: string, nuevosPacientes: number, nuevoCosto: number, nuevoPorcentaje: number) => {
    setLaboratorios(prev => prev.map(lab => 
      lab.id === laboratorioId 
        ? { 
            ...lab, 
            pacientesAtendidos: nuevosPacientes,
            costoPorPaciente: nuevoCosto,
            porcentajePagoLaboratorio: nuevoPorcentaje,
            montoPorPagar: calcularMontoPorPagar(nuevosPacientes, nuevoCosto, nuevoPorcentaje),
            gananciaClinica: calcularGananciaClinica(nuevosPacientes, nuevoCosto, nuevoPorcentaje)
          }
        : lab
    ));
  };

  // Función para agregar nuevo laboratorio
  const handleAddLaboratorio = (newLaboratorio: Omit<Laboratorio, 'id' | 'fechaCreacion' | 'montoPorPagar' | 'gananciaClinica'>) => {
    const laboratorio: Laboratorio = {
      ...newLaboratorio,
      id: (laboratorios.length + 1).toString(),
      fechaCreacion: new Date().toISOString().split('T')[0],
      montoPorPagar: calcularMontoPorPagar(newLaboratorio.pacientesAtendidos, newLaboratorio.costoPorPaciente, newLaboratorio.porcentajePagoLaboratorio),
      gananciaClinica: calcularGananciaClinica(newLaboratorio.pacientesAtendidos, newLaboratorio.costoPorPaciente, newLaboratorio.porcentajePagoLaboratorio)
    };
    setLaboratorios(prev => [...prev, laboratorio]);
  };

  // Filtrar laboratorios
  const laboratoriosFiltrados = laboratorios.filter(lab => {
    const matchesSearch = lab.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lab.detalle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = filterEstado === 'todos' || lab.estado === filterEstado;
    return matchesSearch && matchesEstado;
  });

  // Filtrar solicitudes
  const solicitudesFiltradas = solicitudes.filter(solicitud => {
    if (activeTab === 'solicitudes') {
      return filterEstado === 'todos' || solicitud.estado === filterEstado;
    }
    return true;
  });

  // Estadísticas
  const totalLaboratorios = laboratorios.length;
  const laboratoriosHabilitados = laboratorios.filter(lab => lab.estado === 'habilitado').length;
  const montoTotalPorPagar = laboratorios.reduce((sum, lab) => sum + lab.montoPorPagar, 0);
  const gananciaTotalClinica = laboratorios.reduce((sum, lab) => sum + lab.gananciaClinica, 0);
  const totalPacientesAtendidos = laboratorios.reduce((sum, lab) => sum + lab.pacientesAtendidos, 0);

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'habilitado':
        return <Badge variant="default" className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />Habilitado</Badge>;
      case 'deshabilitado':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Deshabilitado</Badge>;
      default:
        return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case 'propio':
        return <Badge variant="default" className="bg-primary text-primary-foreground">Propio</Badge>;
      case 'convenio':
        return <Badge variant="default" className="bg-info text-info-foreground">Convenio</Badge>;
      case 'externo':
        return <Badge variant="outline">Externo</Badge>;
      default:
        return <Badge variant="secondary">{tipo}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Building2 className="h-6 w-6 text-primary" />
                Gestión de Laboratorios
              </h1>
              <p className="text-sm text-muted-foreground">
                Administración de laboratorios, prestaciones y solicitudes
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
              <Button 
                size="sm" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => setIsAddLaboratorioMedicoModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Laboratorio
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-6">
        {/* Estadísticas Generales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Laboratorios</p>
                  <p className="text-2xl font-bold text-primary">{totalLaboratorios}</p>
                </div>
                <Building2 className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-success">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Habilitados</p>
                  <p className="text-2xl font-bold text-success">{laboratoriosHabilitados}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-warning">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Monto por Pagar</p>
                  <p className="text-2xl font-bold text-warning">S/ {montoTotalPorPagar.toLocaleString()}</p>
                </div>
                
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-success">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ganancia Clínica</p>
                  <p className="text-2xl font-bold text-success">S/ {gananciaTotalClinica.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs de Navegación */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="laboratorios" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Laboratorios</span>
            </TabsTrigger>
            <TabsTrigger value="habilitados" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Habilitados</span>
            </TabsTrigger>
            <TabsTrigger value="prestaciones" className="flex items-center gap-2">
              
              <span className="hidden sm:inline">Prestaciones</span>
            </TabsTrigger>
            <TabsTrigger value="solicitudes" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Solicitudes</span>
            </TabsTrigger>
          </TabsList>


          {/* Tab: Laboratorios */}
          <TabsContent value="laboratorios" className="mt-6">
            {/* Mensaje Informativo General */}
            <div className="mb-4 p-3 bg-info/10 border border-info/20 rounded-lg">
              <div className="flex items-center gap-2 text-info">
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm font-medium">
                  Es recomendado crear los Laboratorios (empresas) y luego añadir prestaciones.
                </p>
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <CardTitle>Lista de Laboratorios</CardTitle>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar laboratorios..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full sm:w-64"
                      />
                    </div>
                    <Select value={filterEstado} onValueChange={setFilterEstado}>
                      <SelectTrigger className="w-full sm:w-32">
                        <SelectValue placeholder="Estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="habilitado">Habilitado</SelectItem>
                        <SelectItem value="deshabilitado">Deshabilitado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Detalle</TableHead>
                        <TableHead className="text-center">Tipo</TableHead>
                        <TableHead className="text-center">Estado</TableHead>
                        <TableHead className="text-center">Pacientes</TableHead>
                        <TableHead className="text-center">Costo/Paciente</TableHead>
                        <TableHead className="text-center">% Pago Lab.</TableHead>
                        <TableHead className="text-right">Por Pagar</TableHead>
                        <TableHead className="text-right">Ganancia</TableHead>
                        <TableHead className="text-center">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {laboratoriosFiltrados.map((laboratorio) => (
                        <TableRow key={laboratorio.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">
                            <div>
                              <p className="font-semibold">{laboratorio.nombre}</p>
                              {laboratorio.contacto && (
                                <p className="text-sm text-muted-foreground">{laboratorio.contacto}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">{laboratorio.detalle}</p>
                            {laboratorio.telefono && (
                              <p className="text-xs text-muted-foreground">{laboratorio.telefono}</p>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {getTipoBadge(laboratorio.tipo)}
                          </TableCell>
                          <TableCell className="text-center">
                            {getEstadoBadge(laboratorio.estado)}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{laboratorio.pacientesAtendidos.toLocaleString()}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Calculator className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">S/ {laboratorio.costoPorPaciente.toFixed(2)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <span className="font-medium text-info">{laboratorio.porcentajePagoLaboratorio}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              
                              <span className="font-bold text-warning">S/ {laboratorio.montoPorPagar.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <TrendingUp className="h-4 w-4 text-success" />
                              <span className="font-bold text-success">S/ {laboratorio.gananciaClinica.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
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
          </TabsContent>

          {/* Tab: Laboratorios Habilitados */}
          <TabsContent value="habilitados" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Laboratorios Habilitados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {laboratorios.filter(lab => lab.estado === 'habilitado').map((laboratorio) => (
                    <Card key={laboratorio.id} className="border-primary/20">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{laboratorio.nombre}</CardTitle>
                          {getTipoBadge(laboratorio.tipo)}
                        </div>
                        <p className="text-sm text-muted-foreground">{laboratorio.detalle}</p>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Pacientes Atendidos:</span>
                            <span className="font-medium">{laboratorio.pacientesAtendidos.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Costo por Paciente:</span>
                            <span className="font-medium">S/ {laboratorio.costoPorPaciente.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">% Pago Laboratorio:</span>
                            <span className="font-medium text-info">{laboratorio.porcentajePagoLaboratorio}%</span>
                          </div>
                          <div className="flex justify-between items-center border-t pt-2">
                            <span className="text-sm font-medium">Monto por Pagar:</span>
                            <span className="font-bold text-warning">S/ {laboratorio.montoPorPagar.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Ganancia Clínica:</span>
                            <span className="font-bold text-success">S/ {laboratorio.gananciaClinica.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Prestaciones de Laboratorio */}
          <TabsContent value="prestaciones" className="mt-6">
            {/* Mensaje Informativo para Prestaciones */}
            <div className="mb-4 p-3 bg-info/10 border border-info/20 rounded-lg">
              <div className="flex items-center gap-2 text-info">
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm font-medium">
                  Estos precios son los que se cobrarán al paciente, y son los que serán impresos en el presupuesto.
                </p>
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Prestaciones de Laboratorio</CardTitle>
                  <Button size="sm" className="bg-success hover:bg-success/90 text-success-foreground">
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Prestación
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-20">Código</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead className="text-right">Precio paciente genérico</TableHead>
                        <TableHead className="text-center w-24">Editar</TableHead>
                        <TableHead className="text-center w-32">Deshabilitar</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {prestaciones.map((prestacion) => (
                        <TableRow key={prestacion.id} className="hover:bg-muted/50">
                          <TableCell className="text-center">
                            <span className="text-muted-foreground">-</span>
                          </TableCell>
                          <TableCell className="font-medium">{prestacion.nombre}</TableCell>
                          <TableCell className="text-right">
                            <span className="font-medium">S/.{prestacion.costo.toFixed(2)}</span>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button variant="outline" size="sm" className="text-info border-info hover:bg-info/10">
                              <Edit className="h-4 w-4 mr-1" />
                              Editar
                            </Button>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive/10">
                              <XCircle className="h-4 w-4 mr-1" />
                              Deshabilitar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Solicitudes */}
          <TabsContent value="solicitudes" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <CardTitle>Solicitudes de Laboratorio</CardTitle>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Select value={filterEstado} onValueChange={setFilterEstado}>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Filtrar por estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos los estados</SelectItem>
                        <SelectItem value="pendiente">Pendiente</SelectItem>
                        <SelectItem value="en_proceso">En proceso</SelectItem>
                        <SelectItem value="en_revision">En revisión</SelectItem>
                        <SelectItem value="finalizada">Finalizada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Paciente</TableHead>
                        <TableHead>Laboratorio</TableHead>
                        <TableHead>Prestaciones</TableHead>
                        <TableHead>Fecha Solicitud</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Monto</TableHead>
                        <TableHead className="text-center">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {solicitudesFiltradas.map((solicitud) => (
                        <TableRow key={solicitud.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{solicitud.pacienteNombre}</TableCell>
                          <TableCell>{solicitud.laboratorioNombre}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {solicitud.prestaciones.map((prestacion, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {prestacion.nombre}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>{new Date(solicitud.fechaSolicitud).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {solicitud.estado === 'finalizada' ? (
                              <Badge variant="default" className="bg-success text-success-foreground">
                                <CheckCircle className="h-3 w-3 mr-1" />Finalizada
                              </Badge>
                            ) : solicitud.estado === 'en_proceso' ? (
                              <Badge variant="default" className="bg-warning text-warning-foreground">
                                <TrendingUp className="h-3 w-3 mr-1" />En Proceso
                              </Badge>
                            ) : solicitud.estado === 'en_revision' ? (
                              <Badge variant="default" className="bg-info text-info-foreground">
                                <Eye className="h-3 w-3 mr-1" />En Revisión
                              </Badge>
                            ) : solicitud.estado === 'pendiente' ? (
                              <Badge variant="outline" className="border-warning text-warning">
                                <AlertCircle className="h-3 w-3 mr-1" />Pendiente
                              </Badge>
                            ) : (
                              <Badge variant="destructive">
                                <XCircle className="h-3 w-3 mr-1" />Cancelado
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="font-medium">S/ {solicitud.montoTotal.toFixed(2)}</span>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
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
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal para agregar laboratorios */}
      <AddLaboratorioMedicoModal
        isOpen={isAddLaboratorioMedicoModalOpen}
        onClose={() => setIsAddLaboratorioMedicoModalOpen(false)}
        onSave={handleAddLaboratorio}
      />
    </div>
  );
}
