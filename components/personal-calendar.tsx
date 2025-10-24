'use client';

import { Calendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './doctor-schedule-calendar.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, Clock, User, MapPin, CalendarDays, Users, 
  CheckCircle, XCircle, AlertTriangle, Coffee, 
  Building2, UserCheck, Phone, Calculator, Shield
} from 'lucide-react';
import { useState, useMemo } from 'react';

// Configurar moment en español
moment.locale('es');

const localizer = momentLocalizer(moment);

interface PersonalEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource?: {
    personalId: string;
    personalNombre: string;
    tipo: 'horario' | 'asistencia' | 'vacacion' | 'incidencia';
    estado?: string;
    observaciones?: string;
    cargo?: string;
  };
}

interface PersonalCalendarProps {
  personal: Array<{
    id: string;
    nombres: string;
    apellidos: string;
    cargo: string;
    estado: string;
  }>;
  horarios: Array<{
    id: string;
    personalId: string;
    diaSemana: string;
    horaInicio: string;
    horaFin: string;
    tipo: string;
  }>;
  asistencias: Array<{
    id: string;
    personalId: string;
    fecha: string;
    horaEntrada: string;
    horaSalida?: string;
    tardanza: number;
    falta: boolean;
  }>;
  vacaciones: Array<{
    id: string;
    personalId: string;
    fechaInicio: string;
    fechaFin: string;
    estado: string;
  }>;
  incidencias: Array<{
    id: string;
    personalId: string;
    tipo: string;
    titulo: string;
    fecha: string;
    severidad: string;
  }>;
}

// Función para generar eventos mock basados en el personal
const generatePersonalEvents = (
  personal: PersonalCalendarProps['personal'],
  horarios: PersonalCalendarProps['horarios'],
  asistencias: PersonalCalendarProps['asistencias'],
  vacaciones: PersonalCalendarProps['vacaciones'],
  incidencias: PersonalCalendarProps['incidencias'],
  startDate: Date,
  endDate: Date
): PersonalEvent[] => {
  const events: PersonalEvent[] = [];
  const startMoment = moment(startDate);
  const endMoment = moment(endDate);

  // Generar horarios de trabajo
  personal.forEach(persona => {
    if (persona.estado === 'activo') {
      const diasSemana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
      
      for (let currentDate = startMoment.clone(); currentDate.isSameOrBefore(endMoment, 'day'); currentDate.add(1, 'day')) {
        const diaSemana = diasSemana[currentDate.day() === 0 ? 6 : currentDate.day() - 1];
        
        // Horario estándar por cargo
        let horaInicio = '08:00';
        let horaFin = '17:00';
        
        switch (persona.cargo) {
          case 'medico':
            horaInicio = '08:00';
            horaFin = '18:00';
            break;
          case 'enfermero':
            horaInicio = '07:00';
            horaFin = '19:00';
            break;
          case 'recepcionista':
            horaInicio = '08:00';
            horaFin = '17:00';
            break;
          case 'administrador':
            horaInicio = '09:00';
            horaFin = '18:00';
            break;
          case 'limpieza':
            horaInicio = '06:00';
            horaFin = '14:00';
            break;
          case 'seguridad':
            horaInicio = '22:00';
            horaFin = '06:00';
            break;
        }

        // Solo días laborables (lunes a viernes para la mayoría)
        if (persona.cargo !== 'seguridad' && (currentDate.day() === 0 || currentDate.day() === 6)) {
          continue;
        }

        const start = moment(currentDate).hour(parseInt(horaInicio.split(':')[0])).minute(parseInt(horaInicio.split(':')[1])).toDate();
        const end = moment(currentDate).hour(parseInt(horaFin.split(':')[0])).minute(parseInt(horaFin.split(':')[1])).toDate();

        events.push({
          id: `horario-${persona.id}-${currentDate.format('YYYYMMDD')}`,
          title: `Horario - ${persona.nombres} ${persona.apellidos}`,
          start,
          end,
          resource: {
            personalId: persona.id,
            personalNombre: `${persona.nombres} ${persona.apellidos}`,
            tipo: 'horario',
            cargo: persona.cargo,
            estado: 'programado'
          }
        });
      }
    }
  });

  // Generar asistencias mock
  personal.forEach(persona => {
    for (let currentDate = startMoment.clone(); currentDate.isSameOrBefore(endMoment, 'day'); currentDate.add(1, 'day')) {
      // Solo días laborables
      if (currentDate.day() === 0 || currentDate.day() === 6) continue;
      
      // 90% de asistencia
      if (Math.random() < 0.9) {
        const horaEntrada = moment(currentDate).hour(8).minute(Math.floor(Math.random() * 30)).toDate();
        const horaSalida = moment(currentDate).hour(17).minute(Math.floor(Math.random() * 30)).toDate();
        const tardanza = Math.floor(Math.random() * 20); // 0-20 minutos de tardanza

        events.push({
          id: `asistencia-${persona.id}-${currentDate.format('YYYYMMDD')}`,
          title: `Asistencia - ${persona.nombres} ${persona.apellidos}`,
          start: horaEntrada,
          end: horaSalida,
          resource: {
            personalId: persona.id,
            personalNombre: `${persona.nombres} ${persona.apellidos}`,
            tipo: 'asistencia',
            cargo: persona.cargo,
            estado: tardanza > 0 ? 'tardanza' : 'puntual',
            observaciones: tardanza > 0 ? `Tardanza: ${tardanza} min` : undefined
          }
        });
      }
    }
  });

  // Generar vacaciones mock
  personal.forEach(persona => {
    if (Math.random() < 0.3) { // 30% de probabilidad de vacaciones
      const fechaInicio = moment(startMoment).add(Math.floor(Math.random() * 30), 'days');
      const diasVacaciones = Math.floor(Math.random() * 10) + 5; // 5-15 días
      const fechaFin = moment(fechaInicio).add(diasVacaciones, 'days');

      if (fechaFin.isSameOrBefore(endMoment)) {
        events.push({
          id: `vacacion-${persona.id}-${fechaInicio.format('YYYYMMDD')}`,
          title: `Vacaciones - ${persona.nombres} ${persona.apellidos}`,
          start: fechaInicio.toDate(),
          end: fechaFin.toDate(),
          resource: {
            personalId: persona.id,
            personalNombre: `${persona.nombres} ${persona.apellidos}`,
            tipo: 'vacacion',
            cargo: persona.cargo,
            estado: 'aprobada'
          }
        });
      }
    }
  });

  // Generar incidencias mock
  personal.forEach(persona => {
    if (Math.random() < 0.1) { // 10% de probabilidad de incidencia
      const fecha = moment(startMoment).add(Math.floor(Math.random() * 30), 'days');
      const tipos = ['memorandum', 'amonestacion', 'felicitacion'];
      const tipo = tipos[Math.floor(Math.random() * tipos.length)];

      events.push({
        id: `incidencia-${persona.id}-${fecha.format('YYYYMMDD')}`,
        title: `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} - ${persona.nombres} ${persona.apellidos}`,
        start: fecha.hour(10).minute(0).toDate(),
        end: fecha.hour(10).minute(30).toDate(),
        resource: {
          personalId: persona.id,
          personalNombre: `${persona.nombres} ${persona.apellidos}`,
          tipo: 'incidencia',
          cargo: persona.cargo,
          estado: 'activa'
        }
      });
    }
  });

  return events;
};

