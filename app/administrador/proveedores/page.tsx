'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DataTable, Columna } from '@/components/data-table';
import { getSession } from '@/lib/auth';
import { 
  generateId, getCurrentTimestamp, logAuditoria
} from '@/lib/storage';
import { 
  Building2, Plus, Search, Filter, Phone, Mail, MapPin, 
  Calendar, CheckCircle, XCircle, Eye, Edit, Trash2, 
  Package, Truck, Star, AlertTriangle, Clock, DollarSign,
  Activity, TrendingUp, Users, ShoppingCart
} from 'lucide-react';

// Interfaces para Proveedores
interface Proveedor {
  id: string;
  nombre: string;
  ruc: string;
  direccion: string;
  telefono: string;
  email: string;
  contacto: string;
  tipo: 'medicamentos' | 'insumos' | 'equipos' | 'servicios' | 'general';
  categoria: 'nacional' | 'internacional' | 'distribuidor' | 'fabricante';
  estado: 'activo' | 'inactivo' | 'suspendido' | 'evaluacion';
  calificacion: number; // 1-5 estrellas
  productosSuministrados: number;
  ultimaCompra: string;
  montoTotalCompras: number;
  plazoEntrega: number; // días
  condicionesPago: string;
  observaciones?: string;
  fechaRegistro: string;
  fechaActualizacion: string;
  creadoPor: string;
}

