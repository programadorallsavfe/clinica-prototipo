"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
    Users, 
    UserCheck, 
    TrendingUp, 
    DollarSign, 
    Calendar, 
    FileText, 
    Download,
    Filter,
    Search,
    BarChart3,
    PieChart,
    Activity,
    Target,
    Clock,
    MapPin,
    Heart,
    Baby,
    Stethoscope,
    Pill,
    TestTube,
    CreditCard
} from "lucide-react";
import { ResponsiveContainer, PieChart as RechartsPieChart, BarChart, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Pie, Cell, Bar, Line } from "recharts";

// Interfaces para los datos
interface ReportePaciente {
    id: string;
    nombre: string;
    apellido: string;
    edad: number;
    sexo: 'M' | 'F';
    distrito: string;
    tipoPaciente: 'nuevo' | 'continuador' | 'reingreso';
    formaCaptacion: string;
    fechaRegistro: string;
    totalAtenciones: number;
    ultimaAtencion: string;
}

interface ReporteMedico {
    id: string;
    nombre: string;
    especialidad: string;
    totalAtenciones: number;
    totalIngresos: number;
    promedioAtencionesDia: number;
    pacientesUnicos: number;
    serviciosMasRealizados: string[];
    eficiencia: number;
}

interface ReporteFinanciero {
    periodo: string;
    totalIngresos: number;
    totalEgresos: number;
    utilidadNeta: number;
    margenUtilidad: number;
    serviciosMasRentables: Array<{
        servicio: string;
        ingresos: number;
        cantidad: number;
    }>;
    tendenciaIngresos: Array<{
        mes: string;
        ingresos: number;
        egresos: number;
    }>;
}

// Mock data para reportes
const reportesPacientesMock: ReportePaciente[] = [
    {
        id: "1",
        nombre: "María",
        apellido: "González",
        edad: 28,
        sexo: "F",
        distrito: "Miraflores",
        tipoPaciente: "nuevo",
        formaCaptacion: "Facebook",
        fechaRegistro: "2024-01-15",
        totalAtenciones: 3,
        ultimaAtencion: "2024-01-20"
    },
    {
        id: "2",
        nombre: "Ana",
        apellido: "Rodríguez",
        edad: 32,
        sexo: "F",
        distrito: "San Isidro",
        tipoPaciente: "continuador",
        formaCaptacion: "Referido",
        fechaRegistro: "2023-11-10",
        totalAtenciones: 8,
        ultimaAtencion: "2024-01-18"
    },
    {
        id: "3",
        nombre: "Carmen",
        apellido: "López",
        edad: 25,
        sexo: "F",
        distrito: "La Molina",
        tipoPaciente: "reingreso",
        formaCaptacion: "Google",
        fechaRegistro: "2022-08-05",
        totalAtenciones: 12,
        ultimaAtencion: "2024-01-22"
    },
    {
        id: "4",
        nombre: "Patricia",
        apellido: "Mendoza",
        edad: 29,
        sexo: "F",
        distrito: "Surco",
        tipoPaciente: "nuevo",
        formaCaptacion: "WhatsApp",
        fechaRegistro: "2024-01-10",
        totalAtenciones: 2,
        ultimaAtencion: "2024-01-15"
    },
    {
        id: "5",
        nombre: "Lucía",
        apellido: "Vargas",
        edad: 35,
        sexo: "F",
        distrito: "La Molina",
        tipoPaciente: "continuador",
        formaCaptacion: "Referido",
        fechaRegistro: "2023-09-20",
        totalAtenciones: 6,
        ultimaAtencion: "2024-01-19"
    },
    {
        id: "6",
        nombre: "Carlos",
        apellido: "Ruiz",
        edad: 31,
        sexo: "M",
        distrito: "Miraflores",
        tipoPaciente: "nuevo",
        formaCaptacion: "Google",
        fechaRegistro: "2024-01-12",
        totalAtenciones: 1,
        ultimaAtencion: "2024-01-12"
    }
];

