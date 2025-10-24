"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Stethoscope, 
  Phone, 
  Mail,
  Eye,
  Download,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  XCircle,
  CalendarDays,
  Filter,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import SolicitarCitaModal from '@/components/modals/solicitar-paciente-cita';

// Tipos para las citas del paciente
interface DatosCita {
  especialidad: string;
  doctor: string;
  fecha: Date;
  hora: string;
  tipoCita: string;
  motivoConsulta: string;
  observaciones?: string;
}
interface CitaPaciente {
  id: string;
  fecha: string;
  hora: string;
  especialidad: string;
  medico: string;
  estado: 'programada' | 'confirmada' | 'en_curso' | 'completada' | 'cancelada';
  tipo: 'consulta' | 'control' | 'emergencia' | 'seguimiento';
  motivo: string;
  observaciones?: string;
  telefonoMedico?: string;
  emailMedico?: string;
  direccion: string;
  duracion: number; // en minutos
  precio?: number;
  recordatorioEnviado: boolean;
}

export default function MiCitaPage() {
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroEspecialidad, setFiltroEspecialidad] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [showSolicitarCita, setShowSolicitarCita] = useState(false);

  // Mock data para citas del paciente
  const citasMock: CitaPaciente[] = [
    {
      id: '1',
      fecha: '2024-12-20',
      hora: '09:00',
      especialidad: 'Ginecología',
      medico: 'Dra. María González',
      estado: 'programada',
      tipo: 'consulta',
      motivo: 'Control prenatal - 28 semanas',
      observaciones: 'Traer resultados de laboratorio',
      telefonoMedico: '+51 987 654 321',
      emailMedico: 'maria.gonzalez@clinica.com',
      direccion: 'Av. Principal 123, Consultorio 201',
      duracion: 30,
      precio: 120,
      recordatorioEnviado: true
    },
    {
      id: '2',
      fecha: '2024-12-18',
      hora: '14:30',
      especialidad: 'Obstetricia',
      medico: 'Dr. Carlos Mendoza',
      estado: 'confirmada',
      tipo: 'control',
      motivo: 'Ecografía morfológica',
      telefonoMedico: '+51 987 123 456',
      emailMedico: 'carlos.mendoza@clinica.com',
      direccion: 'Av. Principal 123, Consultorio 105',
      duracion: 45,
      precio: 180,
      recordatorioEnviado: true
    },
    {
      id: '3',
      fecha: '2024-12-15',
      hora: '10:15',
      especialidad: 'Ginecología',
      medico: 'Dra. María González',
      estado: 'completada',
      tipo: 'consulta',
      motivo: 'Consulta de rutina',
      observaciones: 'Paciente en buen estado general',
      telefonoMedico: '+51 987 654 321',
      emailMedico: 'maria.gonzalez@clinica.com',
      direccion: 'Av. Principal 123, Consultorio 201',
      duracion: 30,
      precio: 120,
      recordatorioEnviado: false
    },
    {
      id: '4',
      fecha: '2024-12-22',
      hora: '16:00',
      especialidad: 'Nutrición',
      medico: 'Lic. Ana Torres',
      estado: 'programada',
      tipo: 'seguimiento',
      motivo: 'Control nutricional prenatal',
      telefonoMedico: '+51 987 789 012',
      emailMedico: 'ana.torres@clinica.com',
      direccion: 'Av. Principal 123, Consultorio 301',
      duracion: 25,
      precio: 80,
      recordatorioEnviado: false
    },
    {
      id: '5',
      fecha: '2024-12-10',
      hora: '11:30',
      especialidad: 'Obstetricia',
      medico: 'Dr. Carlos Mendoza',
      estado: 'cancelada',
      tipo: 'consulta',
      motivo: 'Control prenatal',
      observaciones: 'Cancelada por emergencia médica',
      telefonoMedico: '+51 987 123 456',
      emailMedico: 'carlos.mendoza@clinica.com',
      direccion: 'Av. Principal 123, Consultorio 105',
      duracion: 30,
      precio: 120,
      recordatorioEnviado: false
    }
  ];

  // Filtrar citas
  const citasFiltradas = citasMock.filter(cita => {
    const cumpleEstado = filtroEstado === 'todos' || cita.estado === filtroEstado;
    const cumpleEspecialidad = filtroEspecialidad === 'todos' || cita.especialidad === filtroEspecialidad;
    const cumpleBusqueda = busqueda === '' || 
      cita.medico.toLowerCase().includes(busqueda.toLowerCase()) ||
      cita.especialidad.toLowerCase().includes(busqueda.toLowerCase()) ||
      cita.motivo.toLowerCase().includes(busqueda.toLowerCase());
    
    return cumpleEstado && cumpleEspecialidad && cumpleBusqueda;
  });

  // Separar citas por estado
  const citasProgramadas = citasFiltradas.filter(cita => 
    cita.estado === 'programada' || cita.estado === 'confirmada'
  );
  const citasCompletadas = citasFiltradas.filter(cita => cita.estado === 'completada');
  const citasCanceladas = citasFiltradas.filter(cita => cita.estado === 'cancelada');

  // Función para obtener el color del estado
  const getEstadoColor = (estado: string) => {
    const colores: Record<string, string> = {
      programada: 'bg-blue-100 text-blue-800 border-blue-200',
      confirmada: 'bg-green-100 text-green-800 border-green-200',
      en_curso: 'bg-orange-100 text-orange-800 border-orange-200',
      completada: 'bg-gray-100 text-gray-800 border-gray-200',
      cancelada: 'bg-red-100 text-red-800 border-red-200'
    };
    return colores[estado] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Función para obtener el icono del estado
  const getEstadoIcon = (estado: string) => {
    const iconos: Record<string, React.ReactElement> = {
      programada: <Calendar className="h-4 w-4" />,
      confirmada: <CheckCircle className="h-4 w-4" />,
      en_curso: <Clock className="h-4 w-4" />,
      completada: <CheckCircle className="h-4 w-4" />,
      cancelada: <XCircle className="h-4 w-4" />
    };
    return iconos[estado] || <AlertCircle className="h-4 w-4" />;
  };

  // Función para formatear fecha
  const formatearFecha = (fecha: string) => {
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Función para manejar la solicitud de cita
  const handleSolicitarCita = (datosCita: DatosCita) => {
    console.log('Solicitud de cita:', datosCita);
    // Aquí se podría enviar la solicitud al backend
    // Por ahora solo mostramos un mensaje de confirmación
    alert('Solicitud de cita enviada correctamente. Te contactaremos pronto para confirmar.');
  };

  // Componente para mostrar una cita
  const CitaCard = ({ cita }: { cita: CitaPaciente }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold text-foreground">
              {cita.especialidad}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {cita.medico}
            </p>
          </div>
          <Badge className={`${getEstadoColor(cita.estado)} flex items-center gap-1`}>
            {getEstadoIcon(cita.estado)}
            {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="font-medium">Fecha:</span>
              <span>{formatearFecha(cita.fecha)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              <span className="font-medium">Hora:</span>
              <span>{cita.hora}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="font-medium">Ubicación:</span>
              <span>{cita.direccion}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Stethoscope className="h-4 w-4 text-primary" />
              <span className="font-medium">Tipo:</span>
              <span className="capitalize">{cita.tipo}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              <span className="font-medium">Duración:</span>
              <span>{cita.duracion} min</span>
            </div>
            {cita.precio && (
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Costo:</span>
                <span className="text-primary font-semibold">S/ {cita.precio}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="border-t pt-3">
          <p className="text-sm text-muted-foreground mb-2">
            <span className="font-medium">Motivo:</span> {cita.motivo}
          </p>
          {cita.observaciones && (
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Observaciones:</span> {cita.observaciones}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {cita.telefonoMedico && (
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                <span>{cita.telefonoMedico}</span>
              </div>
            )}
            {cita.emailMedico && (
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                <span>{cita.emailMedico}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-1" />
              Ver Detalles
            </Button>
            {cita.estado === 'completada' && (
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Descargar
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mis Citas</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona y visualiza todas tus citas médicas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-1" />
            Actualizar
          </Button>
          <Button size="sm" onClick={() => setShowSolicitarCita(true)}>
            <CalendarDays className="h-4 w-4 mr-1" />
            Solicitar Cita
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por médico, especialidad o motivo..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="todos">Todos los estados</option>
                <option value="programada">Programada</option>
                <option value="confirmada">Confirmada</option>
                <option value="en_curso">En Curso</option>
                <option value="completada">Completada</option>
                <option value="cancelada">Cancelada</option>
              </select>
              <select
                value={filtroEspecialidad}
                onChange={(e) => setFiltroEspecialidad(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="todos">Todas las especialidades</option>
                <option value="Ginecología">Ginecología</option>
                <option value="Obstetricia">Obstetricia</option>
                <option value="Nutrición">Nutrición</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Próximas</p>
                <p className="text-2xl font-bold text-foreground">
                  {citasProgramadas.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completadas</p>
                <p className="text-2xl font-bold text-foreground">
                  {citasCompletadas.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Canceladas</p>
                <p className="text-2xl font-bold text-foreground">
                  {citasCanceladas.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Stethoscope className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-foreground">
                  {citasFiltradas.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs para organizar las citas */}
      <Tabs defaultValue="todas" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="todas">Todas ({citasFiltradas.length})</TabsTrigger>
          <TabsTrigger value="programadas">Programadas ({citasProgramadas.length})</TabsTrigger>
          <TabsTrigger value="completadas">Completadas ({citasCompletadas.length})</TabsTrigger>
          <TabsTrigger value="canceladas">Canceladas ({citasCanceladas.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="todas" className="space-y-4">
          {citasFiltradas.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No se encontraron citas
                </h3>
                <p className="text-muted-foreground">
                  No hay citas que coincidan con los filtros seleccionados.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {citasFiltradas.map((cita) => (
                <CitaCard key={cita.id} cita={cita} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="programadas" className="space-y-4">
          {citasProgramadas.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No hay citas programadas
                </h3>
                <p className="text-muted-foreground">
                  No tienes citas programadas en este momento.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {citasProgramadas.map((cita) => (
                <CitaCard key={cita.id} cita={cita} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completadas" className="space-y-4">
          {citasCompletadas.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No hay citas completadas
                </h3>
                <p className="text-muted-foreground">
                  Aún no tienes citas completadas.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {citasCompletadas.map((cita) => (
                <CitaCard key={cita.id} cita={cita} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="canceladas" className="space-y-4">
          {citasCanceladas.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <XCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No hay citas canceladas
                </h3>
                <p className="text-muted-foreground">
                  No tienes citas canceladas.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {citasCanceladas.map((cita) => (
                <CitaCard key={cita.id} cita={cita} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modal para solicitar cita */}
      <SolicitarCitaModal
        isOpen={showSolicitarCita}
        onClose={() => setShowSolicitarCita(false)}
        onSolicitarCita={handleSolicitarCita}
      />
    </div>
  );
}
