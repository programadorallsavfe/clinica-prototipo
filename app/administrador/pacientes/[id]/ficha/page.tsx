'use client';

import { use, useState } from 'react';
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

export default function FichaPacientePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const pacienteId = parseInt(id);
    const paciente = getPacienteById(pacienteId);
    const [isAlertasModalOpen, setIsAlertasModalOpen] = useState(false);
    const [isSignosVitalesModalOpen, setIsSignosVitalesModalOpen] = useState(false);
    const [isPrexistenciaModalOpen, setIsPrexistenciaModalOpen] = useState(false);


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
                                        <h3 className="text-lg font-semibold mb-3">Atención hoy</h3>
                                        <Card className="border-l-4 border-l-blue-500">
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Badge variant="secondary">#15794</Badge>
                                                            <span className="font-medium">Consulta GINECOLÓGICA</span>
                                                        </div>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm">
                                                            <div>
                                                                <span className="text-muted-foreground">Fecha:</span>
                                                                <span className="ml-2">18 OCT 2025 | 09:00 hs</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-muted-foreground">Profesional:</span>
                                                                <span className="ml-2">Dr. JOSE CARLOS CASTILLO</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-muted-foreground">Estado:</span>
                                                                <Badge className="ml-2 bg-green-100 text-green-800">
                                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                                    Atendido
                                                                </Badge>
                                                            </div>
                                                            <div>
                                                                <span className="text-muted-foreground">Recurso:</span>
                                                                <span className="ml-2">Sin asignar</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-bold">
                                                        1/1
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Atenciones pasadas */}
                                    <div>
                                        <h3 className="text-lg font-semibold mb-3">Atenciones pasadas</h3>
                                        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                                            <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                            <p>SIN ATENCIONES PASADAS</p>
                                        </div>
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