'use client';

import { use, useState } from 'react';

// TypeScript interfaces
interface ControlEmbarazo {
    fase: number;
    semanas: number;
    trimestre: number;
    fechaUltimaRegla: string;
    fechaProbableParto: string;
    proximoControl: string;
    observaciones: string;
}

interface OrdenMedica {
    id: number;
    autor: string;
    fecha: string;
    atencion: string;
    contenido: string[];
}

interface Prescripcion {
    id: number;
    autor: string;
    fecha: string;
    atencion: string;
    contenido: string[];
}

interface AtencionData {
    id: string;
    numero: string;
    tipo: string;
    fecha: string;
    hora: string;
    profesional: string;
    estado: string;
    recurso: string;
    sucursal: string;
    convenio: string;
    progreso: number;
    totalAtenciones: number;
    atencionActual: number;
    controlEmbarazo?: ControlEmbarazo;
    evolucionClinica: string;
    ordenesMedicas: OrdenMedica[];
    prescripciones: Prescripcion[];
}
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
    ArrowLeft, 
    Plus, 
    ChevronDown,
    ChevronUp,
    Printer,
    Mail,
    MoreHorizontal,
    CheckCircle,
    Clock,
    User,
    MapPin,
    FileText,
    ClipboardList,
    Pill,
    Image,
    Download,
    Send,
    Eye,
    Calendar,
    Stethoscope,
    Heart,
    AlertCircle,
    MailIcon,
    CreditCard,
    Edit,
    Save,
    X
} from "lucide-react";

