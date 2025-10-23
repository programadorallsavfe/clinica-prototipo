'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
    Plus, 
    Search, 
    Edit, 
    Trash2, 
    Package, 
    TrendingUp, 
    TrendingDown,
    AlertTriangle,
    DollarSign,
    BarChart3,
    FileText,
    ShoppingCart,
    Warehouse,
    Calendar,
    Filter,
    Download,
    Eye,
    Pencil,
    Save,
    X,
    ChevronUp,
    ChevronDown
} from "lucide-react";
import { AddFarmaciaModal } from "@/components/modals/add-farmacia-modal";

// TypeScript interfaces
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

interface Lote {
    id: string;
    productoId: string;
    numeroLote: string;
    fechaExpiracion: string;
    stock: number;
    precioUnitario: number;
    bodega: string;
}

interface MovimientoStock {
    id: string;
    productoId: string;
    tipo: 'entrada' | 'salida';
    cantidad: number;
    motivo: string;
    fecha: string;
    usuario: string;
    numeroLote?: string;
    fechaExpiracion?: string;
    precioUnitario: number;
    total: number;
}

interface VentaProducto {
    id: string;
    productoId: string;
    cantidad: number;
    precioUnitario: number;
    descuento: number;
    total: number;
    fecha: string;
    pacienteId?: string;
    medicoId?: string;
    recetaId?: string;
}

