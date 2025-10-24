"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Banknote, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  DollarSign,
  Users,
  Activity,
  Target,
  Award,
  Calendar,
  Clock,
  Handshake
} from "lucide-react";

interface ComisionesColaboradoresProps {
  periodo?: string;
}

export default function ComisionesColaboradores({ periodo = "Octubre 2024" }: ComisionesColaboradoresProps) {
  // Mock data para comisiones de colaboradores
  const comisionesData = {
    periodo: periodo,
    totalComisiones: 12850.00,
    totalReferidos: 85,
    colaboradores: [
      {
        nombre: "Clínica San José",
        tipo: "Clínica",
        contacto: "Dr. Roberto Mendoza",
        telefono: "987654321",
        referidos: 25,
        servicios: [
          { nombre: "Consulta Obstétrica", cantidad: 15, comision: 1200.00 },
          { nombre: "Ecografía Obstétrica", cantidad: 10, comision: 800.00 }
        ],
        totalComision: 2000.00,
        porcentaje: 15.6,
        tendencia: "up",
        ranking: 1,
        pagado: true,
        fechaPago: "2024-10-31"
      },
      {
        nombre: "Laboratorio Central",
        tipo: "Laboratorio",
        contacto: "Lic. María González",
        telefono: "987654322",
        referidos: 20,
        servicios: [
          { nombre: "Perfil Prenatal", cantidad: 12, comision: 960.00 },
          { nombre: "Hemograma Completo", cantidad: 8, comision: 400.00 }
        ],
        totalComision: 1360.00,
        porcentaje: 10.6,
        tendencia: "up",
        ranking: 2,
        pagado: true,
        fechaPago: "2024-10-31"
      },
      {
        nombre: "Farmacia del Pueblo",
        tipo: "Farmacia",
        contacto: "Q.F. Carlos Ruiz",
        telefono: "987654323",
        referidos: 18,
        servicios: [
          { nombre: "Medicamentos", cantidad: 18, comision: 900.00 }
        ],
        totalComision: 900.00,
        porcentaje: 7.0,
        tendencia: "stable",
        ranking: 3,
        pagado: false,
        fechaPago: null
      },
      {
        nombre: "Centro Médico Norte",
        tipo: "Centro Médico",
        contacto: "Dra. Ana Torres",
        telefono: "987654324",
        referidos: 15,
        servicios: [
          { nombre: "Consulta Ginecológica", cantidad: 10, comision: 750.00 },
          { nombre: "Consulta Pediátrica", cantidad: 5, comision: 375.00 }
        ],
        totalComision: 1125.00,
        porcentaje: 8.8,
        tendencia: "down",
        ranking: 4,
        pagado: false,
        fechaPago: null
      },
      {
        nombre: "Dr. Miguel Herrera",
        tipo: "Médico Independiente",
        contacto: "Dr. Miguel Herrera",
        telefono: "987654325",
        referidos: 7,
        servicios: [
          { nombre: "Consulta Obstétrica", cantidad: 7, comision: 560.00 }
        ],
        totalComision: 560.00,
        porcentaje: 4.4,
        tendencia: "up",
        ranking: 5,
        pagado: false,
        fechaPago: null
      }
    ],
    resumen: {
      totalPagado: 3360.00,
      totalPendiente: 9490.00,
      colaboradoresPagados: 2,
      colaboradoresPendientes: 3,
      promedioPorReferido: 151.18
    },
    tiposColaborador: [
      { tipo: "Clínica", cantidad: 1, comision: 2000.00 },
      { tipo: "Laboratorio", cantidad: 1, comision: 1360.00 },
      { tipo: "Farmacia", cantidad: 1, comision: 900.00 },
      { tipo: "Centro Médico", cantidad: 1, comision: 1125.00 },
      { tipo: "Médico Independiente", cantidad: 1, comision: 560.00 }
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
                <Banknote className="h-5 w-5 text-primary" />
                Comisiones de Colaboradores
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
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Total Referidos</p>
              <p className="text-2xl font-bold text-primary">
                {comisionesData.totalReferidos}
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
                {comisionesData.resumen.colaboradoresPagados} colaborador(es)
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
                {comisionesData.resumen.colaboradoresPendientes} colaborador(es)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detalle por colaborador */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Handshake className="h-5 w-5 text-primary" />
            Detalle de Comisiones por Colaborador
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {comisionesData.colaboradores.map((colaborador, index) => (
              <div key={index} className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                      {colaborador.ranking}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{colaborador.nombre}</p>
                        {colaborador.tendencia === "up" && <TrendingUp className="h-3 w-3 text-green-600" />}
                        {colaborador.tendencia === "down" && <TrendingDown className="h-3 w-3 text-red-600" />}
                        {colaborador.tendencia === "stable" && <div className="w-3 h-3 bg-gray-400 rounded-full" />}
                      </div>
                      <p className="text-sm text-muted-foreground">{colaborador.tipo}</p>
                      <p className="text-sm text-muted-foreground">
                        {colaborador.contacto} • {colaborador.telefono}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">
                      S/ {colaborador.totalComision.toFixed(2)}
                    </p>
                    <Badge 
                      variant={colaborador.pagado ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {colaborador.pagado ? "Pagado" : "Pendiente"}
                    </Badge>
                    {colaborador.fechaPago && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(colaborador.fechaPago).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Detalle de servicios */}
                <div className="ml-12">
                  <p className="text-sm font-medium mb-2">
                    {colaborador.referidos} referidos • {colaborador.porcentaje}% del total
                  </p>
                  <div className="space-y-1">
                    {colaborador.servicios.map((servicio, sIndex) => (
                      <div key={sIndex} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {servicio.nombre} ({servicio.cantidad})
                        </span>
                        <span className="font-medium text-green-600">
                          S/ {servicio.comision.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Análisis por tipo de colaborador */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Análisis por Tipo de Colaborador
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {comisionesData.tiposColaborador.map((tipo, index) => (
              <div key={index} className="p-4 bg-muted rounded-lg">
                <p className="font-medium mb-2">{tipo.tipo}</p>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {tipo.cantidad} colaborador(es)
                  </p>
                  <p className="text-sm text-muted-foreground">
                    S/ {tipo.comision.toFixed(2)} comisión
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {((tipo.comision / comisionesData.totalComisiones) * 100).toFixed(1)}% del total
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Métricas de colaboración */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Métricas de Colaboración
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
                S/ {(comisionesData.totalComisiones / comisionesData.colaboradores.length).toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">
                Por colaborador
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-blue-600" />
                <p className="font-medium">Promedio por Referido</p>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                S/ {comisionesData.resumen.promedioPorReferido.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">
                Por paciente referido
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-purple-600" />
                <p className="font-medium">% Pagado</p>
              </div>
              <p className="text-2xl font-bold text-purple-600">
                {((comisionesData.resumen.totalPagado / comisionesData.totalComisiones) * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground">
                Del total de comisiones
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