const reportesMedicosMock: ReporteMedico[] = [
    {
        id: "1",
        nombre: "Dr. María González",
        especialidad: "Ginecología",
        totalAtenciones: 245,
        totalIngresos: 24500,
        promedioAtencionesDia: 8.2,
        pacientesUnicos: 180,
        serviciosMasRealizados: ["Consulta Externa", "Ecografía", "PAP"],
        eficiencia: 92
    },
    {
        id: "2",
        nombre: "Dra. Ana Rodríguez",
        especialidad: "Obstetricia",
        totalAtenciones: 198,
        totalIngresos: 19800,
        promedioAtencionesDia: 6.6,
        pacientesUnicos: 145,
        serviciosMasRealizados: ["Control Prenatal", "Ecografía", "Consulta"],
        eficiencia: 88
    }
];

const reportesFinancierosMock: ReporteFinanciero = {
    periodo: "Enero 2024",
    totalIngresos: 125000,
    totalEgresos: 85000,
    utilidadNeta: 40000,
    margenUtilidad: 32,
    serviciosMasRentables: [
        { servicio: "Ecografías", ingresos: 35000, cantidad: 140 },
        { servicio: "Consultas", ingresos: 28000, cantidad: 280 },
        { servicio: "Laboratorios", ingresos: 22000, cantidad: 88 },
        { servicio: "Procedimientos", ingresos: 40000, cantidad: 25 }
    ],
    tendenciaIngresos: [
        { mes: "Oct", ingresos: 98000, egresos: 72000 },
        { mes: "Nov", ingresos: 105000, egresos: 78000 },
        { mes: "Dic", ingresos: 118000, egresos: 82000 },
        { mes: "Ene", ingresos: 125000, egresos: 85000 }
    ]
};

// Datos para gráficos
const distribucionPacientesData = [
    { name: "Nuevos", value: 45, fill: "var(--chart-1)" },
    { name: "Continuadores", value: 35, fill: "var(--chart-2)" },
    { name: "Reingresos", value: 20, fill: "var(--chart-3)" }
];

const distribucionEdadData = [
    { name: "18-25 años", value: 25, fill: "var(--chart-1)" },
    { name: "26-35 años", value: 40, fill: "var(--chart-2)" },
    { name: "36-45 años", value: 20, fill: "var(--chart-3)" },
    { name: "46+ años", value: 15, fill: "var(--chart-4)" }
];

const captacionData = [
    { name: "Facebook", value: 25, fill: "var(--chart-1)" },
    { name: "Google", value: 20, fill: "var(--chart-2)" },
    { name: "Referido", value: 30, fill: "var(--chart-3)" },
    { name: "WhatsApp", value: 15, fill: "var(--chart-4)" },
    { name: "Otros", value: 10, fill: "var(--chart-5)" }
];

const productividadMedicosData = [
    { name: "Dr. González", atenciones: 245, ingresos: 24500 },
    { name: "Dra. Rodríguez", atenciones: 198, ingresos: 19800 },
    { name: "Dr. López", atenciones: 156, ingresos: 15600 }
];

const tendenciaIngresosData = reportesFinancierosMock.tendenciaIngresos;

