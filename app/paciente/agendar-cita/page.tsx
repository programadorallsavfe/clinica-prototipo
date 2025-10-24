'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Calendar as CalendarIcon, Clock, User, Stethoscope, 
  CheckCircle, AlertTriangle, Phone, Mail, MapPin,
  HeartPulse, Activity, RefreshCw, Search, Filter,
  FileText, UserPlus, CreditCard
} from 'lucide-react';
import { format } from 'date-fns';

// Mock data para especialidades y doctores
const especialidadesMock = [
  {
    id: '1',
    nombre: 'Ginecología',
    descripcion: 'Especialidad médica de la mujer',
    precio: 120,
    duracion: 30,
    color: 'bg-accent text-accent-foreground'
  },
  {
    id: '2',
    nombre: 'Obstetricia',
    descripcion: 'Atención del embarazo y parto',
    precio: 150,
    duracion: 40,
    color: 'bg-primary/10 text-primary'
  },
  {
    id: '3',
    nombre: 'Medicina General',
    descripcion: 'Consulta médica general',
    precio: 80,
    duracion: 25,
    color: 'bg-secondary text-secondary-foreground'
  },
  {
    id: '4',
    nombre: 'Pediatría',
    descripcion: 'Atención médica infantil',
    precio: 100,
    duracion: 30,
    color: 'bg-muted text-muted-foreground'
  }
];

const doctoresMock = [
  {
    id: '1',
    nombre: 'Dr. Carlos Sánchez López',
    especialidadId: '1',
    especialidad: 'Ginecología',
    horarios: {
      lunes: ['09:00-13:00', '15:00-19:00'],
      martes: ['09:00-13:00'],
      miercoles: ['09:00-13:00', '15:00-19:00'],
      jueves: ['09:00-13:00'],
      viernes: ['09:00-13:00', '15:00-19:00']
    },
    experiencia: '15 años',
    calificacion: 4.8
  },
  {
    id: '2',
    nombre: 'Dra. Ana Rodríguez Silva',
    especialidadId: '2',
    especialidad: 'Obstetricia',
    horarios: {
      lunes: ['08:00-12:00', '14:00-18:00'],
      martes: ['08:00-12:00', '14:00-18:00'],
      miercoles: ['08:00-12:00'],
      jueves: ['08:00-12:00', '14:00-18:00'],
      viernes: ['08:00-12:00']
    },
    experiencia: '12 años',
    calificacion: 4.9
  },
  {
    id: '3',
    nombre: 'Dr. Pedro López Torres',
    especialidadId: '3',
    especialidad: 'Medicina General',
    horarios: {
      lunes: ['09:00-13:00', '15:00-19:00'],
      martes: ['09:00-13:00', '15:00-19:00'],
      miercoles: ['09:00-13:00'],
      jueves: ['09:00-13:00', '15:00-19:00'],
      viernes: ['09:00-13:00']
    },
    experiencia: '10 años',
    calificacion: 4.7
  }
];

const horariosDisponibles = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30'
];

