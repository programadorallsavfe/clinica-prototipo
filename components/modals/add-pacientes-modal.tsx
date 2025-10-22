'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getSession, generarUsername, generarPasswordTemporal } from '@/lib/auth';
import { 
  pacientesStorage, 
  usuariosStorage, 
  generateId, 
  getCurrentTimestamp, 
  logAuditoria 
} from '@/lib/storage';
import { Paciente, Usuario } from '@/lib/types';
import { UserPlus, X, CheckCircle, AlertCircle } from 'lucide-react';

interface AddPacientesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddPacientesModal = ({ isOpen, onClose, onSuccess }: AddPacientesModalProps) => {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    documento: '',
    telefono: '',
    email: '',
    preferenciaContacto: 'whatsapp' as 'whatsapp' | 'email' | 'telefono',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState<{ username: string; password: string } | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Limpiar errores al escribir
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.nombres.trim()) {
      setError('Los nombres son obligatorios');
      return false;
    }
    if (!formData.apellidos.trim()) {
      setError('Los apellidos son obligatorios');
      return false;
    }
    if (!formData.documento.trim()) {
      setError('El documento es obligatorio');
      return false;
    }
    if (!formData.telefono.trim()) {
      setError('El teléfono es obligatorio');
      return false;
    }
    if (!formData.email.trim()) {
      setError('El email es obligatorio');
      return false;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('El formato del email no es válido');
      return false;
    }

    // Validar que el documento no exista
    const pacienteExistente = pacientesStorage.findOne(p => p.documento === formData.documento);
    if (pacienteExistente) {
      setError('Ya existe un paciente con este documento');
      return false;
    }

    // Validar que el email no exista
    const emailExistente = pacientesStorage.findOne(p => p.email === formData.email);
    if (emailExistente) {
      setError('Ya existe un paciente con este email');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const session = getSession();
      
      // Crear usuario
      const username = generarUsername(formData.nombres, formData.apellidos);
      const password = generarPasswordTemporal();

      const nuevoUsuario: Usuario = {
        id: generateId('user'),
        username,
        password,
        rol: 'paciente',
        email: formData.email,
        telefono: formData.telefono,
        activo: true,
        fechaCreacion: getCurrentTimestamp(),
      };
      usuariosStorage.create(nuevoUsuario);

      // Crear paciente
      const nuevoPaciente: Paciente = {
        id: generateId('pac'),
        usuarioId: nuevoUsuario.id,
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        documento: formData.documento,
        telefono: formData.telefono,
        email: formData.email,
        preferenciaContacto: formData.preferenciaContacto,
        fechaRegistro: getCurrentTimestamp(),
        activo: true,
      };
      pacientesStorage.create(nuevoPaciente);

      // Log de auditoría
      if (session) {
        logAuditoria(
          session.userId,
          session.username,
          'Crear paciente',
          'Paciente',
          nuevoPaciente.id,
          undefined,
          nuevoPaciente as unknown as Record<string, unknown>
        );
      }

      setCreatedCredentials({ username, password });
      setSuccess(true);
      
      // Llamar callback de éxito si existe
      if (onSuccess) {
        onSuccess();
      }

    } catch (err) {
      setError('Error al crear el paciente. Inténtalo de nuevo.');
      console.error('Error creating patient:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        nombres: '',
        apellidos: '',
        documento: '',
        telefono: '',
        email: '',
        preferenciaContacto: 'whatsapp',
      });
      setError('');
      setSuccess(false);
      setCreatedCredentials(null);
      onClose();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <UserPlus className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-foreground">
                  Nuevo Paciente
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Registra un nuevo paciente en el sistema
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              disabled={loading}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {success && createdCredentials ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <div>
                  <h3 className="font-semibold text-green-800 dark:text-green-200">
                    ¡Paciente creado exitosamente!
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    El paciente ha sido registrado en el sistema
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Credenciales generadas:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium w-20">Usuario:</Label>
                    <div className="flex-1 flex items-center gap-2">
                      <Input
                        value={createdCredentials.username}
                        readOnly
                        className="bg-muted"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(createdCredentials.username)}
                      >
                        Copiar
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium w-20">Contraseña:</Label>
                    <div className="flex-1 flex items-center gap-2">
                      <Input
                        value={createdCredentials.password}
                        readOnly
                        className="bg-muted"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(createdCredentials.password)}
                      >
                        Copiar
                      </Button>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  📱 Envía estas credenciales por WhatsApp al paciente
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <Button onClick={handleClose} className="bg-primary hover:bg-primary/90">
                  Cerrar
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombres" className="text-sm font-medium">
                    Nombres *
                  </Label>
                  <Input
                    id="nombres"
                    value={formData.nombres}
                    onChange={(e) => handleInputChange('nombres', e.target.value)}
                    placeholder="Ingresa los nombres"
                    disabled={loading}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apellidos" className="text-sm font-medium">
                    Apellidos *
                  </Label>
                  <Input
                    id="apellidos"
                    value={formData.apellidos}
                    onChange={(e) => handleInputChange('apellidos', e.target.value)}
                    placeholder="Ingresa los apellidos"
                    disabled={loading}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="documento" className="text-sm font-medium">
                  Documento de Identidad *
                </Label>
                <Input
                  id="documento"
                  value={formData.documento}
                  onChange={(e) => handleInputChange('documento', e.target.value)}
                  placeholder="DNI, CE, etc."
                  disabled={loading}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefono" className="text-sm font-medium">
                    Teléfono *
                  </Label>
                  <Input
                    id="telefono"
                    value={formData.telefono}
                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                    placeholder="Número de teléfono"
                    disabled={loading}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="correo@ejemplo.com"
                    disabled={loading}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferenciaContacto" className="text-sm font-medium">
                  Preferencia de Contacto
                </Label>
                <Select
                  value={formData.preferenciaContacto}
                  onValueChange={(value) => 
                    handleInputChange('preferenciaContacto', value as 'whatsapp' | 'email' | 'telefono')
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona preferencia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="telefono">Teléfono</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-primary hover:bg-primary/90"
                >
                  {loading ? 'Creando...' : 'Crear Paciente'}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};       