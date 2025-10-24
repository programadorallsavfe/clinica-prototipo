'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Mail, 
  Send, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';

interface EmailConfirmationSimulatorProps {
  citaData: {
    codigo: string;
    paciente: string;
    doctor: string;
    especialidad: string;
    fecha: string;
    hora: string;
    precio: number;
    email: string;
  };
  onEnviar?: (email: string, asunto: string, contenido: string) => void;
}

interface EmailTemplate {
  id: string;
  nombre: string;
  asunto: string;
  contenido: string;
  variables: string[];
}

const templatesEmail: EmailTemplate[] = [
  {
    id: 'confirmacion',
    nombre: 'Confirmación de Cita',
    asunto: 'Confirmación de Cita - FEMINIS SALUD',
    contenido: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #0EA5A8, #06B6D4); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .cita-details { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .footer { background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666; }
        .button { background: #0EA5A8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🏥 FEMINIS SALUD</h1>
        <p>Confirmación de Cita Médica</p>
    </div>
    
    <div class="content">
        <h2>Hola {{nombre}},</h2>
        <p>Tu cita médica ha sido confirmada exitosamente. A continuación, los detalles:</p>
        
        <div class="cita-details">
            <h3>📋 Detalles de la Cita</h3>
            <p><strong>Código de Cita:</strong> {{codigo}}</p>
            <p><strong>Doctor:</strong> {{doctor}}</p>
            <p><strong>Especialidad:</strong> {{especialidad}}</p>
            <p><strong>Fecha:</strong> {{fecha}}</p>
            <p><strong>Hora:</strong> {{hora}}</p>
            <p><strong>Precio:</strong> S/ {{precio}}</p>
        </div>
        
        <h3>📍 Ubicación</h3>
        <p>Av. Principal 123, Lima, Perú</p>
        <p>Teléfono: (01) 234-5678</p>
        
        <h3>⏰ Instrucciones Importantes</h3>
        <ul>
            <li>Llega 15 minutos antes de tu cita</li>
            <li>Trae tu documento de identidad</li>
            <li>El pago se realiza al momento de la consulta</li>
            <li>Si necesitas cancelar, hazlo con 24 horas de anticipación</li>
        </ul>
        
        <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
        
        <a href="#" class="button">Ver en Google Maps</a>
        <a href="#" class="button">Cancelar Cita</a>
    </div>
    
    <div class="footer">
        <p>© 2024 FEMINIS SALUD. Todos los derechos reservados.</p>
        <p>Este es un email automático, por favor no responder.</p>
    </div>
</body>
</html>`,
    variables: ['nombre', 'codigo', 'doctor', 'especialidad', 'fecha', 'hora', 'precio']
  },
  {
    id: 'recordatorio',
    nombre: 'Recordatorio de Cita',
    asunto: 'Recordatorio: Tu cita es mañana - FEMINIS SALUD',
    contenido: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #F59E0B, #F97316); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .reminder { background: #fef3c7; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #F59E0B; }
        .footer { background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔔 FEMINIS SALUD</h1>
        <p>Recordatorio de Cita</p>
    </div>
    
    <div class="content">
        <h2>Hola {{nombre}},</h2>
        <p>Te recordamos que tienes una cita médica programada:</p>
        
        <div class="reminder">
            <h3>📅 Tu Cita es Mañana</h3>
            <p><strong>Fecha:</strong> {{fecha}}</p>
            <p><strong>Hora:</strong> {{hora}}</p>
            <p><strong>Doctor:</strong> {{doctor}}</p>
            <p><strong>Especialidad:</strong> {{especialidad}}</p>
        </div>
        
        <p><strong>📍 Ubicación:</strong> Av. Principal 123, Lima</p>
        <p><strong>📞 Teléfono:</strong> (01) 234-5678</p>
        
        <p>¡No olvides llegar 15 minutos antes de tu cita!</p>
    </div>
    
    <div class="footer">
        <p>© 2024 FEMINIS SALUD. Todos los derechos reservados.</p>
    </div>
</body>
</html>`,
    variables: ['nombre', 'fecha', 'hora', 'doctor', 'especialidad']
  },
  {
    id: 'cancelacion',
    nombre: 'Cancelación de Cita',
    asunto: 'Cita Cancelada - FEMINIS SALUD',
    contenido: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #DC2626, #EF4444); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .cancelled { background: #fee2e2; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #DC2626; }
        .footer { background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666; }
        .button { background: #0EA5A8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>❌ FEMINIS SALUD</h1>
        <p>Cita Cancelada</p>
    </div>
    
    <div class="content">
        <h2>Hola {{nombre}},</h2>
        <p>Tu cita médica ha sido cancelada:</p>
        
        <div class="cancelled">
            <h3>📋 Cita Cancelada</h3>
            <p><strong>Código:</strong> {{codigo}}</p>
            <p><strong>Fecha:</strong> {{fecha}}</p>
            <p><strong>Hora:</strong> {{hora}}</p>
        </div>
        
        <p>Para reagendar tu cita, puedes:</p>
        <ul>
            <li>Visitar nuestra página web</li>
            <li>Llamarnos al (01) 234-5678</li>
            <li>Enviarnos un WhatsApp</li>
        </ul>
        
        <a href="#" class="button">Reagendar Cita</a>
        
        <p>¡Esperamos verte pronto!</p>
    </div>
    
    <div class="footer">
        <p>© 2024 FEMINIS SALUD. Todos los derechos reservados.</p>
    </div>
</body>
</html>`,
    variables: ['nombre', 'codigo', 'fecha', 'hora']
  }
];

export function EmailConfirmationSimulator({ 
  citaData, 
  onEnviar 
}: EmailConfirmationSimulatorProps) {
  const [templateSeleccionado, setTemplateSeleccionado] = useState('confirmacion');
  const [emailDestino, setEmailDestino] = useState(citaData.email);
  const [asuntoPersonalizado, setAsuntoPersonalizado] = useState('');
  const [contenidoPersonalizado, setContenidoPersonalizado] = useState('');
  const [isEnviando, setIsEnviando] = useState(false);
  const [estadoEnvio, setEstadoEnvio] = useState<'idle' | 'enviando' | 'enviado' | 'error'>('idle');
  const [mostrarHTML, setMostrarHTML] = useState(false);

  const template = templatesEmail.find(t => t.id === templateSeleccionado);

  // Generar contenido con variables reemplazadas
  const generarContenido = (template: EmailTemplate) => {
    let contenido = template.contenido;
    
    // Reemplazar variables
    contenido = contenido.replace(/\{\{nombre\}\}/g, citaData.paciente);
    contenido = contenido.replace(/\{\{codigo\}\}/g, citaData.codigo);
    contenido = contenido.replace(/\{\{doctor\}\}/g, citaData.doctor);
    contenido = contenido.replace(/\{\{especialidad\}\}/g, citaData.especialidad);
    contenido = contenido.replace(/\{\{fecha\}\}/g, citaData.fecha);
    contenido = contenido.replace(/\{\{hora\}\}/g, citaData.hora);
    contenido = contenido.replace(/\{\{precio\}\}/g, citaData.precio.toString());
    
    return contenido;
  };

  const asuntoGenerado = template ? template.asunto : '';
  const contenidoGenerado = template ? generarContenido(template) : '';

  const handleEnviarEmail = async () => {
    setIsEnviando(true);
    setEstadoEnvio('enviando');
    
    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const asuntoFinal = asuntoPersonalizado || asuntoGenerado;
    const contenidoFinal = contenidoPersonalizado || contenidoGenerado;
    
    setEstadoEnvio('enviado');
    setIsEnviando(false);
    
    onEnviar?.(emailDestino, asuntoFinal, contenidoFinal);
  };

  const handleCopiarContenido = () => {
    const contenidoFinal = contenidoPersonalizado || contenidoGenerado;
    navigator.clipboard.writeText(contenidoFinal);
    alert('Contenido copiado al portapapeles');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-blue-600" />
          Simulador de Email
        </CardTitle>
        <CardDescription>
          Envía confirmaciones y recordatorios por correo electrónico
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Información de la Cita */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-3">
              Datos de la Cita
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700 dark:text-blue-300">Paciente:</span>
                <span className="font-medium">{citaData.paciente}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700 dark:text-blue-300">Email:</span>
                <span className="font-medium">{citaData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700 dark:text-blue-300">Doctor:</span>
                <span className="font-medium">{citaData.doctor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700 dark:text-blue-300">Fecha:</span>
                <span className="font-medium">{citaData.fecha}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Selección de Template */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Plantilla de Email</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {templatesEmail.map((template) => (
              <Card 
                key={template.id}
                className={`cursor-pointer transition-all duration-200 ${
                  templateSeleccionado === template.id 
                    ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' 
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

        {/* Email Destino */}
        <div>
          <Label htmlFor="email">Dirección de Email</Label>
          <Input
            id="email"
            type="email"
            value={emailDestino}
            onChange={(e) => setEmailDestino(e.target.value)}
            placeholder="paciente@email.com"
            className="mt-1"
          />
        </div>

        {/* Asunto */}
        <div>
          <Label htmlFor="asunto">Asunto del Email</Label>
          <Input
            id="asunto"
            value={asuntoPersonalizado}
            onChange={(e) => setAsuntoPersonalizado(e.target.value)}
            placeholder={asuntoGenerado}
            className="mt-1"
          />
        </div>

        {/* Vista Previa del Email */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="text-sm font-medium">Vista Previa del Email</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMostrarHTML(!mostrarHTML)}
            >
              {mostrarHTML ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {mostrarHTML ? 'Ocultar HTML' : 'Ver HTML'}
            </Button>
          </div>
          
          <Card className="bg-gray-50 dark:bg-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Mail className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium">FEMINIS SALUD</p>
                  <p className="text-xs text-muted-foreground">noreply@feminis-salud.com</p>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm">
                {mostrarHTML ? (
                  <pre className="text-xs overflow-auto max-h-64 whitespace-pre-wrap">
                    {contenidoPersonalizado || contenidoGenerado}
                  </pre>
                ) : (
                  <div className="text-sm">
                    <p className="font-medium mb-2">Asunto: {asuntoPersonalizado || asuntoGenerado}</p>
                    <div className="prose prose-sm max-w-none">
                      <div dangerouslySetInnerHTML={{ 
                        __html: (contenidoPersonalizado || contenidoGenerado).replace(/<style[^>]*>[\s\S]*?<\/style>/g, '') 
                      }} />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contenido Personalizado */}
        <div>
          <Label htmlFor="contenidoPersonalizado">Contenido Personalizado (HTML)</Label>
          <Textarea
            id="contenidoPersonalizado"
            value={contenidoPersonalizado}
            onChange={(e) => setContenidoPersonalizado(e.target.value)}
            placeholder="Escribe tu contenido HTML personalizado aquí..."
            className="mt-1"
            rows={8}
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
                  {estadoEnvio === 'enviando' && 'Enviando email...'}
                  {estadoEnvio === 'enviado' && 'Email enviado exitosamente'}
                  {estadoEnvio === 'error' && 'Error al enviar email'}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Botones de Acción */}
        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={handleEnviarEmail}
            disabled={isEnviando || !emailDestino}
            className="flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            {isEnviando ? 'Enviando...' : 'Enviar Email'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleCopiarContenido}
            className="flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            Copiar Contenido
          </Button>
        </div>

        {/* Información Adicional */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
              Información del Simulador
            </h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Este es un simulador visual - no se envían emails reales</li>
              <li>• En producción se integraría con servicios como SendGrid o Mailgun</li>
              <li>• Los templates son personalizables con HTML/CSS</li>
              <li>• Se pueden programar envíos automáticos</li>
              <li>• Soporte para adjuntos y tracking de apertura</li>
            </ul>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
