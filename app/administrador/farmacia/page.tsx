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
    ChevronDown,
    Users
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

interface IndicacionMedicamento {
    id: string;
    medicamentoId: string;
    indicacion: string;
    dosis: string;
    frecuencia: string;
    duracion: string;
    observaciones?: string;
    fechaCreacion: string;
}

interface ComisionMedico {
    id: string;
    medicoId: string;
    medicoNombre: string;
    productoId: string;
    productoNombre: string;
    tipoComision: 'fijo' | 'porcentaje';
    montoComision: number;
    porcentajeComision?: number;
    fechaCreacion: string;
    activo: boolean;
}

export default function FarmaciaPage() {
    const [activeTab, setActiveTab] = useState("inventario");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("todos");
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [editingProducto, setEditingProducto] = useState<Partial<Producto>>({});
    const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Estados para modal de indicaciones
    const [showNuevaIndicacion, setShowNuevaIndicacion] = useState(false);
    const [showEditarIndicacion, setShowEditarIndicacion] = useState(false);
    const [indicacionSeleccionada, setIndicacionSeleccionada] = useState<IndicacionMedicamento | null>(null);
    const [nuevaIndicacion, setNuevaIndicacion] = useState({
        medicamentoId: '',
        indicacion: '',
        dosis: '',
        frecuencia: '',
        duracion: '',
        observaciones: ''
    });

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

    // Mock data para ventas de productos
    const [ventasProductos, setVentasProductos] = useState<VentaProducto[]>([
        {
            id: '1',
            productoId: '2',
            cantidad: 5,
            precioUnitario: 2.50,
            descuento: 0,
            total: 12.50,
            fecha: '2024-10-15',
            pacienteId: 'P001',
            medicoId: 'M001',
            recetaId: 'R001'
        },
        {
            id: '2',
            productoId: '5',
            cantidad: 2,
            precioUnitario: 35.00,
            descuento: 5,
            total: 65.00,
            fecha: '2024-10-16',
            pacienteId: 'P002',
            medicoId: 'M001',
            recetaId: 'R002'
        },
        {
            id: '3',
            productoId: '8',
            cantidad: 10,
            precioUnitario: 2.00,
            descuento: 0,
            total: 20.00,
            fecha: '2024-10-17',
            pacienteId: 'P003',
            medicoId: 'M002',
            recetaId: 'R003'
        },
        {
            id: '4',
            productoId: '14',
            cantidad: 3,
            precioUnitario: 1.50,
            descuento: 0,
            total: 4.50,
            fecha: '2024-10-18',
            pacienteId: 'P004',
            medicoId: 'M001',
            recetaId: 'R004'
        },
        {
            id: '5',
            productoId: '2',
            cantidad: 8,
            precioUnitario: 2.50,
            descuento: 2,
            total: 18.00,
            fecha: '2024-10-19',
            pacienteId: 'P005',
            medicoId: 'M002',
            recetaId: 'R005'
        }
    ]);

    // Mock data para indicaciones de medicamentos
    const [indicacionesMedicamentos, setIndicacionesMedicamentos] = useState<IndicacionMedicamento[]>([
        {
            id: '1',
            medicamentoId: '2',
            indicacion: 'Tratamiento de infecciones del tracto urinario',
            dosis: '200mg',
            frecuencia: 'Cada 8 horas',
            duracion: '7 días',
            observaciones: 'Tomar con abundante agua',
            fechaCreacion: '2024-01-15'
        },
        {
            id: '2',
            medicamentoId: '5',
            indicacion: 'Suplemento vitamínico para anemia',
            dosis: '5ml',
            frecuencia: 'Una vez al día',
            duracion: '30 días',
            observaciones: 'Tomar con las comidas',
            fechaCreacion: '2024-01-15'
        },
        {
            id: '3',
            medicamentoId: '8',
            indicacion: 'Tratamiento de infecciones bacterianas',
            dosis: '500mg',
            frecuencia: 'Cada 8 horas',
            duracion: '10 días',
            observaciones: 'No consumir alcohol durante el tratamiento',
            fechaCreacion: '2024-01-15'
        },
        {
            id: '4',
            medicamentoId: '14',
            indicacion: 'Control de diabetes tipo 2',
            dosis: '850mg',
            frecuencia: 'Dos veces al día',
            duracion: 'Tratamiento crónico',
            observaciones: 'Tomar con las comidas principales',
            fechaCreacion: '2024-01-15'
        }
    ]);

    // Mock data para comisiones de médicos
    const [comisionesMedicos, setComisionesMedicos] = useState<ComisionMedico[]>([
        {
            id: '1',
            medicoId: 'M001',
            medicoNombre: 'Dr. Carlos Sánchez',
            productoId: '2',
            productoNombre: 'UROTAN-D-FORTE 200MG X 100TAB',
            tipoComision: 'porcentaje',
            montoComision: 0.50,
            porcentajeComision: 20,
            fechaCreacion: '2024-01-15',
            activo: true
        },
        {
            id: '2',
            medicoId: 'M001',
            medicoNombre: 'Dr. Carlos Sánchez',
            productoId: '5',
            productoNombre: 'HEMOCYTON B (COMPLEJO B) JARABE',
            tipoComision: 'fijo',
            montoComision: 5.00,
            fechaCreacion: '2024-01-15',
            activo: true
        },
        {
            id: '3',
            medicoId: 'M002',
            medicoNombre: 'Dra. María González',
            productoId: '8',
            productoNombre: 'METRONIDAZOL 500MG TAB',
            tipoComision: 'porcentaje',
            montoComision: 0.40,
            porcentajeComision: 20,
            fechaCreacion: '2024-01-15',
            activo: true
        },
        {
            id: '4',
            medicoId: 'M002',
            medicoNombre: 'Dra. María González',
            productoId: '14',
            productoNombre: 'METFORMINA 850MG CAJA X 100 TABLETAS RECUBIERTAS',
            tipoComision: 'fijo',
            montoComision: 2.00,
            fechaCreacion: '2024-01-15',
            activo: true
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

    // Funciones para reportes
    const getProductosMasVendidos = () => {
        const ventasPorProducto = ventasProductos.reduce((acc, venta) => {
            const producto = productos.find(p => p.id === venta.productoId);
            if (producto) {
                if (!acc[producto.id]) {
                    acc[producto.id] = {
                        producto,
                        cantidadTotal: 0,
                        ingresosTotal: 0
                    };
                }
                acc[producto.id].cantidadTotal += venta.cantidad;
                acc[producto.id].ingresosTotal += venta.total;
            }
            return acc;
        }, {} as Record<string, { producto: Producto; cantidadTotal: number; ingresosTotal: number }>);

        return Object.values(ventasPorProducto)
            .sort((a, b) => b.cantidadTotal - a.cantidadTotal)
            .slice(0, 10);
    };

    const getProductosMenosVendidos = () => {
        const ventasPorProducto = ventasProductos.reduce((acc, venta) => {
            const producto = productos.find(p => p.id === venta.productoId);
            if (producto) {
                if (!acc[producto.id]) {
                    acc[producto.id] = {
                        producto,
                        cantidadTotal: 0,
                        ingresosTotal: 0
                    };
                }
                acc[producto.id].cantidadTotal += venta.cantidad;
                acc[producto.id].ingresosTotal += venta.total;
            }
            return acc;
        }, {} as Record<string, { producto: Producto; cantidadTotal: number; ingresosTotal: number }>);

        return Object.values(ventasPorProducto)
            .sort((a, b) => a.cantidadTotal - b.cantidadTotal)
            .slice(0, 10);
    };

    const getUtilidadPorVenta = () => {
        return ventasProductos.map(venta => {
            const producto = productos.find(p => p.id === venta.productoId);
            if (producto) {
                const costoTotal = venta.cantidad * producto.precioPromedio;
                const utilidad = venta.total - costoTotal;
                const porcentajeUtilidad = (utilidad / costoTotal) * 100;
                
                return {
                    venta,
                    producto,
                    costoTotal,
                    utilidad,
                    porcentajeUtilidad
                };
            }
            return null;
        }).filter(Boolean);
    };

    const getComisionesPorMedico = () => {
        const comisionesPorMedico = comisionesMedicos.reduce((acc, comision) => {
            if (!acc[comision.medicoId]) {
                acc[comision.medicoId] = {
                    medico: comision.medicoNombre,
                    comisiones: [],
                    totalComisiones: 0
                };
            }
            acc[comision.medicoId].comisiones.push(comision);
            acc[comision.medicoId].totalComisiones += comision.montoComision;
            return acc;
        }, {} as Record<string, { medico: string; comisiones: ComisionMedico[]; totalComisiones: number }>);

        return Object.values(comisionesPorMedico);
    };

    // Funciones para manejar indicaciones
    const handleNuevaIndicacion = () => {
        if (!nuevaIndicacion.medicamentoId || !nuevaIndicacion.indicacion || !nuevaIndicacion.dosis || !nuevaIndicacion.frecuencia || !nuevaIndicacion.duracion) {
            return;
        }

        const indicacion: IndicacionMedicamento = {
            id: Date.now().toString(),
            medicamentoId: nuevaIndicacion.medicamentoId,
            indicacion: nuevaIndicacion.indicacion,
            dosis: nuevaIndicacion.dosis,
            frecuencia: nuevaIndicacion.frecuencia,
            duracion: nuevaIndicacion.duracion,
            observaciones: nuevaIndicacion.observaciones,
            fechaCreacion: new Date().toISOString().split('T')[0]
        };

        setIndicacionesMedicamentos(prev => [...prev, indicacion]);
        setNuevaIndicacion({
            medicamentoId: '',
            indicacion: '',
            dosis: '',
            frecuencia: '',
            duracion: '',
            observaciones: ''
        });
        setShowNuevaIndicacion(false);
    };

    const handleEditarIndicacion = (indicacion: IndicacionMedicamento) => {
        setIndicacionSeleccionada(indicacion);
        setNuevaIndicacion({
            medicamentoId: indicacion.medicamentoId,
            indicacion: indicacion.indicacion,
            dosis: indicacion.dosis,
            frecuencia: indicacion.frecuencia,
            duracion: indicacion.duracion,
            observaciones: indicacion.observaciones || ''
        });
        setShowEditarIndicacion(true);
    };

    const handleActualizarIndicacion = () => {
        if (!indicacionSeleccionada || !nuevaIndicacion.medicamentoId || !nuevaIndicacion.indicacion || !nuevaIndicacion.dosis || !nuevaIndicacion.frecuencia || !nuevaIndicacion.duracion) {
            return;
        }

        setIndicacionesMedicamentos(prev => prev.map(ind => 
            ind.id === indicacionSeleccionada.id 
                ? {
                    ...ind,
                    medicamentoId: nuevaIndicacion.medicamentoId,
                    indicacion: nuevaIndicacion.indicacion,
                    dosis: nuevaIndicacion.dosis,
                    frecuencia: nuevaIndicacion.frecuencia,
                    duracion: nuevaIndicacion.duracion,
                    observaciones: nuevaIndicacion.observaciones
                }
                : ind
        ));

        setNuevaIndicacion({
            medicamentoId: '',
            indicacion: '',
            dosis: '',
            frecuencia: '',
            duracion: '',
            observaciones: ''
        });
        setIndicacionSeleccionada(null);
        setShowEditarIndicacion(false);
    };

    const handleEliminarIndicacion = (id: string) => {
        setIndicacionesMedicamentos(prev => prev.filter(ind => ind.id !== id));
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
                    <TabsList className="grid w-full grid-cols-7">
                        <TabsTrigger value="inventario" className="flex items-center gap-2">
                            <Warehouse className="h-4 w-4" />
                            Inventario
                        </TabsTrigger>
                        <TabsTrigger value="productos" className="flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            Productos
                        </TabsTrigger>
                        <TabsTrigger value="indicaciones" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Indicaciones
                        </TabsTrigger>
                        <TabsTrigger value="movimientos" className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Movimientos
                        </TabsTrigger>
                        <TabsTrigger value="stock-seguridad" className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Stock de seguridad
                        </TabsTrigger>
                        <TabsTrigger value="reportes" className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Reportes
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

                    {/* Tab: Productos */}
                    <TabsContent value="productos" className="space-y-6">
                        {/* Filtros para productos */}
                        <Card className="border-primary/20">
                            <CardContent className="p-4">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Buscar productos por nombre, marca, código..."
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

                        {/* Grid de productos */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {productosFiltrados.map((producto) => {
                                const stockStatus = getStockStatus(producto.stock, producto.stockSeguridad);
                                const utilidad = getUtilidad(producto.precioVenta, producto.precioPromedio);
                                const diasVencimiento = getDaysUntilExpiration(producto.fechaExpiracion);
                                
                                return (
                                    <Card key={producto.id} className="border-primary/10 hover:shadow-md transition-shadow">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <CardTitle className="text-sm font-semibold text-foreground line-clamp-2 leading-tight">
                                                        {producto.nombre}
                                                    </CardTitle>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <Badge variant="outline" className="text-xs">
                                                            {producto.tipoProducto}
                                                        </Badge>
                                                        <Badge 
                                                            variant={stockStatus.color} 
                                                            className="text-xs"
                                                        >
                                                            {stockStatus.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEdit(producto)}
                                                        className="text-primary hover:bg-primary/10 h-8 w-8 p-0"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className="text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        
                                        <CardContent className="space-y-4">
                                            {/* Información del producto */}
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-muted-foreground">Marca:</span>
                                                    <span className="text-sm font-medium">{producto.marca}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-muted-foreground">Reg. Sanitario:</span>
                                                    <span className="text-xs font-mono">{producto.registroSanitario}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-muted-foreground">Código Interno:</span>
                                                    <span className="text-xs font-mono text-primary">{producto.codigoInterno}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-muted-foreground">Concentración:</span>
                                                    <span className="text-sm">{producto.concentracion} {producto.unidadMedida}</span>
                                                </div>
                                            </div>

                                            {/* Stock y precios */}
                                            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-muted-foreground">Stock Actual:</span>
                                                    <span className={`text-sm font-bold ${stockStatus.color === 'destructive' ? 'text-destructive' : 'text-primary'}`}>
                                                        {producto.stock}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-muted-foreground">Stock Seguridad:</span>
                                                    <span className="text-sm">{producto.stockSeguridad}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-muted-foreground">Precio Promedio:</span>
                                                    <span className="text-sm font-medium text-success">S/ {producto.precioPromedio.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-muted-foreground">Precio Venta:</span>
                                                    <span className="text-sm font-bold text-primary">S/ {producto.precioVenta.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-muted-foreground">Utilidad:</span>
                                                    <span className="text-sm font-medium text-success">+{utilidad}%</span>
                                                </div>
                                            </div>

                                            {/* Información de lote y expiración */}
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-muted-foreground">Lote:</span>
                                                    <span className="text-xs font-mono">{producto.lote}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-muted-foreground">Expiración:</span>
                                                    <span className={`text-xs font-medium ${
                                                        diasVencimiento < 0 
                                                            ? 'text-destructive' 
                                                            : diasVencimiento < 30 
                                                            ? 'text-warning'
                                                            : 'text-foreground'
                                                    }`}>
                                                        {new Date(producto.fechaExpiracion).toLocaleDateString('es-ES', { 
                                                            day: 'numeric', 
                                                            month: 'short', 
                                                            year: 'numeric' 
                                                        })}
                                                    </span>
                                                </div>
                                                {diasVencimiento < 30 && (
                                                    <div className="text-xs text-center">
                                                        <span className={`px-2 py-1 rounded-full ${
                                                            diasVencimiento < 0 
                                                                ? 'bg-destructive/20 text-destructive' 
                                                                : 'bg-warning/20 text-warning'
                                                        }`}>
                                                            {diasVencimiento < 0 ? 'Vencido' : `${diasVencimiento} días restantes`}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Presentación comercial */}
                                            <div className="pt-2 border-t border-border">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-muted-foreground">Presentación:</span>
                                                    <span className="text-xs">{producto.presentacionComercial}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-muted-foreground">Bodega:</span>
                                                    <span className="text-xs">{producto.bodega}</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>

                        {/* Mensaje cuando no hay productos */}
                        {productosFiltrados.length === 0 && (
                            <Card className="border-primary/10">
                                <CardContent className="text-center py-12">
                                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50 text-primary" />
                                    <h3 className="text-lg font-medium mb-2">No se encontraron productos</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Intenta ajustar los filtros de búsqueda o agregar nuevos productos
                                    </p>
                                    <Button 
                                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                        onClick={() => setIsAddModalOpen(true)}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Agregar Producto
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {/* Tab: Indicaciones */}
                    <TabsContent value="indicaciones" className="space-y-6">
                        {/* Filtros para indicaciones */}
                        <Card className="border-primary/20">
                            <CardContent className="p-4">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Buscar indicaciones..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-10 border-primary/30 focus:border-primary"
                                            />
                                        </div>
                                    </div>
                                    <Button 
                                        onClick={() => setShowNuevaIndicacion(true)}
                                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Nueva Indicación
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tabla de indicaciones */}
                        <Card className="border-primary/10">
                            <CardHeader className="bg-primary/5">
                                <CardTitle className="text-primary">Indicaciones de Medicamentos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-primary/20">
                                                <TableHead className="text-primary font-semibold">Medicamento</TableHead>
                                                <TableHead className="text-primary font-semibold">Indicación</TableHead>
                                                <TableHead className="text-primary font-semibold">Dosis</TableHead>
                                                <TableHead className="text-primary font-semibold">Frecuencia</TableHead>
                                                <TableHead className="text-primary font-semibold">Duración</TableHead>
                                                <TableHead className="text-primary font-semibold">Observaciones</TableHead>
                                                <TableHead className="text-primary font-semibold">Acciones</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {indicacionesMedicamentos
                                                .filter(indicacion => {
                                                    const medicamento = productos.find(p => p.id === indicacion.medicamentoId);
                                                    return !searchTerm || 
                                                           indicacion.indicacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                           medicamento?.nombre.toLowerCase().includes(searchTerm.toLowerCase());
                                                })
                                                .map((indicacion) => {
                                                    const medicamento = productos.find(p => p.id === indicacion.medicamentoId);
                                                    return (
                                                        <TableRow key={indicacion.id} className="hover:bg-primary/5">
                                                            <TableCell>
                                                                <div>
                                                                    <div className="font-medium">{medicamento?.nombre || 'N/A'}</div>
                                                                    <div className="text-sm text-muted-foreground">
                                                                        {medicamento?.marca} - {medicamento?.concentracion} {medicamento?.unidadMedida}
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <span className="text-sm">{indicacion.indicacion}</span>
                                                            </TableCell>
                                                            <TableCell>
                                                                <span className="text-sm font-medium">{indicacion.dosis}</span>
                                                            </TableCell>
                                                            <TableCell>
                                                                <span className="text-sm">{indicacion.frecuencia}</span>
                                                            </TableCell>
                                                            <TableCell>
                                                                <span className="text-sm">{indicacion.duracion}</span>
                                                            </TableCell>
                                                            <TableCell>
                                                                <span className="text-sm text-muted-foreground">{indicacion.observaciones || '-'}</span>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center gap-1">
                                                                    <Button 
                                                                        variant="ghost" 
                                                                        size="sm" 
                                                                        className="text-primary hover:bg-primary/10"
                                                                        onClick={() => handleEditarIndicacion(indicacion)}
                                                                    >
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button 
                                                                        variant="ghost" 
                                                                        size="sm" 
                                                                        className="text-destructive hover:bg-destructive/10"
                                                                        onClick={() => handleEliminarIndicacion(indicacion.id)}
                                                                    >
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

                    {/* Tab: Configuración */}
                    <TabsContent value="configuracion" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Configuración de Bodegas */}
                            <Card className="border-primary/10">
                                <CardHeader className="bg-primary/5">
                                    <CardTitle className="flex items-center gap-2 text-primary">
                                        <Warehouse className="h-5 w-5" />
                                        Gestión de Bodegas
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="bodega-principal">Bodega Principal</Label>
                                        <Input 
                                            id="bodega-principal" 
                                            defaultValue="Bodega central" 
                                            className="border-primary/30"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="bodega-auxiliar">Bodega Auxiliar</Label>
                                        <Input 
                                            id="bodega-auxiliar" 
                                            defaultValue="Bodega auxiliar" 
                                            className="border-primary/30"
                                        />
                                    </div>
                                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                                        <Save className="h-4 w-4 mr-2" />
                                        Guardar Configuración
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Configuración de Alertas */}
                            <Card className="border-primary/10">
                                <CardHeader className="bg-primary/5">
                                    <CardTitle className="flex items-center gap-2 text-primary">
                                        <AlertTriangle className="h-5 w-5" />
                                        Alertas de Stock
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="dias-vencimiento">Días antes de vencimiento</Label>
                                        <Input 
                                            id="dias-vencimiento" 
                                            type="number" 
                                            defaultValue="30" 
                                            className="border-primary/30"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="porcentaje-stock">Porcentaje stock bajo</Label>
                                        <Input 
                                            id="porcentaje-stock" 
                                            type="number" 
                                            defaultValue="20" 
                                            className="border-primary/30"
                                        />
                                    </div>
                                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                                        <Save className="h-4 w-4 mr-2" />
                                        Guardar Configuración
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Configuración de Precios */}
                            <Card className="border-primary/10">
                                <CardHeader className="bg-primary/5">
                                    <CardTitle className="flex items-center gap-2 text-primary">
                                        <DollarSign className="h-5 w-5" />
                                        Configuración de Precios
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="margen-utilidad">Margen de utilidad (%)</Label>
                                        <Input 
                                            id="margen-utilidad" 
                                            type="number" 
                                            defaultValue="30" 
                                            className="border-primary/30"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="descuento-maximo">Descuento máximo (%)</Label>
                                        <Input 
                                            id="descuento-maximo" 
                                            type="number" 
                                            defaultValue="10" 
                                            className="border-primary/30"
                                        />
                                    </div>
                                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                                        <Save className="h-4 w-4 mr-2" />
                                        Guardar Configuración
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Configuración de Reportes */}
                            <Card className="border-primary/10">
                                <CardHeader className="bg-primary/5">
                                    <CardTitle className="flex items-center gap-2 text-primary">
                                        <FileText className="h-5 w-5" />
                                        Configuración de Reportes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="formato-reporte">Formato de reporte</Label>
                                        <Select>
                                            <SelectTrigger className="border-primary/30">
                                                <SelectValue placeholder="PDF" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pdf">PDF</SelectItem>
                                                <SelectItem value="excel">Excel</SelectItem>
                                                <SelectItem value="csv">CSV</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="frecuencia-reporte">Frecuencia de reportes</Label>
                                        <Select>
                                            <SelectTrigger className="border-primary/30">
                                                <SelectValue placeholder="Mensual" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="diario">Diario</SelectItem>
                                                <SelectItem value="semanal">Semanal</SelectItem>
                                                <SelectItem value="mensual">Mensual</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                                        <Save className="h-4 w-4 mr-2" />
                                        Guardar Configuración
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Tab: Reportes */}
                    <TabsContent value="reportes" className="space-y-6">
                        {/* Estadísticas de Reportes */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card className="border-l-4 border-l-success">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Total Ventas</p>
                                            <p className="text-2xl font-bold text-success">
                                                {ventasProductos.length}
                                            </p>
                                        </div>
                                        <ShoppingCart className="h-8 w-8 text-success" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-l-4 border-l-primary">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Ingresos Totales</p>
                                            <p className="text-2xl font-bold text-primary">
                                                S/ {ventasProductos.reduce((sum, v) => sum + v.total, 0).toFixed(2)}
                                            </p>
                                        </div>
                                        <DollarSign className="h-8 w-8 text-primary" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-l-4 border-l-info">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Utilidad Total</p>
                                            <p className="text-2xl font-bold text-info">
                                                S/ {getUtilidadPorVenta().reduce((sum, u) => sum + (u?.utilidad || 0), 0).toFixed(2)}
                                            </p>
                                        </div>
                                        <TrendingUp className="h-8 w-8 text-info" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-l-4 border-l-warning">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Comisiones</p>
                                            <p className="text-2xl font-bold text-warning">
                                                S/ {comisionesMedicos.reduce((sum, c) => sum + c.montoComision, 0).toFixed(2)}
                                            </p>
                                        </div>
                                        <Users className="h-8 w-8 text-warning" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Reporte de Productos Más Vendidos */}
                        <Card className="border-primary/10">
                            <CardHeader className="bg-primary/5">
                                <CardTitle className="flex items-center gap-2 text-primary">
                                    <TrendingUp className="h-5 w-5 text-success" />
                                    Productos Más Vendidos
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-primary/20">
                                                <TableHead className="text-primary font-semibold">#</TableHead>
                                                <TableHead className="text-primary font-semibold">Producto</TableHead>
                                                <TableHead className="text-primary font-semibold">Cantidad Vendida</TableHead>
                                                <TableHead className="text-primary font-semibold">Ingresos</TableHead>
                                                <TableHead className="text-primary font-semibold">Utilidad</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {getProductosMasVendidos().map((item, index) => (
                                                <TableRow key={item.producto.id} className="hover:bg-primary/5">
                                                    <TableCell>
                                                        <Badge variant="default" className="bg-success text-success-foreground">
                                                            #{index + 1}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>
                                                            <div className="font-medium">{item.producto.nombre}</div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {item.producto.marca} - {item.producto.concentracion} {item.producto.unidadMedida}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="font-bold text-primary">{item.cantidadTotal}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="font-medium text-success">S/ {item.ingresosTotal.toFixed(2)}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="font-medium text-info">
                                                            S/ {(item.ingresosTotal - (item.cantidadTotal * item.producto.precioPromedio)).toFixed(2)}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Reporte de Productos Menos Vendidos */}
                        <Card className="border-primary/10">
                            <CardHeader className="bg-primary/5">
                                <CardTitle className="flex items-center gap-2 text-primary">
                                    <TrendingDown className="h-5 w-5 text-destructive" />
                                    Productos Menos Vendidos
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-primary/20">
                                                <TableHead className="text-primary font-semibold">#</TableHead>
                                                <TableHead className="text-primary font-semibold">Producto</TableHead>
                                                <TableHead className="text-primary font-semibold">Cantidad Vendida</TableHead>
                                                <TableHead className="text-primary font-semibold">Ingresos</TableHead>
                                                <TableHead className="text-primary font-semibold">Stock Actual</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {getProductosMenosVendidos().map((item, index) => (
                                                <TableRow key={item.producto.id} className="hover:bg-primary/5">
                                                    <TableCell>
                                                        <Badge variant="destructive">
                                                            #{index + 1}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>
                                                            <div className="font-medium">{item.producto.nombre}</div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {item.producto.marca} - {item.producto.concentracion} {item.producto.unidadMedida}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="font-bold text-destructive">{item.cantidadTotal}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="font-medium text-success">S/ {item.ingresosTotal.toFixed(2)}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className={`font-medium ${item.producto.stock <= item.producto.stockSeguridad ? 'text-destructive' : 'text-primary'}`}>
                                                            {item.producto.stock}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Reporte de Utilidad por Venta */}
                        <Card className="border-primary/10">
                            <CardHeader className="bg-primary/5">
                                <CardTitle className="flex items-center gap-2 text-primary">
                                    <DollarSign className="h-5 w-5 text-info" />
                                    Utilidad por Venta de Medicamentos
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-primary/20">
                                                <TableHead className="text-primary font-semibold">Fecha</TableHead>
                                                <TableHead className="text-primary font-semibold">Producto</TableHead>
                                                <TableHead className="text-primary font-semibold">Cantidad</TableHead>
                                                <TableHead className="text-primary font-semibold">Precio Venta</TableHead>
                                                <TableHead className="text-primary font-semibold">Costo</TableHead>
                                                <TableHead className="text-primary font-semibold">Utilidad</TableHead>
                                                <TableHead className="text-primary font-semibold">% Utilidad</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {getUtilidadPorVenta().map((item) => (
                                                <TableRow key={item?.venta?.id || 'unknown'} className="hover:bg-primary/5">
                                                    <TableCell>
                                                        <span className="text-sm">{item?.venta?.fecha ? new Date(item.venta.fecha).toLocaleDateString() : '-'}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>
                                                            <div className="font-medium">{item?.producto?.nombre || 'N/A'}</div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {item?.producto?.marca || 'N/A'}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="font-medium">{item?.venta?.cantidad || 0}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="font-medium text-success">S/ {(item?.venta?.total || 0).toFixed(2)}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="font-medium text-muted-foreground">S/ {(item?.costoTotal || 0).toFixed(2)}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className={`font-bold ${(item?.utilidad || 0) >= 0 ? 'text-success' : 'text-destructive'}`}>
                                                            S/ {(item?.utilidad || 0).toFixed(2)}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className={`font-medium ${(item?.porcentajeUtilidad || 0) >= 0 ? 'text-success' : 'text-destructive'}`}>
                                                            {(item?.porcentajeUtilidad || 0).toFixed(1)}%
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Reporte de Comisiones por Médico */}
                        <Card className="border-primary/10">
                            <CardHeader className="bg-primary/5">
                                <CardTitle className="flex items-center gap-2 text-primary">
                                    <Users className="h-5 w-5 text-warning" />
                                    Comisiones por Médico
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {getComisionesPorMedico().map((medico) => (
                                        <div key={medico.medico} className="p-4 rounded-lg border bg-card">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="font-semibold text-lg">{medico.medico}</h3>
                                                <Badge variant="default" className="bg-warning text-warning-foreground">
                                                    Total: S/ {medico.totalComisiones.toFixed(2)}
                                                </Badge>
                                            </div>
                                            <div className="overflow-x-auto">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Producto</TableHead>
                                                            <TableHead>Tipo Comisión</TableHead>
                                                            <TableHead>Monto/Porcentaje</TableHead>
                                                            <TableHead>Monto Comisión</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {medico.comisiones.map((comision) => (
                                                            <TableRow key={comision.id}>
                                                                <TableCell>
                                                                    <div>
                                                                        <div className="font-medium">{comision.productoNombre}</div>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Badge variant={comision.tipoComision === 'fijo' ? 'default' : 'secondary'}>
                                                                        {comision.tipoComision === 'fijo' ? 'Monto Fijo' : 'Porcentaje'}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell>
                                                                    {comision.tipoComision === 'fijo' 
                                                                        ? `S/ ${comision.montoComision.toFixed(2)}`
                                                                        : `${comision.porcentajeComision}%`
                                                                    }
                                                                </TableCell>
                                                                <TableCell>
                                                                    <span className="font-bold text-warning">S/ {comision.montoComision.toFixed(2)}</span>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Modal para agregar productos */}
            <AddFarmaciaModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleAddProduct}
            />

            {/* Modal para nueva indicación */}
            {showNuevaIndicacion && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-background border border-border rounded-lg p-6 w-full max-w-2xl mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-foreground">Nueva Indicación</h2>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowNuevaIndicacion(false)}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="medicamento">Medicamento</Label>
                                <Select value={nuevaIndicacion.medicamentoId} onValueChange={(value) => setNuevaIndicacion(prev => ({ ...prev, medicamentoId: value }))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar medicamento" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {productos.map((producto) => (
                                            <SelectItem key={producto.id} value={producto.id}>
                                                {producto.nombre} - {producto.marca}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="indicacion">Indicación</Label>
                                <Input
                                    id="indicacion"
                                    value={nuevaIndicacion.indicacion}
                                    onChange={(e) => setNuevaIndicacion(prev => ({ ...prev, indicacion: e.target.value }))}
                                    placeholder="Ej: Hipertensión arterial"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="dosis">Dosis</Label>
                                    <Input
                                        id="dosis"
                                        value={nuevaIndicacion.dosis}
                                        onChange={(e) => setNuevaIndicacion(prev => ({ ...prev, dosis: e.target.value }))}
                                        placeholder="Ej: 5mg"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="frecuencia">Frecuencia</Label>
                                    <Input
                                        id="frecuencia"
                                        value={nuevaIndicacion.frecuencia}
                                        onChange={(e) => setNuevaIndicacion(prev => ({ ...prev, frecuencia: e.target.value }))}
                                        placeholder="Ej: 1 vez al día"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="duracion">Duración</Label>
                                <Input
                                    id="duracion"
                                    value={nuevaIndicacion.duracion}
                                    onChange={(e) => setNuevaIndicacion(prev => ({ ...prev, duracion: e.target.value }))}
                                    placeholder="Ej: 30 días"
                                />
                            </div>

                            <div>
                                <Label htmlFor="observaciones">Observaciones</Label>
                                <Textarea
                                    id="observaciones"
                                    value={nuevaIndicacion.observaciones}
                                    onChange={(e) => setNuevaIndicacion(prev => ({ ...prev, observaciones: e.target.value }))}
                                    placeholder="Observaciones adicionales..."
                                    rows={3}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-6">
                            <Button
                                variant="outline"
                                onClick={() => setShowNuevaIndicacion(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleNuevaIndicacion}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                Guardar
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para editar indicación */}
            {showEditarIndicacion && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-background border border-border rounded-lg p-6 w-full max-w-2xl mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-foreground">Editar Indicación</h2>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowEditarIndicacion(false)}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="medicamento-edit">Medicamento</Label>
                                <Select value={nuevaIndicacion.medicamentoId} onValueChange={(value) => setNuevaIndicacion(prev => ({ ...prev, medicamentoId: value }))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar medicamento" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {productos.map((producto) => (
                                            <SelectItem key={producto.id} value={producto.id}>
                                                {producto.nombre} - {producto.marca}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="indicacion-edit">Indicación</Label>
                                <Input
                                    id="indicacion-edit"
                                    value={nuevaIndicacion.indicacion}
                                    onChange={(e) => setNuevaIndicacion(prev => ({ ...prev, indicacion: e.target.value }))}
                                    placeholder="Ej: Hipertensión arterial"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="dosis-edit">Dosis</Label>
                                    <Input
                                        id="dosis-edit"
                                        value={nuevaIndicacion.dosis}
                                        onChange={(e) => setNuevaIndicacion(prev => ({ ...prev, dosis: e.target.value }))}
                                        placeholder="Ej: 5mg"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="frecuencia-edit">Frecuencia</Label>
                                    <Input
                                        id="frecuencia-edit"
                                        value={nuevaIndicacion.frecuencia}
                                        onChange={(e) => setNuevaIndicacion(prev => ({ ...prev, frecuencia: e.target.value }))}
                                        placeholder="Ej: 1 vez al día"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="duracion-edit">Duración</Label>
                                <Input
                                    id="duracion-edit"
                                    value={nuevaIndicacion.duracion}
                                    onChange={(e) => setNuevaIndicacion(prev => ({ ...prev, duracion: e.target.value }))}
                                    placeholder="Ej: 30 días"
                                />
                            </div>

                            <div>
                                <Label htmlFor="observaciones-edit">Observaciones</Label>
                                <Textarea
                                    id="observaciones-edit"
                                    value={nuevaIndicacion.observaciones}
                                    onChange={(e) => setNuevaIndicacion(prev => ({ ...prev, observaciones: e.target.value }))}
                                    placeholder="Observaciones adicionales..."
                                    rows={3}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-6">
                            <Button
                                variant="outline"
                                onClick={() => setShowEditarIndicacion(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleActualizarIndicacion}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                Actualizar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
