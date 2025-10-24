'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Stethoscope, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  X,
  CheckCircle,
  AlertCircle,
  CalendarDays
} from 'lucide-react';

// Tipos para el modal
interface Especialidad {
  id: string;
  nombre: string;
  precio: number;
  duracion: number; // en minutos
}

interface Doctor {
  id: string;
  nombre: string;
  especialidad: string;
  horarios: {
    dia: string;
    inicio: string;
    fin: string;
  }[];
}

interface HorarioDisponible {
  fecha: string;
  hora: string;
  disponible: boolean;
}

interface DatosCita {
  especialidad: string;
  doctor: string;
  fecha: Date;
  hora: string;
  tipoCita: string;
  motivoConsulta: string;
  observaciones?: string;
}

interface SolicitarCitaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSolicitarCita: (datosCita: DatosCita) => void;
}

// Mock data
const especialidadesMock: Especialidad[] = [
  { id: '1', nombre: 'Ginecología', precio: 120, duracion: 30 },
  { id: '2', nombre: 'Obstetricia', precio: 150, duracion: 40 },
  { id: '3', nombre: 'Medicina General', precio: 80, duracion: 25 },
  { id: '4', nombre: 'Nutrición', precio: 80, duracion: 25 },
  { id: '5', nombre: 'Psicología', precio: 100, duracion: 50 }
];

const doctoresMock: Doctor[] = [
  {
    id: '1',
    nombre: 'Dra. María González',
    especialidad: 'Ginecología',
    horarios: [
      { dia: 'Lunes', inicio: '09:00', fin: '13:00' },
      { dia: 'Miércoles', inicio: '09:00', fin: '13:00' },
      { dia: 'Viernes', inicio: '09:00', fin: '13:00' }
    ]
  },
  {
    id: '2',
    nombre: 'Dr. Carlos Mendoza',
    especialidad: 'Obstetricia',
    horarios: [
      { dia: 'Martes', inicio: '14:00', fin: '18:00' },
      { dia: 'Jueves', inicio: '14:00', fin: '18:00' },
      { dia: 'Sábado', inicio: '09:00', fin: '13:00' }
    ]
  },
  {
    id: '3',
    nombre: 'Lic. Ana Torres',
    especialidad: 'Nutrición',
    horarios: [
      { dia: 'Lunes', inicio: '15:00', fin: '19:00' },
      { dia: 'Miércoles', inicio: '15:00', fin: '19:00' },
      { dia: 'Viernes', inicio: '15:00', fin: '19:00' }
    ]
  }
];

