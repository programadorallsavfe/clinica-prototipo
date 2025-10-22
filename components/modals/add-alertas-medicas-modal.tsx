'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
    AlertTriangle, 
    X, 
    Save,
    User
} from 'lucide-react';
import { toast } from 'sonner';

interface AddAlertasMedicasModalProps {
    isOpen: boolean;
    onClose: () => void;
    pacienteId: number;
    pacienteNombre: string;
}

export const AddAlertasMedicasModal = ({ 
    isOpen, 
    onClose, 
    pacienteId, 
    pacienteNombre 
}: AddAlertasMedicasModalProps) => {
    const [formData, setFormData] = useState({
        descripcion: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});


    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Limpiar error del campo cuando el usuario empiece a escribir
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.descripcion.trim()) {
            newErrors.descripcion = 'La descripción es requerida';
        }

        if (formData.descripcion.trim().length < 10) {
            newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            toast.error('Por favor, corrige los errores en el formulario');
            return;
        }

        // Simular guardado de alerta médica
        console.log('Guardando alerta médica:', {
            pacienteId,
            pacienteNombre,
            ...formData
        });

        toast.success('Alerta médica registrada exitosamente');
        
        // Limpiar formulario
        setFormData({
            descripcion: ''
        });
        
        setErrors({});
        onClose();
    };

    const handleClose = () => {
        setFormData({
            descripcion: ''
        });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <CardHeader className="border-b border-border">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20">
                                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-foreground">
                                    Nueva Alerta Médica
                                </CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Paciente: {pacienteNombre}
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClose}
                            className="h-8 w-8 p-0 hover:bg-muted"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                    {/* Información del Paciente */}
                    <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                        <div className="flex items-center gap-2 mb-2">
                            <User className="h-4 w-4 text-primary" />
                            <Label className="text-sm font-medium">Información del Paciente</Label>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div>
                                <span className="text-muted-foreground">ID:</span>
                                <span className="ml-2 font-medium">{pacienteId}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Nombre:</span>
                                <span className="ml-2 font-medium">{pacienteNombre}</span>
                            </div>
                        </div>
                    </div>

                    {/* Descripción de la Alerta */}
                    <div className="space-y-2">
                        <Label htmlFor="descripcion" className="text-sm font-medium">
                            Descripción de la Alerta <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                            id="descripcion"
                            placeholder="Describe detalladamente la alerta médica..."
                            value={formData.descripcion}
                            onChange={(e) => handleInputChange('descripcion', e.target.value)}
                            className={errors.descripcion ? 'border-destructive' : ''}
                            rows={6}
                        />
                        {errors.descripcion && (
                            <p className="text-sm text-destructive">{errors.descripcion}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Mínimo 10 caracteres. Actual: {formData.descripcion.length}
                        </p>
                    </div>
                </CardContent>

                <div className="border-t border-border p-6">
                    <div className="flex flex-col sm:flex-row gap-3 justify-end">
                        <Button
                            variant="outline"
                            onClick={handleClose}
                            className="w-full sm:w-auto"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            Guardar
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};
