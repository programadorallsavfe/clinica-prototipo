'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Mail, 
  Stethoscope, 
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Baby,
  Heart,
  Pill
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Mock data para especialidades y doctores
const especialidades = [
  { id: '1', nombre: 'Ginecología', icono: Stethoscope, color: 'bg-pink-500', iconColor: 'text-pink-600' },
  { id: '2', nombre: 'Obstetricia', icono: Baby, color: 'bg-blue-500', iconColor: 'text-blue-600' },
  { id: '3', nombre: 'Pediatría', icono: User, color: 'bg-green-500', iconColor: 'text-green-600' },
  { id: '4', nombre: 'Cardiología', icono: Heart, color: 'bg-red-500', iconColor: 'text-red-600' },
  { id: '5', nombre: 'Dermatología', icono: Pill, color: 'bg-purple-500', iconColor: 'text-purple-600' }
];

const doctores = [
  { id: '1', nombre: 'Dr. María González', especialidad: '1', horarios: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'] },
  { id: '2', nombre: 'Dr. Carlos Ruiz', especialidad: '2', horarios: ['08:00', '09:30', '11:00', '13:00', '14:30', '16:00'] },
  { id: '3', nombre: 'Dra. Ana López', especialidad: '3', horarios: ['09:00', '10:30', '12:00', '15:00', '16:30'] },
  { id: '4', nombre: 'Dr. Pedro Martínez', especialidad: '4', horarios: ['08:30', '10:00', '11:30', '14:00', '15:30'] },
  { id: '5', nombre: 'Dra. Laura Sánchez', especialidad: '5', horarios: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'] }
];

const precios = {
  '1': 120, // Ginecología
  '2': 150, // Obstetricia
  '3': 100, // Pediatría
  '4': 180, // Cardiología
  '5': 110  // Dermatología
};

export default function AgendamientoOnlinePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState('');
  const [doctorSeleccionado, setDoctorSeleccionado] = useState('');
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | undefined>(undefined);
  const [horaSeleccionada, setHoraSeleccionada] = useState('');
  const [datosPaciente, setDatosPaciente] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    documento: '',
    fechaNacimiento: ''
  });
  const [citaConfirmada, setCitaConfirmada] = useState(false);

  // Generar fechas disponibles (próximos 30 días)
  const fechasDisponibles = useMemo(() => {
    const fechas = [];
    const hoy = new Date();
    for (let i = 1; i <= 30; i++) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() + i);
      fechas.push(fecha);
    }
    return fechas;
  }, []);

  // Función para verificar si una fecha está disponible
  const isDateAvailable = (date: Date) => {
    return fechasDisponibles.some(availableDate => 
      availableDate.toDateString() === date.toDateString()
    );
  };

  // Filtrar doctores por especialidad
  const doctoresFiltrados = useMemo(() => {
    if (!especialidadSeleccionada) return [];
    return doctores.filter(doctor => doctor.especialidad === especialidadSeleccionada);
  }, [especialidadSeleccionada]);

  // Obtener horarios disponibles del doctor seleccionado
  const horariosDisponibles = useMemo(() => {
    if (!doctorSeleccionado || !fechaSeleccionada) return [];
    const doctor = doctores.find(d => d.id === doctorSeleccionado);
    return doctor ? doctor.horarios : [];
  }, [doctorSeleccionado, fechaSeleccionada]);

  const especialidad = especialidades.find(e => e.id === especialidadSeleccionada);
  const doctor = doctores.find(d => d.id === doctorSeleccionado);
  const precio = especialidad ? precios[especialidad.id as keyof typeof precios] : 0;

  const handleSiguiente = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleAnterior = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleConfirmarCita = () => {
    // Simular confirmación de cita
    setCitaConfirmada(true);
    setStep(5);
  };

  const handleEnviarConfirmacion = (metodo: 'whatsapp' | 'email') => {
    // Simular envío de confirmación
    alert(`✅ Confirmación enviada por ${metodo === 'whatsapp' ? 'WhatsApp' : 'Email'}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <div className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              
                <Image
                  src="/logo_feminis.webp"
                  alt="Calendar"
                  width={144}
                  height={144}
                  className="object-contain"
                />
            
              <div>
                <h1 className="text-2xl font-bold text-foreground">Agendamiento Online</h1>
           
              </div>
            </div>
            <Badge 
              variant="outline" 
              className="text-primary border-primary cursor-pointer hover:bg-primary/10 transition-colors"
              onClick={() => router.push('/auth')}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Sistema interno
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > stepNumber ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Especialidad</span>
            <span>Doctor</span>
            <span>Fecha y Hora</span>
            <span>Datos</span>
          </div>
        </div>

        {/* Step 1: Selección de Especialidad */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-primary" />
                Selecciona una Especialidad
              </CardTitle>
              <CardDescription>
                Elige el tipo de consulta que necesitas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {especialidades.map((especialidad) => (
                  <Card 
                    key={especialidad.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md border-border ${
                      especialidadSeleccionada === especialidad.id 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setEspecialidadSeleccionada(especialidad.id)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className={`w-12 h-12 ${especialidad.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                        <especialidad.icono className={`h-6 w-6 text-white`} />
                      </div>
                      <h3 className="font-medium text-foreground">{especialidad.nombre}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        S/ {precios[especialidad.id as keyof typeof precios]}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="flex justify-end mt-6">
                <Button 
                  onClick={handleSiguiente}
                  disabled={!especialidadSeleccionada}
                >
                  Siguiente
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Selección de Doctor */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Selecciona un Doctor
              </CardTitle>
              <CardDescription>
                Especialistas disponibles en {especialidad?.nombre}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {doctoresFiltrados.map((doctor) => (
                  <Card 
                    key={doctor.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md border-border ${
                      doctorSeleccionado === doctor.id 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setDoctorSeleccionado(doctor.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground">{doctor.nombre}</h3>
                          <p className="text-sm text-muted-foreground">
                            {especialidad?.nombre} • {doctor.horarios.length} horarios disponibles
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-foreground">S/ {precio}</p>
                          <p className="text-xs text-muted-foreground">por consulta</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={handleAnterior}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Anterior
                </Button>
                <Button 
                  onClick={handleSiguiente}
                  disabled={!doctorSeleccionado}
                >
                  Siguiente
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Selección de Fecha y Hora */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
                Selecciona Fecha y Hora
              </CardTitle>
              <CardDescription>
                Horarios disponibles para {doctor?.nombre}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Calendario */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-semibold text-foreground">Seleccionar Fecha</Label>
                    <Badge variant="outline" className="text-xs">
                      {fechasDisponibles.length} fechas disponibles
                    </Badge>
                  </div>
                  
                  <Card className="border-border shadow-sm">
                    <CardContent className="p-6">
                      <Calendar
                        value={fechaSeleccionada}
                        onChange={(date) => setFechaSeleccionada(date || undefined)}
                        disabled={(date) => !isDateAvailable(date)}
                        minDate={new Date()}
                        maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                        className="w-full"
                      />
                    </CardContent>
                  </Card>
                  
                  {fechaSeleccionada && (
                    <Card className="bg-primary/5 border-primary/20">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium text-primary">
                              Fecha seleccionada
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {fechaSeleccionada.toLocaleDateString('es-ES', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Horarios */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-semibold text-foreground">Seleccionar Hora</Label>
                    {fechaSeleccionada && (
                      <Badge variant="outline" className="text-xs">
                        {horariosDisponibles.length} horarios disponibles
                      </Badge>
                    )}
                  </div>
                  
                  {fechaSeleccionada ? (
                    <Card className="border-border shadow-sm">
                      <CardContent className="p-6">
                        <div className="grid grid-cols-2 gap-3">
                          {horariosDisponibles.map((hora) => (
                            <Button
                              key={hora}
                              variant={horaSeleccionada === hora ? "default" : "outline"}
                              className={`justify-center h-12 border-border transition-all duration-200 ${
                                horaSeleccionada === hora 
                                  ? "bg-primary text-primary-foreground border-primary shadow-sm" 
                                  : "hover:bg-muted hover:border-border"
                              }`}
                              onClick={() => setHoraSeleccionada(hora)}
                            >
                              <Clock className="h-4 w-4 mr-2" />
                              <span className="font-medium">{hora}</span>
                            </Button>
                          ))}
                        </div>
                        
                        {horaSeleccionada && (
                          <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-success rounded-full"></div>
                              <div>
                                <p className="text-sm font-medium text-success">
                                  Hora seleccionada
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {horaSeleccionada} - {doctor?.nombre}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="border-border shadow-sm">
                      <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CalendarIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground mb-2">
                          Selecciona una fecha
                        </h3>
                        <p className="text-muted-foreground">
                          Elige una fecha disponible para ver los horarios del doctor
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-border">
                <Button 
                  variant="outline" 
                  onClick={handleAnterior} 
                  className="border-border hover:bg-muted px-6 py-2"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Anterior
                </Button>
                
                <div className="flex items-center gap-4">
                  {fechaSeleccionada && horaSeleccionada && (
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Resumen de selección</p>
                      <p className="text-sm font-medium text-foreground">
                        {fechaSeleccionada.toLocaleDateString('es-ES', { 
                          day: 'numeric', 
                          month: 'short' 
                        })} a las {horaSeleccionada}
                      </p>
                    </div>
                  )}
                  
                  <Button 
                    onClick={handleSiguiente}
                    disabled={!fechaSeleccionada || !horaSeleccionada}
                    className="px-6 py-2"
                  >
                    Siguiente
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Datos del Paciente */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Datos del Paciente
              </CardTitle>
              <CardDescription>
                Completa tu información para confirmar la cita
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="existente" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="existente">Paciente Existente</TabsTrigger>
                  <TabsTrigger value="nuevo">Nuevo Paciente</TabsTrigger>
                </TabsList>
                
                <TabsContent value="existente" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="documento">Número de Documento</Label>
                      <Input
                        id="documento"
                        placeholder="DNI, CE, etc."
                        value={datosPaciente.documento}
                        onChange={(e) => setDatosPaciente(prev => ({ ...prev, documento: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input
                        id="telefono"
                        placeholder="+51 999 999 999"
                        value={datosPaciente.telefono}
                        onChange={(e) => setDatosPaciente(prev => ({ ...prev, telefono: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Si eres paciente nuevo, selecciona la pestaña &quot;Nuevo Paciente&quot; para completar tu registro.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="nuevo" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nombre">Nombres</Label>
                      <Input
                        id="nombre"
                        placeholder="Tu nombre"
                        value={datosPaciente.nombre}
                        onChange={(e) => setDatosPaciente(prev => ({ ...prev, nombre: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="apellido">Apellidos</Label>
                      <Input
                        id="apellido"
                        placeholder="Tus apellidos"
                        value={datosPaciente.apellido}
                        onChange={(e) => setDatosPaciente(prev => ({ ...prev, apellido: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        value={datosPaciente.email}
                        onChange={(e) => setDatosPaciente(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input
                        id="telefono"
                        placeholder="+51 999 999 999"
                        value={datosPaciente.telefono}
                        onChange={(e) => setDatosPaciente(prev => ({ ...prev, telefono: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="documento">Documento de Identidad</Label>
                      <Input
                        id="documento"
                        placeholder="DNI, CE, etc."
                        value={datosPaciente.documento}
                        onChange={(e) => setDatosPaciente(prev => ({ ...prev, documento: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
                      <Input
                        id="fechaNacimiento"
                        type="date"
                        value={datosPaciente.fechaNacimiento}
                        onChange={(e) => setDatosPaciente(prev => ({ ...prev, fechaNacimiento: e.target.value }))}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Resumen de la Cita */}
              <Card className="mt-6 bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <h4 className="font-medium text-foreground mb-3">Resumen de tu Cita</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Especialidad:</span>
                      <span className="font-medium">{especialidad?.nombre}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Doctor:</span>
                      <span className="font-medium">{doctor?.nombre}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fecha:</span>
                      <span className="font-medium">
                        {fechaSeleccionada && fechaSeleccionada.toLocaleDateString('es-ES')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hora:</span>
                      <span className="font-medium">{horaSeleccionada}</span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-2">
                      <span className="text-muted-foreground">Precio:</span>
                      <span className="font-bold text-primary">S/ {precio}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={handleAnterior}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Anterior
                </Button>
                <Button onClick={handleConfirmarCita}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirmar Cita
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Confirmación y Envío */}
        {step === 5 && citaConfirmada && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                ¡Cita Confirmada!
              </CardTitle>
              <CardDescription>
                Tu cita ha sido agendada exitosamente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Detalles de la Cita */}
                <Card className="bg-success/10 border-success/20">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-success mb-3">
                      Detalles de tu Cita
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Código de Cita:</span>
                        <span className="font-mono font-medium">CIT-{Date.now().toString().slice(-6)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Especialidad:</span>
                        <span className="font-medium">{especialidad?.nombre}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Doctor:</span>
                        <span className="font-medium">{doctor?.nombre}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fecha:</span>
                        <span className="font-medium">
                          {fechaSeleccionada && fechaSeleccionada.toLocaleDateString('es-ES')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Hora:</span>
                        <span className="font-medium">{horaSeleccionada}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Opciones de Confirmación */}
                <div>
                  <h4 className="font-medium text-foreground mb-4">
                    Recibe la confirmación por:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button 
                      variant="outline" 
                      className="h-auto p-4 flex flex-col items-center gap-2 border-border hover:bg-muted"
                      onClick={() => handleEnviarConfirmacion('whatsapp')}
                    >
                      <Image
                        src="/whatsapp.svg"
                        alt="WhatsApp"
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                      <span className="font-medium">WhatsApp</span>
                      <span className="text-xs text-muted-foreground">
                        Enviar confirmación al {datosPaciente.telefono}
                      </span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-auto p-4 flex flex-col items-center gap-2 border-border hover:bg-muted"
                      onClick={() => handleEnviarConfirmacion('email')}
                    >
                      <Image
                        src="/gmail.svg"
                        alt="Gmail"
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                      <span className="font-medium">Email</span>
                      <span className="text-xs text-muted-foreground">
                        Enviar a {datosPaciente.email}
                      </span>
                    </Button>
                  </div>
                </div>

                {/* Información Adicional */}
                <Card className="bg-info/10 border-info/20">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-info mb-2">
                      Información Importante
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Llega 15 minutos antes de tu cita</li>
                      <li>• Trae tu documento de identidad</li>
                      <li>• Si necesitas cancelar, hazlo con 24 horas de anticipación</li>
                      <li>• El pago se realiza al momento de la consulta</li>
                    </ul>
                  </CardContent>
                </Card>

                <div className="flex justify-center">
                  <Button 
                    onClick={() => {
                      setStep(1);
                      setCitaConfirmada(false);
                      setEspecialidadSeleccionada('');
                      setDoctorSeleccionado('');
                      setFechaSeleccionada(undefined);
                      setHoraSeleccionada('');
                      setDatosPaciente({
                        nombre: '',
                        apellido: '',
                        email: '',
                        telefono: '',
                        documento: '',
                        fechaNacimiento: ''
                      });
                    }}
                    variant="outline"
                    className="border-border hover:bg-muted"
                  >
                    Agendar Otra Cita
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
