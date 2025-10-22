'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    Heart, 
    Plus, 
    Eye,
    X,
    Calendar,
    User,
    Clock,
    ChevronDown,
    ChevronDownCircle
} from 'lucide-react';
import { SignoVital, getSignosVitalesByPacienteId } from '@/lib/mockData';
import { SignosVitalesDetalleModal } from '@/components/modals/signos-vitales-detalle-modal';

interface SignosVitalesCardProps {
    pacienteId: number;
    onAddSignos: () => void;
}

export const SignosVitalesCard = ({ pacienteId, onAddSignos }: SignosVitalesCardProps) => {
    const [expandedSigno, setExpandedSigno] = useState<string | null>(null);
    const [selectedSigno, setSelectedSigno] = useState<SignoVital | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const signosVitales = getSignosVitalesByPacienteId(pacienteId);

    const formatFecha = (fecha: string) => {
        return new Date(fecha).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const handleViewDetail = (signo: SignoVital) => {
        setSelectedSigno(signo);
        setIsDetailModalOpen(true);
    };

    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedSigno(null);
    };

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        <CardTitle className="text-sm font-semibold text-foreground">
                            Signos vitales
                        </CardTitle>
                        {signosVitales.length > 0 && (
                            <Badge variant="secondary" className="text-xs">
                                {signosVitales.length}
                            </Badge>
                        )}
                    </div>
                    <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-6 px-2 text-xs"
                        onClick={onAddSignos}
                    >
                      <ChevronDownCircle className="h-3 w-3 mr-1" />


                        Nueva medición
                    </Button>
                </div>
            </CardHeader>
            
            <CardContent className="pt-0">
                {signosVitales.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                        No existen signos vitales
                    </p>
                ) : (
                    <div className="space-y-3">
                        {signosVitales.map((signo) => (
                            <div 
                                key={signo.id}
                                className="p-2 sm:p-3 rounded-lg border border-border/50 bg-muted/30 hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-start gap-2 flex-1 min-w-0">
                                        <span className="text-sm flex-shrink-0">
                                            ❤️
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
                                                <Badge 
                                                    variant="outline" 
                                                    className="text-xs bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
                                                >
                                                    MEDICIÓN
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-foreground font-medium leading-relaxed break-words">
                                                {formatFecha(signo.fechaMedicion)} - {signo.medidoPor}
                                            </p>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                {signo.presionArterialSistolica && signo.presionArterialDiastolica && (
                                                    <span>PA: {signo.presionArterialSistolica}/{signo.presionArterialDiastolica} mmHg</span>
                                                )}
                                                {signo.peso && <span> • Peso: {signo.peso} kg</span>}
                                                {signo.altura && <span> • Altura: {signo.altura} cm</span>}
                                                {signo.temperatura && <span> • Temp: {signo.temperatura}°C</span>}
                                                {signo.frecuenciaCardiaca && <span> • FC: {signo.frecuenciaCardiaca} ppm</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0 flex-shrink-0"
                                            onClick={() => handleViewDetail(signo)}
                                            title="Ver detalle completo"
                                        >
                                            <Eye className="h-3 w-3" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0 flex-shrink-0"
                                            onClick={() => setExpandedSigno(expandedSigno === signo.id ? null : signo.id)}
                                        >
                                            {expandedSigno === signo.id ? (
                                                <X className="h-3 w-3" />
                                            ) : (
                                                <ChevronDownCircle className="h-3 w-3 mr-1" />

                                            )}
                                        </Button>
                                    </div>
                                </div>

                                {expandedSigno === signo.id && (
                                    <div className="mt-3 pt-3 border-t border-border/30 space-y-2">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                                <span className="text-muted-foreground">Fecha:</span>
                                                <span className="font-medium">{formatFecha(signo.fechaMedicion)}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <User className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                                <span className="text-muted-foreground">Medido por:</span>
                                                <span className="font-medium truncate">{signo.medidoPor}</span>
                                            </div>
                                        </div>
                                        {signo.observaciones && (
                                            <div className="mt-2 pt-2 border-t border-border/20">
                                                <div className="flex items-start gap-1">
                                                    <Clock className="h-3 w-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                                                    <span className="text-xs text-muted-foreground">Observaciones:</span>
                                                </div>
                                                <p className="text-xs text-foreground mt-1 leading-relaxed">
                                                    {signo.observaciones}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
            
            {/* Modal de detalle */}
            <SignosVitalesDetalleModal
                isOpen={isDetailModalOpen}
                onClose={handleCloseDetailModal}
                signoVital={selectedSigno}
            />
        </Card>
    );
};