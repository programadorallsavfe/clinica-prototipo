"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  DollarSign,
  Users,
  Activity,
  Target,
  Award,
  Calendar,
  Clock
} from "lucide-react";

interface ComisionesProfesionalProps {
  periodo?: string;
}

export default function ComisionesProfesional({ periodo = "Octubre 2024" }: ComisionesProfesionalProps) {
  // Mock data para comisiones por profesional
  const comisionesData = {
    periodo: periodo,
    totalComisiones: 42580.00,
    totalRecaudado: 425800.00,
    porcentajeComision: 10.0,
    profesionales: [
      {
        nombre: "Dr. Carlos Pérez",
        especialidad: "Obstetra",
        recaudado: 125000.00,
        comision: 12500.00,
        porcentaje: 10.0,
        citas: 580,
        promedioPorCita: 21.55,
        tendencia: "up",
        ranking: 1,
        pagado: true,
        fechaPago: "2024-10-31"
      },
      {
        nombre: "Dra. Ana García",
        especialidad: "Ginecóloga",
        recaudado: 98000.00,
        comision: 9800.00,
        porcentaje: 10.0,
        citas: 450,
        promedioPorCita: 21.78,
        tendencia: "stable",
        ranking: 2,
        pagado: true,
        fechaPago: "2024-10-31"
      },
      {
        nombre: "Dr. Luis Rodríguez",
        especialidad: "Pediatra",
        recaudado: 85000.00,
        comision: 8500.00,
        porcentaje: 10.0,
        citas: 380,
        promedioPorCita: 22.37,
        tendencia: "down",
        ranking: 3,
        pagado: false,
        fechaPago: null
      },
      {
        nombre: "Dra. María López",
        especialidad: "Obstetra",
        recaudado: 78000.00,
        comision: 7800.00,
        porcentaje: 10.0,
        citas: 360,
        promedioPorCita: 21.67,
        tendencia: "up",
        ranking: 4,
        pagado: false,
        fechaPago: null
      },
      {
        nombre: "Dr. Roberto Silva",
        especialidad: "Ginecólogo",
        recaudado: 39800.00,
        comision: 3980.00,
        porcentaje: 10.0,
        citas: 180,
        promedioPorCita: 22.11,
        tendencia: "up",
        ranking: 5,
        pagado: false,
        fechaPago: null
      }
    ],
    resumen: {
      totalPagado: 22300.00,
      totalPendiente: 20280.00,
      profesionalesPagados: 2,
      profesionalesPendientes: 3
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con período y totales */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Comisiones por Profesional
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                {comisionesData.periodo}
              </p>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Total Comisiones</p>
              <p className="text-2xl font-bold text-green-600">
                S/ {comisionesData.totalComisiones.toFixed(2)}
              </p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Target className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">% Comisión</p>
              <p className="text-2xl font-bold text-primary">
                {comisionesData.porcentajeComision}%
              </p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Pagado</p>
              <p className="text-2xl font-bold text-blue-600">
                S/ {comisionesData.resumen.totalPagado.toFixed(2)}
              </p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Pendiente</p>
              <p className="text-2xl font-bold text-orange-600">
                S/ {comisionesData.resumen.totalPendiente.toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumen de pagos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Resumen de Pagos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <p className="font-medium text-green-800 dark:text-green-200">Comisiones Pagadas</p>
              </div>
              <p className="text-2xl font-bold text-green-600">
                S/ {comisionesData.resumen.totalPagado.toFixed(2)}
              </p>
              <p className="text-sm text-green-600">
                {comisionesData.resumen.profesionalesPagados} profesional(es)
              </p>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <p className="font-medium text-orange-800 dark:text-orange-200">Comisiones Pendientes</p>
              </div>
              <p className="text-2xl font-bold text-orange-600">
                S/ {comisionesData.resumen.totalPendiente.toFixed(2)}
              </p>
              <p className="text-sm text-orange-600">
                {comisionesData.resumen.profesionalesPendientes} profesional(es)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detalle por profesional */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Detalle de Comisiones por Profesional
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {comisionesData.profesionales.map((profesional, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                    {profesional.ranking}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{profesional.nombre}</p>
                      {profesional.tendencia === "up" && <TrendingUp className="h-3 w-3 text-green-600" />}
                      {profesional.tendencia === "down" && <TrendingDown className="h-3 w-3 text-red-600" />}
                      {profesional.tendencia === "stable" && <div className="w-3 h-3 bg-gray-400 rounded-full" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{profesional.especialidad}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-sm text-muted-foreground">
                        {profesional.citas} citas
                      </p>
                      <p className="text-sm text-muted-foreground">
                        S/ {profesional.promedioPorCita.toFixed(2)} promedio
                      </p>
                      <p className="text-sm text-muted-foreground">
                        S/ {profesional.recaudado.toFixed(2)} recaudado
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">
                    S/ {profesional.comision.toFixed(2)}
                  </p>
                  <Badge 
                    variant={profesional.pagado ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {profesional.pagado ? "Pagado" : "Pendiente"}
                  </Badge>
                  {profesional.fechaPago && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(profesional.fechaPago).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Métricas de comisiones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Métricas de Comisiones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <p className="font-medium">Comisión Promedio</p>
              </div>
              <p className="text-2xl font-bold text-green-600">
                S/ {(comisionesData.totalComisiones / comisionesData.profesionales.length).toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">
                Por profesional
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-blue-600" />
                <p className="font-medium">% Pagado</p>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {((comisionesData.resumen.totalPagado / comisionesData.totalComisiones) * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground">
                Del total de comisiones
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-purple-600" />
                <p className="font-medium">Comisión vs Recaudación</p>
              </div>
              <p className="text-2xl font-bold text-purple-600">
                {comisionesData.porcentajeComision}%
              </p>
              <p className="text-sm text-muted-foreground">
                Del total recaudado
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
