'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Video, 
  FileText, 
  Bell, 
  Stethoscope,
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react';
import { TareaSeguimiento } from '@/lib/types';

interface AddTareaSeguimientoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tarea: Omit<TareaSeguimiento, 'id'>) => void;
  pacienteId?: string;
  citaId?: string;
}

const tiposTarea = [
  { 
    value: 'llamada_telefonica', 
    label: 'Llamada Telefónica', 
    icon: Phone,
    color: 'bg-blue-500',
    descripcion: 'Realizar llamada de seguimiento al paciente'
  },
  { 
    value: 'envio_correo', 
    label: 'Envío de Correo', 
    icon: Mail,
    color: 'bg-green-500',
    descripcion: 'Enviar información por correo electrónico'
  },
  { 
    value: 'envio_enlace_video', 
    label: 'Envío de Enlace de Video', 
    icon: Video,
    color: 'bg-purple-500',
    descripcion: 'Compartir enlace de video educativo o informativo'
  },
  { 
    value: 'envio_pdf', 
    label: 'Envío de PDF', 
    icon: FileText,
    color: 'bg-orange-500',
    descripcion: 'Enviar documento PDF con información médica'
  },
  { 
    value: 'recordatorio_cita', 
    label: 'Recordatorio de Cita', 
    icon: Bell,
    color: 'bg-yellow-500',
    descripcion: 'Recordar al paciente sobre su próxima cita'
  },
  { 
    value: 'seguimiento_tratamiento', 
    label: 'Seguimiento de Tratamiento', 
    icon: Stethoscope,
    color: 'bg-red-500',
    descripcion: 'Seguimiento del tratamiento médico prescrito'
  }
];

const prioridades = [
  { value: 'baja', label: 'Baja', color: 'bg-gray-500' },
  { value: 'media', label: 'Media', color: 'bg-yellow-500' },
  { value: 'alta', label: 'Alta', color: 'bg-orange-500' },
  { value: 'urgente', label: 'Urgente', color: 'bg-red-500' }
];

