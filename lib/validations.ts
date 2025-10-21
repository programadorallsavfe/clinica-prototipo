export function validarDoubleBooking(
  doctorId: string,
  fecha: string,
  horaInicio: string,
  horaFin: string
): { valido: boolean; mensaje: string } {
  // En un sistema real, esto consultaría la base de datos
  // Por ahora, simulamos que siempre es válido
  return { valido: true, mensaje: '' }
}

export function validarDisponibilidadDoctor(
  doctorId: string,
  fecha: string,
  horaInicio: string
): { valido: boolean; mensaje: string } {
  // En un sistema real, esto consultaría la base de datos
  // Por ahora, simulamos que siempre es válido
  return { valido: true, mensaje: '' }
}

export function calcularDuracionMinutos(horaInicio: string, horaFin: string): number {
  const [h1, m1] = horaInicio.split(':').map(Number)
  const [h2, m2] = horaFin.split(':').map(Number)
  
  const inicio = h1 * 60 + m1
  const fin = h2 * 60 + m2
  
  return fin - inicio
}