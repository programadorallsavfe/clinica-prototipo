"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Receipt, 
  FileText, 
  Users, 
  Calendar,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Download,
  BarChart3,
  PieChart,
  Activity,
  CreditCard,
  Banknote,
  Calculator,
  AlertCircle,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react';

// Interfaces
interface Servicio {
  id: string;
  nombre: string;
  categoria: 'consulta' | 'procedimiento' | 'examen' | 'medicamento' | 'otro';
  precio: number;
  costo: number;
  utilidad: number;
  estado: 'activo' | 'inactivo';
  descripcion?: string;
}

interface ConceptoIngreso {
  id: string;
  nombre: string;
  tipo: 'servicio' | 'venta' | 'comision' | 'otro';
  monto: number;
  fecha: string;
  pacienteId?: string;
  profesionalId?: string;
  descripcion?: string;
}

interface ConceptoEgreso {
  id: string;
  nombre: string;
  tipo: 'gasto_operativo' | 'compra' | 'salario' | 'servicio' | 'otro';
  monto: number;
  fecha: string;
  proveedorId?: string;
  descripcion?: string;
}

interface Proveedor {
  id: string;
  nombre: string;
  ruc: string;
  contacto: string;
  telefono: string;
  email?: string;
  direccion?: string;
  estado: 'activo' | 'inactivo';
}

interface Recaudacion {
  periodo: string;
  ingresos: number;
  egresos: number;
  utilidad: number;
  pacientes: number;
  servicios: number;
}

// Datos mock
const serviciosMock: Servicio[] = [
  {
    id: '1',
    nombre: 'Consulta Obstétrica',
    categoria: 'consulta',
    precio: 80.00,
    costo: 40.00,
    utilidad: 40.00,
    estado: 'activo',
    descripcion: 'Consulta médica especializada en obstetricia'
  },
  {
    id: '2',
    nombre: 'Consulta Ginecológica',
    categoria: 'consulta',
    precio: 70.00,
    costo: 35.00,
    utilidad: 35.00,
    estado: 'activo',
    descripcion: 'Consulta médica especializada en ginecología'
  },
  {
    id: '3',
    nombre: 'Ecografía Obstétrica',
    categoria: 'procedimiento',
    precio: 120.00,
    costo: 60.00,
    utilidad: 60.00,
    estado: 'activo',
    descripcion: 'Ecografía para seguimiento del embarazo'
  },
  {
    id: '4',
    nombre: 'Hemograma Completo',
    categoria: 'examen',
    precio: 25.00,
    costo: 15.00,
    utilidad: 10.00,
    estado: 'activo',
    descripcion: 'Examen de laboratorio básico'
  },
  {
    id: '5',
    nombre: 'Paracetamol 500mg',
    categoria: 'medicamento',
    precio: 2.50,
    costo: 1.50,
    utilidad: 1.00,
    estado: 'activo',
    descripcion: 'Analgésico y antipirético'
  }
];

const conceptosIngresoMock: ConceptoIngreso[] = [
  {
    id: '1',
    nombre: 'Consulta Obstétrica - María Rodríguez',
    tipo: 'servicio',
    monto: 80.00,
    fecha: '2024-10-20',
    pacienteId: 'P001',
    profesionalId: 'DR001',
    descripcion: 'Consulta de control prenatal'
  },
  {
    id: '2',
    nombre: 'Ecografía Obstétrica - Ana García',
    tipo: 'servicio',
    monto: 120.00,
    fecha: '2024-10-20',
    pacienteId: 'P002',
    profesionalId: 'DR001',
    descripcion: 'Ecografía de segundo trimestre'
  },
  {
    id: '3',
    nombre: 'Venta Medicamentos - Carmen López',
    tipo: 'venta',
    monto: 45.00,
    fecha: '2024-10-20',
    pacienteId: 'P003',
    descripcion: 'Paracetamol, Ibuprofeno, Vitaminas'
  },
  {
    id: '4',
    nombre: 'Comisión Dr. Pérez - Octubre',
    tipo: 'comision',
    monto: 250.00,
    fecha: '2024-10-20',
    profesionalId: 'DR001',
    descripcion: 'Comisión por consultas realizadas'
  }
];

