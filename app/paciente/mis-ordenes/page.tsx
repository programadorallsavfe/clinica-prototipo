"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  ShoppingCart, 
  Package, 
  Pill, 
  TestTube, 
  Calendar, 
  Clock, 
  User, 
  MapPin,
  Phone,
  Mail,
  Download,
  Eye,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  Truck,
  CreditCard,
  Receipt,
  Plus,
  Minus,
  DollarSign,
  ShoppingBag,
  FlaskConical,
  Stethoscope,
  Heart,
  Activity,
  RefreshCw,
  FileText,
  Printer
} from 'lucide-react';

// Tipos para las órdenes del paciente
interface ProductoOrden {
  id: string;
  nombre: string;
  tipo: 'medicamento' | 'examen' | 'insumo' | 'producto';
  descripcion?: string;
  cantidad: number;
  precioUnitario: number;
  descuento?: number;
  subtotal: number;
  laboratorio?: string;
  presentacion?: string;
  concentracion?: string;
  fechaVencimiento?: string;
  lote?: string;
  requiereReceta?: boolean;
  instrucciones?: string;
}

interface OrdenPaciente {
  id: string;
  numeroOrden: string;
  fecha: string;
  hora: string;
  estado: 'pendiente' | 'confirmada' | 'preparando' | 'lista' | 'entregada' | 'cancelada';
  tipo: 'medicamentos' | 'examenes' | 'insumos' | 'mixta';
  medico: string;
  especialidad: string;
  productos: ProductoOrden[];
  subtotal: number;
  descuento: number;
  total: number;
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia' | 'pendiente';
  direccionEntrega?: string;
  telefono?: string;
  observaciones?: string;
  fechaEntrega?: string;
  horaEntrega?: string;
  entregadoPor?: string;
  recetaMedica?: string;
  instrucciones?: string;
}