export default function SolicitarCitaModal({ isOpen, onClose, onSolicitarCita }: SolicitarCitaModalProps) {
  const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState<string>('');
  const [doctorSeleccionado, setDoctorSeleccionado] = useState<string>('');
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>('');
  const [horaSeleccionada, setHoraSeleccionada] = useState<string>('');
  const [motivo, setMotivo] = useState<string>('');
  const [observaciones, setObservaciones] = useState<string>('');
  const [tipoCita, setTipoCita] = useState<string>('consulta');

  // Filtrar doctores por especialidad
  const doctoresFiltrados = doctoresMock.filter(doctor => 
    doctor.especialidad === especialidadSeleccionada
  );

  // Obtener especialidad seleccionada
  const especialidad = especialidadesMock.find(esp => esp.id === especialidadSeleccionada);

  // Generar horarios disponibles (simulado)
  const generarHorariosDisponibles = (fecha: string): HorarioDisponible[] => {
    const doctor = doctoresMock.find(d => d.id === doctorSeleccionado);
    if (!doctor) return [];

    const horarios: HorarioDisponible[] = [];
    const fechaObj = new Date(fecha);
    const diaSemana = fechaObj.toLocaleDateString('es-ES', { weekday: 'long' });
    
    const horarioDoctor = doctor.horarios.find(h => 
      h.dia.toLowerCase() === diaSemana.toLowerCase()
    );

    if (horarioDoctor) {
      const inicio = parseInt(horarioDoctor.inicio.split(':')[0]);
      const fin = parseInt(horarioDoctor.fin.split(':')[0]);
      
      for (let hora = inicio; hora < fin; hora++) {
        horarios.push({
          fecha,
          hora: `${hora.toString().padStart(2, '0')}:00`,
          disponible: Math.random() > 0.3 // Simular disponibilidad
        });
      }
    }

    return horarios;
  };

  const horariosDisponibles = fechaSeleccionada ? generarHorariosDisponibles(fechaSeleccionada) : [];

  // Función para obtener el próximo día disponible
  const obtenerProximosDias = () => {
    const dias = [];
    const hoy = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() + i);
      dias.push(fecha.toISOString().split('T')[0]);
    }
    
    return dias;
  };

  const proximosDias = obtenerProximosDias();

  const handleSolicitarCita = () => {
    const datosCita: DatosCita = {
      especialidad: especialidad?.nombre || '',
      doctor: doctoresFiltrados.find(d => d.id === doctorSeleccionado)?.nombre || '',
      fecha: new Date(fechaSeleccionada),
      hora: horaSeleccionada,
      tipoCita: tipoCita,
      motivoConsulta: motivo,
      observaciones: observaciones
    };

    onSolicitarCita(datosCita);
    handleCerrar();
  };

  const handleCerrar = () => {
    setEspecialidadSeleccionada('');
    setDoctorSeleccionado('');
    setFechaSeleccionada('');
    setHoraSeleccionada('');
    setMotivo('');
    setObservaciones('');
    setTipoCita('consulta');
    onClose();
  };

  const puedeEnviar = () => {
    return especialidadSeleccionada !== '' && 
           doctorSeleccionado !== '' && 
           fechaSeleccionada !== '' && 
           horaSeleccionada !== '' && 
           motivo.trim() !== '';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Solicitar Nueva Cita
            </CardTitle>
            <CardDescription>
              Completa todos los campos para solicitar tu cita médica
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={handleCerrar}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Formulario en dos columnas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Columna Izquierda */}
            <div className="space-y-4">
              {/* Especialidad */}
              <div>
                <Label className="text-base font-semibold">Especialidad *</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Selecciona la especialidad médica que necesitas
                </p>
                <Select value={especialidadSeleccionada} onValueChange={setEspecialidadSeleccionada}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una especialidad" />
                  </SelectTrigger>
                  <SelectContent>
                    {especialidadesMock.map((esp) => (
                      <SelectItem key={esp.id} value={esp.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{esp.nombre}</span>
                          <span className="text-primary font-semibold ml-2">S/ {esp.precio}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {especialidad && (
                  <div className="mt-2 p-3 bg-accent/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{especialidad.nombre}</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Duración: {especialidad.duracion} min</span>
                      <span className="font-semibold text-primary">S/ {especialidad.precio}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Doctor */}
              <div>
                <Label className="text-base font-semibold">Doctor *</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Elige el profesional médico
                </p>
                <Select 
                  value={doctorSeleccionado} 
                  onValueChange={setDoctorSeleccionado}
                >
                  <SelectTrigger disabled={!especialidadSeleccionada}>
                    <SelectValue placeholder="Selecciona un doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctoresFiltrados.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{doctor.nombre}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {doctorSeleccionado && (
                  <div className="mt-2 p-3 bg-accent/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">
                        {doctoresFiltrados.find(d => d.id === doctorSeleccionado)?.nombre}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {doctoresFiltrados.find(d => d.id === doctorSeleccionado)?.horarios.map((horario, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {horario.dia} {horario.inicio}-{horario.fin}
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
                  <Select value={fechaSeleccionada} onValueChange={setFechaSeleccionada}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona fecha" />
                    </SelectTrigger>
                    <SelectContent>
                      {proximosDias.map((fecha) => (
                        <SelectItem key={fecha} value={fecha}>
                          {new Date(fecha).toLocaleDateString('es-ES', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short'
                          })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-base font-semibold">Hora *</Label>
                  <Select 
                    value={horaSeleccionada} 
                    onValueChange={setHoraSeleccionada}
                  >
                    <SelectTrigger disabled={!fechaSeleccionada}>
                      <SelectValue placeholder="Selecciona hora" />
                    </SelectTrigger>
                    <SelectContent>
                      {horariosDisponibles.map((horario) => (
                        <SelectItem 
                          key={horario.hora} 
                          value={horario.hora}
                          disabled={!horario.disponible}
                        >
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {horario.hora}
                            {!horario.disponible && (
                              <Badge variant="secondary" className="text-xs ml-2">
                                Ocupado
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Columna Derecha */}
            <div className="space-y-4">
              {/* Tipo de Cita */}
              <div>
                <Label className="text-base font-semibold">Tipo de Cita</Label>
                <Select value={tipoCita} onValueChange={setTipoCita}>
                  <SelectTrigger>
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

              {/* Motivo */}
              <div>
                <Label htmlFor="motivo" className="text-base font-semibold">Motivo de la Consulta *</Label>
                <Textarea
                  id="motivo"
                  placeholder="Describe brevemente el motivo de tu consulta..."
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  className="min-h-[120px] mt-2"
                />
              </div>

              {/* Observaciones */}
              <div>
                <Label htmlFor="observaciones" className="text-base font-semibold">Observaciones Adicionales</Label>
                <Textarea
                  id="observaciones"
                  placeholder="Cualquier información adicional que consideres importante..."
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  className="min-h-[100px] mt-2"
                />
              </div>
            </div>
          </div>

          {/* Resumen de la Cita */}
          {(especialidad || doctorSeleccionado || fechaSeleccionada) && (
            <Card className="bg-accent/50 border-primary/20">
              <CardContent className="p-4">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Resumen de la Cita
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {especialidad && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Especialidad:</span>
                      <span className="font-medium">{especialidad.nombre}</span>
                    </div>
                  )}
                  {doctorSeleccionado && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Doctor:</span>
                      <span className="font-medium">
                        {doctoresFiltrados.find(d => d.id === doctorSeleccionado)?.nombre}
                      </span>
                    </div>
                  )}
                  {fechaSeleccionada && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fecha:</span>
                      <span className="font-medium">
                        {new Date(fechaSeleccionada).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long'
                        })}
                      </span>
                    </div>
                  )}
                  {horaSeleccionada && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hora:</span>
                      <span className="font-medium">{horaSeleccionada}</span>
                    </div>
                  )}
                  {tipoCita && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tipo:</span>
                      <span className="font-medium capitalize">{tipoCita}</span>
                    </div>
                  )}
                  {especialidad && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Costo:</span>
                      <span className="font-semibold text-primary text-lg">S/ {especialidad.precio}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleCerrar}>
              Cancelar
            </Button>
            <Button
              onClick={handleSolicitarCita}
              disabled={!puedeEnviar()}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Solicitar Cita
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
