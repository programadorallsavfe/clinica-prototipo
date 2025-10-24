'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  FileText, 
  Download,
  Eye,
  Calculator,
  CreditCard,
  CheckCircle,
  Clock,
  AlertTriangle,
  User,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { Colaborador, Comision, ReporteComisiones } from '@/lib/types';

interface ReportesColaboradoresCardProps {
  colaboradores: Colaborador[];
  comisiones: Comision[];
  reportes: ReporteComisiones[];
  onVerDetalleColaborador: (colaboradorId: string) => void;
  onCalcularComisiones: (colaboradorId: string, periodo: string) => void;
  onProcesarPago: (comisionId: string) => void;
}

export function ReportesColaboradoresCard({ 
  colaboradores, 
  comisiones, 
  reportes,
  onVerDetalleColaborador,
  onCalcularComisiones,
  onProcesarPago
}: ReportesColaboradoresCardProps) {
  const [filtroPeriodo, setFiltroPeriodo] = useState('enero-2024');
  const [filtroEstado, setFiltroEstado] = useState('todos');

  // Calcular estadísticas generales
  const totalColaboradores = colaboradores.length;
  const colaboradoresActivos = colaboradores.filter(c => c.activo).length;
  const totalComisionesPendientes = comisiones.filter(c => c.estado === 'pendiente').length;
  const totalMontoPendiente = comisiones
    .filter(c => c.estado === 'pendiente')
    .reduce((sum, c) => sum + c.montoComision, 0);

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'bg-yellow-500';
      case 'calculada': return 'bg-blue-500';
      case 'pagada': return 'bg-green-500';
      case 'cancelada': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getEstadoTexto = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'Pendiente';
      case 'calculada': return 'Calculada';
      case 'pagada': return 'Pagada';
      case 'cancelada': return 'Cancelada';
      default: return estado;
    }
  };

  const getTipoColaboradorColor = (tipo: string) => {
    switch (tipo) {
      case 'medico': return 'bg-blue-500';
      case 'referidor': return 'bg-green-500';
      case 'colaborador_externo': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getTipoColaboradorTexto = (tipo: string) => {
    switch (tipo) {
      case 'medico': return 'Médico';
      case 'referidor': return 'Referidor';
      case 'colaborador_externo': return 'Colaborador Externo';
      default: return tipo;
    }
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Colaboradores</CardTitle>
            <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors duration-200">
              <Users className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalColaboradores}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {colaboradoresActivos} activos
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Comisiones Pendientes</CardTitle>
            <div className="p-2 rounded-lg bg-yellow-500/10 group-hover:bg-yellow-500/20 transition-colors duration-200">
              <Clock className="h-4 w-4 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalComisionesPendientes}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Por procesar
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monto Pendiente</CardTitle>
            <div className="p-2 rounded-lg bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors duration-200">
              <DollarSign className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              S/ {totalMontoPendiente.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Por pagar
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Reportes Generados</CardTitle>
            <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors duration-200">
              <FileText className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{reportes.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Este mes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Colaboradores */}
      <Card>
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Colaboradores y Comisiones
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Gestión de colaboradores y cálculo de comisiones
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                <Calculator className="h-4 w-4 mr-2" />
                Calcular Comisiones
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border border-border/50 bg-card">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 dark:bg-muted/20">
                  <TableHead className="font-semibold text-foreground">Colaborador</TableHead>
                  <TableHead className="font-semibold text-foreground">Tipo</TableHead>
                  <TableHead className="font-semibold text-foreground">Comisiones</TableHead>
                  <TableHead className="font-semibold text-foreground">Monto Pendiente</TableHead>
                  <TableHead className="font-semibold text-foreground">Última Comisión</TableHead>
                  <TableHead className="font-semibold text-foreground">Estado</TableHead>
                  <TableHead className="font-semibold text-foreground">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {colaboradores.map((colaborador) => {
                  const comisionesColaborador = comisiones.filter(c => c.colaboradorId === colaborador.id);
                  const comisionesPendientes = comisionesColaborador.filter(c => c.estado === 'pendiente');
                  const montoPendiente = comisionesPendientes.reduce((sum, c) => sum + c.montoComision, 0);
                  const ultimaComision = comisionesColaborador
                    .sort((a, b) => new Date(b.fechaServicio).getTime() - new Date(a.fechaServicio).getTime())[0];

                  return (
                    <TableRow 
                      key={colaborador.id}
                      className="hover:bg-muted/50 dark:hover:bg-muted/30 transition-colors"
                    >
                      {/* Colaborador */}
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-foreground">
                              {colaborador.nombre} {colaborador.apellidos}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span>{colaborador.telefono}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span>{colaborador.email}</span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Tipo */}
                      <TableCell>
                        <Badge 
                          className={`text-white ${getTipoColaboradorColor(colaborador.tipo)}`}
                          variant="default"
                        >
                          {getTipoColaboradorTexto(colaborador.tipo)}
                        </Badge>
                        {colaborador.especialidad && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {colaborador.especialidad}
                          </div>
                        )}
                      </TableCell>

                      {/* Comisiones */}
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-foreground">
                            {comisionesColaborador.length} total
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {comisionesPendientes.length} pendientes
                          </div>
                        </div>
                      </TableCell>

                      {/* Monto Pendiente */}
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-foreground">
                            S/ {montoPendiente.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {colaborador.porcentajeComision}% comisión
                          </div>
                        </div>
                      </TableCell>

                      {/* Última Comisión */}
                      <TableCell>
                        {ultimaComision ? (
                          <div className="space-y-1">
                            <div className="text-sm text-foreground">
                              {new Date(ultimaComision.fechaServicio).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              S/ {ultimaComision.montoComision.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">Sin comisiones</span>
                        )}
                      </TableCell>

                      {/* Estado */}
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={colaborador.activo ? 'border-green-500 text-green-500' : 'border-gray-500 text-gray-500'}
                        >
                          {colaborador.activo ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>

                      {/* Acciones */}
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => onVerDetalleColaborador(colaborador.id)}
                            className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                            title="Ver detalles"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => onCalcularComisiones(colaborador.id, 'enero-2024')}
                            className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                            title="Calcular comisiones"
                          >
                            <Calculator className="h-4 w-4" />
                          </Button>
                          {montoPendiente > 0 && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => onProcesarPago(comisionesPendientes[0]?.id || '')}
                              className="h-8 w-8 p-0 hover:bg-green-500/10 hover:text-green-500 transition-colors duration-200"
                              title="Procesar pago"
                            >
                              <CreditCard className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Comisiones Recientes */}
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Comisiones Recientes
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Últimas comisiones generadas y procesadas
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border border-border/50 bg-card">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 dark:bg-muted/20">
                  <TableHead className="font-semibold text-foreground">Colaborador</TableHead>
                  <TableHead className="font-semibold text-foreground">Servicio</TableHead>
                  <TableHead className="font-semibold text-foreground">Monto Servicio</TableHead>
                  <TableHead className="font-semibold text-foreground">Comisión</TableHead>
                  <TableHead className="font-semibold text-foreground">Fecha</TableHead>
                  <TableHead className="font-semibold text-foreground">Estado</TableHead>
                  <TableHead className="font-semibold text-foreground">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comisiones.slice(0, 10).map((comision) => {
                  const colaborador = colaboradores.find(c => c.id === comision.colaboradorId);
                  
                  return (
                    <TableRow 
                      key={comision.id}
                      className="hover:bg-muted/50 dark:hover:bg-muted/30 transition-colors"
                    >
                      <TableCell>
                        <div className="font-medium text-foreground">
                          {colaborador ? `${colaborador.nombre} ${colaborador.apellidos}` : 'Colaborador no encontrado'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-foreground">{comision.tipoServicio}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium text-foreground">
                          S/ {comision.montoServicio.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-foreground">
                            S/ {comision.montoComision.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {comision.porcentajeComision}%
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-foreground">
                          {new Date(comision.fechaServicio).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={`text-white ${getEstadoColor(comision.estado)}`}
                          variant="default"
                        >
                          {getEstadoTexto(comision.estado)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {comision.estado === 'pendiente' && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => onProcesarPago(comision.id)}
                              className="h-8 w-8 p-0 hover:bg-green-500/10 hover:text-green-500 transition-colors duration-200"
                              title="Procesar pago"
                            >
                              <CreditCard className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                            title="Ver detalles"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