export default function AtencionDetallePage({ params }: { params: Promise<{ id: string, atencionId: string }> }) {
    const { id, atencionId } = use(params);
    const pacienteId = parseInt(id);
    const [activeTab, setActiveTab] = useState("datos-clinicos");
    const [openSections, setOpenSections] = useState({
        antecedentes: true,
        evolucion: true,
        notas: false,
        ordenes: true,
        prescripciones: true,
        imagenes: false,
        documentos: false,
        consentimientos: false
    });
    const [isEditing, setIsEditing] = useState({
        evolucion: false,
        ordenes: false,
        prescripciones: false
    });

    // Base de datos visual de atenciones
    const atencionesDB: Record<string, AtencionData> = {
        '15798': {
            id: '15798',
            numero: '15798',
            tipo: 'Examen ECOGRAFIA OBSTETRICA',
            fecha: '22 OCT 2025',
            hora: '09:30 hrs',
            profesional: 'DR. JOSE CARLOS CASTILLO',
            estado: 'Atendido',
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
            evolucionClinica: 'Paciente gestante de 14 semanas. Ecografía morfológica dentro de parámetros normales. Frecuencia cardíaca fetal: 145 lpm. Movimientos fetales presentes. Líquido amniótico normal. Placenta ubicada en cara anterior. No se observan anomalías estructurales evidentes en este momento.',
            ordenesMedicas: [
                {
                    id: 1,
                    autor: 'Dr. Castillo',
                    fecha: '22/10/2025 - 09:45',
                    atencion: '#15798',
                    contenido: [
                        'GLUCOSA EN SANGRE',
                        'HEMOGLOBINA Y HEMATOCRITO',
                        'GRUPO SANGUÍNEO Y FACTOR RH',
                        'PERFIL DE COAGULACIÓN'
                    ]
                }
            ],
            prescripciones: [
                {
                    id: 1,
                    autor: 'Dr. Castillo',
                    fecha: '22/10/2025 - 09:50',
                    atencion: '#15798',
                    contenido: [
                        'ÁCIDO FÓLICO 5mg - 1 tableta diaria',
                        'SULFATO FERROSO 300mg - 1 cápsula diaria',
                        'CALCIO 600mg - 1 tableta cada 12 horas',
                        'Control prenatal en 4 semanas'
                    ]
                }
            ]
        },
        '15794': {
            id: '15794',
            numero: '15794',
            tipo: 'Consulta Ginecológica',
            fecha: '22 OCT 2025',
            hora: '08:00 hrs',
            profesional: 'DR. JOSE CARLOS CASTILLO',
            estado: 'Atendido',
            recurso: 'Sin asignar',
            sucursal: 'FEMINIS SALUD',
            convenio: 'Sin convenio',
            progreso: 100,
            totalAtenciones: 1,
            atencionActual: 1,
            evolucionClinica: 'Paciente refiere amenorrea de 8 semanas. Test de embarazo positivo. Se confirma embarazo por ecografía transvaginal. Embrión único viable de 8.2 semanas por LCN. Frecuencia cardíaca: 165 lpm. Sin complicaciones evidentes.',
            ordenesMedicas: [
                {
                    id: 1,
                    autor: 'Dr. Administrador',
                    fecha: '22/10/2025 - 08:38',
                    atencion: '#15794',
                    contenido: [
                        'PERFIL TIROIDEO (TSH, T3, T4)',
                        'EXAMEN DE ORINA COMPLETO',
                        'UROCULTIVO'
                    ]
                }
            ],
            prescripciones: [
                {
                    id: 1,
                    autor: 'Administrador',
                    fecha: '22/10/2025 - 08:40',
                    atencion: '#15794',
                    contenido: [
                        'ÁCIDO FÓLICO 5mg - 1 tableta diaria en ayunas',
                        'Evitar automedicación',
                        'Reposo relativo',
                        'Control en 4 semanas'
                    ]
                }
            ]
        }
    };

    // Obtener datos de la atención actual
    const atencionData = atencionesDB[atencionId] || atencionesDB['15794'];

    const [editableContent, setEditableContent] = useState({
        evolucion: atencionData.evolucionClinica || '',
        ordenes: atencionData.ordenesMedicas?.[0]?.contenido?.join('\n') || '',
        prescripciones: atencionData.prescripciones?.[0]?.contenido?.join('\n') || ''
    });

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handleEdit = (section: keyof typeof isEditing) => {
        setIsEditing(prev => ({ ...prev, [section]: true }));
    };

    const handleSave = (section: keyof typeof isEditing) => {
        setIsEditing(prev => ({ ...prev, [section]: false }));
        // Aquí se podría guardar en el backend
    };

    const handleCancel = (section: keyof typeof isEditing) => {
        setIsEditing(prev => ({ ...prev, [section]: false }));
    };

    const handleContentChange = (section: keyof typeof editableContent, value: string) => {
        setEditableContent(prev => ({ ...prev, [section]: value }));
    };

    return (
        <div className="min-h-screen bg-background">
            {/* 🧭 Navegación superior */}
            <div className="border-b border-border bg-card sticky top-0 z-10">
                <div className="container mx-auto px-4 sm:px-6 py-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => window.history.back()}
                                className="text-muted-foreground hover:text-foreground shrink-0"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Volver a Ficha
                            </Button>
                            <Separator orientation="vertical" className="h-6 hidden sm:block" />
                            <div className="min-w-0 flex-1">
                                <div className="text-xs sm:text-sm text-muted-foreground hidden lg:block truncate">
                                    Administrador / Pacientes 
                                </div>
                                <h1 className="text-lg sm:text-xl font-semibold text-foreground truncate">
                                    Atención #{atencionData.numero}
                                </h1>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto">
                            <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                                <Printer className="h-4 w-4 mr-1 sm:mr-2" />
                                <span className="hidden sm:inline">Imprimir</span>
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                                <Send className="h-4 w-4 mr-1 sm:mr-2" />
                                <span className="hidden sm:inline">Compartir</span>
                            </Button>
                            <Button variant="outline" size="sm" className="shrink-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🧩 1️⃣ Encabezado principal de atención */}
            <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
                <Card className="border-l-4 border-l-primary mb-4 sm:mb-6">
                    <CardContent className="p-4 sm:p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
                            {/* Información de fecha y hora */}
                            <div className="lg:col-span-1">
                                <div className="bg-primary text-primary-foreground p-4 sm:p-6 rounded-lg text-center">
                                    <div className="text-xl sm:text-2xl font-bold mb-1">{atencionData.fecha}</div>
                                    <div className="text-xs sm:text-sm opacity-90">{atencionData.hora}</div>
                                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-primary-foreground/20">
                                        <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground text-xs">
                                            <CheckCircle className="h-3 w-3 mr-1" />
                                            {atencionData.estado}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Información principal */}
                            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                                <div>
                                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-2 break-words">
                                        {atencionData.tipo}
                                    </h2>
                                    <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                            <span className="text-muted-foreground shrink-0">Profesional:</span>
                                            <span className="font-medium break-words">{atencionData.profesional}</span>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                            <span className="text-muted-foreground shrink-0">Recurso:</span>
                                            <span className="font-medium break-words">{atencionData.recurso}</span>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                            <span className="text-muted-foreground shrink-0">Sucursal:</span>
                                            <span className="font-medium text-primary cursor-pointer hover:underline break-words">
                                                {atencionData.sucursal}
                                            </span>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                            <span className="text-muted-foreground shrink-0">Convenio:</span>
                                            <span className="font-medium text-primary cursor-pointer hover:underline break-words">
                                                {atencionData.convenio}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Progreso circular */}
                            <div className="lg:col-span-1 flex justify-center lg:justify-end">
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                                        <span className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">
                                            {atencionData.atencionActual}/{atencionData.totalAtenciones}
                                        </span>
                                    </div>
                                    <div className="text-xs sm:text-sm font-medium text-primary text-center">
                                        Progreso: {atencionData.progreso}%
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 🧩 Línea de Tiempo de Controles Prenatales */}
                {atencionData.controlEmbarazo && (
                    <Card className="mb-4 sm:mb-6 bg-accent/30 border-primary/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                <Heart className="h-5 w-5 text-primary" />
                                Control Prenatal - Trimestre {atencionData.controlEmbarazo.trimestre}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Información del embarazo */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-card rounded-lg border border-border">
                                <div>
                                    <div className="text-xs text-muted-foreground mb-1">Semanas</div>
                                    <div className="text-lg font-bold text-primary">
                                        {atencionData.controlEmbarazo.semanas} sem
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground mb-1">Fase actual</div>
                                    <div className="text-lg font-bold text-info">
                                        Fase {atencionData.controlEmbarazo.fase}
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <div className="text-xs text-muted-foreground mb-1">Fecha probable de parto</div>
                                    <div className="text-sm font-semibold text-foreground">
                                        {atencionData.controlEmbarazo.fechaProbableParto || 'No registrado'}
                                    </div>
                                </div>
                            </div>

                            {/* Línea de tiempo de controles */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-sm font-semibold text-foreground">Línea de Tiempo de Controles</h4>
                                    <Badge variant="outline" className="text-xs">
                                        Control {atencionData.atencionActual} de {atencionData.totalAtenciones}
                                    </Badge>
                                </div>
                                
                                {/* Timeline visual */}
                                <div className="relative">
                                    {/* Línea de fondo */}
                                    <div className="absolute top-6 left-0 right-0 h-1 bg-muted rounded-full" />
                                    
                                    {/* Línea de progreso */}
                                    <div 
                                        className="absolute top-6 left-0 h-1 bg-primary rounded-full transition-all duration-500"
                                        style={{ width: `${(atencionData.atencionActual / atencionData.totalAtenciones) * 100}%` }}
                                    />
                                    
                                    {/* Puntos de control */}
                                    <div className="relative flex justify-between">
                                        {Array.from({ length: atencionData.totalAtenciones }, (_, i) => {
                                            const fase = i + 1;
                                            const isCompleted = fase <= atencionData.atencionActual;
                                            const isCurrent = fase === atencionData.atencionActual;
                                            
                                            return (
                                                <div key={fase} className="flex flex-col items-center">
                                                    <div 
                                                        className={`
                                                            w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold
                                                            border-4 transition-all duration-300 z-10
                                                            ${isCurrent 
                                                                ? 'bg-primary text-primary-foreground border-background scale-110 shadow-lg shadow-primary/20' 
                                                                : isCompleted 
                                                                ? 'bg-success text-success-foreground border-background' 
                                                                : 'bg-muted text-muted-foreground border-background'
                                                            }
                                                        `}
                                                    >
                                                        {isCompleted ? <CheckCircle className="h-5 w-5" /> : fase}
                                                    </div>
                                                    <div className="mt-2 text-center">
                                                        <div className={`text-xs font-semibold ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`}>
                                                            Fase {fase}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground mt-1">
                                                            {fase === 1 && '8-12 sem'}
                                                            {fase === 2 && '14-18 sem'}
                                                            {fase === 3 && '22-26 sem'}
                                                            {fase === 4 && '32-34 sem'}
                                                            {fase === 5 && '38-40 sem'}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Próximo control */}
                            {atencionData.controlEmbarazo.proximoControl && (
                                <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-primary/20">
                                    <Calendar className="h-5 w-5 text-primary shrink-0" />
                                    <div>
                                        <div className="text-xs text-muted-foreground">Próximo Control</div>
                                        <div className="text-sm font-semibold text-foreground">
                                            {atencionData.controlEmbarazo.proximoControl}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Observaciones */}
                            {atencionData.controlEmbarazo.observaciones && (
                                <div className="p-3 bg-card rounded-lg border border-border">
                                    <div className="text-xs text-muted-foreground mb-1">Observaciones</div>
                                    <div className="text-sm text-foreground">
                                        {atencionData.controlEmbarazo.observaciones}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* 🧩 2️⃣ Tabs superiores */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 max-w-md mb-4 sm:mb-6">
                        <TabsTrigger value="datos-clinicos" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                            <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden xs:inline">Datos Clínicos</span>
                            <span className="xs:hidden">Clínicos</span>
                        </TabsTrigger>
                        <TabsTrigger value="prestaciones" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                            <Pill className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden xs:inline">Prestaciones</span>
                            <span className="xs:hidden">Servicios</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="datos-clinicos" className="space-y-6">
                        {/* 🧩 3️⃣ Bloque: Antecedentes Clínicos */}
                        <Card>
                            <Collapsible open={openSections.antecedentes} onOpenChange={() => toggleSection('antecedentes')}>
                                <CollapsibleTrigger asChild>
                                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                                                <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
                                                <span className="break-words">Antecedentes Clínicos</span>
                                            </CardTitle>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-xs">+1 fichas</Badge>
                                                {openSections.antecedentes ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                            </div>
                                        </div>
                                    </CardHeader>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <CardContent className="pt-0">
                                        <Tabs defaultValue="ginecologia" className="w-full">
                                            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 mb-4">
                                                <TabsTrigger value="ginecologia" className="text-xs sm:text-sm break-words">
                                                    <span className="truncate">Ginecología y Obstetricia</span>
                                                </TabsTrigger>
                                                <TabsTrigger value="consulta-ginecologia" className="text-xs sm:text-sm break-words">
                                                    <span className="truncate">CONSULTA GINECOLOGIA</span>
                                                </TabsTrigger>
                                            </TabsList>

                                            <TabsContent value="ginecologia">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-xs sm:text-sm font-medium text-muted-foreground block">
                                                            Edad gestacional
                                                        </label>
                                                        <div className="p-3 bg-muted/30 rounded-lg text-xs sm:text-sm text-foreground border border-border min-h-[44px] flex items-center">
                                                            -
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs sm:text-sm font-medium text-muted-foreground block">
                                                            Fecha última regla
                                                        </label>
                                                        <div className="p-3 bg-muted/30 rounded-lg text-xs sm:text-sm text-foreground border border-border min-h-[44px] flex items-center">
                                                            -
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                                                        <label className="text-xs sm:text-sm font-medium text-muted-foreground block">
                                                            Próximo control
                                                        </label>
                                                        <div className="p-3 bg-muted/30 rounded-lg text-xs sm:text-sm text-foreground border border-border min-h-[44px] flex items-center">
                                                            -
                                                        </div>
                                                    </div>
                                                </div>
                                            </TabsContent>

                                            <TabsContent value="consulta-ginecologia">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-xs sm:text-sm font-medium text-muted-foreground block">
                                                            Edad gestacional
                                                        </label>
                                                        <div className="p-3 bg-muted/30 rounded-lg text-xs sm:text-sm text-foreground border border-border min-h-[44px] flex items-center">
                                                            -
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs sm:text-sm font-medium text-muted-foreground block">
                                                            Fecha última regla
                                                        </label>
                                                        <div className="p-3 bg-muted/30 rounded-lg text-xs sm:text-sm text-foreground border border-border min-h-[44px] flex items-center">
                                                            -
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                                                        <label className="text-xs sm:text-sm font-medium text-muted-foreground block">
                                                            Próximo control
                                                        </label>
                                                        <div className="p-3 bg-muted/30 rounded-lg text-xs sm:text-sm text-foreground border border-border min-h-[44px] flex items-center">
                                                            -
                                                        </div>
                                                    </div>
                                                </div>
                                            </TabsContent>
                                        </Tabs>
                                    </CardContent>
                                </CollapsibleContent>
                            </Collapsible>
                        </Card>

                        {/* 🧩 4️⃣ Bloque: Evolución Clínica */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <Stethoscope className="h-5 w-5 text-primary" />
                                            Evolución Clínica
                                        </CardTitle>
                                        <div className="text-sm text-muted-foreground">
                                            Evolución escrita
                                        </div>
                                    </div>
                                    {!isEditing.evolucion && (
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => handleEdit('evolucion')}
                                            className="shrink-0"
                                        >
                                            <Edit className="h-4 w-4 mr-1 sm:mr-2" />
                                            <span className="hidden sm:inline">Editar</span>
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="p-4 bg-muted/30 rounded-lg border border-border">
                                        <div className="text-sm text-muted-foreground mb-2">
                                            Evolución
                                        </div>
                                        {isEditing.evolucion ? (
                                            <div className="space-y-3">
                                                <Textarea
                                                    value={editableContent.evolucion}
                                                    onChange={(e) => handleContentChange('evolucion', e.target.value)}
                                                    className="min-h-[200px] resize-none"
                                                    placeholder="Escriba la evolución clínica aquí..."
                                                />
                                                <div className="flex flex-col sm:flex-row justify-end gap-2">
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        onClick={() => handleCancel('evolucion')}
                                                        className="w-full sm:w-auto"
                                                    >
                                                        <X className="h-4 w-4 mr-1 sm:mr-2" />
                                                        <span className="hidden sm:inline">Cancelar</span>
                                                    </Button>
                                                    <Button 
                                                        size="sm"
                                                        onClick={() => handleSave('evolucion')}
                                                        className="w-full sm:w-auto"
                                                    >
                                                        <Save className="h-4 w-4 mr-1 sm:mr-2" />
                                                        <span className="hidden sm:inline">Guardar</span>
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                                                {editableContent.evolucion}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 🧩 5️⃣ Bloque: Notas Aclaratorias */}
                        <Card>
                            <Collapsible open={openSections.notas} onOpenChange={() => toggleSection('notas')}>
                                <CollapsibleTrigger asChild>
                                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="flex items-center gap-2">
                                                <AlertCircle className="h-5 w-5 text-primary" />
                                                Notas Aclaratorias
                                            </CardTitle>
                                            {openSections.notas ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                        </div>
                                    </CardHeader>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <CardContent className="pt-0">
                                        <div className="text-center py-8 text-muted-foreground">
                                            <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                            <p>No hay notas aclaratorias registradas</p>
                                            <Button variant="outline" size="sm" className="mt-4">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Agregar Nota
                                            </Button>
                                        </div>
                                    </CardContent>
                                </CollapsibleContent>
                            </Collapsible>
                        </Card>

                        {/* 🧩 6️⃣ Bloque: Órdenes Médicas */}
                        <Card>
                            <Collapsible open={openSections.ordenes} onOpenChange={() => toggleSection('ordenes')}>
                                <CollapsibleTrigger asChild>
                                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="flex items-center gap-2">
                                                <FileText className="h-5 w-5 text-primary" />
                                                Órdenes Médicas
                                                <Badge variant="secondary" className="ml-2">
                                                    {atencionData.ordenesMedicas.length}
                                                </Badge>
                                            </CardTitle>
                                            {openSections.ordenes ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                        </div>
                                    </CardHeader>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <CardContent className="pt-0">
                                        <div className="space-y-4">
                                            {atencionData.ordenesMedicas.map((orden: OrdenMedica) => (
                                                <div key={orden.id} className="p-4 bg-muted/30 rounded-lg border border-border">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div>
                                                            <div className="text-sm font-medium text-foreground">
                                                                Autor: {orden.autor}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">
                                                                Atención: {orden.atencion} - {orden.fecha}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                                                            {!isEditing.ordenes && (
                                                                <Button 
                                                                    variant="outline" 
                                                                    size="sm"
                                                                    onClick={() => handleEdit('ordenes')}
                                                                    className="shrink-0"
                                                                >
                                                                    <Edit className="h-4 w-4 mr-1 sm:mr-2" />
                                                                    <span className="hidden sm:inline">Editar</span>
                                                                </Button>
                                                            )}
                                                            <Button variant="outline" size="sm" className="shrink-0">
                                                                <Send className="h-4 w-4 mr-1 sm:mr-2" />
                                                                <span className="hidden sm:inline">Enviar</span>
                                                            </Button>
                                                            <Button variant="outline" size="sm" className="shrink-0">
                                                                <Eye className="h-4 w-4 mr-1 sm:mr-2" />
                                                                <span className="hidden sm:inline">Ver todo</span>
                                                            </Button>
                                                            <Button variant="outline" size="sm" className="shrink-0">
                                                                <Clock className="h-4 w-4 mr-1 sm:mr-2" />
                                                                <span className="hidden sm:inline">Historial</span>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    {isEditing.ordenes ? (
                                                        <div className="space-y-3">
                                                            <Textarea
                                                                value={editableContent.ordenes}
                                                                onChange={(e) => handleContentChange('ordenes', e.target.value)}
                                                                className="min-h-[100px] resize-none"
                                                                placeholder="Escriba las órdenes médicas aquí..."
                                                            />
                                                            <div className="flex flex-col sm:flex-row justify-end gap-2">
                                                                <Button 
                                                                    variant="outline" 
                                                                    size="sm"
                                                                    onClick={() => handleCancel('ordenes')}
                                                                    className="w-full sm:w-auto"
                                                                >
                                                                    <X className="h-4 w-4 mr-1 sm:mr-2" />
                                                                    <span className="hidden sm:inline">Cancelar</span>
                                                                </Button>
                                                                <Button 
                                                                    size="sm"
                                                                    onClick={() => handleSave('ordenes')}
                                                                    className="w-full sm:w-auto"
                                                                >
                                                                    <Save className="h-4 w-4 mr-1 sm:mr-2" />
                                                                    <span className="hidden sm:inline">Guardar</span>
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-2">
                                                            {editableContent.ordenes.split('\n').map((item: string, index: number) => (
                                                                <div key={index} className="text-sm text-foreground bg-background p-2 rounded border">
                                                                    {item}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </CollapsibleContent>
                            </Collapsible>
                        </Card>

                        {/* 🧩 7️⃣ Bloque: Prescripciones */}
                        <Card>
                            <Collapsible open={openSections.prescripciones} onOpenChange={() => toggleSection('prescripciones')}>
                                <CollapsibleTrigger asChild>
                                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="flex items-center gap-2">
                                                <Pill className="h-5 w-5 text-primary" />
                                                Prescripciones
                                                <Badge variant="secondary" className="ml-2">
                                                    {atencionData.prescripciones.length}
                                                </Badge>
                                            </CardTitle>
                                            {openSections.prescripciones ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                        </div>
                                    </CardHeader>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <CardContent className="pt-0">
                                        <div className="space-y-4">
                                            {atencionData.prescripciones.map((prescripcion: Prescripcion) => (
                                                <div key={prescripcion.id} className="p-4 bg-muted/30 rounded-lg border border-border">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div>
                                                            <div className="text-sm font-medium text-foreground">
                                                                Autor: {prescripcion.autor}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">
                                                                Atención: {prescripcion.atencion} - {prescripcion.fecha}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                                                            {!isEditing.prescripciones && (
                                                                <Button 
                                                                    variant="outline" 
                                                                    size="sm"
                                                                    onClick={() => handleEdit('prescripciones')}
                                                                    className="shrink-0"
                                                                >
                                                                    <Edit className="h-4 w-4 mr-1 sm:mr-2" />
                                                                    <span className="hidden sm:inline">Editar</span>
                                                                </Button>
                                                            )}
                                                            <Button variant="outline" size="sm" className="shrink-0">
                                                                <ChevronDown className="h-4 w-4 mr-1 sm:mr-2" />
                                                                <span className="hidden sm:inline">Ver todo</span>
                                                            </Button>
                                                            <Button variant="outline" size="sm" className="shrink-0">
                                                                <Send className="h-4 w-4 mr-1 sm:mr-2" />
                                                                <span className="hidden sm:inline">Enviar</span>
                                                            </Button>
                                                            <Button variant="outline" size="sm" className="shrink-0">
                                                                <Clock className="h-4 w-4 mr-1 sm:mr-2" />
                                                                <span className="hidden sm:inline">Historial</span>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    {isEditing.prescripciones ? (
                                                        <div className="space-y-3">
                                                            <Textarea
                                                                value={editableContent.prescripciones}
                                                                onChange={(e) => handleContentChange('prescripciones', e.target.value)}
                                                                className="min-h-[150px] resize-none"
                                                                placeholder="Escriba las prescripciones aquí..."
                                                            />
                                                            <div className="flex flex-col sm:flex-row justify-end gap-2">
                                                                <Button 
                                                                    variant="outline" 
                                                                    size="sm"
                                                                    onClick={() => handleCancel('prescripciones')}
                                                                    className="w-full sm:w-auto"
                                                                >
                                                                    <X className="h-4 w-4 mr-1 sm:mr-2" />
                                                                    <span className="hidden sm:inline">Cancelar</span>
                                                                </Button>
                                                                <Button 
                                                                    size="sm"
                                                                    onClick={() => handleSave('prescripciones')}
                                                                    className="w-full sm:w-auto"
                                                                >
                                                                    <Save className="h-4 w-4 mr-1 sm:mr-2" />
                                                                    <span className="hidden sm:inline">Guardar</span>
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-2">
                                                            {editableContent.prescripciones.split('\n').map((item: string, index: number) => (
                                                                <div key={index} className="text-sm text-foreground">
                                                                    {item}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </CollapsibleContent>
                            </Collapsible>
                        </Card>

                        {/* 🧩 8️⃣ Bloques adicionales */}
                        <Card>
                            <Collapsible open={openSections.imagenes} onOpenChange={() => toggleSection('imagenes')}>
                                <CollapsibleTrigger asChild>
                                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="flex items-center gap-2">
                                                <Image className="h-5 w-5 text-primary" />
                                                Imágenes y Documentos
                                            </CardTitle>
                                            {openSections.imagenes ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                        </div>
                                    </CardHeader>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <CardContent className="pt-0">
                                        <div className="text-center py-8 text-muted-foreground">
                                            <Image className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                            <p>No hay imágenes o documentos adjuntos</p>
                                            <Button variant="outline" size="sm" className="mt-4">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Subir Archivo
                                            </Button>
                                        </div>
                                    </CardContent>
                                </CollapsibleContent>
                            </Collapsible>
                        </Card>

                        <Card>
                            <Collapsible open={openSections.documentos} onOpenChange={() => toggleSection('documentos')}>
                                <CollapsibleTrigger asChild>
                                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="flex items-center gap-2">
                                                <FileText className="h-5 w-5 text-primary" />
                                                Documentos Clínicos
                                            </CardTitle>
                                            {openSections.documentos ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                        </div>
                                    </CardHeader>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <CardContent className="pt-0">
                                        <div className="text-center py-8 text-muted-foreground">
                                            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                            <p>No hay documentos clínicos generados</p>
                                            <Button variant="outline" size="sm" className="mt-4">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Generar Documento
                                            </Button>
                                        </div>
                                    </CardContent>
                                </CollapsibleContent>
                            </Collapsible>
                        </Card>

                        <Card>
                            <Collapsible open={openSections.consentimientos} onOpenChange={() => toggleSection('consentimientos')}>
                                <CollapsibleTrigger asChild>
                                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="flex items-center gap-2">
                                                <ClipboardList className="h-5 w-5 text-primary" />
                                                Consentimientos
                                            </CardTitle>
                                            {openSections.consentimientos ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                        </div>
                                    </CardHeader>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <CardContent className="pt-0">
                                        <div className="text-center py-8 text-muted-foreground">
                                            <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                            <p>No hay consentimientos registrados</p>
                                            <Button variant="outline" size="sm" className="mt-4">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Registrar Consentimiento
                                            </Button>
                                        </div>
                                    </CardContent>
                                </CollapsibleContent>
                            </Collapsible>
                        </Card>
                    </TabsContent>

                    <TabsContent value="prestaciones" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Pill className="h-5 w-5 text-primary" />
                                    Prestaciones y Facturación
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8 text-muted-foreground">
                                    <Pill className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No hay prestaciones registradas para esta atención</p>
                                    <Button variant="outline" size="sm" className="mt-4">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Agregar Prestación
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
