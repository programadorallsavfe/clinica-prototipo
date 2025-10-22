'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    X,
    Calendar,
    User,
    Clock,
    Heart,
    Thermometer,
    Activity,
    Droplets,
    Gauge,
    Zap,
    Target,
    Weight,
    Ruler
} from 'lucide-react';
import { SignoVital } from '@/lib/mockData';

interface SignosVitalesDetalleModalProps {
    isOpen: boolean;
    onClose: () => void;
    signoVital: SignoVital | null;
}

export const SignosVitalesDetalleModal = ({ 
    isOpen, 
    onClose, 
    signoVital 
}: SignosVitalesDetalleModalProps) => {
    if (!isOpen || !signoVital) return null;

    const formatFecha = (fecha: string) => {
        return new Date(fecha).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getValorStatus = (valor: number, normalMin: number, normalMax: number, criticoMin?: number, criticoMax?: number) => {
        if (criticoMin !== undefined && criticoMax !== undefined) {
            if (valor < criticoMin || valor > criticoMax) {
                return { status: 'critical', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/20', border: 'border-red-200 dark:border-red-800' };
            }
        }
        if (valor < normalMin || valor > normalMax) {
            return { status: 'warning', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-950/20', border: 'border-yellow-200 dark:border-yellow-800' };
        }
        return { status: 'normal', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-950/20', border: 'border-green-200 dark:border-green-800' };
    };

    const getIconForMetric = (metric: string) => {
        switch (metric) {
            case 'presion':
                return <Gauge className="h-4 w-4" />;
            case 'diastolica':
                return <Gauge className="h-4 w-4" />;
            case 'peso':
                return <Weight className="h-4 w-4" />;
            case 'altura':
                return <Ruler className="h-4 w-4" />;
            case 'frecuenciaCardiaca':
                return <Heart className="h-4 w-4" />;
            case 'frecuenciaRespiratoria':
                return <Activity className="h-4 w-4" />;
            case 'temperatura':
                return <Thermometer className="h-4 w-4" />;
            case 'saturacionOxigeno':
                return <Droplets className="h-4 w-4" />;
            case 'evaDolor':
                return <Target className="h-4 w-4" />;
            case 'glucemia':
                return <Zap className="h-4 w-4" />;
            default:
                return <Activity className="h-4 w-4" />;
        }
    };

    const renderMetricCard = (metric: string, label: string, valor: number | undefined, unidad: string, normalMin: number, normalMax: number, criticoMin?: number, criticoMax?: number) => {
        if (valor === undefined) return null;
        
        const status = getValorStatus(valor, normalMin, normalMax, criticoMin, criticoMax);
        const icon = getIconForMetric(metric);
        
        return (
            <Card className={`${status.bg} ${status.border} border`}>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className={`p-2 rounded-lg ${status.bg} ${status.border} border`}>
                                {icon}
                            </div>
                            <span className="text-sm font-medium text-foreground">{label}</span>
                        </div>
                    </div>
                    <div className="text-center">
                        <div className={`text-2xl font-bold ${status.color} mb-1`}>
                            {valor}
                        </div>
                        <div className={`text-sm font-medium ${status.color}`}>
                            {unidad}
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    const calculateIMC = (peso?: number, altura?: number) => {
        if (!peso || !altura) return null;
        const alturaEnMetros = altura / 100;
        return (peso / (alturaEnMetros * alturaEnMetros)).toFixed(1);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-card border border-border rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header del modal */}
                <div className="p-6 border-b border-border/30 bg-gradient-to-r from-primary/5 to-primary/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/20">
                                <Heart className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-bold text-foreground">
                                    Detalle de Signos Vitales
                                </CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Medición del {formatFecha(signoVital.fechaMedicion)}
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="h-9 w-9 p-0 hover:bg-destructive/10 hover:text-destructive"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Contenido del modal */}
                <div className="p-6">
                    <div className="space-y-6">
                        {/* Header de la medición */}
                        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
                            <div className="flex items-center gap-4">
                                <Badge className="px-3 py-1 bg-primary/20 text-primary border border-primary/30">
                                    MEDICIÓN DETALLADA
                                </Badge>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span className="font-semibold text-foreground">{formatFecha(signoVital.fechaMedicion)}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <User className="h-4 w-4" />
                                <span className="font-medium text-foreground">{signoVital.medidoPor}</span>
                            </div>
                        </div>

                        {/* Grid de métricas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {renderMetricCard('presion', 'Presión Sistólica', signoVital.presionArterialSistolica, 'mmHg', 90, 140, 70, 180)}
                            {renderMetricCard('diastolica', 'Presión Diastólica', signoVital.presionArterialDiastolica, 'mmHg', 60, 90, 40, 110)}
                            {renderMetricCard('peso', 'Peso', signoVital.peso, 'kg', 50, 100, 30, 150)}
                            {renderMetricCard('altura', 'Altura', signoVital.altura, 'cm', 150, 190, 120, 220)}
                            {renderMetricCard('frecuenciaCardiaca', 'Frecuencia Cardíaca', signoVital.frecuenciaCardiaca, 'ppm', 60, 100, 40, 120)}
                            {renderMetricCard('frecuenciaRespiratoria', 'Frecuencia Respiratoria', signoVital.frecuenciaRespiratoria, 'rpm', 12, 20, 8, 25)}
                            {renderMetricCard('temperatura', 'Temperatura', signoVital.temperatura, '°C', 36.0, 37.5, 35.0, 39.0)}
                            {renderMetricCard('saturacionOxigeno', 'Saturación de Oxígeno', signoVital.saturacionOxigeno, '%', 95, 100, 90, 100)}
                            {renderMetricCard('evaDolor', 'Escala Visual Análoga', signoVital.evaDolor, 'pts', 0, 3, 0, 10)}
                            {renderMetricCard('glucemia', 'Glucemia', signoVital.glucemia, 'mg/dL', 70, 100, 50, 140)}
                        </div>

                        {/* IMC */}
                        {calculateIMC(signoVital.peso, signoVital.altura) && (
                            <div className="flex justify-center">
                                <Card className="bg-muted/20 border border-border/30 max-w-xs">
                                    <CardContent className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-2 mb-3">
                                            <div className="p-2 rounded-lg bg-muted/50 border border-border/30">
                                                <Target className="h-4 w-4" />
                                            </div>
                                            <span className="text-sm font-medium text-foreground">Índice de Masa Corporal</span>
                                        </div>
                                        <div className="text-3xl font-bold text-foreground mb-1">
                                            {calculateIMC(signoVital.peso, signoVital.altura)}
                                        </div>
                                        <div className="text-sm font-medium text-muted-foreground">
                                            kg/m²
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* Observaciones */}
                        {signoVital.observaciones && (
                            <Card className="bg-gradient-to-r from-muted/50 to-muted/30 border border-border/30">
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                                            <Clock className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="text-sm font-semibold text-foreground mb-2">Observaciones Clínicas</h4>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                {signoVital.observaciones}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