export function AddTareaSeguimientoModal({ 
  isOpen, 
  onClose, 
  onSave, 
  pacienteId, 
  citaId 
}: AddTareaSeguimientoModalProps) {
  const [formData, setFormData] = useState({
    tipo: '',
    titulo: '',
    descripcion: '',
    fechaProgramada: '',
    horaProgramada: '',
    prioridad: 'media',
    servicioRelacionado: '',
    responsable: '',
    observaciones: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    const newErrors: Record<string, string> = {};
    if (!formData.tipo) newErrors.tipo = 'Selecciona un tipo de tarea';
    if (!formData.titulo.trim()) newErrors.titulo = 'El título es requerido';
    if (!formData.descripcion.trim()) newErrors.descripcion = 'La descripción es requerida';
    if (!formData.fechaProgramada) newErrors.fechaProgramada = 'La fecha es requerida';
    if (!formData.horaProgramada) newErrors.horaProgramada = 'La hora es requerida';
    if (!formData.responsable.trim()) newErrors.responsable = 'El responsable es requerido';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const tareaSeleccionada = tiposTarea.find(t => t.value === formData.tipo);
    
    const nuevaTarea: Omit<TareaSeguimiento, 'id'> = {
      pacienteId: pacienteId || '',
      citaId: citaId,
      tipo: formData.tipo as TareaSeguimiento['tipo'],
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      fechaProgramada: formData.fechaProgramada,
      horaProgramada: formData.horaProgramada,
      estado: 'pendiente',
      prioridad: formData.prioridad as TareaSeguimiento['prioridad'],
      servicioRelacionado: formData.servicioRelacionado || undefined,
      responsable: formData.responsable,
      fechaCreacion: new Date().toISOString(),
      observaciones: formData.observaciones || undefined,
      googleCalendarEventId: undefined,
      sincronizadoConGoogle: false,
      alertaActiva: true,
      fechaAlerta: formData.fechaProgramada
    };

    onSave(nuevaTarea);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      tipo: '',
      titulo: '',
      descripcion: '',
      fechaProgramada: '',
      horaProgramada: '',
      prioridad: 'media',
      servicioRelacionado: '',
      responsable: '',
      observaciones: ''
    });
    setErrors({});
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const tipoSeleccionado = tiposTarea.find(t => t.value === formData.tipo);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Nueva Tarea de Seguimiento
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Programa una tarea de seguimiento para el paciente
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tipo de Tarea */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-foreground">Tipo de Tarea *</Label>
              <div className="grid grid-cols-2 gap-3">
                {tiposTarea.map((tipo) => {
                  const IconComponent = tipo.icon;
                  const isSelected = formData.tipo === tipo.value;
                  
                  return (
                    <div
                      key={tipo.value}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                      }`}
                      onClick={() => handleInputChange('tipo', tipo.value)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${tipo.color} text-white`}>
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm text-foreground">{tipo.label}</div>
                          <div className="text-xs text-muted-foreground">{tipo.descripcion}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {errors.tipo && <p className="text-sm text-destructive">{errors.tipo}</p>}
            </div>

            {/* Información de la Tarea */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="titulo" className="text-sm font-medium text-foreground">
                  Título *
                </Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => handleInputChange('titulo', e.target.value)}
                  placeholder="Título de la tarea"
                  className={errors.titulo ? 'border-destructive' : ''}
                />
                {errors.titulo && <p className="text-sm text-destructive">{errors.titulo}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="prioridad" className="text-sm font-medium text-foreground">
                  Prioridad
                </Label>
                <Select value={formData.prioridad} onValueChange={(value) => handleInputChange('prioridad', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {prioridades.map((prioridad) => (
                      <SelectItem key={prioridad.value} value={prioridad.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${prioridad.color}`}></div>
                          <span>{prioridad.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="descripcion" className="text-sm font-medium text-foreground">
                Descripción *
              </Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                placeholder="Describe los detalles de la tarea..."
                rows={3}
                className={errors.descripcion ? 'border-destructive' : ''}
              />
              {errors.descripcion && <p className="text-sm text-destructive">{errors.descripcion}</p>}
            </div>

            {/* Fecha y Hora */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fechaProgramada" className="text-sm font-medium text-foreground">
                  Fecha Programada *
                </Label>
                <Input
                  id="fechaProgramada"
                  type="date"
                  value={formData.fechaProgramada}
                  onChange={(e) => handleInputChange('fechaProgramada', e.target.value)}
                  className={errors.fechaProgramada ? 'border-destructive' : ''}
                />
                {errors.fechaProgramada && <p className="text-sm text-destructive">{errors.fechaProgramada}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="horaProgramada" className="text-sm font-medium text-foreground">
                  Hora Programada *
                </Label>
                <Input
                  id="horaProgramada"
                  type="time"
                  value={formData.horaProgramada}
                  onChange={(e) => handleInputChange('horaProgramada', e.target.value)}
                  className={errors.horaProgramada ? 'border-destructive' : ''}
                />
                {errors.horaProgramada && <p className="text-sm text-destructive">{errors.horaProgramada}</p>}
              </div>
            </div>

            {/* Responsable y Servicio */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="responsable" className="text-sm font-medium text-foreground">
                  Responsable *
                </Label>
                <Input
                  id="responsable"
                  value={formData.responsable}
                  onChange={(e) => handleInputChange('responsable', e.target.value)}
                  placeholder="Nombre del responsable"
                  className={errors.responsable ? 'border-destructive' : ''}
                />
                {errors.responsable && <p className="text-sm text-destructive">{errors.responsable}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="servicioRelacionado" className="text-sm font-medium text-foreground">
                  Servicio Relacionado
                </Label>
                <Input
                  id="servicioRelacionado"
                  value={formData.servicioRelacionado}
                  onChange={(e) => handleInputChange('servicioRelacionado', e.target.value)}
                  placeholder="Servicio relacionado (opcional)"
                />
              </div>
            </div>

            {/* Observaciones */}
            <div className="space-y-2">
              <Label htmlFor="observaciones" className="text-sm font-medium text-foreground">
                Observaciones
              </Label>
              <Textarea
                id="observaciones"
                value={formData.observaciones}
                onChange={(e) => handleInputChange('observaciones', e.target.value)}
                placeholder="Observaciones adicionales..."
                rows={2}
              />
            </div>

            {/* Vista Previa */}
            {tipoSeleccionado && (
              <div className="p-4 bg-muted/50 rounded-lg border border-border">
                <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  Vista Previa
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`p-1 rounded ${tipoSeleccionado.color} text-white`}>
                      <tipoSeleccionado.icon className="h-3 w-3" />
                    </div>
                    <span className="font-medium">{tipoSeleccionado.label}</span>
                    <Badge variant="outline" className="ml-auto">
                      {prioridades.find(p => p.value === formData.prioridad)?.label}
                    </Badge>
                  </div>
                  <div className="text-muted-foreground">
                    <strong>Título:</strong> {formData.titulo || 'Sin título'}
                  </div>
                  <div className="text-muted-foreground">
                    <strong>Programado para:</strong> {formData.fechaProgramada} a las {formData.horaProgramada}
                  </div>
                  <div className="text-muted-foreground">
                    <strong>Responsable:</strong> {formData.responsable || 'Sin asignar'}
                  </div>
                </div>
              </div>
            )}

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                <CheckCircle className="h-4 w-4 mr-2" />
                Crear Tarea
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
