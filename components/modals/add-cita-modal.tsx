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
    Calendar, 
    Save, 
    AlertTriangle,
    Clock,
    User,
    Stethoscope,
    FileText,
    DollarSign,
    Phone,
    Mail,
    MapPin,
    Building2
} from "lucide-react";
import { pacientesData, Paciente } from "@/lib/mockData";

interface Cita {
    id: string;
    pacienteId: number;
    hora: string;
    fecha: string;
    atencion: {
        doctor: string;
        tipo: 'Consulta' | 'Examen';
        especialidad: string;
    };
    estado: 'programada' | 'confirmada_whatsapp' | 'confirmada_telefono' | 'confirmada_email' | 'en_sala_espera' | 'atendiendose' | 'atendida' | 'no_asiste' | 'anulada';
    situacion: 'pagada' | 'no_pagada' | 'parcial';
    fechaLlegada?: string;
    observaciones?: string;
    monto?: number;
    formaPago?: string;
}

interface AddCitaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (cita: Omit<Cita, 'id'>) => void;
}

export const AddCitaModal: React.FC<AddCitaModalProps> = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        pacienteId: 0,
        hora: '',
        fecha: '',
        doctor: '',
        tipo: 'Consulta' as 'Consulta' | 'Examen',
        especialidad: '',
        estado: 'programada' as 'programada' | 'confirmada_whatsapp' | 'confirmada_telefono' | 'confirmada_email' | 'en_sala_espera' | 'atendiendose' | 'atendida' | 'no_asiste' | 'anulada',
        situacion: 'no_pagada' as 'pagada' | 'no_pagada' | 'parcial',
        monto: 0,
        formaPago: '',
        observaciones: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const doctores = [
        'Dr. CASTILLO ROBLES, JOSE',
        'Dr(a). SEGUIMIENTO. TOPICO',
        'Dr(a). MEJIA GASTELO. JACKELINE'
    ];

    const especialidades = [
        'Cardiología',
        'Dermatología',
        'Ginecología',
        'Neurología',
        'Pediatría',
        'Medicina General',
        'Obstetricia',
        'Endocrinología',
        'Psiquiatría',
        'Oftalmología'
    ];

    const tiposAtencion = [
        { value: 'Consulta', label: 'Consulta', description: 'Consulta médica general' },
        { value: 'Examen', label: 'Examen', description: 'Examen o procedimiento médico' }
    ];

    const estadosCita = [
        { value: 'programada', label: 'Programada', description: 'Cita agendada' },
        { value: 'confirmada_whatsapp', label: 'Confirmada por WhatsApp', description: 'Confirmada vía WhatsApp' },
        { value: 'confirmada_telefono', label: 'Confirmada por teléfono', description: 'Confirmada vía telefónica' },
        { value: 'confirmada_email', label: 'Confirmada por email', description: 'Confirmada vía email' },
        { value: 'en_sala_espera', label: 'En sala de espera', description: 'Paciente en sala de espera' },
        { value: 'atendiendose', label: 'Atendiéndose', description: 'En consulta médica' },
        { value: 'atendida', label: 'Atendida', description: 'Consulta completada' },
        { value: 'no_asiste', label: 'No asiste', description: 'Paciente no asistió' },
        { value: 'anulada', label: 'Anulada', description: 'Cita cancelada' }
    ];

    const situacionesPago = [
        { value: 'pagada', label: 'Pagada', description: 'Pago completo realizado' },
        { value: 'no_pagada', label: 'No pagada', description: 'Sin pago realizado' },
        { value: 'parcial', label: 'Pago parcial', description: 'Pago parcial realizado' }
    ];

    const formasPago = [
        'Efectivo',
        'Tarjeta de crédito',
        'Tarjeta de débito',
        'Transferencia bancaria',
        'Yape',
        'Plin',
        'Billetera digital'
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

        if (formData.pacienteId === 0) newErrors.pacienteId = 'Debe seleccionar un paciente';
        if (!formData.hora.trim()) newErrors.hora = 'La hora es requerida';
        if (!formData.fecha.trim()) newErrors.fecha = 'La fecha es requerida';
        if (!formData.doctor.trim()) newErrors.doctor = 'Debe seleccionar un doctor';
        if (!formData.especialidad.trim()) newErrors.especialidad = 'Debe seleccionar una especialidad';
        if (formData.monto < 0) newErrors.monto = 'El monto no puede ser negativo';

        // Validar que la fecha no sea en el pasado
        if (formData.fecha && new Date(formData.fecha) < new Date()) {
            newErrors.fecha = 'La fecha no puede ser en el pasado';
        }

        // Validar formato de hora
        if (formData.hora && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(formData.hora)) {
            newErrors.hora = 'Formato de hora inválido (HH:MM)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validateForm()) {
            const cita: Omit<Cita, 'id'> = {
                pacienteId: formData.pacienteId,
                hora: formData.hora,
                fecha: formData.fecha,
                atencion: {
                    doctor: formData.doctor,
                    tipo: formData.tipo,
                    especialidad: formData.especialidad
                },
                estado: formData.estado,
                situacion: formData.situacion,
                monto: formData.monto || undefined,
                formaPago: formData.formaPago || undefined,
                observaciones: formData.observaciones || undefined
            };
            onSave(cita);
            handleClose();
        }
    };

    const handleClose = () => {
        setFormData({
            pacienteId: 0,
            hora: '',
            fecha: '',
            doctor: '',
            tipo: 'Consulta',
            especialidad: '',
            estado: 'programada',
            situacion: 'no_pagada',
            monto: 0,
            formaPago: '',
            observaciones: ''
        });
        setErrors({});
        onClose();
    };

    // Obtener información del paciente seleccionado
    const pacienteSeleccionado = pacientesData.find(p => p.id === formData.pacienteId);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-primary/20">
                <CardHeader className="bg-primary/5 border-b border-primary/10">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-primary flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Nueva Cita Médica
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
                    {/* Información del Paciente */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                            <User className="h-5 w-5" />
                            Información del Paciente
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="pacienteId" className="text-sm font-medium">
                                Seleccionar Paciente *
                            </Label>
                            <Select value={formData.pacienteId.toString()} onValueChange={(value) => handleInputChange('pacienteId', parseInt(value))}>
                                <SelectTrigger className={errors.pacienteId ? 'border-destructive' : 'border-primary/30'}>
                                    <SelectValue placeholder="Seleccionar paciente" />
                                </SelectTrigger>
                                <SelectContent>
                                    {pacientesData.map(paciente => (
                                        <SelectItem key={paciente.id} value={paciente.id.toString()}>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{paciente.nombre} {paciente.apellidos}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {paciente.documento} • {paciente.telefono}
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.pacienteId && (
                                <p className="text-sm text-destructive flex items-center gap-1">
                                    <AlertTriangle className="h-3 w-3" />
                                    {errors.pacienteId}
                                </p>
                            )}
                        </div>

                        {/* Información del paciente seleccionado */}
                        {pacienteSeleccionado && (
                            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                                <div className="flex items-center gap-2 text-primary font-semibold mb-3">
                                    <User className="h-4 w-4" />
                                    Información del Paciente
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{pacienteSeleccionado.telefono}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{pacienteSeleccionado.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">DNI: {pacienteSeleccionado.documento}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className={pacienteSeleccionado.estadoCuenta === 'activa' ? 'text-success border-success' : 'text-destructive border-destructive'}>
                                            {pacienteSeleccionado.estadoCuenta}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Información de la Cita */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                            <Calendar className="h-5 w-5" />
                            Información de la Cita
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="fecha" className="text-sm font-medium">
                                    Fecha de la Cita *
                                </Label>
                                <Input
                                    id="fecha"
                                    type="date"
                                    value={formData.fecha}
                                    onChange={(e) => handleInputChange('fecha', e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className={errors.fecha ? 'border-destructive' : 'border-primary/30'}
                                />
                                {errors.fecha && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" />
                                        {errors.fecha}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="hora" className="text-sm font-medium">
                                    Hora de la Cita *
                                </Label>
                                <Input
                                    id="hora"
                                    type="time"
                                    value={formData.hora}
                                    onChange={(e) => handleInputChange('hora', e.target.value)}
                                    className={errors.hora ? 'border-destructive' : 'border-primary/30'}
                                />
                                {errors.hora && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" />
                                        {errors.hora}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tipo" className="text-sm font-medium">
                                    Tipo de Atención *
                                </Label>
                                <Select value={formData.tipo} onValueChange={(value) => handleInputChange('tipo', value as 'Consulta' | 'Examen')}>
                                    <SelectTrigger className="border-primary/30">
                                        <SelectValue placeholder="Seleccionar tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {tiposAtencion.map(tipo => (
                                            <SelectItem key={tipo.value} value={tipo.value}>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{tipo.label}</span>
                                                    <span className="text-xs text-muted-foreground">{tipo.description}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Información Médica */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                            <Stethoscope className="h-5 w-5" />
                            Información Médica
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="doctor" className="text-sm font-medium">
                                    Doctor/Profesional *
                                </Label>
                                <Select value={formData.doctor} onValueChange={(value) => handleInputChange('doctor', value)}>
                                    <SelectTrigger className={errors.doctor ? 'border-destructive' : 'border-primary/30'}>
                                        <SelectValue placeholder="Seleccionar doctor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {doctores.map(doctor => (
                                            <SelectItem key={doctor} value={doctor}>
                                                {doctor}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.doctor && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" />
                                        {errors.doctor}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="especialidad" className="text-sm font-medium">
                                    Especialidad *
                                </Label>
                                <Select value={formData.especialidad} onValueChange={(value) => handleInputChange('especialidad', value)}>
                                    <SelectTrigger className={errors.especialidad ? 'border-destructive' : 'border-primary/30'}>
                                        <SelectValue placeholder="Seleccionar especialidad" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {especialidades.map(especialidad => (
                                            <SelectItem key={especialidad} value={especialidad}>
                                                {especialidad}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.especialidad && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" />
                                        {errors.especialidad}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Estado y Situación */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                            <Clock className="h-5 w-5" />
                            Estado y Situación
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="estado" className="text-sm font-medium">
                                    Estado de la Cita
                                </Label>
                                <Select value={formData.estado} onValueChange={(value) => handleInputChange('estado', value as 'programada' | 'confirmada_whatsapp' | 'confirmada_telefono' | 'confirmada_email' | 'en_sala_espera' | 'atendiendose' | 'atendida' | 'no_asiste' | 'anulada')}>
                                    <SelectTrigger className="border-primary/30">
                                        <SelectValue placeholder="Seleccionar estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {estadosCita.map(estado => (
                                            <SelectItem key={estado.value} value={estado.value}>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{estado.label}</span>
                                                    <span className="text-xs text-muted-foreground">{estado.description}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="situacion" className="text-sm font-medium">
                                    Situación de Pago
                                </Label>
                                <Select value={formData.situacion} onValueChange={(value) => handleInputChange('situacion', value as 'pagada' | 'no_pagada' | 'parcial')}>
                                    <SelectTrigger className="border-primary/30">
                                        <SelectValue placeholder="Seleccionar situación" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {situacionesPago.map(situacion => (
                                            <SelectItem key={situacion.value} value={situacion.value}>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{situacion.label}</span>
                                                    <span className="text-xs text-muted-foreground">{situacion.description}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Información Financiera */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                            <DollarSign className="h-5 w-5" />
                            Información Financiera
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="monto" className="text-sm font-medium">
                                    Monto (S/)
                                </Label>
                                <Input
                                    id="monto"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.monto}
                                    onChange={(e) => handleInputChange('monto', parseFloat(e.target.value) || 0)}
                                    placeholder="Ej: 150.00"
                                    className={errors.monto ? 'border-destructive' : 'border-primary/30'}
                                />
                                {errors.monto && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" />
                                        {errors.monto}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="formaPago" className="text-sm font-medium">
                                    Forma de Pago
                                </Label>
                                <Select value={formData.formaPago} onValueChange={(value) => handleInputChange('formaPago', value)}>
                                    <SelectTrigger className="border-primary/30">
                                        <SelectValue placeholder="Seleccionar forma de pago" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {formasPago.map(forma => (
                                            <SelectItem key={forma} value={forma}>
                                                {forma}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Observaciones */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                            <FileText className="h-5 w-5" />
                            Observaciones
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="observaciones" className="text-sm font-medium">
                                Observaciones Adicionales
                            </Label>
                            <Textarea
                                id="observaciones"
                                value={formData.observaciones}
                                onChange={(e) => handleInputChange('observaciones', e.target.value)}
                                placeholder="Observaciones, notas especiales, instrucciones..."
                                className="border-primary/30"
                                rows={3}
                            />
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
                            Guardar Cita
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AddCitaModal;