export default function AgendarCitaPage() {
  // Estados para selectores
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date>();
  const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState<string>('');
  const [doctorSeleccionado, setDoctorSeleccionado] = useState<string>('');
  const [horaSeleccionada, setHoraSeleccionada] = useState<string>('');
  const [tipoCita, setTipoCita] = useState<string>('consulta');
  
  // Estados para campos de texto
  const [nombres, setNombres] = useState<string>('');
  const [apellidos, setApellidos] = useState<string>('');
  const [dni, setDni] = useState<string>('');
  const [telefono, setTelefono] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [fechaNacimiento, setFechaNacimiento] = useState<string>('');
  const [direccion, setDireccion] = useState<string>('');
  const [motivoConsulta, setMotivoConsulta] = useState<string>('');
  const [observaciones, setObservaciones] = useState<string>('');
  const [alergias, setAlergias] = useState<string>('');
  const [medicamentosActuales, setMedicamentosActuales] = useState<string>('');
  const [historialMedico, setHistorialMedico] = useState<string>('');
  
  const [showConfirmacion, setShowConfirmacion] = useState(false);

  // Filtrar doctores por especialidad
  const doctoresFiltrados = especialidadSeleccionada 
    ? doctoresMock.filter(doctor => doctor.especialidadId === especialidadSeleccionada)
    : [];

  // Obtener especialidad seleccionada
  const especialidadActual = especialidadesMock.find(esp => esp.id === especialidadSeleccionada);
  const doctorActual = doctoresMock.find(doc => doc.id === doctorSeleccionado);

  // Verificar disponibilidad de horarios
  const getHorariosDisponibles = () => {
    if (!fechaSeleccionada || !doctorActual) return [];
    
    const diaSemana = fechaSeleccionada.toLocaleDateString('es-ES', { weekday: 'long' }).toLowerCase();
    const horariosDoctor = doctorActual.horarios[diaSemana as keyof typeof doctorActual.horarios] || [];
    
    if (horariosDisponibles.length === 0) return [];
    
    // Simular horarios ocupados (en una implementación real vendría de la API)
    const horariosOcupados = ['09:00', '10:30', '15:00'];
    
    return horariosDisponibles.filter(horario => {
      const estaEnHorarioDoctor = horariosDoctor.some(horarioDoctor => {
        const [inicio, fin] = horarioDoctor.split('-');
        return horario >= inicio && horario < fin;
      });
      
      const noEstaOcupado = !horariosOcupados.includes(horario);
      
      return estaEnHorarioDoctor && noEstaOcupado;
    });
  };

  const horariosDisponiblesFiltrados = getHorariosDisponibles();

  const handleAgendarCita = () => {
    if (!fechaSeleccionada || !especialidadSeleccionada || !doctorSeleccionado || !horaSeleccionada || !nombres.trim() || !apellidos.trim() || !dni.trim() || !telefono.trim() || !motivoConsulta.trim()) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }
    setShowConfirmacion(true);
  };

  const confirmarCita = () => {
    // Aquí se enviaría la cita al backend
    alert('✅ Cita agendada exitosamente');
    setShowConfirmacion(false);
    // Limpiar formulario
    setFechaSeleccionada(undefined);
    setEspecialidadSeleccionada('');
    setDoctorSeleccionado('');
    setHoraSeleccionada('');
    setTipoCita('consulta');
    setNombres('');
    setApellidos('');
    setDni('');
    setTelefono('');
    setEmail('');
    setFechaNacimiento('');
    setDireccion('');
    setMotivoConsulta('');
    setObservaciones('');
    setAlergias('');
    setMedicamentosActuales('');
    setHistorialMedico('');
  };

  return (
    <div className="container mx-auto p-6 space-y-6 bg-background text-foreground min-h-screen">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Agendar Cita Médica</h1>
        <p className="text-muted-foreground">
          Complete todos los campos para agendar su cita médica
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información Personal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Información Personal
              </CardTitle>
              <CardDescription>
                Complete sus datos personales
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombres" className="text-base font-semibold">Nombres *</Label>
                  <Input
                    id="nombres"
                    placeholder="Ingrese sus nombres"
                    value={nombres}
                    onChange={(e) => setNombres(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="apellidos" className="text-base font-semibold">Apellidos *</Label>
                  <Input
                    id="apellidos"
                    placeholder="Ingrese sus apellidos"
                    value={apellidos}
                    onChange={(e) => setApellidos(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dni" className="text-base font-semibold">DNI *</Label>
                  <Input
                    id="dni"
                    placeholder="Ingrese su DNI"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="telefono" className="text-base font-semibold">Teléfono *</Label>
                  <Input
                    id="telefono"
                    placeholder="Ingrese su teléfono"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="text-base font-semibold">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Ingrese su email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="fechaNacimiento" className="text-base font-semibold">Fecha de Nacimiento</Label>
                  <Input
                    id="fechaNacimiento"
                    type="date"
                    value={fechaNacimiento}
                    onChange={(e) => setFechaNacimiento(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="direccion" className="text-base font-semibold">Dirección</Label>
                <Input
                  id="direccion"
                  placeholder="Ingrese su dirección"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Información Médica */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Información Médica
              </CardTitle>
              <CardDescription>
                Complete la información médica relevante
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="alergias" className="text-base font-semibold">Alergias</Label>
                <Input
                  id="alergias"
                  placeholder="Ingrese sus alergias (si las tiene)"
                  value={alergias}
                  onChange={(e) => setAlergias(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="medicamentos" className="text-base font-semibold">Medicamentos Actuales</Label>
                <Input
                  id="medicamentos"
                  placeholder="Ingrese medicamentos que está tomando"
                  value={medicamentosActuales}
                  onChange={(e) => setMedicamentosActuales(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="historial" className="text-base font-semibold">Historial Médico</Label>
                <Textarea
                  id="historial"
                  placeholder="Describa su historial médico relevante..."
                  value={historialMedico}
                  onChange={(e) => setHistorialMedico(e.target.value)}
                  className="mt-2 min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Selección de Cita */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Selección de Cita
              </CardTitle>
              <CardDescription>
                Seleccione la especialidad, doctor y horario
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Especialidad */}
              <div>
                <Label className="text-base font-semibold">Especialidad *</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Seleccione la especialidad médica que necesita
                </p>
                <Select value={especialidadSeleccionada} onValueChange={(value) => {
                  setEspecialidadSeleccionada(value);
                  setDoctorSeleccionado(''); // Reset doctor selection
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una especialidad" />
                  </SelectTrigger>
                  <SelectContent>
                    {especialidadesMock.map((esp) => (
                      <SelectItem key={esp.id} value={esp.id}>
                        <div className="flex items-center justify-between w-full">
                          <div>
                            <span className="font-medium">{esp.nombre}</span>
                            <p className="text-xs text-muted-foreground">{esp.descripcion}</p>
                          </div>
                          <span className="text-primary font-semibold ml-2">S/ {esp.precio}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {especialidadActual && (
                  <div className="mt-2 p-3 bg-accent/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{especialidadActual.nombre}</p>
                        <p className="text-xs text-muted-foreground">
                          Duración: {especialidadActual.duracion} minutos
                        </p>
                      </div>
                      <Badge className="bg-primary/10 text-primary">
                        S/ {especialidadActual.precio}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>

              {/* Doctor */}
              <div>
                <Label className="text-base font-semibold">Doctor *</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Elija el profesional médico
                </p>
                <Select 
                  value={doctorSeleccionado} 
                  onValueChange={setDoctorSeleccionado}
                >
                  <SelectTrigger disabled={!especialidadSeleccionada}>
                    <SelectValue placeholder="Seleccione un doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctoresFiltrados.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <div>
                            <span className="font-medium">{doctor.nombre}</span>
                            <p className="text-xs text-muted-foreground">
                              {doctor.especialidad} • {doctor.experiencia} • ⭐ {doctor.calificacion}
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {doctorActual && (
                  <div className="mt-2 p-3 bg-accent/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{doctorActual.nombre}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(doctorActual.horarios).map(([dia, horarios]) => (
                        <Badge key={dia} variant="outline" className="text-xs">
                          {dia}: {horarios.join(', ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Fecha y Hora */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-base font-semibold">Fecha *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal mt-2"
                        disabled={!doctorSeleccionado}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {fechaSeleccionada ? format(fechaSeleccionada, "dd/MM/yyyy") : "Seleccione fecha"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        value={fechaSeleccionada}
                        onChange={(date) => setFechaSeleccionada(date || undefined)}
                        disabled={(date) => date < new Date() || date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <Label className="text-base font-semibold">Hora *</Label>
                  <Select 
                    value={horaSeleccionada} 
                    onValueChange={setHoraSeleccionada}
                  >
                    <SelectTrigger className="mt-2" disabled={!fechaSeleccionada}>
                      <SelectValue placeholder="Seleccione hora" />
                    </SelectTrigger>
                    <SelectContent>
                      {horariosDisponiblesFiltrados.map((horario) => (
                        <SelectItem key={horario} value={horario}>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {horario}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tipo de Cita */}
              <div>
                <Label className="text-base font-semibold">Tipo de Cita</Label>
                <Select value={tipoCita} onValueChange={setTipoCita}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consulta">Consulta General</SelectItem>
                    <SelectItem value="control">Control de Seguimiento</SelectItem>
                    <SelectItem value="emergencia">Emergencia</SelectItem>
                    <SelectItem value="seguimiento">Seguimiento</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Motivo de Consulta */}
              <div>
                <Label htmlFor="motivo" className="text-base font-semibold">Motivo de Consulta *</Label>
                <Textarea
                  id="motivo"
                  placeholder="Describa brevemente el motivo de su consulta..."
                  value={motivoConsulta}
                  onChange={(e) => setMotivoConsulta(e.target.value)}
                  className="mt-2 min-h-[100px]"
                />
              </div>

              {/* Observaciones */}
              <div>
                <Label htmlFor="observaciones" className="text-base font-semibold">Observaciones Adicionales</Label>
                <Textarea
                  id="observaciones"
                  placeholder="Cualquier información adicional que considere importante..."
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  className="mt-2 min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panel de Resumen */}
        <div className="space-y-6">
          {/* Resumen de la Cita */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Resumen de la Cita
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {nombres && apellidos && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Paciente:</span>
                  <span className="font-medium">{nombres} {apellidos}</span>
                </div>
              )}

              {especialidadActual && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Especialidad:</span>
                  <span className="font-medium">{especialidadActual.nombre}</span>
                </div>
              )}
              
              {doctorActual && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Doctor:</span>
                  <span className="font-medium text-sm">{doctorActual.nombre}</span>
                </div>
              )}
              
              {fechaSeleccionada && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Fecha:</span>
                  <span className="font-medium">
                    {format(fechaSeleccionada, 'dd/MM/yyyy')}
                  </span>
                </div>
              )}
              
              {horaSeleccionada && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Hora:</span>
                  <span className="font-medium">{horaSeleccionada}</span>
                </div>
              )}

              {tipoCita && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tipo:</span>
                  <span className="font-medium capitalize">{tipoCita}</span>
                </div>
              )}
              
              {especialidadActual && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Duración:</span>
                  <span className="font-medium">{especialidadActual.duracion} minutos</span>
                </div>
              )}
              
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total a pagar:</span>
                  <span className="text-lg font-bold text-primary">
                    S/ {especialidadActual?.precio || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información de Contacto */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Información de Contacto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">(01) 234-5678</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">citas@clinicafeminis.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">Av. Principal 123, Lima</span>
              </div>
            </CardContent>
          </Card>

          {/* Botón de Agendamiento */}
          <Button 
            onClick={handleAgendarCita}
            disabled={!fechaSeleccionada || !especialidadSeleccionada || !doctorSeleccionado || !horaSeleccionada || !nombres.trim() || !apellidos.trim() || !dni.trim() || !telefono.trim() || !motivoConsulta.trim()}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            Agendar Cita
          </Button>
        </div>
      </div>

      {/* Modal de Confirmación */}
      {showConfirmacion && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Confirmar Cita
              </CardTitle>
              <CardDescription>
                Por favor revise los detalles de su cita antes de confirmar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Paciente:</span>
                  <span className="text-sm font-medium">{nombres} {apellidos}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">DNI:</span>
                  <span className="text-sm font-medium">{dni}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Teléfono:</span>
                  <span className="text-sm font-medium">{telefono}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Especialidad:</span>
                  <span className="text-sm font-medium">{especialidadActual?.nombre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Doctor:</span>
                  <span className="text-sm font-medium">{doctorActual?.nombre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Fecha:</span>
                  <span className="text-sm font-medium">
                    {fechaSeleccionada && format(fechaSeleccionada, 'dd/MM/yyyy')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Hora:</span>
                  <span className="text-sm font-medium">{horaSeleccionada}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Tipo:</span>
                  <span className="text-sm font-medium capitalize">{tipoCita}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total:</span>
                  <span className="text-sm font-bold text-primary">
                    S/ {especialidadActual?.precio}
                  </span>
                </div>
              </div>
              
              {motivoConsulta && (
                <div>
                  <span className="text-sm text-muted-foreground">Motivo:</span>
                  <p className="text-sm mt-1 p-2 bg-accent/50 rounded text-foreground">
                    {motivoConsulta}
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowConfirmacion(false)}
                  className="flex-1 border-border hover:bg-accent hover:text-accent-foreground"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={confirmarCita}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Confirmar Cita
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