interface ProductoProveedor {
  id: string;
  proveedorId: string;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  unidad: string;
  estado: 'disponible' | 'agotado' | 'descontinuado';
}

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [productos, setProductos] = useState<ProductoProveedor[]>([]);
  const [sessionUser, setSessionUser] = useState<{ userId: string; username: string } | null>(null);
  
  // Estados de formularios
  const [showNuevoProveedor, setShowNuevoProveedor] = useState(false);
  const [showEditarProveedor, setShowEditarProveedor] = useState(false);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState<Proveedor | null>(null);
  
  // Estados de filtros
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todos');

  useEffect(() => {
    const session = getSession();
    setSessionUser(session);
    cargarDatos();
    inicializarDatosMock();
  }, []);

  const inicializarDatosMock = () => {
    // Verificar si ya hay datos para no duplicar
    const proveedoresExistentes = getProveedoresFromStorage();
    if (proveedoresExistentes.length === 0) {
      const proveedoresMock: Proveedor[] = [
        {
          id: generateId('prov'),
          nombre: 'Laboratorios Bago S.A.C.',
          ruc: '20123456789',
          direccion: 'Av. Javier Prado Este 4200, San Isidro, Lima',
          telefono: '01-234-5678',
          email: 'ventas@bago.com.pe',
          contacto: 'María González',
          tipo: 'medicamentos',
          categoria: 'fabricante',
          estado: 'activo',
          calificacion: 5,
          productosSuministrados: 45,
          ultimaCompra: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          montoTotalCompras: 125000,
          plazoEntrega: 3,
          condicionesPago: '30 días',
          observaciones: 'Proveedor principal de medicamentos. Excelente calidad y puntualidad.',
          fechaRegistro: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
          fechaActualizacion: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          creadoPor: sessionUser?.userId || 'system',
        },
        {
          id: generateId('prov'),
          nombre: 'Distribuidora Médica del Norte',
          ruc: '20987654321',
          direccion: 'Jr. Los Olivos 123, Trujillo, La Libertad',
          telefono: '044-123-456',
          email: 'info@medicanorte.com',
          contacto: 'Carlos Rodríguez',
          tipo: 'insumos',
          categoria: 'distribuidor',
          estado: 'activo',
          calificacion: 4,
          productosSuministrados: 28,
          ultimaCompra: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          montoTotalCompras: 85000,
          plazoEntrega: 5,
          condicionesPago: '15 días',
          fechaRegistro: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
          fechaActualizacion: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          creadoPor: sessionUser?.userId || 'system',
        },
        {
          id: generateId('prov'),
          nombre: 'Equipos Médicos Internacionales',
          ruc: '20555666777',
          direccion: 'Av. El Sol 456, Cusco, Cusco',
          telefono: '084-789-012',
          email: 'ventas@equiposmedicos.com',
          contacto: 'Ana Martínez',
          tipo: 'equipos',
          categoria: 'internacional',
          estado: 'activo',
          calificacion: 4,
          productosSuministrados: 12,
          ultimaCompra: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          montoTotalCompras: 200000,
          plazoEntrega: 14,
          condicionesPago: '50% anticipo, 50% entrega',
          fechaRegistro: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          fechaActualizacion: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          creadoPor: sessionUser?.userId || 'system',
        },
        {
          id: generateId('prov'),
          nombre: 'Farmacéutica Andina S.A.',
          ruc: '20333444555',
          direccion: 'Calle Real 789, Arequipa, Arequipa',
          telefono: '054-345-678',
          email: 'contacto@farmaceuticaandina.com',
          contacto: 'Luis Fernández',
          tipo: 'medicamentos',
          categoria: 'nacional',
          estado: 'activo',
          calificacion: 3,
          productosSuministrados: 32,
          ultimaCompra: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          montoTotalCompras: 95000,
          plazoEntrega: 4,
          condicionesPago: '20 días',
          fechaRegistro: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
          fechaActualizacion: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          creadoPor: sessionUser?.userId || 'system',
        },
        {
          id: generateId('prov'),
          nombre: 'Servicios de Limpieza Médica',
          ruc: '20111222333',
          direccion: 'Av. Grau 321, Chiclayo, Lambayeque',
          telefono: '074-567-890',
          email: 'servicios@limpiezamedica.com',
          contacto: 'Sofia Herrera',
          tipo: 'servicios',
          categoria: 'nacional',
          estado: 'activo',
          calificacion: 4,
          productosSuministrados: 8,
          ultimaCompra: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          montoTotalCompras: 15000,
          plazoEntrega: 1,
          condicionesPago: 'Contado',
          fechaRegistro: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          fechaActualizacion: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          creadoPor: sessionUser?.userId || 'system',
        },
        {
          id: generateId('prov'),
          nombre: 'Insumos Quirúrgicos del Sur',
          ruc: '20444555666',
          direccion: 'Jr. San Martín 654, Tacna, Tacna',
          telefono: '052-234-567',
          email: 'ventas@insumosquirurgicos.com',
          contacto: 'Roberto Vargas',
          tipo: 'insumos',
          categoria: 'distribuidor',
          estado: 'inactivo',
          calificacion: 2,
          productosSuministrados: 15,
          ultimaCompra: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          montoTotalCompras: 35000,
          plazoEntrega: 7,
          condicionesPago: '30 días',
          observaciones: 'Problemas de calidad en últimos envíos. En evaluación.',
          fechaRegistro: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
          fechaActualizacion: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          creadoPor: sessionUser?.userId || 'system',
        }
      ];

      // Guardar proveedores mock
      proveedoresMock.forEach(proveedor => {
        saveProveedorToStorage(proveedor);
      });
    }
  };

  const getProveedoresFromStorage = (): Proveedor[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem('clinica_proveedores');
    return data ? JSON.parse(data) : [];
  };

  const saveProveedorToStorage = (proveedor: Proveedor) => {
    if (typeof window === 'undefined') return;
    const proveedores = getProveedoresFromStorage();
    proveedores.push(proveedor);
    localStorage.setItem('clinica_proveedores', JSON.stringify(proveedores));
  };

  const updateProveedorInStorage = (id: string, updates: Partial<Proveedor>) => {
    if (typeof window === 'undefined') return;
    const proveedores = getProveedoresFromStorage();
    const index = proveedores.findIndex(p => p.id === id);
    if (index !== -1) {
      proveedores[index] = { ...proveedores[index], ...updates };
      localStorage.setItem('clinica_proveedores', JSON.stringify(proveedores));
    }
  };

  const deleteProveedorFromStorage = (id: string) => {
    if (typeof window === 'undefined') return;
    const proveedores = getProveedoresFromStorage();
    const filtered = proveedores.filter(p => p.id !== id);
    localStorage.setItem('clinica_proveedores', JSON.stringify(filtered));
  };

  const cargarDatos = () => {
    setProveedores(getProveedoresFromStorage());
  };

  const crearNuevoProveedor = (formData: FormData) => {
    const nuevoProveedor: Proveedor = {
      id: generateId('prov'),
      nombre: formData.get('nombre') as string,
      ruc: formData.get('ruc') as string,
      direccion: formData.get('direccion') as string,
      telefono: formData.get('telefono') as string,
      email: formData.get('email') as string,
      contacto: formData.get('contacto') as string,
      tipo: formData.get('tipo') as Proveedor['tipo'],
      categoria: formData.get('categoria') as Proveedor['categoria'],
      estado: 'activo',
      calificacion: 0,
      productosSuministrados: 0,
      ultimaCompra: '',
      montoTotalCompras: 0,
      plazoEntrega: parseInt(formData.get('plazoEntrega') as string),
      condicionesPago: formData.get('condicionesPago') as string,
      observaciones: formData.get('observaciones') as string || undefined,
      fechaRegistro: getCurrentTimestamp(),
      fechaActualizacion: getCurrentTimestamp(),
      creadoPor: sessionUser?.userId || '',
    };

    saveProveedorToStorage(nuevoProveedor);
    if (sessionUser) {
      logAuditoria(
        sessionUser.userId, 
        sessionUser.username, 
        'Crear proveedor', 
        'Proveedor', 
        nuevoProveedor.id, 
        undefined, 
        nuevoProveedor as unknown as Record<string, unknown>
      );
    }
    
    setShowNuevoProveedor(false);
    cargarDatos();
  };

  const actualizarProveedor = (formData: FormData) => {
    if (!proveedorSeleccionado) return;

    const updates: Partial<Proveedor> = {
      nombre: formData.get('nombre') as string,
      ruc: formData.get('ruc') as string,
      direccion: formData.get('direccion') as string,
      telefono: formData.get('telefono') as string,
      email: formData.get('email') as string,
      contacto: formData.get('contacto') as string,
      tipo: formData.get('tipo') as Proveedor['tipo'],
      categoria: formData.get('categoria') as Proveedor['categoria'],
      estado: formData.get('estado') as Proveedor['estado'],
      plazoEntrega: parseInt(formData.get('plazoEntrega') as string),
      condicionesPago: formData.get('condicionesPago') as string,
      observaciones: formData.get('observaciones') as string || undefined,
      fechaActualizacion: getCurrentTimestamp(),
    };

    updateProveedorInStorage(proveedorSeleccionado.id, updates);
    if (sessionUser) {
      logAuditoria(
        sessionUser.userId, 
        sessionUser.username, 
        'Actualizar proveedor', 
        'Proveedor', 
        proveedorSeleccionado.id, 
        proveedorSeleccionado as unknown as Record<string, unknown>, 
        updates as unknown as Record<string, unknown>
      );
    }
    
    setShowEditarProveedor(false);
    setProveedorSeleccionado(null);
    cargarDatos();
  };

  const eliminarProveedor = (proveedorId: string) => {
    if (confirm('¿Está seguro de eliminar este proveedor?')) {
      deleteProveedorFromStorage(proveedorId);
      if (sessionUser) {
        logAuditoria(
          sessionUser.userId, 
          sessionUser.username, 
          'Eliminar proveedor', 
          'Proveedor', 
          proveedorId, 
          undefined, 
          undefined
        );
      }
      cargarDatos();
    }
  };

  // Filtrar proveedores
  const proveedoresFiltrados = proveedores.filter(proveedor => {
    const cumpleBusqueda = filtroBusqueda === '' || 
      proveedor.nombre.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
      proveedor.ruc.includes(filtroBusqueda) ||
      proveedor.contacto.toLowerCase().includes(filtroBusqueda.toLowerCase());
    
    const cumpleEstado = filtroEstado === 'todos' || proveedor.estado === filtroEstado;
    const cumpleTipo = filtroTipo === 'todos' || proveedor.tipo === filtroTipo;
    const cumpleCategoria = filtroCategoria === 'todos' || proveedor.categoria === filtroCategoria;
    
    return cumpleBusqueda && cumpleEstado && cumpleTipo && cumpleCategoria;
  });

  // Estadísticas
  const estadisticas = {
    total: proveedores.length,
    activos: proveedores.filter(p => p.estado === 'activo').length,
    medicamentos: proveedores.filter(p => p.tipo === 'medicamentos').length,
    insumos: proveedores.filter(p => p.tipo === 'insumos').length,
    equipos: proveedores.filter(p => p.tipo === 'equipos').length,
    servicios: proveedores.filter(p => p.tipo === 'servicios').length,
  };

  const getEstadoBadge = (estado: Proveedor['estado']) => {
    const configs = {
      activo: { variant: 'secondary' as const, className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
      inactivo: { variant: 'secondary' as const, className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' },
      suspendido: { variant: 'secondary' as const, className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
      evaluacion: { variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
    };
    
    const config = configs[estado];
    return (
      <Badge variant={config.variant} className={config.className}>
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </Badge>
    );
  };

  const getTipoIcon = (tipo: Proveedor['tipo']) => {
    switch (tipo) {
      case 'medicamentos': return <Package className="h-4 w-4" />;
      case 'insumos': return <ShoppingCart className="h-4 w-4" />;
      case 'equipos': return <Building2 className="h-4 w-4" />;
      case 'servicios': return <Truck className="h-4 w-4" />;
      case 'general': return <Building2 className="h-4 w-4" />;
      default: return <Building2 className="h-4 w-4" />;
    }
  };

  const renderCalificacion = (calificacion: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= calificacion 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
        <span className="text-sm text-muted-foreground ml-1">({calificacion})</span>
      </div>
    );
  };

  const columnas: Columna<Proveedor>[] = [
    {
      key: 'nombre',
      titulo: 'Proveedor',
      sortable: true,
      render: (proveedor: Proveedor) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            {getTipoIcon(proveedor.tipo)}
          </div>
          <div>
            <div className="font-medium text-foreground">{proveedor.nombre}</div>
            <div className="text-sm text-muted-foreground">RUC: {proveedor.ruc}</div>
            <div className="text-sm text-muted-foreground">{proveedor.contacto}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'tipo',
      titulo: 'Tipo',
      render: (proveedor: Proveedor) => (
        <div className="flex items-center gap-2">
          {getTipoIcon(proveedor.tipo)}
          <span className="capitalize">{proveedor.tipo}</span>
        </div>
      ),
    },
    {
      key: 'categoria',
      titulo: 'Categoría',
      render: (proveedor: Proveedor) => (
        <Badge variant="outline" className="capitalize">
          {proveedor.categoria}
        </Badge>
      ),
    },
    {
      key: 'calificacion',
      titulo: 'Calificación',
      render: (proveedor: Proveedor) => renderCalificacion(proveedor.calificacion),
    },
    {
      key: 'estado',
      titulo: 'Estado',
      render: (proveedor: Proveedor) => getEstadoBadge(proveedor.estado),
    },
    {
      key: 'productosSuministrados',
      titulo: 'Productos',
      sortable: true,
      render: (proveedor: Proveedor) => (
        <div className="text-center">
          <div className="font-medium text-foreground">{proveedor.productosSuministrados}</div>
          <div className="text-xs text-muted-foreground">productos</div>
        </div>
      ),
    },
    {
      key: 'ultimaCompra',
      titulo: 'Última Compra',
      sortable: true,
      render: (proveedor: Proveedor) => (
        <div className="text-sm">
          {proveedor.ultimaCompra ? (
            <>
              <div className="text-foreground">
                {new Date(proveedor.ultimaCompra).toLocaleDateString('es-PE')}
              </div>
              <div className="text-muted-foreground">
                S/ {proveedor.montoTotalCompras.toLocaleString()}
              </div>
            </>
          ) : (
            <span className="text-muted-foreground">Sin compras</span>
          )}
        </div>
      ),
    },
    {
      key: 'acciones',
      titulo: 'Acciones',
      render: (proveedor: Proveedor) => (
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setProveedorSeleccionado(proveedor);
              setShowEditarProveedor(true);
            }}
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => eliminarProveedor(proveedor.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      ),
    },
  ];

  if (!sessionUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Proveedores</h1>
          <p className="text-muted-foreground">Administración de proveedores de medicamentos, insumos y equipos médicos</p>
        </div>
        <Button onClick={() => setShowNuevoProveedor(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Proveedor
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">{estadisticas.total}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{estadisticas.activos}</p>
                <p className="text-sm text-muted-foreground">Activos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{estadisticas.medicamentos}</p>
                <p className="text-sm text-muted-foreground">Medicamentos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{estadisticas.insumos}</p>
                <p className="text-sm text-muted-foreground">Insumos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{estadisticas.equipos}</p>
                <p className="text-sm text-muted-foreground">Equipos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-teal-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{estadisticas.servicios}</p>
                <p className="text-sm text-muted-foreground">Servicios</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros de Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="busqueda">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="busqueda"
                  placeholder="Nombre, RUC o contacto..."
                  value={filtroBusqueda}
                  onChange={(e) => setFiltroBusqueda(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="estado">Estado</Label>
              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                  <SelectItem value="suspendido">Suspendido</SelectItem>
                  <SelectItem value="evaluacion">En Evaluación</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="tipo">Tipo</Label>
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los tipos</SelectItem>
                  <SelectItem value="medicamentos">Medicamentos</SelectItem>
                  <SelectItem value="insumos">Insumos</SelectItem>
                  <SelectItem value="equipos">Equipos</SelectItem>
                  <SelectItem value="servicios">Servicios</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="categoria">Categoría</Label>
              <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas las categorías</SelectItem>
                  <SelectItem value="nacional">Nacional</SelectItem>
                  <SelectItem value="internacional">Internacional</SelectItem>
                  <SelectItem value="distribuidor">Distribuidor</SelectItem>
                  <SelectItem value="fabricante">Fabricante</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Proveedores */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Proveedores</CardTitle>
          <CardDescription>
            {proveedoresFiltrados.length} de {proveedores.length} proveedores encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={proveedoresFiltrados as unknown as Record<string, unknown>[]}
            columnas={columnas as unknown as Columna<Record<string, unknown>>[]}
            itemsPorPagina={10}
            keyExtractor={(proveedor: Record<string, unknown>) => proveedor.id as string}
          />
        </CardContent>
      </Card>

      {/* Modal Nuevo Proveedor */}
      {showNuevoProveedor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Crear Nuevo Proveedor</CardTitle>
              <CardDescription>Registrar un nuevo proveedor en el sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); crearNuevoProveedor(new FormData(e.currentTarget)); }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nombre">Nombre de la Empresa</Label>
                    <Input id="nombre" name="nombre" required />
                  </div>
                  <div>
                    <Label htmlFor="ruc">RUC</Label>
                    <Input id="ruc" name="ruc" required />
                  </div>
                  <div>
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input id="telefono" name="telefono" required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                  <div>
                    <Label htmlFor="contacto">Persona de Contacto</Label>
                    <Input id="contacto" name="contacto" required />
                  </div>
                  <div>
                    <Label htmlFor="tipo">Tipo de Proveedor</Label>
                    <Select name="tipo" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="medicamentos">Medicamentos</SelectItem>
                        <SelectItem value="insumos">Insumos</SelectItem>
                        <SelectItem value="equipos">Equipos</SelectItem>
                        <SelectItem value="servicios">Servicios</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="categoria">Categoría</Label>
                    <Select name="categoria" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nacional">Nacional</SelectItem>
                        <SelectItem value="internacional">Internacional</SelectItem>
                        <SelectItem value="distribuidor">Distribuidor</SelectItem>
                        <SelectItem value="fabricante">Fabricante</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="plazoEntrega">Plazo de Entrega (días)</Label>
                    <Input id="plazoEntrega" name="plazoEntrega" type="number" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="direccion">Dirección</Label>
                  <Textarea id="direccion" name="direccion" required />
                </div>
                <div>
                  <Label htmlFor="condicionesPago">Condiciones de Pago</Label>
                  <Input id="condicionesPago" name="condicionesPago" required />
                </div>
                <div>
                  <Label htmlFor="observaciones">Observaciones</Label>
                  <Textarea id="observaciones" name="observaciones" placeholder="Información adicional sobre el proveedor..." />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setShowNuevoProveedor(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Crear Proveedor
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal Editar Proveedor */}
      {showEditarProveedor && proveedorSeleccionado && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Editar Proveedor</CardTitle>
              <CardDescription>
                Modificar información de: {proveedorSeleccionado.nombre}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); actualizarProveedor(new FormData(e.currentTarget)); }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nombre">Nombre de la Empresa</Label>
                    <Input id="nombre" name="nombre" defaultValue={proveedorSeleccionado.nombre} required />
                  </div>
                  <div>
                    <Label htmlFor="ruc">RUC</Label>
                    <Input id="ruc" name="ruc" defaultValue={proveedorSeleccionado.ruc} required />
                  </div>
                  <div>
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input id="telefono" name="telefono" defaultValue={proveedorSeleccionado.telefono} required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" defaultValue={proveedorSeleccionado.email} required />
                  </div>
                  <div>
                    <Label htmlFor="contacto">Persona de Contacto</Label>
                    <Input id="contacto" name="contacto" defaultValue={proveedorSeleccionado.contacto} required />
                  </div>
                  <div>
                    <Label htmlFor="tipo">Tipo de Proveedor</Label>
                    <Select name="tipo" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="medicamentos">Medicamentos</SelectItem>
                        <SelectItem value="insumos">Insumos</SelectItem>
                        <SelectItem value="equipos">Equipos</SelectItem>
                        <SelectItem value="servicios">Servicios</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="categoria">Categoría</Label>
                    <Select name="categoria" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nacional">Nacional</SelectItem>
                        <SelectItem value="internacional">Internacional</SelectItem>
                        <SelectItem value="distribuidor">Distribuidor</SelectItem>
                        <SelectItem value="fabricante">Fabricante</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="estado">Estado</Label>
                    <Select name="estado" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="activo">Activo</SelectItem>
                        <SelectItem value="inactivo">Inactivo</SelectItem>
                        <SelectItem value="suspendido">Suspendido</SelectItem>
                        <SelectItem value="evaluacion">En Evaluación</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="plazoEntrega">Plazo de Entrega (días)</Label>
                    <Input id="plazoEntrega" name="plazoEntrega" type="number" defaultValue={proveedorSeleccionado.plazoEntrega} required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="direccion">Dirección</Label>
                  <Textarea id="direccion" name="direccion" defaultValue={proveedorSeleccionado.direccion} required />
                </div>
                <div>
                  <Label htmlFor="condicionesPago">Condiciones de Pago</Label>
                  <Input id="condicionesPago" name="condicionesPago" defaultValue={proveedorSeleccionado.condicionesPago} required />
                </div>
                <div>
                  <Label htmlFor="observaciones">Observaciones</Label>
                  <Textarea id="observaciones" name="observaciones" defaultValue={proveedorSeleccionado.observaciones || ''} placeholder="Información adicional sobre el proveedor..." />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => {
                    setShowEditarProveedor(false);
                    setProveedorSeleccionado(null);
                  }}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Actualizar Proveedor
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