const conceptosEgresoMock: ConceptoEgreso[] = [
  {
    id: '1',
    nombre: 'Compra Medicamentos - Farmacia Central',
    tipo: 'compra',
    monto: 500.00,
    fecha: '2024-10-19',
    proveedorId: 'PROV001',
    descripcion: 'Stock de medicamentos básicos'
  },
  {
    id: '2',
    nombre: 'Servicio de Limpieza - LimpiaTotal',
    tipo: 'servicio',
    monto: 200.00,
    fecha: '2024-10-18',
    proveedorId: 'PROV002',
    descripcion: 'Servicio mensual de limpieza'
  },
  {
    id: '3',
    nombre: 'Salario Enfermera - Elena Martínez',
    tipo: 'salario',
    monto: 1200.00,
    fecha: '2024-10-15',
    descripcion: 'Salario mensual octubre'
  },
  {
    id: '4',
    nombre: 'Gasto Operativo - Internet',
    tipo: 'gasto_operativo',
    monto: 80.00,
    fecha: '2024-10-10',
    descripcion: 'Servicio de internet mensual'
  }
];

const proveedoresMock: Proveedor[] = [
  {
    id: 'PROV001',
    nombre: 'Farmacia Central S.A.C.',
    ruc: '20123456789',
    contacto: 'Juan Pérez',
    telefono: '987654321',
    email: 'ventas@farmaciacentral.com',
    direccion: 'Av. Principal 123, Lima',
    estado: 'activo'
  },
  {
    id: 'PROV002',
    nombre: 'LimpiaTotal Servicios',
    ruc: '20987654321',
    contacto: 'María González',
    telefono: '987123456',
    email: 'info@limpiatotal.com',
    direccion: 'Jr. Limpieza 456, Lima',
    estado: 'activo'
  },
  {
    id: 'PROV003',
    nombre: 'Laboratorio Clínico ABC',
    ruc: '20555666777',
    contacto: 'Dr. Carlos Ruiz',
    telefono: '987789123',
    email: 'lab@abc.com',
    direccion: 'Av. Medicina 789, Lima',
    estado: 'activo'
  }
];

const recaudacionMock: Recaudacion[] = [
  {
    periodo: '2024-10-20',
    ingresos: 495.00,
    egresos: 1980.00,
    utilidad: -1485.00,
    pacientes: 3,
    servicios: 4
  },
  {
    periodo: '2024-10-19',
    ingresos: 320.00,
    egresos: 500.00,
    utilidad: -180.00,
    pacientes: 2,
    servicios: 3
  },
  {
    periodo: '2024-10-18',
    ingresos: 450.00,
    egresos: 200.00,
    utilidad: 250.00,
    pacientes: 4,
    servicios: 5
  }
];

