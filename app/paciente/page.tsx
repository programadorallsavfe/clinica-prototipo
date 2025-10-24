'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartConfig 
} from '@/components/ui/chart';
import { 
  Calendar, 
  Clock, 
  HeartPulse, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Stethoscope,
  Pill,
  FlaskConical,
  RefreshCw,
  Eye,
  Download
} from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Pie, PieChart, Cell, ResponsiveContainer as PieResponsiveContainer } from 'recharts';
import { RadialBar, RadialBarChart, PolarGrid, PolarRadiusAxis } from 'recharts';
import { getSession } from '@/lib/auth';
import { pacientesStorage, citasStorage, doctoresStorage, especialidadesStorage, ordenesStorage, registrosClinicosStorage, Paciente } from '@/lib/storage';

// Mock data para estadísticas del paciente
const estadisticasMock = {
  citasPorMes: [
    { mes: 'Ene', citas: 2, completadas: 2 },
    { mes: 'Feb', citas: 3, completadas: 2 },
    { mes: 'Mar', citas: 1, completadas: 1 },
    { mes: 'Abr', citas: 4, completadas: 3 },
    { mes: 'May', citas: 2, completadas: 2 },
    { mes: 'Jun', citas: 3, completadas: 2 }
  ],
  especialidadesFrecuentes: [
    { especialidad: 'Ginecología', citas: 8, fill: 'var(--chart-1)' },
    { especialidad: 'Medicina General', citas: 4, fill: 'var(--chart-2)' },
    { especialidad: 'Obstetricia', citas: 3, fill: 'var(--chart-3)' },
    { especialidad: 'Pediatría', citas: 2, fill: 'var(--chart-4)' }
  ],
  gastosPorMes: [
    { mes: 'Ene', gastos: 240 },
    { mes: 'Feb', gastos: 360 },
    { mes: 'Mar', gastos: 120 },
    { mes: 'Abr', gastos: 480 },
    { mes: 'May', gastos: 240 },
    { mes: 'Jun', gastos: 360 }
  ],
  saludGeneral: {
    puntuacion: 85,
    tendencia: 'mejorando'
  }
};

