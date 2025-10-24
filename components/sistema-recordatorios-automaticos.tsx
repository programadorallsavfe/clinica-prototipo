'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Bell, 
  Clock, 
  Calendar, 
  MessageSquare, 
  Mail, 
  Settings, 
  Play, 
  Pause, 
  RefreshCw,
  CheckCircle,
  AlertCircle,
  XCircle,
  Timer,
  Users,
  Activity
} from 'lucide-react';

interface RecordatorioAutomatico {
  id: string;
  nombre: string;
  tipo: 'whatsapp' | 'email' | 'sms';
  tiempoAntes: number; // horas antes de la cita
  activo: boolean;
  template: string;
  ultimoEnvio?: string;
  proximoEnvio?: string;
  totalEnviados: number;
  exitosos: number;
  fallidos: number;
}

interface CitaProgramada {
  id: string;
  paciente: string;
  doctor: string;
  especialidad: string;
  fecha: string;
  hora: string;
  email: string;
  telefono: string;
  recordatoriosEnviados: string[];
}

export function SistemaRecordatoriosAutomaticos() {
  const [recordatorios, setRecordatorios] = useState<RecordatorioAutomatico[]>([
    {
      id: '1',
      nombre: 'Recordatorio 24h',
      tipo: 'whatsapp',
      tiempoAntes: 24,
      activo: true,
      template: 'recordatorio_24h',
      ultimoEnvio: '2024-01-20T10:00:00',
      proximoEnvio: '2024-01-21T10:00:00',
      totalEnviados: 45,
      exitosos: 42,
      fallidos: 3
    },
    {
      id: '2',
      nombre: 'Recordatorio 2h',
      tipo: 'whatsapp',
      tiempoAntes: 2,
      activo: true,
      template: 'recordatorio_2h',
      ultimoEnvio: '2024-01-20T14:00:00',
      proximoEnvio: '2024-01-21T14:00:00',
      totalEnviados: 38,
      exitosos: 35,
      fallidos: 3
    },
    {
      id: '3',
      nombre: 'Confirmación Email',
      tipo: 'email',
      tiempoAntes: 48,
      activo: true,
      template: 'confirmacion_email',
      ultimoEnvio: '2024-01-19T09:00:00',
      proximoEnvio: '2024-01-21T09:00:00',
      totalEnviados: 52,
      exitosos: 50,
      fallidos: 2
    },
    {
      id: '4',
      nombre: 'Recordatorio SMS',
      tipo: 'sms',
      tiempoAntes: 1,
      activo: false,
      template: 'recordatorio_sms',
      ultimoEnvio: '2024-01-18T16:00:00',
      totalEnviados: 12,
      exitosos: 10,
      fallidos: 2
    }
  ]);

  const [citasProgramadas, setCitasProgramadas] = useState<CitaProgramada[]>([
    {
      id: '1',
      paciente: 'María González',
      doctor: 'Dr. Carlos Ruiz',
      especialidad: 'Ginecología',
      fecha: '2024-01-22',
      hora: '10:00',
      email: 'maria@email.com',
      telefono: '+51 999 123 456',
      recordatoriosEnviados: ['1', '3']
    },
    {
      id: '2',
      paciente: 'Ana López',
      doctor: 'Dra. Laura Sánchez',
      especialidad: 'Dermatología',
      fecha: '2024-01-22',
      hora: '14:30',
      email: 'ana@email.com',
      telefono: '+51 999 789 012',
      recordatoriosEnviados: ['1']
    },
    {
      id: '3',
      paciente: 'Pedro Martínez',
      doctor: 'Dr. Juan Pérez',
      especialidad: 'Cardiología',
      fecha: '2024-01-23',
      hora: '09:00',
      email: 'pedro@email.com',
      telefono: '+51 999 345 678',
      recordatoriosEnviados: []
    }
  ]);

  const [isSistemaActivo, setIsSistemaActivo] = useState(true);
  const [proximoProcesamiento, setProximoProcesamiento] = useState('2024-01-21T15:30:00');
  const [estadisticas, setEstadisticas] = useState({
    totalRecordatorios: 147,
    exitosos: 137,
    fallidos: 10,
    tasaExito: 93.2
  });

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'whatsapp': return <MessageSquare className="h-4 w-4 text-green-600" />;
      case 'email': return <Mail className="h-4 w-4 text-blue-600" />;
      case 'sms': return <MessageSquare className="h-4 w-4 text-purple-600" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'whatsapp': return 'bg-green-500';
      case 'email': return 'bg-blue-500';
      case 'sms': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getTipoTexto = (tipo: string) => {
    switch (tipo) {
      case 'whatsapp': return 'WhatsApp';
      case 'email': return 'Email';
      case 'sms': return 'SMS';
      default: return tipo;
    }
  };

  const handleToggleRecordatorio = (id: string) => {
    setRecordatorios(prev => prev.map(r => 
      r.id === id ? { ...r, activo: !r.activo } : r
    ));
  };

  const handleProcesarRecordatorios = async () => {
    // Simular procesamiento de recordatorios
    alert('🔄 Procesando recordatorios automáticos...');
    
    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Actualizar estadísticas
    setEstadisticas(prev => ({
      ...prev,
      totalRecordatorios: prev.totalRecordatorios + 3,
      exitosos: prev.exitosos + 3,
      tasaExito: ((prev.exitosos + 3) / (prev.totalRecordatorios + 3)) * 100
    }));
    
    alert('✅ Recordatorios procesados exitosamente');
  };

  const citasConRecordatoriosPendientes = citasProgramadas.filter(cita => {
    const fechaCita = new Date(`${cita.fecha}T${cita.hora}`);
    const ahora = new Date();
    const horasRestantes = (fechaCita.getTime() - ahora.getTime()) / (1000 * 60 * 60);
    
    return horasRestantes > 0 && horasRestantes <= 48; // Próximas 48 horas
  });

  return (
    <div className="space-y-6">
      {/* Header del Sistema */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Sistema de Recordatorios Automáticos
              </CardTitle>
              <CardDescription>
                Gestión automática de confirmaciones y recordatorios de citas
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={isSistemaActivo ? "default" : "secondary"}>
                {isSistemaActivo ? (
                  <>
                    <Activity className="h-3 w-3 mr-1" />
                    Activo
                  </>
                ) : (
                  <>
                    <Pause className="h-3 w-3 mr-1" />
                    Pausado
                  </>
                )}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSistemaActivo(!isSistemaActivo)}
              >
                {isSistemaActivo ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isSistemaActivo ? 'Pausar' : 'Activar'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Bell className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Total Enviados
              </span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{estadisticas.totalRecordatorios}</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-800 dark:text-green-200">
                Exitosos
              </span>
            </div>
            <p className="text-2xl font-bold text-green-600">{estadisticas.exitosos}</p>
          </CardContent>
        </Card>

        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium text-red-800 dark:text-red-200">
                Fallidos
              </span>
            </div>
            <p className="text-2xl font-bold text-red-600">{estadisticas.fallidos}</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Activity className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
                Tasa de Éxito
              </span>
            </div>
            <p className="text-2xl font-bold text-purple-600">{estadisticas.tasaExito.toFixed(1)}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Configuración de Recordatorios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Configuración de Recordatorios
          </CardTitle>
          <CardDescription>
            Gestiona los diferentes tipos de recordatorios automáticos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recordatorios.map((recordatorio) => (
              <Card key={recordatorio.id} className="border-l-4 border-l-primary">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getTipoIcon(recordatorio.tipo)}
                        <div>
                          <h4 className="font-medium text-foreground">{recordatorio.nombre}</h4>
                          <p className="text-sm text-muted-foreground">
                            {recordatorio.tiempoAntes}h antes • {getTipoTexto(recordatorio.tipo)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-center">
                          <p className="font-medium text-foreground">{recordatorio.totalEnviados}</p>
                          <p className="text-muted-foreground">Total</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-green-600">{recordatorio.exitosos}</p>
                          <p className="text-muted-foreground">Exitosos</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-red-600">{recordatorio.fallidos}</p>
                          <p className="text-muted-foreground">Fallidos</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge variant={recordatorio.activo ? "default" : "secondary"}>
                        {recordatorio.activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                      <Switch
                        checked={recordatorio.activo}
                        onCheckedChange={() => handleToggleRecordatorio(recordatorio.id)}
                      />
                    </div>
                  </div>
                  
                  {recordatorio.proximoEnvio && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Próximo envío: {new Date(recordatorio.proximoEnvio).toLocaleString('es-ES')}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Citas con Recordatorios Pendientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Citas con Recordatorios Pendientes
          </CardTitle>
          <CardDescription>
            Citas próximas que requieren envío de recordatorios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {citasConRecordatoriosPendientes.map((cita) => {
              const fechaCita = new Date(`${cita.fecha}T${cita.hora}`);
              const ahora = new Date();
              const horasRestantes = (fechaCita.getTime() - ahora.getTime()) / (1000 * 60 * 60);
              
              return (
                <Card key={cita.id} className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <h4 className="font-medium text-foreground">{cita.paciente}</h4>
                          <p className="text-sm text-muted-foreground">
                            {cita.doctor} • {cita.especialidad}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(cita.fecha).toLocaleDateString('es-ES')} a las {cita.hora}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                          <Timer className="h-3 w-3 mr-1" />
                          {Math.round(horasRestantes)}h restantes
                        </Badge>
                        <div className="flex gap-1">
                          {recordatorios.map((recordatorio) => (
                            <div
                              key={recordatorio.id}
                              className={`w-3 h-3 rounded-full ${
                                cita.recordatoriosEnviados.includes(recordatorio.id)
                                  ? getTipoColor(recordatorio.tipo)
                                  : 'bg-gray-300'
                              }`}
                              title={`${recordatorio.nombre} - ${
                                cita.recordatoriosEnviados.includes(recordatorio.id) ? 'Enviado' : 'Pendiente'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Control del Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-primary" />
            Control del Sistema
          </CardTitle>
          <CardDescription>
            Gestiona el procesamiento automático de recordatorios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">Procesamiento Automático</h4>
              <p className="text-sm text-muted-foreground">
                Próximo procesamiento: {new Date(proximoProcesamiento).toLocaleString('es-ES')}
              </p>
            </div>
            <Button onClick={handleProcesarRecordatorios}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Procesar Ahora
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Información del Sistema */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
            Información del Sistema
          </h4>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• El sistema procesa recordatorios cada 30 minutos</li>
            <li>• Se envían automáticamente según la configuración de tiempo</li>
            <li>• Los recordatorios fallidos se reintentan hasta 3 veces</li>
            <li>• Se mantiene un registro completo de todos los envíos</li>
            <li>• En producción se integraría con APIs reales de WhatsApp, Email y SMS</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
