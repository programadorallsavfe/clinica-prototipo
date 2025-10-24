"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Calendar,
  Stethoscope,
  Target,
  BarChart3,
  DollarSign,
  Users,
  Clock,
  Heart,
  Baby,
  Eye,
  TestTube
} from "lucide-react";

interface ReporteServiciosProps {
  periodo: 'dia' | 'mes' | 'año';
}

// Tipos para los datos de servicios
interface ServicioBase {
  consultaObstetrica: number;
  consultaGinecologica: number;
  ecografiaObstetrica: number;
  ecografiaTransvaginal: number;
  perfilPrenatal: number;
  pap: number;
  colposcopia: number;
  otros: number;
}

interface ServicioDia extends ServicioBase {
  fecha: string;
}

interface ServicioMes extends ServicioBase {
  mes: string;
}

interface ServicioAño extends ServicioBase {
  año: string;
}

type ServicioItem = ServicioDia | ServicioMes | ServicioAño;

export default function ReporteServicios({ periodo = 'mes' }: ReporteServiciosProps) {
  
  // Mock data para reportes de servicios
  const serviciosData = {
    dia: [
      { 
        fecha: "2024-10-20", 
        consultaObstetrica: 8, 
        consultaGinecologica: 6, 
        ecografiaObstetrica: 4, 
        ecografiaTransvaginal: 3,
        perfilPrenatal: 2,
        pap: 5,
        colposcopia: 1,
        otros: 1
      },
      { 
        fecha: "2024-10-21", 
        consultaObstetrica: 10, 
        consultaGinecologica: 5, 
        ecografiaObstetrica: 5, 
        ecografiaTransvaginal: 2,
        perfilPrenatal: 3,
        pap: 4,
        colposcopia: 2,
        otros: 1
      },
      { 
        fecha: "2024-10-22", 
        consultaObstetrica: 7, 
        consultaGinecologica: 7, 
        ecografiaObstetrica: 3, 
        ecografiaTransvaginal: 4,
        perfilPrenatal: 2,
        pap: 6,
        colposcopia: 1,
        otros: 0
      },
      { 
        fecha: "2024-10-23", 
        consultaObstetrica: 9, 
        consultaGinecologica: 6, 
        ecografiaObstetrica: 4, 
        ecografiaTransvaginal: 3,
        perfilPrenatal: 3,
        pap: 5,
        colposcopia: 1,
        otros: 1
      },
      { 
        fecha: "2024-10-24", 
        consultaObstetrica: 8, 
        consultaGinecologica: 8, 
        ecografiaObstetrica: 5, 
        ecografiaTransvaginal: 2,
        perfilPrenatal: 2,
        pap: 4,
        colposcopia: 2,
        otros: 1
      },
      { 
        fecha: "2024-10-25", 
        consultaObstetrica: 11, 
        consultaGinecologica: 5, 
        ecografiaObstetrica: 4, 
        ecografiaTransvaginal: 3,
        perfilPrenatal: 3,
        pap: 5,
        colposcopia: 1,
        otros: 0
      },
      { 
        fecha: "2024-10-26", 
        consultaObstetrica: 6, 
        consultaGinecologica: 7, 
        ecografiaObstetrica: 3, 
        ecografiaTransvaginal: 4,
        perfilPrenatal: 2,
        pap: 6,
        colposcopia: 1,
        otros: 1
      }
    ],
    mes: [
      { 
        mes: "Enero", 
        consultaObstetrica: 240, 
        consultaGinecologica: 180, 
        ecografiaObstetrica: 120, 
        ecografiaTransvaginal: 90,
        perfilPrenatal: 60,
        pap: 150,
        colposcopia: 30,
        otros: 30
      },
      { 
        mes: "Febrero", 
        consultaObstetrica: 260, 
        consultaGinecologica: 170, 
        ecografiaObstetrica: 130, 
        ecografiaTransvaginal: 85,
        perfilPrenatal: 65,
        pap: 140,
        colposcopia: 35,
        otros: 25
      },
      { 
        mes: "Marzo", 
        consultaObstetrica: 250, 
        consultaGinecologica: 190, 
        ecografiaObstetrica: 125, 
        ecografiaTransvaginal: 95,
        perfilPrenatal: 55,
        pap: 160,
        colposcopia: 25,
        otros: 35
      },
      { 
        mes: "Abril", 
        consultaObstetrica: 270, 
        consultaGinecologica: 180, 
        ecografiaObstetrica: 135, 
        ecografiaTransvaginal: 80,
        perfilPrenatal: 70,
        pap: 130,
        colposcopia: 40,
        otros: 20
      },
      { 
        mes: "Mayo", 
        consultaObstetrica: 280, 
        consultaGinecologica: 200, 
        ecografiaObstetrica: 140, 
        ecografiaTransvaginal: 100,
        perfilPrenatal: 60,
        pap: 120,
        colposcopia: 30,
        otros: 30
      },
      { 
        mes: "Junio", 
        consultaObstetrica: 290, 
        consultaGinecologica: 190, 
        ecografiaObstetrica: 145, 
        ecografiaTransvaginal: 85,
        perfilPrenatal: 75,
        pap: 110,
        colposcopia: 35,
        otros: 25
      }
    ],
    año: [
      { 
        año: "2021", 
        consultaObstetrica: 3000, 
        consultaGinecologica: 2200, 
        ecografiaObstetrica: 1500, 
        ecografiaTransvaginal: 1100,
        perfilPrenatal: 800,
        pap: 1800,
        colposcopia: 400,
        otros: 400
      },
      { 
        año: "2022", 
        consultaObstetrica: 3200, 
        consultaGinecologica: 2300, 
        ecografiaObstetrica: 1600, 
        ecografiaTransvaginal: 1200,
        perfilPrenatal: 900,
        pap: 1900,
        colposcopia: 450,
        otros: 350
      },
      { 
        año: "2023", 
        consultaObstetrica: 3400, 
        consultaGinecologica: 2400, 
        ecografiaObstetrica: 1700, 
        ecografiaTransvaginal: 1300,
        perfilPrenatal: 1000,
        pap: 2000,
        colposcopia: 500,
        otros: 300
      },
      { 
        año: "2024", 
        consultaObstetrica: 3600, 
        consultaGinecologica: 2500, 
        ecografiaObstetrica: 1800, 
        ecografiaTransvaginal: 1400,
        perfilPrenatal: 1100,
        pap: 2100,
        colposcopia: 550,
        otros: 250
      }
    ]
  };

  const dataActual = serviciosData[periodo];

  // Función helper para obtener el valor de fecha/mes/año de manera type-safe
  const getPeriodoValue = (item: ServicioItem, periodo: 'dia' | 'mes' | 'año'): string => {
    switch (periodo) {
      case 'dia':
        return (item as ServicioDia).fecha;
      case 'mes':
        return (item as ServicioMes).mes;
      case 'año':
        return (item as ServicioAño).año;
      default:
        return '';
    }
  };

  const servicios = [
    { 
      nombre: 'consultaObstetrica', 
      label: 'Consulta Obstétrica', 
      icono: Baby, 
      color: 'text-pink-600',
      bgColor: 'bg-pink-50 dark:bg-pink-950/20',
      borderColor: 'border-pink-200 dark:border-pink-800',
      precio: 80
    },
    { 
      nombre: 'consultaGinecologica', 
      label: 'Consulta Ginecológica', 
      icono: Heart, 
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-950/20',
      borderColor: 'border-red-200 dark:border-red-800',
      precio: 100
    },
    { 
      nombre: 'ecografiaObstetrica', 
      label: 'Ecografía Obstétrica', 
      icono: Eye, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      precio: 120
    },
    { 
      nombre: 'ecografiaTransvaginal', 
      label: 'Ecografía Transvaginal', 
      icono: Eye, 
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/20',
      borderColor: 'border-indigo-200 dark:border-indigo-800',
      precio: 95
    },
    { 
      nombre: 'perfilPrenatal', 
      label: 'Perfil Prenatal', 
      icono: TestTube, 
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
      borderColor: 'border-green-200 dark:border-green-800',
      precio: 85
    },
    { 
      nombre: 'pap', 
      label: 'PAP', 
      icono: Stethoscope, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
      precio: 60
    },
    { 
      nombre: 'colposcopia', 
      label: 'Colposcopia', 
      icono: Activity, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
      borderColor: 'border-orange-200 dark:border-orange-800',
      precio: 150
    },
    { 
      nombre: 'otros', 
      label: 'Otros', 
      icono: Activity, 
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 dark:bg-gray-950/20',
      borderColor: 'border-gray-200 dark:border-gray-800',
      precio: 50
    }
  ];

  const getTotalPeriodo = () => {
    return dataActual.reduce((sum, item) => 
      sum + item.consultaObstetrica + item.consultaGinecologica + item.ecografiaObstetrica + 
      item.ecografiaTransvaginal + item.perfilPrenatal + item.pap + item.colposcopia + item.otros, 0
    );
  };

  const getServicioMasFrecuente = () => {
    const totales = servicios.reduce((acc, servicio) => {
      acc[servicio.nombre] = dataActual.reduce((sum, item) => 
        sum + (item[servicio.nombre as keyof typeof item] as number), 0
      );
      return acc;
    }, {} as Record<string, number>);
    
    const maxKey = Object.keys(totales).reduce((a, b) => totales[a] > totales[b] ? a : b);
    const servicio = servicios.find(s => s.nombre === maxKey);
    return { nombre: servicio?.label || maxKey, cantidad: totales[maxKey] };
  };

  const getIngresosTotales = () => {
    return servicios.reduce((total, servicio) => {
      const cantidad = dataActual.reduce((sum, item) => 
        sum + (item[servicio.nombre as keyof typeof item] as number), 0
      );
      return total + (cantidad * servicio.precio);
    }, 0);
  };

  const getTendenciaServicio = (servicio: string) => {
    if (dataActual.length < 2) return 'stable';
    const ultimo = dataActual[dataActual.length - 1][servicio as keyof typeof dataActual[0]] as number;
    const anterior = dataActual[dataActual.length - 2][servicio as keyof typeof dataActual[0]] as number;
    
    if (ultimo > anterior) return 'up';
    if (ultimo < anterior) return 'down';
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
                <Activity className="h-5 w-5 text-primary" />
                Principales Servicios
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Análisis por {periodo === 'dia' ? 'día' : periodo === 'mes' ? 'mes' : 'año'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={periodo}>
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
              <Activity className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Total Servicios</p>
              <p className="text-2xl font-bold text-primary">
                {getTotalPeriodo().toLocaleString()}
              </p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Servicio Principal</p>
              <p className="text-lg font-bold text-blue-600">
                {getServicioMasFrecuente().nombre}
              </p>
              <p className="text-sm text-muted-foreground">
                {getServicioMasFrecuente().cantidad} servicios
              </p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Ingresos Totales</p>
              <p className="text-2xl font-bold text-green-600">
                S/ {getIngresosTotales().toLocaleString()}
              </p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Tipos de Servicios</p>
              <p className="text-2xl font-bold text-purple-600">
                {servicios.length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumen por servicio */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {servicios.map((servicio) => {
          const total = dataActual.reduce((sum, item) => sum + (item[servicio.nombre as keyof typeof item] as number), 0);
          const ingresos = total * servicio.precio;
          const porcentaje = ((total / getTotalPeriodo()) * 100).toFixed(1);
          const tendencia = getTendenciaServicio(servicio.nombre);
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
                  <p className="text-xl font-bold text-primary">{total.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">{porcentaje}% del total</p>
                  <p className="text-sm font-medium text-green-600">
                    S/ {ingresos.toLocaleString()}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${servicio.color.replace('text-', 'bg-')}`}
                      style={{ width: `${porcentaje}%` }}
                    ></div>
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
                  <th className="text-right p-3 font-medium">Consulta Obst.</th>
                  <th className="text-right p-3 font-medium">Consulta Gin.</th>
                  <th className="text-right p-3 font-medium">Ecog. Obst.</th>
                  <th className="text-right p-3 font-medium">Ecog. Trans.</th>
                  <th className="text-right p-3 font-medium">Perfil Pren.</th>
                  <th className="text-right p-3 font-medium">PAP</th>
                  <th className="text-right p-3 font-medium">Colposcopia</th>
                  <th className="text-right p-3 font-medium">Otros</th>
                  <th className="text-right p-3 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {dataActual.map((item, index) => {
                  const total = item.consultaObstetrica + item.consultaGinecologica + item.ecografiaObstetrica + 
                    item.ecografiaTransvaginal + item.perfilPrenatal + item.pap + item.colposcopia + item.otros;
                  return (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="p-3 font-medium">
                        {getPeriodoValue(item, periodo)}
                      </td>
                      <td className="text-right p-3">
                        <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-200">
                          {item.consultaObstetrica}
                        </Badge>
                      </td>
                      <td className="text-right p-3">
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          {item.consultaGinecologica}
                        </Badge>
                      </td>
                      <td className="text-right p-3">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {item.ecografiaObstetrica}
                        </Badge>
                      </td>
                      <td className="text-right p-3">
                        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                          {item.ecografiaTransvaginal}
                        </Badge>
                      </td>
                      <td className="text-right p-3">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {item.perfilPrenatal}
                        </Badge>
                      </td>
                      <td className="text-right p-3">
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          {item.pap}
                        </Badge>
                      </td>
                      <td className="text-right p-3">
                        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                          {item.colposcopia}
                        </Badge>
                      </td>
                      <td className="text-right p-3">
                        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                          {item.otros}
                        </Badge>
                      </td>
                      <td className="text-right p-3 font-medium text-primary">
                        {total}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Análisis de rentabilidad */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Análisis de Rentabilidad por Servicio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {servicios.slice(0, 4).map((servicio) => {
              const total = dataActual.reduce((sum, item) => sum + (item[servicio.nombre as keyof typeof item] as number), 0);
              const ingresos = total * servicio.precio;
              const porcentajeIngresos = ((ingresos / getIngresosTotales()) * 100).toFixed(1);
              
              return (
                <div key={servicio.nombre} className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <servicio.icono className={`h-4 w-4 ${servicio.color}`} />
                    <p className="font-medium text-sm">{servicio.label}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Ingresos</p>
                  <p className="text-lg font-bold text-green-600">
                    S/ {ingresos.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {porcentajeIngresos}% del total
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
