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
  ventasAuxiliaresStorage, pacientesStorage, productosStorage,
  generateId, getCurrentTimestamp, logAuditoria
} from '@/lib/storage';
import { VentaAuxiliar, Paciente, Producto } from '@/lib/types';
import { 
  ShoppingCart, Plus, Search, Filter, Eye, Edit, Trash2, CheckCircle, 
  XCircle, Clock, DollarSign, Package, Stethoscope, RefreshCw,
  User, Calendar, AlertTriangle, FlaskConical, Pill, Receipt, TrendingUp
} from 'lucide-react';

export default function VentasAuxiliaresPage() {
  const [ventas, setVentas] = useState<VentaAuxiliar[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  
  // Estados para filtros
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroBusqueda, setFiltroBusqueda] = useState<string>('');
  
  // Estados para formularios
  const [showNuevaVenta, setShowNuevaVenta] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState<VentaAuxiliar | null>(null);
  const [showDetalleVenta, setShowDetalleVenta] = useState(false);
  const [showEditarVenta, setShowEditarVenta] = useState(false);
  
  const [sessionUser, setSessionUser] = useState<{ userId: string; username: string } | null>(null);

  useEffect(() => {
    const session = getSession();
    setSessionUser(session);
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    setVentas(ventasAuxiliaresStorage.getAll());
    setPacientes(pacientesStorage.getAll());
    setProductos(productosStorage.find((p: Producto) => p.activo));
  };

  const crearNuevaVenta = (formData: FormData) => {
    const pacienteId = formData.get('pacienteId') as string;
    const productoId = formData.get('productoId') as string;
    const cantidad = parseInt(formData.get('cantidad') as string || '1');
    const precioUnitario = parseFloat(formData.get('precioUnitario') as string);
    const descuento = parseFloat(formData.get('descuento') as string || '0');
    const observaciones = formData.get('observaciones') as string;

    const producto = productos.find(p => p.id === productoId);
    if (!producto) {
      alert('❌ Producto no encontrado');
      return;
    }

    const subtotal = cantidad * precioUnitario;
    const total = subtotal - descuento;

    const nuevaVenta: VentaAuxiliar = {
      id: generateId('venta'),
      pacienteId,
      productoId,
      cantidad,
      precioUnitario,
      descuento,
      total,
      estado: 'pendiente',
      tipo: producto.tipo,
      observaciones: observaciones || undefined,
      fechaCreacion: getCurrentTimestamp(),
      creadoPor: sessionUser?.userId || '',
    };

    ventasAuxiliaresStorage.create(nuevaVenta);
    if (sessionUser) {
      logAuditoria(sessionUser.userId, sessionUser.username, 'Crear venta auxiliar', 'VentaAuxiliar', nuevaVenta.id, undefined, nuevaVenta as unknown as Record<string, unknown>);
    }
    
    alert('✅ Venta registrada exitosamente');
    setShowNuevaVenta(false);
    cargarDatos();
  };

  const actualizarEstadoVenta = (ventaId: string, nuevoEstado: 'confirmada' | 'entregada' | 'cancelada') => {
    ventasAuxiliaresStorage.update(ventaId, { estado: nuevoEstado });
    if (sessionUser) {
      logAuditoria(sessionUser.userId, sessionUser.username, `Actualizar estado venta a ${nuevoEstado}`, 'VentaAuxiliar', ventaId, undefined, { estado: nuevoEstado });
    }
    cargarDatos();
  };

  const eliminarVenta = (ventaId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta venta?')) {
      ventasAuxiliaresStorage.delete(ventaId);
      if (sessionUser) {
        logAuditoria(sessionUser.userId, sessionUser.username, 'Eliminar venta auxiliar', 'VentaAuxiliar', ventaId, undefined, undefined);
      }
      cargarDatos();
    }
  };

  // Filtrar ventas
  const ventasFiltradas = ventas.filter(venta => {
    const cumpleEstado = filtroEstado === 'todos' || venta.estado === filtroEstado;
    const cumpleTipo = filtroTipo === 'todos' || venta.tipo === filtroTipo;
    
    if (!cumpleEstado || !cumpleTipo) return false;
    
    if (filtroBusqueda) {
      const paciente = pacientes.find(p => p.id === venta.pacienteId);
      const producto = productos.find(prod => prod.id === venta.productoId);
      
      const textoBusqueda = filtroBusqueda.toLowerCase();
      return (
        paciente?.nombres.toLowerCase().includes(textoBusqueda) ||
        paciente?.apellidos.toLowerCase().includes(textoBusqueda) ||
        producto?.nombre.toLowerCase().includes(textoBusqueda) ||
        producto?.descripcion?.toLowerCase().includes(textoBusqueda)
      );
    }
    
    return true;
  });

  // Estadísticas
  const estadisticas = {
    total: ventas.length,
    pendientes: ventas.filter(v => v.estado === 'pendiente').length,
    confirmadas: ventas.filter(v => v.estado === 'confirmada').length,
    entregadas: ventas.filter(v => v.estado === 'entregada').length,
    canceladas: ventas.filter(v => v.estado === 'cancelada').length,
    medicamentos: ventas.filter(v => v.tipo === 'medicamento').length,
    examenes: ventas.filter(v => v.tipo === 'examen').length,
    insumos: ventas.filter(v => v.tipo === 'insumo').length,
    totalVentas: ventas.reduce((sum, v) => sum + v.total, 0),
  };

  const columnas: Columna<VentaAuxiliar>[] = [
    {
      key: 'fechaCreacion',
      titulo: 'Fecha',
      sortable: true,
      width: '120px',
      render: (venta: VentaAuxiliar) => (
        <div className="text-sm">
          <div className="font-medium">
            {new Date(venta.fechaCreacion).toLocaleDateString('es-PE')}
          </div>
          <div className="text-xs text-muted-foreground">
            {new Date(venta.fechaCreacion).toLocaleTimeString('es-PE', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      ),
    },
    {
      key: 'paciente',
      titulo: 'Paciente',
      render: (venta: VentaAuxiliar) => {
        const paciente = pacientes.find(p => p.id === venta.pacienteId);
        return (
          <div>
            <div className="font-medium">{paciente ? `${paciente.nombres} ${paciente.apellidos}` : 'N/A'}</div>
            <div className="text-xs text-muted-foreground">{paciente?.documento || 'N/A'}</div>
          </div>
        );
      },
    },
    {
      key: 'producto',
      titulo: 'Producto',
      render: (venta: VentaAuxiliar) => {
        const producto = productos.find(p => p.id === venta.productoId);
        return (
          <div>
            <div className="font-medium">{producto?.nombre || 'N/A'}</div>
            <div className="text-xs text-muted-foreground">{producto?.descripcion || 'N/A'}</div>
          </div>
        );
      },
    },
    {
      key: 'tipo',
      titulo: 'Tipo',
      render: (venta: VentaAuxiliar) => {
        const iconos: Record<string, React.ReactNode> = {
          medicamento: <Pill className="h-4 w-4" />,
          examen: <FlaskConical className="h-4 w-4" />,
          insumo: <Package className="h-4 w-4" />,
        };
        const colores: Record<string, string> = {
          medicamento: 'bg-green-100 text-green-800',
          examen: 'bg-blue-100 text-blue-800',
          insumo: 'bg-purple-100 text-purple-800',
        };
        return (
          <div className="flex items-center gap-2">
            {iconos[venta.tipo]}
            <Badge className={colores[venta.tipo]}>
              {venta.tipo.charAt(0).toUpperCase() + venta.tipo.slice(1)}
            </Badge>
          </div>
        );
      },
    },
    {
      key: 'cantidad',
      titulo: 'Cantidad',
      render: (venta: VentaAuxiliar) => venta.cantidad,
    },
    {
      key: 'precio',
      titulo: 'Precio Unit.',
      render: (venta: VentaAuxiliar) => `S/ ${venta.precioUnitario}`,
    },
    {
      key: 'descuento',
      titulo: 'Descuento',
      render: (venta: VentaAuxiliar) => venta.descuento > 0 ? `S/ ${venta.descuento}` : '-',
    },
    {
      key: 'total',
      titulo: 'Total',
      render: (venta: VentaAuxiliar) => (
        <div className="font-semibold text-primary">S/ {venta.total}</div>
      ),
    },
    {
      key: 'estado',
      titulo: 'Estado',
      render: (venta: VentaAuxiliar) => {
        const colores: Record<string, string> = {
          pendiente: 'bg-orange-100 text-orange-800',
          confirmada: 'bg-blue-100 text-blue-800',
          entregada: 'bg-green-100 text-green-800',
          cancelada: 'bg-red-100 text-red-800',
        };
        return <Badge className={colores[venta.estado]}>{venta.estado}</Badge>;
      },
    },
    {
      key: 'acciones',
      titulo: 'Acciones',
      render: (venta: VentaAuxiliar) => (
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setVentaSeleccionada(venta);
              setShowDetalleVenta(true);
            }}
          >
            <Eye className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setVentaSeleccionada(venta);
              setShowEditarVenta(true);
            }}
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => eliminarVenta(venta.id)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      ),
    },
  ];

  if (!sessionUser) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Ventas Auxiliares</h1>
          <p className="text-muted-foreground">
            Gestión de ventas de medicamentos, exámenes e insumos médicos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              cargarDatos();
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button onClick={() => setShowNuevaVenta(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Venta
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-9 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Ventas</p>
                <p className="text-2xl font-bold">{estadisticas.total}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pendientes</p>
                <p className="text-2xl font-bold text-orange-600">{estadisticas.pendientes}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Confirmadas</p>
                <p className="text-2xl font-bold text-blue-600">{estadisticas.confirmadas}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Entregadas</p>
                <p className="text-2xl font-bold text-green-600">{estadisticas.entregadas}</p>
              </div>
              <Package className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Canceladas</p>
                <p className="text-2xl font-bold text-red-600">{estadisticas.canceladas}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Medicamentos</p>
                <p className="text-2xl font-bold text-green-600">{estadisticas.medicamentos}</p>
              </div>
              <Pill className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Exámenes</p>
                <p className="text-2xl font-bold text-blue-600">{estadisticas.examenes}</p>
              </div>
              <FlaskConical className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Insumos</p>
                <p className="text-2xl font-bold text-purple-600">{estadisticas.insumos}</p>
              </div>
              <Package className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total S/</p>
                <p className="text-2xl font-bold text-primary">{estadisticas.totalVentas.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Estado</Label>
              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="pendiente">Pendientes</SelectItem>
                  <SelectItem value="confirmada">Confirmadas</SelectItem>
                  <SelectItem value="entregada">Entregadas</SelectItem>
                  <SelectItem value="cancelada">Canceladas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tipo</Label>
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="medicamento">Medicamentos</SelectItem>
                  <SelectItem value="examen">Exámenes</SelectItem>
                  <SelectItem value="insumo">Insumos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por paciente o producto..."
                  value={filtroBusqueda}
                  onChange={(e) => setFiltroBusqueda(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setFiltroEstado('todos');
                  setFiltroTipo('todos');
                  setFiltroBusqueda('');
                }}
                className="w-full"
              >
                Limpiar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Ventas */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Ventas</CardTitle>
          <CardDescription>
            {ventasFiltradas.length} venta{ventasFiltradas.length !== 1 ? 's' : ''} encontrada{ventasFiltradas.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={ventasFiltradas as unknown as Record<string, unknown>[]}
            columnas={columnas as unknown as Columna<Record<string, unknown>>[]}
            itemsPorPagina={15}
            keyExtractor={(venta: Record<string, unknown>) => venta.id as string}
          />
        </CardContent>
      </Card>

      {/* Modal Nueva Venta */}
      {showNuevaVenta && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Registrar Nueva Venta</CardTitle>
              <CardDescription>Registrar una nueva venta de producto auxiliar</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); crearNuevaVenta(new FormData(e.currentTarget)); }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Paciente</Label>
                    <Select name="pacienteId" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar paciente" />
                      </SelectTrigger>
                      <SelectContent>
                        {pacientes.map(paciente => (
                          <SelectItem key={paciente.id} value={paciente.id}>
                            {paciente.nombres} {paciente.apellidos}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Producto</Label>
                    <Select name="productoId" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar producto" />
                      </SelectTrigger>
                      <SelectContent>
                        {productos.map(producto => (
                          <SelectItem key={producto.id} value={producto.id}>
                            {producto.nombre} - S/{producto.precioVenta}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Cantidad</Label>
                    <Input name="cantidad" type="number" defaultValue="1" min="1" required />
                  </div>
                  <div>
                    <Label>Precio Unitario (S/)</Label>
                    <Input name="precioUnitario" type="number" step="0.01" min="0" required />
                  </div>
                  <div>
                    <Label>Descuento (S/)</Label>
                    <Input name="descuento" type="number" step="0.01" min="0" defaultValue="0" />
                  </div>
                </div>
                <div>
                  <Label>Observaciones</Label>
                  <Textarea 
                    name="observaciones" 
                    placeholder="Observaciones adicionales (opcional)..."
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setShowNuevaVenta(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Registrar Venta</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal Detalle Venta */}
      {showDetalleVenta && ventaSeleccionada && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Detalle de Venta</CardTitle>
              <CardDescription>Información completa de la venta auxiliar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">ID</Label>
                  <p className="text-sm text-muted-foreground">{ventaSeleccionada.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Estado</Label>
                  <div className="mt-1">
                    <Badge className={
                      ventaSeleccionada.estado === 'pendiente' ? 'bg-orange-100 text-orange-800' :
                      ventaSeleccionada.estado === 'confirmada' ? 'bg-blue-100 text-blue-800' :
                      ventaSeleccionada.estado === 'entregada' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {ventaSeleccionada.estado}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Paciente</Label>
                  <p className="text-sm text-muted-foreground">
                    {(() => {
                      const paciente = pacientes.find(p => p.id === ventaSeleccionada.pacienteId);
                      return paciente ? `${paciente.nombres} ${paciente.apellidos}` : 'N/A';
                    })()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Producto</Label>
                  <p className="text-sm text-muted-foreground">
                    {(() => {
                      const producto = productos.find(p => p.id === ventaSeleccionada.productoId);
                      return producto?.nombre || 'N/A';
                    })()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Cantidad</Label>
                  <p className="text-sm text-muted-foreground">{ventaSeleccionada.cantidad}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Precio Unitario</Label>
                  <p className="text-sm text-muted-foreground">S/ {ventaSeleccionada.precioUnitario}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Descuento</Label>
                  <p className="text-sm text-muted-foreground">S/ {ventaSeleccionada.descuento}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Total</Label>
                  <p className="text-sm text-muted-foreground font-semibold text-primary">S/ {ventaSeleccionada.total}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Fecha de Creación</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(ventaSeleccionada.fechaCreacion).toLocaleString('es-PE')}
                  </p>
                </div>
              </div>
              {ventaSeleccionada.observaciones && (
                <div>
                  <Label className="text-sm font-medium">Observaciones</Label>
                  <p className="text-sm text-muted-foreground mt-1 p-3 bg-accent/50 rounded-lg">
                    {ventaSeleccionada.observaciones}
                  </p>
                </div>
              )}
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowDetalleVenta(false)}>
                  Cerrar
                </Button>
                {ventaSeleccionada.estado === 'pendiente' && (
                  <>
                    <Button onClick={() => actualizarEstadoVenta(ventaSeleccionada.id, 'confirmada')}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirmar
                    </Button>
                    <Button onClick={() => actualizarEstadoVenta(ventaSeleccionada.id, 'entregada')}>
                      <Package className="h-4 w-4 mr-2" />
                      Entregar
                    </Button>
                  </>
                )}
                {ventaSeleccionada.estado === 'confirmada' && (
                  <Button onClick={() => actualizarEstadoVenta(ventaSeleccionada.id, 'entregada')}>
                    <Package className="h-4 w-4 mr-2" />
                    Entregar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
