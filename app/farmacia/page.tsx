'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getSession } from '@/lib/auth';
import { Pill, Package, ShoppingCart, AlertTriangle } from 'lucide-react';

export default function FarmaciaPage() {
  const [sessionUser, setSessionUser] = useState<{ username: string; rol: string } | null>(null);

  useEffect(() => {
    const session = getSession();
    setSessionUser(session);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Panel de Farmacia</h1>
        <p className="text-gray-600">Dispensación e inventario</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Productos</CardTitle>
              <Pill className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">En inventario</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventas Hoy</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">+5 desde ayer</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recetas</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Pendientes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">8</div>
              <p className="text-xs text-muted-foreground">Requieren reabastecimiento</p>
            </CardContent>
          </Card>
        </div>

        {/* Recetas Pendientes */}
        <Card>
          <CardHeader>
            <CardTitle>Recetas Pendientes</CardTitle>
            <CardDescription>Prescripciones médicas por procesar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { paciente: 'María González', medicamento: 'Losartán 50mg', cantidad: 30, estado: 'pendiente' },
                { paciente: 'Carlos López', medicamento: 'Metformina 500mg', cantidad: 60, estado: 'en_proceso' },
                { paciente: 'Ana Martínez', medicamento: 'Atorvastatina 20mg', cantidad: 28, estado: 'pendiente' },
              ].map((receta, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div>
                      <div className="font-medium">{receta.paciente}</div>
                      <div className="text-sm text-gray-500">{receta.medicamento} - {receta.cantidad} unidades</div>
                    </div>
                  </div>
                  <Badge variant={receta.estado === 'en_proceso' ? 'secondary' : 'outline'}>
                    {receta.estado.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Productos con Stock Bajo */}
        <Card>
          <CardHeader>
            <CardTitle>Stock Bajo</CardTitle>
            <CardDescription>Productos que requieren reabastecimiento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { medicamento: 'Paracetamol 500mg', stock: 5, minimo: 20 },
                { medicamento: 'Ibuprofeno 400mg', stock: 8, minimo: 25 },
                { medicamento: 'Omeprazol 20mg', stock: 12, minimo: 30 },
              ].map((producto, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-red-50">
                  <div className="flex items-center space-x-4">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <div>
                      <div className="font-medium">{producto.medicamento}</div>
                      <div className="text-sm text-gray-500">Stock: {producto.stock} | Mínimo: {producto.minimo}</div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Solicitar
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Acciones Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Funciones principales del panel de farmacia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="h-20 flex flex-col space-y-2">
                <Pill className="h-6 w-6" />
                <span>Registrar Venta</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2">
                <Package className="h-6 w-6" />
                <span>Consultar Recetas</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2">
                <ShoppingCart className="h-6 w-6" />
                <span>Ver Inventario</span>
              </Button>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
