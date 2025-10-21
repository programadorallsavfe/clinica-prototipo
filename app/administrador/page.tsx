'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getSession } from '@/lib/auth';
import { Users, Settings, FileText, BarChart3, Shield, Database } from 'lucide-react';

export default function AdministradorPage() {
  const [sessionUser, setSessionUser] = useState<{ username: string; rol: string } | null>(null);

  useEffect(() => {
    const session = getSession();
    setSessionUser(session);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <p className="text-gray-600">Configuración y control del sistema</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127</div>
              <p className="text-xs text-muted-foreground">Activos en el sistema</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Citas Hoy</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">Programadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reportes</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">Generados este mes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sistema</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">99.9%</div>
              <p className="text-xs text-muted-foreground">Uptime</p>
            </CardContent>
          </Card>
        </div>

        {/* Gestión de Usuarios */}
        <Card>
          <CardHeader>
            <CardTitle>Gestión de Usuarios</CardTitle>
            <CardDescription>Administra usuarios y roles del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { rol: 'Médicos', cantidad: 12, activos: 11 },
                { rol: 'Recepcionistas', cantidad: 5, activos: 5 },
                { rol: 'Farmacia', cantidad: 3, activos: 3 },
                { rol: 'Pacientes', cantidad: 107, activos: 95 },
              ].map((grupo, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Shield className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="font-medium">{grupo.rol}</div>
                      <div className="text-sm text-gray-500">{grupo.activos} de {grupo.cantidad} activos</div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Gestionar
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Configuración del Sistema */}
        <Card>
          <CardHeader>
            <CardTitle>Configuración del Sistema</CardTitle>
            <CardDescription>Parámetros generales y configuraciones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Settings className="h-4 w-4" />
                    <span className="font-medium">Especialidades</span>
                  </div>
                  <Badge variant="outline">15 configuradas</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">Consultorios</span>
                  </div>
                  <Badge variant="outline">8 activos</Badge>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="h-4 w-4" />
                    <span className="font-medium">Horarios</span>
                  </div>
                  <Badge variant="outline">Configurados</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Database className="h-4 w-4" />
                    <span className="font-medium">Precios</span>
                  </div>
                  <Badge variant="outline">Actualizados</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Acciones Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Funciones principales del panel de administración</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="h-20 flex flex-col space-y-2">
                <Users className="h-6 w-6" />
                <span>Gestionar Usuarios</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2">
                <Settings className="h-6 w-6" />
                <span>Configurar Sistema</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2">
                <BarChart3 className="h-6 w-6" />
                <span>Ver Reportes</span>
              </Button>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
