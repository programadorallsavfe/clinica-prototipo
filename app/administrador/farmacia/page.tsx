'use client';

import { useState } from 'react';
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
    X
} from "lucide-react";

// TypeScript interfaces
interface Medicamento {
    id: string;
    nombre: string;
    principioActivo: string;
    concentracion: string;
    formaFarmaceutica: string;
    laboratorio: string;
    codigoBarras?: string;
    precioCompra: number;
    precioVenta: number;
    stock: number;
    stockMinimo: number;
    indicaciones: string[];
    contraindicaciones: string[];
    efectosAdversos: string[];
    fechaVencimiento?: string;
    lote?: string;
    categoria: string;
    requiereReceta: boolean;
    activo: boolean;
    fechaCreacion: string;
    fechaActualizacion: string;
}

interface MovimientoStock {
    id: string;
    medicamentoId: string;
    tipo: 'entrada' | 'salida';
    cantidad: number;
    motivo: string;
    fecha: string;
    usuario: string;
    lote?: string;
    fechaVencimiento?: string;
    precioUnitario: number;
    total: number;
}

interface VentaMedicamento {
    id: string;
    medicamentoId: string;
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
    const [editingMedicamento, setEditingMedicamento] = useState<Partial<Medicamento>>({});

    // Mock data - En producción vendría de una API
    const [medicamentos, setMedicamentos] = useState<Medicamento[]>([
        {
            id: '1',
            nombre: 'Paracetamol 500mg',
            principioActivo: 'Paracetamol',
            concentracion: '500mg',
            formaFarmaceutica: 'Tableta',
            laboratorio: 'Bayer',
            codigoBarras: '1234567890123',
            precioCompra: 0.50,
            precioVenta: 1.20,
            stock: 150,
            stockMinimo: 20,
            indicaciones: ['Dolor', 'Fiebre'],
            contraindicaciones: ['Hepatopatía severa'],
            efectosAdversos: ['Náuseas', 'Rash cutáneo'],
            fechaVencimiento: '2025-12-31',
            lote: 'LOT001',
            categoria: 'Analgésicos',
            requiereReceta: false,
            activo: true,
            fechaCreacion: '2024-01-15',
            fechaActualizacion: '2024-01-15'
        },
        {
            id: '2',
            nombre: 'Ibuprofeno 400mg',
            principioActivo: 'Ibuprofeno',
            concentracion: '400mg',
            formaFarmaceutica: 'Tableta',
            laboratorio: 'Pfizer',
            codigoBarras: '1234567890124',
            precioCompra: 0.80,
            precioVenta: 2.00,
            stock: 75,
            stockMinimo: 15,
            indicaciones: ['Dolor', 'Inflamación', 'Fiebre'],
            contraindicaciones: ['Úlcera péptica', 'Insuficiencia renal'],
            efectosAdversos: ['Gastritis', 'Cefalea'],
            fechaVencimiento: '2025-10-15',
            lote: 'LOT002',
            categoria: 'Antiinflamatorios',
            requiereReceta: false,
            activo: true,
            fechaCreacion: '2024-01-15',
            fechaActualizacion: '2024-01-15'
        },
        {
            id: '3',
            nombre: 'Amoxicilina 500mg',
            principioActivo: 'Amoxicilina',
            concentracion: '500mg',
            formaFarmaceutica: 'Cápsula',
            laboratorio: 'GSK',
            codigoBarras: '1234567890125',
            precioCompra: 1.20,
            precioVenta: 3.50,
            stock: 5,
            stockMinimo: 10,
            indicaciones: ['Infecciones bacterianas'],
            contraindicaciones: ['Alergia a penicilinas'],
            efectosAdversos: ['Diarrea', 'Náuseas', 'Rash'],
            fechaVencimiento: '2025-08-20',
            lote: 'LOT003',
            categoria: 'Antibióticos',
            requiereReceta: true,
            activo: true,
            fechaCreacion: '2024-01-15',
            fechaActualizacion: '2024-01-15'
        }
    ]);

    const [movimientosStock, setMovimientosStock] = useState<MovimientoStock[]>([
        {
            id: '1',
            medicamentoId: '1',
            tipo: 'entrada',
            cantidad: 100,
            motivo: 'Compra proveedor',
            fecha: '2024-01-10',
            usuario: 'Admin',
            lote: 'LOT001',
            fechaVencimiento: '2025-12-31',
            precioUnitario: 0.50,
            total: 50.00
        },
        {
            id: '2',
            medicamentoId: '1',
            tipo: 'salida',
            cantidad: 25,
            motivo: 'Venta',
            fecha: '2024-01-12',
            usuario: 'Farmacéutico',
            precioUnitario: 1.20,
            total: 30.00
        }
    ]);

