"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Calendar,
  Calculator,
  Target,
  BarChart3,
  Activity,
  AlertTriangle,
  CheckCircle,
  Eye,
  Heart,
  Baby,
  Stethoscope,
  TestTube
} from "lucide-react";

interface ReporteCostosUtilidadesProps {
  periodo: 'dia' | 'mes' | 'año';
}

export default function ReporteCostosUtilidades({ periodo = 'mes' }: ReporteCostosUtilidadesProps) {
  
  // Mock data para reportes de costos y utilidades
  const costosData = {
    dia: [
      { 
        fecha: "2024-10-20", 
        consultaMedica: { cantidad: 8, costo: 40, precio: 80, utilidad: 40 },
        controlPrenatal: { cantidad: 5, costo: 30, precio: 60, utilidad: 30 },
        ecografiaSimple: { cantidad: 3, costo: 25, precio: 50, utilidad: 25 },
        ecografiaEspecial: { cantidad: 2, costo: 40, precio: 80, utilidad: 40 },
        pap: { cantidad: 4, costo: 15, precio: 30, utilidad: 15 },
        colposcopia: { cantidad: 1, costo: 30, precio: 60, utilidad: 30 }
      },
      { 
        fecha: "2024-10-21", 
        consultaMedica: { cantidad: 10, costo: 50, precio: 100, utilidad: 50 },
        controlPrenatal: { cantidad: 6, costo: 36, precio: 72, utilidad: 36 },
        ecografiaSimple: { cantidad: 4, costo: 33, precio: 66, utilidad: 33 },
        ecografiaEspecial: { cantidad: 3, costo: 60, precio: 120, utilidad: 60 },
        pap: { cantidad: 5, costo: 19, precio: 38, utilidad: 19 },
        colposcopia: { cantidad: 2, costo: 60, precio: 120, utilidad: 60 }
      },
      { 
        fecha: "2024-10-22", 
        consultaMedica: { cantidad: 7, costo: 35, precio: 70, utilidad: 35 },
        controlPrenatal: { cantidad: 4, costo: 24, precio: 48, utilidad: 24 },
        ecografiaSimple: { cantidad: 2, costo: 17, precio: 34, utilidad: 17 },
        ecografiaEspecial: { cantidad: 1, costo: 20, precio: 40, utilidad: 20 },
        pap: { cantidad: 3, costo: 11, precio: 22, utilidad: 11 },
        colposcopia: { cantidad: 1, costo: 30, precio: 60, utilidad: 30 }
      },
      { 
        fecha: "2024-10-23", 
        consultaMedica: { cantidad: 9, costo: 45, precio: 90, utilidad: 45 },
        controlPrenatal: { cantidad: 5, costo: 30, precio: 60, utilidad: 30 },
        ecografiaSimple: { cantidad: 3, costo: 25, precio: 50, utilidad: 25 },
        ecografiaEspecial: { cantidad: 2, costo: 40, precio: 80, utilidad: 40 },
        pap: { cantidad: 4, costo: 15, precio: 30, utilidad: 15 },
        colposcopia: { cantidad: 1, costo: 30, precio: 60, utilidad: 30 }
      },
      { 
        fecha: "2024-10-24", 
        consultaMedica: { cantidad: 8, costo: 40, precio: 80, utilidad: 40 },
        controlPrenatal: { cantidad: 6, costo: 36, precio: 72, utilidad: 36 },
        ecografiaSimple: { cantidad: 4, costo: 33, precio: 66, utilidad: 33 },
        ecografiaEspecial: { cantidad: 3, costo: 60, precio: 120, utilidad: 60 },
        pap: { cantidad: 5, costo: 19, precio: 38, utilidad: 19 },
        colposcopia: { cantidad: 2, costo: 60, precio: 120, utilidad: 60 }
      },
      { 
        fecha: "2024-10-25", 
        consultaMedica: { cantidad: 11, costo: 55, precio: 110, utilidad: 55 },
        controlPrenatal: { cantidad: 7, costo: 42, precio: 84, utilidad: 42 },
        ecografiaSimple: { cantidad: 5, costo: 42, precio: 84, utilidad: 42 },
        ecografiaEspecial: { cantidad: 4, costo: 80, precio: 160, utilidad: 80 },
        pap: { cantidad: 6, costo: 23, precio: 46, utilidad: 23 },
        colposcopia: { cantidad: 3, costo: 90, precio: 180, utilidad: 90 }
      },
      { 
        fecha: "2024-10-26", 
        consultaMedica: { cantidad: 6, costo: 30, precio: 60, utilidad: 30 },
        controlPrenatal: { cantidad: 3, costo: 18, precio: 36, utilidad: 18 },
        ecografiaSimple: { cantidad: 2, costo: 17, precio: 34, utilidad: 17 },
        ecografiaEspecial: { cantidad: 1, costo: 20, precio: 40, utilidad: 20 },
        pap: { cantidad: 3, costo: 11, precio: 22, utilidad: 11 },
        colposcopia: { cantidad: 1, costo: 30, precio: 60, utilidad: 30 }
      }
    ],
    mes: [
      { 
        mes: "Enero", 
        consultaMedica: { cantidad: 240, costo: 1200, precio: 2400, utilidad: 1200 },
        controlPrenatal: { cantidad: 180, costo: 1080, precio: 2160, utilidad: 1080 },
        ecografiaSimple: { cantidad: 120, costo: 1000, precio: 2000, utilidad: 1000 },
        ecografiaEspecial: { cantidad: 90, costo: 1800, precio: 3600, utilidad: 1800 },
        pap: { cantidad: 150, costo: 600, precio: 1200, utilidad: 600 },
        colposcopia: { cantidad: 30, costo: 900, precio: 1800, utilidad: 900 }
      },
      { 
        mes: "Febrero", 
        consultaMedica: { cantidad: 260, costo: 1300, precio: 2600, utilidad: 1300 },
        controlPrenatal: { cantidad: 200, costo: 1200, precio: 2400, utilidad: 1200 },
        ecografiaSimple: { cantidad: 130, costo: 1083, precio: 2166, utilidad: 1083 },
        ecografiaEspecial: { cantidad: 100, costo: 2000, precio: 4000, utilidad: 2000 },
        pap: { cantidad: 160, costo: 640, precio: 1280, utilidad: 640 },
        colposcopia: { cantidad: 35, costo: 1050, precio: 2100, utilidad: 1050 }
      },
      { 
        mes: "Marzo", 
        consultaMedica: { cantidad: 250, costo: 1250, precio: 2500, utilidad: 1250 },
        controlPrenatal: { cantidad: 190, costo: 1140, precio: 2280, utilidad: 1140 },
        ecografiaSimple: { cantidad: 125, costo: 1042, precio: 2084, utilidad: 1042 },
        ecografiaEspecial: { cantidad: 95, costo: 1900, precio: 3800, utilidad: 1900 },
        pap: { cantidad: 155, costo: 620, precio: 1240, utilidad: 620 },
        colposcopia: { cantidad: 32, costo: 960, precio: 1920, utilidad: 960 }
      },
      { 
        mes: "Abril", 
        consultaMedica: { cantidad: 270, costo: 1350, precio: 2700, utilidad: 1350 },
        controlPrenatal: { cantidad: 210, costo: 1260, precio: 2520, utilidad: 1260 },
        ecografiaSimple: { cantidad: 140, costo: 1167, precio: 2334, utilidad: 1167 },
        ecografiaEspecial: { cantidad: 105, costo: 2100, precio: 4200, utilidad: 2100 },
        pap: { cantidad: 170, costo: 680, precio: 1360, utilidad: 680 },
        colposcopia: { cantidad: 38, costo: 1140, precio: 2280, utilidad: 1140 }
      },
      { 
        mes: "Mayo", 
        consultaMedica: { cantidad: 280, costo: 1400, precio: 2800, utilidad: 1400 },
        controlPrenatal: { cantidad: 220, costo: 1320, precio: 2640, utilidad: 1320 },
        ecografiaSimple: { cantidad: 145, costo: 1208, precio: 2416, utilidad: 1208 },
        ecografiaEspecial: { cantidad: 110, costo: 2200, precio: 4400, utilidad: 2200 },
        pap: { cantidad: 175, costo: 700, precio: 1400, utilidad: 700 },
        colposcopia: { cantidad: 40, costo: 1200, precio: 2400, utilidad: 1200 }
      },
      { 
        mes: "Junio", 
        consultaMedica: { cantidad: 290, costo: 1450, precio: 2900, utilidad: 1450 },
        controlPrenatal: { cantidad: 230, costo: 1380, precio: 2760, utilidad: 1380 },
        ecografiaSimple: { cantidad: 150, costo: 1250, precio: 2500, utilidad: 1250 },
        ecografiaEspecial: { cantidad: 115, costo: 2300, precio: 4600, utilidad: 2300 },
        pap: { cantidad: 180, costo: 720, precio: 1440, utilidad: 720 },
        colposcopia: { cantidad: 42, costo: 1260, precio: 2520, utilidad: 1260 }
      }
    ],
    año: [
      { 
        año: "2021", 
        consultaMedica: { cantidad: 3000, costo: 15000, precio: 30000, utilidad: 15000 },
        controlPrenatal: { cantidad: 2400, costo: 14400, precio: 28800, utilidad: 14400 },
        ecografiaSimple: { cantidad: 1800, costo: 15000, precio: 30000, utilidad: 15000 },
        ecografiaEspecial: { cantidad: 1200, costo: 24000, precio: 48000, utilidad: 24000 },
        pap: { cantidad: 2000, costo: 8000, precio: 16000, utilidad: 8000 },
        colposcopia: { cantidad: 400, costo: 12000, precio: 24000, utilidad: 12000 }
      },
      { 
        año: "2022", 
        consultaMedica: { cantidad: 3200, costo: 16000, precio: 32000, utilidad: 16000 },
        controlPrenatal: { cantidad: 2600, costo: 15600, precio: 31200, utilidad: 15600 },
        ecografiaSimple: { cantidad: 2000, costo: 16667, precio: 33334, utilidad: 16667 },
        ecografiaEspecial: { cantidad: 1400, costo: 28000, precio: 56000, utilidad: 28000 },
        pap: { cantidad: 2200, costo: 8800, precio: 17600, utilidad: 8800 },
        colposcopia: { cantidad: 450, costo: 13500, precio: 27000, utilidad: 13500 }
      },
      { 
        año: "2023", 
        consultaMedica: { cantidad: 3400, costo: 17000, precio: 34000, utilidad: 17000 },
        controlPrenatal: { cantidad: 2800, costo: 16800, precio: 33600, utilidad: 16800 },
        ecografiaSimple: { cantidad: 2200, costo: 18333, precio: 36666, utilidad: 18333 },
        ecografiaEspecial: { cantidad: 1600, costo: 32000, precio: 64000, utilidad: 32000 },
        pap: { cantidad: 2400, costo: 9600, precio: 19200, utilidad: 9600 },
        colposcopia: { cantidad: 500, costo: 15000, precio: 30000, utilidad: 15000 }
      },
      { 
        año: "2024", 
        consultaMedica: { cantidad: 3600, costo: 18000, precio: 36000, utilidad: 18000 },
        controlPrenatal: { cantidad: 3000, costo: 18000, precio: 36000, utilidad: 18000 },
        ecografiaSimple: { cantidad: 2400, costo: 20000, precio: 40000, utilidad: 20000 },
        ecografiaEspecial: { cantidad: 1800, costo: 36000, precio: 72000, utilidad: 36000 },
        pap: { cantidad: 2600, costo: 10400, precio: 20800, utilidad: 10400 },
        colposcopia: { cantidad: 550, costo: 16500, precio: 33000, utilidad: 16500 }
      }
    ]
  };

  const dataActual = costosData[periodo];

  const servicios = [
    { 
      nombre: 'consultaMedica', 
      label: 'Consulta Médica', 
      icono: Stethoscope, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    { 
      nombre: 'controlPrenatal', 
      label: 'Control Prenatal', 
      icono: Baby, 
      color: 'text-pink-600',
      bgColor: 'bg-pink-50 dark:bg-pink-950/20',
      borderColor: 'border-pink-200 dark:border-pink-800'
    },
    { 
      nombre: 'ecografiaSimple', 
      label: 'Ecografía Simple', 
      icono: Eye, 
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
      borderColor: 'border-green-200 dark:border-green-800'
    },
    { 
      nombre: 'ecografiaEspecial', 
      label: 'Ecografía Especial', 
      icono: Eye, 
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/20',
      borderColor: 'border-indigo-200 dark:border-indigo-800'
    },
    { 
      nombre: 'pap', 
      label: 'PAP', 
      icono: TestTube, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
      borderColor: 'border-purple-200 dark:border-purple-800'
    },
    { 
      nombre: 'colposcopia', 
      label: 'Colposcopia', 
      icono: Heart, 
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-950/20',
      borderColor: 'border-red-200 dark:border-red-800'
    }
  ];

  const getTotalCostos = () => {
    return dataActual.reduce((sum, item) => 
      sum + item.consultaMedica.costo + item.controlPrenatal.costo + item.ecografiaSimple.costo + 
      item.ecografiaEspecial.costo + item.pap.costo + item.colposcopia.costo, 0
    );
  };

  const getTotalIngresos = () => {
    return dataActual.reduce((sum, item) => 
      sum + item.consultaMedica.precio + item.controlPrenatal.precio + item.ecografiaSimple.precio + 
      item.ecografiaEspecial.precio + item.pap.precio + item.colposcopia.precio, 0
    );
  };

  const getTotalUtilidad = () => {
    return dataActual.reduce((sum, item) => 
      sum + item.consultaMedica.utilidad + item.controlPrenatal.utilidad + item.ecografiaSimple.utilidad + 
      item.ecografiaEspecial.utilidad + item.pap.utilidad + item.colposcopia.utilidad, 0
    );
  };

  const getMargenUtilidad = () => {
    const ingresos = getTotalIngresos();
    const utilidad = getTotalUtilidad();
    return ingresos > 0 ? ((utilidad / ingresos) * 100).toFixed(1) : '0';
  };

  const getServicioMasRentable = () => {
    const utilidades = servicios.reduce((acc, servicio) => {
      acc[servicio.nombre] = dataActual.reduce((sum, item) => 
        sum + (item[servicio.nombre as keyof typeof item] as any).utilidad, 0
      );
      return acc;
    }, {} as Record<string, number>);
    
    const maxKey = Object.keys(utilidades).reduce((a, b) => utilidades[a] > utilidades[b] ? a : b);
    const servicio = servicios.find(s => s.nombre === maxKey);
    return { nombre: servicio?.label || maxKey, utilidad: utilidades[maxKey] };
  };

  const getTendencia = (campo: string) => {
    if (dataActual.length < 2) return 'stable';
    const ultimo = dataActual[dataActual.length - 1][campo as keyof typeof dataActual[0]] as any;
    const anterior = dataActual[dataActual.length - 2][campo as keyof typeof dataActual[0]] as any;
    
    if (ultimo.utilidad > anterior.utilidad) return 'up';
    if (ultimo.utilidad < anterior.utilidad) return 'down';
    return 'stable';
  };

  return (
    <div className="space-y-6">
      {/* Header con controles */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Análisis de Costos y Utilidades
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Análisis por {periodo === 'dia' ? 'día' : periodo === 'mes' ? 'mes' : 'año'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select defaultValue={periodo}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dia">Por Día</SelectItem>
                  <SelectItem value="mes">Por Mes</SelectItem>
                  <SelectItem value="año">Por Año</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Total Ingresos</p>
              <p className="text-2xl font-bold text-primary">
                S/ {getTotalIngresos().toLocaleString()}
              </p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Calculator className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Total Costos</p>
              <p className="text-2xl font-bold text-blue-600">
                S/ {getTotalCostos().toLocaleString()}
              </p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Utilidad Neta</p>
              <p className="text-2xl font-bold text-green-600">
                S/ {getTotalUtilidad().toLocaleString()}
              </p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Margen Utilidad</p>
              <p className="text-2xl font-bold text-purple-600">
                {getMargenUtilidad()}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Análisis por servicio */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {servicios.map((servicio) => {
          const total = dataActual.reduce((sum, item) => {
            const data = item[servicio.nombre as keyof typeof item] as any;
            return sum + data.cantidad;
          }, 0);
          
          const totalCostos = dataActual.reduce((sum, item) => {
            const data = item[servicio.nombre as keyof typeof item] as any;
            return sum + data.costo;
          }, 0);
          
          const totalIngresos = dataActual.reduce((sum, item) => {
            const data = item[servicio.nombre as keyof typeof item] as any;
            return sum + data.precio;
          }, 0);
          
          const totalUtilidad = dataActual.reduce((sum, item) => {
            const data = item[servicio.nombre as keyof typeof item] as any;
            return sum + data.utilidad;
          }, 0);
          
          const margenUtilidad = totalIngresos > 0 ? ((totalUtilidad / totalIngresos) * 100).toFixed(1) : '0';
          const tendencia = getTendencia(servicio.nombre);
          const IconoComponente = servicio.icono;
          
          return (
            <Card key={servicio.nombre} className={`${servicio.bgColor} ${servicio.borderColor} border`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <IconoComponente className={`h-5 w-5 ${servicio.color}`} />
                    <p className="font-medium text-sm">{servicio.label}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {tendencia === 'up' && <TrendingUp className="h-3 w-3 text-green-600" />}
                    {tendencia === 'down' && <TrendingDown className="h-3 w-3 text-red-600" />}
                    {tendencia === 'stable' && <div className="w-3 h-3 bg-gray-400 rounded-full" />}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-sm text-muted-foreground">Cantidad:</p>
                    <p className="text-sm font-medium">{total}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-muted-foreground">Ingresos:</p>
                    <p className="text-sm font-medium text-green-600">S/ {totalIngresos.toLocaleString()}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-muted-foreground">Costos:</p>
                    <p className="text-sm font-medium text-red-600">S/ {totalCostos.toLocaleString()}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-muted-foreground">Utilidad:</p>
                    <p className="text-sm font-medium text-primary">S/ {totalUtilidad.toLocaleString()}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-muted-foreground">Margen:</p>
                    <p className="text-sm font-medium text-purple-600">{margenUtilidad}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tabla de datos temporales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Evolución Temporal por {periodo === 'dia' ? 'Día' : periodo === 'mes' ? 'Mes' : 'Año'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">
                    {periodo === 'dia' ? 'Fecha' : periodo === 'mes' ? 'Mes' : 'Año'}
                  </th>
                  <th className="text-right p-3 font-medium">Ingresos</th>
                  <th className="text-right p-3 font-medium">Costos</th>
                  <th className="text-right p-3 font-medium">Utilidad</th>
                  <th className="text-right p-3 font-medium">Margen %</th>
                </tr>
              </thead>
              <tbody>
                {dataActual.map((item, index) => {
                  const ingresos = item.consultaMedica.precio + item.controlPrenatal.precio + item.ecografiaSimple.precio + 
                    item.ecografiaEspecial.precio + item.pap.precio + item.colposcopia.precio;
                  const costos = item.consultaMedica.costo + item.controlPrenatal.costo + item.ecografiaSimple.costo + 
                    item.ecografiaEspecial.costo + item.pap.costo + item.colposcopia.costo;
                  const utilidad = ingresos - costos;
                  const margen = ingresos > 0 ? ((utilidad / ingresos) * 100).toFixed(1) : '0';
                  
                  return (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="p-3 font-medium">
                        {periodo === 'dia' ? item.fecha : periodo === 'mes' ? item.mes : item.año}
                      </td>
                      <td className="text-right p-3">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          S/ {ingresos.toLocaleString()}
                        </Badge>
                      </td>
                      <td className="text-right p-3">
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          S/ {costos.toLocaleString()}
                        </Badge>
                      </td>
                      <td className="text-right p-3">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          S/ {utilidad.toLocaleString()}
                        </Badge>
                      </td>
                      <td className="text-right p-3">
                        <Badge variant="default" className="bg-purple-600 text-white">
                          {margen}%
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Resumen de rentabilidad */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Resumen de Rentabilidad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <p className="font-medium">Servicio Más Rentable</p>
              </div>
              <p className="text-lg font-bold text-green-600">
                {getServicioMasRentable().nombre}
              </p>
              <p className="text-sm text-muted-foreground">
                S/ {getServicioMasRentable().utilidad.toLocaleString()} de utilidad
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-blue-600" />
                <p className="font-medium">Margen Promedio</p>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {getMargenUtilidad()}%
              </p>
              <p className="text-sm text-muted-foreground">
                Sobre ingresos totales
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                <p className="font-medium">Tendencia</p>
              </div>
              <p className="text-lg font-bold text-purple-600">
                +8.5%
              </p>
              <p className="text-sm text-muted-foreground">
                vs período anterior
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
