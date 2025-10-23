'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// Removed unused chart imports
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Label,
  Tooltip
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Activity, 
  Calendar,
  HelpCircle,
  Eye,
  Download,
  Filter
} from "lucide-react";

// Datos para gráficos basados en la imagen
const costosProduccionData = [
  { name: "Profesionales", value: 85, amount: 21251.70, fill: "var(--chart-1)" },
  { name: "Laboratorio", value: 15, amount: 3750.30, fill: "var(--chart-2)" }
];

const ventasProfesionalData = [
  { name: "LUIS ALVARADO E", ventas: 18500 },
  { name: "ARNALDO MARAVI", ventas: 16200 },
  { name: "MARIELA JOHANA", ventas: 14800 },
  { name: "MIGUEL BRANDO M", ventas: 13500 },
  { name: "JACKELINE FIORE", ventas: 12200 },
  { name: "JOSE RAM", ventas: 10800 },
  { name: "JOSE LUIS SOPLO", ventas: 9500 },
  { name: "RICARDO JHONATA", ventas: 8200 },
  { name: "TOPICO SEGUIMI", ventas: 6800 },
  { name: "JOSE CARLOS CAS", ventas: 5500 }
];

const eficienciaProfesionalData = [
  { name: "LABORATORIO FEM", eficiencia: 485 },
  { name: "LUIS ALVARADO E", eficiencia: 420 },
  { name: "ARNALDO MARAVI", eficiencia: 380 },
  { name: "MARIELA JOHANA", eficiencia: 350 },
  { name: "MIGUEL BRANDO M", eficiencia: 320 },
  { name: "JACKELINE FIORE", eficiencia: 290 },
  { name: "JOSE RAM", eficiencia: 260 },
  { name: "JOSE LUIS SOPLO", eficiencia: 230 },
  { name: "RICARDO JHONATA", eficiencia: 200 },
  { name: "TOPICO SEGUIMI", eficiencia: 170 },
  { name: "JOSE CARLOS CAS", eficiencia: 140 }
];

const atencionesTipoPacienteData = [
  { name: "GINECOLOGÍA", value: 27, fill: "#FFD700" },
  { name: "GESTANTE", value: 26, fill: "#32CD32" },
  { name: "NO CALIFICADO", value: 12, fill: "#FF4500" },
  { name: "PREVENCIÓN", value: 10, fill: "#228B22" },
  { name: "CÁNCER", value: 9, fill: "#9370DB" },
  { name: "PEDIATRÍA", value: 5, fill: "#FFA500" },
  { name: "INFERTILIDAD", value: 4, fill: "#DDA0DD" },
  { name: "Otros", value: 7, fill: "#696969" }
];

const atencionesConvenioData = [
  { name: "Sin Convenio", value: 100, fill: "#FFD700" }
];

const ventasConvenioData = [
  { name: "Sin Convenio", value: 100, fill: "#FFD700" }
];

// Chart configuration removed - using direct Recharts implementation

