'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  FileText, 
  Edit, 
  Mail, 
  Link, 
  CreditCard, 
  Calendar, 
  Stethoscope, 
  MessageSquare,
  Copy,
  Check,
  X,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

interface CitaContextMenuProps {
  citaId: string;
  pacienteId: number;
  pacienteNombre: string;
  pacienteEmail: string;
  isOpen: boolean;
  onClose: () => void;
  position: { x: number; y: number };
}

export const CitaContextMenu = ({ 
  citaId, 
  pacienteId, 
  pacienteNombre, 
  pacienteEmail, 
  isOpen, 
  onClose, 
  position 
}: CitaContextMenuProps) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [menuPosition, setMenuPosition] = useState(position);

  // Función para calcular posición responsiva
  const calculatePosition = () => {
    if (!isOpen) return;

    // Ancho dinámico basado en el contenido más largo
    const menuWidth = Math.min(350, Math.max(280, window.innerWidth * 0.8)); // Entre 280px y 350px, máximo 80% del viewport
    const menuHeight = 250; // Altura ajustada con scroll interno
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const padding = 16; // padding del viewport

    let x = position.x;
    let y = position.y;

    // Ajustar posición horizontal - abrir hacia la derecha del click
    if (x + menuWidth > viewportWidth - padding) {
      // Si no cabe a la derecha, abrir hacia la izquierda
      x = position.x - menuWidth;
    }

    // Ajustar posición vertical - detectar si hay espacio suficiente hacia abajo
    const spaceBelow = viewportHeight - position.y - padding;
    const spaceAbove = position.y - padding;
    
    if (spaceBelow < menuHeight && spaceAbove > menuHeight) {
      // Si no hay espacio hacia abajo pero sí hacia arriba, abrir hacia arriba
      y = position.y - menuHeight;
    } else if (spaceBelow >= menuHeight) {
      // Si hay espacio hacia abajo, abrir hacia abajo
      y = position.y;
    } else {
      // Si no hay espacio ni arriba ni abajo, usar el espacio disponible
      y = Math.max(padding, viewportHeight - menuHeight - padding);
    }

    // Asegurar que siempre esté dentro del viewport
    x = Math.max(padding, Math.min(x, viewportWidth - menuWidth - padding));
    y = Math.max(padding, Math.min(y, viewportHeight - menuHeight - padding));

    setMenuPosition({ x, y });
  };

  // Calcular posición responsiva del menú
  useEffect(() => {
    calculatePosition();
  }, [isOpen, position]);

  // Listener para redimensionamiento de ventana y control de scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleResize = () => {
      calculatePosition();
    };

    // Prevenir scroll del body cuando el menú está abierto
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      // Restaurar scroll del body cuando se cierra el menú
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, position]);

  if (!isOpen) return null;

  const handleFicha = () => {
    console.log('Abriendo ficha clínica para paciente:', pacienteId);
    // Redirigir a la ficha del paciente
    window.location.href = `/administrador/pacientes/${pacienteId}/ficha`;
    onClose();
  };

  const handleModificarFactura = () => {
    console.log('Modificando factura para cita:', citaId);
    // Aquí se abriría el modal de modificar factura
    toast.success('Abriendo editor de factura...');
    onClose();
  };

  const handleEnviarSolicitud = () => {
    console.log('Enviando solicitud de datos por email a:', pacienteEmail);
    // Aquí se enviaría el email
    toast.success('Solicitud de datos enviada por email');
    onClose();
  };

  const handleCopiarLink = () => {
    const link = `${window.location.origin}/solicitar-datos?paciente=${pacienteId}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    toast.success('Link copiado al portapapeles');
    setTimeout(() => {
      setCopiedLink(false);
      onClose();
    }, 1500);
  };

  const handleRecibirPagos = () => {
    console.log('Abriendo módulo de pagos para cita:', citaId);
    // Aquí se abriría el módulo de pagos
    toast.success('Abriendo módulo de pagos...');
    onClose();
  };

  const handleCambiarFecha = () => {
    console.log('Cambiando fecha para cita:', citaId);
    // Aquí se abriría el modal para cambiar fecha
    toast.success('Abriendo editor de fecha...');
    onClose();
  };

  const handleCambiarTipo = () => {
    console.log('Cambiando tipo de atención para cita:', citaId);
    // Aquí se abriría el modal para cambiar tipo
    toast.success('Abriendo editor de tipo de atención...');
    onClose();
  };

  const handleAgregarComentario = () => {
    console.log('Agregando comentario para cita:', citaId);
    // Aquí se abriría el modal para agregar comentario
    toast.success('Abriendo editor de comentarios...');
    onClose();
  };

  const menuOptions = [
    {
      id: 'ficha',
      label: 'Ficha',
      description: 'Abre la ficha clínica o perfil completo del paciente',
      icon: FileText,
      action: handleFicha,
      color: 'text-info hover:bg-info/10 dark:hover:bg-info/20'
    },
    {
      id: 'factura',
      label: 'Modificar factura / prestaciones',
      description: 'Permite editar o ajustar la factura del paciente',
      icon: Edit,
      action: handleModificarFactura,
      color: 'text-success hover:bg-success/10 dark:hover:bg-success/20'
    },
    {
      id: 'solicitud',
      label: 'Enviar solicitud de datos por mail',
      description: 'Envía al correo del paciente un formulario de datos',
      icon: Mail,
      action: handleEnviarSolicitud,
      color: 'text-primary hover:bg-primary/10 dark:hover:bg-primary/20'
    },
    {
      id: 'link',
      label: 'Copiar link para solicitar datos',
      description: 'Genera y copia un enlace para que el paciente ingrese sus datos',
      icon: copiedLink ? Check : Copy,
      action: handleCopiarLink,
      color: copiedLink ? 'text-success hover:bg-success/10 dark:hover:bg-success/20' : 'text-warning hover:bg-warning/10 dark:hover:bg-warning/20'
    },
    {
      id: 'pagos',
      label: 'Recibir pagos',
      description: 'Registra un pago manual o marca una deuda como pagada',
      icon: CreditCard,
      action: handleRecibirPagos,
      color: 'text-success hover:bg-success/10 dark:hover:bg-success/20'
    },
    {
      id: 'fecha',
      label: 'Cambiar fecha',
      description: 'Modifica la fecha de la cita o del registro asociado',
      icon: Calendar,
      action: handleCambiarFecha,
      color: 'text-info hover:bg-info/10 dark:hover:bg-info/20'
    },
    {
      id: 'tipo',
      label: 'Cambiar tipo de atención',
      description: 'Cambia el tipo o categoría del servicio',
      icon: Stethoscope,
      action: handleCambiarTipo,
      color: 'text-primary hover:bg-primary/10 dark:hover:bg-primary/20'
    },
    {
      id: 'comentario',
      label: 'Agregar comentario',
      description: 'Permite añadir observaciones o notas internas',
      icon: MessageSquare,
      action: handleAgregarComentario,
      color: 'text-muted-foreground hover:bg-muted dark:hover:bg-muted'
    }
  ];

  return (
    <>
      {/* Overlay para cerrar el menú */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      
      {/* Menú contextual */}
      <Card 
        className="fixed z-50 min-w-[280px] max-w-[350px] w-auto shadow-xl border-border bg-card"
        style={{
          left: `${menuPosition.x}px`,
          top: `${menuPosition.y}px`,
          width: `${Math.min(350, Math.max(280, window.innerWidth * 0.8))}px`
        }}
      >
        <CardContent className="p-0">
         
            {/* Header */}
            
               <p className="text-xs text-muted-foreground mt-2 px-3 pb-2">
                  Paciente: {pacienteNombre}
                </p>
            

            {/* Opciones del menú */}
            <div className="p-1 max-h-[200px] overflow-y-auto">
              {menuOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <Button
                    key={option.id}
                    variant="ghost"
                    className={`w-full justify-start h-auto p-2 ${option.color} transition-all duration-200 hover:shadow-sm`}
                    onClick={option.action}
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-md bg-current/10 flex-shrink-0">
                        <IconComponent className="h-3 w-3" />
                      </div>
                      <div className="font-medium text-xs">
                        {option.label}
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
        
        </CardContent>
      </Card>
    </>
  );
};
