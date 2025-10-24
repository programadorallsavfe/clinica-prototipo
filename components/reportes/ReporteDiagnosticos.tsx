"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Stethoscope, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Calendar,
  Activity,
  Target,
  BarChart3,
  PieChart,
  AlertTriangle,
  Heart,
  Baby,
  Users
} from "lucide-react";

interface ReporteDiagnosticosProps {
  periodo: 'dia' | 'mes' | 'año';
}

export default function ReporteDiagnosticos({ periodo = 'mes' }: ReporteDiagnosticosProps) {
  
  // Mock data para reportes de diagnósticos
  const diagnosticosData = {
    dia: [
      { fecha: "2024-10-20", embarazo: 8, hipertension: 3, diabetes: 2, infeccion: 5, otros: 2 },
      { fecha: "2024-10-21", embarazo: 10, hipertension: 2, diabetes: 3, infeccion: 4, otros: 1 },
      { fecha: "2024-10-22", embarazo: 7, hipertension: 4, diabetes: 1, infeccion: 6, otros: 2 },
      { fecha: "2024-10-23", embarazo: 9, hipertension: 3, diabetes: 2, infeccion: 5, otros: 1 },
      { fecha: "2024-10-24", embarazo: 8, hipertension: 2, diabetes: 4, infeccion: 4, otros: 2 },
      { fecha: "2024-10-25", embarazo: 11, hipertension: 3, diabetes: 1, infeccion: 3, otros: 2 },
      { fecha: "2024-10-26", embarazo: 6, hipertension: 4, diabetes: 3, infeccion: 5, otros: 2 }
    ],
    mes: [
      { mes: "Enero", embarazo: 240, hipertension: 90, diabetes: 60, infeccion: 150, otros: 60 },
      { mes: "Febrero", embarazo: 260, hipertension: 85, diabetes: 65, infeccion: 140, otros: 50 },
      { mes: "Marzo", embarazo: 250, hipertension: 95, diabetes: 55, infeccion: 160, otros: 40 },
      { mes: "Abril", embarazo: 270, hipertension: 80, diabetes: 70, infeccion: 130, otros: 50 },
      { mes: "Mayo", embarazo: 280, hipertension: 100, diabetes: 50, infeccion: 120, otros: 50 },
      { mes: "Junio", embarazo: 290, hipertension: 85, diabetes: 75, infeccion: 110, otros: 40 }
    ],
    año: [
      { año: "2021", embarazo: 3000, hipertension: 1200, diabetes: 800, infeccion: 1800, otros: 700 },
      { año: "2022", embarazo: 3200, hipertension: 1300, diabetes: 900, infeccion: 1900, otros: 600 },
      { año: "2023", embarazo: 3400, hipertension: 1400, diabetes: 1000, infeccion: 2000, otros: 500 },
      { año: "2024", embarazo: 3600, hipertension: 1500, diabetes: 1100, infeccion: 2100, otros: 400 }
    ]
  };

  const dataActual = diagnosticosData[periodo];

  const getTotalPeriodo = () => {
    return dataActual.reduce((sum, item) => 
      sum + item.embarazo + item.hipertension + item.diabetes + item.infeccion + item.otros, 0
    );
  };

  const getDiagnosticoMasFrecuente = () => {
    const totales = {
      embarazo: dataActual.reduce((sum, item) => sum + item.embarazo, 0),
      hipertension: dataActual.reduce((sum, item) => sum + item.hipertension, 0),
      diabetes: dataActual.reduce((sum, item) => sum + item.diabetes, 0),
      infeccion: dataActual.reduce((sum, item) => sum + item.infeccion, 0),
      otros: dataActual.reduce((sum, item) => sum + item.otros, 0)
    };
    
    const maxKey = Object.keys(totales).reduce((a, b) => totales[a as keyof typeof totales] > totales[b as keyof typeof totales] ? a : b);
    return { nombre: maxKey, cantidad: totales[maxKey as keyof typeof totales] };
  };

  const getTendenciaDiagnostico = (diagnostico: string) => {
    if (dataActual.length < 2) return 'stable';
    const ultimo = dataActual[dataActual.length - 1][diagnostico as keyof typeof dataActual[0]] as number;
    const anterior = dataActual[dataActual.length - 2][diagnostico as keyof typeof dataActual[0]] as number;
    
    if (ultimo > anterior) return 'up';
    if (ultimo < anterior) return 'down';
    return 'stable';
  };

  const diagnosticos = [
    { 
      nombre: 'embarazo', 
      label: 'Embarazo', 
      icono: Baby, 
      color: 'text-pink-600',
      bgColor: 'bg-pink-50 dark:bg-pink-950/20',
      borderColor: 'border-pink-200 dark:border-pink-800'
    },
    { 
      nombre: 'hipertension', 
      label: 'Hipertensión', 
      icono: Heart, 
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-950/20',
      borderColor: 'border-red-200 dark:border-red-800'
    },
    { 
      nombre: 'diabetes', 
      label: 'Diabetes', 
      icono: AlertTriangle, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
      borderColor: 'border-orange-200 dark:border-orange-800'
    },
    { 
      nombre: 'infeccion', 
      label: 'Infección', 
      icono: Stethoscope, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    { 
      nombre: 'otros', 
      label: 'Otros', 
      icono: Activity, 
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 dark:bg-gray-950/20',
      borderColor: 'border-gray-200 dark:border-gray-800'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header con controles */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-primary" />
                Principales Diagnósticos
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
              <Stethoscope className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Total Diagnósticos</p>
              <p className="text-2xl font-bold text-primary">
                {getTotalPeriodo().toLocaleString()}
              </p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Diagnóstico Principal</p>
              <p className="text-lg font-bold text-blue-600">
                {getDiagnosticoMasFrecuente().nombre}
              </p>
              <p className="text-sm text-muted-foreground">
                {getDiagnosticoMasFrecuente().cantidad} casos
              </p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Activity className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Promedio Diario</p>
              <p className="text-2xl font-bold text-green-600">
                {(getTotalPeriodo() / (periodo === 'dia' ? 7 : periodo === 'mes' ? 30 : 365)).toFixed(1)}
              </p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Períodos Analizados</p>
              <p className="text-2xl font-bold text-purple-600">
                {dataActual.length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumen por diagnóstico */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {diagnosticos.map((diagnostico) => {
          const total = dataActual.reduce((sum, item) => sum + (item[diagnostico.nombre as keyof typeof item] as number), 0);
          const porcentaje = ((total / getTotalPeriodo()) * 100).toFixed(1);
          const tendencia = getTendenciaDiagnostico(diagnostico.nombre);
          const IconoComponente = diagnostico.icono;
          
          return (
            <Card key={diagnostico.nombre} className={`${diagnostico.bgColor} ${diagnostico.borderColor} border`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <IconoComponente className={`h-5 w-5 ${diagnostico.color}`} />
                    <p className="font-medium">{diagnostico.label}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {tendencia === 'up' && <TrendingUp className="h-3 w-3 text-green-600" />}
                    {tendencia === 'down' && <TrendingDown className="h-3 w-3 text-red-600" />}
                    {tendencia === 'stable' && <div className="w-3 h-3 bg-gray-400 rounded-full" />}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-primary">{total.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">{porcentaje}% del total</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${diagnostico.color.replace('text-', 'bg-')}`}
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
                  <th className="text-right p-3 font-medium">Embarazo</th>
                  <th className="text-right p-3 font-medium">Hipertensión</th>
                  <th className="text-right p-3 font-medium">Diabetes</th>
                  <th className="text-right p-3 font-medium">Infección</th>
                  <th className="text-right p-3 font-medium">Otros</th>
                  <th className="text-right p-3 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {dataActual.map((item, index) => {
                  const total = item.embarazo + item.hipertension + item.diabetes + item.infeccion + item.otros;
                  return (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="p-3 font-medium">
                        {periodo === 'dia' ? (item as any).fecha : periodo === 'mes' ? (item as any).mes : (item as any).año}
                      </td>
                      <td className="text-right p-3">
                        <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-200">
                          {item.embarazo}
                        </Badge>
                      </td>
                      <td className="text-right p-3">
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          {item.hipertension}
                        </Badge>
                      </td>
                      <td className="text-right p-3">
                        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                          {item.diabetes}
                        </Badge>
                      </td>
                      <td className="text-right p-3">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {item.infeccion}
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

      {/* Análisis de tendencias */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Análisis de Tendencias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <p className="font-medium">Diagnósticos en Aumento</p>
              </div>
              <p className="text-sm text-muted-foreground">Embarazo, Hipertensión</p>
              <p className="text-lg font-bold text-green-600">+12.5%</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-4 w-4 text-red-600" />
                <p className="font-medium">Diagnósticos en Descenso</p>
              </div>
              <p className="text-sm text-muted-foreground">Infecciones, Otros</p>
              <p className="text-lg font-bold text-red-600">-8.3%</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-blue-600" />
                <p className="font-medium">Estabilidad</p>
              </div>
              <p className="text-sm text-muted-foreground">Diabetes</p>
              <p className="text-lg font-bold text-blue-600">±2.1%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
