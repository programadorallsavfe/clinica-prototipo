"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Baby, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Calendar,
  Heart,
  Activity,
  Target,
  BarChart3,
  Users,
  AlertTriangle,
  CheckCircle,
  Eye,
  TestTube,
  Clock
} from "lucide-react";

interface ReporteGestantesProps {
  periodo: 'dia' | 'mes' | 'año';
}

export default function ReporteGestantes({ periodo = 'mes' }: ReporteGestantesProps) {
  
  // Mock data para reportes de gestantes
  const gestantesData = {
    dia: [
      { 
        fecha: "2024-10-20", 
        gestantesNuevas: 3, 
        controlPrenatal: 8, 
        ecografiaGenetica: 2, 
        ecografiaMorfologica: 1,
        altoRiesgo: 2,
        bajoRiesgo: 6,
        grupo18_25: 2,
        grupo26_35: 4,
        grupo36_45: 2,
        grupo46: 0
      },
      { 
        fecha: "2024-10-21", 
        gestantesNuevas: 4, 
        controlPrenatal: 9, 
        ecografiaGenetica: 3, 
        ecografiaMorfologica: 2,
        altoRiesgo: 3,
        bajoRiesgo: 6,
        grupo18_25: 3,
        grupo26_35: 5,
        grupo36_45: 1,
        grupo46: 0
      },
      { 
        fecha: "2024-10-22", 
        gestantesNuevas: 2, 
        controlPrenatal: 7, 
        ecografiaGenetica: 1, 
        ecografiaMorfologica: 1,
        altoRiesgo: 1,
        bajoRiesgo: 6,
        grupo18_25: 2,
        grupo26_35: 4,
        grupo36_45: 1,
        grupo46: 0
      },
      { 
        fecha: "2024-10-23", 
        gestantesNuevas: 5, 
        controlPrenatal: 10, 
        ecografiaGenetica: 2, 
        ecografiaMorfologica: 2,
        altoRiesgo: 2,
        bajoRiesgo: 8,
        grupo18_25: 3,
        grupo26_35: 5,
        grupo36_45: 2,
        grupo46: 0
      },
      { 
        fecha: "2024-10-24", 
        gestantesNuevas: 3, 
        controlPrenatal: 8, 
        ecografiaGenetica: 3, 
        ecografiaMorfologica: 1,
        altoRiesgo: 3,
        bajoRiesgo: 5,
        grupo18_25: 2,
        grupo26_35: 4,
        grupo36_45: 2,
        grupo46: 0
      },
      { 
        fecha: "2024-10-25", 
        gestantesNuevas: 4, 
        controlPrenatal: 9, 
        ecografiaGenetica: 2, 
        ecografiaMorfologica: 2,
        altoRiesgo: 2,
        bajoRiesgo: 7,
        grupo18_25: 3,
        grupo26_35: 5,
        grupo36_45: 1,
        grupo46: 0
      },
      { 
        fecha: "2024-10-26", 
        gestantesNuevas: 2, 
        controlPrenatal: 6, 
        ecografiaGenetica: 1, 
        ecografiaMorfologica: 1,
        altoRiesgo: 1,
        bajoRiesgo: 5,
        grupo18_25: 1,
        grupo26_35: 4,
        grupo36_45: 1,
        grupo46: 0
      }
    ],
    mes: [
      { 
        mes: "Enero", 
        gestantesNuevas: 90, 
        controlPrenatal: 240, 
        ecografiaGenetica: 60, 
        ecografiaMorfologica: 45,
        altoRiesgo: 75,
        bajoRiesgo: 165,
        grupo18_25: 60,
        grupo26_35: 120,
        grupo36_45: 50,
        grupo46: 10
      },
      { 
        mes: "Febrero", 
        gestantesNuevas: 95, 
        controlPrenatal: 250, 
        ecografiaGenetica: 65, 
        ecografiaMorfologica: 50,
        altoRiesgo: 80,
        bajoRiesgo: 170,
        grupo18_25: 65,
        grupo26_35: 125,
        grupo36_45: 45,
        grupo46: 15
      },
      { 
        mes: "Marzo", 
        gestantesNuevas: 85, 
        controlPrenatal: 230, 
        ecografiaGenetica: 55, 
        ecografiaMorfologica: 40,
        altoRiesgo: 70,
        bajoRiesgo: 160,
        grupo18_25: 55,
        grupo26_35: 115,
        grupo36_45: 50,
        grupo46: 10
      },
      { 
        mes: "Abril", 
        gestantesNuevas: 100, 
        controlPrenatal: 260, 
        ecografiaGenetica: 70, 
        ecografiaMorfologica: 55,
        altoRiesgo: 85,
        bajoRiesgo: 175,
        grupo18_25: 70,
        grupo26_35: 130,
        grupo36_45: 45,
        grupo46: 15
      },
      { 
        mes: "Mayo", 
        gestantesNuevas: 105, 
        controlPrenatal: 270, 
        ecografiaGenetica: 75, 
        ecografiaMorfologica: 60,
        altoRiesgo: 90,
        bajoRiesgo: 180,
        grupo18_25: 75,
        grupo26_35: 135,
        grupo36_45: 50,
        grupo46: 10
      },
      { 
        mes: "Junio", 
        gestantesNuevas: 110, 
        controlPrenatal: 280, 
        ecografiaGenetica: 80, 
        ecografiaMorfologica: 65,
        altoRiesgo: 95,
        bajoRiesgo: 185,
        grupo18_25: 80,
        grupo26_35: 140,
        grupo36_45: 55,
        grupo46: 5
      }
    ],
    año: [
      { 
        año: "2021", 
        gestantesNuevas: 1200, 
        controlPrenatal: 3000, 
        ecografiaGenetica: 800, 
        ecografiaMorfologica: 600,
        altoRiesgo: 1000,
        bajoRiesgo: 2000,
        grupo18_25: 800,
        grupo26_35: 1500,
        grupo36_45: 600,
        grupo46: 100
      },
      { 
        año: "2022", 
        gestantesNuevas: 1300, 
        controlPrenatal: 3200, 
        ecografiaGenetica: 900, 
        ecografiaMorfologica: 700,
        altoRiesgo: 1100,
        bajoRiesgo: 2100,
        grupo18_25: 900,
        grupo26_35: 1600,
        grupo36_45: 650,
        grupo46: 50
      },
      { 
        año: "2023", 
        gestantesNuevas: 1400, 
        controlPrenatal: 3400, 
        ecografiaGenetica: 1000, 
        ecografiaMorfologica: 800,
        altoRiesgo: 1200,
        bajoRiesgo: 2200,
        grupo18_25: 1000,
        grupo26_35: 1700,
        grupo36_45: 700,
        grupo46: 0
      },
      { 
        año: "2024", 
        gestantesNuevas: 1500, 
        controlPrenatal: 3600, 
        ecografiaGenetica: 1100, 
        ecografiaMorfologica: 900,
        altoRiesgo: 1300,
        bajoRiesgo: 2300,
        grupo18_25: 1100,
        grupo26_35: 1800,
        grupo36_45: 750,
        grupo46: 0
      }
    ]
  };

  const dataActual = gestantesData[periodo];

  const getTotalGestantes = () => {
    return dataActual.reduce((sum, item) => sum + item.gestantesNuevas, 0);
  };

  const getTotalControles = () => {
    return dataActual.reduce((sum, item) => sum + item.controlPrenatal, 0);
  };

  const getTotalEcografias = () => {
    return dataActual.reduce((sum, item) => sum + item.ecografiaGenetica + item.ecografiaMorfologica, 0);
  };

  const getTotalAltoRiesgo = () => {
    return dataActual.reduce((sum, item) => sum + item.altoRiesgo, 0);
  };

  const getTotalBajoRiesgo = () => {
    return dataActual.reduce((sum, item) => sum + item.bajoRiesgo, 0);
  };

  const getPorcentajeAltoRiesgo = () => {
    const totalRiesgo = getTotalAltoRiesgo() + getTotalBajoRiesgo();
    return totalRiesgo > 0 ? ((getTotalAltoRiesgo() / totalRiesgo) * 100).toFixed(1) : '0';
  };

  const getGrupoEtarioPrincipal = () => {
    const grupos = {
      '18-25': dataActual.reduce((sum, item) => sum + item.grupo18_25, 0),
      '26-35': dataActual.reduce((sum, item) => sum + item.grupo26_35, 0),
      '36-45': dataActual.reduce((sum, item) => sum + item.grupo36_45, 0),
      '46+': dataActual.reduce((sum, item) => sum + item.grupo46, 0)
    };
    
    const maxKey = Object.keys(grupos).reduce((a, b) => grupos[a as keyof typeof grupos] > grupos[b as keyof typeof grupos] ? a : b);
    return { grupo: maxKey, cantidad: grupos[maxKey as keyof typeof grupos] };
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
                <Baby className="h-5 w-5 text-primary" />
                Estadísticas de Gestantes
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
              <Baby className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Gestantes Nuevas</p>
              <p className="text-2xl font-bold text-primary">
                {getTotalGestantes().toLocaleString()}
              </p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Heart className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Controles Prenatales</p>
              <p className="text-2xl font-bold text-blue-600">
                {getTotalControles().toLocaleString()}
              </p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Eye className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Ecografías</p>
              <p className="text-2xl font-bold text-green-600">
                {getTotalEcografias().toLocaleString()}
              </p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Alto Riesgo</p>
              <p className="text-2xl font-bold text-orange-600">
                {getTotalAltoRiesgo().toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-pink-50 dark:bg-pink-950/20 border-pink-200 dark:border-pink-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Baby className="h-5 w-5 text-pink-600" />
              <p className="font-medium">Gestantes Nuevas</p>
            </div>
            <p className="text-2xl font-bold text-pink-600">
              {getTotalGestantes().toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              {periodo === 'dia' ? 'Últimos 7 días' : periodo === 'mes' ? 'Últimos 6 meses' : 'Últimos 4 años'}
            </p>
            <div className="flex items-center gap-1 mt-2">
              {getTendencia('gestantesNuevas') === 'up' && <TrendingUp className="h-3 w-3 text-green-600" />}
              {getTendencia('gestantesNuevas') === 'down' && <TrendingDown className="h-3 w-3 text-red-600" />}
              {getTendencia('gestantesNuevas') === 'stable' && <div className="w-3 h-3 bg-gray-400 rounded-full" />}
              <p className="text-xs text-muted-foreground">+8.5% vs anterior</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="h-5 w-5 text-blue-600" />
              <p className="font-medium">Control Prenatal</p>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {getTotalControles().toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              {((getTotalControles() / getTotalGestantes()) * 100).toFixed(1)}% de gestantes
            </p>
            <div className="flex items-center gap-1 mt-2">
              {getTendencia('controlPrenatal') === 'up' && <TrendingUp className="h-3 w-3 text-green-600" />}
              {getTendencia('controlPrenatal') === 'down' && <TrendingDown className="h-3 w-3 text-red-600" />}
              {getTendencia('controlPrenatal') === 'stable' && <div className="w-3 h-3 bg-gray-400 rounded-full" />}
              <p className="text-xs text-muted-foreground">+12.3% vs anterior</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="h-5 w-5 text-green-600" />
              <p className="font-medium">Ecografías</p>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {getTotalEcografias().toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              Genéticas: {dataActual.reduce((sum, item) => sum + item.ecografiaGenetica, 0)}
            </p>
            <p className="text-sm text-muted-foreground">
              Morfológicas: {dataActual.reduce((sum, item) => sum + item.ecografiaMorfologica, 0)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <p className="font-medium">Alto Riesgo</p>
            </div>
            <p className="text-2xl font-bold text-orange-600">
              {getTotalAltoRiesgo().toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              {getPorcentajeAltoRiesgo()}% del total
            </p>
            <div className="flex items-center gap-1 mt-2">
              {getTendencia('altoRiesgo') === 'up' && <TrendingUp className="h-3 w-3 text-red-600" />}
              {getTendencia('altoRiesgo') === 'down' && <TrendingDown className="h-3 w-3 text-green-600" />}
              {getTendencia('altoRiesgo') === 'stable' && <div className="w-3 h-3 bg-gray-400 rounded-full" />}
              <p className="text-xs text-muted-foreground">+5.2% vs anterior</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Análisis por grupo etario */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Distribución por Grupo Etario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">18-25 años</p>
              <p className="text-xl font-bold text-primary">
                {dataActual.reduce((sum, item) => sum + item.grupo18_25, 0)}
              </p>
              <p className="text-sm text-muted-foreground">
                {((dataActual.reduce((sum, item) => sum + item.grupo18_25, 0) / getTotalGestantes()) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">26-35 años</p>
              <p className="text-xl font-bold text-primary">
                {dataActual.reduce((sum, item) => sum + item.grupo26_35, 0)}
              </p>
              <p className="text-sm text-muted-foreground">
                {((dataActual.reduce((sum, item) => sum + item.grupo26_35, 0) / getTotalGestantes()) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">36-45 años</p>
              <p className="text-xl font-bold text-primary">
                {dataActual.reduce((sum, item) => sum + item.grupo36_45, 0)}
              </p>
              <p className="text-sm text-muted-foreground">
                {((dataActual.reduce((sum, item) => sum + item.grupo36_45, 0) / getTotalGestantes()) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">46+ años</p>
              <p className="text-xl font-bold text-primary">
                {dataActual.reduce((sum, item) => sum + item.grupo46, 0)}
              </p>
              <p className="text-sm text-muted-foreground">
                {((dataActual.reduce((sum, item) => sum + item.grupo46, 0) / getTotalGestantes()) * 100).toFixed(1)}%
              </p>
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
                  <th className="text-right p-3 font-medium">Nuevas</th>
                  <th className="text-right p-3 font-medium">Control Prenatal</th>
                  <th className="text-right p-3 font-medium">Ecog. Genética</th>
                  <th className="text-right p-3 font-medium">Ecog. Morfológica</th>
                  <th className="text-right p-3 font-medium">Alto Riesgo</th>
                  <th className="text-right p-3 font-medium">Bajo Riesgo</th>
                </tr>
              </thead>
              <tbody>
                {dataActual.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">
                      {periodo === 'dia' ? item.fecha : periodo === 'mes' ? item.mes : item.año}
                    </td>
                    <td className="text-right p-3">
                      <Badge variant="default" className="bg-pink-600 text-white">
                        {item.gestantesNuevas}
                      </Badge>
                    </td>
                    <td className="text-right p-3">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {item.controlPrenatal}
                      </Badge>
                    </td>
                    <td className="text-right p-3">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {item.ecografiaGenetica}
                      </Badge>
                    </td>
                    <td className="text-right p-3">
                      <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                        {item.ecografiaMorfologica}
                      </Badge>
                    </td>
                    <td className="text-right p-3">
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                        {item.altoRiesgo}
                      </Badge>
                    </td>
                    <td className="text-right p-3">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {item.bajoRiesgo}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Resumen de indicadores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Indicadores de Calidad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <p className="font-medium">Cobertura Control Prenatal</p>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {((getTotalControles() / getTotalGestantes()) * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground">
                Meta: 90% - Cumplida
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="h-4 w-4 text-blue-600" />
                <p className="font-medium">Cobertura Ecografías</p>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {((getTotalEcografias() / getTotalGestantes()) * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground">
                Meta: 80% - Cumplida
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <p className="font-medium">Prevalencia Alto Riesgo</p>
              </div>
              <p className="text-2xl font-bold text-orange-600">
                {getPorcentajeAltoRiesgo()}%
              </p>
              <p className="text-sm text-muted-foreground">
                Requiere seguimiento
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