export default function CajaPage() {
  const [servicios, setServicios] = useState<Servicio[]>(serviciosMock);
  const [conceptosIngreso, setConceptosIngreso] = useState<ConceptoIngreso[]>(conceptosIngresoMock);
  const [conceptosEgreso, setConceptosEgreso] = useState<ConceptoEgreso[]>(conceptosEgresoMock);
  const [proveedores, setProveedores] = useState<Proveedor[]>(proveedoresMock);
  const [recaudacion, setRecaudacion] = useState<Recaudacion[]>(recaudacionMock);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('todos');
  const [filterTipo, setFilterTipo] = useState('todos');
  const [filterPeriodo, setFilterPeriodo] = useState('hoy');

  // Estadísticas generales
  const totalIngresos = conceptosIngreso.reduce((sum, ingreso) => sum + ingreso.monto, 0);
  const totalEgresos = conceptosEgreso.reduce((sum, egreso) => sum + egreso.monto, 0);
  const utilidadNeta = totalIngresos - totalEgresos;
  const totalServicios = servicios.length;
  const serviciosActivos = servicios.filter(s => s.estado === 'activo').length;

  // Filtrar servicios
  const serviciosFiltrados = servicios.filter(servicio => {
    const matchesSearch = servicio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         servicio.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = filterCategoria === 'todos' || servicio.categoria === filterCategoria;
    return matchesSearch && matchesCategoria;
  });

  // Filtrar conceptos por tipo
  const conceptosFiltrados = activeTab === 'ingresos' ? conceptosIngreso : conceptosEgreso;
  const conceptosFiltradosPorTipo = conceptosFiltrados.filter(concepto => {
    if (filterTipo === 'todos') return true;
    return concepto.tipo === filterTipo;
  });

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'consulta': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'procedimiento': return 'bg-green-100 text-green-800 border-green-200';
      case 'examen': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'medicamento': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'servicio': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'venta': return 'bg-green-100 text-green-800 border-green-200';
      case 'comision': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'compra': return 'bg-red-100 text-red-800 border-red-200';
      case 'salario': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'gasto_operativo': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Caja / Contaduría</h1>
          <p className="text-muted-foreground mt-1">
            Gestión financiera y control de ingresos y egresos
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Servicio
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Ingresos</p>
                <p className="text-2xl font-bold text-green-600">
                  S/ {totalIngresos.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Egresos</p>
                <p className="text-2xl font-bold text-red-600">
                  S/ {totalEgresos.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`border-l-4 ${utilidadNeta >= 0 ? 'border-l-green-500' : 'border-l-red-500'}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Utilidad Neta</p>
                <p className={`text-2xl font-bold ${utilidadNeta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  S/ {utilidadNeta.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${utilidadNeta >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                <Calculator className={`h-6 w-6 ${utilidadNeta >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Servicios Activos</p>
                <p className="text-2xl font-bold text-blue-600">
                  {serviciosActivos} / {totalServicios}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="servicios">Servicios</TabsTrigger>
          <TabsTrigger value="ingresos">Ingresos</TabsTrigger>
          <TabsTrigger value="egresos">Egresos</TabsTrigger>
          <TabsTrigger value="proveedores">Proveedores</TabsTrigger>
          <TabsTrigger value="reportes">Reportes</TabsTrigger>
        </TabsList>

        {/* Tab: Dashboard */}
        <TabsContent value="dashboard" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recaudación Reciente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Recaudación Reciente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recaudacion.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{new Date(item.periodo).toLocaleDateString()}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.pacientes} pacientes, {item.servicios} servicios
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${item.utilidad >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          S/ {item.utilidad.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Ing: S/ {item.ingresos.toFixed(2)} | Egr: S/ {item.egresos.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Resumen por Categoría */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Ingresos por Categoría
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['consulta', 'procedimiento', 'examen', 'medicamento'].map(categoria => {
                    const ingresosCategoria = conceptosIngreso
                      .filter(ing => ing.tipo === 'servicio')
                      .reduce((sum, ing) => sum + ing.monto, 0);
                    const porcentaje = totalIngresos > 0 ? (ingresosCategoria / totalIngresos) * 100 : 0;
                    
                    return (
                      <div key={categoria} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getCategoriaColor(categoria).split(' ')[0]}`}></div>
                          <span className="capitalize">{categoria}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">S/ {ingresosCategoria.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">{porcentaje.toFixed(1)}%</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Servicios */}
        <TabsContent value="servicios" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <CardTitle>Servicios y Precios</CardTitle>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Buscar servicios..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full sm:w-64"
                    />
                  </div>
                  <Select value={filterCategoria} onValueChange={setFilterCategoria}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filtrar por categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todas las categorías</SelectItem>
                      <SelectItem value="consulta">Consultas</SelectItem>
                      <SelectItem value="procedimiento">Procedimientos</SelectItem>
                      <SelectItem value="examen">Exámenes</SelectItem>
                      <SelectItem value="medicamento">Medicamentos</SelectItem>
                      <SelectItem value="otro">Otros</SelectItem>
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
                      <TableHead>Servicio</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Costo</TableHead>
                      <TableHead>Utilidad</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-center">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {serviciosFiltrados.map((servicio) => (
                      <TableRow key={servicio.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div>
                            <p className="font-medium">{servicio.nombre}</p>
                            {servicio.descripcion && (
                              <p className="text-sm text-muted-foreground">{servicio.descripcion}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getCategoriaColor(servicio.categoria)}>
                            {servicio.categoria}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">S/ {servicio.precio.toFixed(2)}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-muted-foreground">S/ {servicio.costo.toFixed(2)}</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-green-600">
                            S/ {servicio.utilidad.toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {servicio.estado === 'activo' ? (
                            <Badge variant="default" className="bg-success text-success-foreground">
                              <CheckCircle className="h-3 w-3 mr-1" />Activo
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <AlertCircle className="h-3 w-3 mr-1" />Inactivo
                            </Badge>
                          )}
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

        {/* Tab: Ingresos */}
        <TabsContent value="ingresos" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <CardTitle>Conceptos de Ingreso</CardTitle>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Select value={filterTipo} onValueChange={setFilterTipo}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filtrar por tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los tipos</SelectItem>
                      <SelectItem value="servicio">Servicios</SelectItem>
                      <SelectItem value="venta">Ventas</SelectItem>
                      <SelectItem value="comision">Comisiones</SelectItem>
                      <SelectItem value="otro">Otros</SelectItem>
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
                      <TableHead>Concepto</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead className="text-center">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {conceptosFiltradosPorTipo.map((concepto) => (
                      <TableRow key={concepto.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{concepto.nombre}</TableCell>
                        <TableCell>
                          <Badge className={getTipoColor(concepto.tipo)}>
                            {concepto.tipo}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-green-600">
                            S/ {concepto.monto.toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell>{new Date(concepto.fecha).toLocaleDateString()}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {concepto.descripcion}
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

        {/* Tab: Egresos */}
        <TabsContent value="egresos" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <CardTitle>Conceptos de Egreso</CardTitle>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Select value={filterTipo} onValueChange={setFilterTipo}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filtrar por tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los tipos</SelectItem>
                      <SelectItem value="compra">Compras</SelectItem>
                      <SelectItem value="salario">Salarios</SelectItem>
                      <SelectItem value="servicio">Servicios</SelectItem>
                      <SelectItem value="gasto_operativo">Gastos Operativos</SelectItem>
                      <SelectItem value="otro">Otros</SelectItem>
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
                      <TableHead>Concepto</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead className="text-center">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {conceptosFiltradosPorTipo.map((concepto) => (
                      <TableRow key={concepto.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{concepto.nombre}</TableCell>
                        <TableCell>
                          <Badge className={getTipoColor(concepto.tipo)}>
                            {concepto.tipo}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-red-600">
                            S/ {concepto.monto.toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell>{new Date(concepto.fecha).toLocaleDateString()}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {concepto.descripcion}
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

        {/* Tab: Proveedores */}
        <TabsContent value="proveedores" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <CardTitle>Proveedores</CardTitle>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Proveedor
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Proveedor</TableHead>
                      <TableHead>RUC</TableHead>
                      <TableHead>Contacto</TableHead>
                      <TableHead>Teléfono</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-center">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {proveedores.map((proveedor) => (
                      <TableRow key={proveedor.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div>
                            <p className="font-medium">{proveedor.nombre}</p>
                            {proveedor.direccion && (
                              <p className="text-sm text-muted-foreground">{proveedor.direccion}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{proveedor.ruc}</TableCell>
                        <TableCell>{proveedor.contacto}</TableCell>
                        <TableCell>{proveedor.telefono}</TableCell>
                        <TableCell>{proveedor.email}</TableCell>
                        <TableCell>
                          {proveedor.estado === 'activo' ? (
                            <Badge variant="default" className="bg-success text-success-foreground">
                              <CheckCircle className="h-3 w-3 mr-1" />Activo
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <AlertCircle className="h-3 w-3 mr-1" />Inactivo
                            </Badge>
                          )}
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

        {/* Tab: Reportes */}
        <TabsContent value="reportes" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Reportes Financieros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Receipt className="h-4 w-4 mr-2" />
                    Recaudación Diaria
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Recaudación Semanal
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Recaudación Mensual
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Recaudación Trimestral
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Target className="h-4 w-4 mr-2" />
                    Recaudación Anual
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Reportes de Productividad
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Productividad Médicos
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Activity className="h-4 w-4 mr-2" />
                    Servicios Más Rentables
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Comisiones por Profesional
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Banknote className="h-4 w-4 mr-2" />
                    Comisiones de Colaboradores
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
