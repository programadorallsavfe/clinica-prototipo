'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Loader2 } from 'lucide-react';

// Funciones de autenticación simuladas
const login = (username: string, password: string) => {
  const usuarios = {
    'admin': { password: 'admin123', rol: 'administrador' },
    'recepcion': { password: 'recep123', rol: 'recepcionista' },
    'dr.sanchez': { password: 'doctor123', rol: 'medico' },
    'jperez': { password: 'paciente123', rol: 'paciente' },
    'farmacia': { password: 'farma123', rol: 'farmacia' }
  };

  const usuario = usuarios[username as keyof typeof usuarios];
  
  if (usuario && usuario.password === password) {
    const session = {
      usuarioId: `user_${Date.now()}`,
      username,
      rol: usuario.rol,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('clinica_session', JSON.stringify(session));
    
    return {
      exito: true,
      usuario: session,
      mensaje: 'Inicio de sesión exitoso'
    };
  }
  
  return {
    exito: false,
    usuario: null,
    mensaje: 'Credenciales incorrectas'
  };
};

const recuperarPassword = (username: string, email: string) => {
  // Simulación de recuperación de contraseña
  return {
    exito: true,
    mensaje: `Se ha enviado un enlace de recuperación a ${email}`
  };
};

const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  const session = localStorage.getItem('clinica_session');
  return session !== null;
};

const getRutaPorRol = (rol: string) => {
  const rutas = {
    'administrador': '/administrador',
    'recepcionista': '/recepcionista',
    'medico': '/medico',
    'paciente': '/paciente',
    'farmacia': '/farmacia'
  };
  return rutas[rol as keyof typeof rutas] || '/auth';
};

const initializeDefaultData = () => {
  // Inicializar datos por defecto si no existen
  const existingData = localStorage.getItem('clinica_initialized');
  if (!existingData) {
    // Aquí se pueden inicializar datos por defecto
    localStorage.setItem('clinica_initialized', 'true');
  }
};

export default function AuthPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [recupUsername, setRecupUsername] = useState('');
  const [recupEmail, setRecupEmail] = useState('');

  useEffect(() => {
    initializeDefaultData();
    
    if (isAuthenticated()) {
      const session = JSON.parse(localStorage.getItem('clinica_session') || '{}');
      if (session.rol) {
        router.push(getRutaPorRol(session.rol));
      }
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const resultado = login(username, password);
      
      if (resultado.exito && resultado.usuario) {
        router.push(getRutaPorRol(resultado.usuario.rol));
      } else {
        setError(resultado.mensaje || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error inesperado al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleRecuperacion = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMensaje('');
    setLoading(true);

    try {
      const resultado = recuperarPassword(recupUsername, recupEmail);
      
      if (resultado.exito) {
        setMensaje(resultado.mensaje);
        setRecupUsername('');
        setRecupEmail('');
      } else {
        setError(resultado.mensaje);
      }
    } catch (err) {
      setError('Error inesperado al recuperar contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <CardTitle className="text-2xl">Clínica Prototype</CardTitle>
          <CardDescription>Sistema de Gestión Clínica</CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="recuperar">Recuperar</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="username">Usuario</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Ingresa tu usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Iniciando sesión...
                    </>
                  ) : (
                    'Iniciar Sesión'
                  )}
                </Button>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm">
                  <p className="font-semibold mb-2">👤 Usuarios de prueba:</p>
                  <ul className="space-y-1 text-xs">
                    <li><strong>Admin:</strong> admin / admin123</li>
                    <li><strong>Recepción:</strong> recepcion / recep123</li>
                    <li><strong>Doctor:</strong> dr.sanchez / doctor123</li>
                    <li><strong>Paciente:</strong> jperez / paciente123</li>
                    <li><strong>Farmacia:</strong> farmacia / farma123</li>
                  </ul>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="recuperar">
              <form onSubmit={handleRecuperacion} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                {mensaje && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                    <span className="text-sm">{mensaje}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="recup-username">Usuario</Label>
                  <Input
                    id="recup-username"
                    type="text"
                    placeholder="Tu nombre de usuario"
                    value={recupUsername}
                    onChange={(e) => setRecupUsername(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recup-email">Email</Label>
                  <Input
                    id="recup-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={recupEmail}
                    onChange={(e) => setRecupEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    'Recuperar Contraseña'
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Recibirás un correo con instrucciones para restablecer tu contraseña.
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}