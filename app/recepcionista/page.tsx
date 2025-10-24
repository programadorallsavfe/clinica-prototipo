'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DataTable, Columna } from '@/components/data-table';
import { Cronometro } from '@/components/cronometro';
import { getSession, generarUsername, generarPasswordTemporal } from '@/lib/auth';
import { 
  leadsStorage, cotizacionesStorage, citasStorage, pacientesStorage, 
  usuariosStorage, doctoresStorage, especialidadesStorage, consultoriosStorage,
  generateId, getCurrentTimestamp, logAuditoria, forceInitializeMockData
} from '@/lib/storage';
import { validarDoubleBooking, validarDisponibilidadDoctor, calcularDuracionMinutos } from '@/lib/validations';
import { Lead, Cotizacion, Cita, Paciente, Usuario } from '@/lib/types';
import { Users, FileText, Calendar, Plus, Clock, Activity, RefreshCw } from 'lucide-react';

export default function RecepcionistaPage() {
  const [activeTab, setActiveTab] = useState('citas');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [cotizaciones, setCotizaciones] = useState<{ id: string; nombreCliente: string; especialidadNombre: string; doctorNombre: string; precio: number; estado: string }[]>([]);
  const [citas, setCitas] = useState<{ id: string; horaInicio: string; pacienteNombre: string; doctorNombre: string; especialidadNombre: string; estado: string; horaInicioReal?: string }[]>([]);
  const [especialidades, setEspecialidades] = useState<{ id: string; nombre: string; precioBase: number }[]>([]);
  const [doctores, setDoctores] = useState<{ id: string; nombres: string; apellidos: string }[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  
  // Formularios
  const [showNuevoLead, setShowNuevoLead] = useState(false);
  const [showNuevaCotizacion, setShowNuevaCotizacion] = useState(false);
  const [showNuevaCita, setShowNuevaCita] = useState(false);
  const [showNuevoPaciente, setShowNuevoPaciente] = useState(false);

  const [citaActiva, setCitaActiva] = useState<Cita | null>(null);
  const [sessionUser, setSessionUser] = useState<{ userId: string; username: string } | null>(null);

  useEffect(() => {
    const session = getSession();
    setSessionUser(session);
    cargarDatos();
  }, []);
  const cargarDatos = () => {
    setLeads(leadsStorage.getAll());
    setEspecialidades(especialidadesStorage.find(e => e.activo));
    setDoctores(doctoresStorage.find(d => d.activo));
    setPacientes(pacientesStorage.find(p => p.activo));

    // Cargar cotizaciones con datos relacionados
    const cots = cotizacionesStorage.getAll().map(cot => {
      const especialidad = especialidadesStorage.getById(cot.especialidadId);
      const doctor = doctoresStorage.getById(cot.doctorId);
      const paciente = cot.pacienteId ? pacientesStorage.getById(cot.pacienteId) : null;
      const lead = cot.leadId ? leadsStorage.getById(cot.leadId) : null;

      return {
        ...cot,
        especialidadNombre: especialidad?.nombre || 'N/A',
        doctorNombre: doctor ? `Dr. ${doctor.nombres} ${doctor.apellidos}` : 'N/A',
        nombreCliente: paciente ? `${paciente.nombres} ${paciente.apellidos}` : lead?.nombre || 'N/A',
      };
    });
    setCotizaciones(cots);

    // Cargar citas del día
    const hoy = new Date().toISOString().split('T')[0];
    const citasHoy = citasStorage.find(c => c.fecha === hoy).map(cita => {
      const paciente = pacientesStorage.getById(cita.pacienteId);
      const doctor = doctoresStorage.getById(cita.doctorId);
      const especialidad = especialidadesStorage.getById(cita.especialidadId);

      return {
        ...cita,
        pacienteNombre: paciente ? `${paciente.nombres} ${paciente.apellidos}` : 'N/A',
        doctorNombre: doctor ? `Dr. ${doctor.nombres} ${doctor.apellidos}` : 'N/A',
        especialidadNombre: especialidad?.nombre || 'N/A',
      };
    }).sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

    setCitas(citasHoy);
  };

  const crearNuevoPaciente = (formData: FormData) => {
    const nombres = formData.get('nombres') as string;
    const apellidos = formData.get('apellidos') as string;
    const documento = formData.get('documento') as string;
    const telefono = formData.get('telefono') as string;
    const email = formData.get('email') as string;

    // Crear usuario
    const username = generarUsername(nombres, apellidos);
    const password = generarPasswordTemporal();

    const nuevoUsuario: Usuario = {
      id: generateId('user'),
      username,
      password,
      rol: 'paciente',
      email,
      telefono,
      activo: true,
      fechaCreacion: getCurrentTimestamp(),
    };
    usuariosStorage.create(nuevoUsuario);

    // Crear paciente
    const nuevoPaciente: Paciente = {
      id: generateId('pac'),
      usuarioId: nuevoUsuario.id,
      nombres,
      apellidos,
      documento,
      telefono,
      email,
      preferenciaContacto: 'whatsapp',
      fechaRegistro: getCurrentTimestamp(),
      activo: true,
    };
    pacientesStorage.create(nuevoPaciente);

    if (sessionUser) {
      logAuditoria(
        sessionUser.userId,
        sessionUser.username,
      'Crear paciente',
      'Paciente',
      nuevoPaciente.id,
      undefined,
      nuevoPaciente as unknown as Record<string, unknown>
    );
    }

    alert(`✅ Paciente creado exitosamente!\n\n👤 Usuario: ${username}\n🔑 Contraseña: ${password}\n\n📱 Enviar por WhatsApp al: ${telefono}`);
    
    setShowNuevoPaciente(false);
    cargarDatos();
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
      logAuditoria(sessionUser.userId, sessionUser.username, 'Crear lead', 'Lead', nuevoLead.id, undefined, nuevoLead as unknown as Record<string, unknown>);
    }
    
    setShowNuevoLead(false);
    cargarDatos();
  };

  const crearNuevaCotizacion = (formData: FormData) => {
    const especialidadId = formData.get('especialidadId') as string;
    const doctorId = formData.get('doctorId') as string;
    const precio = parseFloat(formData.get('precio') as string);

    const fechaCaducidad = new Date();
    fechaCaducidad.setDate(fechaCaducidad.getDate() + 7); // Válida por 7 días

    const nuevaCotizacion: Cotizacion = {
      id: generateId('cot'),
      leadId: formData.get('leadId') as string || undefined,
      especialidadId,
      doctorId,
      fechaPropuesta: formData.get('fechaPropuesta') as string,
      horaPropuesta: formData.get('horaPropuesta') as string,
      precio,
      estado: 'enviada',
      comentarios: formData.get('comentarios') as string || undefined,
      fechaCaducidad: fechaCaducidad.toISOString(),
      fechaCreacion: getCurrentTimestamp(),
      creadoPor: sessionUser?.userId || '',
      fechaEnvio: getCurrentTimestamp(),
    };

    cotizacionesStorage.create(nuevaCotizacion);
    if (sessionUser) {
      logAuditoria(sessionUser.userId, sessionUser.username, 'Crear cotización', 'Cotizacion', nuevaCotizacion.id, undefined, nuevaCotizacion as unknown as Record<string, unknown>);
    }
    
    alert('✅ Cotización creada. En producción se enviaría por WhatsApp.');
    setShowNuevaCotizacion(false);
    cargarDatos();
  };

  const crearNuevaCita = (formData: FormData) => {
    const pacienteId = formData.get('pacienteId') as string;
    const doctorId = formData.get('doctorId') as string;
    const especialidadId = formData.get('especialidadId') as string;
    const fecha = formData.get('fecha') as string;
    const horaInicio = formData.get('horaInicio') as string;
    const duracionMinutos = parseInt(formData.get('duracionMinutos') as string || '30');
    const precio = parseFloat(formData.get('precio') as string);

    // Validar disponibilidad del doctor
    const validacionDisponibilidad = validarDisponibilidadDoctor(doctorId, fecha, horaInicio);
    if (!validacionDisponibilidad.valido) {
      alert('❌ ' + validacionDisponibilidad.mensaje);
      return;
    }

    // Calcular hora de fin
    const [h, m] = horaInicio.split(':').map(Number);
    const fechaFin = new Date();
    fechaFin.setHours(h, m + duracionMinutos);
    const horaFin = fechaFin.toTimeString().slice(0, 5);

    // Validar double booking
    const validacionBooking = validarDoubleBooking(doctorId, fecha, horaInicio, horaFin);
    if (!validacionBooking.valido) {
      alert(validacionBooking.mensaje);
      return;
    }

    const nuevaCita: Cita = {
      id: generateId('cita'),
      pacienteId,
      doctorId,
      especialidadId,
      fecha,
      horaInicio,
      horaFin,
      duracionMinutos,
      estado: 'programada',
      precio,
      estadoPago: 'pendiente',
      motivo: formData.get('motivo') as string || undefined,
      fechaCreacion: getCurrentTimestamp(),
      creadoPor: sessionUser?.userId || '',
    };

    citasStorage.create(nuevaCita);
    if (sessionUser) {
      logAuditoria(sessionUser.userId, sessionUser.username, 'Crear cita', 'Cita', nuevaCita.id, undefined, nuevaCita as unknown as Record<string, unknown>);
    }
    
    alert('✅ Cita creada exitosamente');
    setShowNuevaCita(false);
    cargarDatos();
  };

  const handleIniciarCronometro = (citaId: string, horaInicio: string) => {
    const cita = citasStorage.getById(citaId);
    if (!cita) return;

    citasStorage.update(citaId, {
      horaInicioReal: horaInicio,
      estado: 'en_curso',
    });

    if (sessionUser) {
      logAuditoria(sessionUser.userId, sessionUser.username, 'Iniciar cronómetro', 'Cita', citaId, { estado: cita.estado }, { estado: 'en_curso', horaInicioReal: horaInicio });
    }
    cargarDatos();
  };

  const handleDetenerCronometro = (citaId: string, horaFin: string, duracionSegundos: number) => {
    const cita = citasStorage.getById(citaId);
    if (!cita) return;

    const duracionMinutos = Math.floor(duracionSegundos / 60);

    citasStorage.update(citaId, {
      horaFinReal: horaFin,
      duracionReal: duracionMinutos,
    });

    if (sessionUser) {
      logAuditoria(sessionUser.userId, sessionUser.username, 'Detener cronómetro', 'Cita', citaId, undefined, { horaFinReal: horaFin, duracionReal: duracionMinutos });
    }
    cargarDatos();
  };

  const columnasCitas: Columna<{ id: string; horaInicio: string; pacienteNombre: string; doctorNombre: string; especialidadNombre: string; estado: string; horaInicioReal?: string }>[] = [
    {
      key: 'horaInicio',
      titulo: 'Hora',
      sortable: true,
      width: '80px',
    },
    {
      key: 'pacienteNombre',
      titulo: 'Paciente',
      sortable: true,
    },
    {
      key: 'doctorNombre',
      titulo: 'Doctor',
      sortable: true,
    },
    {
      key: 'especialidadNombre',
      titulo: 'Especialidad',
    },
    {
      key: 'estado',
      titulo: 'Estado',
      render: (cita: { estado: string }) => {
        const colores: Record<string, string> = {
          programada: 'bg-blue-100 text-blue-800',
          en_curso: 'bg-yellow-100 text-yellow-800',
          atendida: 'bg-green-100 text-green-800',
        };
        return <Badge className={colores[cita.estado]}>{cita.estado.replace('_', ' ')}</Badge>;
      },
    },
    {
      key: 'acciones',
      titulo: 'Cronómetro',
      render: (cita: { id: string; estado: string; horaInicioReal?: string }) => {
        if (cita.estado === 'programada') {
          return (
            <Button
              size="sm"
              onClick={() => {
                handleIniciarCronometro(cita.id, getCurrentTimestamp());
              }}
            >
              Iniciar
            </Button>
          );
        }
        if (cita.estado === 'en_curso') {
          return (
            <Cronometro
              horaInicio={cita.horaInicioReal}
              onStop={(horaFin: string, duracionSegundos: number) => handleDetenerCronometro(cita.id, horaFin, duracionSegundos)}
              autoInicio
            />
          );
        }
        return <span className="text-sm text-gray-500">Finalizada</span>;
      },
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
          <h1 className="text-3xl font-bold text-foreground">Recepción</h1>
          <p className="text-muted-foreground">Gestión de pacientes, cotizaciones y citas</p>
        </div>
        <div className="flex items-center gap-2">
          
      
        </div>
      </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="leads">
              <Users className="h-4 w-4 mr-2" />
              Leads ({leads.length})
            </TabsTrigger>
            <TabsTrigger value="cotizaciones">
              <FileText className="h-4 w-4 mr-2" />
              Cotizaciones ({cotizaciones.length})
            </TabsTrigger>
            <TabsTrigger value="citas">
              <Calendar className="h-4 w-4 mr-2" />
              Citas del Día ({citas.length})
            </TabsTrigger>
            <TabsTrigger value="pacientes">
              <Users className="h-4 w-4 mr-2" />
              Pacientes ({pacientes.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="leads">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Leads de Contacto</CardTitle>
                    <CardDescription>Contactos externos pendientes de cotización</CardDescription>
                  </div>
                  <Button onClick={() => setShowNuevoLead(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Lead
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showNuevoLead && (
                  <form onSubmit={(e) => { e.preventDefault(); crearNuevoLead(new FormData(e.currentTarget)); }} className="mb-8 p-6 border border-border rounded-lg space-y-4 bg-card relative z-10">
                    <h3 className="font-semibold text-foreground">Crear Nuevo Lead</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Nombre</Label>
                        <Input name="nombre" required />
                      </div>
                      <div>
                        <Label>Teléfono</Label>
                        <Input name="telefono" required />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input name="email" type="email" />
                      </div>
                      <div>
                        <Label>Canal</Label>
                        <Select name="canal" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar canal" />
                          </SelectTrigger>
                          <SelectContent className="z-50">
                            <SelectItem value="whatsapp">WhatsApp</SelectItem>
                            <SelectItem value="web">Web</SelectItem>
                            <SelectItem value="telefono">Teléfono</SelectItem>
                            <SelectItem value="presencial">Presencial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="md:col-span-2">
                        <Label>Motivo</Label>
                        <Textarea name="motivo" required />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit">Crear Lead</Button>
                      <Button type="button" variant="outline" onClick={() => setShowNuevoLead(false)}>Cancelar</Button>
                    </div>
                  </form>
                )}

                <DataTable
                  data={leads as unknown as Record<string, unknown>[]}
                  columnas={[
                    { key: 'nombre', titulo: 'Nombre', sortable: true },
                    { key: 'telefono', titulo: 'Teléfono' },
                    { key: 'canal', titulo: 'Canal', render: (l: Record<string, unknown>) => <Badge>{l.canal as string}</Badge> },
                    { key: 'estado', titulo: 'Estado', render: (l: Record<string, unknown>) => <Badge variant="outline">{l.estado as string}</Badge> },
                    { 
                      key: 'acciones', 
                      titulo: 'Acciones',
                      render: (l: Record<string, unknown>) => <Button size="sm" onClick={() => { 
                        setShowNuevaCotizacion(true); 
                      }}>Cotizar</Button> 
                    },
                  ]}
                  keyExtractor={(lead: Record<string, unknown>) => lead.id as string}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="citas">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Citas del Día</CardTitle>
                    <CardDescription>{new Date().toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
                  </div>
                  <Button onClick={() => setShowNuevaCita(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Cita
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showNuevaCita && (
                  <form onSubmit={(e) => { e.preventDefault(); crearNuevaCita(new FormData(e.currentTarget)); }} className="mb-8 p-6 border border-border rounded-lg space-y-4 bg-accent/50 relative z-10">
                    <h3 className="font-semibold text-foreground">Crear Nueva Cita</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label>Paciente</Label>
                        <Select name="pacienteId" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar paciente" />
                          </SelectTrigger>
                          <SelectContent className="z-50">
                            {pacientes.map(p => (
                              <SelectItem key={p.id} value={p.id}>{p.nombres} {p.apellidos}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Especialidad</Label>
                        <Select name="especialidadId" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar especialidad" />
                          </SelectTrigger>
                          <SelectContent className="z-50">
                            {especialidades.map(e => (
                              <SelectItem key={e.id} value={e.id}>{e.nombre} - S/{e.precioBase}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Doctor</Label>
                        <Select name="doctorId" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar doctor" />
                          </SelectTrigger>
                          <SelectContent className="z-50">
                            {doctores.map(d => (
                              <SelectItem key={d.id} value={d.id}>Dr. {d.nombres} {d.apellidos}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Fecha</Label>
                        <Input name="fecha" type="date" required />
                      </div>
                      <div>
                        <Label>Hora</Label>
                        <Input name="horaInicio" type="time" required />
                      </div>
                      <div>
                        <Label>Precio (S/)</Label>
                        <Input name="precio" type="number" step="0.01" required />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit">Crear Cita</Button>
                      <Button type="button" variant="outline" onClick={() => setShowNuevaCita(false)}>Cancelar</Button>
                    </div>
                  </form>
                )}

                <DataTable
                  data={citas}
                  columnas={columnasCitas}
                  itemsPorPagina={15}
                  keyExtractor={(cita: { id: string }) => cita.id}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pacientes">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Pacientes Registrados</CardTitle>
                    <CardDescription>Base de datos de pacientes</CardDescription>
                  </div>
                  <Button onClick={() => setShowNuevoPaciente(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Paciente
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showNuevoPaciente && (
                  <form onSubmit={(e) => { e.preventDefault(); crearNuevoPaciente(new FormData(e.currentTarget)); }} className="mb-8 p-6 border border-border rounded-lg space-y-4 bg-success/10 relative z-10">
                    <h3 className="font-semibold text-foreground">Crear Nuevo Paciente</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Nombres</Label>
                        <Input name="nombres" required />
                      </div>
                      <div>
                        <Label>Apellidos</Label>
                        <Input name="apellidos" required />
                      </div>
                      <div>
                        <Label>DNI</Label>
                        <Input name="documento" required />
                      </div>
                      <div>
                        <Label>Teléfono</Label>
                        <Input name="telefono" required />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Email</Label>
                        <Input name="email" type="email" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit">Crear Paciente y Generar Credenciales</Button>
                      <Button type="button" variant="outline" onClick={() => setShowNuevoPaciente(false)}>Cancelar</Button>
                    </div>
                  </form>
                )}

                <DataTable
                  data={pacientes as unknown as Record<string, unknown>[]}
                  columnas={[
                    { key: 'documento', titulo: 'DNI', sortable: true },
                    { key: 'nombres', titulo: 'Nombres', sortable: true },
                    { key: 'apellidos', titulo: 'Apellidos', sortable: true },
                    { key: 'telefono', titulo: 'Teléfono' },
                    { key: 'email', titulo: 'Email' },
                  ]}
                  itemsPorPagina={15}
                  keyExtractor={(paciente: Record<string, unknown>) => paciente.id as string}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cotizaciones">
            <Card>
              <CardHeader>
                <CardTitle>Cotizaciones</CardTitle>
                <CardDescription>Propuestas de servicios enviadas</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={cotizaciones}
                  columnas={[
                    { key: 'nombreCliente', titulo: 'Cliente', sortable: true },
                    { key: 'especialidadNombre', titulo: 'Especialidad' },
                    { key: 'doctorNombre', titulo: 'Doctor' },
                    { key: 'precio', titulo: 'Precio', render: (c: { precio: number }) => `S/ ${c.precio}` },
                    { key: 'estado', titulo: 'Estado', render: (c: { estado: string }) => <Badge>{c.estado}</Badge> },
                  ]}
                  keyExtractor={(cotizacion: { id: string }) => cotizacion.id}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    </div>
  );
}
