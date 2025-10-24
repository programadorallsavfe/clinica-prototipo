"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Receipt, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Calendar,
  DollarSign,
  CreditCard,
  Banknote,
  Users
} from "lucide-react";

interface RecaudacionDiariaProps {
  fecha?: string;
}

export default function RecaudacionDiaria({ fecha = new Date().toLocaleDateString() }: RecaudacionDiariaProps) {
  // Mock data para recaudación diaria
  const recaudacionData = {
    fecha: fecha,
    totalRecaudado: 15420.00,
    totalTransacciones: 127,
    promedioPorTransaccion: 121.42,
    servicios: [
      { nombre: "Consulta Obstétrica", cantidad: 45, monto: 3600.00, porcentaje: 23.3 },
      { nombre: "Ecografía Obstétrica", cantidad: 32, monto: 3840.00, porcentaje: 24.9 },
      { nombre: "Consulta Ginecológica", cantidad: 28, monto: 2800.00, porcentaje: 18.2 },
      { nombre: "Consulta Pediátrica", cantidad: 22, monto: 2200.00, porcentaje: 14.3 },
      { nombre: "Medicamentos", cantidad: 15, monto: 2980.00, porcentaje: 19.3 }
    ],
    metodosPago: [
      { metodo: "Efectivo", cantidad: 45, monto: 5400.00, porcentaje: 35.0 },
      { metodo: "Yape", cantidad: 38, monto: 4560.00, porcentaje: 29.6 },
      { metodo: "Plin", cantidad: 25, monto: 3000.00, porcentaje: 19.4 },
      { metodo: "Transferencia", cantidad: 19, monto: 2460.00, porcentaje: 15.9 }
    ],
    profesionales: [
      { nombre: "Dr. Carlos Pérez", especialidad: "Obstetra", citas: 25, monto: 2000.00 },
      { nombre: "Dra. Ana García", especialidad: "Ginecóloga", citas: 20, monto: 1600.00 },
      { nombre: "Dr. Luis Rodríguez", especialidad: "Pediatra", citas: 18, monto: 1440.00 },
      { nombre: "Dra. María López", especialidad: "Obstetra", citas: 15, monto: 1200.00 }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header con fecha y totales */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-primary" />
                Recaudación Diaria
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Reporte del {recaudacionData.fecha}
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
                S/ {recaudacionData.totalRecaudado.toFixed(2)}
              </p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Receipt className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Transacciones</p>
              <p className="text-2xl font-bold text-primary">
                {recaudacionData.totalTransacciones}
              </p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Promedio por Transacción</p>
              <p className="text-2xl font-bold text-blue-600">
                S/ {recaudacionData.promedioPorTransaccion.toFixed(2)}
              </p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Profesionales Activos</p>
              <p className="text-2xl font-bold text-purple-600">
                {recaudacionData.profesionales.length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Servicios más demandados */}
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
                    <p className="font-medium">{servicio.nombre}</p>
                    <p className="text-sm text-muted-foreground">
                      {servicio.cantidad} servicios
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

        {/* Métodos de pago */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Métodos de Pago
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recaudacionData.metodosPago.map((metodo, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    {metodo.metodo === "Efectivo" && <Banknote className="h-4 w-4 text-green-600" />}
                    {metodo.metodo === "Yape" && <div className="w-4 h-4 bg-green-500 rounded-full" />}
                    {metodo.metodo === "Plin" && <div className="w-4 h-4 bg-blue-500 rounded-full" />}
                    {metodo.metodo === "Transferencia" && <CreditCard className="h-4 w-4 text-blue-600" />}
                    <div>
                      <p className="font-medium">{metodo.metodo}</p>
                      <p className="text-sm text-muted-foreground">
                        {metodo.cantidad} transacciones
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">
                      S/ {metodo.monto.toFixed(2)}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {metodo.porcentaje}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Productividad por profesional */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Productividad por Profesional
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recaudacionData.profesionales.map((profesional, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">{profesional.nombre}</p>
                  <p className="text-sm text-muted-foreground">{profesional.especialidad}</p>
                  <p className="text-sm text-muted-foreground">
                    {profesional.citas} citas atendidas
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
  );
}