export default function MisOrdenesPage() {
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [busqueda, setBusqueda] = useState('');

  // Mock data para órdenes del paciente
  const ordenesMock: OrdenPaciente[] = [
    {
      id: '1',
      numeroOrden: 'ORD-2024-001',
      fecha: '2024-12-18',
      hora: '14:30',
      estado: 'entregada',
      tipo: 'medicamentos',
      medico: 'Dra. María González',
      especialidad: 'Ginecología',
      productos: [
        {
          id: '1',
          nombre: 'Ácido Fólico',
          tipo: 'medicamento',
          descripcion: 'Suplemento vitamínico para embarazo',
          cantidad: 2,
          precioUnitario: 25.00,
          subtotal: 50.00,
          laboratorio: 'Bayer',
          presentacion: 'Caja x 30 tabletas',
          concentracion: '400 mcg',
          fechaVencimiento: '2025-12-31',
          lote: 'LOT-2024-001',
          requiereReceta: false
        },
        {
          id: '2',
          nombre: 'Hierro',
          tipo: 'medicamento',
          descripcion: 'Suplemento de hierro para anemia',
          cantidad: 1,
          precioUnitario: 35.00,
          descuento: 5.00,
          subtotal: 30.00,
          laboratorio: 'Pfizer',
          presentacion: 'Caja x 20 tabletas',
          concentracion: '60 mg',
          fechaVencimiento: '2025-10-15',
          lote: 'LOT-2024-002',
          requiereReceta: true
        }
      ],
      subtotal: 80.00,
      descuento: 5.00,
      total: 75.00,
      metodoPago: 'tarjeta',
      direccionEntrega: 'Av. Principal 123, Lima',
      telefono: '+51 987 654 321',
      observaciones: 'Entregar en horario de oficina',
      fechaEntrega: '2024-12-19',
      horaEntrega: '10:00',
      entregadoPor: 'Juan Pérez',
      recetaMedica: 'REC-2024-001',
      instrucciones: 'Tomar con las comidas'
    },
    {
      id: '2',
      numeroOrden: 'ORD-2024-002',
      fecha: '2024-12-20',
      hora: '09:15',
      estado: 'lista',
      tipo: 'examenes',
      medico: 'Dr. Carlos Mendoza',
      especialidad: 'Obstetricia',
      productos: [
        {
          id: '3',
          nombre: 'Hemograma Completo',
          tipo: 'examen',
          descripcion: 'Análisis de sangre completo',
          cantidad: 1,
          precioUnitario: 45.00,
          subtotal: 45.00,
          laboratorio: 'Lab. Central',
          instrucciones: 'Ayunas de 8 horas'
        },
        {
          id: '4',
          nombre: 'Glicemia en Ayunas',
          tipo: 'examen',
          descripcion: 'Medición de glucosa en sangre',
          cantidad: 1,
          precioUnitario: 20.00,
          subtotal: 20.00,
          laboratorio: 'Lab. Central',
          instrucciones: 'Ayunas de 12 horas'
        },
        {
          id: '5',
          nombre: 'Perfil Prenatal',
          tipo: 'examen',
          descripcion: 'Panel completo para embarazo',
          cantidad: 1,
          precioUnitario: 80.00,
          subtotal: 80.00,
          laboratorio: 'Lab. Central',
          instrucciones: 'Ayunas de 8 horas'
        }
      ],
      subtotal: 145.00,
      descuento: 0,
      total: 145.00,
      metodoPago: 'efectivo',
      telefono: '+51 987 654 321',
      observaciones: 'Realizar exámenes en ayunas',
      recetaMedica: 'REC-2024-002'
    },
    {
      id: '3',
      numeroOrden: 'ORD-2024-003',
      fecha: '2024-12-22',
      hora: '16:00',
      estado: 'preparando',
      tipo: 'insumos',
      medico: 'Lic. Ana Torres',
      especialidad: 'Nutrición',
      productos: [
        {
          id: '6',
          nombre: 'Multivitamínico Prenatal',
          tipo: 'producto',
          descripcion: 'Suplemento nutricional completo',
          cantidad: 1,
          precioUnitario: 60.00,
          subtotal: 60.00,
          laboratorio: 'Nestlé',
          presentacion: 'Frasco x 60 tabletas',
          fechaVencimiento: '2025-08-20',
          lote: 'LOT-2024-003',
          requiereReceta: false
        },
        {
          id: '7',
          nombre: 'Jeringa 5ml',
          tipo: 'insumo',
          descripcion: 'Jeringa estéril de 5 mililitros',
          cantidad: 5,
          precioUnitario: 2.50,
          subtotal: 12.50,
          laboratorio: 'BD',
          presentacion: 'Caja x 10 unidades',
          fechaVencimiento: '2026-01-15',
          lote: 'LOT-2024-004',
          requiereReceta: false
        }
      ],
      subtotal: 72.50,
      descuento: 2.50,
      total: 70.00,
      metodoPago: 'transferencia',
      direccionEntrega: 'Av. Principal 123, Lima',
      telefono: '+51 987 654 321',
      observaciones: 'Preparar para entrega mañana',
      recetaMedica: 'REC-2024-003'
    },
    {
      id: '4',
      numeroOrden: 'ORD-2024-004',
      fecha: '2024-12-10',
      hora: '11:30',
      estado: 'cancelada',
      tipo: 'medicamentos',
      medico: 'Dra. María González',
      especialidad: 'Ginecología',
      productos: [
        {
          id: '8',
          nombre: 'Paracetamol',
          tipo: 'medicamento',
          descripcion: 'Analgésico y antipirético',
          cantidad: 1,
          precioUnitario: 15.00,
          subtotal: 15.00,
          laboratorio: 'Genfar',
          presentacion: 'Caja x 20 tabletas',
          concentracion: '500 mg',
          fechaVencimiento: '2025-06-30',
          lote: 'LOT-2024-005',
          requiereReceta: false
        }
      ],
      subtotal: 15.00,
      descuento: 0,
      total: 15.00,
      metodoPago: 'pendiente',
      observaciones: 'Cancelada por alergia al medicamento',
      recetaMedica: 'REC-2024-004'
    }
  ];

  // Filtrar órdenes
  const ordenesFiltradas = ordenesMock.filter(orden => {
    const cumpleEstado = filtroEstado === 'todos' || orden.estado === filtroEstado;
    const cumpleTipo = filtroTipo === 'todos' || orden.tipo === filtroTipo;
    const cumpleBusqueda = busqueda === '' || 
      orden.numeroOrden.toLowerCase().includes(busqueda.toLowerCase()) ||
      orden.medico.toLowerCase().includes(busqueda.toLowerCase()) ||
      orden.especialidad.toLowerCase().includes(busqueda.toLowerCase()) ||
      orden.productos.some(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()));
    
    return cumpleEstado && cumpleTipo && cumpleBusqueda;
  });

  // Separar órdenes por estado
  const ordenesPendientes = ordenesFiltradas.filter(orden => 
    ['pendiente', 'confirmada', 'preparando', 'lista'].includes(orden.estado)
  );
  const ordenesEntregadas = ordenesFiltradas.filter(orden => orden.estado === 'entregada');
  const ordenesCanceladas = ordenesFiltradas.filter(orden => orden.estado === 'cancelada');

  // Función para obtener el color del estado
  const getEstadoColor = (estado: string) => {
    const colores: Record<string, string> = {
      pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmada: 'bg-blue-100 text-blue-800 border-blue-200',
      preparando: 'bg-orange-100 text-orange-800 border-orange-200',
      lista: 'bg-green-100 text-green-800 border-green-200',
      entregada: 'bg-gray-100 text-gray-800 border-gray-200',
      cancelada: 'bg-red-100 text-red-800 border-red-200'
    };
    return colores[estado] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Función para obtener el icono del estado
  const getEstadoIcon = (estado: string) => {
    const iconos: Record<string, React.ReactElement> = {
      pendiente: <Clock className="h-4 w-4" />,
      confirmada: <CheckCircle className="h-4 w-4" />,
      preparando: <Package className="h-4 w-4" />,
      lista: <Truck className="h-4 w-4" />,
      entregada: <CheckCircle className="h-4 w-4" />,
      cancelada: <XCircle className="h-4 w-4" />
    };
    return iconos[estado] || <AlertCircle className="h-4 w-4" />;
  };

  // Función para obtener el icono del tipo de producto
  const getTipoIcon = (tipo: string) => {
    const iconos: Record<string, React.ReactElement> = {
      medicamento: <Pill className="h-4 w-4" />,
      examen: <TestTube className="h-4 w-4" />,
      insumo: <FlaskConical className="h-4 w-4" />,
      producto: <ShoppingBag className="h-4 w-4" />
    };
    return iconos[tipo] || <Package className="h-4 w-4" />;
  };

  // Función para obtener el color del tipo de producto
  const getTipoColor = (tipo: string) => {
    const colores: Record<string, string> = {
      medicamento: 'bg-blue-100 text-blue-800 border-blue-200',
      examen: 'bg-green-100 text-green-800 border-green-200',
      insumo: 'bg-purple-100 text-purple-800 border-purple-200',
      producto: 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colores[tipo] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Función para formatear fecha
  const formatearFecha = (fecha: string) => {
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Componente para mostrar un producto
  const ProductoCard = ({ producto }: { producto: ProductoOrden }) => (
    <Card className="bg-accent/20">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              {getTipoIcon(producto.tipo)}
            </div>
            <div>
              <h4 className="font-medium text-foreground">{producto.nombre}</h4>
              {producto.descripcion && (
                <p className="text-sm text-muted-foreground">{producto.descripcion}</p>
              )}
            </div>
          </div>
          <Badge className={`${getTipoColor(producto.tipo)} flex items-center gap-1`}>
            {getTipoIcon(producto.tipo)}
            {producto.tipo.charAt(0).toUpperCase() + producto.tipo.slice(1)}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cantidad:</span>
              <span className="font-medium">{producto.cantidad}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Precio Unitario:</span>
              <span className="font-medium">S/ {producto.precioUnitario.toFixed(2)}</span>
            </div>
            {producto.descuento && producto.descuento > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Descuento:</span>
                <span className="font-medium">-S/ {producto.descuento.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-primary border-t pt-2">
              <span>Subtotal:</span>
              <span>S/ {producto.subtotal.toFixed(2)}</span>
            </div>
          </div>
          <div className="space-y-2">
            {producto.laboratorio && (
              <div>
                <span className="text-muted-foreground">Laboratorio:</span>
                <p className="font-medium">{producto.laboratorio}</p>
              </div>
            )}
            {producto.presentacion && (
              <div>
                <span className="text-muted-foreground">Presentación:</span>
                <p className="font-medium">{producto.presentacion}</p>
              </div>
            )}
            {producto.concentracion && (
              <div>
                <span className="text-muted-foreground">Concentración:</span>
                <p className="font-medium">{producto.concentracion}</p>
              </div>
            )}
            {producto.fechaVencimiento && (
              <div>
                <span className="text-muted-foreground">Vencimiento:</span>
                <p className="font-medium">{new Date(producto.fechaVencimiento).toLocaleDateString('es-ES')}</p>
              </div>
            )}
            {producto.lote && (
              <div>
                <span className="text-muted-foreground">Lote:</span>
                <p className="font-medium">{producto.lote}</p>
              </div>
            )}
            {producto.instrucciones && (
              <div>
                <span className="text-muted-foreground">Instrucciones:</span>
                <p className="font-medium text-sm">{producto.instrucciones}</p>
              </div>
            )}
          </div>
        </div>

        {producto.requiereReceta && (
          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Requiere receta médica</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Componente para mostrar una orden
  const OrdenCard = ({ orden }: { orden: OrdenPaciente }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold text-foreground">
              {orden.numeroOrden}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {orden.medico} - {orden.especialidad}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatearFecha(orden.fecha)} - {orden.hora}
            </p>
          </div>
          <div className="text-right">
            <Badge className={`${getEstadoColor(orden.estado)} flex items-center gap-1 mb-2`}>
              {getEstadoIcon(orden.estado)}
              {orden.estado.charAt(0).toUpperCase() + orden.estado.slice(1)}
            </Badge>
            <div className="text-lg font-bold text-primary">
              S/ {orden.total.toFixed(2)}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Información de la orden */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tipo:</span>
              <span className="font-medium capitalize">{orden.tipo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Método de Pago:</span>
              <span className="font-medium capitalize">{orden.metodoPago}</span>
            </div>
            {orden.recetaMedica && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Receta:</span>
                <span className="font-medium">{orden.recetaMedica}</span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="font-medium">S/ {orden.subtotal.toFixed(2)}</span>
            </div>
            {orden.descuento > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Descuento:</span>
                <span className="font-medium">-S/ {orden.descuento.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-primary border-t pt-2">
              <span>Total:</span>
              <span>S/ {orden.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Productos */}
        <div className="space-y-3">
          <h4 className="font-medium text-foreground flex items-center gap-2">
            <Package className="h-4 w-4" />
            Productos ({orden.productos.length})
          </h4>
          <div className="space-y-3">
            {orden.productos.map((producto) => (
              <ProductoCard key={producto.id} producto={producto} />
            ))}
          </div>
        </div>

        {/* Información adicional */}
        {(orden.direccionEntrega || orden.telefono || orden.observaciones || orden.instrucciones) && (
          <>
            <Separator />
            <div className="space-y-3">
              {orden.direccionEntrega && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <span className="font-medium text-muted-foreground">Dirección de Entrega:</span>
                    <p className="text-foreground">{orden.direccionEntrega}</p>
                  </div>
                </div>
              )}
              {orden.telefono && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-primary" />
                  <div>
                    <span className="font-medium text-muted-foreground">Teléfono:</span>
                    <span className="text-foreground ml-1">{orden.telefono}</span>
                  </div>
                </div>
              )}
              {orden.observaciones && (
                <div className="text-sm">
                  <span className="font-medium text-muted-foreground">Observaciones:</span>
                  <p className="text-foreground mt-1">{orden.observaciones}</p>
                </div>
              )}
              {orden.instrucciones && (
                <div className="text-sm">
                  <span className="font-medium text-muted-foreground">Instrucciones:</span>
                  <p className="text-foreground mt-1">{orden.instrucciones}</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Información de entrega */}
        {orden.estado === 'entregada' && orden.fechaEntrega && (
          <>
            <Separator />
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-green-800 mb-2">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium">Entregada</span>
              </div>
              <div className="text-sm text-green-700 space-y-1">
                <p>Fecha: {formatearFecha(orden.fechaEntrega)}</p>
                {orden.horaEntrega && <p>Hora: {orden.horaEntrega}</p>}
                {orden.entregadoPor && <p>Entregado por: {orden.entregadoPor}</p>}
              </div>
            </div>
          </>
        )}

        {/* Acciones */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              <span>+51 987 654 321</span>
            </div>
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              <span>farmacia@clinica.com</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-1" />
              Ver Detalles
            </Button>
            <Button variant="outline" size="sm">
              <Receipt className="h-4 w-4 mr-1" />
              Recibo
            </Button>
            {orden.estado === 'entregada' && (
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Descargar
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mis Órdenes</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona tus órdenes de medicamentos, exámenes y productos médicos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-1" />
            Actualizar
          </Button>
          <Button size="sm">
            <ShoppingCart className="h-4 w-4 mr-1" />
            Nueva Orden
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por número de orden, médico, especialidad o producto..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="todos">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="confirmada">Confirmada</option>
                <option value="preparando">Preparando</option>
                <option value="lista">Lista</option>
                <option value="entregada">Entregada</option>
                <option value="cancelada">Cancelada</option>
              </select>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="todos">Todos los tipos</option>
                <option value="medicamentos">Medicamentos</option>
                <option value="examenes">Exámenes</option>
                <option value="insumos">Insumos</option>
                <option value="mixta">Mixta</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pendientes</p>
                <p className="text-2xl font-bold text-foreground">
                  {ordenesPendientes.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Entregadas</p>
                <p className="text-2xl font-bold text-foreground">
                  {ordenesEntregadas.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Canceladas</p>
                <p className="text-2xl font-bold text-foreground">
                  {ordenesCanceladas.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Gastado</p>
                <p className="text-2xl font-bold text-foreground">
                  S/ {ordenesFiltradas.reduce((sum, orden) => sum + orden.total, 0).toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs para organizar las órdenes */}
      <Tabs defaultValue="todas" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="todas">Todas ({ordenesFiltradas.length})</TabsTrigger>
          <TabsTrigger value="pendientes">Pendientes ({ordenesPendientes.length})</TabsTrigger>
          <TabsTrigger value="entregadas">Entregadas ({ordenesEntregadas.length})</TabsTrigger>
          <TabsTrigger value="canceladas">Canceladas ({ordenesCanceladas.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="todas" className="space-y-4">
          {ordenesFiltradas.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No se encontraron órdenes
                </h3>
                <p className="text-muted-foreground">
                  No hay órdenes que coincidan con los filtros seleccionados.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {ordenesFiltradas.map((orden) => (
                <OrdenCard key={orden.id} orden={orden} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pendientes" className="space-y-4">
          {ordenesPendientes.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No hay órdenes pendientes
                </h3>
                <p className="text-muted-foreground">
                  No tienes órdenes pendientes en este momento.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {ordenesPendientes.map((orden) => (
                <OrdenCard key={orden.id} orden={orden} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="entregadas" className="space-y-4">
          {ordenesEntregadas.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No hay órdenes entregadas
                </h3>
                <p className="text-muted-foreground">
                  Aún no tienes órdenes entregadas.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {ordenesEntregadas.map((orden) => (
                <OrdenCard key={orden.id} orden={orden} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="canceladas" className="space-y-4">
          {ordenesCanceladas.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <XCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No hay órdenes canceladas
                </h3>
                <p className="text-muted-foreground">
                  No tienes órdenes canceladas.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {ordenesCanceladas.map((orden) => (
                <OrdenCard key={orden.id} orden={orden} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