    const categorias = [
        'Analgésicos',
        'Antiinflamatorios',
        'Antibióticos',
        'Antihistamínicos',
        'Antihipertensivos',
        'Antidiabéticos',
        'Vitaminas',
        'Suplementos',
        'Ginecológicos',
        'Obstétricos'
    ];

    const formasFarmaceuticas = [
        'Tableta',
        'Cápsula',
        'Jarabe',
        'Inyección',
        'Crema',
        'Pomada',
        'Supositorio',
        'Gotas',
        'Spray',
        'Parche'
    ];

    // Filtros
    const medicamentosFiltrados = medicamentos.filter(med => {
        const matchesSearch = med.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            med.principioActivo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            med.laboratorio.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'todos' || med.categoria === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Alertas de stock bajo
    const stockBajo = medicamentos.filter(med => med.stock <= med.stockMinimo);

    // Estadísticas
    const totalMedicamentos = medicamentos.length;
    const medicamentosActivos = medicamentos.filter(med => med.activo).length;
    const valorInventario = medicamentos.reduce((total, med) => total + (med.stock * med.precioCompra), 0);
    const medicamentosVencidos = medicamentos.filter(med => 
        med.fechaVencimiento && new Date(med.fechaVencimiento) < new Date()
    ).length;

    const handleEdit = (medicamento: Medicamento) => {
        setIsEditing(medicamento.id);
        setEditingMedicamento(medicamento);
    };

    const handleSave = () => {
        if (isEditing) {
            setMedicamentos(prev => prev.map(med => 
                med.id === isEditing ? { ...med, ...editingMedicamento } : med
            ));
        }
        setIsEditing(null);
        setEditingMedicamento({});
    };

    const handleCancel = () => {
        setIsEditing(null);
        setEditingMedicamento({});
    };

    const handleInputChange = (field: keyof Medicamento, value: any) => {
        setEditingMedicamento(prev => ({ ...prev, [field]: value }));
    };

    const getStockStatus = (stock: number, stockMinimo: number) => {
        if (stock === 0) return { status: 'Agotado', color: 'destructive' };
        if (stock <= stockMinimo) return { status: 'Bajo', color: 'destructive' };
        if (stock <= stockMinimo * 2) return { status: 'Medio', color: 'secondary' };
        return { status: 'Normal', color: 'default' };
    };

    const getUtilidad = (precioVenta: number, precioCompra: number) => {
        return ((precioVenta - precioCompra) / precioCompra * 100).toFixed(1);
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
                                Gestión de medicamentos, inventario y reportes
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Nuevo Medicamento
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
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Medicamentos</p>
                                    <p className="text-2xl font-bold text-primary">{totalMedicamentos}</p>
                                </div>
                                <Package className="h-8 w-8 text-primary" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Valor Inventario</p>
                                    <p className="text-2xl font-bold text-green-600">S/ {valorInventario.toFixed(2)}</p>
                                </div>
                                <DollarSign className="h-8 w-8 text-green-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Stock Bajo</p>
                                    <p className="text-2xl font-bold text-red-600">{stockBajo.length}</p>
                                </div>
                                <AlertTriangle className="h-8 w-8 text-red-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Vencidos</p>
                                    <p className="text-2xl font-bold text-orange-600">{medicamentosVencidos}</p>
                                </div>
                                <Calendar className="h-8 w-8 text-orange-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Alertas */}
                {stockBajo.length > 0 && (
                    <Card className="mb-6 border-red-200 bg-red-50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-800">
                                <AlertTriangle className="h-5 w-5" />
                                Alertas de Stock Bajo
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {stockBajo.map(med => (
                                    <div key={med.id} className="flex items-center justify-between p-2 bg-white rounded border">
                                        <span className="font-medium">{med.nombre}</span>
                                        <Badge variant="destructive">
                                            Stock: {med.stock} (Mín: {med.stockMinimo})
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Tabs principales */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="inventario" className="flex items-center gap-2">
                            <Warehouse className="h-4 w-4" />
                            Inventario
                        </TabsTrigger>
                        <TabsTrigger value="movimientos" className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Movimientos
                        </TabsTrigger>
                        <TabsTrigger value="ventas" className="flex items-center gap-2">
                            <ShoppingCart className="h-4 w-4" />
                            Ventas
                        </TabsTrigger>
                        <TabsTrigger value="reportes" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Reportes
                        </TabsTrigger>
                    </TabsList>

                    {/* Tab: Inventario */}
                    <TabsContent value="inventario" className="space-y-6">
                        {/* Filtros */}
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Buscar medicamentos..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>
                                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                        <SelectTrigger className="w-full sm:w-48">
                                            <SelectValue placeholder="Categoría" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="todos">Todas las categorías</SelectItem>
                                            {categorias.map(cat => (
                                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button variant="outline">
                                        <Filter className="h-4 w-4 mr-2" />
                                        Filtros
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tabla de medicamentos */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Inventario de Medicamentos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Medicamento</TableHead>
                                                <TableHead>Laboratorio</TableHead>
                                                <TableHead>Stock</TableHead>
                                                <TableHead>Precio Compra</TableHead>
                                                <TableHead>Precio Venta</TableHead>
                                                <TableHead>Utilidad</TableHead>
                                                <TableHead>Vencimiento</TableHead>
                                                <TableHead>Acciones</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {medicamentosFiltrados.map((medicamento) => {
                                                const stockStatus = getStockStatus(medicamento.stock, medicamento.stockMinimo);
                                                const utilidad = getUtilidad(medicamento.precioVenta, medicamento.precioCompra);
                                                
                                                return (
                                                    <TableRow key={medicamento.id}>
                                                        <TableCell>
                                                            <div>
                                                                <div className="font-medium">{medicamento.nombre}</div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    {medicamento.principioActivo} {medicamento.concentracion}
                                                                </div>
                                                                <Badge variant="outline" className="text-xs">
                                                                    {medicamento.categoria}
                                                                </Badge>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{medicamento.laboratorio}</TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <span>{medicamento.stock}</span>
                                                                <Badge variant={stockStatus.color as any}>
                                                                    {stockStatus.status}
                                                                </Badge>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>S/ {medicamento.precioCompra.toFixed(2)}</TableCell>
                                                        <TableCell>S/ {medicamento.precioVenta.toFixed(2)}</TableCell>
                                                        <TableCell>
                                                            <span className="text-green-600 font-medium">
                                                                {utilidad}%
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>
                                                            {medicamento.fechaVencimiento ? (
                                                                <span className={
                                                                    new Date(medicamento.fechaVencimiento) < new Date() 
                                                                        ? 'text-red-600' 
                                                                        : 'text-foreground'
                                                                }>
                                                                    {new Date(medicamento.fechaVencimiento).toLocaleDateString()}
                                                                </span>
                                                            ) : '-'}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-1">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleEdit(medicamento)}
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button variant="ghost" size="sm">
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                                <Button variant="ghost" size="sm">
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
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

                    {/* Tab: Movimientos */}
                    <TabsContent value="movimientos" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Movimientos de Stock</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Fecha</TableHead>
                                                <TableHead>Medicamento</TableHead>
                                                <TableHead>Tipo</TableHead>
                                                <TableHead>Cantidad</TableHead>
                                                <TableHead>Motivo</TableHead>
                                                <TableHead>Usuario</TableHead>
                                                <TableHead>Total</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {movimientosStock.map((movimiento) => {
                                                const medicamento = medicamentos.find(m => m.id === movimiento.medicamentoId);
                                                return (
                                                    <TableRow key={movimiento.id}>
                                                        <TableCell>
                                                            {new Date(movimiento.fecha).toLocaleDateString()}
                                                        </TableCell>
                                                        <TableCell>{medicamento?.nombre || 'N/A'}</TableCell>
                                                        <TableCell>
                                                            <Badge variant={movimiento.tipo === 'entrada' ? 'default' : 'secondary'}>
                                                                {movimiento.tipo === 'entrada' ? 'Entrada' : 'Salida'}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>{movimiento.cantidad}</TableCell>
                                                        <TableCell>{movimiento.motivo}</TableCell>
                                                        <TableCell>{movimiento.usuario}</TableCell>
                                                        <TableCell>S/ {movimiento.total.toFixed(2)}</TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Tab: Ventas */}
                    <TabsContent value="ventas" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Ventas de Medicamentos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8 text-muted-foreground">
                                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>Módulo de ventas en desarrollo</p>
                                    <Button className="mt-4">
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
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5 text-green-600" />
                                        Medicamentos Más Vendidos
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center py-8 text-muted-foreground">
                                        <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p>Reporte en desarrollo</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <TrendingDown className="h-5 w-5 text-red-600" />
                                        Medicamentos Menos Vendidos
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center py-8 text-muted-foreground">
                                        <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p>Reporte en desarrollo</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <DollarSign className="h-5 w-5 text-blue-600" />
                                        Utilidad por Venta
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center py-8 text-muted-foreground">
                                        <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p>Reporte en desarrollo</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Package className="h-5 w-5 text-purple-600" />
                                        Comisiones por Medicamento
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center py-8 text-muted-foreground">
                                        <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p>Reporte en desarrollo</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