export default function FarmaciaPage() {
    const [activeTab, setActiveTab] = useState("inventario");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("todos");
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [editingProducto, setEditingProducto] = useState<Partial<Producto>>({});
    const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Mock data - En producción vendría de una API
    const [productos, setProductos] = useState<Producto[]>([
        {
            id: '1',
            nombre: 'B-NEUROFLAX 2ML INY X 10 AMP.',
            registroSanitario: 'RS-001-2024',
            marca: 'Bayer',
            concentracion: '2',
            unidadMedida: 'ml (Mililitros)',
            cantidad: 10,
            presentacionComercial: 'Caja X10',
            tipoProducto: 'Insumo',
            codigoInterno: '1014',
            precioPromedio: 10.00,
            precioVenta: 25.00,
            stockSeguridad: 3,
            stock: 9,
            lote: '12822503',
            fechaExpiracion: '2027-05-31',
            bodega: 'Bodega central',
            activo: true,
            fechaCreacion: '2024-01-15',
            fechaActualizacion: '2024-01-15'
        },
        {
            id: '2',
            nombre: 'UROTAN-D-FORTE 200MG X 100TAB',
            registroSanitario: 'RS-002-2024',
            marca: 'Pfizer',
            concentracion: '200',
            unidadMedida: 'mg (Miligramos)',
            cantidad: 100,
            presentacionComercial: 'Caja X100',
            tipoProducto: 'Medicamento',
            codigoInterno: '0.801',
            precioPromedio: 0.80,
            precioVenta: 2.50,
            stockSeguridad: 10,
            stock: 100,
            lote: '204115',
            fechaExpiracion: '2027-04-30',
            bodega: 'Bodega central',
            activo: true,
            fechaCreacion: '2024-01-15',
            fechaActualizacion: '2024-01-15'
        },
        {
            id: '3',
            nombre: 'INSTAFIBRA',
            registroSanitario: 'RS-003-2024',
            marca: 'GSK',
            concentracion: '500',
            unidadMedida: 'g (Gramos)',
            cantidad: 1,
            presentacionComercial: 'Frasco',
            tipoProducto: 'Suplemento',
            codigoInterno: 'SUP001',
            precioPromedio: 61.67,
            precioVenta: 85.00,
            stockSeguridad: 2,
            stock: 5,
            lote: 'HSU',
            fechaExpiracion: '2027-02-28',
            bodega: 'Bodega central',
            activo: true,
            fechaCreacion: '2024-01-15',
            fechaActualizacion: '2024-01-15'
        },
        {
            id: '4',
            nombre: 'OFS 440 G (SUPLEMENTO DIETETICO)',
            registroSanitario: 'RS-004-2024',
            marca: 'Nestlé',
            concentracion: '440',
            unidadMedida: 'g (Gramos)',
            cantidad: 1,
            presentacionComercial: 'Frasco',
            tipoProducto: 'Suplemento',
            codigoInterno: 'SUP002',
            precioPromedio: 93.00,
            precioVenta: 120.00,
            stockSeguridad: 1,
            stock: 2,
            lote: 'ISA',
            fechaExpiracion: '2027-03-10',
            bodega: 'Bodega central',
            activo: true,
            fechaCreacion: '2024-01-15',
            fechaActualizacion: '2024-01-15'
        },
        {
            id: '5',
            nombre: 'HEMOCYTON B (COMPLEJO B) JARABE',
            registroSanitario: 'RS-005-2024',
            marca: 'Roche',
            concentracion: '100',
            unidadMedida: 'ml (Mililitros)',
            cantidad: 1,
            presentacionComercial: 'Frasco',
            tipoProducto: 'Medicamento',
            codigoInterno: 'VIT001',
            precioPromedio: 20.00,
            precioVenta: 35.00,
            stockSeguridad: 3,
            stock: 11,
            lote: '206255',
            fechaExpiracion: '2027-06-30',
            bodega: 'Bodega central',
            activo: true,
            fechaCreacion: '2024-01-15',
            fechaActualizacion: '2024-01-15'
        },
        {
            id: '6',
            nombre: 'PENETROFORTE CREMA',
            registroSanitario: 'RS-006-2024',
            marca: 'Genfar',
            concentracion: '30',
            unidadMedida: 'g (Gramos)',
            cantidad: 1,
            presentacionComercial: 'Tubo',
            tipoProducto: 'Medicamento',
            codigoInterno: 'CRE001',
            precioPromedio: 15.00,
            precioVenta: 25.00,
            stockSeguridad: 2,
            stock: 2,
            lote: 'PF2024',
            fechaExpiracion: '2026-12-31',
            bodega: 'Bodega central',
            activo: true,
            fechaCreacion: '2024-01-15',
            fechaActualizacion: '2024-01-15'
        },
        {
            id: '7',
            nombre: 'METAMIZOL 1 GR CONMEL',
            registroSanitario: 'RS-007-2024',
            marca: 'Conmel',
            concentracion: '1000',
            unidadMedida: 'mg (Miligramos)',
            cantidad: 20,
            presentacionComercial: 'Caja X20',
            tipoProducto: 'Medicamento',
            codigoInterno: 'MET001',
            precioPromedio: 0.50,
            precioVenta: 1.20,
            stockSeguridad: 10,
            stock: 5,
            lote: 'MET2024',
            fechaExpiracion: '2027-08-15',
            bodega: 'Bodega central',
            activo: true,
            fechaCreacion: '2024-01-15',
            fechaActualizacion: '2024-01-15'
        },
        {
            id: '8',
            nombre: 'METRONIDAZOL 500MG TAB',
            registroSanitario: 'RS-008-2024',
            marca: 'Bayer',
            concentracion: '500',
            unidadMedida: 'mg (Miligramos)',
            cantidad: 20,
            presentacionComercial: 'Caja X20',
            tipoProducto: 'Medicamento',
            codigoInterno: 'MET002',
            precioPromedio: 0.80,
            precioVenta: 2.00,
            stockSeguridad: 50,
            stock: 38,
            lote: 'MTZ2024',
            fechaExpiracion: '2027-03-20',
            bodega: 'Bodega central',
            activo: true,
            fechaCreacion: '2024-01-15',
            fechaActualizacion: '2024-01-15'
        },
        {
            id: '9',
            nombre: 'CLOFENAC (ACECLOFENACO 100MG)',
            registroSanitario: 'RS-009-2024',
            marca: 'GSK',
            concentracion: '100',
            unidadMedida: 'mg (Miligramos)',
            cantidad: 20,
            presentacionComercial: 'Caja X20',
            tipoProducto: 'Medicamento',
            codigoInterno: 'CLO001',
            precioPromedio: 1.20,
            precioVenta: 3.00,
            stockSeguridad: 14,
            stock: 7,
            lote: 'CLO2024',
            fechaExpiracion: '2027-05-10',
            bodega: 'Bodega central',
            activo: true,
            fechaCreacion: '2024-01-15',
            fechaActualizacion: '2024-01-15'
        },
        {
            id: '10',
            nombre: 'CLOTRIMAZOL 1% CREMA X 20 GRAMOS',
            registroSanitario: 'RS-010-2024',
            marca: 'Pfizer',
            concentracion: '1',
            unidadMedida: '%',
            cantidad: 20,
            presentacionComercial: 'Tubo 20g',
            tipoProducto: 'Medicamento',
            codigoInterno: 'CLO002',
            precioPromedio: 8.00,
            precioVenta: 15.00,
            stockSeguridad: 5,
            stock: 2,
            lote: 'CLT2024',
            fechaExpiracion: '2027-07-25',
            bodega: 'Bodega central',
            activo: true,
            fechaCreacion: '2024-01-15',
            fechaActualizacion: '2024-01-15'
        },
        {
            id: '11',
            nombre: 'SALBUTAMOL EN AEROSOL 100MCG X 200 DOSIS',
            registroSanitario: 'RS-011-2024',
            marca: 'GSK',
            concentracion: '100',
            unidadMedida: 'mcg (Microgramos)',
            cantidad: 200,
            presentacionComercial: 'Aerosol 200 dosis',
            tipoProducto: 'Medicamento',
            codigoInterno: 'SAL001',
            precioPromedio: 25.00,
            precioVenta: 45.00,
            stockSeguridad: 1,
            stock: 1,
            lote: 'SAL2024',
            fechaExpiracion: '2027-09-30',
            bodega: 'Bodega central',
            activo: true,
            fechaCreacion: '2024-01-15',
            fechaActualizacion: '2024-01-15'
        },
        {
            id: '12',
            nombre: 'PARCETAMOL 120MG SML SOLUCION ORAL X60 ML',
            registroSanitario: 'RS-012-2024',
            marca: 'Genfar',
            concentracion: '120',
            unidadMedida: 'mg (Miligramos)',
            cantidad: 60,
            presentacionComercial: 'Frasco 60ml',
            tipoProducto: 'Medicamento',
            codigoInterno: 'PAR001',
            precioPromedio: 3.50,
            precioVenta: 7.00,
            stockSeguridad: 1,
            stock: 1,
            lote: 'PAR2024',
            fechaExpiracion: '2027-04-15',
            bodega: 'Bodega central',
            activo: true,
            fechaCreacion: '2024-01-15',
            fechaActualizacion: '2024-01-15'
        },
        {
            id: '13',
            nombre: 'PARACETAMOL 100MG/5ML X 10ML GOTA',
            registroSanitario: 'RS-013-2024',
            marca: 'Bayer',
            concentracion: '100',
            unidadMedida: 'mg (Miligramos)',
            cantidad: 10,
            presentacionComercial: 'Frasco gotero 10ml',
            tipoProducto: 'Medicamento',
            codigoInterno: 'PAR002',
            precioPromedio: 2.80,
            precioVenta: 5.50,
            stockSeguridad: 1,
            stock: 1,
            lote: 'PAR2024B',
            fechaExpiracion: '2027-06-20',
            bodega: 'Bodega central',
            activo: true,
            fechaCreacion: '2024-01-15',
            fechaActualizacion: '2024-01-15'
        },
        {
            id: '14',
            nombre: 'METFORMINA 850MG CAJA X 100 TABLETAS RECUBIERTAS',
            registroSanitario: 'RS-014-2024',
            marca: 'Merck',
            concentracion: '850',
            unidadMedida: 'mg (Miligramos)',
            cantidad: 100,
            presentacionComercial: 'Caja X100',
            tipoProducto: 'Medicamento',
            codigoInterno: 'MET003',
            precioPromedio: 0.60,
            precioVenta: 1.50,
            stockSeguridad: 50,
            stock: 15,
            lote: 'MTF2024',
            fechaExpiracion: '2027-11-10',
            bodega: 'Bodega central',
            activo: true,
            fechaCreacion: '2024-01-15',
            fechaActualizacion: '2024-01-15'
        }
    ]);

    const [movimientosStock, setMovimientosStock] = useState<MovimientoStock[]>([
        {
            id: '1',
            productoId: '1',
            tipo: 'entrada',
            cantidad: 100,
            motivo: 'Compra proveedor',
            fecha: '2024-01-10',
            usuario: 'Admin',
            numeroLote: '12822503',
            fechaExpiracion: '2027-05-31',
            precioUnitario: 10.00,
            total: 1000.00
        },
        {
            id: '2',
            productoId: '1',
            tipo: 'salida',
            cantidad: 25,
            motivo: 'Venta',
            fecha: '2024-01-12',
            usuario: 'Farmacéutico',
            precioUnitario: 25.00,
            total: 625.00
        }
    ]);

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
        'vial'
    ];

    // Filtros
    const productosFiltrados = productos.filter(prod => {
        const matchesSearch = prod.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            prod.registroSanitario.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            prod.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            prod.codigoInterno.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'todos' || prod.tipoProducto === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Alertas de stock bajo
    const stockBajo = productos.filter(prod => prod.stock <= prod.stockSeguridad);

    // Estadísticas
    const totalProductos = productos.length;
    const productosActivos = productos.filter(prod => prod.activo).length;
    const valorInventario = productos.reduce((total, prod) => total + (prod.stock * prod.precioPromedio), 0);
    const productosVencidos = productos.filter(prod => 
        prod.fechaExpiracion && new Date(prod.fechaExpiracion) < new Date()
    ).length;

    const handleEdit = (producto: Producto) => {
        setIsEditing(producto.id);
        setEditingProducto(producto);
    };

    const handleSave = () => {
        if (isEditing) {
            setProductos(prev => prev.map(prod => 
                prod.id === isEditing ? { ...prod, ...editingProducto } : prod
            ));
        }
        setIsEditing(null);
        setEditingProducto({});
    };

    const handleCancel = () => {
        setIsEditing(null);
        setEditingProducto({});
    };

    const handleInputChange = (field: keyof Producto, value: string | number | boolean) => {
        setEditingProducto(prev => ({ ...prev, [field]: value }));
    };

    const getStockStatus = (stock: number, stockSeguridad: number): { status: string; color: 'destructive' | 'secondary' | 'default' } => {
        if (stock === 0) return { status: 'Agotado', color: 'destructive' };
        if (stock <= stockSeguridad) return { status: 'Bajo', color: 'destructive' };
        if (stock <= stockSeguridad * 2) return { status: 'Medio', color: 'secondary' };
        return { status: 'Normal', color: 'default' };
    };

    const getUtilidad = (precioVenta: number, precioPromedio: number) => {
        return ((precioVenta - precioPromedio) / precioPromedio * 100).toFixed(1);
    };

    const toggleProductExpansion = (productId: string) => {
        setExpandedProduct(expandedProduct === productId ? null : productId);
    };

    const getDaysUntilExpiration = (fechaExpiracion: string) => {
        const today = new Date();
        const expiration = new Date(fechaExpiracion);
        const diffTime = expiration.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const handleAddProduct = (newProduct: Omit<Producto, 'id' | 'fechaCreacion' | 'fechaActualizacion'>) => {
        const producto: Producto = {
            ...newProduct,
            id: (productos.length + 1).toString(),
            fechaCreacion: new Date().toISOString().split('T')[0],
            fechaActualizacion: new Date().toISOString().split('T')[0]
        };
        setProductos(prev => [...prev, producto]);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b border-border bg-card">
                <div className="container mx-auto px-4 sm:px-6 py-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">Farmacia</h1>
                            <p className="text-sm text-muted-foreground">
                                Gestión de productos, inventario y reportes
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button 
                                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                onClick={() => setIsAddModalOpen(true)}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Ingresar
                            </Button>
                            <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
                                <Package className="h-4 w-4 mr-2" />
                                Sacar
                            </Button>
                            <Button variant="outline">
                                <Download className="h-4 w-4 mr-2" />
                                Exportar
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 py-6">
                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <Card className="border-l-4 border-l-primary">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Productos</p>
                                    <p className="text-2xl font-bold text-primary">{totalProductos}</p>
                                </div>
                                <Package className="h-8 w-8 text-primary" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-success">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Valor Inventario</p>
                                    <p className="text-2xl font-bold text-success">S/ {valorInventario.toFixed(2)}</p>
                                </div>
                                <DollarSign className="h-8 w-8 text-success" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-destructive">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Stock Bajo</p>
                                    <p className="text-2xl font-bold text-destructive">{stockBajo.length}</p>
                                </div>
                                <AlertTriangle className="h-8 w-8 text-destructive" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-warning">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Vencidos</p>
                                    <p className="text-2xl font-bold text-warning">{productosVencidos}</p>
                                </div>
                                <Calendar className="h-8 w-8 text-warning" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                

                {/* Tabs principales */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="inventario" className="flex items-center gap-2">
                            <Warehouse className="h-4 w-4" />
                            Inventario
                        </TabsTrigger>
                        <TabsTrigger value="productos" className="flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            Productos
                        </TabsTrigger>
                        <TabsTrigger value="movimientos" className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Movimientos
                        </TabsTrigger>
                        <TabsTrigger value="stock-seguridad" className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Stock de seguridad
                        </TabsTrigger>
                        <TabsTrigger value="configuracion" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Configuración
                        </TabsTrigger>
                    </TabsList>

                    {/* Tab: Inventario */}
                    <TabsContent value="inventario" className="space-y-6">
                        {/* Filtros */}
                        <Card className="border-primary/20">
                            <CardContent className="p-4">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Buscar productos..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-10 border-primary/30 focus:border-primary"
                                            />
                                        </div>
                                    </div>
                                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                        <SelectTrigger className="w-full sm:w-48 border-primary/30">
                                            <SelectValue placeholder="Tipo de Producto" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="todos">Todos los tipos</SelectItem>
                                            {tiposProducto.map(tipo => (
                                                <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                                        <Filter className="h-4 w-4 mr-2" />
                                        Filtros
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tabla de productos */}
                        <Card className="border-primary/10">
                            <CardHeader className="bg-primary/5">
                                <CardTitle className="text-primary">Inventario de Productos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-primary/20">
                                                <TableHead className="text-primary font-semibold">Producto / Reg. Sanitario</TableHead>
                                                <TableHead className="text-primary font-semibold">N. Lote</TableHead>
                                                <TableHead className="text-primary font-semibold">Expiración</TableHead>
                                                <TableHead className="text-primary font-semibold">Stock</TableHead>
                                                <TableHead className="text-primary font-semibold">Cód. Interno</TableHead>
                                                <TableHead className="text-primary font-semibold">Precio Promedio</TableHead>
                                                <TableHead className="text-primary font-semibold">Acciones</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {productosFiltrados.map((producto) => {
                                                const stockStatus = getStockStatus(producto.stock, producto.stockSeguridad);
                                                const utilidad = getUtilidad(producto.precioVenta, producto.precioPromedio);
                                                const diasVencimiento = getDaysUntilExpiration(producto.fechaExpiracion);
                                                const isExpanded = expandedProduct === producto.id;
                                                
                                                return (
                                                    <React.Fragment key={producto.id}>
                                                        <TableRow className="hover:bg-primary/5">
                                                            <TableCell>
                                                                <div className="flex items-center gap-2">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => toggleProductExpansion(producto.id)}
                                                                        className="p-1 h-6 w-6"
                                                                    >
                                                                        {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                                                                    </Button>
                                                                    <div>
                                                                        <div className="font-medium text-foreground">{producto.nombre}</div>
                                                                        <div className="text-sm text-muted-foreground">
                                                                            {producto.registroSanitario}
                                                                        </div>
                                                                        <Badge variant="outline" className="text-xs mt-1">
                                                                            {producto.tipoProducto}
                                                                        </Badge>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="text-sm">
                                                                    <div className="font-medium">{producto.lote}</div>
                                                                    <div className="text-muted-foreground">Total lotes: 1</div>
                                                                    <div className="text-success text-xs">
                                                                        Próximo lote: Vence en {Math.floor(diasVencimiento / 30)} meses
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="text-sm">
                                                                    <div className={
                                                                        diasVencimiento < 0 
                                                                            ? 'text-destructive font-medium' 
                                                                            : diasVencimiento < 30 
                                                                            ? 'text-warning font-medium'
                                                                            : 'text-foreground'
                                                                    }>
                                                                        {new Date(producto.fechaExpiracion).toLocaleDateString('es-ES', { 
                                                                            day: 'numeric', 
                                                                            month: 'short', 
                                                                            year: 'numeric' 
                                                                        })}
                                                                    </div>
                                                                    {diasVencimiento < 30 && (
                                                                        <div className="text-xs text-warning">
                                                                            {diasVencimiento < 0 ? 'Vencido' : `${diasVencimiento} días`}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-medium">{producto.stock}</span>
                                                                    <Badge variant={stockStatus.color} className="text-xs">
                                                                        {stockStatus.status}
                                                                    </Badge>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <span className="font-mono text-sm">{producto.codigoInterno}</span>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div>
                                                                    <div className="font-medium text-success">S/ {producto.precioPromedio.toFixed(2)}</div>
                                                                    <div className="text-xs text-muted-foreground">
                                                                        Utilidad: {utilidad}%
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center gap-1">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleEdit(producto)}
                                                                        className="text-primary hover:bg-primary/10"
                                                                    >
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button variant="ghost" size="sm" className="text-info hover:bg-info/10">
                                                                        <Eye className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                        {isExpanded && (
                                                            <TableRow className="bg-muted/30">
                                                                <TableCell colSpan={7} className="p-4">
                                                                    <div className="bg-background rounded-lg border p-4">
                                                                        <h4 className="font-semibold text-primary mb-3">Detalles del Lote</h4>
                                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                            <div>
                                                                                <Label className="text-sm text-muted-foreground">Bodega</Label>
                                                                                <p className="font-medium">{producto.bodega}</p>
                                                                            </div>
                                                                            <div>
                                                                                <Label className="text-sm text-muted-foreground">Número de Lote</Label>
                                                                                <p className="font-mono">{producto.lote}</p>
                                                                            </div>
                                                                            <div>
                                                                                <Label className="text-sm text-muted-foreground">Fecha de Expiración</Label>
                                                                                <p className="font-medium">{new Date(producto.fechaExpiracion).toLocaleDateString()}</p>
                                                                            </div>
                                                                            <div>
                                                                                <Label className="text-sm text-muted-foreground">Stock en este Lote</Label>
                                                                                <p className="font-medium text-primary">{producto.stock}</p>
                                                                            </div>
                                                                            <div>
                                                                                <Label className="text-sm text-muted-foreground">Precio de Venta</Label>
                                                                                <p className="font-medium text-success">S/ {producto.precioVenta.toFixed(2)}</p>
                                                                            </div>
                                                                            <div>
                                                                                <Label className="text-sm text-muted-foreground">Marca</Label>
                                                                                <p className="font-medium">{producto.marca}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        )}
                                                    </React.Fragment>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Tab: Movimientos */}
                    <TabsContent value="movimientos" className="space-y-6">
                        <Card className="border-primary/10">
                            <CardHeader className="bg-primary/5">
                                <CardTitle className="text-primary">Movimientos de Stock</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-primary/20">
                                                <TableHead className="text-primary font-semibold">Fecha</TableHead>
                                                <TableHead className="text-primary font-semibold">Producto</TableHead>
                                                <TableHead className="text-primary font-semibold">Tipo</TableHead>
                                                <TableHead className="text-primary font-semibold">Cantidad</TableHead>
                                                <TableHead className="text-primary font-semibold">Motivo</TableHead>
                                                <TableHead className="text-primary font-semibold">Usuario</TableHead>
                                                <TableHead className="text-primary font-semibold">Total</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {movimientosStock.map((movimiento) => {
                                                const producto = productos.find(p => p.id === movimiento.productoId);
                                                return (
                                                    <TableRow key={movimiento.id} className="hover:bg-primary/5">
                                                        <TableCell>
                                                            <div className="text-sm">
                                                                {new Date(movimiento.fecha).toLocaleDateString('es-ES')}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div>
                                                                <div className="font-medium">{producto?.nombre || 'N/A'}</div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    Cód. Interno: {producto?.codigoInterno || 'N/A'}
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge 
                                                                variant={movimiento.tipo === 'entrada' ? 'default' : 'secondary'}
                                                                className={
                                                                    movimiento.tipo === 'entrada' 
                                                                        ? 'bg-success text-success-foreground' 
                                                                        : 'bg-destructive text-destructive-foreground'
                                                                }
                                                            >
                                                                {movimiento.tipo === 'entrada' ? 'Entrada' : 'Salida'}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className="font-medium">{movimiento.cantidad}</span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className="text-sm">{movimiento.motivo}</span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className="text-sm">{movimiento.usuario}</span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className="font-medium text-success">S/ {movimiento.total.toFixed(2)}</span>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Tab: Stock de Seguridad */}
                    <TabsContent value="stock-seguridad" className="space-y-6">
                        {/* Header con selector de bodega y botón imprimir */}
                        <Card className="border-primary/10">
                            <CardContent className="p-4">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor="bodega" className="text-sm font-medium">Bodega central</Label>
                                            <Select>
                                                <SelectTrigger className="w-48">
                                                    <SelectValue placeholder="Bodega central" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="bodega-central">Bodega central</SelectItem>
                                                    <SelectItem value="bodega-auxiliar">Bodega auxiliar</SelectItem>
                                                    <SelectItem value="bodega-emergencia">Bodega emergencia</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                        <Download className="h-4 w-4 mr-2" />
                                        Imprimir
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Mensaje de alerta */}
                        <Card className="border-destructive bg-destructive/10">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2 text-destructive">
                                    <AlertTriangle className="h-5 w-5" />
                                    <p className="text-sm font-medium">
                                        El siguiente listado de productos corresponde a los productos que tienen un stock baja la cantidad considerada como crítica.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tabla de productos con stock bajo */}
                        <Card className="border-primary/10">
                            <CardHeader className="bg-primary/5">
                                <CardTitle className="text-primary">Productos con Stock Crítico</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-primary/20">
                                                <TableHead className="text-primary font-semibold">Producto</TableHead>
                                                <TableHead className="text-primary font-semibold text-right">Stock de seguridad</TableHead>
                                                <TableHead className="text-primary font-semibold text-right">Stock actual</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {stockBajo.map((producto) => (
                                                <TableRow key={producto.id} className="hover:bg-primary/5">
                                                    <TableCell>
                                                        <div className="font-medium text-foreground">{producto.nombre}</div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <span className="font-medium">{producto.stockSeguridad}</span>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <span className={`font-medium ${producto.stock === 0 ? 'text-destructive' : 'text-warning'}`}>
                                                            {producto.stock}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Tab: Ventas */}
                    <TabsContent value="ventas" className="space-y-6">
                        <Card className="border-primary/10">
                            <CardHeader className="bg-primary/5">
                                <CardTitle className="text-primary">Ventas de Productos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8 text-muted-foreground">
                                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50 text-primary" />
                                    <p className="text-lg font-medium mb-2">Módulo de ventas en desarrollo</p>
                                    <p className="text-sm mb-4">Próximamente podrás registrar ventas de productos y generar reportes de facturación</p>
                                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Nueva Venta
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Tab: Reportes */}
                    <TabsContent value="reportes" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="border-primary/10">
                                <CardHeader className="bg-primary/5">
                                    <CardTitle className="flex items-center gap-2 text-primary">
                                        <TrendingUp className="h-5 w-5 text-success" />
                                        Productos Más Vendidos
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center py-8 text-muted-foreground">
                                        <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50 text-success" />
                                        <p className="font-medium">Reporte en desarrollo</p>
                                        <p className="text-sm">Análisis de productos con mayor demanda</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-primary/10">
                                <CardHeader className="bg-primary/5">
                                    <CardTitle className="flex items-center gap-2 text-primary">
                                        <TrendingDown className="h-5 w-5 text-destructive" />
                                        Productos Menos Vendidos
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center py-8 text-muted-foreground">
                                        <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50 text-destructive" />
                                        <p className="font-medium">Reporte en desarrollo</p>
                                        <p className="text-sm">Identificación de productos con baja rotación</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-primary/10">
                                <CardHeader className="bg-primary/5">
                                    <CardTitle className="flex items-center gap-2 text-primary">
                                        <DollarSign className="h-5 w-5 text-info" />
                                        Utilidad por Venta
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center py-8 text-muted-foreground">
                                        <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50 text-info" />
                                        <p className="font-medium">Reporte en desarrollo</p>
                                        <p className="text-sm">Análisis de rentabilidad por producto</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-primary/10">
                                <CardHeader className="bg-primary/5">
                                    <CardTitle className="flex items-center gap-2 text-primary">
                                        <Package className="h-5 w-5 text-warning" />
                                        Comisiones por Producto
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center py-8 text-muted-foreground">
                                        <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50 text-warning" />
                                        <p className="font-medium">Reporte en desarrollo</p>
                                        <p className="text-sm">Control de comisiones e incentivos</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Modal para agregar productos */}
            <AddFarmaciaModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleAddProduct}
            />
        </div>
    );
}
