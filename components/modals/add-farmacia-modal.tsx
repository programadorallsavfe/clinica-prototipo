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
    Package, 
    Save, 
    AlertTriangle,
    Calendar,
    Hash,
    DollarSign,
    Warehouse,
    FileText
} from "lucide-react";

interface Producto {
    id: string;
    nombre: string;
    registroSanitario: string;
    marca: string;
    concentracion: string;
    unidadMedida: string;
    cantidad: number;
    presentacionComercial: string;
    tipoProducto: string;
    codigoInterno: string;
    precioPromedio: number;
    precioVenta: number;
    stockSeguridad: number;
    stock: number;
    lote: string;
    fechaExpiracion: string;
    bodega: string;
    activo: boolean;
    fechaCreacion: string;
    fechaActualizacion: string;
}

interface AddFarmaciaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (producto: Omit<Producto, 'id' | 'fechaCreacion' | 'fechaActualizacion'>) => void;
}

export const AddFarmaciaModal: React.FC<AddFarmaciaModalProps> = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        registroSanitario: '',
        marca: '',
        concentracion: '',
        unidadMedida: '',
        cantidad: 0,
        presentacionComercial: '',
        tipoProducto: '',
        codigoInterno: '',
        precioPromedio: 0,
        precioVenta: 0,
        stockSeguridad: 0,
        stock: 0,
        lote: '',
        fechaExpiracion: '',
        bodega: 'Bodega central',
        activo: true
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const tiposProducto = [
        'Insumo',
        'Medicamento',
        'Suplemento',
        'Equipo Médico',
        'Material de Curación',
        'Reactivo',
        'Consumible'
    ];

    const unidadesMedida = [
        'ml (Mililitros)',
        'mg (Miligramos)',
        'g (Gramos)',
        'kg (Kilogramos)',
        'L (Litros)',
        'unidad',
        'caja',
        'frasco',
        'ampolla',
        'vial',
        '%'
    ];

    const bodegas = [
        'Bodega central',
        'Bodega auxiliar',
        'Bodega emergencia'
    ];

    const handleInputChange = (field: string, value: string | number | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Limpiar error cuando el usuario empiece a escribir
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
        if (!formData.registroSanitario.trim()) newErrors.registroSanitario = 'El registro sanitario es requerido';
        if (!formData.marca.trim()) newErrors.marca = 'La marca es requerida';
        if (!formData.concentracion.trim()) newErrors.concentracion = 'La concentración es requerida';
        if (!formData.unidadMedida) newErrors.unidadMedida = 'La unidad de medida es requerida';
        if (!formData.presentacionComercial.trim()) newErrors.presentacionComercial = 'La presentación comercial es requerida';
        if (!formData.tipoProducto) newErrors.tipoProducto = 'El tipo de producto es requerido';
        if (!formData.codigoInterno.trim()) newErrors.codigoInterno = 'El código interno es requerido';
        if (formData.cantidad <= 0) newErrors.cantidad = 'La cantidad debe ser mayor a 0';
        if (formData.precioPromedio <= 0) newErrors.precioPromedio = 'El precio promedio debe ser mayor a 0';
        if (formData.precioVenta <= 0) newErrors.precioVenta = 'El precio de venta debe ser mayor a 0';
        if (formData.stockSeguridad < 0) newErrors.stockSeguridad = 'El stock de seguridad no puede ser negativo';
        if (formData.stock < 0) newErrors.stock = 'El stock no puede ser negativo';
        if (!formData.lote.trim()) newErrors.lote = 'El número de lote es requerido';
        if (!formData.fechaExpiracion) newErrors.fechaExpiracion = 'La fecha de expiración es requerida';

        // Validar que la fecha de expiración no sea en el pasado
        if (formData.fechaExpiracion && new Date(formData.fechaExpiracion) <= new Date()) {
            newErrors.fechaExpiracion = 'La fecha de expiración debe ser futura';
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
            registroSanitario: '',
            marca: '',
            concentracion: '',
            unidadMedida: '',
            cantidad: 0,
            presentacionComercial: '',
            tipoProducto: '',
            codigoInterno: '',
            precioPromedio: 0,
            precioVenta: 0,
            stockSeguridad: 0,
            stock: 0,
            lote: '',
            fechaExpiracion: '',
            bodega: 'Bodega central',
            activo: true
        });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-primary/20">
                <CardHeader className="bg-primary/5 border-b border-primary/10">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-primary flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Ingresar Nuevo Producto
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
                                    Nombre del Producto *
                                </Label>
                                <Input
                                    id="nombre"
                                    value={formData.nombre}
                                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                                    placeholder="Ej: PARACETAMOL 500MG TAB"
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
                                <Label htmlFor="registroSanitario" className="text-sm font-medium">
                                    Registro Sanitario *
                                </Label>
                                <Input
                                    id="registroSanitario"
                                    value={formData.registroSanitario}
                                    onChange={(e) => handleInputChange('registroSanitario', e.target.value)}
                                    placeholder="Ej: RS-001-2024"
                                    className={errors.registroSanitario ? 'border-destructive' : 'border-primary/30'}
                                />
                                {errors.registroSanitario && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" />
                                        {errors.registroSanitario}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="marca" className="text-sm font-medium">
                                    Marca *
                                </Label>
                                <Input
                                    id="marca"
                                    value={formData.marca}
                                    onChange={(e) => handleInputChange('marca', e.target.value)}
                                    placeholder="Ej: Bayer, Pfizer, GSK"
                                    className={errors.marca ? 'border-destructive' : 'border-primary/30'}
                                />
                                {errors.marca && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" />
                                        {errors.marca}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tipoProducto" className="text-sm font-medium">
                                    Tipo de Producto *
                                </Label>
                                <Select value={formData.tipoProducto} onValueChange={(value) => handleInputChange('tipoProducto', value)}>
                                    <SelectTrigger className={errors.tipoProducto ? 'border-destructive' : 'border-primary/30'}>
                                        <SelectValue placeholder="Seleccionar tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {tiposProducto.map(tipo => (
                                            <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.tipoProducto && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" />
                                        {errors.tipoProducto}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Concentración y Presentación */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                            <Hash className="h-5 w-5" />
                            Concentración y Presentación
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="concentracion" className="text-sm font-medium">
                                    Concentración *
                                </Label>
                                <Input
                                    id="concentracion"
                                    value={formData.concentracion}
                                    onChange={(e) => handleInputChange('concentracion', e.target.value)}
                                    placeholder="Ej: 500, 2, 1%"
                                    className={errors.concentracion ? 'border-destructive' : 'border-primary/30'}
                                />
                                {errors.concentracion && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" />
                                        {errors.concentracion}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="unidadMedida" className="text-sm font-medium">
                                    Unidad de Medida *
                                </Label>
                                <Select value={formData.unidadMedida} onValueChange={(value) => handleInputChange('unidadMedida', value)}>
                                    <SelectTrigger className={errors.unidadMedida ? 'border-destructive' : 'border-primary/30'}>
                                        <SelectValue placeholder="Seleccionar unidad" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {unidadesMedida.map(unidad => (
                                            <SelectItem key={unidad} value={unidad}>{unidad}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.unidadMedida && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" />
                                        {errors.unidadMedida}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="presentacionComercial" className="text-sm font-medium">
                                    Presentación Comercial *
                                </Label>
                                <Input
                                    id="presentacionComercial"
                                    value={formData.presentacionComercial}
                                    onChange={(e) => handleInputChange('presentacionComercial', e.target.value)}
                                    placeholder="Ej: Caja X20, Frasco 60ml"
                                    className={errors.presentacionComercial ? 'border-destructive' : 'border-primary/30'}
                                />
                                {errors.presentacionComercial && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" />
                                        {errors.presentacionComercial}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stock y Cantidades */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                            <Package className="h-5 w-5" />
                            Stock y Cantidades
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="cantidad" className="text-sm font-medium">
                                    Cantidad por Presentación *
                                </Label>
                                <Input
                                    id="cantidad"
                                    type="number"
                                    min="1"
                                    value={formData.cantidad}
                                    onChange={(e) => handleInputChange('cantidad', parseInt(e.target.value) || 0)}
                                    placeholder="Ej: 20, 100, 1"
                                    className={errors.cantidad ? 'border-destructive' : 'border-primary/30'}
                                />
                                {errors.cantidad && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" />
                                        {errors.cantidad}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="stock" className="text-sm font-medium">
                                    Stock Inicial *
                                </Label>
                                <Input
                                    id="stock"
                                    type="number"
                                    min="0"
                                    value={formData.stock}
                                    onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
                                    placeholder="Ej: 50, 100"
                                    className={errors.stock ? 'border-destructive' : 'border-primary/30'}
                                />
                                {errors.stock && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" />
                                        {errors.stock}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="stockSeguridad" className="text-sm font-medium">
                                    Stock de Seguridad *
                                </Label>
                                <Input
                                    id="stockSeguridad"
                                    type="number"
                                    min="0"
                                    value={formData.stockSeguridad}
                                    onChange={(e) => handleInputChange('stockSeguridad', parseInt(e.target.value) || 0)}
                                    placeholder="Ej: 5, 10"
                                    className={errors.stockSeguridad ? 'border-destructive' : 'border-primary/30'}
                                />
                                {errors.stockSeguridad && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" />
                                        {errors.stockSeguridad}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Precios */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                            <DollarSign className="h-5 w-5" />
                            Precios
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="precioPromedio" className="text-sm font-medium">
                                    Precio Promedio (Costo) *
                                </Label>
                                <Input
                                    id="precioPromedio"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.precioPromedio}
                                    onChange={(e) => handleInputChange('precioPromedio', parseFloat(e.target.value) || 0)}
                                    placeholder="Ej: 0.80, 10.00"
                                    className={errors.precioPromedio ? 'border-destructive' : 'border-primary/30'}
                                />
                                {errors.precioPromedio && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" />
                                        {errors.precioPromedio}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="precioVenta" className="text-sm font-medium">
                                    Precio de Venta *
                                </Label>
                                <Input
                                    id="precioVenta"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.precioVenta}
                                    onChange={(e) => handleInputChange('precioVenta', parseFloat(e.target.value) || 0)}
                                    placeholder="Ej: 2.50, 25.00"
                                    className={errors.precioVenta ? 'border-destructive' : 'border-primary/30'}
                                />
                                {errors.precioVenta && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" />
                                        {errors.precioVenta}
                                    </p>
                                )}
                            </div>
                        </div>

                        {formData.precioPromedio > 0 && formData.precioVenta > 0 && (
                            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-primary">Utilidad:</span>
                                    <Badge variant="outline" className="text-success border-success">
                                        {((formData.precioVenta - formData.precioPromedio) / formData.precioPromedio * 100).toFixed(1)}%
                                    </Badge>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Lote y Almacenamiento */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                            <Warehouse className="h-5 w-5" />
                            Lote y Almacenamiento
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="codigoInterno" className="text-sm font-medium">
                                    Código Interno *
                                </Label>
                                <Input
                                    id="codigoInterno"
                                    value={formData.codigoInterno}
                                    onChange={(e) => handleInputChange('codigoInterno', e.target.value)}
                                    placeholder="Ej: PAR001, MET001"
                                    className={errors.codigoInterno ? 'border-destructive' : 'border-primary/30'}
                                />
                                {errors.codigoInterno && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" />
                                        {errors.codigoInterno}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="lote" className="text-sm font-medium">
                                    Número de Lote *
                                </Label>
                                <Input
                                    id="lote"
                                    value={formData.lote}
                                    onChange={(e) => handleInputChange('lote', e.target.value)}
                                    placeholder="Ej: 12822503, MET2024"
                                    className={errors.lote ? 'border-destructive' : 'border-primary/30'}
                                />
                                {errors.lote && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" />
                                        {errors.lote}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bodega" className="text-sm font-medium">
                                    Bodega
                                </Label>
                                <Select value={formData.bodega} onValueChange={(value) => handleInputChange('bodega', value)}>
                                    <SelectTrigger className="border-primary/30">
                                        <SelectValue placeholder="Seleccionar bodega" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {bodegas.map(bodega => (
                                            <SelectItem key={bodega} value={bodega}>{bodega}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="fechaExpiracion" className="text-sm font-medium">
                                Fecha de Expiración *
                            </Label>
                            <Input
                                id="fechaExpiracion"
                                type="date"
                                value={formData.fechaExpiracion}
                                onChange={(e) => handleInputChange('fechaExpiracion', e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className={errors.fechaExpiracion ? 'border-destructive' : 'border-primary/30'}
                            />
                            {errors.fechaExpiracion && (
                                <p className="text-sm text-destructive flex items-center gap-1">
                                    <AlertTriangle className="h-3 w-3" />
                                    {errors.fechaExpiracion}
                                </p>
                            )}
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
                            Guardar Producto
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AddFarmaciaModal;