export default function AdministradorDashboard() {
  const totalCostos = costosProduccionData.reduce((acc, curr) => acc + curr.amount, 0);
  const totalVentas = ventasProfesionalData.reduce((acc, curr) => acc + curr.ventas, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard Administrativo</h1>
              <p className="text-sm text-muted-foreground">
                Resumen ejecutivo de FEMINIS SALUD - Octubre 2024
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Eye className="h-4 w-4 mr-2" />
                Ver Detalles
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
                  <p className="text-sm text-muted-foreground">Total Pacientes</p>
                  <p className="text-2xl font-bold text-primary">1,247</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-success">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ingresos Octubre</p>
                  <p className="text-2xl font-bold text-success">S/ {totalVentas.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-info">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Atenciones</p>
                  <p className="text-2xl font-bold text-info">892</p>
                </div>
                <Activity className="h-8 w-8 text-info" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-warning">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Citas Programadas</p>
                  <p className="text-2xl font-bold text-warning">156</p>
                </div>
                <Calendar className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos Principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
          {/* Costos de Producción */}
          <Card className="border-primary/10">
            <CardHeader className="bg-primary/5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-primary text-sm font-semibold">
                  COSTOS PRODUCCIÓN OCTUBRE (TEÓRICOS)
                </CardTitle>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-warning">S/.{totalCostos.toLocaleString()}</div>
              </div>
              <div className="mx-auto aspect-square max-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip />
                    <Pie
                      data={costosProduccionData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={40}
                      outerRadius={80}
                      strokeWidth={5}
                    >
                      {costosProduccionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                {costosProduccionData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="text-xs font-medium">{item.name} {item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Ventas por Profesional */}
          <Card className="border-primary/10">
            <CardHeader className="bg-primary/5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-primary text-sm font-semibold">
                  VENTAS POR PROFESIONAL OCTUBRE (S/. VENDIDO)
                </CardTitle>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-chart-1 rounded"></div>
                <span className="text-xs font-medium">Ventas</span>
              </div>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={ventasProfesionalData}
                    layout="vertical"
                    margin={{ right: 16 }}
                  >
                    <CartesianGrid horizontal={false} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => value.split(' ')[0]}
                      fontSize={10}
                    />
                    <XAxis dataKey="ventas" type="number" hide />
                    <Tooltip />
                    <Bar
                      dataKey="ventas"
                      fill="var(--chart-1)"
                      radius={4}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Eficiencia por Profesional */}
          <Card className="border-primary/10">
            <CardHeader className="bg-primary/5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-primary text-sm font-semibold">
                  EFICIENCIA POR PROFESIONAL OCTUBRE (S/HR ATENDIDA)
                </CardTitle>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-chart-1 rounded"></div>
                <span className="text-xs font-medium">Eficiencia</span>
              </div>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={eficienciaProfesionalData}
                    layout="vertical"
                    margin={{ right: 16 }}
                  >
                    <CartesianGrid horizontal={false} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => value.split(' ')[0]}
                      fontSize={10}
                    />
                    <XAxis dataKey="eficiencia" type="number" hide />
                    <Tooltip />
                    <Bar
                      dataKey="eficiencia"
                      fill="var(--chart-1)"
                      radius={4}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Segunda Fila de Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Atenciones por Tipo de Paciente */}
          <Card className="border-primary/10">
            <CardHeader className="bg-primary/5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-primary text-sm font-semibold">
                  ATENCIONES POR TIPO DE PACIENTE OCTUBRE
                </CardTitle>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="mx-auto aspect-square max-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip />
                    <Pie
                      data={atencionesTipoPacienteData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={40}
                      outerRadius={80}
                      strokeWidth={5}
                    >
                      {atencionesTipoPacienteData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {atencionesTipoPacienteData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="text-xs font-medium">{item.name} {item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Atenciones por Convenio */}
          <Card className="border-primary/10">
            <CardHeader className="bg-primary/5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-primary text-sm font-semibold">
                  ATENCIONES POR TIPO DE CONVENIO OCTUBRE
                </CardTitle>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="mx-auto aspect-square max-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip />
                    <Pie
                      data={atencionesConvenioData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={40}
                      outerRadius={80}
                      strokeWidth={5}
                    >
                      {atencionesConvenioData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center mt-4">
                {atencionesConvenioData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="text-xs font-medium">{item.name} {item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Ventas por Convenio */}
          <Card className="border-primary/10">
            <CardHeader className="bg-primary/5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-primary text-sm font-semibold">
                  VENTAS POR CONVENIO OCTUBRE
                </CardTitle>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="mx-auto aspect-square max-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip />
                    <Pie
                      data={ventasConvenioData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={40}
                      outerRadius={80}
                      strokeWidth={5}
                    >
                      {ventasConvenioData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center mt-4">
                {ventasConvenioData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="text-xs font-medium">{item.name} {item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alertas y Notificaciones */}
        <div className="mt-6">
          <Card className="border-warning bg-warning/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-warning">
                <Activity className="h-5 w-5" />
                Alertas y Notificaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-background rounded border border-warning/20">
                  <div className="w-2 h-2 bg-destructive rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Stock Bajo en Farmacia</p>
                    <p className="text-xs text-muted-foreground">9 productos requieren reposición</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-background rounded border border-warning/20">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Citas Pendientes</p>
                    <p className="text-xs text-muted-foreground">23 citas sin confirmar</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-background rounded border border-warning/20">
                  <div className="w-2 h-2 bg-info rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Reportes Mensuales</p>
                    <p className="text-xs text-muted-foreground">Listos para revisión</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
