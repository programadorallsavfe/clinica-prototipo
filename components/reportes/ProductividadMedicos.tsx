"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Clock,
  DollarSign,
  Activity,
  Target,
  Award,
  Calendar
} from "lucide-react";

interface ProductividadMedicosProps {
  periodo?: string;
}

export default function ProductividadMedicos({ periodo = "Octubre 2024" }: ProductividadMedicosProps) {
  // Mock data para productividad médica
  const productividadData = {
    periodo: periodo,
    totalCitas: 1840,
    totalRecaudado: 425800.00,
    promedioCitasPorDia: 59.4,
    promedioTiempoAtencion: 28.5,
    medicos: [
      {
        nombre: "Dr. Carlos Pérez",
        especialidad: "Obstetra",
        citasAtendidas: 580,
        recaudado: 125000.00,
        tiempoPromedio: 32.5,
        satisfaccion: 4.8,
        eficiencia: 95.2,
        tendencia: "up",
        ranking: 1
      },
      {
        nombre: "Dra. Ana García",
        especialidad: "Ginecóloga",
        citasAtendidas: 450,
        recaudado: 98000.00,
        tiempoPromedio: 28.0,
        satisfaccion: 4.7,
        eficiencia: 92.8,
        tendencia: "stable",
        ranking: 2
      },
      {
        nombre: "Dr. Luis Rodríguez",
        especialidad: "Pediatra",
        citasAtendidas: 380,
        recaudado: 85000.00,
        tiempoPromedio: 25.5,
        satisfaccion: 4.6,
        eficiencia: 88.5,
        tendencia: "down",
        ranking: 3
      },
      {
        nombre: "Dra. María López",
        especialidad: "Obstetra",
        citasAtendidas: 360,
        recaudado: 78000.00,
        tiempoPromedio: 30.2,
        satisfaccion: 4.9,
        eficiencia: 91.3,
        tendencia: "up",
        ranking: 4
      },
      {
        nombre: "Dr. Roberto Silva",
        especialidad: "Ginecólogo",
        citasAtendidas: 180,
        recaudado: 39800.00,
        tiempoPromedio: 26.8,
        satisfaccion: 4.5,
        eficiencia: 87.2,
        tendencia: "up",
        ranking: 5
      }
    ],
    metricas: [
      { nombre: "Citas por Día", valor: 59.4, unidad: "citas", tendencia: "up", cambio: 5.2 },
      { nombre: "Tiempo Promedio", valor: 28.5, unidad: "min", tendencia: "down", cambio: -2.1 },
      { nombre: "Satisfacción", valor: 4.7, unidad: "/5", tendencia: "up", cambio: 0.3 },
      { nombre: "Eficiencia", valor: 91.0, unidad: "%", tendencia: "up", cambio: 3.8 }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header con período y métricas generales */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Productividad Médica
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                {productividadData.periodo}
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
              <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Total Citas</p>
              <p className="text-2xl font-bold text-primary">
                {productividadData.totalCitas}
              </p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Total Recaudado</p>
              <p className="text-2xl font-bold text-green-600">
                S/ {productividadData.totalRecaudado.toFixed(2)}
              </p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Tiempo Promedio</p>
              <p className="text-2xl font-bold text-blue-600">
                {productividadData.promedioTiempoAtencion} min
              </p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Activity className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Citas por Día</p>
              <p className="text-2xl font-bold text-purple-600">
                {productividadData.promedioCitasPorDia}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas clave */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Métricas Clave
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {productividadData.metricas.map((metrica, index) => (
              <div key={index} className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">{metrica.nombre}</p>
                  <div className="flex items-center gap-1">
                    {metrica.tendencia === "up" && <TrendingUp className="h-4 w-4 text-green-600" />}
                    {metrica.tendencia === "down" && <TrendingDown className="h-4 w-4 text-red-600" />}
                    {metrica.tendencia === "stable" && <div className="w-4 h-4 bg-gray-400 rounded-full" />}
                  </div>
                </div>
                <p className="text-2xl font-bold text-primary">
                  {metrica.valor} {metrica.unidad}
                </p>
                <p className="text-sm text-muted-foreground">
                  {metrica.cambio > 0 ? '+' : ''}{metrica.cambio}% vs mes anterior
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ranking de médicos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Ranking de Productividad por Médico
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {productividadData.medicos.map((medico, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                    {medico.ranking}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{medico.nombre}</p>
                      {medico.tendencia === "up" && <TrendingUp className="h-3 w-3 text-green-600" />}
                      {medico.tendencia === "down" && <TrendingDown className="h-3 w-3 text-red-600" />}
                      {medico.tendencia === "stable" && <div className="w-3 h-3 bg-gray-400 rounded-full" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{medico.especialidad}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-sm text-muted-foreground">
                        {medico.citasAtendidas} citas
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {medico.tiempoPromedio} min promedio
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ⭐ {medico.satisfaccion}/5
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">
                    S/ {medico.recaudado.toFixed(2)}
                  </p>
                  <Badge 
                    variant={medico.eficiencia >= 90 ? "default" : medico.eficiencia >= 80 ? "secondary" : "destructive"}
                    className="text-xs"
                  >
                    {medico.eficiencia}% eficiencia
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detalle por especialidad */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Resumen por Especialidad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {["Obstetra", "Ginecóloga", "Pediatra"].map((especialidad, index) => {
              const medicosEspecialidad = productividadData.medicos.filter(m => m.especialidad === especialidad);
              const totalCitas = medicosEspecialidad.reduce((sum, m) => sum + m.citasAtendidas, 0);
              const totalRecaudado = medicosEspecialidad.reduce((sum, m) => sum + m.recaudado, 0);
              const promedioSatisfaccion = medicosEspecialidad.reduce((sum, m) => sum + m.satisfaccion, 0) / medicosEspecialidad.length;
              
              return (
                <div key={index} className="p-4 bg-muted rounded-lg">
                  <p className="font-medium mb-2">{especialidad}</p>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      {medicosEspecialidad.length} médico(s)
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {totalCitas} citas totales
                    </p>
                    <p className="text-sm text-muted-foreground">
                      S/ {totalRecaudado.toFixed(2)} recaudado
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ⭐ {promedioSatisfaccion.toFixed(1)}/5 satisfacción
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
