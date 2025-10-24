'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, RadialBarChart, RadialBar, 
  PolarGrid, PolarRadiusAxis, Label, LabelList
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Users, Calendar, Clock, DollarSign, 
  Activity, HeartPulse, Stethoscope, RefreshCw, Filter, 
  CheckCircle, XCircle, AlertTriangle, Eye, User
} from 'lucide-react';

// Mock data para estadísticas médicas
const citasPorMes = [
  { mes: 'Ene', citas: 45, ingresos: 3600 },
  { mes: 'Feb', citas: 52, ingresos: 4160 },
  { mes: 'Mar', citas: 38, ingresos: 3040 },
  { mes: 'Abr', citas: 61, ingresos: 4880 },
  { mes: 'May', citas: 48, ingresos: 3840 },
  { mes: 'Jun', citas: 55, ingresos: 4400 },
  { mes: 'Jul', citas: 42, ingresos: 3360 },
  { mes: 'Ago', citas: 58, ingresos: 4640 },
  { mes: 'Sep', citas: 49, ingresos: 3920 },
  { mes: 'Oct', citas: 67, ingresos: 5360 },
  { mes: 'Nov', citas: 53, ingresos: 4240 },
  { mes: 'Dic', citas: 44, ingresos: 3520 }
];

const distribucionEspecialidades = [
  { especialidad: 'Ginecología', citas: 180, porcentaje: 35, color: '#0EA5A8' },
  { especialidad: 'Obstetricia', citas: 120, porcentaje: 23, color: '#06B6D4' },
  { especialidad: 'Medicina General', citas: 95, porcentaje: 18, color: '#2563EB' },
  { especialidad: 'Pediatría', citas: 78, porcentaje: 15, color: '#10B981' },
  { especialidad: 'Otras', citas: 45, porcentaje: 9, color: '#6366F1' }
];

const tiempoPromedioAtencion = [
  { especialidad: 'Ginecología', tiempo: 28, meta: 30 },
  { especialidad: 'Obstetricia', tiempo: 35, meta: 40 },
  { especialidad: 'Medicina General', tiempo: 22, meta: 25 },
  { especialidad: 'Pediatría', tiempo: 18, meta: 20 }
];

const satisfaccionPacientes = [
  { mes: 'Ene', satisfaccion: 4.2 },
  { mes: 'Feb', satisfaccion: 4.5 },
  { mes: 'Mar', satisfaccion: 4.1 },
  { mes: 'Abr', satisfaccion: 4.7 },
  { mes: 'May', satisfaccion: 4.3 },
  { mes: 'Jun', satisfaccion: 4.6 },
  { mes: 'Jul', satisfaccion: 4.4 },
  { mes: 'Ago', satisfaccion: 4.8 },
  { mes: 'Sep', satisfaccion: 4.5 },
  { mes: 'Oct', satisfaccion: 4.9 },
  { mes: 'Nov', satisfaccion: 4.6 },
  { mes: 'Dic', satisfaccion: 4.7 }
];

const estadisticasGenerales = {
  totalCitas: 518,
  citasMesActual: 67,
  tiempoPromedio: 25.8,
  satisfaccionPromedio: 4.6,
  ingresosTotales: 41440,
  ingresosMesActual: 5360,
  pacientesUnicos: 312,
  tasaCancelacion: 8.5
};

