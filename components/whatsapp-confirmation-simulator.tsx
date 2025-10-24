'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageSquare, 
  Send, 
  CheckCircle, 
  Clock, 
  User, 
  Calendar, 
  Phone,
  AlertCircle,
  RefreshCw,
  Copy,
  ExternalLink
} from 'lucide-react';

interface WhatsAppConfirmationSimulatorProps {
  citaData: {
    codigo: string;
    paciente: string;
    doctor: string;
    especialidad: string;
    fecha: string;
    hora: string;
    precio: number;
    telefono: string;
  };
  onEnviar?: (mensaje: string, telefono: string) => void;
}

interface MensajeTemplate {
  id: string;
  nombre: string;
  contenido: string;
  variables: string[];
}

const templatesMensajes: MensajeTemplate[] = [
  {
    id: 'confirmacion',
    nombre: 'Confirmación de Cita',
    contenido: `🏥 *FEMINIS SALUD* - Confirmación de Cita

Hola {{nombre}}, tu cita ha sido confirmada:

📋 *Detalles de la Cita:*
• Código: {{codigo}}
• Doctor: {{doctor}}
• Especialidad: {{especialidad}}
• Fecha: {{fecha}}
• Hora: {{hora}}
• Precio: S/ {{precio}}

📍 *Ubicación:*
Av. Principal 123, Lima

⏰ *Importante:*
• Llega 15 minutos antes
• Trae tu documento de identidad
• El pago se realiza al momento

¿Necesitas cancelar? Responde CANCELAR

¡Te esperamos! 🩺`,
    variables: ['nombre', 'codigo', 'doctor', 'especialidad', 'fecha', 'hora', 'precio']
  },
  {
    id: 'recordatorio',
    nombre: 'Recordatorio de Cita',
    contenido: `🔔 *FEMINIS SALUD* - Recordatorio

Hola {{nombre}}, te recordamos tu cita:

📅 *Mañana {{fecha}} a las {{hora}}*
👩‍⚕️ Dr(a). {{doctor}}
🏥 {{especialidad}}

📍 Av. Principal 123, Lima

¡No olvides llegar 15 minutos antes! ⏰`,
    variables: ['nombre', 'fecha', 'hora', 'doctor', 'especialidad']
  },
  {
    id: 'cancelacion',
    nombre: 'Cancelación de Cita',
    contenido: `❌ *FEMINIS SALUD* - Cita Cancelada

Hola {{nombre}}, tu cita ha sido cancelada:

📋 Código: {{codigo}}
📅 Fecha: {{fecha}}
🕐 Hora: {{hora}}

Para reagendar, visita nuestra página web o llámanos al (01) 234-5678.

¡Esperamos verte pronto! 🏥`,
    variables: ['nombre', 'codigo', 'fecha', 'hora']
  }
];

