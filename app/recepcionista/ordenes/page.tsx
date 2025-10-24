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
  ordenesStorage, pacientesStorage, doctoresStorage,
  generateId, getCurrentTimestamp, logAuditoria
} from '@/lib/storage';
import { Orden, Paciente } from '@/lib/types';
import { 
  FileText, Plus, Search, Filter, Eye, Edit, Trash2, CheckCircle, 
  XCircle, Clock, DollarSign, Package, Stethoscope, RefreshCw,
  User, Calendar, AlertTriangle, ShoppingCart, FlaskConical, Pill
} from 'lucide-react';

export default function OrdenesPage() {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [doctores, setDoctores] = useState<{ id: string; nombres: string; apellidos: string }[]>([]);
  
  // Estados para filtros
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroBusqueda, setFiltroBusqueda] = useState<string>('');
  
  // Estados para formularios
  const [showNuevaOrden, setShowNuevaOrden] = useState(false);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<Orden | null>(null);
  const [showDetalleOrden, setShowDetalleOrden] = useState(false);
  const [showEditarOrden, setShowEditarOrden] = useState(false);
  
  const [sessionUser, setSessionUser] = useState<{ userId: string; username: string } | null>(null);

  useEffect(() => {
    const session = getSession();
    setSessionUser(session);
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    setOrdenes(ordenesStorage.getAll());
    setPacientes(pacientesStorage.getAll());
    setDoctores(doctoresStorage.find(d => d.activo));
  };

  const crearNuevaOrden = (formData: FormData) => {
    const pacienteId = formData.get('pacienteId') as string;
    const tipo = formData.get('tipo') as 'examen' | 'medicamento' | 'procedimiento';
    const descripcion = formData.get('descripcion') as string;
    const cantidad = parseInt(formData.get('cantidad') as string || '1');
    const precio = parseFloat(formData.get('precio') as string || '0');

    const nuevaOrden: Orden = {
      id: generateId('orden'),
      pacienteId,
      tipo,
      descripcion,
      cantidad,
      precio,
      estado: 'pendiente',
      fechaCreacion: getCurrentTimestamp(),
    };

    ordenesStorage.create(nuevaOrden);
    if (sessionUser) {
      logAuditoria(sessionUser.userId, sessionUser.username, 'Crear orden', 'Orden', nuevaOrden.id, undefined, nuevaOrden as unknown as Record<string, unknown>);
    }
    
    alert('✅ Orden creada exitosamente');
    setShowNuevaOrden(false);
    cargarDatos();
  };

  const actualizarEstadoOrden = (ordenId: string, nuevoEstado: 'procesada' | 'entregada') => {
    ordenesStorage.update(ordenId, { estado: nuevoEstado });
    if (sessionUser) {
      logAuditoria(sessionUser.userId, sessionUser.username, `Actualizar estado orden a ${nuevoEstado}`, 'Orden', ordenId, undefined, { estado: nuevoEstado });
    }
    cargarDatos();
  };

  const eliminarOrden = (ordenId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta orden?')) {
      ordenesStorage.delete(ordenId);
      if (sessionUser) {
        logAuditoria(sessionUser.userId, sessionUser.username, 'Eliminar orden', 'Orden', ordenId, undefined, undefined);
      }
      cargarDatos();
    }
  };

  // Filtrar órdenes
  const ordenesFiltradas = ordenes.filter(orden => {
    const cumpleEstado = filtroEstado === 'todos' || orden.estado === filtroEstado;
    const cumpleTipo = filtroTipo === 'todos' || orden.tipo === filtroTipo;
    
    if (!cumpleEstado || !cumpleTipo) return false;
    
    if (filtroBusqueda) {
      const paciente = pacientes.find(p => p.id === orden.pacienteId);
      
      const textoBusqueda = filtroBusqueda.toLowerCase();
      return (
        paciente?.nombres.toLowerCase().includes(textoBusqueda) ||
        paciente?.apellidos.toLowerCase().includes(textoBusqueda) ||
        orden.descripcion.toLowerCase().includes(textoBusqueda)
      );
    }
    
    return true;
  });

  // Estadísticas
  const estadisticas = {
    total: ordenes.length,
    pendientes: ordenes.filter(o => o.estado === 'pendiente').length,
    procesadas: ordenes.filter(o => o.estado === 'procesada').length,
    entregadas: ordenes.filter(o => o.estado === 'entregada').length,
    examenes: ordenes.filter(o => o.tipo === 'examen').length,
    medicamentos: ordenes.filter(o => o.tipo === 'medicamento').length,
    procedimientos: ordenes.filter(o => o.tipo === 'procedimiento').length,
  };

  const columnas: Columna<Orden>[] = [
    {
      key: 'fechaCreacion',
      titulo: 'Fecha',
      sortable: true,
      width: '120px',
      render: (orden: Orden) => (
        <div className="text-sm">
          <div className="font-medium">
            {new Date(orden.fechaCreacion).toLocaleDateString('es-PE')}
          </div>
          <div className="text-xs text-muted-foreground">
            {new Date(orden.fechaCreacion).toLocaleTimeString('es-PE', { 
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
      render: (orden: Orden) => {
        const paciente = pacientes.find(p => p.id === orden.pacienteId);
        return (
          <div>
            <div className="font-medium">{paciente ? `${paciente.nombres} ${paciente.apellidos}` : 'N/A'}</div>
            <div className="text-xs text-muted-foreground">{paciente?.documento || 'N/A'}</div>
          </div>
        );
      },
    },
    {
      key: 'cantidad',
      titulo: 'Cantidad',
      render: (orden: Orden) => orden.cantidad,
    },
    {
      key: 'tipo',
      titulo: 'Tipo',
      render: (orden: Orden) => {
        const iconos: Record<string, React.ReactNode> = {
          examen: <FlaskConical className="h-4 w-4" />,
          medicamento: <Pill className="h-4 w-4" />,
          procedimiento: <Stethoscope className="h-4 w-4" />,
        };
        const colores: Record<string, string> = {
          examen: 'bg-blue-100 text-blue-800',
          medicamento: 'bg-green-100 text-green-800',
          procedimiento: 'bg-purple-100 text-purple-800',
        };
        return (
          <div className="flex items-center gap-2">
            {iconos[orden.tipo]}
            <Badge className={colores[orden.tipo]}>
              {orden.tipo.charAt(0).toUpperCase() + orden.tipo.slice(1)}
            </Badge>
          </div>
        );
      },
    },
    {
      key: 'descripcion',
      titulo: 'Descripción',
      render: (orden: Orden) => (
        <div className="max-w-xs">
          <p className="text-sm truncate" title={orden.descripcion}>
            {orden.descripcion}
          </p>
        </div>
      ),
    },
    {
      key: 'precio',
      titulo: 'Precio',
      render: (orden: Orden) => `S/ ${orden.precio}`,
    },
    {
      key: 'estado',
      titulo: 'Estado',
      render: (orden: Orden) => {
        const colores: Record<string, string> = {
          pendiente: 'bg-orange-100 text-orange-800',
          procesada: 'bg-blue-100 text-blue-800',
          entregada: 'bg-green-100 text-green-800',
        };
        return <Badge className={colores[orden.estado]}>{orden.estado.replace('_', ' ')}</Badge>;
      },
    },
    {
      key: 'acciones',
      titulo: 'Acciones',
      render: (orden: Orden) => (
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setOrdenSeleccionada(orden);
              setShowDetalleOrden(true);
            }}
          >
            <Eye className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setOrdenSeleccionada(orden);
              setShowEditarOrden(true);
            }}
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => eliminarOrden(orden.id)}
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
          <h1 className="text-3xl font-bold text-foreground">Órdenes Médicas</h1>
          <p className="text-muted-foreground">
            Gestión de órdenes de exámenes, medicamentos y procedimientos
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
          <Button onClick={() => setShowNuevaOrden(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Orden
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{estadisticas.total}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
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
                <p className="text-sm text-muted-foreground">Procesadas</p>
                <p className="text-2xl font-bold text-blue-600">{estadisticas.procesadas}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-blue-600" />
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
              <CheckCircle className="h-8 w-8 text-green-600" />
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
                <p className="text-sm text-muted-foreground">Procedimientos</p>
                <p className="text-2xl font-bold text-purple-600">{estadisticas.procedimientos}</p>
              </div>
              <Stethoscope className="h-8 w-8 text-purple-600" />
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
                  <SelectItem value="procesada">Procesadas</SelectItem>
                  <SelectItem value="entregada">Entregadas</SelectItem>
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
                  <SelectItem value="examen">Exámenes</SelectItem>
                  <SelectItem value="medicamento">Medicamentos</SelectItem>
                  <SelectItem value="procedimiento">Procedimientos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por paciente, doctor o descripción..."
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

      {/* Tabla de Órdenes */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Órdenes</CardTitle>
          <CardDescription>
            {ordenesFiltradas.length} orden{ordenesFiltradas.length !== 1 ? 'es' : ''} encontrada{ordenesFiltradas.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={ordenesFiltradas as unknown as Record<string, unknown>[]}
            columnas={columnas as unknown as Columna<Record<string, unknown>>[]}
            itemsPorPagina={15}
            keyExtractor={(orden: Record<string, unknown>) => orden.id as string}
          />
        </CardContent>
      </Card>

      {/* Modal Nueva Orden */}
      {showNuevaOrden && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Crear Nueva Orden</CardTitle>
              <CardDescription>Registrar una nueva orden médica</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); crearNuevaOrden(new FormData(e.currentTarget)); }} className="space-y-4">
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
                    <Label>Cantidad</Label>
                    <Input name="cantidad" type="number" defaultValue="1" min="1" required />
                  </div>
                  <div>
                    <Label>Tipo de Orden</Label>
                    <Select name="tipo" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="examen">Examen</SelectItem>
                        <SelectItem value="medicamento">Medicamento</SelectItem>
                        <SelectItem value="procedimiento">Procedimiento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Precio (S/)</Label>
                    <Input name="precio" type="number" step="0.01" min="0" required />
                  </div>
                </div>
                <div>
                  <Label>Descripción</Label>
                  <Textarea 
                    name="descripcion" 
                    placeholder="Descripción detallada de la orden..."
                    required 
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setShowNuevaOrden(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Crear Orden</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal Detalle Orden */}
      {showDetalleOrden && ordenSeleccionada && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Detalle de Orden</CardTitle>
              <CardDescription>Información completa de la orden médica</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">ID</Label>
                  <p className="text-sm text-muted-foreground">{ordenSeleccionada.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Estado</Label>
                  <div className="mt-1">
                    <Badge className={
                      ordenSeleccionada.estado === 'pendiente' ? 'bg-orange-100 text-orange-800' :
                      ordenSeleccionada.estado === 'procesada' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }>
                      {ordenSeleccionada.estado.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Paciente</Label>
                  <p className="text-sm text-muted-foreground">
                    {(() => {
                      const paciente = pacientes.find(p => p.id === ordenSeleccionada.pacienteId);
                      return paciente ? `${paciente.nombres} ${paciente.apellidos}` : 'N/A';
                    })()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Cantidad</Label>
                  <p className="text-sm text-muted-foreground">{ordenSeleccionada.cantidad}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Tipo</Label>
                  <div className="mt-1">
                    <Badge className={
                      ordenSeleccionada.tipo === 'examen' ? 'bg-blue-100 text-blue-800' :
                      ordenSeleccionada.tipo === 'medicamento' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }>
                      {ordenSeleccionada.tipo.charAt(0).toUpperCase() + ordenSeleccionada.tipo.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Precio</Label>
                  <p className="text-sm text-muted-foreground font-semibold">S/ {ordenSeleccionada.precio}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Fecha de Creación</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(ordenSeleccionada.fechaCreacion).toLocaleString('es-PE')}
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Descripción</Label>
                <p className="text-sm text-muted-foreground mt-1 p-3 bg-accent/50 rounded-lg">
                  {ordenSeleccionada.descripcion}
                </p>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowDetalleOrden(false)}>
                  Cerrar
                </Button>
                {ordenSeleccionada.estado === 'pendiente' && (
                  <>
                    <Button onClick={() => actualizarEstadoOrden(ordenSeleccionada.id, 'procesada')}>
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Procesar
                    </Button>
                    <Button onClick={() => actualizarEstadoOrden(ordenSeleccionada.id, 'entregada')}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Entregar
                    </Button>
                  </>
                )}
                {ordenSeleccionada.estado === 'procesada' && (
                  <Button onClick={() => actualizarEstadoOrden(ordenSeleccionada.id, 'entregada')}>
                    <CheckCircle className="h-4 w-4 mr-2" />
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
