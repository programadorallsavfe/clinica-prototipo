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
  leadsStorage, especialidadesStorage, doctoresStorage,
  generateId, getCurrentTimestamp, logAuditoria
} from '@/lib/storage';
import { Lead, Cotizacion } from '@/lib/types';
import { 
  Users, Plus, Search, Filter, Phone, Mail, Calendar, 
  MessageSquare, Globe, User, Clock, CheckCircle, XCircle,
  Eye, Edit, Trash2, FileText, ArrowRight
} from 'lucide-react';

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [especialidades, setEspecialidades] = useState<{ id: string; nombre: string; precioBase: number }[]>([]);
  const [doctores, setDoctores] = useState<{ id: string; nombres: string; apellidos: string }[]>([]);
  const [sessionUser, setSessionUser] = useState<{ userId: string; username: string } | null>(null);
  
  // Estados de formularios
  const [showNuevoLead, setShowNuevoLead] = useState(false);
  const [showNuevaCotizacion, setShowNuevaCotizacion] = useState(false);
  const [leadSeleccionado, setLeadSeleccionado] = useState<Lead | null>(null);
  
  // Estados de filtros
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [filtroCanal, setFiltroCanal] = useState<string>('todos');

  useEffect(() => {
    const session = getSession();
    setSessionUser(session);
    cargarDatos();
    inicializarDatosMock();
  }, []);

  const inicializarDatosMock = () => {
    // Verificar si ya hay datos para no duplicar
    const leadsExistentes = leadsStorage.getAll();
    if (leadsExistentes.length === 0) {
      const leadsMock: Lead[] = [
        {
          id: generateId('lead'),
          nombre: 'María González Pérez',
          telefono: '987654321',
          email: 'maria.gonzalez@email.com',
          canal: 'whatsapp',
          motivo: 'Consulta por dolor de cabeza frecuente y mareos',
          estado: 'nuevo',
          fechaCreacion: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          creadoPor: sessionUser?.userId || 'system',
        },
        {
          id: generateId('lead'),
          nombre: 'Carlos Rodríguez Silva',
          telefono: '912345678',
          email: 'carlos.rodriguez@email.com',
          canal: 'web',
          motivo: 'Interesado en consulta de cardiología preventiva',
          estado: 'contactado',
          fechaCreacion: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          creadoPor: sessionUser?.userId || 'system',
        },
        {
          id: generateId('lead'),
          nombre: 'Ana Martínez López',
          telefono: '998877665',
          canal: 'telefono',
          motivo: 'Consulta dermatológica por manchas en la piel',
          estado: 'cotizado',
          fechaCreacion: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          creadoPor: sessionUser?.userId || 'system',
        },
        {
          id: generateId('lead'),
          nombre: 'Luis Fernández Torres',
          telefono: '955443322',
          email: 'luis.fernandez@email.com',
          canal: 'presencial',
          motivo: 'Consulta pediátrica para mi hijo de 5 años',
          estado: 'convertido',
          fechaCreacion: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          creadoPor: sessionUser?.userId || 'system',
        },
        {
          id: generateId('lead'),
          nombre: 'Sofia Herrera Jiménez',
          telefono: '944332211',
          email: 'sofia.herrera@email.com',
          canal: 'whatsapp',
          motivo: 'Consulta ginecológica de rutina y planificación familiar',
          estado: 'nuevo',
          fechaCreacion: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          creadoPor: sessionUser?.userId || 'system',
        },
        {
          id: generateId('lead'),
          nombre: 'Roberto Vargas Castro',
          telefono: '933221100',
          canal: 'web',
          motivo: 'Consulta de medicina general por síntomas de gripe persistente',
          estado: 'contactado',
          fechaCreacion: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          creadoPor: sessionUser?.userId || 'system',
        },
        {
          id: generateId('lead'),
          nombre: 'Carmen Díaz Ruiz',
          telefono: '922110099',
          email: 'carmen.diaz@email.com',
          canal: 'telefono',
          motivo: 'Consulta oftalmológica por problemas de visión',
          estado: 'nuevo',
          fechaCreacion: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          creadoPor: sessionUser?.userId || 'system',
        },
        {
          id: generateId('lead'),
          nombre: 'Miguel Ángel Morales',
          telefono: '911009988',
          canal: 'whatsapp',
          motivo: 'Consulta de traumatología por lesión deportiva',
          estado: 'cotizado',
          fechaCreacion: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          creadoPor: sessionUser?.userId || 'system',
        },
        {
          id: generateId('lead'),
          nombre: 'Patricia Sánchez Vega',
          telefono: '900998877',
          email: 'patricia.sanchez@email.com',
          canal: 'presencial',
          motivo: 'Consulta de nutrición y control de peso',
          estado: 'contactado',
          fechaCreacion: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
          creadoPor: sessionUser?.userId || 'system',
        },
        {
          id: generateId('lead'),
          nombre: 'Diego Ramírez Flores',
          telefono: '899887766',
          canal: 'web',
          motivo: 'Consulta de urología por síntomas urinarios',
          estado: 'nuevo',
          fechaCreacion: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          creadoPor: sessionUser?.userId || 'system',
        }
      ];

      // Crear los leads mock
      leadsMock.forEach(lead => {
        leadsStorage.create(lead);
      });
    }
  };

  const cargarDatos = () => {
    setLeads(leadsStorage.getAll());
    setEspecialidades(especialidadesStorage.find(e => e.activo));
    setDoctores(doctoresStorage.find(d => d.activo));
  };

  const crearNuevoLead = (formData: FormData) => {
    const nuevoLead: Lead = {
      id: generateId('lead'),
      nombre: formData.get('nombre') as string,
      telefono: formData.get('telefono') as string,
      email: formData.get('email') as string || undefined,
      canal: formData.get('canal') as 'web' | 'whatsapp' | 'telefono' | 'presencial',
      motivo: formData.get('motivo') as string,
      estado: 'nuevo',
      fechaCreacion: getCurrentTimestamp(),
      creadoPor: sessionUser?.userId || '',
    };

    leadsStorage.create(nuevoLead);
    if (sessionUser) {
      logAuditoria(
        sessionUser.userId, 
        sessionUser.username, 
        'Crear lead', 
        'Lead', 
        nuevoLead.id, 
        undefined, 
        nuevoLead as unknown as Record<string, unknown>
      );
    }
    
    setShowNuevoLead(false);
    cargarDatos();
  };

  const crearNuevaCotizacion = (formData: FormData) => {
    if (!leadSeleccionado) return;

    const fechaCaducidad = new Date();
    fechaCaducidad.setDate(fechaCaducidad.getDate() + 7);

    const nuevaCotizacion: Cotizacion = {
      id: generateId('cot'),
      leadId: leadSeleccionado.id,
      especialidadId: formData.get('especialidadId') as string,
      doctorId: formData.get('doctorId') as string,
      fechaPropuesta: formData.get('fechaPropuesta') as string,
      horaPropuesta: formData.get('horaPropuesta') as string,
      precio: parseFloat(formData.get('precio') as string),
      estado: 'enviada',
      comentarios: formData.get('comentarios') as string || undefined,
      fechaCaducidad: fechaCaducidad.toISOString(),
      fechaCreacion: getCurrentTimestamp(),
      creadoPor: sessionUser?.userId || '',
      fechaEnvio: getCurrentTimestamp(),
    };

    // Actualizar estado del lead a 'cotizado'
    leadsStorage.update(leadSeleccionado.id, { estado: 'cotizado' });
    
    if (sessionUser) {
      logAuditoria(
        sessionUser.userId, 
        sessionUser.username, 
        'Crear cotización', 
        'Cotizacion', 
        nuevaCotizacion.id, 
        undefined, 
        nuevaCotizacion as unknown as Record<string, unknown>
      );
    }
    
    alert('Cotización creada exitosamente. En producción se enviaría por WhatsApp.');
    setShowNuevaCotizacion(false);
    setLeadSeleccionado(null);
    cargarDatos();
  };

  const actualizarEstadoLead = (leadId: string, nuevoEstado: Lead['estado']) => {
    leadsStorage.update(leadId, { estado: nuevoEstado });
    if (sessionUser) {
      const lead = leadsStorage.getById(leadId);
      logAuditoria(
        sessionUser.userId, 
        sessionUser.username, 
        'Actualizar estado lead', 
        'Lead', 
        leadId, 
        { estado: lead?.estado }, 
        { estado: nuevoEstado }
      );
    }
    cargarDatos();
  };

  const eliminarLead = (leadId: string) => {
    if (confirm('¿Está seguro de eliminar este lead?')) {
      leadsStorage.delete(leadId);
      if (sessionUser) {
        logAuditoria(
          sessionUser.userId, 
          sessionUser.username, 
          'Eliminar lead', 
          'Lead', 
          leadId, 
          undefined, 
          undefined
        );
      }
      cargarDatos();
    }
  };

  // Filtrar leads
  const leadsFiltrados = leads.filter(lead => {
    const cumpleBusqueda = filtroBusqueda === '' || 
      lead.nombre.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
      lead.telefono.includes(filtroBusqueda) ||
      (lead.email && lead.email.toLowerCase().includes(filtroBusqueda.toLowerCase()));
    
    const cumpleEstado = filtroEstado === 'todos' || lead.estado === filtroEstado;
    const cumpleCanal = filtroCanal === 'todos' || lead.canal === filtroCanal;
    
    return cumpleBusqueda && cumpleEstado && cumpleCanal;
  });

  // Estadísticas
  const estadisticas = {
    total: leads.length,
    nuevos: leads.filter(l => l.estado === 'nuevo').length,
    contactados: leads.filter(l => l.estado === 'contactado').length,
    cotizados: leads.filter(l => l.estado === 'cotizado').length,
    convertidos: leads.filter(l => l.estado === 'convertido').length,
  };

  const getCanalIcon = (canal: Lead['canal']) => {
    switch (canal) {
      case 'whatsapp': return <MessageSquare className="h-4 w-4" />;
      case 'web': return <Globe className="h-4 w-4" />;
      case 'telefono': return <Phone className="h-4 w-4" />;
      case 'presencial': return <User className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getEstadoBadge = (estado: Lead['estado']) => {
    const configs = {
      nuevo: { variant: 'secondary' as const, className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
      contactado: { variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
      cotizado: { variant: 'secondary' as const, className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' },
      convertido: { variant: 'secondary' as const, className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
    };
    
    const config = configs[estado];
    return (
      <Badge variant={config.variant} className={config.className}>
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </Badge>
    );
  };

  const columnas: Columna<Lead>[] = [
    {
      key: 'nombre',
      titulo: 'Nombre',
      sortable: true,
      render: (lead: Lead) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="font-medium text-foreground">{lead.nombre}</div>
            <div className="text-sm text-muted-foreground">{lead.telefono}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'canal',
      titulo: 'Canal',
      render: (lead: Lead) => (
        <div className="flex items-center gap-2">
          {getCanalIcon(lead.canal)}
          <span className="capitalize">{lead.canal}</span>
        </div>
      ),
    },
    {
      key: 'motivo',
      titulo: 'Motivo',
      render: (lead: Lead) => (
        <div className="max-w-xs">
          <p className="text-sm text-foreground truncate" title={lead.motivo}>
            {lead.motivo}
          </p>
        </div>
      ),
    },
    {
      key: 'estado',
      titulo: 'Estado',
      render: (lead: Lead) => getEstadoBadge(lead.estado),
    },
    {
      key: 'fechaCreacion',
      titulo: 'Fecha',
      sortable: true,
      render: (lead: Lead) => (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {new Date(lead.fechaCreacion).toLocaleDateString('es-PE')}
        </div>
      ),
    },
    {
      key: 'acciones',
      titulo: 'Acciones',
      render: (lead: Lead) => (
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setLeadSeleccionado(lead);
              setShowNuevaCotizacion(true);
            }}
            disabled={lead.estado === 'convertido'}
          >
            <FileText className="h-3 w-3 mr-1" />
            Cotizar
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => actualizarEstadoLead(lead.id, 'contactado')}
            disabled={lead.estado !== 'nuevo'}
          >
            <CheckCircle className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => eliminarLead(lead.id)}
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
          <h1 className="text-3xl font-bold text-foreground">Gestión de Leads</h1>
          <p className="text-muted-foreground">Administración de contactos externos y seguimiento de conversiones</p>
        </div>
        <Button onClick={() => setShowNuevoLead(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Lead
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">{estadisticas.total}</p>
                <p className="text-sm text-muted-foreground">Total Leads</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <div>
                <p className="text-2xl font-bold text-foreground">{estadisticas.nuevos}</p>
                <p className="text-sm text-muted-foreground">Nuevos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div>
                <p className="text-2xl font-bold text-foreground">{estadisticas.contactados}</p>
                <p className="text-sm text-muted-foreground">Contactados</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <div>
                <p className="text-2xl font-bold text-foreground">{estadisticas.cotizados}</p>
                <p className="text-sm text-muted-foreground">Cotizados</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div>
                <p className="text-2xl font-bold text-foreground">{estadisticas.convertidos}</p>
                <p className="text-sm text-muted-foreground">Convertidos</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="busqueda">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="busqueda"
                  placeholder="Nombre, teléfono o email..."
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
                  <SelectItem value="nuevo">Nuevo</SelectItem>
                  <SelectItem value="contactado">Contactado</SelectItem>
                  <SelectItem value="cotizado">Cotizado</SelectItem>
                  <SelectItem value="convertido">Convertido</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="canal">Canal</Label>
              <Select value={filtroCanal} onValueChange={setFiltroCanal}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar canal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los canales</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="web">Web</SelectItem>
                  <SelectItem value="telefono">Teléfono</SelectItem>
                  <SelectItem value="presencial">Presencial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Leads */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Leads</CardTitle>
          <CardDescription>
            {leadsFiltrados.length} de {leads.length} leads encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={leadsFiltrados as unknown as Record<string, unknown>[]}
            columnas={columnas as unknown as Columna<Record<string, unknown>>[]}
            itemsPorPagina={10}
            keyExtractor={(lead: Record<string, unknown>) => lead.id as string}
          />
        </CardContent>
      </Card>

      {/* Modal Nuevo Lead */}
      {showNuevoLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4">
            <CardHeader>
              <CardTitle>Crear Nuevo Lead</CardTitle>
              <CardDescription>Registrar un nuevo contacto externo</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); crearNuevoLead(new FormData(e.currentTarget)); }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nombre">Nombre Completo</Label>
                    <Input id="nombre" name="nombre" required />
                  </div>
                  <div>
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input id="telefono" name="telefono" required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email (Opcional)</Label>
                    <Input id="email" name="email" type="email" />
                  </div>
                  <div>
                    <Label htmlFor="canal">Canal de Contacto</Label>
                    <Select name="canal" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar canal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="web">Página Web</SelectItem>
                        <SelectItem value="telefono">Teléfono</SelectItem>
                        <SelectItem value="presencial">Presencial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="motivo">Motivo de Consulta</Label>
                  <Textarea id="motivo" name="motivo" required placeholder="Describa el motivo de la consulta..." />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setShowNuevoLead(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Crear Lead
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal Nueva Cotización */}
      {showNuevaCotizacion && leadSeleccionado && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4">
            <CardHeader>
              <CardTitle>Crear Cotización</CardTitle>
              <CardDescription>
                Para: {leadSeleccionado.nombre} - {leadSeleccionado.telefono}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); crearNuevaCotizacion(new FormData(e.currentTarget)); }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="especialidadId">Especialidad</Label>
                    <Select name="especialidadId" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar especialidad" />
                      </SelectTrigger>
                      <SelectContent>
                        {especialidades.map(esp => (
                          <SelectItem key={esp.id} value={esp.id}>
                            {esp.nombre} - S/ {esp.precioBase}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="doctorId">Doctor</Label>
                    <Select name="doctorId" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        {doctores.map(doc => (
                          <SelectItem key={doc.id} value={doc.id}>
                            Dr. {doc.nombres} {doc.apellidos}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="fechaPropuesta">Fecha Propuesta</Label>
                    <Input id="fechaPropuesta" name="fechaPropuesta" type="date" required />
                  </div>
                  <div>
                    <Label htmlFor="horaPropuesta">Hora Propuesta</Label>
                    <Input id="horaPropuesta" name="horaPropuesta" type="time" required />
                  </div>
                  <div>
                    <Label htmlFor="precio">Precio (S/)</Label>
                    <Input id="precio" name="precio" type="number" step="0.01" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="comentarios">Comentarios Adicionales</Label>
                  <Textarea id="comentarios" name="comentarios" placeholder="Información adicional para la cotización..." />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => {
                    setShowNuevaCotizacion(false);
                    setLeadSeleccionado(null);
                  }}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Crear Cotización
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