export function WhatsAppConfirmationSimulator({ 
  citaData, 
  onEnviar 
}: WhatsAppConfirmationSimulatorProps) {
  const [templateSeleccionado, setTemplateSeleccionado] = useState('confirmacion');
  const [mensajePersonalizado, setMensajePersonalizado] = useState('');
  const [telefonoDestino, setTelefonoDestino] = useState(citaData.telefono);
  const [isEnviando, setIsEnviando] = useState(false);
  const [estadoEnvio, setEstadoEnvio] = useState<'idle' | 'enviando' | 'enviado' | 'error'>('idle');
  const [mensajeEnviado, setMensajeEnviado] = useState('');

  const template = templatesMensajes.find(t => t.id === templateSeleccionado);

  // Generar mensaje con variables reemplazadas
  const generarMensaje = (template: MensajeTemplate) => {
    let mensaje = template.contenido;
    
    // Reemplazar variables
    mensaje = mensaje.replace(/\{\{nombre\}\}/g, citaData.paciente);
    mensaje = mensaje.replace(/\{\{codigo\}\}/g, citaData.codigo);
    mensaje = mensaje.replace(/\{\{doctor\}\}/g, citaData.doctor);
    mensaje = mensaje.replace(/\{\{especialidad\}\}/g, citaData.especialidad);
    mensaje = mensaje.replace(/\{\{fecha\}\}/g, citaData.fecha);
    mensaje = mensaje.replace(/\{\{hora\}\}/g, citaData.hora);
    mensaje = mensaje.replace(/\{\{precio\}\}/g, citaData.precio.toString());
    
    return mensaje;
  };

  const mensajeGenerado = template ? generarMensaje(template) : '';

  const handleEnviarMensaje = async () => {
    setIsEnviando(true);
    setEstadoEnvio('enviando');
    
    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mensajeFinal = mensajePersonalizado || mensajeGenerado;
    setMensajeEnviado(mensajeFinal);
    setEstadoEnvio('enviado');
    setIsEnviando(false);
    
    onEnviar?.(mensajeFinal, telefonoDestino);
  };

  const handleCopiarMensaje = () => {
    const mensajeFinal = mensajePersonalizado || mensajeGenerado;
    navigator.clipboard.writeText(mensajeFinal);
    alert('Mensaje copiado al portapapeles');
  };

  const handleAbrirWhatsApp = () => {
    const mensajeFinal = mensajePersonalizado || mensajeGenerado;
    const mensajeCodificado = encodeURIComponent(mensajeFinal);
    const url = `https://wa.me/${telefonoDestino.replace(/\D/g, '')}?text=${mensajeCodificado}`;
    window.open(url, '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-green-600" />
          Simulador de WhatsApp
        </CardTitle>
        <CardDescription>
          Envía confirmaciones y recordatorios por WhatsApp
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Información de la Cita */}
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <h4 className="font-medium text-green-800 dark:text-green-200 mb-3">
              Datos de la Cita
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-700 dark:text-green-300">Paciente:</span>
                <span className="font-medium">{citaData.paciente}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700 dark:text-green-300">Teléfono:</span>
                <span className="font-medium">{citaData.telefono}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700 dark:text-green-300">Doctor:</span>
                <span className="font-medium">{citaData.doctor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700 dark:text-green-300">Fecha:</span>
                <span className="font-medium">{citaData.fecha}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Selección de Template */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Plantilla de Mensaje</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {templatesMensajes.map((template) => (
              <Card 
                key={template.id}
                className={`cursor-pointer transition-all duration-200 ${
                  templateSeleccionado === template.id 
                    ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => setTemplateSeleccionado(template.id)}
              >
                <CardContent className="p-3">
                  <h4 className="font-medium text-sm">{template.nombre}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {template.variables.length} variables
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Número de Teléfono */}
        <div>
          <Label htmlFor="telefono">Número de WhatsApp</Label>
          <Input
            id="telefono"
            value={telefonoDestino}
            onChange={(e) => setTelefonoDestino(e.target.value)}
            placeholder="+51 999 999 999"
            className="mt-1"
          />
        </div>

        {/* Vista Previa del Mensaje */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Vista Previa del Mensaje</Label>
          <Card className="bg-gray-50 dark:bg-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium">FEMINIS SALUD</p>
                  <p className="text-xs text-muted-foreground">WhatsApp Business</p>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-700 rounded-lg p-3 shadow-sm">
                <pre className="text-sm whitespace-pre-wrap font-sans">
                  {mensajePersonalizado || mensajeGenerado}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mensaje Personalizado */}
        <div>
          <Label htmlFor="mensajePersonalizado">Mensaje Personalizado (Opcional)</Label>
          <Textarea
            id="mensajePersonalizado"
            value={mensajePersonalizado}
            onChange={(e) => setMensajePersonalizado(e.target.value)}
            placeholder="Escribe tu mensaje personalizado aquí..."
            className="mt-1"
            rows={6}
          />
        </div>

        {/* Estado del Envío */}
        {estadoEnvio !== 'idle' && (
          <Card className={`${
            estadoEnvio === 'enviando' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' :
            estadoEnvio === 'enviado' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' :
            'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
          }`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                {estadoEnvio === 'enviando' && <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />}
                {estadoEnvio === 'enviado' && <CheckCircle className="h-4 w-4 text-green-600" />}
                {estadoEnvio === 'error' && <AlertCircle className="h-4 w-4 text-red-600" />}
                <span className={`text-sm font-medium ${
                  estadoEnvio === 'enviando' ? 'text-blue-800 dark:text-blue-200' :
                  estadoEnvio === 'enviado' ? 'text-green-800 dark:text-green-200' :
                  'text-red-800 dark:text-red-200'
                }`}>
                  {estadoEnvio === 'enviando' && 'Enviando mensaje...'}
                  {estadoEnvio === 'enviado' && 'Mensaje enviado exitosamente'}
                  {estadoEnvio === 'error' && 'Error al enviar mensaje'}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Botones de Acción */}
        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={handleEnviarMensaje}
            disabled={isEnviando || !telefonoDestino}
            className="flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            {isEnviando ? 'Enviando...' : 'Enviar por WhatsApp'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleCopiarMensaje}
            className="flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            Copiar Mensaje
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleAbrirWhatsApp}
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Abrir WhatsApp
          </Button>
        </div>

        {/* Información Adicional */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
              Información del Simulador
            </h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Este es un simulador visual - no se envían mensajes reales</li>
              <li>• En producción se integraría con WhatsApp Business API</li>
              <li>• Los templates son personalizables por la clínica</li>
              <li>• Se pueden programar recordatorios automáticos</li>
            </ul>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
