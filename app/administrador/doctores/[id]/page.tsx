'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, UserCheck, Stethoscope, MapPin, GraduationCap, Star, Calendar, Clock, Phone, Mail, Edit, BarChart3, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import DoctorScheduleCalendar from '@/components/doctor-schedule-calendar';

export default function DoctorPage() {
    const params = useParams();
    const router = useRouter();
    const doctorId = params.id as string;

    // Mock data para el doctor específico
    const doctorData = {
        id: doctorId,
        nombre: "JOSE CARLOS",
        apellidos: "CASTILLO",
        especialidad: "Ginecología",
        subespecialidad: "Oncología Ginecológica",
        consultorio: "Consultorio 1",
        estado: "activo",
        calificacion: 4.8,
        experiencia: 15,
        citasHoy: 8,
        pacientesAtendidos: 1250,
        telefono: "+51 987 654 321",
        email: "jose.castillo@clinica.com",
        horarioTrabajo: {
            dias: ["Lunes", "Miércoles", "Viernes"],
            horario: "08:00 - 17:00"
        },
        descripcion: "Especialista en ginecología con amplia experiencia en oncología ginecológica. Graduado de la Universidad Nacional Mayor de San Marcos con especialización en el extranjero."
    };

    const handleVolver = () => {
        router.push('/administrador/doctores');
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header con botón de regreso */}
            <div className="flex items-center gap-4 mb-6">
                <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleVolver}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver a Doctores
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-foreground">
                        Dr. {doctorData.nombre} {doctorData.apellidos}
                    </h1>
                    <p className="text-muted-foreground">
                        Perfil detallado del doctor
                    </p>
                </div>
            </div>

            {/* Tabs de Navegación */}
            <Tabs defaultValue="informacion" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="informacion" className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4" />
                        Información
                    </TabsTrigger>
                    <TabsTrigger value="horarios" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Horarios
                    </TabsTrigger>
                    <TabsTrigger value="estadisticas" className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Estadísticas
                    </TabsTrigger>
                </TabsList>

                {/* Tab: Información */}
                <TabsContent value="informacion" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Información Básica */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <UserCheck className="h-5 w-5" />
                                    Información Personal
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">Especialidad</label>
                                        <div className="flex items-center gap-2">
                                            <Stethoscope className="h-4 w-4 text-primary" />
                                            <span className="font-medium">{doctorData.especialidad}</span>
                                            {doctorData.subespecialidad && (
                                                <span className="text-muted-foreground">- {doctorData.subespecialidad}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">Consultorio</label>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-primary" />
                                            <span className="font-medium">{doctorData.consultorio}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">Experiencia</label>
                                        <div className="flex items-center gap-2">
                                            <GraduationCap className="h-4 w-4 text-primary" />
                                            <span className="font-medium">{doctorData.experiencia} años</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">Calificación</label>
                                        <div className="flex items-center gap-2">
                                            <Star className="h-4 w-4 text-yellow-500" />
                                            <span className="font-medium">{doctorData.calificacion}/5.0</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Descripción</label>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {doctorData.descripcion}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Estadísticas y Estado */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Estado Actual
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Estado</span>
                                        <Badge variant={doctorData.estado === 'activo' ? 'default' : 'secondary'}>
                                            {doctorData.estado}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Citas hoy</span>
                                        <span className="font-medium">{doctorData.citasHoy}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span  className="text-sm text-muted-foreground">Pacientes atendidos</span>
                                        <span className="font-medium">{doctorData.pacientesAtendidos}</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <h4 className="font-medium mb-3">Horario de Trabajo</h4>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-primary" />
                                            <span className="text-sm">{doctorData.horarioTrabajo.horario}</span>
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {doctorData.horarioTrabajo.dias.join(', ')}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <h4 className="font-medium mb-3">Contacto</h4>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-primary" />
                                            <span className="text-sm">{doctorData.telefono}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-primary" />
                                            <span className="text-sm">{doctorData.email}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Acciones */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Acciones</CardTitle>
                            <CardDescription>
                                Gestionar información del doctor
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-3">
                                <Button>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Editar Información
                                </Button>
                                <Button variant="outline">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Agregar Especialidad
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab: Horarios */}
                <TabsContent value="horarios">
                    <DoctorScheduleCalendar 
                        doctorId={doctorId} 
                        doctorName={`${doctorData.nombre} ${doctorData.apellidos}`}
                    />
                </TabsContent>

                {/* Tab: Estadísticas */}
                <TabsContent value="estadisticas" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />
                                Estadísticas del Doctor
                            </CardTitle>
                            <CardDescription>
                                Métricas y rendimiento del doctor
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-primary mb-2">1,250</div>
                                    <div className="text-sm text-muted-foreground">Pacientes Atendidos</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-600 mb-2">4.8</div>
                                    <div className="text-sm text-muted-foreground">Calificación Promedio</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-600 mb-2">15</div>
                                    <div className="text-sm text-muted-foreground">Años de Experiencia</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-yellow-600 mb-2">98%</div>
                                    <div className="text-sm text-muted-foreground">Satisfacción</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}