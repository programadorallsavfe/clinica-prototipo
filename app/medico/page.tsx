'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getSession } from '@/lib/auth';
import { Calendar, Clock, User, Stethoscope } from 'lucide-react';

export default function MedicoPage() {
  const [sessionUser, setSessionUser] = useState<{ username: string; rol: string } | null>(null);

  useEffect(() => {
    const session = getSession();
    setSessionUser(session);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Panel Médico</h1>
        <p className="text-gray-600">Atención clínica y registro de evolución</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Citas Hoy</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">+2 desde ayer</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Progreso</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Consultas activas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pacientes</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">Este mes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Especialidad</CardTitle>
              <Stethoscope className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Cardiología</div>
              <p className="text-xs text-muted-foreground">Consultorio 3</p>
            </CardContent>
          </Card>
        </div>

        {/* Agenda del Día */}
        <Card>
          <CardHeader>
            <CardTitle>Agenda de Hoy</CardTitle>
            <CardDescription>Consultas programadas para {new Date().toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { hora: '09:00', paciente: 'María González', motivo: 'Control cardiológico', estado: 'completada' },
                { hora: '10:30', paciente: 'Carlos López', motivo: 'Consulta general', estado: 'en_progreso' },
                { hora: '11:00', paciente: 'Ana Martínez', motivo: 'Seguimiento', estado: 'pendiente' },
                { hora: '14:00', paciente: 'Pedro Rodríguez', motivo: 'Evaluación', estado: 'pendiente' },
              ].map((cita, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm font-medium text-gray-500">{cita.hora}</div>
                    <div>
                      <div className="font-medium">{cita.paciente}</div>
                      <div className="text-sm text-gray-500">{cita.motivo}</div>
                    </div>
                  </div>
                  <Badge variant={cita.estado === 'completada' ? 'default' : cita.estado === 'en_progreso' ? 'secondary' : 'outline'}>
                    {cita.estado.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Acciones Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>     
            <CardDescription>Funciones principales del panel médico</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="h-20 flex flex-col space-y-2">
                <Stethoscope className="h-6 w-6" />
                <span>Ver Agenda</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2">
                <User className="h-6 w-6" />
                <span>Registrar Diagnóstico</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2">
                <Calendar className="h-6 w-6" />
                <span>Ver Historial</span>
              </Button>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
