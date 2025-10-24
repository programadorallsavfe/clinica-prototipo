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
  HeartPulse, Activity, RefreshCw, Search, Filter
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
    color: 'bg-pink-100 text-pink-800'
  },
  {
    id: '2',
    nombre: 'Obstetricia',
    descripcion: 'Atención del embarazo y parto',
    precio: 150,
    duracion: 40,
    color: 'bg-blue-100 text-blue-800'
  },
  {
    id: '3',
    nombre: 'Medicina General',
    descripcion: 'Consulta médica general',
    precio: 80,
    duracion: 25,
    color: 'bg-green-100 text-green-800'
  },
  {
    id: '4',
    nombre: 'Pediatría',
    descripcion: 'Atención médica infantil',
    precio: 100,
    duracion: 30,
    color: 'bg-yellow-100 text-yellow-800'
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
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date>();
  const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState<string>('');
  const [doctorSeleccionado, setDoctorSeleccionado] = useState<string>('');
  const [horaSeleccionada, setHoraSeleccionada] = useState<string>('');
  const [motivoConsulta, setMotivoConsulta] = useState<string>('');
  const [observaciones, setObservaciones] = useState<string>('');
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
    if (!fechaSeleccionada || !especialidadSeleccionada || !doctorSeleccionado || !horaSeleccionada) {
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
    setMotivoConsulta('');
    setObservaciones('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Agendar Cita Médica</h1>
        <p className="text-muted-foreground">
          Seleccione la especialidad, doctor y horario que mejor se adapte a sus necesidades
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario de Agendamiento */}
        <div className="lg:col-span-2 space-y-6">
          {/* Paso 1: Selección de Especialidad */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Paso 1: Seleccionar Especialidad
              </CardTitle>
              <CardDescription>Elija la especialidad médica que necesita</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {especialidadesMock.map((especialidad) => (
                  <div
                    key={especialidad.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      especialidadSeleccionada === especialidad.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => {
                      setEspecialidadSeleccionada(especialidad.id);
                      setDoctorSeleccionado(''); // Reset doctor selection
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{especialidad.nombre}</h3>
                      <Badge className={especialidad.color}>
                        S/ {especialidad.precio}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {especialidad.descripcion}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {especialidad.duracion} min
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Paso 2: Selección de Doctor */}
          {especialidadSeleccionada && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Paso 2: Seleccionar Doctor
                </CardTitle>
                <CardDescription>Elija el doctor de su preferencia</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {doctoresFiltrados.map((doctor) => (
                    <div
                      key={doctor.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        doctorSeleccionado === doctor.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setDoctorSeleccionado(doctor.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{doctor.nombre}</h3>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <HeartPulse className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium">{doctor.calificacion}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{doctor.especialidad}</span>
                        <span>•</span>
                        <span>{doctor.experiencia}</span>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground mb-1">Horarios disponibles:</p>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(doctor.horarios).map(([dia, horarios]) => (
                            <Badge key={dia} variant="outline" className="text-xs">
                              {dia}: {horarios.join(', ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Paso 3: Selección de Fecha y Hora */}
          {doctorSeleccionado && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Paso 3: Seleccionar Fecha y Hora
                </CardTitle>
                <CardDescription>Elija la fecha y hora de su cita</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Calendario */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Seleccionar Fecha</Label>
                    <Calendar
                      value={fechaSeleccionada}
                      onChange={(date) => setFechaSeleccionada(date || undefined)}
                      disabled={(date) => date < new Date() || date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                      className="rounded-md border"
                    />
                  </div>

                  {/* Horarios Disponibles */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Horarios Disponibles</Label>
                    {fechaSeleccionada ? (
                      <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                        {horariosDisponiblesFiltrados.map((horario) => (
                          <Button
                            key={horario}
                            variant={horaSeleccionada === horario ? "default" : "outline"}
                            size="sm"
                            onClick={() => setHoraSeleccionada(horario)}
                            className="text-xs"
                          >
                            {horario}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Seleccione una fecha para ver los horarios disponibles
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Paso 4: Información Adicional */}
          {horaSeleccionada && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Paso 4: Información Adicional
                </CardTitle>
                <CardDescription>Proporcione información adicional sobre su consulta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="motivo">Motivo de Consulta *</Label>
                  <Textarea
                    id="motivo"
                    placeholder="Describa brevemente el motivo de su consulta..."
                    value={motivoConsulta}
                    onChange={(e) => setMotivoConsulta(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="observaciones">Observaciones Adicionales</Label>
                  <Textarea
                    id="observaciones"
                    placeholder="Cualquier información adicional que considere importante..."
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Panel de Resumen */}
        <div className="space-y-6">
          {/* Resumen de la Cita */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen de la Cita</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
              <CardTitle>Información de Contacto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">(01) 234-5678</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">citas@clinicafeminis.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Av. Principal 123, Lima</span>
              </div>
            </CardContent>
          </Card>

          {/* Botón de Agendamiento */}
          {fechaSeleccionada && especialidadSeleccionada && doctorSeleccionado && horaSeleccionada && (
            <Button 
              onClick={handleAgendarCita}
              className="w-full"
              size="lg"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Agendar Cita
            </Button>
          )}
        </div>
      </div>

      {/* Modal de Confirmación */}
      {showConfirmacion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Confirmar Cita
              </CardTitle>
              <CardDescription>
                Por favor revise los detalles de su cita antes de confirmar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
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
                  <span className="text-sm text-muted-foreground">Total:</span>
                  <span className="text-sm font-bold text-primary">
                    S/ {especialidadActual?.precio}
                  </span>
                </div>
              </div>
              
              {motivoConsulta && (
                <div>
                  <span className="text-sm text-muted-foreground">Motivo:</span>
                  <p className="text-sm mt-1 p-2 bg-accent/50 rounded">
                    {motivoConsulta}
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowConfirmacion(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={confirmarCita}
                  className="flex-1"
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
