"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  Clock, 
  FileText, 
  Download,
  Filter,
  Search,
  Eye,
  PieChart,
  Activity,
  Heart,
  Stethoscope,
  Baby,
  UserCheck,
  Award,
  Target,
  Zap
} from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart as RechartsPieChart, Cell, LineChart, Line } from "recharts";

// Mock data para reportes médicos
const reportesMock = {
  // Métricas generales
  metricasGenerales: {
    totalPacientes: 1247,
    totalCitas: 3421,
    ingresosTotales: 125430,
    tiempoPromedioAtencion: 28,
    satisfaccionPromedio: 4.7,
    pacientesNuevos: 89,
    pacientesContinuadores: 1158
  },

  // Productividad por médico
  productividadMedicos: [
    { nombre: "Dr. Carlos Sánchez", especialidad: "Medicina General", citas: 156, ingresos: 18720, tiempoPromedio: 25, satisfaccion: 4.8 },
    { nombre: "Dra. Ana Rodríguez", especialidad: "Ginecología", citas: 142, ingresos: 21300, tiempoPromedio: 32, satisfaccion: 4.9 },
    { nombre: "Dr. Luis García", especialidad: "Cardiología", citas: 98, ingresos: 19600, tiempoPromedio: 35, satisfaccion: 4.7 },
    { nombre: "Dra. María López", especialidad: "Pediatría", citas: 134, ingresos: 16080, tiempoPromedio: 22, satisfaccion: 4.6 },
    { nombre: "Dr. Pedro Martínez", especialidad: "Dermatología", citas: 87, ingresos: 13050, tiempoPromedio: 20, satisfaccion: 4.5 }
  ],

  // Diagnósticos más frecuentes
  diagnosticosFrecuentes: [
    { diagnostico: "Hipertensión arterial", cantidad: 234, porcentaje: 18.7 },
    { diagnostico: "Diabetes mellitus tipo 2", cantidad: 189, porcentaje: 15.1 },
    { diagnostico: "Infección urinaria", cantidad: 156, porcentaje: 12.5 },
    { diagnostico: "Gastritis crónica", cantidad: 134, porcentaje: 10.7 },
    { diagnostico: "Artritis reumatoide", cantidad: 98, porcentaje: 7.8 },
    { diagnostico: "Asma bronquial", cantidad: 87, porcentaje: 7.0 },
    { diagnostico: "Depresión", cantidad: 76, porcentaje: 6.1 },
    { diagnostico: "Osteoporosis", cantidad: 65, porcentaje: 5.2 }
  ],

  // Servicios más rentables
  serviciosRentables: [
    { servicio: "Consulta especializada", cantidad: 1247, precio: 120, ingresos: 149640, utilidad: 45 },
    { servicio: "Ecografía obstétrica", cantidad: 456, precio: 180, ingresos: 82080, utilidad: 60 },
    { servicio: "Consulta de control", cantidad: 892, precio: 80, ingresos: 71360, utilidad: 40 },
    { servicio: "Ecografía ginecológica", cantidad: 234, precio: 150, ingresos: 35100, utilidad: 55 },
    { servicio: "Consulta de emergencia", cantidad: 156, precio: 200, ingresos: 31200, utilidad: 50 },
    { servicio: "Procedimiento menor", cantidad: 98, precio: 300, ingresos: 29400, utilidad: 65 }
  ],

  // Ingresos por mes (últimos 12 meses)
  ingresosMensuales: [
    { mes: "Ene", ingresos: 9850, citas: 267 },
    { mes: "Feb", ingresos: 11200, citas: 298 },
    { mes: "Mar", ingresos: 10850, citas: 289 },
    { mes: "Abr", ingresos: 12400, citas: 312 },
    { mes: "May", ingresos: 11800, citas: 301 },
    { mes: "Jun", ingresos: 13200, citas: 334 },
    { mes: "Jul", ingresos: 12850, citas: 325 },
    { mes: "Ago", ingresos: 14100, citas: 356 },
    { mes: "Sep", ingresos: 13500, citas: 342 },
    { mes: "Oct", ingresos: 14800, citas: 378 },
    { mes: "Nov", ingresos: 14200, citas: 365 },
    { mes: "Dic", ingresos: 15600, citas: 389 }
  ],

  // Distribución por especialidades
  distribucionEspecialidades: [
    { especialidad: "Medicina General", cantidad: 456, color: "#0EA5A8" },
    { especialidad: "Ginecología", cantidad: 342, color: "#06B6D4" },
    { especialidad: "Cardiología", cantidad: 234, color: "#2563EB" },
    { especialidad: "Pediatría", cantidad: 198, color: "#10B981" },
    { especialidad: "Dermatología", cantidad: 156, color: "#6366F1" }
  ],

  // Tiempos de atención por especialidad
  tiemposAtencion: [
    { especialidad: "Dermatología", tiempoPromedio: 20, tiempoMinimo: 15, tiempoMaximo: 35 },
    { especialidad: "Pediatría", tiempoPromedio: 22, tiempoMinimo: 18, tiempoMaximo: 40 },
    { especialidad: "Medicina General", tiempoPromedio: 25, tiempoMinimo: 20, tiempoMaximo: 45 },
    { especialidad: "Ginecología", tiempoPromedio: 32, tiempoMinimo: 25, tiempoMaximo: 55 },
    { especialidad: "Cardiología", tiempoPromedio: 35, tiempoMinimo: 30, tiempoMaximo: 60 }
  ],

  // Pacientes por grupo etario
  pacientesPorEdad: [
    { grupo: "0-17 años", cantidad: 234, porcentaje: 18.8 },
    { grupo: "18-30 años", cantidad: 345, porcentaje: 27.7 },
    { grupo: "31-45 años", cantidad: 298, porcentaje: 23.9 },
    { grupo: "46-60 años", cantidad: 234, porcentaje: 18.8 },
    { grupo: "61+ años", cantidad: 136, porcentaje: 10.9 }
  ],

  // Comisiones por médico
  comisionesMedicos: [
    { medico: "Dr. Carlos Sánchez", especialidad: "Medicina General", comisionTotal: 1872, comisionPorcentaje: 10, pacientes: 156 },
    { medico: "Dra. Ana Rodríguez", especialidad: "Ginecología", comisionTotal: 2130, comisionPorcentaje: 10, pacientes: 142 },
    { medico: "Dr. Luis García", especialidad: "Cardiología", comisionTotal: 1960, comisionPorcentaje: 10, pacientes: 98 },
    { medico: "Dra. María López", especialidad: "Pediatría", comisionTotal: 1608, comisionPorcentaje: 10, pacientes: 134 },
    { medico: "Dr. Pedro Martínez", especialidad: "Dermatología", comisionTotal: 1305, comisionPorcentaje: 10, pacientes: 87 }
  ]
};

