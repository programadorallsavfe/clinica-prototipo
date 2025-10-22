'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Calendar, User, Baby } from 'lucide-react';
import { AtencionMedica } from '@/lib/types';
import { cn } from '@/lib/utils';

interface AtencionCardProps {
  atencion: AtencionMedica;
  pacienteId: string | number;
  onClick?: () => void;
  className?: string;
}

export function AtencionCard({ atencion, pacienteId, onClick, className }: AtencionCardProps) {
  // Determinar color del borde según estado
  const getBorderColor = () => {
    switch (atencion.estado) {
      case 'atendida':
        return 'border-l-primary';
      case 'programada':
        return 'border-l-info';
      case 'en_curso':
        return 'border-l-warning';
      case 'cancelada':
      case 'no_asiste':
        return 'border-l-destructive';
      default:
        return 'border-l-muted';
    }
  };

  // Determinar badge de estado
  const getEstadoBadge = () => {
    switch (atencion.estado) {
      case 'atendida':
        return (
          <Badge className="bg-success text-success-foreground">
            <CheckCircle className="h-3 w-3 mr-1" />
            Atendido
          </Badge>
        );
      case 'programada':
        return (
          <Badge variant="secondary" className="bg-info/10 text-info border-info/20">
            <Calendar className="h-3 w-3 mr-1" />
            Programada
          </Badge>
        );
      case 'en_curso':
        return (
          <Badge className="bg-warning text-warning-foreground">
            <Clock className="h-3 w-3 mr-1" />
            En curso
          </Badge>
        );
      case 'cancelada':
        return (
          <Badge variant="destructive">
            Cancelada
          </Badge>
        );
      case 'no_asiste':
        return (
          <Badge variant="destructive">
            No asiste
          </Badge>
        );
      default:
        return null;
    }
  };

  // Determinar círculo de progreso
  const getProgressCircle = () => {
    const total = atencion.totalAtenciones;
    const actual = atencion.atencionActual;
    const porcentaje = (actual / total) * 100;

    return (
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary font-semibold text-sm shrink-0 transition-all duration-200 hover:scale-105">
        <div className="text-center">
          <div className="leading-none">{actual}/{total}</div>
        </div>
      </div>
    );
  };

  return (
    <Card 
      className={cn(
        'border-l-4 cursor-pointer transition-all duration-200',
        'hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]',
        getBorderColor(),
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Encabezado con número y tipo */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="outline" className="font-mono text-xs">
                #{atencion.numero}
              </Badge>
              <h4 className="font-semibold text-foreground truncate">
                {atencion.tipo}
              </h4>
              {atencion.controlEmbarazo && (
                <Badge className="bg-accent text-accent-foreground border-accent/50">
                  <Baby className="h-3 w-3 mr-1" />
                  Control {atencion.controlEmbarazo.fase} - {atencion.controlEmbarazo.semanas}sem
                </Badge>
              )}
            </div>

            {/* Etiquetas personalizables */}
            {atencion.etiquetas && atencion.etiquetas.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {atencion.etiquetas.map((etiqueta, idx) => (
                  <Badge 
                    key={idx} 
                    variant="secondary" 
                    className="text-xs bg-secondary text-secondary-foreground"
                  >
                    {etiqueta}
                  </Badge>
                ))}
              </div>
            )}

            {/* Grid de información */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <span className="text-muted-foreground">Fecha:</span>
                  <span className="ml-1.5 font-medium text-foreground">
                    {atencion.fecha} | {atencion.hora}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <span className="text-muted-foreground">Profesional:</span>
                  <span className="ml-1.5 font-medium text-foreground truncate block">
                    {atencion.profesional}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Estado:</span>
                {getEstadoBadge()}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Recurso:</span>
                <span className="ml-1.5 font-medium text-foreground truncate block">
                  {atencion.recurso}
                </span>
              </div>
            </div>

            {/* Información de control de embarazo */}
            {atencion.controlEmbarazo && atencion.controlEmbarazo.proximoControl && (
              <div className="mt-3 pt-3 border-t border-border">
                <div className="text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 inline mr-1" />
                  Próximo control: {atencion.controlEmbarazo.proximoControl}
                </div>
              </div>
            )}
          </div>

          {/* Círculo de progreso */}
          {getProgressCircle()}
        </div>
      </CardContent>
    </Card>
  );
}
