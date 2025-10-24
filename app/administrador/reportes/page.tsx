"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

// Importar nuevos componentes de reportes
import ReportePacientesTemporales from "@/components/reportes/ReportePacientesTemporales";
import ReporteDiagnosticos from "@/components/reportes/ReporteDiagnosticos";
import ReporteServicios from "@/components/reportes/ReporteServicios";
import ReporteGestantes from "@/components/reportes/ReporteGestantes";
import ReporteGinecologicos from "@/components/reportes/ReporteGinecologicos";
import ReporteCostosUtilidades from "@/components/reportes/ReporteCostosUtilidades";

export default function ReportesPage() {
    const [filtroPeriodo, setFiltroPeriodo] = useState("enero-2024");
    const [filtroEspecialidad, setFiltroEspecialidad] = useState("todas");
    const [busquedaPaciente, setBusquedaPaciente] = useState("");

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
                        <CardTitle className="text-sm font-medium">Nuevos Pacientes</CardTitle>
                        <UserCheck className="h-4 w-4 text-success" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">89</div>
                        <p className="text-xs text-muted-foreground">
                            +8% desde el mes pasado
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-warning">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                        <DollarSign className="h-4 w-4 text-warning" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">S/ 45,230</div>
                        <p className="text-xs text-muted-foreground">
                            +15% desde el mes pasado
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-info">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Atenciones</CardTitle>
                        <Activity className="h-4 w-4 text-info" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,856</div>
                        <p className="text-xs text-muted-foreground">
                            +6% desde el mes pasado
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs principales */}
            <Tabs defaultValue="pacientes" className="space-y-6">
                <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="pacientes" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Pacientes
                    </TabsTrigger>
                    <TabsTrigger value="diagnosticos" className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4" />
                        Diagnósticos
                    </TabsTrigger>
                    <TabsTrigger value="servicios" className="flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Servicios
                    </TabsTrigger>
                    <TabsTrigger value="gestantes" className="flex items-center gap-2">
                        <Baby className="h-4 w-4" />
                        Gestantes
                    </TabsTrigger>
                    <TabsTrigger value="ginecologicos" className="flex items-center gap-2">
                        <Heart className="h-4 w-4" />
                        Ginecológicos
                    </TabsTrigger>
                    <TabsTrigger value="costos" className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Costos
                    </TabsTrigger>
                </TabsList>

                {/* Tab Reportes de Pacientes */}
                <TabsContent value="pacientes" className="space-y-6">
                    <ReportePacientesTemporales tipoReporte="tipo" periodo="mes" />
                </TabsContent>

                {/* Tab Reportes de Diagnósticos */}
                <TabsContent value="diagnosticos" className="space-y-6">
                    <ReporteDiagnosticos periodo="mes" />
                </TabsContent>

                {/* Tab Reportes de Servicios */}
                <TabsContent value="servicios" className="space-y-6">
                    <ReporteServicios periodo="mes" />
                </TabsContent>

                {/* Tab Reportes de Gestantes */}
                <TabsContent value="gestantes" className="space-y-6">
                    <ReporteGestantes periodo="mes" />
                </TabsContent>

                {/* Tab Reportes Ginecológicos */}
                <TabsContent value="ginecologicos" className="space-y-6">
                    <ReporteGinecologicos periodo="mes" />
                </TabsContent>

                {/* Tab Reportes de Costos */}
                <TabsContent value="costos" className="space-y-6">
                    <ReporteCostosUtilidades periodo="mes" />
                </TabsContent>
            </Tabs>
        </div>
    );
}