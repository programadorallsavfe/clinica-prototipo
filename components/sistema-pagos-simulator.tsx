'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  CreditCard, 
  Smartphone, 
  Banknote, 
  CheckCircle, 
  Clock, 
  XCircle,
  AlertTriangle,
  DollarSign,
  User,
  Calendar,
  FileText,
  ExternalLink,
  RefreshCw,
  QrCode,
  Building2,
  Wallet
} from 'lucide-react';
import Image from 'next/image';
import { SistemaPago, Comision } from '@/lib/types';

interface SistemaPagosSimulatorProps {
  comisiones: Comision[];
  onProcesarPago: (comisionId: string, metodoPago: string, monto: number) => void;
  onVerificarPago: (pagoId: string) => void;
}

export function SistemaPagosSimulator({ 
  comisiones, 
  onProcesarPago, 
  onVerificarPago 
}: SistemaPagosSimulatorProps) {
  const [pagos, setPagos] = useState<SistemaPago[]>([]);
  const [metodoPago, setMetodoPago] = useState('');
  const [montoPago, setMontoPago] = useState('');
  const [comisionSeleccionada, setComisionSeleccionada] = useState('');
  const [isProcesando, setIsProcesando] = useState(false);
  const [isVerificando, setIsVerificando] = useState(false);

  const metodosPago = [
    { 
      value: 'yape', 
      label: 'Yape', 
      icon: 'yape',
      color: 'bg-purple-500',
      descripcion: 'Pago móvil Yape',
      logo: '/yape-app-seeklogo.png'
    },
    { 
      value: 'plin', 
      label: 'Plin', 
      icon: 'plin',
      color: 'bg-blue-500',
      descripcion: 'Pago móvil Plin',
      logo: '/plin-seeklogo.png'
    },
    { 
      value: 'transferencia', 
      label: 'Transferencia Bancaria', 
      icon: Building2, 
      color: 'bg-green-500',
      descripcion: 'Transferencia a cuenta bancaria',
      logo: null
    },
    { 
      value: 'efectivo', 
      label: 'Efectivo', 
      icon: Wallet, 
      color: 'bg-yellow-500',
      descripcion: 'Pago en efectivo',
      logo: null
    }
  ];

  const comision = comisiones.find(c => c.id === comisionSeleccionada);

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'bg-yellow-500';
      case 'procesando': return 'bg-blue-500';
      case 'completado': return 'bg-green-500';
      case 'fallido': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getEstadoTexto = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'Pendiente';
      case 'procesando': return 'Procesando';
      case 'completado': return 'Completado';
      case 'fallido': return 'Fallido';
      default: return estado;
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'pendiente': return Clock;
      case 'procesando': return RefreshCw;
      case 'completado': return CheckCircle;
      case 'fallido': return XCircle;
      default: return Clock;
    }
  };

  const handleProcesarPago = async () => {
    if (!comisionSeleccionada || !metodoPago || !montoPago) return;

    setIsProcesando(true);
    
    // Simular procesamiento de pago
    const nuevoPago: SistemaPago = {
      id: `pago_${Date.now()}`,
      tipo: metodoPago as SistemaPago['tipo'],
      monto: parseFloat(montoPago),
      estado: 'procesando',
      fechaCreacion: new Date().toISOString(),
      referencia: `REF-${Date.now()}`
    };

    setPagos(prev => [...prev, nuevoPago]);

    // Simular procesamiento
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Actualizar estado del pago
    setPagos(prev => prev.map(p => 
      p.id === nuevoPago.id 
        ? { ...p, estado: 'completado', fechaProcesamiento: new Date().toISOString() }
        : p
    ));

    onProcesarPago(comisionSeleccionada, metodoPago, parseFloat(montoPago));
    setIsProcesando(false);

    // Limpiar formulario
    setComisionSeleccionada('');
    setMetodoPago('');
    setMontoPago('');
  };

  const handleVerificarPago = async (pagoId: string) => {
    setIsVerificando(true);
    
    // Simular verificación
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onVerificarPago(pagoId);
    setIsVerificando(false);
  };

  const comisionesPendientes = comisiones.filter(c => c.estado === 'pendiente');

  return (
    <div className="space-y-6">
      {/* Formulario de Pago */}
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Procesar Pago de Comisión
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Selecciona una comisión y método de pago para procesar el pago
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Selección de Comisión */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="comision" className="text-sm font-medium text-foreground">
                  Comisión a Pagar
                </Label>
                <Select value={comisionSeleccionada} onValueChange={setComisionSeleccionada}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar comisión" />
                  </SelectTrigger>
                  <SelectContent>
                    {comisionesPendientes.map((com) => (
                      <SelectItem key={com.id} value={com.id}>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          <span>S/ {com.montoComision.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
                          <span className="text-muted-foreground">- {com.tipoServicio}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Información de la Comisión */}
              {comision && (
                <div className="p-4 bg-muted/50 rounded-lg border border-border">
                  <h4 className="font-medium text-foreground mb-2">Detalles de la Comisión</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Servicio:</span>
                      <span className="text-foreground">{comision.tipoServicio}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monto del Servicio:</span>
                      <span className="text-foreground">S/ {comision.montoServicio.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Porcentaje:</span>
                      <span className="text-foreground">{comision.porcentajeComision}%</span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-2">
                      <span className="text-foreground font-medium">Comisión a Pagar:</span>
                      <span className="text-primary font-bold">
                        S/ {comision.montoComision.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Método de Pago */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  Método de Pago
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {metodosPago.map((metodo) => {
                    const isSelected = metodoPago === metodo.value;
                    const IconComponent = typeof metodo.icon === 'string' ? null : metodo.icon;
                    
                    return (
                      <div
                        key={metodo.value}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          isSelected 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50 hover:bg-muted/50'
                        }`}
                        onClick={() => setMetodoPago(metodo.value)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${metodo.color} text-white flex items-center justify-center`}>
                            {metodo.logo ? (
                              <Image
                                src={metodo.logo}
                                alt={metodo.label}
                                width={16}
                                height={16}
                                className="object-contain"
                              />
                            ) : (
                              IconComponent && <IconComponent className="h-4 w-4" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm text-foreground">{metodo.label}</div>
                            <div className="text-xs text-muted-foreground">{metodo.descripcion}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Monto del Pago */}
              <div className="space-y-2">
                <Label htmlFor="monto" className="text-sm font-medium text-foreground">
                  Monto a Pagar (S/)
                </Label>
                <Input
                  id="monto"
                  type="number"
                  value={montoPago}
                  onChange={(e) => setMontoPago(e.target.value)}
                  placeholder={comision ? comision.montoComision.toString() : "0.00"}
                  step="0.01"
                />
                {comision && (
                  <div className="text-xs text-muted-foreground">
                    Monto sugerido: S/ {comision.montoComision.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Botón de Procesar */}
          <div className="flex justify-end">
            <Button 
              onClick={handleProcesarPago}
              disabled={!comisionSeleccionada || !metodoPago || !montoPago || isProcesando}
              className="bg-primary hover:bg-primary/90"
            >
              {isProcesando ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CreditCard className="h-4 w-4 mr-2" />
              )}
              {isProcesando ? 'Procesando...' : 'Procesar Pago'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Historial de Pagos */}
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Historial de Pagos
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Registro de todos los pagos procesados
          </CardDescription>
        </CardHeader>

        <CardContent>
          {pagos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No hay pagos registrados</h3>
              <p className="text-sm">Los pagos procesados aparecerán aquí</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pagos.map((pago) => {
                const EstadoIcon = getEstadoIcon(pago.estado);
                const metodo = metodosPago.find(m => m.value === pago.tipo);
                const IconComponent = metodo && typeof metodo.icon === 'string' ? null : metodo?.icon;
                
                return (
                  <div 
                    key={pago.id}
                    className="p-4 rounded-lg border border-border bg-card"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${metodo?.color || 'bg-gray-500'} text-white flex items-center justify-center`}>
                          {metodo?.logo ? (
                            <Image
                              src={metodo.logo}
                              alt={metodo.label}
                              width={16}
                              height={16}
                              className="object-contain"
                            />
                          ) : (
                            IconComponent && <IconComponent className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">
                            {metodo?.label || pago.tipo}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            S/ {pago.monto.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(pago.fechaCreacion).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Badge 
                          className={`text-white ${getEstadoColor(pago.estado)}`}
                          variant="default"
                        >
                          <div className="flex items-center gap-1">
                            <EstadoIcon className="h-3 w-3" />
                            {getEstadoTexto(pago.estado)}
                          </div>
                        </Badge>
                        
                        {pago.estado === 'procesando' && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleVerificarPago(pago.id)}
                            disabled={isVerificando}
                            className="text-xs"
                          >
                            <RefreshCw className={`h-3 w-3 mr-1 ${isVerificando ? 'animate-spin' : ''}`} />
                            Verificar
                          </Button>
                        )}
                        
                        {pago.referencia && (
                          <div className="text-xs text-muted-foreground">
                            Ref: {pago.referencia}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Simulador de Integración */}
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
            <ExternalLink className="h-5 w-5 text-primary" />
            Integración con Sistemas de Pago
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Metodos de pagos
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Yape */}
            <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-purple-500 text-white flex items-center justify-center">
                  <Image
                    src="/yape-app-seeklogo.png"
                    alt="Yape"
                    width={16}
                    height={16}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Yape</h4>
                  <p className="text-sm text-muted-foreground">Pago móvil</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estado:</span>
                  <span className="text-green-500">Conectado</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Número:</span>
                  <span className="text-foreground">999 888 777</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">API:</span>
                  <span className="text-foreground">v2.1</span>
                </div>
              </div>
            </div>

            {/* Plin */}
            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-blue-500 text-white flex items-center justify-center">
                  <Image
                    src="/plin-seeklogo.png"
                    alt="Plin"
                    width={16}
                    height={16}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Plin</h4>
                  <p className="text-sm text-muted-foreground">Pago móvil</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estado:</span>
                  <span className="text-green-500">Conectado</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Número:</span>
                  <span className="text-foreground">999 888 777</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">API:</span>
                  <span className="text-foreground">v1.8</span>
                </div>
              </div>
            </div>

            {/* Transferencia Bancaria */}
            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-green-500 text-white">
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Transferencia</h4>
                  <p className="text-sm text-muted-foreground">Bancaria</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estado:</span>
                  <span className="text-green-500">Conectado</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Banco:</span>
                  <span className="text-foreground">BCP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cuenta:</span>
                  <span className="text-foreground">****1234</span>
                </div>
              </div>
            </div>

            {/* Efectivo */}
            <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-yellow-500 text-white">
                  <Wallet className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Efectivo</h4>
                  <p className="text-sm text-muted-foreground">Presencial</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estado:</span>
                  <span className="text-green-500">Disponible</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ubicación:</span>
                  <span className="text-foreground">Clínica</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Horario:</span>
                  <span className="text-foreground">8:00 - 18:00</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
