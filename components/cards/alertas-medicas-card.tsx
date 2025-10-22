'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    AlertTriangle, 
    Plus, 
    Eye,
    X,
    Calendar,
    User,
    Clock
} from 'lucide-react';
import { AlertaMedica, getAlertasByPacienteId } from '@/lib/mockData';

interface AlertasMedicasCardProps {
    pacienteId: number;
    onAddAlerta: () => void;
}

export const AlertasMedicasCard = ({ pacienteId, onAddAlerta }: AlertasMedicasCardProps) => {
    const [expandedAlert, setExpandedAlert] = useState<string | null>(null);
    const alertas = getAlertasByPacienteId(pacienteId);


    const getPrioridadColor = (prioridad: string) => {
        switch (prioridad) {
            case 'alta':
                return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
            case 'media':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800';
            case 'baja':
                return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800';
        }
    };

    const getTipoIcon = (tipo: string) => {
        switch (tipo) {
            case 'alergia':
                return '⚠️';
            case 'medicamento':
                return '💊';
            case 'condicion':
                return '🏥';
            case 'restriccion':
                return '🚫';
            default:
                return 'ℹ️';
        }
    };

    const formatFecha = (fecha: string) => {
        return new Date(fecha).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const isVencida = (fechaVencimiento?: string) => {
        if (!fechaVencimiento) return false;
        return new Date(fechaVencimiento) < new Date();
    };

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
                        <CardTitle className="text-sm font-semibold text-foreground">
                            Alertas médicas
                        </CardTitle>
                        {alertas.length > 0 && (
                            <Badge variant="secondary" className="text-xs">
                                {alertas.length}
                            </Badge>
                        )}
                    </div>
                    <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-6 px-2 text-xs"
                        onClick={onAddAlerta}
                    >
                        <Plus className="h-3 w-3 mr-1" />
                        Añadir
                    </Button>
                </div>
            </CardHeader>
            
            <CardContent className="pt-0">
                {alertas.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                        No existen alertas médicas
                    </p>
                ) : (
                    <div className="space-y-3">
                        {alertas.map((alerta) => (
                            <div 
                                key={alerta.id}
                                className="p-2 sm:p-3 rounded-lg border border-border/50 bg-muted/30 hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-start gap-2 flex-1 min-w-0">
                                        <span className="text-sm flex-shrink-0">
                                            {getTipoIcon(alerta.tipo)}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
                                                <Badge 
                                                    variant="outline" 
                                                    className={`text-xs ${getPrioridadColor(alerta.prioridad)}`}
                                                >
                                                    {alerta.prioridad.toUpperCase()}
                                                </Badge>
                                                {isVencida(alerta.fechaVencimiento) && (
                                                    <Badge variant="destructive" className="text-xs">
                                                        VENCIDA
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-xs text-foreground font-medium leading-relaxed break-words">
                                                {alerta.descripcion}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 flex-shrink-0"
                                        onClick={() => setExpandedAlert(expandedAlert === alerta.id ? null : alerta.id)}
                                    >
                                        {expandedAlert === alerta.id ? (
                                            <X className="h-3 w-3" />
                                        ) : (
                                            <Eye className="h-3 w-3" />
                                        )}
                                    </Button>
                                </div>

                                {expandedAlert === alerta.id && (
                                    <div className="mt-3 pt-3 border-t border-border/30 space-y-2">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                                <span className="text-muted-foreground">Creada:</span>
                                                <span className="font-medium">{formatFecha(alerta.fechaCreacion)}</span>
                                            </div>
                                            {alerta.fechaVencimiento && (
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                                    <span className="text-muted-foreground">Vence:</span>
                                                    <span className={`font-medium ${isVencida(alerta.fechaVencimiento) ? 'text-destructive' : ''}`}>
                                                        {formatFecha(alerta.fechaVencimiento)}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1 sm:col-span-2">
                                                <User className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                                <span className="text-muted-foreground">Por:</span>
                                                <span className="font-medium truncate">{alerta.creadoPor}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
