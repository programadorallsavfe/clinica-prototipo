'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  Mail, 
  Video, 
  FileText, 
  Bell, 
  Stethoscope,
  Calendar,
  Clock,
  User,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  MoreVertical,
  ExternalLink,
  RefreshCw
  
} from 'lucide-react';
import { TareaSeguimiento } from '@/lib/types';

interface TareasSeguimientoCardProps {
  tarea: TareaSeguimiento;
  onUpdateEstado: (tareaId: string, nuevoEstado: TareaSeguimiento['estado']) => void;
  onSincronizarGoogle: (tareaId: string) => void;
  onVerDetalles: (tareaId: string) => void;
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

const coloresPrioridad = {
  baja: 'bg-gray-500',
  media: 'bg-yellow-500',
  alta: 'bg-orange-500',
  urgente: 'bg-red-500'
};

const coloresEstado = {
  pendiente: 'bg-yellow-500',
  en_progreso: 'bg-blue-500',
  completada: 'bg-green-500',
  cancelada: 'bg-gray-500'
};

export function TareasSeguimientoCard({ 
  tarea, 
  onUpdateEstado, 
  onSincronizarGoogle, 
  onVerDetalles 
}: TareasSeguimientoCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const IconComponent = iconosTipo[tarea.tipo];
  const colorTipo = coloresTipo[tarea.tipo];
  const colorPrioridad = coloresPrioridad[tarea.prioridad];
  const colorEstado = coloresEstado[tarea.estado];

  const getEstadoTexto = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'Pendiente';
      case 'en_progreso': return 'En Progreso';
      case 'completada': return 'Completada';
      case 'cancelada': return 'Cancelada';
      default: return estado;
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

  const isVencida = new Date(tarea.fechaProgramada) < new Date() && tarea.estado === 'pendiente';
  const isProxima = new Date(tarea.fechaProgramada) <= new Date(Date.now() + 24 * 60 * 60 * 1000) && tarea.estado === 'pendiente';

  const handleEstadoChange = (nuevoEstado: TareaSeguimiento['estado']) => {
    onUpdateEstado(tarea.id, nuevoEstado);
  };

  const handleSincronizarGoogle = () => {
    onSincronizarGoogle(tarea.id);
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-lg ${
      isVencida ? 'border-destructive bg-destructive/5' : 
      isProxima ? 'border-warning bg-warning/5' : 
      'border-border hover:border-primary/50'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${colorTipo} text-white`}>
              <IconComponent className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-base font-semibold text-foreground">
                {tarea.titulo}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {getTipoTexto(tarea.tipo)}
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Estado */}
            <Badge 
              className={`text-white ${colorEstado}`}
              variant="default"
            >
              {getEstadoTexto(tarea.estado)}
            </Badge>
            
            {/* Prioridad */}
            <Badge 
              variant="outline" 
              className={`border-current ${colorPrioridad.replace('bg-', 'text-')}`}
            >
              {getPrioridadTexto(tarea.prioridad)}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Información Principal */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{new Date(tarea.fechaProgramada).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{tarea.horaProgramada}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{tarea.responsable}</span>
          </div>
          {tarea.servicioRelacionado && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Stethoscope className="h-4 w-4" />
              <span>{tarea.servicioRelacionado}</span>
            </div>
          )}
        </div>

        {/* Alertas */}
        {(isVencida || isProxima) && (
          <div className={`p-3 rounded-lg border ${
            isVencida ? 'bg-destructive/10 border-destructive/20' : 'bg-warning/10 border-warning/20'
          }`}>
            <div className="flex items-center gap-2">
              <AlertTriangle className={`h-4 w-4 ${
                isVencida ? 'text-destructive' : 'text-warning'
              }`} />
              <span className={`text-sm font-medium ${
                isVencida ? 'text-destructive' : 'text-warning'
              }`}>
                {isVencida ? 'Tarea vencida' : 'Tarea próxima a vencer'}
              </span>
            </div>
          </div>
        )}

        {/* Integración Google Calendar */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className={`p-1 rounded ${tarea.sincronizadoConGoogle ? 'bg-green-500' : 'bg-gray-400'} text-white`}>
              <RefreshCw className="h-3 w-3" />
            </div>
            <span className="text-sm text-muted-foreground">
              {tarea.sincronizadoConGoogle ? 'Sincronizado con Google Calendar' : 'No sincronizado'}
            </span>
          </div>
          {!tarea.sincronizadoConGoogle && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleSincronizarGoogle}
              className="text-xs"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Sincronizar
            </Button>
          )}
        </div>

        {/* Descripción (Expandible) */}
        {tarea.descripcion && (
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-0 h-auto text-sm text-muted-foreground hover:text-foreground"
            >
              {isExpanded ? 'Ocultar descripción' : 'Ver descripción'}
            </Button>
            {isExpanded && (
              <div className="mt-2 p-3 bg-muted/30 rounded-lg text-sm text-foreground">
                {tarea.descripcion}
              </div>
            )}
          </div>
        )}

        {/* Observaciones */}
        {tarea.observaciones && (
          <div className="p-3 bg-accent/30 rounded-lg">
            <div className="text-sm font-medium text-foreground mb-1">Observaciones:</div>
            <div className="text-sm text-muted-foreground">{tarea.observaciones}</div>
          </div>
        )}

        {/* Acciones */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            {tarea.estado === 'pendiente' && (
              <>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleEstadoChange('en_progreso')}
                  className="text-xs"
                >
                  <Play className="h-3 w-3 mr-1" />
                  Iniciar
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleEstadoChange('completada')}
                  className="text-xs"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Completar
                </Button>
              </>
            )}
            
            {tarea.estado === 'en_progreso' && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleEstadoChange('completada')}
                className="text-xs"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Completar
              </Button>
            )}
            
            {tarea.estado !== 'cancelada' && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleEstadoChange('cancelada')}
                className="text-xs text-destructive hover:text-destructive"
              >
                <XCircle className="h-3 w-3 mr-1" />
                Cancelar
              </Button>
            )}
          </div>
          
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => onVerDetalles(tarea.id)}
            className="text-xs"
          >
            <MoreVertical className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
