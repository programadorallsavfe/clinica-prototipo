'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Stethoscope, 
  Users, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Star,
  Shield,
  Heart,
  Activity,
  Baby,
  Pill,
  Sparkles,
  UserCheck,
  Award,
  Zap
} from 'lucide-react';
import Image from 'next/image';

export default function LandingPage() {
  const router = useRouter();

  const especialidades = [
    { nombre: 'Ginecología', icono: Stethoscope, descripcion: 'Cuidado integral de la salud femenina', color: 'text-pink-600' },
    { nombre: 'Obstetricia', icono: Baby, descripcion: 'Acompañamiento durante el embarazo', color: 'text-blue-600' },
    { nombre: 'Pediatría', icono: Users, descripcion: 'Especialistas en salud infantil', color: 'text-green-600' },
    { nombre: 'Cardiología', icono: Heart, descripcion: 'Cuidado del corazón y sistema cardiovascular', color: 'text-red-600' },
    { nombre: 'Dermatología', icono: Pill, descripcion: 'Salud y cuidado de la piel', color: 'text-purple-600' }
  ];

  const servicios = [
    {
      titulo: 'Agendamiento Online',
      descripcion: 'Reserva tu cita médica de forma rápida y segura desde cualquier dispositivo',
      icono: Calendar,
      color: 'bg-primary',
      accion: () => router.push('/agendamiento-online')
    },
    {
      titulo: 'Consulta Virtual',
      descripcion: 'Atención médica desde la comodidad de tu hogar',
      icono: Activity,
      color: 'bg-success',
      accion: () => alert('Próximamente disponible')
    },
    {
      titulo: 'Resultados Online',
      descripcion: 'Consulta tus exámenes y resultados de laboratorio',
      icono: CheckCircle,
      color: 'bg-info',
      accion: () => alert('Próximamente disponible')
    }
  ];

  const testimonios = [
    {
      nombre: 'María González',
      especialidad: 'Ginecología',
      comentario: 'Excelente atención y profesionalismo. El agendamiento online es muy fácil de usar.',
      calificacion: 5
    },
    {
      nombre: 'Ana López',
      especialidad: 'Pediatría',
      comentario: 'La mejor clínica para el cuidado de mi hijo. Muy recomendada.',
      calificacion: 5
    },
    {
      nombre: 'Carmen Ruiz',
      especialidad: 'Cardiología',
      comentario: 'Atención de primera calidad. Los doctores son muy profesionales.',
      calificacion: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
           
                <Image
                  src="/logo_feminis.webp"
                  alt="FEMINIS SALUD"
                  width={132}
                  height={132}
                  className="object-contain"
                />
        
              <div>
                <h1 className="text-2xl font-bold text-foreground">FEMINIS SALUD</h1>
                <p className="text-sm text-muted-foreground">Centro Médico Especializado</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
            
              <Button 
                variant="outline" 
                onClick={() => router.push('/auth')}
              >
                Acceso Médicos
              </Button>
              <Button 
                onClick={() => router.push('/agendamiento-online')}
                className="bg-primary hover:bg-primary/90"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Agendar Cita
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="outline" className="mb-4 text-primary border-primary">
              <Heart className="h-3 w-3 mr-1" />
              Cuidando tu salud desde 2020
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Tu salud es nuestra
              <span className="text-primary"> prioridad</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Centro médico especializado en atención integral para toda la familia. 
              Agenda tu cita online y recibe la mejor atención médica.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => router.push('/agendamiento-online')}
                className="bg-primary hover:bg-primary/90"
              >
                <Calendar className="h-5 w-5 mr-2" />
                Agendar Cita Online
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => document.getElementById('especialidades')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Stethoscope className="h-5 w-5 mr-2" />
                Ver Especialidades
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Especialidades */}
      <section id="especialidades" className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Nuestras Especialidades
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Contamos con especialistas altamente calificados en diferentes áreas médicas
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {especialidades.map((especialidad, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105 border-border">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center`}>
                    <especialidad.icono className={`h-8 w-8 ${especialidad.color}`} />
                  </div>
                  <h4 className="text-xl font-semibold text-foreground mb-2">
                    {especialidad.nombre}
                  </h4>
                  <p className="text-muted-foreground">
                    {especialidad.descripcion}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Nuestros Servicios
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tecnología al servicio de tu salud
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {servicios.map((servicio, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 cursor-pointer border-border" onClick={servicio.accion}>
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${servicio.color} rounded-lg flex items-center justify-center mb-4`}>
                    <servicio.icono className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-foreground mb-2">
                    {servicio.titulo}
                  </h4>
                  <p className="text-muted-foreground mb-4">
                    {servicio.descripcion}
                  </p>
                  <Button variant="outline" className="w-full border-border hover:bg-muted">
                    Conocer más
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Lo que dicen nuestros pacientes
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              La satisfacción de nuestros pacientes es nuestra mejor recomendación
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonios.map((testimonio, index) => (
              <Card key={index} className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonio.calificacion)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-warning fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    &quot;{testimonio.comentario}&quot;
                  </p>
                  <div>
                    <p className="font-semibold text-foreground">{testimonio.nombre}</p>
                    <p className="text-sm text-muted-foreground">{testimonio.especialidad}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            ¿Listo para cuidar tu salud?
          </h3>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Agenda tu cita ahora y recibe la mejor atención médica especializada
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => router.push('/agendamiento-online')}
          >
            <Calendar className="h-5 w-5 mr-2" />
            Agendar Cita Ahora
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted text-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
           
                <Image
                  src="/logo_feminis.webp"
                  alt="FEMINIS SALUD"
                  width={132}
                  height={132}
                  className="object-contain"
                />
                <h4 className="text-xl font-bold">FEMINIS SALUD</h4>
             
              <p className="text-muted-foreground">
                Centro médico especializado en atención integral para toda la familia.
              </p>
         
            <div>
              <h5 className="font-semibold mb-4">Contacto</h5>
              <div className="space-y-2 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>(01) 234-5678</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>info@feminis-salud.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Av. Principal 123, Lima</span>
                </div>
              </div>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Horarios</h5>
              <div className="space-y-2 text-muted-foreground">
                <p>Lunes - Viernes: 8:00 - 18:00</p>
                <p>Sábados: 8:00 - 14:00</p>
                <p>Domingos: Cerrado</p>
              </div>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Servicios</h5>
              <div className="space-y-2 text-muted-foreground">
                <p>Agendamiento Online</p>
                <p>Consulta Virtual</p>
                <p>Resultados Online</p>
                <p>Emergencias 24/7</p>
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 FEMINIS SALUD. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
