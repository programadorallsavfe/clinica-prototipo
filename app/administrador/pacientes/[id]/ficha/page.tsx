'use client';

import { use, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    ArrowLeft, 
    Plus, 
    Search, 
    Filter, 
    RefreshCw, 
    AlertTriangle, 
    Heart, 
    FileText, 
    Pill, 
    Image, 
    ClipboardList,
    Calendar,
    CreditCard,
    User,
    Phone,
    Mail,
    MapPin,
    Clock,
    Stethoscope,
    CheckCircle,
    Circle
} from "lucide-react";
import { getPacienteById } from "@/lib/mockData";
import { AddAlertasMedicasModal } from "@/components/modals/add-alertas-medicas-modal";
import { AddSignosVitalesModal } from "@/components/modals/add-signos-vitales-modal";
import { AddPrexistenciaMedicamentosModal } from "@/components/modals/add-prexistencia-medicamentos-modal";
import { AlertasMedicasCard } from "@/components/cards/alertas-medicas-card";
import { SignosVitalesCard } from "@/components/cards/signos-vitales-card";
import { AtencionCard } from "@/components/atencion-card";
import { AtencionMedica } from "@/lib/types";
import { useRouter } from 'next/navigation';

export default function FichaPacientePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const pacienteId = parseInt(id);
    const paciente = getPacienteById(pacienteId);
    const router = useRouter();
    const [isAlertasModalOpen, setIsAlertasModalOpen] = useState(false);
    const [isSignosVitalesModalOpen, setIsSignosVitalesModalOpen] = useState(false);
    const [isPrexistenciaModalOpen, setIsPrexistenciaModalOpen] = useState(false);
    const [atencionesHoy, setAtencionesHoy] = useState<AtencionMedica[]>([]);
    const [atencionesRecientes, setAtencionesRecientes] = useState<AtencionMedica[]>([]);

    // Cargar atenciones al montar el componente
    useEffect(() => {
        loadAtenciones();
    }, [pacienteId]);

    const loadAtenciones = () => {
        // Datos de ejemplo visuales - siempre se muestran
        const atencionesEjemplo: AtencionMedica[] = [
            {
                id: '15798',
                numero: '15798',
                pacienteId: pacienteId.toString(),
                tipo: 'Examen ECOGRAFIA OBSTETRICA',
                tipoCategoria: 'control',
                fecha: '22 OCT 2025',
                hora: '09:30 hrs',
                profesional: 'DR. JOSE CARLOS CASTILLO',
                estado: 'atendida',
                recurso: 'Sin asignar',
                sucursal: 'FEMINIS SALUD',
                convenio: 'Sin convenio',
                progreso: 100,
                totalAtenciones: 5,
                atencionActual: 2,
                controlEmbarazo: {
                    fase: 2,
                    semanas: 14,
                    trimestre: 2,
                    fechaUltimaRegla: '15 JUL 2025',
                    fechaProbableParto: '22 ABR 2026',
                    proximoControl: '15 NOV 2025',
                    observaciones: 'Control prenatal trimestre 2 - Ecografía morfológica'
                },
                etiquetas: ['Control prenatal', 'Trimestre 2', 'Ecografía'],
                evolucionClinica: 'Paciente gestante de 14 semanas. Ecografía morfológica dentro de parámetros normales.',
                ordenesMedicas: [
                    {
                        id: 1,
                        autor: 'Dr. Castillo',
                        fecha: '18/10/2025 - 09:45',
                        atencion: '#15798',
                        contenido: ['GLUCOSA EN SANGRE', 'HEMOGLOBINA Y HEMATOCRITO']
                    }
                ],
                prescripciones: [
                    {
                        id: 1,
                        autor: 'Dr. Castillo',
                        fecha: '18/10/2025 - 09:50',
                        atencion: '#15798',
                        contenido: ['ÁCIDO FÓLICO 5mg - 1 tableta diaria']
                    }
                ],
                fechaCreacion: new Date().toISOString(),
                creadoPor: 'admin'
            },
            {
                id: '15794',
                numero: '15794',
                pacienteId: pacienteId.toString(),
                tipo: 'Consulta Ginecológica',
                tipoCategoria: 'consulta',
                fecha: '22 OCT 2025',
                hora: '08:00 hrs',
                profesional: 'DR. JOSE CARLOS CASTILLO',
                estado: 'atendida',
                recurso: 'Sin asignar',
                sucursal: 'FEMINIS SALUD',
                convenio: 'Sin convenio',
                progreso: 100,
                totalAtenciones: 1,
                atencionActual: 1,
                etiquetas: ['Primera consulta', 'Confirmación embarazo'],
                evolucionClinica: 'Paciente refiere amenorrea de 8 semanas. Test de embarazo positivo.',
                fechaCreacion: new Date().toISOString(),
                creadoPor: 'admin'
            },
            {
                id: '15750',
                numero: '15750',
                pacienteId: pacienteId.toString(),
                tipo: 'Control Prenatal - Fase 1',
                tipoCategoria: 'control',
                fecha: '10 OCT 2025',
                hora: '11:00 hrs',
                profesional: 'DR. JOSE CARLOS CASTILLO',
                estado: 'atendida',
                recurso: 'Consultorio 1',
                sucursal: 'FEMINIS SALUD',
                convenio: 'Sin convenio',
                progreso: 100,
                totalAtenciones: 5,
                atencionActual: 1,
                controlEmbarazo: {
                    fase: 1,
                    semanas: 10,
                    trimestre: 1,
                    fechaUltimaRegla: '15 JUL 2025',
                    fechaProbableParto: '22 ABR 2026',
                    proximoControl: '22 OCT 2025',
                    observaciones: 'Primer control prenatal'
                },
                etiquetas: ['Control prenatal', 'Trimestre 1'],
                fechaCreacion: new Date().toISOString(),
                creadoPor: 'admin'
            },
            {
                id: '15725',
                numero: '15725',
                pacienteId: pacienteId.toString(),
                tipo: 'Consulta por Síntomas',
                tipoCategoria: 'consulta',
                fecha: '25 SEP 2025',
                hora: '14:30 hrs',
                profesional: 'DR. JOSE CARLOS CASTILLO',
                estado: 'atendida',
                recurso: 'Consultorio 1',
                sucursal: 'FEMINIS SALUD',
                convenio: 'Sin convenio',
                progreso: 100,
                totalAtenciones: 1,
                atencionActual: 1,
                etiquetas: ['Consulta general'],
                fechaCreacion: new Date().toISOString(),
                creadoPor: 'admin'
            }
        ];

        // Para visualización: filtrar "hoy" y "recientes"
        const hoyFiltradas = atencionesEjemplo.filter(a => a.fecha === '22 OCT 2025');
        const recientesFiltradas = atencionesEjemplo.filter(a => 
            a.fecha === '10 OCT 2025' || a.fecha === '25 SEP 2025' || a.fecha === '22 OCT 2025'
        );

        setAtencionesHoy(hoyFiltradas);
        setAtencionesRecientes(recientesFiltradas);
    };

    const handleAtencionClick = (atencionId: string) => {
        router.push(`/administrador/pacientes/${pacienteId}/ficha/atencion/${atencionId}`);
    };


    if (!paciente) {
        return (
            <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                    <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver
                    </Button>
                </div>
                <Card>
                    <CardContent className="p-6">
                        <p className="text-center text-muted-foreground">Paciente no encontrado</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header principal */}
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver
                </Button>
            </div>

            {/* Encabezado de paciente */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
                            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <User className="h-8 w-8 text-primary" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h1 className="text-xl sm:text-2xl font-bold truncate">{paciente.nombre} {paciente.apellidos}</h1>
                                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-sm text-muted-foreground">
                                    <span><strong>ID:</strong> {paciente.id}</span>
                                    <span><strong>Edad:</strong> 35 años</span>
                                    <span><strong>Sexo:</strong> Femenino</span>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Phone className="h-3 w-3" />
                                        {paciente.telefono}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Mail className="h-3 w-3" />
                                        {paciente.email}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            <Button className="bg-primary text-primary-foreground w-full sm:w-auto">
                                <Calendar className="h-4 w-4 mr-2" />
                                Dar cita
                            </Button>
                            <Button variant="outline" className="text-green-600 border-green-600 hover:bg-green-50 w-full sm:w-auto">
                                <CreditCard className="h-4 w-4 mr-2" />
                                Recibir pago
                            </Button>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Tabs de navegación */}
            <Tabs defaultValue="ficha-clinica" className="w-full">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-5">
                    <TabsTrigger value="datos-administrativos" className="text-xs sm:text-sm">Datos administrativos</TabsTrigger>
                    <TabsTrigger value="antecedentes-medicos" className="text-xs sm:text-sm">Antecedentes médicos</TabsTrigger>
                    <TabsTrigger value="ficha-clinica" className="text-xs sm:text-sm">Ficha clínica</TabsTrigger>
                    <TabsTrigger value="facturacion-pagos" className="text-xs sm:text-sm">Facturación y pagos</TabsTrigger>
                </TabsList>

                <TabsContent value="ficha-clinica" className="mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
                        {/* Panel izquierdo - Navegación médica */}
                        <div className="lg:col-span-3 order-2 lg:order-1">
                            <div className="space-y-4">
                                {/* Alertas médicas */}
                                <AlertasMedicasCard 
                                    pacienteId={pacienteId}
                                    onAddAlerta={() => setIsAlertasModalOpen(true)}
                                />

                                {/* Signos vitales */}
                                <SignosVitalesCard 
                                    pacienteId={pacienteId}
                                    onAddSignos={() => setIsSignosVitalesModalOpen(true)}
                                />

                                {/* Navegación médica */}
                                <Card>
                                    <CardContent className="p-2">
                                        <div className="space-y-1">
                                            <Button variant="ghost" className="w-full justify-start h-8 text-xs bg-accent/50 text-accent-foreground hover:bg-accent/70 transition-colors">
                                                <Heart className="h-3 w-3 mr-2 flex-shrink-0" />
                                                Signos vitales
                                            </Button>
                                            <Button variant="ghost" className="w-full justify-start h-8 text-xs hover:bg-accent/30 transition-colors">
                                                <FileText className="h-3 w-3 mr-2 flex-shrink-0" />
                                                Órdenes médicas
                                            </Button>
                                            <Button variant="ghost" className="w-full justify-start h-8 text-xs hover:bg-accent/30 transition-colors">
                                                <Pill className="h-3 w-3 mr-2 flex-shrink-0" />
                                                Prescripciones
                                            </Button>
                                            <Button variant="ghost" className="w-full justify-start h-8 text-xs hover:bg-accent/30 transition-colors">
                                                <Image className="h-3 w-3 mr-2 flex-shrink-0" />
                                                Imágenes y Docs.
                                            </Button>
                                            <Button variant="ghost" className="w-full justify-start h-8 text-xs hover:bg-accent/30 transition-colors">
                                                <ClipboardList className="h-3 w-3 mr-2 flex-shrink-0" />
                                                Datos clínicos
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                className="w-full justify-start h-8 text-xs hover:bg-accent/30 transition-colors"
                                                onClick={() => setIsPrexistenciaModalOpen(true)}
                                            >
                                                <Stethoscope className="h-3 w-3 mr-2 flex-shrink-0" />
                                                Preexistencias y medicación
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Panel central - Listado de atenciones */}
                        <div className="lg:col-span-9 order-1 lg:order-2">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>Historial de Atenciones</CardTitle>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm">
                                                <RefreshCw className="h-4 w-4" />
                                            </Button>
                                            <Button size="sm">
                                                <Plus className="h-4 w-4 mr-1" />
                                                Agregar
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2 mt-4">
                                        <div className="flex-1">
                                            <Input placeholder="Buscar..." className="w-full" />
                                        </div>
                                        <div className="flex gap-2">
                                            <Select>
                                                <SelectTrigger className="w-full sm:w-48">
                                                    <SelectValue placeholder="Mostrar todo" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Mostrar todo</SelectItem>
                                                    <SelectItem value="consulta">Consulta</SelectItem>
                                                    <SelectItem value="control">Control</SelectItem>
                                                    <SelectItem value="procedimiento">Procedimiento</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Button variant="outline" size="sm">
                                                <Filter className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {/* Próximas atenciones */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold mb-3">Próximas atenciones</h3>
                                        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                                            <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                            <p>SIN PRÓXIMAS ATENCIONES</p>
                                        </div>
                                    </div>

                                    {/* Atención hoy */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                            <Clock className="h-5 w-5 text-primary" />
                                            Atención hoy
                                        </h3>
                                        {atencionesHoy.length > 0 ? (
                                            <div className="space-y-3">
                                                {atencionesHoy.map((atencion) => (
                                                    <AtencionCard
                                                        key={atencion.id}
                                                        atencion={atencion}
                                                        pacienteId={pacienteId}
                                                        onClick={() => handleAtencionClick(atencion.id)}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg bg-muted/20">
                                                <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                                <p className="text-sm">Sin atenciones programadas para hoy</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Atenciones recientes */}
                                    <div>
                                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                            <FileText className="h-5 w-5 text-primary" />
                                            Atenciones recientes (últimos 30 días)
                                        </h3>
                                        {atencionesRecientes.length > 0 ? (
                                            <div className="space-y-3">
                                                {atencionesRecientes.map((atencion) => (
                                                    <AtencionCard
                                                        key={atencion.id}
                                                        atencion={atencion}
                                                        pacienteId={pacienteId}
                                                        onClick={() => handleAtencionClick(atencion.id)}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg bg-muted/20">
                                                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                                <p className="text-sm">No hay atenciones recientes</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="datos-administrativos" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Datos Administrativos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Información administrativa del paciente...</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="antecedentes-medicos" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Antecedentes Médicos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Historial médico del paciente...</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="facturacion-pagos" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Facturación y Pagos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Información financiera del paciente...</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Modal de Alertas Médicas */}
            <AddAlertasMedicasModal
                isOpen={isAlertasModalOpen}
                onClose={() => setIsAlertasModalOpen(false)}
                pacienteId={pacienteId}
                pacienteNombre={`${paciente.nombre} ${paciente.apellidos}`}
            />
            
            {/* Modal de Signos Vitales */}
            <AddSignosVitalesModal
                isOpen={isSignosVitalesModalOpen}
                onClose={() => setIsSignosVitalesModalOpen(false)}
                pacienteId={pacienteId}
                pacienteNombre={`${paciente.nombre} ${paciente.apellidos}`}
                edadPaciente={35} // Calcular edad real basada en fecha de nacimiento
            />
            
            {/* Modal de Preexistencias y Medicación */}
            <AddPrexistenciaMedicamentosModal
                isOpen={isPrexistenciaModalOpen}
                onClose={() => setIsPrexistenciaModalOpen(false)}
                pacienteId={pacienteId}
                pacienteNombre={`${paciente.nombre} ${paciente.apellidos}`}
            />
        </div>
    );
}