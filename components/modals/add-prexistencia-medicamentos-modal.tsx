'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
    Plus, 
    X,
    Pill,
    Stethoscope,
    Save,
    Trash2
} from 'lucide-react';
import { toast } from 'sonner';

interface AddPrexistenciaMedicamentosModalProps {
    isOpen: boolean;
    onClose: () => void;
    pacienteId: number;
    pacienteNombre: string;
}

export const AddPrexistenciaMedicamentosModal = ({ 
    isOpen, 
    onClose, 
    pacienteId, 
    pacienteNombre 
}: AddPrexistenciaMedicamentosModalProps) => {
    const [formData, setFormData] = useState({
        diagnostico: '',
        medicacion: ''
    });
    
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleInputChange = (field: string, value: string) => {
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

        if (!formData.diagnostico.trim()) {
            newErrors.diagnostico = 'El diagnóstico es requerido';
        } else if (formData.diagnostico.trim().length < 3) {
            newErrors.diagnostico = 'El diagnóstico debe tener al menos 3 caracteres';
        }

        if (!formData.medicacion.trim()) {
            newErrors.medicacion = 'La medicación es requerida';
        } else if (formData.medicacion.trim().length < 3) {
            newErrors.medicacion = 'La medicación debe tener al menos 3 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            // Aquí iría la lógica para guardar en el backend
            console.log('Guardando preexistencia:', {
                pacienteId,
                diagnostico: formData.diagnostico.trim(),
                medicacion: formData.medicacion.trim()
            });

            toast.success('Preexistencia y medicación agregada exitosamente');
            handleClose();
        } catch (error) {
            console.error('Error al guardar preexistencia:', error);
            toast.error('Error al guardar la información');
        }
    };

    const handleClose = () => {
        setFormData({
            diagnostico: '',
            medicacion: ''
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
                            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                                <Stethoscope className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-foreground">
                                    Agregar Preexistencia y Medicación
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
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Campo Diagnóstico */}
                        <div className="space-y-2">
                            <Label htmlFor="diagnostico" className="text-sm font-medium flex items-center gap-2">
                                <Stethoscope className="h-4 w-4 text-primary" />
                                Diagnóstico <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="diagnostico"
                                type="text"
                                placeholder="Ingrese el diagnóstico médico"
                                value={formData.diagnostico}
                                onChange={(e) => handleInputChange('diagnostico', e.target.value)}
                                className={errors.diagnostico ? 'border-destructive' : ''}
                            />
                            {errors.diagnostico && (
                                <p className="text-sm text-destructive">{errors.diagnostico}</p>
                            )}
                        </div>

                        {/* Campo Medicación */}
                        <div className="space-y-2">
                            <Label htmlFor="medicacion" className="text-sm font-medium flex items-center gap-2">
                                <Pill className="h-4 w-4 text-primary" />
                                Medicación <span className="text-destructive">*</span>
                            </Label>
                            <Textarea
                                id="medicacion"
                                placeholder="Ingrese la medicación prescrita, dosis y frecuencia"
                                value={formData.medicacion}
                                onChange={(e) => handleInputChange('medicacion', e.target.value)}
                                className={errors.medicacion ? 'border-destructive' : ''}
                                rows={4}
                            />
                            {errors.medicacion && (
                                <p className="text-sm text-destructive">{errors.medicacion}</p>
                            )}
                        </div>

                    </form>
                </CardContent>

                <div className="border-t border-border p-6">
                    <div className="flex flex-col sm:flex-row gap-3 justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            className="w-full sm:w-auto"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
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
