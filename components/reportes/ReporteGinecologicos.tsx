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
  Heart,
  Target,
  BarChart3,
  Users,
  AlertTriangle,
  CheckCircle,
  Eye,
  TestTube,
  Shield,
  Zap
} from "lucide-react";

interface ReporteGinecologicosProps {
  periodo: 'dia' | 'mes' | 'año';
}

// Tipos para los datos ginecológicos
interface GinecologicoBase {
  pap: number;
  lesionesPreMalignas: number;
  colposcopia: number;
  termocoagulacion: number;
  biopsiaMama: number;
  mamografia: number;
  ecografiaMama: number;
  otros: number;
}

interface GinecologicoDia extends GinecologicoBase {
  fecha: string;
}

interface GinecologicoMes extends GinecologicoBase {
  mes: string;
}

interface GinecologicoAño extends GinecologicoBase {
  año: string;
}

type GinecologicoItem = GinecologicoDia | GinecologicoMes | GinecologicoAño;

export default function ReporteGinecologicos({ periodo = 'mes' }: ReporteGinecologicosProps) {
  
  // Mock data para reportes ginecológicos
  const ginecologicosData = {
    dia: [
      { 
        fecha: "2024-10-20", 
        pap: 5, 
        lesionesPreMalignas: 1, 
        colposcopia: 2, 
        termocoagulacion: 1,
        biopsiaMama: 0,
        mamografia: 2,
        ecografiaMama: 1,
        otros: 1
      },
      { 
        fecha: "2024-10-21", 
        pap: 4, 
        lesionesPreMalignas: 0, 
        colposcopia: 1, 
        termocoagulacion: 0,
        biopsiaMama: 1,
        mamografia: 1,
        ecografiaMama: 2,
        otros: 0
      },
      { 
        fecha: "2024-10-22", 
        pap: 6, 
        lesionesPreMalignas: 2, 
        colposcopia: 3, 
        termocoagulacion: 1,
        biopsiaMama: 0,
        mamografia: 3,
        ecografiaMama: 1,
        otros: 1
      },
      { 
        fecha: "2024-10-23", 
        pap: 5, 
        lesionesPreMalignas: 1, 
        colposcopia: 2, 
        termocoagulacion: 2,
        biopsiaMama: 1,
        mamografia: 2,
        ecografiaMama: 2,
        otros: 0
      },
      { 
        fecha: "2024-10-24", 
        pap: 4, 
        lesionesPreMalignas: 0, 
        colposcopia: 1, 
        termocoagulacion: 0,
        biopsiaMama: 0,
        mamografia: 1,
        ecografiaMama: 1,
        otros: 1
      },
      { 
        fecha: "2024-10-25", 
        pap: 5, 
        lesionesPreMalignas: 1, 
        colposcopia: 2, 
        termocoagulacion: 1,
        biopsiaMama: 1,
        mamografia: 2,
        ecografiaMama: 1,
        otros: 0
      },
      { 
        fecha: "2024-10-26", 
        pap: 6, 
        lesionesPreMalignas: 2, 
        colposcopia: 3, 
        termocoagulacion: 1,
        biopsiaMama: 0,
        mamografia: 3,
        ecografiaMama: 2,
        otros: 1
      }
    ],
    mes: [
      { 
        mes: "Enero", 
        pap: 150, 
        lesionesPreMalignas: 30, 
        colposcopia: 60, 
        termocoagulacion: 25,
        biopsiaMama: 15,
        mamografia: 80,
        ecografiaMama: 45,
        otros: 20
      },
      { 
        mes: "Febrero", 
        pap: 140, 
        lesionesPreMalignas: 25, 
        colposcopia: 55, 
        termocoagulacion: 20,
        biopsiaMama: 18,
        mamografia: 75,
        ecografiaMama: 50,
        otros: 15
      },
      { 
        mes: "Marzo", 
        pap: 160, 
        lesionesPreMalignas: 35, 
        colposcopia: 65, 
        termocoagulacion: 30,
        biopsiaMama: 12,
        mamografia: 85,
        ecografiaMama: 40,
        otros: 25
      },
      { 
        mes: "Abril", 
        pap: 155, 
        lesionesPreMalignas: 28, 
        colposcopia: 58, 
        termocoagulacion: 22,
        biopsiaMama: 20,
        mamografia: 78,
        ecografiaMama: 48,
        otros: 18
      },
      { 
        mes: "Mayo", 
        pap: 165, 
        lesionesPreMalignas: 32, 
        colposcopia: 68, 
        termocoagulacion: 28,
        biopsiaMama: 16,
        mamografia: 88,
        ecografiaMama: 42,
        otros: 22
      },
      { 
        mes: "Junio", 
        pap: 170, 
        lesionesPreMalignas: 38, 
        colposcopia: 72, 
        termocoagulacion: 32,
        biopsiaMama: 14,
        mamografia: 92,
        ecografiaMama: 38,
        otros: 28
      }
    ],
    año: [
      { 
        año: "2021", 
        pap: 1800, 
        lesionesPreMalignas: 360, 
        colposcopia: 720, 
        termocoagulacion: 300,
        biopsiaMama: 180,
        mamografia: 960,
        ecografiaMama: 540,
        otros: 240
      },
      { 
        año: "2022", 
        pap: 1900, 
        lesionesPreMalignas: 380, 
        colposcopia: 760, 
        termocoagulacion: 320,
        biopsiaMama: 200,
        mamografia: 1020,
        ecografiaMama: 580,
        otros: 220
      },
      { 
        año: "2023", 
        pap: 2000, 
        lesionesPreMalignas: 400, 
        colposcopia: 800, 
        termocoagulacion: 340,
        biopsiaMama: 220,
        mamografia: 1080,
        ecografiaMama: 620,
        otros: 200
      },
      { 
        año: "2024", 
        pap: 2100, 
        lesionesPreMalignas: 420, 
        colposcopia: 840, 
        termocoagulacion: 360,
        biopsiaMama: 240,
        mamografia: 1140,
        ecografiaMama: 660,
        otros: 180
      }
    ]
  };

  const dataActual = ginecologicosData[periodo];

  // Función helper para obtener el valor de fecha/mes/año de manera type-safe
  const getPeriodoValue = (item: GinecologicoItem, periodo: 'dia' | 'mes' | 'año'): string => {
    switch (periodo) {
      case 'dia':
        return (item as GinecologicoDia).fecha;
      case 'mes':
        return (item as GinecologicoMes).mes;
      case 'año':
        return (item as GinecologicoAño).año;
      default:
        return '';
    }
  };

  const procedimientos = [
    { 
      nombre: 'pap', 
      label: 'PAP', 
      icono: TestTube, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      descripcion: 'Prueba de Papanicolaou'
    },
    { 
      nombre: 'lesionesPreMalignas', 
      label: 'Lesiones Pre-Malignas', 
      icono: AlertTriangle, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
      borderColor: 'border-orange-200 dark:border-orange-800',
      descripcion: 'Lesiones precancerosas de cérvix'
    },
    { 
      nombre: 'colposcopia', 
      label: 'Colposcopia', 
      icono: Eye, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
      descripcion: 'Examen colposcópico'
    },
    { 
      nombre: 'termocoagulacion', 
      label: 'Termocoagulación', 
      icono: Zap, 
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-950/20',
      borderColor: 'border-red-200 dark:border-red-800',
      descripcion: 'Tratamiento por calor'
    },
    { 
      nombre: 'biopsiaMama', 
      label: 'Biopsia de Mama', 
      icono: Shield, 
      color: 'text-pink-600',
      bgColor: 'bg-pink-50 dark:bg-pink-950/20',
      borderColor: 'border-pink-200 dark:border-pink-800',
      descripcion: 'Biopsia mamaria'
    },
    { 
      nombre: 'mamografia', 
      label: 'Mamografía', 
      icono: Heart, 
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/20',
      borderColor: 'border-indigo-200 dark:border-indigo-800',
      descripcion: 'Estudio mamográfico'
    },
    { 
      nombre: 'ecografiaMama', 
      label: 'Ecografía de Mama', 
      icono: Activity, 
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
      borderColor: 'border-green-200 dark:border-green-800',
      descripcion: 'Ecografía mamaria'
    },
    { 
      nombre: 'otros', 
      label: 'Otros', 
      icono: Activity, 
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 dark:bg-gray-950/20',
      borderColor: 'border-gray-200 dark:border-gray-800',
      descripcion: 'Otros procedimientos'
    }
  ];

  const getTotalProcedimientos = () => {
    return dataActual.reduce((sum, item) => 
      sum + item.pap + item.lesionesPreMalignas + item.colposcopia + item.termocoagulacion + 
      item.biopsiaMama + item.mamografia + item.ecografiaMama + item.otros, 0
    );
  };

  const getTotalPAP = () => {
    return dataActual.reduce((sum, item) => sum + item.pap, 0);
  };

  const getTotalLesiones = () => {
    return dataActual.reduce((sum, item) => sum + item.lesionesPreMalignas, 0);
  };

  const getTotalColposcopias = () => {
    return dataActual.reduce((sum, item) => sum + item.colposcopia, 0);
  };

  const getTotalTermocoagulaciones = () => {
    return dataActual.reduce((sum, item) => sum + item.termocoagulacion, 0);
  };

  const getTotalBiopsiasMama = () => {
    return dataActual.reduce((sum, item) => sum + item.biopsiaMama, 0);
  };

  const getTasaLesiones = () => {
    const totalPAP = getTotalPAP();
    const totalLesiones = getTotalLesiones();
    return totalPAP > 0 ? ((totalLesiones / totalPAP) * 100).toFixed(2) : '0';
  };

  const getTasaColposcopia = () => {
    const totalLesiones = getTotalLesiones();
    const totalColposcopia = getTotalColposcopias();
    return totalLesiones > 0 ? ((totalColposcopia / totalLesiones) * 100).toFixed(2) : '0';
  };

  const getTasaTermocoagulacion = () => {
    const totalColposcopia = getTotalColposcopias();
    const totalTermocoagulacion = getTotalTermocoagulaciones();
    return totalColposcopia > 0 ? ((totalTermocoagulacion / totalColposcopia) * 100).toFixed(2) : '0';
  };

  const getTendencia = (campo: string) => {
    if (dataActual.length < 2) return 'stable';
    const ultimo = dataActual[dataActual.length - 1][campo as keyof typeof dataActual[0]] as number;
    const anterior = dataActual[dataActual.length - 2][campo as keyof typeof dataActual[0]] as number;
    
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
                <Heart className="h-5 w-5 text-primary" />
                Reportes Ginecológicos
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
              <TestTube className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Total PAP</p>
              <p className="text-2xl font-bold text-primary">
                {getTotalPAP().toLocaleString()}
              </p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Lesiones Pre-Malignas</p>
              <p className="text-2xl font-bold text-orange-600">
                {getTotalLesiones().toLocaleString()}
              </p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Eye className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Colposcopias</p>
              <p className="text-2xl font-bold text-purple-600">
                {getTotalColposcopias().toLocaleString()}
              </p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Shield className="h-8 w-8 text-pink-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Biopsias de Mama</p>
              <p className="text-2xl font-bold text-pink-600">
                {getTotalBiopsiasMama().toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {procedimientos.slice(0, 4).map((procedimiento) => {
          const total = dataActual.reduce((sum, item) => sum + (item[procedimiento.nombre as keyof typeof item] as number), 0);
          const porcentaje = ((total / getTotalProcedimientos()) * 100).toFixed(1);
          const tendencia = getTendencia(procedimiento.nombre);
          const IconoComponente = procedimiento.icono;
          
          return (
            <Card key={procedimiento.nombre} className={`${procedimiento.bgColor} ${procedimiento.borderColor} border`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <IconoComponente className={`h-5 w-5 ${procedimiento.color}`} />
                    <p className="font-medium text-sm">{procedimiento.label}</p>
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
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${procedimiento.color.replace('text-', 'bg-')}`}
                      style={{ width: `${porcentaje}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Indicadores de calidad */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Indicadores de Calidad y Seguimiento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <p className="font-medium">Tasa de Lesiones Pre-Malignas</p>
              </div>
              <p className="text-2xl font-bold text-orange-600">
                {getTasaLesiones()}%
              </p>
              <p className="text-sm text-muted-foreground">
                Sobre total de PAP realizados
              </p>
              <div className="flex items-center gap-1 mt-2">
                {getTendencia('lesionesPreMalignas') === 'up' && <TrendingUp className="h-3 w-3 text-red-600" />}
                {getTendencia('lesionesPreMalignas') === 'down' && <TrendingDown className="h-3 w-3 text-green-600" />}
                {getTendencia('lesionesPreMalignas') === 'stable' && <div className="w-3 h-3 bg-gray-400 rounded-full" />}
                <p className="text-xs text-muted-foreground">+2.1% vs anterior</p>
              </div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="h-4 w-4 text-purple-600" />
                <p className="font-medium">Tasa de Colposcopia</p>
              </div>
              <p className="text-2xl font-bold text-purple-600">
                {getTasaColposcopia()}%
              </p>
              <p className="text-sm text-muted-foreground">
                Sobre lesiones detectadas
              </p>
              <div className="flex items-center gap-1 mt-2">
                {getTendencia('colposcopia') === 'up' && <TrendingUp className="h-3 w-3 text-green-600" />}
                {getTendencia('colposcopia') === 'down' && <TrendingDown className="h-3 w-3 text-red-600" />}
                {getTendencia('colposcopia') === 'stable' && <div className="w-3 h-3 bg-gray-400 rounded-full" />}
                <p className="text-xs text-muted-foreground">+5.3% vs anterior</p>
              </div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-red-600" />
                <p className="font-medium">Tasa de Termocoagulación</p>
              </div>
              <p className="text-2xl font-bold text-red-600">
                {getTasaTermocoagulacion()}%
              </p>
              <p className="text-sm text-muted-foreground">
                Sobre colposcopias realizadas
              </p>
              <div className="flex items-center gap-1 mt-2">
                {getTendencia('termocoagulacion') === 'up' && <TrendingUp className="h-3 w-3 text-green-600" />}
                {getTendencia('termocoagulacion') === 'down' && <TrendingDown className="h-3 w-3 text-red-600" />}
                {getTendencia('termocoagulacion') === 'stable' && <div className="w-3 h-3 bg-gray-400 rounded-full" />}
                <p className="text-xs text-muted-foreground">+1.8% vs anterior</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
                  <th className="text-right p-3 font-medium">PAP</th>
                  <th className="text-right p-3 font-medium">Lesiones Pre-Mal.</th>
                  <th className="text-right p-3 font-medium">Colposcopia</th>
                  <th className="text-right p-3 font-medium">Termocoagulación</th>
                  <th className="text-right p-3 font-medium">Biopsia Mama</th>
                  <th className="text-right p-3 font-medium">Mamografía</th>
                  <th className="text-right p-3 font-medium">Ecog. Mama</th>
                </tr>
              </thead>
              <tbody>
                {dataActual.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">
                      {getPeriodoValue(item, periodo)}
                    </td>
                    <td className="text-right p-3">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {item.pap}
                      </Badge>
                    </td>
                    <td className="text-right p-3">
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                        {item.lesionesPreMalignas}
                      </Badge>
                    </td>
                    <td className="text-right p-3">
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        {item.colposcopia}
                      </Badge>
                    </td>
                    <td className="text-right p-3">
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        {item.termocoagulacion}
                      </Badge>
                    </td>
                    <td className="text-right p-3">
                      <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-200">
                        {item.biopsiaMama}
                      </Badge>
                    </td>
                    <td className="text-right p-3">
                      <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                        {item.mamografia}
                      </Badge>
                    </td>
                    <td className="text-right p-3">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {item.ecografiaMama}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Resumen de procedimientos mamarios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Procedimientos de Mama
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="h-4 w-4 text-indigo-600" />
                <p className="font-medium">Mamografías</p>
              </div>
              <p className="text-2xl font-bold text-indigo-600">
                {dataActual.reduce((sum, item) => sum + item.mamografia, 0).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">
                Estudio de tamizaje
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-green-600" />
                <p className="font-medium">Ecografías de Mama</p>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {dataActual.reduce((sum, item) => sum + item.ecografiaMama, 0).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">
                Estudio complementario
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-pink-600" />
                <p className="font-medium">Biopsias de Mama</p>
              </div>
              <p className="text-2xl font-bold text-pink-600">
                {getTotalBiopsiasMama().toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">
                Procedimiento diagnóstico
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