export default function PersonalCalendar({ personal, horarios, asistencias, vacaciones, incidencias }: PersonalCalendarProps) {
  const [view, setView] = useState<View>('week');
  const [date, setDate] = useState(new Date());
  const [filtroPersonal, setFiltroPersonal] = useState<string>('todos');
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');

  // Generar eventos mock dinámicamente
  const events = useMemo(() => {
    const startDate = moment(date).startOf('month').subtract(7, 'days').toDate();
    const endDate = moment(date).endOf('month').add(7, 'days').toDate();
    return generatePersonalEvents(personal, horarios, asistencias, vacaciones, incidencias, startDate, endDate);
  }, [date, personal, horarios, asistencias, vacaciones, incidencias]);

  // Filtrar eventos
  const eventosFiltrados = events.filter(event => {
    const cumplePersonal = filtroPersonal === 'todos' || event.resource?.personalId === filtroPersonal;
    const cumpleTipo = filtroTipo === 'todos' || event.resource?.tipo === filtroTipo;
    return cumplePersonal && cumpleTipo;
  });

  const eventStyleGetter = (event: PersonalEvent) => {
    let className = 'horario';
    let backgroundColor = 'var(--primary)';
    
    switch (event.resource?.tipo) {
      case 'horario':
        className = 'horario';
        backgroundColor = 'var(--primary)';
        break;
      case 'asistencia':
        if (event.resource?.estado === 'tardanza') {
          className = 'tardanza';
          backgroundColor = 'var(--warning)';
        } else {
          className = 'asistencia';
          backgroundColor = 'var(--success)';
        }
        break;
      case 'vacacion':
        className = 'vacacion';
        backgroundColor = 'var(--info)';
        break;
      case 'incidencia':
        className = 'incidencia';
        backgroundColor = 'var(--destructive)';
        break;
    }

    return {
      className: className,
      style: {
        backgroundColor: backgroundColor,
        borderRadius: 'var(--radius-sm)',
        opacity: 0.9,
        display: 'block',
        fontWeight: '500',
        color: 'white',
        border: 'none'
      }
    };
  };

  const handleSelectEvent = (event: PersonalEvent) => {
    console.log('Evento seleccionado:', event);
  };

  const handleSelectSlot = (slotInfo: unknown) => {
    console.log('Slot seleccionado:', slotInfo);
  };

  const handleViewChange = (newView: View) => {
    setView(newView);
  };

  const getCargoIcon = (cargo: string) => {
    switch (cargo) {
      case 'medico': return <User className="h-3 w-3" />;
      case 'enfermero': return <UserCheck className="h-3 w-3" />;
      case 'recepcionista': return <Phone className="h-3 w-3" />;
      case 'administrador': return <Building2 className="h-3 w-3" />;
      case 'contador': return <Calculator className="h-3 w-3" />;
      case 'limpieza': return <Coffee className="h-3 w-3" />;
      case 'seguridad': return <Shield className="h-3 w-3" />;
      default: return <User className="h-3 w-3" />;
    }
  };

  const CustomEvent = ({ event }: { event: PersonalEvent }) => (
    <div className="p-1">
      <div className="font-medium text-sm truncate">{event.title}</div>
      <div className="text-xs opacity-90 flex items-center gap-1">
        {getCargoIcon(event.resource?.cargo || '')}
        {event.resource?.cargo}
      </div>
      <div className="text-xs opacity-90 flex items-center gap-1">
        <Clock className="h-3 w-3" />
        {moment(event.start).format('HH:mm')} - {moment(event.end).format('HH:mm')}
      </div>
      {event.resource?.observaciones && (
        <div className="text-xs opacity-90">
          {event.resource.observaciones}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header del Calendario */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Calendario del Personal
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Horarios, asistencias, vacaciones e incidencias del personal
              </p>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Evento
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filtros:</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Personal:</span>
              <Select value={filtroPersonal} onValueChange={setFiltroPersonal}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Seleccionar personal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {personal.map(persona => (
                    <SelectItem key={persona.id} value={persona.id}>
                      {persona.nombres} {persona.apellidos}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Tipo:</span>
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="horario">Horarios</SelectItem>
                  <SelectItem value="asistencia">Asistencias</SelectItem>
                  <SelectItem value="vacacion">Vacaciones</SelectItem>
                  <SelectItem value="incidencia">Incidencias</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Controles del Calendario */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Button
                variant={view === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('month')}
              >
                Mes
              </Button>
              <Button
                variant={view === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('week')}
              >
                Semana
              </Button>
              <Button
                variant={view === 'day' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('day')}
              >
                Día
              </Button>
              <Button
                variant={view === 'agenda' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('agenda')}
              >
                Agenda
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDate(new Date())}
              >
                Hoy
              </Button>
            </div>
          </div>

          {/* Leyenda */}
          <div className="flex items-center gap-4 mb-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: 'var(--primary)' }}></div>
              <span className="text-muted-foreground">Horarios</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: 'var(--success)' }}></div>
              <span className="text-muted-foreground">Asistencias</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: 'var(--warning)' }}></div>
              <span className="text-muted-foreground">Tardanzas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: 'var(--info)' }}></div>
              <span className="text-muted-foreground">Vacaciones</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: 'var(--destructive)' }}></div>
              <span className="text-muted-foreground">Incidencias</span>
            </div>
          </div>

          {/* Calendario */}
          <div className="h-[600px]">
            <Calendar
              localizer={localizer}
              events={eventosFiltrados}
              startAccessor="start"
              endAccessor="end"
              view={view}
              onView={handleViewChange}
              date={date}
              onNavigate={setDate}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              selectable
              eventPropGetter={eventStyleGetter}
              components={{
                event: CustomEvent
              }}
              messages={{
                next: 'Siguiente',
                previous: 'Anterior',
                today: 'Hoy',
                month: 'Mes',
                week: 'Semana',
                day: 'Día',
                agenda: 'Agenda',
                date: 'Fecha',
                time: 'Hora',
                event: 'Evento',
                noEventsInRange: 'No hay eventos en este rango de fechas.',
                showMore: total => `+ Ver más (${total})`
              }}
              step={30}
              timeslots={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--primary)', opacity: 0.1 }}>
                <CalendarDays className="h-4 w-4" style={{ color: 'var(--primary)' }} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Horarios Hoy</p>
                <p className="text-2xl font-bold text-foreground">
                  {eventosFiltrados.filter(event => 
                    moment(event.start).isSame(moment(), 'day') && 
                    event.resource?.tipo === 'horario'
                  ).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--success)', opacity: 0.1 }}>
                <CheckCircle className="h-4 w-4" style={{ color: 'var(--success)' }} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Asistencias (Semana)</p>
                <p className="text-2xl font-bold text-foreground">
                  {eventosFiltrados.filter(event => 
                    moment(event.start).isBetween(
                      moment().startOf('week'), 
                      moment().endOf('week'), 
                      null, '[]'
                    ) && 
                    event.resource?.tipo === 'asistencia'
                  ).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--warning)', opacity: 0.1 }}>
                <AlertTriangle className="h-4 w-4" style={{ color: 'var(--warning)' }} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tardanzas (Semana)</p>
                <p className="text-2xl font-bold text-foreground">
                  {eventosFiltrados.filter(event => 
                    moment(event.start).isBetween(
                      moment().startOf('week'), 
                      moment().endOf('week'), 
                      null, '[]'
                    ) && 
                    event.resource?.tipo === 'asistencia' &&
                    event.resource?.estado === 'tardanza'
                  ).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--info)', opacity: 0.1 }}>
                <Coffee className="h-4 w-4" style={{ color: 'var(--info)' }} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">En Vacaciones</p>
                <p className="text-2xl font-bold text-foreground">
                  {eventosFiltrados.filter(event => 
                    event.resource?.tipo === 'vacacion' &&
                    moment().isBetween(moment(event.start), moment(event.end), null, '[]')
                  ).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
