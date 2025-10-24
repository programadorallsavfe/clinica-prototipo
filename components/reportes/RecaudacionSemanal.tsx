"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  BarChart3,
  DollarSign,
  Users,
  Activity
} from "lucide-react";

interface RecaudacionSemanalProps {
  semana?: string;
}

export default function RecaudacionSemanal({ semana = "Semana del 20-26 Oct 2024" }: RecaudacionSemanalProps) {
  // Mock data para recaudación semanal
  const recaudacionData = {
    semana: semana,
    totalRecaudado: 98750.00,
    totalTransacciones: 845,
    promedioDiario: 14107.14,
    dias: [
      { dia: "Lunes", fecha: "20 Oct", monto: 12500.00, transacciones: 98, tendencia: "up" },
      { dia: "Martes", fecha: "21 Oct", monto: 14200.00, transacciones: 112, tendencia: "up" },
      { dia: "Miércoles", fecha: "22 Oct", monto: 13800.00, transacciones: 108, tendencia: "down" },
      { dia: "Jueves", fecha: "23 Oct", monto: 15200.00, transacciones: 125, tendencia: "up" },
      { dia: "Viernes", fecha: "24 Oct", monto: 16800.00, transacciones: 135, tendencia: "up" },
      { dia: "Sábado", fecha: "25 Oct", monto: 14250.00, transacciones: 115, tendencia: "down" },
      { dia: "Domingo", fecha: "26 Oct", monto: 12000.00, transacciones: 95, tendencia: "down" }
    ],
    servicios: [
      { nombre: "Consulta Obstétrica", monto: 24500.00, porcentaje: 24.8, tendencia: "up" },
      { nombre: "Ecografía Obstétrica", monto: 19800.00, porcentaje: 20.1, tendencia: "up" },
      { nombre: "Consulta Ginecológica", monto: 17500.00, porcentaje: 17.7, tendencia: "stable" },
      { nombre: "Consulta Pediátrica", monto: 15200.00, porcentaje: 15.4, tendencia: "down" },
      { nombre: "Medicamentos", monto: 21750.00, porcentaje: 22.0, tendencia: "up" }
    ],
    profesionales: [
      { nombre: "Dr. Carlos Pérez", especialidad: "Obstetra", monto: 28500.00, citas: 145, tendencia: "up" },
      { nombre: "Dra. Ana García", especialidad: "Ginecóloga", monto: 22500.00, citas: 120, tendencia: "stable" },
      { nombre: "Dr. Luis Rodríguez", especialidad: "Pediatra", monto: 19800.00, citas: 95, tendencia: "down" },
      { nombre: "Dra. María López", especialidad: "Obstetra", monto: 18950.00, citas: 88, tendencia: "up" },
      { nombre: "Dr. Roberto Silva", especialidad: "Ginecólogo", monto: 9000.00, citas: 45, tendencia: "up" }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header con semana y totales */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Recaudación Semanal
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                {recaudacionData.semana}
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
              <p className="text-sm text-muted-foreground">Total Semanal</p>
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
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Profesionales</p>
              <p className="text-2xl font-bold text-purple-600">
                {recaudacionData.profesionales.length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recaudación por día */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Recaudación por Día
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recaudacionData.dias.map((dia, index) => (
              <div key={index} className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium">{dia.dia}</p>
                    <p className="text-sm text-muted-foreground">{dia.fecha}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {dia.tendencia === "up" && <TrendingUp className="h-4 w-4 text-green-600" />}
                    {dia.tendencia === "down" && <TrendingDown className="h-4 w-4 text-red-600" />}
                    {dia.tendencia === "stable" && <div className="w-4 h-4 bg-gray-400 rounded-full" />}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-green-600">
                    S/ {dia.monto.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {dia.transacciones} transacciones
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
                      {profesional.citas} citas
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
