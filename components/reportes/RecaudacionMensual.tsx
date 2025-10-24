"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Calendar,
  DollarSign,
  Users,
  Activity,
  Target
} from "lucide-react";

interface RecaudacionMensualProps {
  mes?: string;
}

export default function RecaudacionMensual({ mes = "Octubre 2024" }: RecaudacionMensualProps) {
  // Mock data para recaudación mensual
  const recaudacionData = {
    mes: mes,
    totalRecaudado: 425800.00,
    totalTransacciones: 3420,
    promedioDiario: 13735.48,
    promedioSemanal: 96150.00,
    semanas: [
      { semana: "Sem 1", monto: 89500.00, transacciones: 720, tendencia: "up" },
      { semana: "Sem 2", monto: 92500.00, transacciones: 745, tendencia: "up" },
      { semana: "Sem 3", monto: 112000.00, transacciones: 890, tendencia: "up" },
      { semana: "Sem 4", monto: 131800.00, transacciones: 1065, tendencia: "up" }
    ],
    servicios: [
      { nombre: "Consulta Obstétrica", monto: 108500.00, porcentaje: 25.5, tendencia: "up", crecimiento: 12.5 },
      { nombre: "Ecografía Obstétrica", monto: 89200.00, porcentaje: 20.9, tendencia: "up", crecimiento: 8.3 },
      { nombre: "Consulta Ginecológica", monto: 76500.00, porcentaje: 18.0, tendencia: "stable", crecimiento: 2.1 },
      { nombre: "Consulta Pediátrica", monto: 65400.00, porcentaje: 15.4, tendencia: "down", crecimiento: -3.2 },
      { nombre: "Medicamentos", monto: 86200.00, porcentaje: 20.2, tendencia: "up", crecimiento: 15.7 }
    ],
    profesionales: [
      { nombre: "Dr. Carlos Pérez", especialidad: "Obstetra", monto: 125000.00, citas: 580, tendencia: "up", crecimiento: 18.5 },
      { nombre: "Dra. Ana García", especialidad: "Ginecóloga", monto: 98000.00, citas: 450, tendencia: "stable", crecimiento: 3.2 },
      { nombre: "Dr. Luis Rodríguez", especialidad: "Pediatra", monto: 85000.00, citas: 380, tendencia: "down", crecimiento: -5.8 },
      { nombre: "Dra. María López", especialidad: "Obstetra", monto: 78000.00, citas: 360, tendencia: "up", crecimiento: 22.1 },
      { nombre: "Dr. Roberto Silva", especialidad: "Ginecólogo", monto: 39800.00, citas: 180, tendencia: "up", crecimiento: 35.4 }
    ],
    comparacionAnterior: {
      mesAnterior: "Septiembre 2024",
      montoAnterior: 398500.00,
      crecimiento: 6.9,
      tendencia: "up"
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con mes y totales */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Recaudación Mensual
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                {recaudacionData.mes}
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
              <p className="text-sm text-muted-foreground">Total Mensual</p>
              <p className="text-2xl font-bold text-green-600">
                S/ {recaudacionData.totalRecaudado.toFixed(2)}
              </p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <BarChart3 className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Transacciones</p>
              <p className="text-2xl font-bold text-primary">
                {recaudacionData.totalTransacciones}
              </p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Promedio Diario</p>
              <p className="text-2xl font-bold text-blue-600">
                S/ {recaudacionData.promedioDiario.toFixed(2)}
              </p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Crecimiento</p>
              <div className="flex items-center justify-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <p className="text-2xl font-bold text-green-600">
                  {recaudacionData.comparacionAnterior.crecimiento}%
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparación con mes anterior */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Comparación con Mes Anterior
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Mes Anterior</p>
              <p className="text-lg font-medium">
                {recaudacionData.comparacionAnterior.mesAnterior}
              </p>
              <p className="text-sm text-muted-foreground">
                S/ {recaudacionData.comparacionAnterior.montoAnterior.toFixed(2)}
              </p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Mes Actual</p>
              <p className="text-lg font-medium">{recaudacionData.mes}</p>
              <p className="text-sm text-muted-foreground">
                S/ {recaudacionData.totalRecaudado.toFixed(2)}
              </p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Diferencia</p>
              <div className="flex items-center justify-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <p className="text-lg font-bold text-green-600">
                  +{recaudacionData.comparacionAnterior.crecimiento}%
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                S/ {(recaudacionData.totalRecaudado - recaudacionData.comparacionAnterior.montoAnterior).toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recaudación por semana */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Recaudación por Semana
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recaudacionData.semanas.map((semana, index) => (
              <div key={index} className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">{semana.semana}</p>
                  <div className="flex items-center gap-1">
                    {semana.tendencia === "up" && <TrendingUp className="h-4 w-4 text-green-600" />}
                    {semana.tendencia === "down" && <TrendingDown className="h-4 w-4 text-red-600" />}
                    {semana.tendencia === "stable" && <div className="w-4 h-4 bg-gray-400 rounded-full" />}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-green-600">
                    S/ {semana.monto.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {semana.transacciones} transacciones
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Servicios por recaudación */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Servicios por Recaudación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recaudacionData.servicios.map((servicio, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{servicio.nombre}</p>
                      {servicio.tendencia === "up" && <TrendingUp className="h-3 w-3 text-green-600" />}
                      {servicio.tendencia === "down" && <TrendingDown className="h-3 w-3 text-red-600" />}
                      {servicio.tendencia === "stable" && <div className="w-3 h-3 bg-gray-400 rounded-full" />}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Crecimiento: {servicio.crecimiento > 0 ? '+' : ''}{servicio.crecimiento}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">
                      S/ {servicio.monto.toFixed(2)}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {servicio.porcentaje}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Productividad por profesional */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Productividad por Profesional
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recaudacionData.profesionales.map((profesional, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{profesional.nombre}</p>
                      {profesional.tendencia === "up" && <TrendingUp className="h-3 w-3 text-green-600" />}
                      {profesional.tendencia === "down" && <TrendingDown className="h-3 w-3 text-red-600" />}
                      {profesional.tendencia === "stable" && <div className="w-3 h-3 bg-gray-400 rounded-full" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{profesional.especialidad}</p>
                    <p className="text-sm text-muted-foreground">
                      {profesional.citas} citas • Crecimiento: {profesional.crecimiento > 0 ? '+' : ''}{profesional.crecimiento}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">
                      S/ {profesional.monto.toFixed(2)}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {((profesional.monto / recaudacionData.totalRecaudado) * 100).toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
