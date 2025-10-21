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
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          Panel de Administración
        </h1>
        <p className="text-muted-foreground text-lg">
          Configuración y control del sistema
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Usuarios</CardTitle>
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-200">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">127</div>
            <p className="text-xs text-muted-foreground mt-1">Activos en el sistema</p>
          </CardContent>
        </Card>
        
        <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Citas Hoy</CardTitle>
            <div className="p-2 rounded-lg bg-info/10 group-hover:bg-info/20 transition-colors duration-200">
              <FileText className="h-4 w-4 text-info" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">45</div>
            <p className="text-xs text-muted-foreground mt-1">Programadas</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Reportes</CardTitle>
            <div className="p-2 rounded-lg bg-warning/10 group-hover:bg-warning/20 transition-colors duration-200">
              <BarChart3 className="h-4 w-4 text-warning" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">23</div>
            <p className="text-xs text-muted-foreground mt-1">Generados este mes</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Clínica</CardTitle>
            <div className="p-2 rounded-lg bg-success/10 group-hover:bg-success/20 transition-colors duration-200">
              <Database className="h-4 w-4 text-success" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">99.9%</div>
            <p className="text-xs text-muted-foreground mt-1">Disponibilidad</p>
          </CardContent>
        </Card>
      </div>

      {/* Gestión de Usuarios */}
      <Card className="shadow-lg border-border/50">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-semibold text-foreground">Gestión de Usuarios</CardTitle>
          <CardDescription className="text-muted-foreground">
            Administra usuarios y roles del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { rol: 'Médicos', cantidad: 12, activos: 11, color: 'primary' },
              { rol: 'Recepcionistas', cantidad: 5, activos: 5, color: 'info' },
              { rol: 'Farmacia', cantidad: 3, activos: 3, color: 'warning' },
              { rol: 'Pacientes', cantidad: 107, activos: 95, color: 'success' },
            ].map((grupo, index) => (
              <div 
                key={index} 
                className="group flex items-center justify-between p-5 border border-border/50 rounded-xl hover:border-primary/30 hover:shadow-md transition-all duration-200 bg-background/50 backdrop-blur-sm"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl bg-${grupo.color}/10 group-hover:bg-${grupo.color}/20 transition-colors duration-200`}>
                    <Shield className={`h-5 w-5 text-${grupo.color}`} />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{grupo.rol}</div>
                    <div className="text-sm text-muted-foreground">
                      {grupo.activos} de {grupo.cantidad} activos
                    </div>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="rounded-lg border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
                >
                  Gestionar
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configuración del Sistema */}
      <Card className="shadow-lg border-border/50">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-semibold text-foreground">Configuración de la Clínica</CardTitle>
          <CardDescription className="text-muted-foreground">
            Parámetros generales y configuraciones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="group flex items-center justify-between p-4 border border-border/50 rounded-xl hover:border-primary/30 hover:shadow-md transition-all duration-200 bg-background/30 backdrop-blur-sm">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-200">
                    <Settings className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-semibold text-foreground">Especialidades</span>
                </div>
                <Badge variant="outline" className="border-primary/20 text-primary">
                  15 configuradas
                </Badge>
              </div>
              <div className="group flex items-center justify-between p-4 border border-border/50 rounded-xl hover:border-primary/30 hover:shadow-md transition-all duration-200 bg-background/30 backdrop-blur-sm">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-lg bg-info/10 group-hover:bg-info/20 transition-colors duration-200">
                    <Users className="h-4 w-4 text-info" />
                  </div>
                  <span className="font-semibold text-foreground">Consultorios</span>
                </div>
                <Badge variant="outline" className="border-info/20 text-info">
                  8 activos
                </Badge>
              </div>
            </div>
            <div className="space-y-4">
              <div className="group flex items-center justify-between p-4 border border-border/50 rounded-xl hover:border-primary/30 hover:shadow-md transition-all duration-200 bg-background/30 backdrop-blur-sm">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-lg bg-warning/10 group-hover:bg-warning/20 transition-colors duration-200">
                    <BarChart3 className="h-4 w-4 text-warning" />
                  </div>
                  <span className="font-semibold text-foreground">Horarios</span>
                </div>
                <Badge variant="outline" className="border-warning/20 text-warning">
                  Configurados
                </Badge>
              </div>
              <div className="group flex items-center justify-between p-4 border border-border/50 rounded-xl hover:border-primary/30 hover:shadow-md transition-all duration-200 bg-background/30 backdrop-blur-sm">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-lg bg-success/10 group-hover:bg-success/20 transition-colors duration-200">
                    <Database className="h-4 w-4 text-success" />
                  </div>
                  <span className="font-semibold text-foreground">Precios</span>
                </div>
                <Badge variant="outline" className="border-success/20 text-success">
                  Actualizados
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Acciones Rápidas */}
      <Card className="shadow-lg border-border/50">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-semibold text-foreground">Acciones Rápidas</CardTitle>
          <CardDescription className="text-muted-foreground">
            Funciones principales del panel de administración
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Button 
              className="h-24 flex flex-col space-y-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] bg-primary hover:bg-primary/90"
            >
              <div className="p-2 rounded-lg bg-primary-foreground/20">
                <Users className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-primary-foreground">Gestionar Usuarios</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex flex-col space-y-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] border-border/50 hover:border-primary/50 hover:bg-primary/5"
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <span className="text-foreground">Configurar Clínica</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex flex-col space-y-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] border-border/50 hover:border-primary/50 hover:bg-primary/5"
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <span className="text-foreground">Ver Reportes</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