export default function EstadisticasMedicasPage() {
  const [periodo, setPeriodo] = useState('mes');
  const [especialidad, setEspecialidad] = useState('todas');

  // Configuración de gráficos
  const chartConfigCitas: ChartConfig = {
    citas: {
      label: "Citas",
      color: "var(--chart-1)",
    },
    ingresos: {
      label: "Ingresos",
      color: "var(--chart-2)",
    },
  };

  const chartConfigEspecialidades: ChartConfig = {
    citas: {
      label: "Citas",
    },
    ginecologia: {
      label: "Ginecología",
      color: "var(--chart-1)",
    },
    obstetricia: {
      label: "Obstetricia", 
      color: "var(--chart-2)",
    },
    medicinaGeneral: {
      label: "Medicina General",
      color: "var(--chart-3)",
    },
    pediatria: {
      label: "Pediatría",
      color: "var(--chart-4)",
    },
    otras: {
      label: "Otras",
      color: "var(--chart-5)",
    },
  };

  const chartConfigTiempo: ChartConfig = {
    tiempo: {
      label: "Tiempo (min)",
      color: "var(--chart-1)",
    },
    meta: {
      label: "Meta (min)",
      color: "var(--chart-2)",
    },
  };

  const chartConfigSatisfaccion: ChartConfig = {
    satisfaccion: {
      label: "Satisfacción",
      color: "var(--chart-1)",
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Estadísticas Médicas</h1>
          <p className="text-muted-foreground">
            Análisis de rendimiento y métricas de atención médica
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dia">Día</SelectItem>
              <SelectItem value="semana">Semana</SelectItem>
              <SelectItem value="mes">Mes</SelectItem>
              <SelectItem value="año">Año</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Citas</p>
                <p className="text-2xl font-bold">{estadisticasGenerales.totalCitas}</p>
                <p className="text-xs text-green-600">+12% vs mes anterior</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Citas Este Mes</p>
                <p className="text-2xl font-bold text-blue-600">{estadisticasGenerales.citasMesActual}</p>
                <p className="text-xs text-green-600">+8% vs mes anterior</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tiempo Promedio</p>
                <p className="text-2xl font-bold text-purple-600">{estadisticasGenerales.tiempoPromedio} min</p>
                <p className="text-xs text-green-600">-2 min vs mes anterior</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Satisfacción</p>
                <p className="text-2xl font-bold text-emerald-600">{estadisticasGenerales.satisfaccionPromedio}/5</p>
                <p className="text-xs text-green-600">+0.2 vs mes anterior</p>
              </div>
              <HeartPulse className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ingresos Totales</p>
                <p className="text-2xl font-bold text-green-600">S/ {estadisticasGenerales.ingresosTotales.toLocaleString()}</p>
                <p className="text-xs text-green-600">+15% vs mes anterior</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ingresos Este Mes</p>
                <p className="text-2xl font-bold text-indigo-600">S/ {estadisticasGenerales.ingresosMesActual.toLocaleString()}</p>
                <p className="text-xs text-green-600">+10% vs mes anterior</p>
              </div>
              <TrendingUp className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pacientes Únicos</p>
                <p className="text-2xl font-bold text-orange-600">{estadisticasGenerales.pacientesUnicos}</p>
                <p className="text-xs text-green-600">+5% vs mes anterior</p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tasa Cancelación</p>
                <p className="text-2xl font-bold text-red-600">{estadisticasGenerales.tasaCancelacion}%</p>
                <p className="text-xs text-red-600">+1.2% vs mes anterior</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos Principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Citas por Mes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Citas e Ingresos por Mes
            </CardTitle>
            <CardDescription>Evolución mensual de citas y ingresos</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfigCitas} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={citasPorMes}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="mes" 
                    className="text-muted-foreground"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    yAxisId="left" 
                    className="text-muted-foreground"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    className="text-muted-foreground"
                    tick={{ fontSize: 12 }}
                  />
                  <ChartTooltip>
                    <ChartTooltipContent />
                  </ChartTooltip>
                  <Bar 
                    yAxisId="left" 
                    dataKey="citas" 
                    fill="var(--chart-1)" 
                    radius={[4, 4, 0, 0]}
                    name="Citas"
                  />
                  <Bar 
                    yAxisId="right" 
                    dataKey="ingresos" 
                    fill="var(--chart-2)" 
                    radius={[4, 4, 0, 0]}
                    name="Ingresos (S/)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Distribución por Especialidades */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              Distribución por Especialidades
            </CardTitle>
            <CardDescription>Distribución de citas por especialidad médica</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfigEspecialidades} className="mx-auto aspect-square max-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <ChartTooltip>
                    <ChartTooltipContent />
                  </ChartTooltip>
                  <Pie
                    data={distribucionEspecialidades}
                    dataKey="citas"
                    nameKey="especialidad"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={60}
                    strokeWidth={5}
                  >
                    {distribucionEspecialidades.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-foreground text-2xl font-bold"
                              >
                                {distribucionEspecialidades.reduce((acc, curr) => acc + curr.citas, 0)}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 20}
                                className="fill-muted-foreground text-sm"
                              >
                                Total Citas
                              </tspan>
                            </text>
                          )
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="mt-4 space-y-2">
              {distribucionEspecialidades.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-foreground">{item.especialidad}</span>
                  </div>
                  <span className="text-muted-foreground">{item.citas} citas ({item.porcentaje}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos Secundarios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tiempo Promedio de Atención */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Tiempo Promedio de Atención
            </CardTitle>
            <CardDescription>Comparación con metas establecidas</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfigTiempo} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tiempoPromedioAtencion} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    type="number" 
                    className="text-muted-foreground"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    dataKey="especialidad" 
                    type="category" 
                    width={120}
                    className="text-muted-foreground"
                    tick={{ fontSize: 12 }}
                  />
                  <ChartTooltip>
                    <ChartTooltipContent />
                  </ChartTooltip>
                  <Bar 
                    dataKey="tiempo" 
                    fill="var(--chart-1)" 
                    radius={[0, 4, 4, 0]}
                    name="Tiempo Real (min)"
                  />
                  <Bar 
                    dataKey="meta" 
                    fill="var(--chart-2)" 
                    radius={[0, 4, 4, 0]}
                    name="Meta (min)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Satisfacción de Pacientes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HeartPulse className="h-5 w-5" />
              Satisfacción de Pacientes
            </CardTitle>
            <CardDescription>Evolución de la satisfacción mensual</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfigSatisfaccion} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={satisfaccionPacientes}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="mes" 
                    className="text-muted-foreground"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    domain={[3, 5]} 
                    className="text-muted-foreground"
                    tick={{ fontSize: 12 }}
                  />
                  <ChartTooltip>
                    <ChartTooltipContent />
                  </ChartTooltip>
                  <Line 
                    type="monotone" 
                    dataKey="satisfaccion" 
                    stroke="var(--chart-1)" 
                    strokeWidth={3}
                    dot={{ fill: "var(--chart-1)", strokeWidth: 2, r: 4 }}
                    name="Satisfacción (/5)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico Radial de Rendimiento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Indicador de Rendimiento General */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Rendimiento General
            </CardTitle>
            <CardDescription>Puntuación general de rendimiento médico</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="mx-auto aspect-square max-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  data={[{ value: 87, fill: 'var(--chart-1)' }]}
                  startAngle={90}
                  endAngle={-270}
                  innerRadius="60%"
                  outerRadius="90%"
                  barSize={20}
                >
                  <PolarGrid />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]} 
                    tick={false}
                    axisLine={false}
                  />
                  <RadialBar
                    dataKey="value"
                    cornerRadius={10}
                    fill="var(--chart-1)"
                  />
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              87%
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground text-sm"
                            >
                              Rendimiento
                            </tspan>
                          </text>
                        )
                      }
                    }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Barras con Etiquetas Personalizadas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Citas por Especialidad
            </CardTitle>
            <CardDescription>Distribución horizontal con etiquetas</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfigEspecialidades} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={distribucionEspecialidades}
                  layout="vertical"
                  margin={{ right: 16 }}
                >
                  <CartesianGrid horizontal={false} className="stroke-muted" />
                  <YAxis
                    dataKey="especialidad"
                    type="category"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                  />
                  <XAxis dataKey="citas" type="number" hide />
                  <ChartTooltip>
                    <ChartTooltipContent />
                  </ChartTooltip>
                  <Bar
                    dataKey="citas"
                    fill="var(--chart-1)"
                    radius={[0, 4, 4, 0]}
                  >
                    <LabelList
                      dataKey="especialidad"
                      position="insideLeft"
                      offset={8}
                      className="fill-foreground"
                      fontSize={12}
                    />
                    <LabelList
                      dataKey="citas"
                      position="right"
                      offset={8}
                      className="fill-foreground"
                      fontSize={12}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Métricas de Rendimiento */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Eficiencia por Especialidad */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Eficiencia por Especialidad
            </CardTitle>
            <CardDescription>Rendimiento comparativo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {tiempoPromedioAtencion.map((item, index) => {
              const eficiencia = ((item.meta - item.tiempo) / item.meta) * 100;
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                  <div>
                    <p className="font-medium">{item.especialidad}</p>
                    <p className="text-sm text-muted-foreground">{item.tiempo} min / {item.meta} min</p>
                  </div>
                  <div className="text-right">
                    <Badge className={eficiencia > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {eficiencia > 0 ? '+' : ''}{eficiencia.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Top Especialidades */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Especialidades
            </CardTitle>
            <CardDescription>Ranking por número de citas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {distribucionEspecialidades
              .sort((a, b) => b.citas - a.citas)
              .map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{item.especialidad}</p>
                      <p className="text-sm text-muted-foreground">{item.citas} citas</p>
                    </div>
                  </div>
                  <Badge variant="outline">{item.porcentaje}%</Badge>
                </div>
              ))}
          </CardContent>
        </Card>

        {/* Resumen de Rendimiento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Resumen de Rendimiento
            </CardTitle>
            <CardDescription>Métricas clave del período</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium">Citas Atendidas</span>
              </div>
              <span className="text-lg font-bold text-green-600">95.2%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Puntualidad</span>
              </div>
              <span className="text-lg font-bold text-blue-600">87.5%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2">
                <HeartPulse className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Satisfacción</span>
              </div>
              <span className="text-lg font-bold text-purple-600">4.6/5</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                <span className="font-medium">Crecimiento</span>
              </div>
              <span className="text-lg font-bold text-orange-600">+12%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
