'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  MessageSquare, 
  Mail, 
  Bell, 
  ExternalLink, 
  User, 
  Activity,
  Code,
  Eye,
  Settings
} from 'lucide-react';
import Image from 'next/image';

// Importar todos los componentes creados
import { DisponibilidadTiempoReal } from '@/components/disponibilidad-tiempo-real';
import { WhatsAppConfirmationSimulator } from '@/components/whatsapp-confirmation-simulator';
import { EmailConfirmationSimulator } from '@/components/email-confirmation-simulator';
import { SistemaRecordatoriosAutomaticos } from '@/components/sistema-recordatorios-automaticos';
import { WidgetAgendamientoWeb } from '@/components/widget-agendamiento-web';
import { RegistroPacienteWeb } from '@/components/registro-paciente-web';

export default function DemoAgendamientoOnlinePage() {
  const [activeTab, setActiveTab] = useState('agendamiento');

  // Mock data para las demostraciones
  const citaData = {
    codigo: 'CIT-123456',
    paciente: 'María González',
    doctor: 'Dr. Carlos Ruiz',
    especialidad: 'Ginecología',
    fecha: '2024-01-22',
    hora: '10:00',
    precio: 120,
    telefono: '+51 999 123 456',
    email: 'maria@email.com'
  };

  const doctorData = {
    id: '1',
    name: 'Dr. Carlos Ruiz'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary rounded-lg">
                <Image
                  src="/calendar.png"
                  alt="Calendar"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">FEMINIS SALUD</h1>
                <p className="text-muted-foreground">Demo - Sistema de Agendamiento Online</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-primary border-primary">
                <ExternalLink className="h-3 w-3 mr-1" />
                Simulación Visual
              </Badge>
              <Badge variant="secondary">
                <Activity className="h-3 w-3 mr-1" />
                En Desarrollo
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introducción */}
        <Card className="mb-8 bg-gradient-to-r from-primary/10 to-blue-500/10 border-primary/20">
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                🚀 Sistema de Agendamiento Online Completo
              </h2>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                Esta es una demostración visual de todas las funcionalidades implementadas para el 
                agendamiento online de FEMINIS SALUD. Incluye páginas públicas, simuladores de 
                confirmaciones, recordatorios automáticos y widgets embebibles.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Navegación por Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="agendamiento" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Agendamiento
            </TabsTrigger>
            <TabsTrigger value="disponibilidad" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Disponibilidad
            </TabsTrigger>
            <TabsTrigger value="whatsapp" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              WhatsApp
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="recordatorios" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Recordatorios
            </TabsTrigger>
            <TabsTrigger value="widget" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Widget
            </TabsTrigger>
          </TabsList>

          {/* Tab: Agendamiento Online */}
          <TabsContent value="agendamiento" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Página de Agendamiento Online
                </CardTitle>
                <CardDescription>
                  Interfaz pública para que los pacientes agenden citas desde la página web
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    <strong>Funcionalidades implementadas:</strong>
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Selección de especialidad y doctor</li>
                    <li>• Calendario de fechas disponibles</li>
                    <li>• Horarios en tiempo real</li>
                    <li>• Formulario para pacientes nuevos y existentes</li>
                    <li>• Confirmación de cita con código</li>
                    <li>• Envío de confirmaciones por WhatsApp y Email</li>
                  </ul>
                </div>
                <Button 
                  onClick={() => window.open('/agendamiento-online', '_blank')}
                  className="w-full"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ver Página de Agendamiento Online
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Registro de Nuevos Pacientes
                </CardTitle>
                <CardDescription>
                  Formulario completo para el registro de pacientes desde la web
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    <strong>Características del registro:</strong>
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Datos personales completos</li>
                    <li>• Información médica opcional</li>
                    <li>• Generación automática de credenciales</li>
                    <li>• Términos y condiciones</li>
                    <li>• Envío de credenciales por WhatsApp y Email</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <RegistroPacienteWeb />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Disponibilidad en Tiempo Real */}
          <TabsContent value="disponibilidad" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Disponibilidad en Tiempo Real
                </CardTitle>
                <CardDescription>
                  Componente que muestra la disponibilidad actualizada de horarios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DisponibilidadTiempoReal
                  doctorId={doctorData.id}
                  doctorName={doctorData.name}
                  fecha="2024-01-22"
                  onHorarioSeleccionado={(hora) => {
                    alert(`Horario seleccionado: ${hora}`);
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Simulador WhatsApp */}
          <TabsContent value="whatsapp" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                  Simulador de Confirmaciones WhatsApp
                </CardTitle>
                <CardDescription>
                  Sistema para enviar confirmaciones y recordatorios por WhatsApp
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WhatsAppConfirmationSimulator
                  citaData={citaData}
                  onEnviar={(mensaje, telefono) => {
                    console.log('Enviando WhatsApp:', { mensaje, telefono });
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Simulador Email */}
          <TabsContent value="email" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  Simulador de Confirmaciones Email
                </CardTitle>
                <CardDescription>
                  Sistema para enviar confirmaciones y recordatorios por correo electrónico
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EmailConfirmationSimulator
                  citaData={citaData}
                  onEnviar={(email, asunto, contenido) => {
                    console.log('Enviando Email:', { email, asunto, contenido });
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Sistema de Recordatorios */}
          <TabsContent value="recordatorios" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Sistema de Recordatorios Automáticos
                </CardTitle>
                <CardDescription>
                  Gestión automática de confirmaciones y recordatorios de citas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SistemaRecordatoriosAutomaticos />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Widget para Página Web */}
          <TabsContent value="widget" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-primary" />
                  Widget Embebible para Página Web
                </CardTitle>
                <CardDescription>
                  Generador de widget para integrar en la página web de FEMINIS SALUD
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WidgetAgendamientoWeb />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Resumen de Implementación */}
        <Card className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-foreground mb-4">
              ✅ Funcionalidades Implementadas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">🌐 Agendamiento Online</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Página pública de agendamiento</li>
                  <li>• Registro de nuevos pacientes</li>
                  <li>• Disponibilidad en tiempo real</li>
                  <li>• Widget embebible</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">📱 Confirmaciones</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Simulador WhatsApp</li>
                  <li>• Simulador Email</li>
                  <li>• Templates personalizables</li>
                  <li>• Vista previa en tiempo real</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">🔔 Automatización</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Recordatorios automáticos</li>
                  <li>• Programación de envíos</li>
                  <li>• Estadísticas de envío</li>
                  <li>• Gestión de fallos</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nota Importante */}
        <Card className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Settings className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                  ⚠️ Nota Importante
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Todas las funcionalidades mostradas son <strong>simulaciones visuales</strong> 
                  para demostrar el flujo completo. En producción se requerirían integraciones 
                  reales con APIs de WhatsApp, Email, SMS y sistemas de pago.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
