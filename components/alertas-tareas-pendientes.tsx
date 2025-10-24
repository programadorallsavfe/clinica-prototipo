'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Clock, 
  Bell, 
  X, 
  Eye, 
  Calendar,
  Phone,
  Mail,
  Video,
  FileText,
  Stethoscope,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { TareaSeguimiento } from '@/lib/types';

interface AlertasTareasPendientesProps {
  tareas: TareaSeguimiento[];
  onVerTarea: (tareaId: string) => void;
  onMarcarComoVista: (tareaId: string) => void;
}

const iconosTipo = {
  llamada_telefonica: Phone,
  envio_correo: Mail,
  envio_enlace_video: Video,
  envio_pdf: FileText,
  recordatorio_cita: Bell,
  seguimiento_tratamiento: Stethoscope
};

const coloresTipo = {
  llamada_telefonica: 'bg-blue-500',
  envio_correo: 'bg-green-500',
  envio_enlace_video: 'bg-purple-500',
  envio_pdf: 'bg-orange-500',
  recordatorio_cita: 'bg-yellow-500',
  seguimiento_tratamiento: 'bg-red-500'
};

export function AlertasTareasPendientes({ 
  tareas, 
  onVerTarea, 
  onMarcarComoVista 
}: AlertasTareasPendientesProps) {
  const [alertasVistas, setAlertasVistas] = useState<Set<string>>(new Set());
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Filtrar tareas que requieren alerta
  const tareasConAlerta = tareas.filter(tarea => {
    if (tarea.estado !== 'pendiente' || !tarea.alertaActiva) return false;
    
    const fechaTarea = new Date(tarea.fechaProgramada);
    const ahora = new Date();
    const diferenciaHoras = (fechaTarea.getTime() - ahora.getTime()) / (1000 * 60 * 60);
    
    // Mostrar alerta si:
    // - La tarea ya venció (diferencia < 0)
    // - La tarea es urgente y está próxima (diferencia < 2 horas)
    // - La tarea es de alta prioridad y está próxima (diferencia < 24 horas)
    // - La tarea es de media prioridad y está próxima (diferencia < 48 horas)
    
    if (diferenciaHoras < 0) return true; // Vencida
    
    switch (tarea.prioridad) {
      case 'urgente':
        return diferenciaHoras < 2;
      case 'alta':
        return diferenciaHoras < 24;
      case 'media':
        return diferenciaHoras < 48;
      case 'baja':
        return diferenciaHoras < 72;
      default:
        return false;
    }
  });

  const tareasVencidas = tareasConAlerta.filter(tarea => 
    new Date(tarea.fechaProgramada) < new Date()
  );

  const tareasProximas = tareasConAlerta.filter(tarea => 
    new Date(tarea.fechaProgramada) >= new Date()
  );

  const getTipoTexto = (tipo: string) => {
    switch (tipo) {
      case 'llamada_telefonica': return 'Llamada Telefónica';
      case 'envio_correo': return 'Envío de Correo';
      case 'envio_enlace_video': return 'Envío de Enlace de Video';
      case 'envio_pdf': return 'Envío de PDF';
      case 'recordatorio_cita': return 'Recordatorio de Cita';
      case 'seguimiento_tratamiento': return 'Seguimiento de Tratamiento';
      default: return tipo;
    }
  };

  const getPrioridadTexto = (prioridad: string) => {
    switch (prioridad) {
      case 'baja': return 'Baja';
      case 'media': return 'Media';
      case 'alta': return 'Alta';
      case 'urgente': return 'Urgente';
      default: return prioridad;
    }
  };

  const getColorPrioridad = (prioridad: string) => {
    switch (prioridad) {
      case 'baja': return 'bg-gray-500';
      case 'media': return 'bg-yellow-500';
      case 'alta': return 'bg-orange-500';
      case 'urgente': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleMarcarComoVista = (tareaId: string) => {
    setAlertasVistas(prev => new Set([...prev, tareaId]));
    onMarcarComoVista(tareaId);
  };

  const handleVerTarea = (tareaId: string) => {
    onVerTarea(tareaId);
    handleMarcarComoVista(tareaId);
  };

  if (tareasConAlerta.length === 0) {
    return null;
  }

  return (
    <Card className={`transition-all duration-300 ${
      tareasVencidas.length > 0 
        ? 'border-destructive bg-destructive/5' 
        : 'border-warning bg-warning/5'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              tareasVencidas.length > 0 ? 'bg-destructive' : 'bg-warning'
            } text-white`}>
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">
                Alertas de Tareas Pendientes
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {tareasVencidas.length > 0 
                  ? `${tareasVencidas.length} tarea(s) vencida(s) y ${tareasProximas.length} próxima(s)`
                  : `${tareasProximas.length} tarea(s) próxima(s) a vencer`
                }
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={`${
                tareasVencidas.length > 0 
                  ? 'border-destructive text-destructive' 
                  : 'border-warning text-warning'
              }`}
            >
              {tareasConAlerta.length} alertas
            </Badge>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? 'Expandir' : 'Colapsar'}
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isCollapsed && (
        <CardContent className="space-y-4">
          {/* Tareas Vencidas */}
          {tareasVencidas.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-destructive"></div>
                <h4 className="font-medium text-destructive">Tareas Vencidas</h4>
              </div>
              
              {tareasVencidas.map((tarea) => {
                const IconComponent = iconosTipo[tarea.tipo];
                const colorTipo = coloresTipo[tarea.tipo];
                const isVista = alertasVistas.has(tarea.id);
                
                return (
                  <div 
                    key={tarea.id}
                    className={`p-3 rounded-lg border border-destructive/20 bg-destructive/5 transition-all duration-200 ${
                      isVista ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${colorTipo} text-white`}>
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">{tarea.titulo}</div>
                          <div className="text-sm text-muted-foreground">
                            {getTipoTexto(tarea.tipo)} • {tarea.responsable}
                          </div>
                          <div className="text-sm text-destructive">
                            Vencida el {new Date(tarea.fechaProgramada).toLocaleDateString()} a las {tarea.horaProgramada}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={`border-current ${getColorPrioridad(tarea.prioridad).replace('bg-', 'text-')}`}
                        >
                          {getPrioridadTexto(tarea.prioridad)}
                        </Badge>
                        
                        <div className="flex items-center gap-1">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleVerTarea(tarea.id)}
                            className="text-xs"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Ver
                          </Button>
                          {!isVista && (
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => handleMarcarComoVista(tarea.id)}
                              className="text-xs"
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tareas Próximas */}
          {tareasProximas.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-warning"></div>
                <h4 className="font-medium text-warning">Tareas Próximas</h4>
              </div>
              
              {tareasProximas.map((tarea) => {
                const IconComponent = iconosTipo[tarea.tipo];
                const colorTipo = coloresTipo[tarea.tipo];
                const isVista = alertasVistas.has(tarea.id);
                const fechaTarea = new Date(tarea.fechaProgramada);
                const ahora = new Date();
                const diferenciaHoras = Math.ceil((fechaTarea.getTime() - ahora.getTime()) / (1000 * 60 * 60));
                
                return (
                  <div 
                    key={tarea.id}
                    className={`p-3 rounded-lg border border-warning/20 bg-warning/5 transition-all duration-200 ${
                      isVista ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${colorTipo} text-white`}>
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">{tarea.titulo}</div>
                          <div className="text-sm text-muted-foreground">
                            {getTipoTexto(tarea.tipo)} • {tarea.responsable}
                          </div>
                          <div className="text-sm text-warning">
                            {diferenciaHoras < 24 
                              ? `En ${diferenciaHoras} horas (${new Date(tarea.fechaProgramada).toLocaleDateString()} a las ${tarea.horaProgramada})`
                              : `En ${Math.ceil(diferenciaHoras / 24)} días (${new Date(tarea.fechaProgramada).toLocaleDateString()} a las ${tarea.horaProgramada})`
                            }
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={`border-current ${getColorPrioridad(tarea.prioridad).replace('bg-', 'text-')}`}
                        >
                          {getPrioridadTexto(tarea.prioridad)}
                        </Badge>
                        
                        <div className="flex items-center gap-1">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleVerTarea(tarea.id)}
                            className="text-xs"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Ver
                          </Button>
                          {!isVista && (
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => handleMarcarComoVista(tarea.id)}
                              className="text-xs"
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Acciones Globales */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="text-sm text-muted-foreground">
              {alertasVistas.size} de {tareasConAlerta.length} alertas marcadas como vistas
            </div>
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => {
                  tareasConAlerta.forEach(tarea => handleMarcarComoVista(tarea.id));
                }}
                className="text-xs"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Marcar todas como vistas
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Ver todas las tareas
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