export default function ReportesPage() {
    const [filtroPeriodo, setFiltroPeriodo] = useState("enero-2024");
    const [filtroEspecialidad, setFiltroEspecialidad] = useState("todas");
    const [busquedaPaciente, setBusquedaPaciente] = useState("");

    const getTipoPacienteColor = (tipo: string) => {
        switch (tipo) {
            case "nuevo": return "bg-success/10 text-success border-success/20";
            case "continuador": return "bg-primary/10 text-primary border-primary/20";
            case "reingreso": return "bg-warning/10 text-warning border-warning/20";
            default: return "bg-muted/10 text-muted-foreground border-muted/20";
        }
    };

    const getEficienciaColor = (eficiencia: number) => {
        if (eficiencia >= 90) return "text-success";
        if (eficiencia >= 80) return "text-warning";
        return "text-destructive";
    };

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Reportes y Estadísticas</h1>
                    <p className="text-muted-foreground mt-2">
                        Análisis completo de pacientes, médicos y finanzas
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Select value={filtroPeriodo} onValueChange={setFiltroPeriodo}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Seleccionar período" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="enero-2024">Enero 2024</SelectItem>
                            <SelectItem value="diciembre-2023">Diciembre 2023</SelectItem>
                            <SelectItem value="noviembre-2023">Noviembre 2023</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button className="bg-primary hover:bg-primary/90">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-l-4 border-l-primary">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Pacientes</CardTitle>
                        <Users className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,247</div>
                        <p className="text-xs text-muted-foreground">
                            +12% desde el mes pasado
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-success">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                        <DollarSign className="h-4 w-4 text-success" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">S/ 125,000</div>
                        <p className="text-xs text-muted-foreground">
                            +8% desde el mes pasado
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-warning">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Atenciones</CardTitle>
                        <Stethoscope className="h-4 w-4 text-warning" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2,456</div>
                        <p className="text-xs text-muted-foreground">
                            +15% desde el mes pasado
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-info">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Utilidad Neta</CardTitle>
                        <TrendingUp className="h-4 w-4 text-info" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">S/ 40,000</div>
                        <p className="text-xs text-muted-foreground">
                            Margen: 32%
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs principales */}
            <Tabs defaultValue="pacientes" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="pacientes" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Reportes de Pacientes
                    </TabsTrigger>
                    <TabsTrigger value="medicos" className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4" />
                        Reportes Médicos
                    </TabsTrigger>
                    <TabsTrigger value="financieros" className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Reportes Financieros
                    </TabsTrigger>
                </TabsList>

                {/* Tab Reportes de Pacientes */}
                <TabsContent value="pacientes" className="space-y-6">
                    {/* Gráficos de pacientes */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <PieChart className="h-5 w-5 text-primary" />
                                    Distribución por Tipo
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RechartsPieChart>
                                            <Tooltip />
                                            <Pie
                                                data={distribucionPacientesData}
                                                dataKey="value"
                                                nameKey="name"
                                                innerRadius={40}
                                                outerRadius={80}
                                                strokeWidth={5}
                                            >
                                                {distribucionPacientesData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                ))}
                                            </Pie>
                                        </RechartsPieChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5 text-success" />
                                    Distribución por Edad
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RechartsPieChart>
                                            <Tooltip />
                                            <Pie
                                                data={distribucionEdadData}
                                                dataKey="value"
                                                nameKey="name"
                                                innerRadius={40}
                                                outerRadius={80}
                                                strokeWidth={5}
                                            >
                                                {distribucionEdadData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                ))}
                                            </Pie>
                                        </RechartsPieChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="h-5 w-5 text-warning" />
                                    Forma de Captación
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RechartsPieChart>
                                            <Tooltip />
                                            <Pie
                                                data={captacionData}
                                                dataKey="value"
                                                nameKey="name"
                                                innerRadius={40}
                                                outerRadius={80}
                                                strokeWidth={5}
                                            >
                                                {captacionData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                ))}
                                            </Pie>
                                        </RechartsPieChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Tabla de pacientes */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Lista de Pacientes</CardTitle>
                                    <CardDescription>
                                        Detalle completo de pacientes registrados
                                    </CardDescription>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Buscar paciente..."
                                            value={busquedaPaciente}
                                            onChange={(e) => setBusquedaPaciente(e.target.value)}
                                            className="pl-10 w-64"
                                        />
                                    </div>
                                    <Button variant="outline" size="sm">
                                        <Filter className="h-4 w-4 mr-2" />
                                        Filtros
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Paciente</TableHead>
                                        <TableHead>Edad</TableHead>
                                        <TableHead>Sexo</TableHead>
                                        <TableHead>Distrito</TableHead>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead>Captación</TableHead>
                                        <TableHead>Atenciones</TableHead>
                                        <TableHead>Última Atención</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reportesPacientesMock.map((paciente) => (
                                        <TableRow key={paciente.id}>
                                            <TableCell className="font-medium">
                                                {paciente.nombre} {paciente.apellido}
                                            </TableCell>
                                            <TableCell>{paciente.edad} años</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {paciente.sexo === 'F' ? 'Femenino' : 'Masculino'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{paciente.distrito}</TableCell>
                                            <TableCell>
                                                <Badge className={getTipoPacienteColor(paciente.tipoPaciente)}>
                                                    {paciente.tipoPaciente}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{paciente.formaCaptacion}</TableCell>
                                            <TableCell>{paciente.totalAtenciones}</TableCell>
                                            <TableCell>{paciente.ultimaAtencion}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab Reportes Médicos */}
                <TabsContent value="medicos" className="space-y-6">
                    {/* Gráfico de productividad médica */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5 text-primary" />
                                Productividad Médica
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={productividadMedicosData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="atenciones" fill="var(--chart-1)" name="Atenciones" />
                                        <Bar dataKey="ingresos" fill="var(--chart-2)" name="Ingresos (S/)" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tabla de médicos */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Reporte de Médicos</CardTitle>
                                    <CardDescription>
                                        Análisis de productividad y eficiencia médica
                                    </CardDescription>
                                </div>
                                <Select value={filtroEspecialidad} onValueChange={setFiltroEspecialidad}>
                                    <SelectTrigger className="w-48">
                                        <SelectValue placeholder="Especialidad" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todas">Todas</SelectItem>
                                        <SelectItem value="ginecologia">Ginecología</SelectItem>
                                        <SelectItem value="obstetricia">Obstetricia</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Médico</TableHead>
                                        <TableHead>Especialidad</TableHead>
                                        <TableHead>Atenciones</TableHead>
                                        <TableHead>Ingresos</TableHead>
                                        <TableHead>Promedio/Día</TableHead>
                                        <TableHead>Pacientes Únicos</TableHead>
                                        <TableHead>Eficiencia</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reportesMedicosMock.map((medico) => (
                                        <TableRow key={medico.id}>
                                            <TableCell className="font-medium">{medico.nombre}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{medico.especialidad}</Badge>
                                            </TableCell>
                                            <TableCell>{medico.totalAtenciones}</TableCell>
                                            <TableCell>S/ {medico.totalIngresos.toLocaleString()}</TableCell>
                                            <TableCell>{medico.promedioAtencionesDia}</TableCell>
                                            <TableCell>{medico.pacientesUnicos}</TableCell>
                                            <TableCell>
                                                <span className={getEficienciaColor(medico.eficiencia)}>
                                                    {medico.eficiencia}%
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab Reportes Financieros */}
                <TabsContent value="financieros" className="space-y-6">
                    {/* Gráfico de tendencia de ingresos */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-success" />
                                Tendencia de Ingresos vs Egresos
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={tendenciaIngresosData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="mes" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="ingresos" stroke="var(--chart-1)" strokeWidth={3} name="Ingresos" />
                                        <Line type="monotone" dataKey="egresos" stroke="var(--chart-2)" strokeWidth={3} name="Egresos" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Servicios más rentables */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="h-5 w-5 text-primary" />
                                    Servicios Más Rentables
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {reportesFinancierosMock.serviciosMasRentables.map((servicio, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                            <div>
                                                <p className="font-medium">{servicio.servicio}</p>
                                                <p className="text-sm text-muted-foreground">{servicio.cantidad} servicios</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-success">S/ {servicio.ingresos.toLocaleString()}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    S/ {(servicio.ingresos / servicio.cantidad).toFixed(0)} promedio
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="h-5 w-5 text-success" />
                                    Resumen Financiero
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="h-5 w-5 text-success" />
                                            <span className="font-medium">Ingresos Totales</span>
                                        </div>
                                        <span className="font-bold text-success">
                                            S/ {reportesFinancierosMock.totalIngresos.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="h-5 w-5 text-destructive rotate-180" />
                                            <span className="font-medium">Egresos Totales</span>
                                        </div>
                                        <span className="font-bold text-destructive">
                                            S/ {reportesFinancierosMock.totalEgresos.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <Target className="h-5 w-5 text-primary" />
                                            <span className="font-medium">Utilidad Neta</span>
                                        </div>
                                        <span className="font-bold text-primary">
                                            S/ {reportesFinancierosMock.utilidadNeta.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <BarChart3 className="h-5 w-5 text-warning" />
                                            <span className="font-medium">Margen de Utilidad</span>
                                        </div>
                                        <span className="font-bold text-warning">
                                            {reportesFinancierosMock.margenUtilidad}%
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}