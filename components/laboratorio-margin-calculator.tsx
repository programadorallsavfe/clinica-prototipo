'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Percent,
  Building2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface LaboratorioMarginData {
  id: string;
  nombre: string;
  pacientesAtendidos: number;
  costoPorAtencion: number;
  margenGananciaLaboratorio: number; // Porcentaje que se paga al laboratorio
  montoTotalRecaudado: number;
  montoAPagarLaboratorio: number;
  gananciaClinica: number;
  estado: 'activo' | 'inactivo';
}

interface LaboratorioMarginCalculatorProps {
  laboratorio: LaboratorioMarginData;
  onUpdate: (updatedLaboratorio: LaboratorioMarginData) => void;
}

export default function LaboratorioMarginCalculator({ 
  laboratorio, 
  onUpdate 
}: LaboratorioMarginCalculatorProps) {
  const [localData, setLocalData] = useState<LaboratorioMarginData>(laboratorio);
  const [isEditing, setIsEditing] = useState(false);

  // Calcular valores derivados
  const montoTotalRecaudado = localData.pacientesAtendidos * localData.costoPorAtencion;
  const montoAPagarLaboratorio = montoTotalRecaudado * (localData.margenGananciaLaboratorio / 100);
  const gananciaClinica = montoTotalRecaudado - montoAPagarLaboratorio;
  const porcentajeGananciaClinica = 100 - localData.margenGananciaLaboratorio;

  // Actualizar datos locales cuando cambie el prop
  useEffect(() => {
    setLocalData(laboratorio);
  }, [laboratorio]);

  const handleInputChange = (field: keyof LaboratorioMarginData, value: string | number) => {
    const newValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
    setLocalData(prev => ({
      ...prev,
      [field]: newValue
    }));
  };

  const handleSave = () => {
    const updatedData = {
      ...localData,
      montoTotalRecaudado,
      montoAPagarLaboratorio,
      gananciaClinica
    };
    onUpdate(updatedData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalData(laboratorio);
    setIsEditing(false);
  };

  const getMargenColor = (margen: number) => {
    if (margen <= 20) return 'text-success';
    if (margen <= 40) return 'text-warning';
    return 'text-destructive';
  };

  const getMargenBadgeVariant = (margen: number) => {
    if (margen <= 20) return 'default';
    if (margen <= 40) return 'secondary';
    return 'destructive';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" style={{ color: 'var(--primary)' }} />
            {localData.nombre}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge 
              variant={localData.estado === 'activo' ? 'default' : 'secondary'}
              className={localData.estado === 'activo' ? 'bg-success text-success-foreground' : ''}
            >
              {localData.estado === 'activo' ? (
                <><CheckCircle className="h-3 w-3 mr-1" />Activo</>
              ) : (
                <><AlertCircle className="h-3 w-3 mr-1" />Inactivo</>
              )}
            </Badge>
            {!isEditing ? (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Calculator className="h-4 w-4 mr-2" />
                Configurar Margen
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={handleSave}
                  className="bg-success hover:bg-success/90 text-success-foreground"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Guardar
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleCancel}
                >
                  Cancelar
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Información Base */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <Users className="h-4 w-4" style={{ color: 'var(--primary)' }} />
              Información Base
            </h4>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="pacientes" className="text-sm text-muted-foreground">
                  Pacientes Atendidos
                </Label>
                {isEditing ? (
                  <Input
                    id="pacientes"
                    type="number"
                    value={localData.pacientesAtendidos}
                    onChange={(e) => handleInputChange('pacientesAtendidos', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <div className="flex items-center gap-2 mt-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-lg font-semibold text-foreground">
                      {localData.pacientesAtendidos.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="costo" className="text-sm text-muted-foreground">
                  Costo por Atención (S/)
                </Label>
                {isEditing ? (
                  <Input
                    id="costo"
                    type="number"
                    step="0.01"
                    value={localData.costoPorAtencion}
                    onChange={(e) => handleInputChange('costoPorAtencion', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <div className="flex items-center gap-2 mt-1">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-lg font-semibold text-foreground">
                      S/ {localData.costoPorAtencion.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <Percent className="h-4 w-4" style={{ color: 'var(--primary)' }} />
              Configuración de Margen
            </h4>
            
            <div>
              <Label htmlFor="margen" className="text-sm text-muted-foreground">
                Margen de Ganancia para Laboratorio (%)
              </Label>
              {isEditing ? (
                <Input
                  id="margen"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={localData.margenGananciaLaboratorio}
                  onChange={(e) => handleInputChange('margenGananciaLaboratorio', e.target.value)}
                  className="mt-1"
                />
              ) : (
                <div className="flex items-center gap-2 mt-1">
                  <Badge 
                    variant={getMargenBadgeVariant(localData.margenGananciaLaboratorio)}
                    className="text-lg px-3 py-1"
                  >
                    {localData.margenGananciaLaboratorio}%
                  </Badge>
                </div>
              )}
            </div>

            {/* Indicador de salud del margen */}
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
              <div className="flex items-center gap-2 text-sm">
                {localData.margenGananciaLaboratorio <= 20 ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-success font-medium">Margen Saludable</span>
                  </>
                ) : localData.margenGananciaLaboratorio <= 40 ? (
                  <>
                    <AlertCircle className="h-4 w-4 text-warning" />
                    <span className="text-warning font-medium">Margen Moderado</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <span className="text-destructive font-medium">Margen Alto</span>
                  </>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {localData.margenGananciaLaboratorio <= 20 
                  ? "Excelente rentabilidad para la clínica"
                  : localData.margenGananciaLaboratorio <= 40
                  ? "Rentabilidad moderada, considerar optimización"
                  : "Margen alto, revisar estrategia de precios"
                }
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Cálculos Financieros */}
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <Calculator className="h-4 w-4" style={{ color: 'var(--primary)' }} />
            Cálculos Financieros
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Monto Total Recaudado */}
            <Card className="border-l-4" style={{ borderLeftColor: 'var(--info)' }}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Recaudado</p>
                    <p className="text-2xl font-bold" style={{ color: 'var(--info)' }}>
                      S/ {montoTotalRecaudado.toLocaleString('es-ES', { 
                        minimumFractionDigits: 0, 
                        maximumFractionDigits: 0 
                      })}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8" style={{ color: 'var(--info)' }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {localData.pacientesAtendidos} pacientes × S/ {localData.costoPorAtencion.toFixed(2)}
                </p>
              </CardContent>
            </Card>

            {/* Monto a Pagar al Laboratorio */}
            <Card className="border-l-4" style={{ borderLeftColor: 'var(--warning)' }}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pagar a Laboratorio</p>
                    <p className="text-2xl font-bold" style={{ color: 'var(--warning)' }}>
                      S/ {montoAPagarLaboratorio.toLocaleString('es-ES', { 
                        minimumFractionDigits: 0, 
                        maximumFractionDigits: 0 
                      })}
                    </p>
                  </div>
                  <TrendingDown className="h-8 w-8" style={{ color: 'var(--warning)' }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {localData.margenGananciaLaboratorio}% del total recaudado
                </p>
              </CardContent>
            </Card>

            {/* Ganancia de la Clínica */}
            <Card className="border-l-4" style={{ borderLeftColor: 'var(--success)' }}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Ganancia Clínica</p>
                    <p className="text-2xl font-bold" style={{ color: 'var(--success)' }}>
                      S/ {gananciaClinica.toLocaleString('es-ES', { 
                        minimumFractionDigits: 0, 
                        maximumFractionDigits: 0 
                      })}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8" style={{ color: 'var(--success)' }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {porcentajeGananciaClinica.toFixed(1)}% del total recaudado
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Resumen de Rentabilidad */}
        <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--accent)' }}>
          <h5 className="font-semibold text-foreground mb-3">Resumen de Rentabilidad</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Por cada S/ 100 recaudados:</p>
              <ul className="mt-2 space-y-1">
                <li className="flex justify-between">
                  <span>Laboratorio recibe:</span>
                  <span className="font-medium" style={{ color: 'var(--warning)' }}>
                    S/ {localData.margenGananciaLaboratorio.toFixed(2)}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Clínica retiene:</span>
                  <span className="font-medium" style={{ color: 'var(--success)' }}>
                    S/ {porcentajeGananciaClinica.toFixed(2)}
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-muted-foreground">Rentabilidad por paciente:</p>
              <ul className="mt-2 space-y-1">
                <li className="flex justify-between">
                  <span>Laboratorio:</span>
                  <span className="font-medium" style={{ color: 'var(--warning)' }}>
                    S/ {(localData.costoPorAtencion * localData.margenGananciaLaboratorio / 100).toFixed(2)}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Clínica:</span>
                  <span className="font-medium" style={{ color: 'var(--success)' }}>
                    S/ {(localData.costoPorAtencion * porcentajeGananciaClinica / 100).toFixed(2)}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
