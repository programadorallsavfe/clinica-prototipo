'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    X, 
    Building2, 
    Save, 
    AlertTriangle,
    DollarSign,
    Users,
    Calculator,
    TrendingUp,
    Phone,
    Mail,
    User,
    FileText
} from "lucide-react";

interface Laboratorio {
    id: string;
    nombre: string;
    detalle: string;
    tipo: 'propio' | 'externo' | 'convenio';
    estado: 'habilitado' | 'deshabilitado';
    pacientesAtendidos: number;
    costoPorPaciente: number;
    porcentajePagoLaboratorio: number;
    montoPorPagar: number;
    gananciaClinica: number;
    fechaCreacion: string;
    contacto?: string;
    telefono?: string;
    email?: string;
}

interface AddLaboratorioMedicoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (laboratorio: Omit<Laboratorio, 'id' | 'fechaCreacion' | 'montoPorPagar' | 'gananciaClinica'>) => void;
}

export const AddLaboratorioMedicoModal: React.FC<AddLaboratorioMedicoModalProps> = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        detalle: '',
        tipo: 'propio' as 'propio' | 'externo' | 'convenio',
        estado: 'habilitado' as 'habilitado' | 'deshabilitado',
        pacientesAtendidos: 0,
        costoPorPaciente: 0,
        porcentajePagoLaboratorio: 0,
        contacto: '',
        telefono: '',
        email: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const tiposLaboratorio = [
        { value: 'propio', label: 'Propio', description: 'Laboratorio interno de la clínica' },
        { value: 'convenio', label: 'Convenio', description: 'Laboratorio con convenio establecido' },
        { value: 'externo', label: 'Externo', description: 'Laboratorio externo sin convenio' }
    ];

    const estadosLaboratorio = [
        { value: 'habilitado', label: 'Habilitado', description: 'Activo y disponible' },
        { value: 'deshabilitado', label: 'Deshabilitado', description: 'Inactivo temporalmente' }
    ];

    const handleInputChange = (field: string, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Limpiar error cuando el usuario empiece a escribir
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.nombre.trim()) newErrors.nombre = 'El nombre del laboratorio es requerido';
        if (!formData.detalle.trim()) newErrors.detalle = 'El detalle es requerido';
        if (!formData.tipo) newErrors.tipo = 'El tipo de laboratorio es requerido';
        if (!formData.estado) newErrors.estado = 'El estado es requerido';
        if (formData.pacientesAtendidos < 0) newErrors.pacientesAtendidos = 'El número de pacientes no puede ser negativo';
        if (formData.costoPorPaciente <= 0) newErrors.costoPorPaciente = 'El costo por paciente debe ser mayor a 0';
        if (formData.porcentajePagoLaboratorio < 0 || formData.porcentajePagoLaboratorio > 100) {
            newErrors.porcentajePagoLaboratorio = 'El porcentaje debe estar entre 0 y 100';
        }

        // Validaciones opcionales pero con formato
        if (formData.telefono && !/^[\+]?[0-9\s\-\(\)]{7,15}$/.test(formData.telefono)) {
            newErrors.telefono = 'Formato de teléfono inválido';
        }
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Formato de email inválido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validateForm()) {
            onSave(formData);
            handleClose();
        }
    };

    const handleClose = () => {
        setFormData({
            nombre: '',
            detalle: '',
            tipo: 'propio',
            estado: 'habilitado',
            pacientesAtendidos: 0,
            costoPorPaciente: 0,
            porcentajePagoLaboratorio: 0,
            contacto: '',
            telefono: '',
            email: ''
        });
        setErrors({});
        onClose();
    };

    // Calcular ganancia de la clínica
    const gananciaClinica = formData.pacientesAtendidos * formData.costoPorPaciente * ((100 - formData.porcentajePagoLaboratorio) / 100);
    const montoPorPagar = formData.pacientesAtendidos * formData.costoPorPaciente * (formData.porcentajePagoLaboratorio / 100);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-primary/20">
                <CardHeader className="bg-primary/5 border-b border-primary/10">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-primary flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            Nuevo Laboratorio Médico
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClose}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                    {/* Información Básica */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                            <FileText className="h-5 w-5" />
                            Información Básica
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="nombre" className="text-sm font-medium">
                                    Nombre del Laboratorio *
                                </Label>
                                <Input
                                    id="nombre"
                                    value={formData.nombre}
                                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                                    placeholder="Ej: FEMINIS SALUD, PATOLOGIA GENERAL"
                                    className={errors.nombre ? 'border-destructive' : 'border-primary/30'}
                                />
                                {errors.nombre && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" />
                                        {errors.nombre}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tipo" className="text-sm font-medium">
                                    Tipo de Laboratorio *
                                </Label>
                                <Select value={formData.tipo} onValueChange={(value) => handleInputChange('tipo', value as 'propio' | 'externo' | 'convenio')}>
                                    <SelectTrigger className={errors.tipo ? 'border-destructive' : 'border-primary/30'}>
                                        <SelectValue placeholder="Seleccionar tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {tiposLaboratorio.map(tipo => (
                                            <SelectItem key={tipo.value} value={tipo.value}>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{tipo.label}</span>
                                                    <span className="text-xs text-muted-foreground">{tipo.description}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.tipo && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" />
                                        {errors.tipo}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="detalle" className="text-sm font-medium">
                                Detalle/Descripción *
                            </Label>
                            <Textarea
                                id="detalle"
                                value={formData.detalle}
                                onChange={(e) => handleInputChange('detalle', e.target.value)}
                                placeholder="Ej: LABORATORIO PROPIO CONVENIO CON TECNOLOGO, Dra. Luisa Escudero Yong Long"
                                className={errors.detalle ? 'border-destructive' : 'border-primary/30'}
                                rows={3}
                            />
                            {errors.detalle && (
                                <p className="text-sm text-destructive flex items-center gap-1">
                                    <AlertTriangle className="h-3 w-3" />
                                    {errors.detalle}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="estado" className="text-sm font-medium">
                                Estado *
                            </Label>
                            <Select value={formData.estado} onValueChange={(value) => handleInputChange('estado', value as 'habilitado' | 'deshabilitado')}>
                                <SelectTrigger className={errors.estado ? 'border-destructive' : 'border-primary/30'}>
                                    <SelectValue placeholder="Seleccionar estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    {estadosLaboratorio.map(estado => (
                                        <SelectItem key={estado.value} value={estado.value}>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{estado.label}</span>
                                                <span className="text-xs text-muted-foreground">{estado.description}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.estado && (
                                <p className="text-sm text-destructive flex items-center gap-1">
                                    <AlertTriangle className="h-3 w-3" />
                                    {errors.estado}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Información de Contacto */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                            <User className="h-5 w-5" />
                            Información de Contacto
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="contacto" className="text-sm font-medium">
                                    Persona de Contacto
                                </Label>
                                <Input
                                    id="contacto"
                                    value={formData.contacto}
                                    onChange={(e) => handleInputChange('contacto', e.target.value)}
                                    placeholder="Ej: Dr. María González"
                                    className="border-primary/30"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="telefono" className="text-sm font-medium">
                                    Teléfono
                                </Label>
                                <Input
                                    id="telefono"
                                    value={formData.telefono}
                                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                                    placeholder="Ej: +51 987 654 321"
                                    className={errors.telefono ? 'border-destructive' : 'border-primary/30'}
                                />
                                {errors.telefono && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" />
                                        {errors.telefono}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    placeholder="Ej: lab@feminis.com"
                                    className={errors.email ? 'border-destructive' : 'border-primary/30'}
                                />
                                {errors.email && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" />
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Información Financiera */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                            <DollarSign className="h-5 w-5" />
                            Información Financiera
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="pacientesAtendidos" className="text-sm font-medium">
                                    Pacientes Atendidos
                                </Label>
                                <Input
                                    id="pacientesAtendidos"
                                    type="number"
                                    min="0"
                                    value={formData.pacientesAtendidos}
                                    onChange={(e) => handleInputChange('pacientesAtendidos', parseInt(e.target.value) || 0)}
                                    placeholder="Ej: 1250"
                                    className={errors.pacientesAtendidos ? 'border-destructive' : 'border-primary/30'}
                                />
                                {errors.pacientesAtendidos && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" />
                                        {errors.pacientesAtendidos}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="costoPorPaciente" className="text-sm font-medium">
                                    Costo por Paciente (S/) *
                                </Label>
                                <Input
                                    id="costoPorPaciente"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.costoPorPaciente}
                                    onChange={(e) => handleInputChange('costoPorPaciente', parseFloat(e.target.value) || 0)}
                                    placeholder="Ej: 100.00"
                                    className={errors.costoPorPaciente ? 'border-destructive' : 'border-primary/30'}
                                />
                                {errors.costoPorPaciente && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" />
                                        {errors.costoPorPaciente}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="porcentajePagoLaboratorio" className="text-sm font-medium">
                                    % Pago al Laboratorio
                                </Label>
                                <Input
                                    id="porcentajePagoLaboratorio"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={formData.porcentajePagoLaboratorio}
                                    onChange={(e) => handleInputChange('porcentajePagoLaboratorio', parseFloat(e.target.value) || 0)}
                                    placeholder="Ej: 20"
                                    className={errors.porcentajePagoLaboratorio ? 'border-destructive' : 'border-primary/30'}
                                />
                                {errors.porcentajePagoLaboratorio && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" />
                                        {errors.porcentajePagoLaboratorio}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Cálculos automáticos */}
                        {(formData.pacientesAtendidos > 0 && formData.costoPorPaciente > 0) && (
                            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                                <div className="flex items-center gap-2 text-primary font-semibold mb-3">
                                    <Calculator className="h-4 w-4" />
                                    Cálculos Automáticos
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Monto por Pagar al Laboratorio:</span>
                                        <Badge variant="outline" className="text-warning border-warning">
                                            S/ {montoPorPagar.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Ganancia de la Clínica:</span>
                                        <Badge variant="outline" className="text-success border-success">
                                            S/ {gananciaClinica.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Información Adicional */}
                    <div className="space-y-4">
                        <div className="bg-info/10 border border-info/20 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-info mb-2">
                                <AlertTriangle className="h-4 w-4" />
                                <span className="text-sm font-medium">Información Importante</span>
                            </div>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• El <strong>costo por paciente</strong> es lo que se cobra al paciente por los servicios del laboratorio.</li>
                                <li>• El <strong>porcentaje de pago al laboratorio</strong> determina cuánto se paga al laboratorio por cada servicio.</li>
                                <li>• Los cálculos se actualizan automáticamente basándose en los datos ingresados.</li>
                                <li>• Los laboratorios <strong>propios</strong> generalmente tienen un porcentaje de pago menor.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                        <Button
                            variant="outline"
                            onClick={handleClose}
                            className="border-primary/30 text-primary hover:bg-primary/10"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSave}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            Guardar Laboratorio
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AddLaboratorioMedicoModal;