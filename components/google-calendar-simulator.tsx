'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Bell, 
  RefreshCw, 
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Settings,
  Plus,
  
} from 'lucide-react';
import { TareaSeguimiento, GoogleCalendarEvent } from '@/lib/types';

interface GoogleCalendarSimulatorProps {
  tareas: TareaSeguimiento[];
  onSincronizarTarea: (tareaId: string) => void;
  onDesincronizarTarea: (tareaId: string) => void;
}

export function GoogleCalendarSimulator({ 
  tareas, 
  onSincronizarTarea, 
  onDesincronizarTarea 
}: GoogleCalendarSimulatorProps) {
  const [eventosGoogle, setEventosGoogle] = useState<GoogleCalendarEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Simular eventos de Google Calendar
  useEffect(() => {
    const eventosSimulados: GoogleCalendarEvent[] = [
      {
        id: 'gc_1',
        titulo: 'Reunión de equipo médico',
        descripcion: 'Revisión semanal de casos',
        fechaInicio: '2024-01-22T09:00:00',
        fechaFin: '2024-01-22T10:00:00',
        ubicacion: 'Sala de conferencias',
        recordatorio: 15,
        estado: 'confirmado'
      },
      {
        id: 'gc_2',
        titulo: 'Capacitación en nuevos protocolos',
        descripcion: 'Actualización de procedimientos médicos',
        fechaInicio: '2024-01-23T14:00:00',
        fechaFin: '2024-01-23T16:00:00',
        ubicacion: 'Auditorio principal',
        recordatorio: 30,
        estado: 'confirmado'
      }
    ];

    // Agregar eventos de tareas sincronizadas
    const tareasSincronizadas = tareas.filter(t => t.sincronizadoConGoogle);
    tareasSincronizadas.forEach(tarea => {
      eventosSimulados.push({
        id: `tarea_${tarea.id}`,
        titulo: `[TAREA] ${tarea.titulo}`,
        descripcion: tarea.descripcion,
        fechaInicio: `${tarea.fechaProgramada}T${tarea.horaProgramada}:00`,
        fechaFin: `${tarea.fechaProgramada}T${tarea.horaProgramada}:30`,
        recordatorio: 15,
        estado: 'confirmado'
      });
    });

    setEventosGoogle(eventosSimulados);
  }, [tareas]);

  const handleConectarGoogle = async () => {
    setIsLoading(true);
    // Simular conexión con Google Calendar
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsConnected(true);
    setIsLoading(false);
  };

  const handleSincronizarTarea = async (tareaId: string) => {
    setIsLoading(true);
    // Simular sincronización
    await new Promise(resolve => setTimeout(resolve, 1000));
    onSincronizarTarea(tareaId);
    setIsLoading(false);
  };

  const handleDesincronizarTarea = async (tareaId: string) => {
    setIsLoading(true);
    // Simular desincronización
    await new Promise(resolve => setTimeout(resolve, 1000));
    onDesincronizarTarea(tareaId);
    setIsLoading(false);
  };

  const getTareasNoSincronizadas = () => {
    return tareas.filter(t => !t.sincronizadoConGoogle && t.estado === 'pendiente');
  };

  const getTareasSincronizadas = () => {
    return tareas.filter(t => t.sincronizadoConGoogle);
  };

  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (dateTime: string) => {
    return new Date(dateTime).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500 text-white">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-foreground">
                Google Calendar Integration
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Sincronización de tareas con Google Calendar
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={isConnected ? 'border-green-500 text-green-500' : 'border-gray-500 text-gray-500'}
            >
              {isConnected ? 'Conectado' : 'Desconectado'}
            </Badge>
            {!isConnected && (
              <Button 
                size="sm" 
                onClick={handleConectarGoogle}
                disabled={isLoading}
                className="bg-blue-500 hover:bg-blue-600"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <ExternalLink className="h-4 w-4 mr-2" />
                )}
                Conectar
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Estado de Conexión */}
        {!isConnected && (
          <div className="p-4 bg-muted/50 rounded-lg border border-border">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <div>
                <h4 className="font-medium text-foreground">Conexión Requerida</h4>
                <p className="text-sm text-muted-foreground">
                  Conecta tu cuenta de Google Calendar para sincronizar las tareas automáticamente.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Estadísticas de Sincronización */}
        {isConnected && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-green-500">Sincronizadas</span>
              </div>
              <div className="text-2xl font-bold text-foreground mt-1">
                {getTareasSincronizadas().length}
              </div>
            </div>
            
            <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium text-yellow-500">Pendientes</span>
              </div>
              <div className="text-2xl font-bold text-foreground mt-1">
                {getTareasNoSincronizadas().length}
              </div>
            </div>
            
            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-500">Eventos GC</span>
              </div>
              <div className="text-2xl font-bold text-foreground mt-1">
                {eventosGoogle.length}
              </div>
            </div>
          </div>
        )}

        {/* Tareas Pendientes de Sincronización */}
        {isConnected && getTareasNoSincronizadas().length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-foreground flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-yellow-500" />
              Tareas Pendientes de Sincronización
            </h4>
            
            {getTareasNoSincronizadas().map((tarea) => (
              <div 
                key={tarea.id}
                className="p-3 bg-muted/50 rounded-lg border border-border"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-foreground">{tarea.titulo}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(tarea.fechaProgramada).toLocaleDateString()} a las {tarea.horaProgramada}
                    </div>
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleSincronizarTarea(tarea.id)}
                    disabled={isLoading}
                    className="text-xs"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Sincronizar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tareas Sincronizadas */}
        {isConnected && getTareasSincronizadas().length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Tareas Sincronizadas
            </h4>
            
            {getTareasSincronizadas().map((tarea) => (
              <div 
                key={tarea.id}
                className="p-3 bg-green-500/10 rounded-lg border border-green-500/20"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-foreground">{tarea.titulo}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(tarea.fechaProgramada).toLocaleDateString()} a las {tarea.horaProgramada}
                    </div>
                    <div className="text-xs text-green-500">
                      ✓ Sincronizado con Google Calendar
                    </div>
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleDesincronizarTarea(tarea.id)}
                    disabled={isLoading}
                    className="text-xs text-destructive hover:text-destructive"
                  >
                    Desincronizar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Vista Previa de Google Calendar */}
        {isConnected && (
          <div className="space-y-3">
            <h4 className="font-medium text-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              Vista Previa - Google Calendar
            </h4>
            
            <div className="p-4 bg-muted/30 rounded-lg border border-border">
              <div className="space-y-3">
                {eventosGoogle.slice(0, 5).map((evento) => (
                  <div 
                    key={evento.id}
                    className="flex items-center gap-3 p-2 bg-background rounded border border-border"
                  >
                    <div className="p-1 rounded bg-blue-500 text-white">
                      <Calendar className="h-3 w-3" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm text-foreground">
                        {evento.titulo}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(evento.fechaInicio)} • {formatTime(evento.fechaInicio)} - {formatTime(evento.fechaFin)}
                      </div>
                      {evento.ubicacion && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {evento.ubicacion}
                        </div>
                      )}
                    </div>
                    <Badge 
                      variant="outline" 
                      className={evento.estado === 'confirmado' ? 'border-green-500 text-green-500' : 'border-yellow-500 text-yellow-500'}
                    >
                      {evento.estado}
                    </Badge>
                  </div>
                ))}
                
                {eventosGoogle.length > 5 && (
                  <div className="text-center text-sm text-muted-foreground">
                    ... y {eventosGoogle.length - 5} eventos más
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Configuración de Sincronización */}
        {isConnected && (
          <div className="p-4 bg-muted/50 rounded-lg border border-border">
            <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configuración de Sincronización
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium text-foreground">Recordatorios</div>
                <div className="text-muted-foreground">15 minutos antes del evento</div>
              </div>
              <div>
                <div className="font-medium text-foreground">Sincronización</div>
                <div className="text-muted-foreground">Automática cada 5 minutos</div>
              </div>
              <div>
                <div className="font-medium text-foreground">Calendario</div>
                <div className="text-muted-foreground">Clínica Feminis Salud</div>
              </div>
              <div>
                <div className="font-medium text-foreground">Estado</div>
                <div className="text-green-500">Activo</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
