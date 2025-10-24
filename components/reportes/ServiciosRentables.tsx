"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Download, 
  DollarSign,
  Activity,
  Target,
  Award,
  BarChart3,
  Users,
  Clock
} from "lucide-react";

interface ServiciosRentablesProps {
  periodo?: string;
}

export default function ServiciosRentables({ periodo = "Octubre 2024" }: ServiciosRentablesProps) {
  // Mock data para servicios más rentables
  const serviciosData = {
    periodo: periodo,
    totalServicios: 25,
    totalRecaudado: 425800.00,
    servicios: [
      {
        nombre: "Ecografía Obstétrica 4D",
        categoria: "Diagnóstico",
        precio: 180.00,
        costo: 45.00,
        margen: 135.00,
        margenPorcentaje: 75.0,
        cantidadVendida: 320,
        recaudado: 57600.00,
        rentabilidad: 43200.00,
        tendencia: "up",
        ranking: 1
      },
      {
        nombre: "Consulta Obstétrica Premium",
        categoria: "Consulta",
        precio: 120.00,
        costo: 25.00,
        margen: 95.00,
        margenPorcentaje: 79.2,
        cantidadVendida: 450,
        recaudado: 54000.00,
        rentabilidad: 42750.00,
        tendencia: "up",
        ranking: 2
      },
      {
        nombre: "Perfil Prenatal Completo",
        categoria: "Laboratorio",
        precio: 85.00,
        costo: 20.00,
        margen: 65.00,
        margenPorcentaje: 76.5,
        cantidadVendida: 380,
        recaudado: 32300.00,
        rentabilidad: 24700.00,
        tendencia: "up",
        ranking: 3
      },
      {
        nombre: "Consulta Ginecológica Especializada",
        categoria: "Consulta",
        precio: 100.00,
        costo: 22.00,
        margen: 78.00,
        margenPorcentaje: 78.0,
        cantidadVendida: 280,
        recaudado: 28000.00,
        rentabilidad: 21840.00,
        tendencia: "stable",
        ranking: 4
      },
      {
        nombre: "Ecografía Transvaginal",
        categoria: "Diagnóstico",
        precio: 95.00,
        costo: 30.00,
        margen: 65.00,
        margenPorcentaje: 68.4,
        cantidadVendida: 250,
        recaudado: 23750.00,
        rentabilidad: 16250.00,
        tendencia: "up",
        ranking: 5
      },
      {
        nombre: "Consulta Pediátrica",
        categoria: "Consulta",
        precio: 80.00,
        costo: 18.00,
        margen: 62.00,
        margenPorcentaje: 77.5,
        cantidadVendida: 200,
        recaudado: 16000.00,
        rentabilidad: 12400.00,
        tendencia: "down",
        ranking: 6
      }
    ],
    categorias: [
      { nombre: "Consulta", servicios: 8, recaudado: 125000.00, rentabilidad: 98500.00 },
      { nombre: "Diagnóstico", servicios: 6, recaudado: 145000.00, rentabilidad: 108000.00 },
      { nombre: "Laboratorio", servicios: 7, recaudado: 95000.00, rentabilidad: 72000.00 },
      { nombre: "Medicamentos", servicios: 4, recaudado: 60800.00, rentabilidad: 18240.00 }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header con período y totales */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Servicios Más Rentables
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                {serviciosData.periodo}
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
              <p className="text-sm text-muted-foreground">Total Recaudado</p>
              <p className="text-2xl font-bold text-green-600">
                S/ {serviciosData.totalRecaudado.toFixed(2)}
              </p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Activity className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Total Servicios</p>
              <p className="text-2xl font-bold text-primary">
                {serviciosData.totalServicios}
              </p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Margen Promedio</p>
              <p className="text-2xl font-bold text-blue-600">
                74.2%
              </p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Top Servicio</p>
              <p className="text-sm font-bold text-purple-600">
                Ecografía 4D
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ranking de servicios más rentables */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Ranking de Servicios por Rentabilidad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {serviciosData.servicios.map((servicio, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                    {servicio.ranking}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{servicio.nombre}</p>
                      {servicio.tendencia === "up" && <TrendingUp className="h-3 w-3 text-green-600" />}
                      {servicio.tendencia === "down" && <TrendingDown className="h-3 w-3 text-red-600" />}
                      {servicio.tendencia === "stable" && <div className="w-3 h-3 bg-gray-400 rounded-full" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{servicio.categoria}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-sm text-muted-foreground">
                        {servicio.cantidadVendida} vendidos
                      </p>
                      <p className="text-sm text-muted-foreground">
                        S/ {servicio.precio} precio
                      </p>
                      <p className="text-sm text-muted-foreground">
                        S/ {servicio.costo} costo
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">
                    S/ {servicio.rentabilidad.toFixed(2)}
                  </p>
                  <Badge 
                    variant={servicio.margenPorcentaje >= 75 ? "default" : servicio.margenPorcentaje >= 65 ? "secondary" : "outline"}
                    className="text-xs"
                  >
                    {servicio.margenPorcentaje}% margen
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    S/ {servicio.recaudado.toFixed(2)} recaudado
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Análisis por categoría */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Análisis por Categoría
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {serviciosData.categorias.map((categoria, index) => (
              <div key={index} className="p-4 bg-muted rounded-lg">
                <p className="font-medium mb-2">{categoria.nombre}</p>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {categoria.servicios} servicios
                  </p>
                  <p className="text-sm text-muted-foreground">
                    S/ {categoria.recaudado.toFixed(2)} recaudado
                  </p>
                  <p className="text-sm text-muted-foreground">
                    S/ {categoria.rentabilidad.toFixed(2)} rentabilidad
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {((categoria.rentabilidad / categoria.recaudado) * 100).toFixed(1)}% margen
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Métricas de rentabilidad */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Métricas de Rentabilidad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <p className="font-medium">Servicios de Alto Margen</p>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {serviciosData.servicios.filter(s => s.margenPorcentaje >= 75).length}
              </p>
              <p className="text-sm text-muted-foreground">
                Margen ≥ 75%
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-blue-600" />
                <p className="font-medium">Rentabilidad Total</p>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                S/ {serviciosData.servicios.reduce((sum, s) => sum + s.rentabilidad, 0).toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">
                Beneficio neto
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-purple-600" />
                <p className="font-medium">Servicios en Crecimiento</p>
              </div>
              <p className="text-2xl font-bold text-purple-600">
                {serviciosData.servicios.filter(s => s.tendencia === "up").length}
              </p>
              <p className="text-sm text-muted-foreground">
                Tendencia positiva
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
