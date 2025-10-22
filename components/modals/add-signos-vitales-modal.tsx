'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
    Heart, 
    X, 
    Save,
    User,
    Calendar,
    Thermometer,
    Activity
} from 'lucide-react';
import { toast } from 'sonner';

interface AddSignosVitalesModalProps {
    isOpen: boolean;
    onClose: () => void;
    pacienteId: number;
    pacienteNombre: string;
    edadPaciente: number;
}

export const AddSignosVitalesModal = ({ 
    isOpen, 
    onClose, 
    pacienteId, 
    pacienteNombre,
    edadPaciente 
}: AddSignosVitalesModalProps) => {
    const [formData, setFormData] = useState({
        presionArterialSistolica: '',
        presionArterialDiastolica: '',
        peso: '',
        frecuenciaCardiaca: '',
        altura: '',
        frecuenciaRespiratoria: '',
        temperatura: '',
        saturacionOxigeno: '',
        evaDolor: '',
        glucemia: '',
        observaciones: ''
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

        // Validaciones básicas para campos requeridos
        if (!formData.presionArterialSistolica.trim()) {
            newErrors.presionArterialSistolica = 'La presión sistólica es requerida';
        }

        if (!formData.presionArterialDiastolica.trim()) {
            newErrors.presionArterialDiastolica = 'La presión diastólica es requerida';
        }

        if (!formData.peso.trim()) {
            newErrors.peso = 'El peso es requerido';
        }

        if (!formData.frecuenciaCardiaca.trim()) {
            newErrors.frecuenciaCardiaca = 'La frecuencia cardíaca es requerida';
        }

        if (!formData.altura.trim()) {
            newErrors.altura = 'La altura es requerida';
        }

        if (!formData.temperatura.trim()) {
            newErrors.temperatura = 'La temperatura es requerida';
        }

        // Validaciones numéricas
        const sistolica = parseFloat(formData.presionArterialSistolica);
        const diastolica = parseFloat(formData.presionArterialDiastolica);
        
        if (formData.presionArterialSistolica && (isNaN(sistolica) || sistolica < 70 || sistolica > 250)) {
            newErrors.presionArterialSistolica = 'La presión sistólica debe estar entre 70-250 mmHg';
        }

        if (formData.presionArterialDiastolica && (isNaN(diastolica) || diastolica < 40 || diastolica > 150)) {
            newErrors.presionArterialDiastolica = 'La presión diastólica debe estar entre 40-150 mmHg';
        }

        if (formData.peso && (isNaN(parseFloat(formData.peso)) || parseFloat(formData.peso) < 1 || parseFloat(formData.peso) > 300)) {
            newErrors.peso = 'El peso debe estar entre 1-300 kg';
        }

        if (formData.frecuenciaCardiaca && (isNaN(parseFloat(formData.frecuenciaCardiaca)) || parseFloat(formData.frecuenciaCardiaca) < 30 || parseFloat(formData.frecuenciaCardiaca) > 200)) {
            newErrors.frecuenciaCardiaca = 'La frecuencia cardíaca debe estar entre 30-200 ppm';
        }

        if (formData.altura && (isNaN(parseFloat(formData.altura)) || parseFloat(formData.altura) < 30 || parseFloat(formData.altura) > 250)) {
            newErrors.altura = 'La altura debe estar entre 30-250 cm';
        }

        if (formData.temperatura && (isNaN(parseFloat(formData.temperatura)) || parseFloat(formData.temperatura) < 30 || parseFloat(formData.temperatura) > 45)) {
            newErrors.temperatura = 'La temperatura debe estar entre 30-45°C';
        }

        if (formData.saturacionOxigeno && (isNaN(parseFloat(formData.saturacionOxigeno)) || parseFloat(formData.saturacionOxigeno) < 70 || parseFloat(formData.saturacionOxigeno) > 100)) {
            newErrors.saturacionOxigeno = 'La saturación debe estar entre 70-100%';
        }

        if (formData.evaDolor && (isNaN(parseFloat(formData.evaDolor)) || parseFloat(formData.evaDolor) < 0 || parseFloat(formData.evaDolor) > 10)) {
            newErrors.evaDolor = 'La E.V.A. debe estar entre 0-10 puntos';
        }

        if (formData.glucemia && (isNaN(parseFloat(formData.glucemia)) || parseFloat(formData.glucemia) < 20 || parseFloat(formData.glucemia) > 600)) {
            newErrors.glucemia = 'La glucemia debe estar entre 20-600 mg/dL';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            toast.error('Por favor, corrige los errores en el formulario');
            return;
        }

        // Simular guardado de signos vitales
        console.log('Guardando signos vitales:', {
            pacienteId,
            pacienteNombre,
            edadPaciente,
            ...formData
        });

        toast.success('Signos vitales registrados exitosamente');
        
        // Limpiar formulario
        setFormData({
            presionArterialSistolica: '',
            presionArterialDiastolica: '',
            peso: '',
            frecuenciaCardiaca: '',
            altura: '',
            frecuenciaRespiratoria: '',
            temperatura: '',
            saturacionOxigeno: '',
            evaDolor: '',
            glucemia: '',
            observaciones: ''
        });
        
        setErrors({});
        onClose();
    };

    const handleClose = () => {
        setFormData({
            presionArterialSistolica: '',
            presionArterialDiastolica: '',
            peso: '',
            frecuenciaCardiaca: '',
            altura: '',
            frecuenciaRespiratoria: '',
            temperatura: '',
            saturacionOxigeno: '',
            evaDolor: '',
            glucemia: '',
            observaciones: ''
        });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <CardHeader className="border-b border-border">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                                <Heart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-foreground">
                                    Nueva Medición de Signos Vitales
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
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                            <div>
                                <span className="text-muted-foreground">ID:</span>
                                <span className="ml-2 font-medium">{pacienteId}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Nombre:</span>
                                <span className="ml-2 font-medium">{pacienteNombre}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Edad:</span>
                                <span className="ml-2 font-medium">{edadPaciente} años</span>
                            </div>
                        </div>
                    </div>

                    {/* Signos Vitales */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Presión Arterial */}
                        <div className="space-y-2">
                            <Label htmlFor="presionArterialSistolica" className="text-sm font-medium">
                                Presión Arterial (mmHg) <span className="text-destructive">*</span>
                            </Label>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <Input
                                        id="presionArterialSistolica"
                                        placeholder="Sistólica"
                                        value={formData.presionArterialSistolica}
                                        onChange={(e) => handleInputChange('presionArterialSistolica', e.target.value)}
                                        className={errors.presionArterialSistolica ? 'border-destructive' : ''}
                                        type="number"
                                        min="70"
                                        max="250"
                                    />
                                    {errors.presionArterialSistolica && (
                                        <p className="text-xs text-destructive mt-1">{errors.presionArterialSistolica}</p>
                                    )}
                                </div>
                                <div>
                                    <Input
                                        id="presionArterialDiastolica"
                                        placeholder="Diastólica"
                                        value={formData.presionArterialDiastolica}
                                        onChange={(e) => handleInputChange('presionArterialDiastolica', e.target.value)}
                                        className={errors.presionArterialDiastolica ? 'border-destructive' : ''}
                                        type="number"
                                        min="40"
                                        max="150"
                                    />
                                    {errors.presionArterialDiastolica && (
                                        <p className="text-xs text-destructive mt-1">{errors.presionArterialDiastolica}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Peso */}
                        <div className="space-y-2">
                            <Label htmlFor="peso" className="text-sm font-medium">
                                Peso (kg) <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="peso"
                                placeholder="Ej: 70.5"
                                value={formData.peso}
                                onChange={(e) => handleInputChange('peso', e.target.value)}
                                className={errors.peso ? 'border-destructive' : ''}
                                type="number"
                                step="0.1"
                                min="1"
                                max="300"
                            />
                            {errors.peso && (
                                <p className="text-xs text-destructive mt-1">{errors.peso}</p>
                            )}
                        </div>

                        {/* Frecuencia Cardíaca */}
                        <div className="space-y-2">
                            <Label htmlFor="frecuenciaCardiaca" className="text-sm font-medium">
                                Frec. Cardíaca (ppm) <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="frecuenciaCardiaca"
                                placeholder="Ej: 72"
                                value={formData.frecuenciaCardiaca}
                                onChange={(e) => handleInputChange('frecuenciaCardiaca', e.target.value)}
                                className={errors.frecuenciaCardiaca ? 'border-destructive' : ''}
                                type="number"
                                min="30"
                                max="200"
                            />
                            {errors.frecuenciaCardiaca && (
                                <p className="text-xs text-destructive mt-1">{errors.frecuenciaCardiaca}</p>
                            )}
                        </div>

                        {/* Altura */}
                        <div className="space-y-2">
                            <Label htmlFor="altura" className="text-sm font-medium">
                                Altura (cm) <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="altura"
                                placeholder="Ej: 175"
                                value={formData.altura}
                                onChange={(e) => handleInputChange('altura', e.target.value)}
                                className={errors.altura ? 'border-destructive' : ''}
                                type="number"
                                min="30"
                                max="250"
                            />
                            {errors.altura && (
                                <p className="text-xs text-destructive mt-1">{errors.altura}</p>
                            )}
                        </div>

                        {/* Frecuencia Respiratoria */}
                        <div className="space-y-2">
                            <Label htmlFor="frecuenciaRespiratoria" className="text-sm font-medium">
                                Frec. Respiratoria (rpm)
                            </Label>
                            <Input
                                id="frecuenciaRespiratoria"
                                placeholder="Ej: 16"
                                value={formData.frecuenciaRespiratoria}
                                onChange={(e) => handleInputChange('frecuenciaRespiratoria', e.target.value)}
                                type="number"
                                min="8"
                                max="40"
                            />
                        </div>

                        {/* Temperatura */}
                        <div className="space-y-2">
                            <Label htmlFor="temperatura" className="text-sm font-medium">
                                Temperatura (°C) <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="temperatura"
                                placeholder="Ej: 36.5"
                                value={formData.temperatura}
                                onChange={(e) => handleInputChange('temperatura', e.target.value)}
                                className={errors.temperatura ? 'border-destructive' : ''}
                                type="number"
                                step="0.1"
                                min="30"
                                max="45"
                            />
                            {errors.temperatura && (
                                <p className="text-xs text-destructive mt-1">{errors.temperatura}</p>
                            )}
                        </div>

                        {/* Saturación de Oxígeno */}
                        <div className="space-y-2">
                            <Label htmlFor="saturacionOxigeno" className="text-sm font-medium">
                                SpO₂ (%)
                            </Label>
                            <Input
                                id="saturacionOxigeno"
                                placeholder="Ej: 98"
                                value={formData.saturacionOxigeno}
                                onChange={(e) => handleInputChange('saturacionOxigeno', e.target.value)}
                                className={errors.saturacionOxigeno ? 'border-destructive' : ''}
                                type="number"
                                min="70"
                                max="100"
                            />
                            {errors.saturacionOxigeno && (
                                <p className="text-xs text-destructive mt-1">{errors.saturacionOxigeno}</p>
                            )}
                        </div>

                        {/* E.V.A. Dolor */}
                        <div className="space-y-2">
                            <Label htmlFor="evaDolor" className="text-sm font-medium">
                                E.V.A. Dolor (pts.)
                            </Label>
                            <Input
                                id="evaDolor"
                                placeholder="Ej: 3"
                                value={formData.evaDolor}
                                onChange={(e) => handleInputChange('evaDolor', e.target.value)}
                                className={errors.evaDolor ? 'border-destructive' : ''}
                                type="number"
                                min="0"
                                max="10"
                            />
                            {errors.evaDolor && (
                                <p className="text-xs text-destructive mt-1">{errors.evaDolor}</p>
                            )}
                        </div>

                        {/* Glucemia */}
                        <div className="space-y-2">
                            <Label htmlFor="glucemia" className="text-sm font-medium">
                                Glucemia (mg/dL)
                            </Label>
                            <Input
                                id="glucemia"
                                placeholder="Ej: 95"
                                value={formData.glucemia}
                                onChange={(e) => handleInputChange('glucemia', e.target.value)}
                                className={errors.glucemia ? 'border-destructive' : ''}
                                type="number"
                                min="20"
                                max="600"
                            />
                            {errors.glucemia && (
                                <p className="text-xs text-destructive mt-1">{errors.glucemia}</p>
                            )}
                        </div>
                    </div>

                    {/* Observaciones */}
                    <div className="space-y-2">
                        <Label htmlFor="observaciones" className="text-sm font-medium">
                            Observaciones
                        </Label>
                        <Textarea
                            id="observaciones"
                            placeholder="Observaciones adicionales sobre la medición..."
                            value={formData.observaciones}
                            onChange={(e) => handleInputChange('observaciones', e.target.value)}
                            rows={3}
                        />
                        <p className="text-xs text-muted-foreground">
                            Notas adicionales sobre el estado del paciente o condiciones especiales
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
                            Guardar Signos Vitales
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};