export default function ReportesMedicoPage() {
  const [filtroPeriodo, setFiltroPeriodo] = useState("ultimo_mes");
  const [filtroEspecialidad, setFiltroEspecialidad] = useState("todas");
  const [filtroMedico, setFiltroMedico] = useState("todos");
  const [busqueda, setBusqueda] = useState("");

  // Filtrar datos según los filtros seleccionados
  const datosFiltrados = useMemo(() => {
    let datos = { ...reportesMock };

    // Aplicar filtros aquí según sea necesario
    // Por ahora retornamos todos los datos
    return datos;
  }, [filtroPeriodo, filtroEspecialidad, filtroMedico, busqueda]);

  const handleExportarReporte = (tipo: string) => {
    console.log(`Exportando reporte: ${tipo}`);
    // Implementar lógica de exportación
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reportes Médicos</h1>
          <p className="text-muted-foreground">
            Análisis de productividad, diagnósticos y rendimiento médico
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros de Reporte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="periodo">Período</Label>
              <Select value={filtroPeriodo} onValueChange={setFiltroPeriodo}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ultima_semana">Última semana</SelectItem>
                  <SelectItem value="ultimo_mes">Último mes</SelectItem>
                  <SelectItem value="ultimos_3_meses">Últimos 3 meses</SelectItem>
                  <SelectItem value="ultimo_ano">Último año</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="especialidad">Especialidad</Label>
              <Select value={filtroEspecialidad} onValueChange={setFiltroEspecialidad}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las especialidades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="medicina_general">Medicina General</SelectItem>
                  <SelectItem value="ginecologia">Ginecología</SelectItem>
                  <SelectItem value="cardiologia">Cardiología</SelectItem>
                  <SelectItem value="pediatria">Pediatría</SelectItem>
                  <SelectItem value="dermatologia">Dermatología</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="medico">Médico</Label>
              <Select value={filtroMedico} onValueChange={setFiltroMedico}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los médicos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="dr_sanchez">Dr. Carlos Sánchez</SelectItem>
                  <SelectItem value="dra_rodriguez">Dra. Ana Rodríguez</SelectItem>
                  <SelectItem value="dr_garcia">Dr. Luis García</SelectItem>
                  <SelectItem value="dra_lopez">Dra. María López</SelectItem>
                  <SelectItem value="dr_martinez">Dr. Pedro Martínez</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="busqueda">Búsqueda</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="busqueda"
                  placeholder="Buscar..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pacientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{datosFiltrados.metricasGenerales.totalPacientes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{datosFiltrados.metricasGenerales.pacientesNuevos} nuevos este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Citas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{datosFiltrados.metricasGenerales.totalCitas.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Promedio: {Math.round(datosFiltrados.metricasGenerales.totalCitas / 12)} por mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">S/ {datosFiltrados.metricasGenerales.ingresosTotales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{datosFiltrados.metricasGenerales.tiempoPromedioAtencion} min</div>
            <p className="text-xs text-muted-foreground">
              Satisfacción: {datosFiltrados.metricasGenerales.satisfaccionPromedio}/5
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Reportes */}
      <Tabs defaultValue="productividad" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="productividad">Productividad</TabsTrigger>
          <TabsTrigger value="diagnosticos">Diagnósticos</TabsTrigger>
          <TabsTrigger value="servicios">Servicios</TabsTrigger>
          <TabsTrigger value="ingresos">Ingresos</TabsTrigger>
          <TabsTrigger value="pacientes">Pacientes</TabsTrigger>
          <TabsTrigger value="comisiones">Comisiones</TabsTrigger>
        </TabsList>

        {/* Tab: Productividad */}
        <TabsContent value="productividad" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Productividad por Médico */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Productividad por Médico
                </CardTitle>
                <CardDescription>
                  Citas atendidas y ingresos generados por profesional
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    citas: { label: "Citas" },
                    ingresos: { label: "Ingresos (S/)" }
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={datosFiltrados.productividadMedicos}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="nombre" 
                        className="text-muted-foreground"
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis className="text-muted-foreground" tick={{ fontSize: 12 }} />
                      <ChartTooltip />
                      <Bar dataKey="citas" fill="var(--chart-1)" name="Citas" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Tiempos de Atención */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Tiempos de Atención
                </CardTitle>
                <CardDescription>
                  Tiempo promedio por especialidad
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    tiempoPromedio: { label: "Tiempo (min)" }
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={datosFiltrados.tiemposAtencion} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" className="text-muted-foreground" tick={{ fontSize: 12 }} />
                      <YAxis dataKey="especialidad" type="category" className="text-muted-foreground" tick={{ fontSize: 12 }} />
                      <ChartTooltip />
                      <Bar dataKey="tiempoPromedio" fill="var(--chart-2)" name="Tiempo Promedio" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Tabla de Productividad */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Detalle de Productividad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Médico</th>
                      <th className="text-left p-2">Especialidad</th>
                      <th className="text-right p-2">Citas</th>
                      <th className="text-right p-2">Ingresos</th>
                      <th className="text-right p-2">Tiempo Prom.</th>
                      <th className="text-right p-2">Satisfacción</th>
                      <th className="text-center p-2">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {datosFiltrados.productividadMedicos.map((medico, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">{medico.nombre}</td>
                        <td className="p-2">
                          <Badge variant="outline">{medico.especialidad}</Badge>
                        </td>
                        <td className="p-2 text-right">{medico.citas}</td>
                        <td className="p-2 text-right">S/ {medico.ingresos.toLocaleString()}</td>
                        <td className="p-2 text-right">{medico.tiempoPromedio} min</td>
                        <td className="p-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <span>{medico.satisfaccion}</span>
                            <Award className="h-4 w-4 text-yellow-500" />
                          </div>
                        </td>
                        <td className="p-2 text-center">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Diagnósticos */}
        <TabsContent value="diagnosticos" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Diagnósticos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Diagnósticos Más Frecuentes
                </CardTitle>
                <CardDescription>
                  Distribución de diagnósticos principales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    cantidad: { label: "Pacientes" }
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <ChartTooltip />
                      {datosFiltrados.diagnosticosFrecuentes.slice(0, 5).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`var(--chart-${(index % 5) + 1})`} />
                      ))}
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Lista de Diagnósticos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Top Diagnósticos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {datosFiltrados.diagnosticosFrecuentes.map((diagnostico, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{diagnostico.diagnostico}</p>
                          <p className="text-sm text-muted-foreground">{diagnostico.cantidad} pacientes</p>
                        </div>
                      </div>
                      <Badge variant="secondary">{diagnostico.porcentaje}%</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Servicios */}
        <TabsContent value="servicios" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Servicios Rentables */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Servicios Más Rentables
                </CardTitle>
                <CardDescription>
                  Ingresos generados por tipo de servicio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    ingresos: { label: "Ingresos (S/)" }
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={datosFiltrados.serviciosRentables}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="servicio" 
                        className="text-muted-foreground"
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis className="text-muted-foreground" tick={{ fontSize: 12 }} />
                      <ChartTooltip />
                      <Bar dataKey="ingresos" fill="var(--chart-3)" name="Ingresos" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Distribución por Especialidades */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Distribución por Especialidades
                </CardTitle>
                <CardDescription>
                  Cantidad de pacientes por especialidad
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    cantidad: { label: "Pacientes" }
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <ChartTooltip />
                      {datosFiltrados.distribucionEspecialidades.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Tabla de Servicios */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Detalle de Servicios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Servicio</th>
                      <th className="text-right p-2">Cantidad</th>
                      <th className="text-right p-2">Precio</th>
                      <th className="text-right p-2">Ingresos</th>
                      <th className="text-right p-2">Utilidad %</th>
                      <th className="text-center p-2">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {datosFiltrados.serviciosRentables.map((servicio, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">{servicio.servicio}</td>
                        <td className="p-2 text-right">{servicio.cantidad}</td>
                        <td className="p-2 text-right">S/ {servicio.precio}</td>
                        <td className="p-2 text-right">S/ {servicio.ingresos.toLocaleString()}</td>
                        <td className="p-2 text-right">
                          <Badge variant={servicio.utilidad > 50 ? "default" : "secondary"}>
                            {servicio.utilidad}%
                          </Badge>
                        </td>
                        <td className="p-2 text-center">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Ingresos */}
        <TabsContent value="ingresos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Evolución de Ingresos
              </CardTitle>
              <CardDescription>
                Tendencia de ingresos mensuales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  ingresos: { label: "Ingresos (S/)" },
                  citas: { label: "Citas" }
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={datosFiltrados.ingresosMensuales}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="mes" className="text-muted-foreground" tick={{ fontSize: 12 }} />
                    <YAxis className="text-muted-foreground" tick={{ fontSize: 12 }} />
                    <ChartTooltip />
                    <Line 
                      type="monotone" 
                      dataKey="ingresos" 
                      stroke="var(--chart-1)" 
                      strokeWidth={2}
                      name="Ingresos"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="citas" 
                      stroke="var(--chart-2)" 
                      strokeWidth={2}
                      name="Citas"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Pacientes */}
        <TabsContent value="pacientes" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Distribución por Edad */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Pacientes por Grupo Etario
                </CardTitle>
                <CardDescription>
                  Distribución de pacientes por edad
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    cantidad: { label: "Pacientes" }
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={datosFiltrados.pacientesPorEdad}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="grupo" className="text-muted-foreground" tick={{ fontSize: 12 }} />
                      <YAxis className="text-muted-foreground" tick={{ fontSize: 12 }} />
                      <ChartTooltip />
                      <Bar dataKey="cantidad" fill="var(--chart-4)" name="Pacientes" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Resumen de Pacientes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Resumen de Pacientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Pacientes Nuevos</p>
                        <p className="text-sm text-muted-foreground">Este mes</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{datosFiltrados.metricasGenerales.pacientesNuevos}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                        <Heart className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium">Pacientes Continuadores</p>
                        <p className="text-sm text-muted-foreground">Control regular</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{datosFiltrados.metricasGenerales.pacientesContinuadores}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                        <Stethoscope className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium">Total de Pacientes</p>
                        <p className="text-sm text-muted-foreground">Registrados</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{datosFiltrados.metricasGenerales.totalPacientes}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Comisiones */}
        <TabsContent value="comisiones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Comisiones por Médico
              </CardTitle>
              <CardDescription>
                Comisiones generadas por profesional médico
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Médico</th>
                      <th className="text-left p-2">Especialidad</th>
                      <th className="text-right p-2">Pacientes</th>
                      <th className="text-right p-2">Comisión %</th>
                      <th className="text-right p-2">Comisión Total</th>
                      <th className="text-center p-2">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {datosFiltrados.comisionesMedicos.map((medico, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">{medico.medico}</td>
                        <td className="p-2">
                          <Badge variant="outline">{medico.especialidad}</Badge>
                        </td>
                        <td className="p-2 text-right">{medico.pacientes}</td>
                        <td className="p-2 text-right">{medico.comisionPorcentaje}%</td>
                        <td className="p-2 text-right font-medium">S/ {medico.comisionTotal.toLocaleString()}</td>
                        <td className="p-2 text-center">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
