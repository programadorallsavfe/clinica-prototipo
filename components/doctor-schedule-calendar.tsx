'use client';

import { Calendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './doctor-schedule-calendar.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock, User, MapPin, CalendarDays } from 'lucide-react';
import { useState, useMemo } from 'react';

// Configurar moment en español
moment.locale('es');

const localizer = momentLocalizer(moment);

interface Event {
    id: string;
    title: string;
    start: Date;
    end: Date;
    resource?: {
        tipo: string;
        paciente?: string;
        consultorio: string;
        estado: string;
    };
}

interface DoctorScheduleCalendarProps {
    doctorId: string;
    doctorName: string;
}

// Función para generar eventos mock aleatorios
const generateMockEvents = (startDate: Date, endDate: Date): Event[] => {
    const events: Event[] = [];
    const pacientes = [
        'María González', 'Juan Pérez', 'Ana López', 'Carlos Ruiz', 'Laura Martínez',
        'Roberto Silva', 'Carmen Vega', 'Miguel Torres', 'Isabel Morales', 'Fernando Castro',
        'Patricia Jiménez', 'Antonio Herrera', 'Lucía Sánchez', 'Diego Ramírez', 'Elena Vargas'
    ];
    
    const tipos = ['Consulta', 'Revisión', 'Descanso'];
    const consultorios = ['Consultorio 1', 'Consultorio 2', 'Consultorio 3'];
    const estados = ['Programada', 'Confirmada', 'En Proceso', 'Completada'];
    
    const startMoment = moment(startDate);
    const endMoment = moment(endDate);
    
    for (let currentDate = startMoment.clone(); currentDate.isSameOrBefore(endMoment, 'day'); currentDate.add(1, 'day')) {
        // Generar entre 3-8 eventos por día
        const numEvents = Math.floor(Math.random() * 6) + 3;
        
        for (let i = 0; i < numEvents; i++) {
            // Horario de trabajo: 8:00 AM a 6:00 PM
            const startHour = Math.floor(Math.random() * 10) + 8; // 8-17
            const startMinute = Math.random() < 0.5 ? 0 : 30;
            const duration = Math.random() < 0.7 ? 30 : 60; // 30 o 60 minutos
            
            const start = moment(currentDate).hour(startHour).minute(startMinute).toDate();
            const end = moment(start).add(duration, 'minutes').toDate();
            
            const tipo = tipos[Math.floor(Math.random() * tipos.length)];
            const paciente = pacientes[Math.floor(Math.random() * pacientes.length)];
            const consultorio = consultorios[Math.floor(Math.random() * consultorios.length)];
            const estado = estados[Math.floor(Math.random() * estados.length)];
            
            let title = '';
            if (tipo === 'Descanso') {
                title = 'Descanso';
            } else {
                title = `${tipo} - ${paciente}`;
            }
            
            events.push({
                id: `${currentDate.format('YYYYMMDD')}-${i}`,
                title,
                start,
                end,
                resource: {
                    tipo,
                    paciente: tipo !== 'Descanso' ? paciente : undefined,
                    consultorio,
                    estado
                }
            });
        }
    }
    
    return events;
};

export default function DoctorScheduleCalendar({ doctorId, doctorName }: DoctorScheduleCalendarProps) {
    const [view, setView] = useState<View>('week');
    const [date, setDate] = useState(new Date());

    // Generar eventos mock dinámicamente basados en la fecha actual
    const events = useMemo(() => {
        const startDate = moment(date).startOf('month').subtract(7, 'days').toDate();
        const endDate = moment(date).endOf('month').add(7, 'days').toDate();
        return generateMockEvents(startDate, endDate);
    }, [date]);

    const eventStyleGetter = (event: Event) => {
        let className = 'consulta'; // Clase por defecto
        
        switch (event.resource?.tipo) {
            case 'Consulta':
                className = 'consulta';
                break;
            case 'Revisión':
                className = 'revision';
                break;
            case 'Descanso':
                className = 'descanso';
                break;
            default:
                className = 'consulta';
        }

        return {
            className: className,
            style: {
                borderRadius: 'var(--radius-sm)',
                opacity: 0.9,
                display: 'block',
                fontWeight: '500'
            }
        };
    };

    const handleSelectEvent = (event: Event) => {
        console.log('Evento seleccionado:', event);
        // Aquí podrías abrir un modal con detalles del evento
    };

    const handleSelectSlot = (slotInfo: { start: Date; end: Date; slots: Date[] }) => {
        console.log('Slot seleccionado:', slotInfo);
        // Aquí podrías abrir un modal para crear una nueva cita
    };

    const handleViewChange = (newView: View) => {
        setView(newView);
    };

    const CustomEvent = ({ event }: { event: Event }) => (
        <div className="p-1">
            <div className="font-medium text-sm truncate">{event.title}</div>
            {event.resource?.paciente && (
                <div className="text-xs opacity-90 flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {event.resource.paciente}
                </div>
            )}
            <div className="text-xs opacity-90 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {moment(event.start).format('HH:mm')} - {moment(event.end).format('HH:mm')}
            </div>
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
                                Horario del Dr. {doctorName}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Gestiona las citas y horarios del doctor
                            </p>
                        </div>
                        <Button className="bg-primary hover:bg-primary/90">
                            <Plus className="h-4 w-4 mr-2" />
                            Nueva Cita
                        </Button>
                    </div>
                </CardHeader>
            </Card>

            {/* Controles del Calendario */}
            <Card>
                <CardContent className="pt-6">
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
                            <span className="text-muted-foreground">Consultas</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded" style={{ backgroundColor: 'var(--success)' }}></div>
                            <span className="text-muted-foreground">Revisiones</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded" style={{ backgroundColor: 'var(--muted-foreground)' }}></div>
                            <span className="text-muted-foreground">Descansos</span>
                        </div>
                    </div>

                    {/* Calendario */}
                    <div className="h-[600px]">
                        <Calendar
                            localizer={localizer}
                            events={events}
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
                                <p className="text-sm text-muted-foreground">Citas Hoy</p>
                                <p className="text-2xl font-bold text-foreground">
                                    {events.filter(event => 
                                        moment(event.start).isSame(moment(), 'day') && 
                                        event.resource?.tipo !== 'Descanso'
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
                                <User className="h-4 w-4" style={{ color: 'var(--success)' }} />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Consultas (Semana)</p>
                                <p className="text-2xl font-bold text-foreground">
                                    {events.filter(event => 
                                        moment(event.start).isBetween(
                                            moment().startOf('week'), 
                                            moment().endOf('week'), 
                                            null, '[]'
                                        ) && 
                                        event.resource?.tipo === 'Consulta'
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
                                <Clock className="h-4 w-4" style={{ color: 'var(--warning)' }} />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Revisiones (Semana)</p>
                                <p className="text-2xl font-bold text-foreground">
                                    {events.filter(event => 
                                        moment(event.start).isBetween(
                                            moment().startOf('week'), 
                                            moment().endOf('week'), 
                                            null, '[]'
                                        ) && 
                                        event.resource?.tipo === 'Revisión'
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
                                <MapPin className="h-4 w-4" style={{ color: 'var(--info)' }} />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Eventos</p>
                                <p className="text-lg font-bold text-foreground">{events.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
