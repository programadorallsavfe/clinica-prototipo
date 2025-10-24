'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calculator, 
  DollarSign, 
  Percent, 
  User, 
  Calendar, 
  FileText, 
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Download,
  RefreshCw
} from 'lucide-react';
import { Colaborador, Comision } from '@/lib/types';

interface CalculadoraComisionesProps {
  colaboradores: Colaborador[];
  onCalcularComisiones: (colaboradorId: string, periodo: string) => void;
  onGenerarReporte: (colaboradorId: string, periodo: string) => void;
}

export function CalculadoraComisiones({ 
  colaboradores, 
  onCalcularComisiones, 
  onGenerarReporte 
}: CalculadoraComisionesProps) {
  const [colaboradorSeleccionado, setColaboradorSeleccionado] = useState('');
  const [periodo, setPeriodo] = useState('enero-2024');
  const [montoServicio, setMontoServicio] = useState('');
  const [tipoServicio, setTipoServicio] = useState('');
  const [isCalculando, setIsCalculando] = useState(false);
  const [resultadoCalculo, setResultadoCalculo] = useState<{
    montoServicio: number;
    porcentajeComision: number;
    montoComision: number;
    colaborador: Colaborador | null;
  } | null>(null);

  const tiposServicio = [
    'Consulta Médica',
    'Control Prenatal',
    'Ecografía',
    'Laboratorio',
    'Procedimiento',
    'Cirugía',
    'Terapia',
    'Otro'
  ];

  const periodos = [
    'enero-2024',
    'febrero-2024',
    'marzo-2024',
    'abril-2024',
    'mayo-2024',
    'junio-2024'
  ];

  const colaborador = colaboradores.find(c => c.id === colaboradorSeleccionado);

  const calcularComision = () => {
    if (!colaborador || !montoServicio) return;

    const monto = parseFloat(montoServicio);
    if (isNaN(monto) || monto <= 0) return;

    const porcentaje = colaborador.porcentajeComision;
    const comision = (monto * porcentaje) / 100;

    setResultadoCalculo({
      montoServicio: monto,
      porcentajeComision: porcentaje,
      montoComision: comision,
      colaborador
    });
  };

  const handleCalcularComisiones = async () => {
    if (!colaboradorSeleccionado || !periodo) return;

    setIsCalculando(true);
    // Simular cálculo de comisiones
    await new Promise(resolve => setTimeout(resolve, 2000));
    onCalcularComisiones(colaboradorSeleccionado, periodo);
    setIsCalculando(false);
  };

  const handleGenerarReporte = () => {
    if (!colaboradorSeleccionado || !periodo) return;
    onGenerarReporte(colaboradorSeleccionado, periodo);
  };

  useEffect(() => {
    if (colaborador && montoServicio) {
      calcularComision();
    }
  }, [colaborador, montoServicio]);

  return (
    <div className="space-y-6">
      {/* Calculadora Individual */}
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Calculadora de Comisiones
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Calcula comisiones individuales para colaboradores
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Selección de Colaborador */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="colaborador" className="text-sm font-medium text-foreground">
                  Colaborador
                </Label>
                <Select value={colaboradorSeleccionado} onValueChange={setColaboradorSeleccionado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar colaborador" />
                  </SelectTrigger>
                  <SelectContent>
                    {colaboradores.filter(c => c.activo).map((colaborador) => (
                      <SelectItem key={colaborador.id} value={colaborador.id}>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{colaborador.nombre} {colaborador.apellidos}</span>
                          <Badge variant="outline" className="ml-2">
                            {colaborador.porcentajeComision}%
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Información del Colaborador */}
              {colaborador && (
                <div className="p-4 bg-muted/50 rounded-lg border border-border">
                  <h4 className="font-medium text-foreground mb-2">Información del Colaborador</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tipo:</span>
                      <span className="text-foreground">{colaborador.tipo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Porcentaje:</span>
                      <span className="text-foreground font-medium">{colaborador.porcentajeComision}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Comisiones Pagadas:</span>
                      <span className="text-foreground">S/ {colaborador.totalComisionesPagadas.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Comisiones Pendientes:</span>
                      <span className="text-foreground">S/ {colaborador.totalComisionesPendientes.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Cálculo de Comisión */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="montoServicio" className="text-sm font-medium text-foreground">
                  Monto del Servicio (S/)
                </Label>
                <Input
                  id="montoServicio"
                  type="number"
                  value={montoServicio}
                  onChange={(e) => setMontoServicio(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipoServicio" className="text-sm font-medium text-foreground">
                  Tipo de Servicio
                </Label>
                <Select value={tipoServicio} onValueChange={setTipoServicio}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo de servicio" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposServicio.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Resultado del Cálculo */}
              {resultadoCalculo && (
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Resultado del Cálculo
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monto del Servicio:</span>
                      <span className="text-foreground font-medium">
                        S/ {resultadoCalculo.montoServicio.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Porcentaje de Comisión:</span>
                      <span className="text-foreground font-medium">
                        {resultadoCalculo.porcentajeComision}%
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-2">
                      <span className="text-foreground font-medium">Comisión a Pagar:</span>
                      <span className="text-primary font-bold text-lg">
                        S/ {resultadoCalculo.montoComision.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calculadora Masiva */}
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Cálculo Masivo de Comisiones
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Calcula comisiones para todos los colaboradores en un período específico
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="periodo" className="text-sm font-medium text-foreground">
                Período
              </Label>
              <Select value={periodo} onValueChange={setPeriodo}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar período" />
                </SelectTrigger>
                <SelectContent>
                  {periodos.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1).replace('-', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                Colaboradores Activos
              </Label>
              <div className="p-3 bg-muted/50 rounded-lg border border-border">
                <div className="text-sm text-foreground">
                  {colaboradores.filter(c => c.activo).length} colaboradores activos
                </div>
              </div>
            </div>
          </div>

          {/* Información del Período */}
          <div className="p-4 bg-muted/50 rounded-lg border border-border">
            <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Información del Período
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Período Seleccionado:</div>
                <div className="text-foreground font-medium">
                  {periodo.charAt(0).toUpperCase() + periodo.slice(1).replace('-', ' ')}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Colaboradores a Procesar:</div>
                <div className="text-foreground font-medium">
                  {colaboradores.filter(c => c.activo).length}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Estado:</div>
                <div className="text-foreground font-medium">Listo para calcular</div>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex items-center justify-between pt-4">
            <div className="text-sm text-muted-foreground">
              El cálculo incluirá todos los servicios realizados por colaboradores activos en el período seleccionado.
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={handleGenerarReporte}
                disabled={!colaboradorSeleccionado || !periodo}
              >
                <FileText className="h-4 w-4 mr-2" />
                Generar Reporte
              </Button>
              <Button 
                onClick={handleCalcularComisiones}
                disabled={!colaboradorSeleccionado || !periodo || isCalculando}
                className="bg-primary hover:bg-primary/90"
              >
                {isCalculando ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Calculator className="h-4 w-4 mr-2" />
                )}
                {isCalculando ? 'Calculando...' : 'Calcular Comisiones'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alertas y Recomendaciones */}
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Alertas y Recomendaciones
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
              <h4 className="font-medium text-warning mb-2">Comisiones Pendientes</h4>
              <p className="text-sm text-muted-foreground">
                Hay {colaboradores.reduce((sum, c) => sum + c.totalComisionesPendientes, 0)} comisiones pendientes de pago.
              </p>
            </div>

            <div className="p-4 bg-info/10 rounded-lg border border-info/20">
              <h4 className="font-medium text-info mb-2">Recomendación</h4>
              <p className="text-sm text-muted-foreground">
                Procesa los pagos de comisiones mensualmente para mantener un flujo de caja saludable.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
