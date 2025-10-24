"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Calendar,
  MapPin,
  Heart,
  UserCheck,
  Activity,
  Target,
  BarChart3
} from "lucide-react";

interface ReportePacientesTemporalesProps {
  tipoReporte: 'sexo' | 'distrito' | 'captacion' | 'tipo';
  periodo: 'dia' | 'mes' | 'año';
}

// Tipos para los datos
type DatosSexo = {
  fecha?: string;
  mes?: string;
  año?: string;
  masculino: number;
  femenino: number;
  total: number;
};

type DatosDistrito = {
  fecha?: string;
  mes?: string;
  año?: string;
  miraflores: number;
  sanIsidro: number;
  surco: number;
  laMolina: number;
  otros: number;
};

type DatosCaptacion = {
  fecha?: string;
  mes?: string;
  año?: string;
  facebook: number;
  google: number;
  referido: number;
  whatsapp: number;
  otros: number;
};

type DatosTipo = {
  fecha?: string;
  mes?: string;
  año?: string;
  nuevos: number;
  continuadores: number;
  reingresos: number;
};

type DatosItem = DatosSexo | DatosDistrito | DatosCaptacion | DatosTipo;

export default function ReportePacientesTemporales({ 
  tipoReporte = 'sexo', 
  periodo = 'mes' 
}: ReportePacientesTemporalesProps) {
  
  // Mock data para reportes temporales
  const reportesData = {
    sexo: {
      titulo: "Pacientes por Sexo",
      icono: Heart,
      datos: {
        dia: [
          { fecha: "2024-10-20", masculino: 15, femenino: 25, total: 40 },
          { fecha: "2024-10-21", masculino: 18, femenino: 22, total: 40 },
          { fecha: "2024-10-22", masculino: 12, femenino: 28, total: 40 },
          { fecha: "2024-10-23", masculino: 20, femenino: 20, total: 40 },
          { fecha: "2024-10-24", masculino: 16, femenino: 24, total: 40 },
          { fecha: "2024-10-25", masculino: 14, femenino: 26, total: 40 },
          { fecha: "2024-10-26", masculino: 17, femenino: 23, total: 40 }
        ],
        mes: [
          { mes: "Enero", masculino: 450, femenino: 650, total: 1100 },
          { mes: "Febrero", masculino: 420, femenino: 680, total: 1100 },
          { mes: "Marzo", masculino: 480, femenino: 620, total: 1100 },
          { mes: "Abril", masculino: 460, femenino: 640, total: 1100 },
          { mes: "Mayo", masculino: 440, femenino: 660, total: 1100 },
          { mes: "Junio", masculino: 470, femenino: 630, total: 1100 }
        ],
        año: [
          { año: "2021", masculino: 5200, femenino: 6800, total: 12000 },
          { año: "2022", masculino: 5400, femenino: 7000, total: 12400 },
          { año: "2023", masculino: 5600, femenino: 7200, total: 12800 },
          { año: "2024", masculino: 5800, femenino: 7400, total: 13200 }
        ]
      }
    },
    distrito: {
      titulo: "Pacientes por Distrito",
      icono: MapPin,
      datos: {
        dia: [
          { fecha: "2024-10-20", miraflores: 8, sanIsidro: 6, surco: 10, laMolina: 4, otros: 12 },
          { fecha: "2024-10-21", miraflores: 9, sanIsidro: 7, surco: 8, laMolina: 5, otros: 11 },
          { fecha: "2024-10-22", miraflores: 7, sanIsidro: 8, surco: 9, laMolina: 6, otros: 10 },
          { fecha: "2024-10-23", miraflores: 10, sanIsidro: 5, surco: 7, laMolina: 4, otros: 14 },
          { fecha: "2024-10-24", miraflores: 8, sanIsidro: 6, surco: 11, laMolina: 5, otros: 10 },
          { fecha: "2024-10-25", miraflores: 9, sanIsidro: 7, surco: 8, laMolina: 6, otros: 10 },
          { fecha: "2024-10-26", miraflores: 7, sanIsidro: 8, surco: 10, laMolina: 4, otros: 11 }
        ],
        mes: [
          { mes: "Enero", miraflores: 220, sanIsidro: 180, surco: 250, laMolina: 120, otros: 330 },
          { mes: "Febrero", miraflores: 240, sanIsidro: 190, surco: 230, laMolina: 130, otros: 310 },
          { mes: "Marzo", miraflores: 230, sanIsidro: 200, surco: 240, laMolina: 140, otros: 290 },
          { mes: "Abril", miraflores: 250, sanIsidro: 180, surco: 220, laMolina: 150, otros: 300 },
          { mes: "Mayo", miraflores: 220, sanIsidro: 210, surco: 250, laMolina: 120, otros: 300 },
          { mes: "Junio", miraflores: 240, sanIsidro: 190, surco: 230, laMolina: 130, otros: 310 }
        ],
        año: [
          { año: "2021", miraflores: 2600, sanIsidro: 2200, surco: 3000, laMolina: 1600, otros: 2600 },
          { año: "2022", miraflores: 2700, sanIsidro: 2300, surco: 3100, laMolina: 1700, otros: 2600 },
          { año: "2023", miraflores: 2800, sanIsidro: 2400, surco: 3200, laMolina: 1800, otros: 2600 },
          { año: "2024", miraflores: 2900, sanIsidro: 2500, surco: 3300, laMolina: 1900, otros: 2600 }
        ]
      }
    },
    captacion: {
      titulo: "Pacientes por Forma de Captación",
      icono: Target,
      datos: {
        dia: [
          { fecha: "2024-10-20", facebook: 8, google: 6, referido: 12, whatsapp: 8, otros: 6 },
          { fecha: "2024-10-21", facebook: 9, google: 7, referido: 10, whatsapp: 9, otros: 5 },
          { fecha: "2024-10-22", facebook: 7, google: 8, referido: 11, whatsapp: 7, otros: 7 },
          { fecha: "2024-10-23", facebook: 10, google: 5, referido: 9, whatsapp: 10, otros: 6 },
          { fecha: "2024-10-24", facebook: 8, google: 6, referido: 13, whatsapp: 8, otros: 5 },
          { fecha: "2024-10-25", facebook: 9, google: 7, referido: 10, whatsapp: 9, otros: 5 },
          { fecha: "2024-10-26", facebook: 7, google: 8, referido: 12, whatsapp: 7, otros: 6 }
        ],
        mes: [
          { mes: "Enero", facebook: 220, google: 180, referido: 300, whatsapp: 250, otros: 150 },
          { mes: "Febrero", facebook: 240, google: 190, referido: 280, whatsapp: 230, otros: 160 },
          { mes: "Marzo", facebook: 230, google: 200, referido: 290, whatsapp: 240, otros: 140 },
          { mes: "Abril", facebook: 250, google: 180, referido: 270, whatsapp: 250, otros: 150 },
          { mes: "Mayo", facebook: 220, google: 210, referido: 300, whatsapp: 220, otros: 150 },
          { mes: "Junio", facebook: 240, google: 190, referido: 280, whatsapp: 230, otros: 160 }
        ],
        año: [
          { año: "2021", facebook: 2600, google: 2200, referido: 3600, whatsapp: 3000, otros: 1800 },
          { año: "2022", facebook: 2700, google: 2300, referido: 3700, whatsapp: 3100, otros: 1900 },
          { año: "2023", facebook: 2800, google: 2400, referido: 3800, whatsapp: 3200, otros: 2000 },
          { año: "2024", facebook: 2900, google: 2500, referido: 3900, whatsapp: 3300, otros: 2100 }
        ]
      }
    },
    tipo: {
      titulo: "Pacientes por Tipo",
      icono: UserCheck,
      datos: {
        dia: [
          { fecha: "2024-10-20", nuevos: 12, continuadores: 20, reingresos: 8 },
          { fecha: "2024-10-21", nuevos: 15, continuadores: 18, reingresos: 7 },
          { fecha: "2024-10-22", nuevos: 10, continuadores: 22, reingresos: 8 },
          { fecha: "2024-10-23", nuevos: 14, continuadores: 19, reingresos: 7 },
          { fecha: "2024-10-24", nuevos: 13, continuadores: 20, reingresos: 7 },
          { fecha: "2024-10-25", nuevos: 11, continuadores: 21, reingresos: 8 },
          { fecha: "2024-10-26", nuevos: 16, continuadores: 17, reingresos: 7 }
        ],
        mes: [
          { mes: "Enero", nuevos: 330, continuadores: 550, reingresos: 220 },
          { mes: "Febrero", nuevos: 350, continuadores: 530, reingresos: 220 },
          { mes: "Marzo", nuevos: 320, continuadores: 560, reingresos: 220 },
          { mes: "Abril", nuevos: 340, continuadores: 540, reingresos: 220 },
          { mes: "Mayo", nuevos: 330, continuadores: 550, reingresos: 220 },
          { mes: "Junio", nuevos: 360, continuadores: 520, reingresos: 220 }
        ],
        año: [
          { año: "2021", nuevos: 3600, continuadores: 6000, reingresos: 2400 },
          { año: "2022", nuevos: 3700, continuadores: 6100, reingresos: 2600 },
          { año: "2023", nuevos: 3800, continuadores: 6200, reingresos: 2800 },
          { año: "2024", nuevos: 3900, continuadores: 6300, reingresos: 3000 }
        ]
      }
    }
  };

  const dataActual = reportesData[tipoReporte].datos[periodo];
  const IconoComponente = reportesData[tipoReporte].icono;

  const getTotalPeriodo = () => {
    return dataActual.reduce((sum, item) => {
      if (tipoReporte === 'sexo') {
        return sum + (item as DatosSexo).total;
      } else if (tipoReporte === 'distrito') {
        const distritoItem = item as DatosDistrito;
        return sum + distritoItem.miraflores + distritoItem.sanIsidro + distritoItem.surco + distritoItem.laMolina + distritoItem.otros;
      } else if (tipoReporte === 'captacion') {
        const captacionItem = item as DatosCaptacion;
        return sum + captacionItem.facebook + captacionItem.google + captacionItem.referido + captacionItem.whatsapp + captacionItem.otros;
      } else if (tipoReporte === 'tipo') {
        const tipoItem = item as DatosTipo;
        return sum + tipoItem.nuevos + tipoItem.continuadores + tipoItem.reingresos;
      }
      return sum;
    }, 0);
  };

  const getPromedioDiario = () => {
    const total = getTotalPeriodo();
    if (periodo === 'dia') return total / 7; // 7 días
    if (periodo === 'mes') return total / 30; // 30 días promedio
    return total / 365; // 365 días
  };

  return (
    <div className="space-y-6">
      {/* Header con controles */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <IconoComponente className="h-5 w-5 text-primary" />
                {reportesData[tipoReporte].titulo}
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Análisis por {periodo === 'dia' ? 'día' : periodo === 'mes' ? 'mes' : 'año'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={periodo}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dia">Por Día</SelectItem>
                  <SelectItem value="mes">Por Mes</SelectItem>
                  <SelectItem value="año">Por Año</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Total del Período</p>
              <p className="text-2xl font-bold text-primary">
                {getTotalPeriodo().toLocaleString()}
              </p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Promedio Diario</p>
              <p className="text-2xl font-bold text-blue-600">
                {getPromedioDiario().toFixed(1)}
              </p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <BarChart3 className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Períodos Analizados</p>
              <p className="text-2xl font-bold text-green-600">
                {dataActual.length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de datos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Detalle por {periodo === 'dia' ? 'Día' : periodo === 'mes' ? 'Mes' : 'Año'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">
                    {periodo === 'dia' ? 'Fecha' : periodo === 'mes' ? 'Mes' : 'Año'}
                  </th>
                  {tipoReporte === 'sexo' && (
                    <>
                      <th className="text-right p-3 font-medium">Masculino</th>
                      <th className="text-right p-3 font-medium">Femenino</th>
                    </>
                  )}
                  {tipoReporte === 'distrito' && (
                    <>
                      <th className="text-right p-3 font-medium">Miraflores</th>
                      <th className="text-right p-3 font-medium">San Isidro</th>
                      <th className="text-right p-3 font-medium">Surco</th>
                      <th className="text-right p-3 font-medium">La Molina</th>
                      <th className="text-right p-3 font-medium">Otros</th>
                    </>
                  )}
                  {tipoReporte === 'captacion' && (
                    <>
                      <th className="text-right p-3 font-medium">Facebook</th>
                      <th className="text-right p-3 font-medium">Google</th>
                      <th className="text-right p-3 font-medium">Referido</th>
                      <th className="text-right p-3 font-medium">WhatsApp</th>
                      <th className="text-right p-3 font-medium">Otros</th>
                    </>
                  )}
                  {tipoReporte === 'tipo' && (
                    <>
                      <th className="text-right p-3 font-medium">Nuevos</th>
                      <th className="text-right p-3 font-medium">Continuadores</th>
                      <th className="text-right p-3 font-medium">Reingresos</th>
                    </>
                  )}
                  <th className="text-right p-3 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {dataActual.map((item, index) => {
                  const getFecha = () => {
                    if (periodo === 'dia') return (item as DatosSexo).fecha;
                    if (periodo === 'mes') return (item as DatosSexo).mes;
                    return (item as DatosSexo).año;
                  };

                  const getTotal = () => {
                    if (tipoReporte === 'sexo') {
                      return (item as DatosSexo).total;
                    } else if (tipoReporte === 'distrito') {
                      const distritoItem = item as DatosDistrito;
                      return distritoItem.miraflores + distritoItem.sanIsidro + distritoItem.surco + distritoItem.laMolina + distritoItem.otros;
                    } else if (tipoReporte === 'captacion') {
                      const captacionItem = item as DatosCaptacion;
                      return captacionItem.facebook + captacionItem.google + captacionItem.referido + captacionItem.whatsapp + captacionItem.otros;
                    } else if (tipoReporte === 'tipo') {
                      const tipoItem = item as DatosTipo;
                      return tipoItem.nuevos + tipoItem.continuadores + tipoItem.reingresos;
                    }
                    return 0;
                  };

                  return (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="p-3 font-medium">
                        {getFecha()}
                      </td>
                      {tipoReporte === 'sexo' && (
                        <>
                          <td className="text-right p-3">{(item as DatosSexo).masculino}</td>
                          <td className="text-right p-3">{(item as DatosSexo).femenino}</td>
                        </>
                      )}
                      {tipoReporte === 'distrito' && (
                        <>
                          <td className="text-right p-3">{(item as DatosDistrito).miraflores}</td>
                          <td className="text-right p-3">{(item as DatosDistrito).sanIsidro}</td>
                          <td className="text-right p-3">{(item as DatosDistrito).surco}</td>
                          <td className="text-right p-3">{(item as DatosDistrito).laMolina}</td>
                          <td className="text-right p-3">{(item as DatosDistrito).otros}</td>
                        </>
                      )}
                      {tipoReporte === 'captacion' && (
                        <>
                          <td className="text-right p-3">{(item as DatosCaptacion).facebook}</td>
                          <td className="text-right p-3">{(item as DatosCaptacion).google}</td>
                          <td className="text-right p-3">{(item as DatosCaptacion).referido}</td>
                          <td className="text-right p-3">{(item as DatosCaptacion).whatsapp}</td>
                          <td className="text-right p-3">{(item as DatosCaptacion).otros}</td>
                        </>
                      )}
                      {tipoReporte === 'tipo' && (
                        <>
                          <td className="text-right p-3">
                            <Badge variant="default" className="bg-success text-success-foreground">
                              {(item as DatosTipo).nuevos}
                            </Badge>
                          </td>
                          <td className="text-right p-3">
                            <Badge variant="secondary">
                              {(item as DatosTipo).continuadores}
                            </Badge>
                          </td>
                          <td className="text-right p-3">
                            <Badge variant="outline">
                              {(item as DatosTipo).reingresos}
                            </Badge>
                          </td>
                        </>
                      )}
                      <td className="text-right p-3 font-medium text-primary">
                        {getTotal()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Resumen estadístico */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Resumen Estadístico
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tipoReporte === 'sexo' && (
              <>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">% Masculino</p>
                  <p className="text-xl font-bold text-blue-600">
                    {((dataActual.reduce((sum, item) => sum + (item as DatosSexo).masculino, 0) / getTotalPeriodo()) * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">% Femenino</p>
                  <p className="text-xl font-bold text-pink-600">
                    {((dataActual.reduce((sum, item) => sum + (item as DatosSexo).femenino, 0) / getTotalPeriodo()) * 100).toFixed(1)}%
                  </p>
                </div>
              </>
            )}
            {tipoReporte === 'distrito' && (
              <>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Distrito Principal</p>
                  <p className="text-lg font-bold text-primary">Surco</p>
                  <p className="text-sm text-muted-foreground">
                    {((dataActual.reduce((sum, item) => sum + (item as DatosDistrito).surco, 0) / getTotalPeriodo()) * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Distrito Secundario</p>
                  <p className="text-lg font-bold text-primary">Miraflores</p>
                  <p className="text-sm text-muted-foreground">
                    {((dataActual.reduce((sum, item) => sum + (item as DatosDistrito).miraflores, 0) / getTotalPeriodo()) * 100).toFixed(1)}%
                  </p>
                </div>
              </>
            )}
            {tipoReporte === 'captacion' && (
              <>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Canal Principal</p>
                  <p className="text-lg font-bold text-primary">Referidos</p>
                  <p className="text-sm text-muted-foreground">
                    {((dataActual.reduce((sum, item) => sum + (item as DatosCaptacion).referido, 0) / getTotalPeriodo()) * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Canal Digital</p>
                  <p className="text-lg font-bold text-primary">Facebook</p>
                  <p className="text-sm text-muted-foreground">
                    {((dataActual.reduce((sum, item) => sum + (item as DatosCaptacion).facebook, 0) / getTotalPeriodo()) * 100).toFixed(1)}%
                  </p>
                </div>
              </>
            )}
            {tipoReporte === 'tipo' && (
              <>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">% Nuevos</p>
                  <p className="text-xl font-bold text-green-600">
                    {((dataActual.reduce((sum, item) => sum + (item as DatosTipo).nuevos, 0) / getTotalPeriodo()) * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">% Continuadores</p>
                  <p className="text-xl font-bold text-blue-600">
                    {((dataActual.reduce((sum, item) => sum + (item as DatosTipo).continuadores, 0) / getTotalPeriodo()) * 100).toFixed(1)}%
                  </p>
                </div>
              </>
            )}
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Tendencia</p>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <p className="text-lg font-bold text-green-600">+5.2%</p>
              </div>
              <p className="text-sm text-muted-foreground">vs período anterior</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Variabilidad</p>
              <p className="text-lg font-bold text-purple-600">Baja</p>
              <p className="text-sm text-muted-foreground">Estable</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