export default function PacientePage() {
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [periodo, setPeriodo] = useState('6meses');
  const [estadisticas, setEstadisticas] = useState(estadisticasMock);

  useEffect(() => {
    const session = getSession();
    if (session?.userId) {
      cargarDatosPaciente(session.userId);
    }
  }, []);

  const cargarDatosPaciente = (usuarioId: string) => {
    const pac = pacientesStorage.findOne((p: Paciente) => p.usuarioId === usuarioId);
    if (pac) {
      setPaciente(pac);
    }
  };

  // Configuración de gráficos
  const chartConfigCitas: ChartConfig = {
    citas: {
      label: "Citas Programadas",
      color: "var(--chart-1)",
    },
    completadas: {
      label: "Citas Completadas",
      color: "var(--chart-2)",
    },
  };

  const chartConfigGastos: ChartConfig = {
    gastos: {
      label: "Gastos (S/)",
      color: "var(--chart-3)",
    },
  };

  // Calcular métricas
  const metricas = useMemo(() => {
    const totalCitas = estadisticas.citasPorMes.reduce((sum, item) => sum + item.citas, 0);
    const totalCompletadas = estadisticas.citasPorMes.reduce((sum, item) => sum + item.completadas, 0);
    const totalGastos = estadisticas.gastosPorMes.reduce((sum, item) => sum + item.gastos, 0);
    const promedioGastos = totalGastos / estadisticas.gastosPorMes.length;
    const tasaAsistencia = totalCitas > 0 ? (totalCompletadas / totalCitas) * 100 : 0;

    return {
      totalCitas,
      totalCompletadas,
      totalGastos,
      promedioGastos,
      tasaAsistencia
    };
  }, [estadisticas]);


  return (
    <div className="space-y-6 bg-background text-foreground min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mi Dashboard de Salud</h1>
          <p className="text-muted-foreground">
            Bienvenido, {paciente?.nombres || 'Paciente'} - Resumen de tu actividad médica
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3meses">Últimos 3 meses</SelectItem>
              <SelectItem value="6meses">Últimos 6 meses</SelectItem>
              <SelectItem value="1año">Último año</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Citas</p>
                <p className="text-2xl font-bold text-foreground">{metricas.totalCitas}</p>
                <p className="text-xs text-muted-foreground">Últimos 6 meses</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tasa de Asistencia</p>
                <p className="text-2xl font-bold text-foreground">{metricas.tasaAsistencia.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">Citas completadas</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Gastos Totales</p>
                <p className="text-2xl font-bold text-foreground">S/ {metricas.totalGastos}</p>
                <p className="text-xs text-muted-foreground">Promedio: S/ {metricas.promedioGastos.toFixed(0)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Salud General</p>
                <p className="text-2xl font-bold text-foreground">{estadisticas.saludGeneral.puntuacion}/100</p>
                <div className="flex items-center gap-1">
                  {estadisticas.saludGeneral.tendencia === 'mejorando' ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <span className="text-xs text-muted-foreground capitalize">
                    {estadisticas.saludGeneral.tendencia}
                  </span>
                </div>
              </div>
              <HeartPulse className="h-8 w-8 text-red-600" />
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
              Citas por Mes
            </CardTitle>
            <CardDescription>
              Seguimiento de citas programadas vs completadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfigCitas} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={estadisticas.citasPorMes}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="mes" 
                    className="text-muted-foreground"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis className="text-muted-foreground" tick={{ fontSize: 12 }} />
                  <ChartTooltip>
                    <ChartTooltipContent />
                  </ChartTooltip>
                  <Bar 
                    dataKey="citas" 
                    fill="var(--chart-1)" 
                    radius={[4, 4, 0, 0]}
                    name="Programadas"
                  />
                  <Bar 
                    dataKey="completadas" 
                    fill="var(--chart-2)" 
                    radius={[4, 4, 0, 0]}
                    name="Completadas"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Gastos por Mes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Gastos Médicos
            </CardTitle>
            <CardDescription>
              Evolución de gastos en servicios médicos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfigGastos} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={estadisticas.gastosPorMes}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="mes" 
                    className="text-muted-foreground"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis className="text-muted-foreground" tick={{ fontSize: 12 }} />
                  <ChartTooltip>
                    <ChartTooltipContent />
                  </ChartTooltip>
                  <Bar 
                    dataKey="gastos" 
                    fill="var(--chart-3)" 
                    radius={[4, 4, 0, 0]}
                    name="Gastos (S/)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos Secundarios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Especialidades Frecuentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              Especialidades Frecuentes
            </CardTitle>
            <CardDescription>
              Distribución de citas por especialidad médica
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[300px]">
              <PieResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={estadisticas.especialidadesFrecuentes}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="citas"
                  >
                    {estadisticas.especialidadesFrecuentes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip>
                    <ChartTooltipContent />
                  </ChartTooltip>
                </PieChart>
              </PieResponsiveContainer>
            </ChartContainer>
            <div className="mt-4 space-y-2">
              {estadisticas.especialidadesFrecuentes.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="text-foreground">{item.especialidad}</span>
                  </div>
                  <span className="text-muted-foreground">{item.citas} citas</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Indicador de Salud General */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HeartPulse className="h-5 w-5" />
              Indicador de Salud
            </CardTitle>
            <CardDescription>
              Puntuación general de tu salud basada en seguimiento médico
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[300px]">
              <ChartContainer config={{}} className="h-[250px] w-[250px]">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="90%"
                  barSize={20}
                  data={[{ value: estadisticas.saludGeneral.puntuacion, fill: 'var(--chart-1)' }]}
                  startAngle={90}
                  endAngle={-270}
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
                </RadialBarChart>
              </ChartContainer>
            </div>
            <div className="text-center mt-4">
              <p className="text-3xl font-bold text-foreground">
                {estadisticas.saludGeneral.puntuacion}/100
              </p>
              <p className="text-sm text-muted-foreground">Puntuación de Salud</p>
              <Badge 
                className={`mt-2 ${
                  estadisticas.saludGeneral.puntuacion >= 80 
                    ? 'bg-green-100 text-green-800' 
                    : estadisticas.saludGeneral.puntuacion >= 60 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {estadisticas.saludGeneral.puntuacion >= 80 
                  ? 'Excelente' 
                  : estadisticas.saludGeneral.puntuacion >= 60 
                  ? 'Buena' 
                  : 'Necesita Atención'
                }
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumen de Actividad Reciente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Resumen de Actividad
          </CardTitle>
          <CardDescription>
            Información detallada de tu actividad médica reciente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Próximas Citas
              </h4>
              <div className="space-y-2">
                <div className="p-3 bg-accent/50 rounded-lg">
                  <p className="text-sm font-medium text-foreground">Ginecología</p>
                  <p className="text-xs text-muted-foreground">15 Dic 2024 - 10:00 AM</p>
                  <p className="text-xs text-muted-foreground">Dr. Ana Rodríguez</p>
                </div>
                <div className="p-3 bg-accent/50 rounded-lg">
                  <p className="text-sm font-medium text-foreground">Control General</p>
                  <p className="text-xs text-muted-foreground">22 Dic 2024 - 2:00 PM</p>
                  <p className="text-xs text-muted-foreground">Dr. Carlos Sánchez</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <Pill className="h-4 w-4" />
                Medicamentos Activos
              </h4>
              <div className="space-y-2">
                <div className="p-3 bg-accent/50 rounded-lg">
                  <p className="text-sm font-medium text-foreground">Ácido Fólico</p>
                  <p className="text-xs text-muted-foreground">1 comprimido diario</p>
                  <p className="text-xs text-muted-foreground">Hasta: 15 Ene 2025</p>
                </div>
                <div className="p-3 bg-accent/50 rounded-lg">
                  <p className="text-sm font-medium text-foreground">Hierro</p>
                  <p className="text-xs text-muted-foreground">1 comprimido diario</p>
                  <p className="text-xs text-muted-foreground">Hasta: 20 Ene 2025</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <FlaskConical className="h-4 w-4" />
                Exámenes Pendientes
              </h4>
              <div className="space-y-2">
                <div className="p-3 bg-accent/50 rounded-lg">
                  <p className="text-sm font-medium text-foreground">Hemograma Completo</p>
                  <p className="text-xs text-muted-foreground">Programado: 18 Dic 2024</p>
                  <Badge variant="outline" className="text-xs">Pendiente</Badge>
                </div>
                <div className="p-3 bg-accent/50 rounded-lg">
                  <p className="text-sm font-medium text-foreground">Ecografía Obstétrica</p>
                  <p className="text-xs text-muted-foreground">Programado: 20 Dic 2024</p>
                  <Badge variant="outline" className="text-xs">Pendiente</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Acciones Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Accede rápidamente a las funciones más utilizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Calendar className="h-6 w-6" />
              <span className="text-sm">Agendar Cita</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Eye className="h-6 w-6" />
              <span className="text-sm">Ver Historial</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Download className="h-6 w-6" />
              <span className="text-sm">Descargar Reporte</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <HeartPulse className="h-6 w-6" />
              <span className="text-sm">Emergencias</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
