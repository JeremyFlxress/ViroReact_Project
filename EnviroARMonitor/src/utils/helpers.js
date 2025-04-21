// src/utils/helpers.js
/**
 * Formatea la fecha y hora para su presentación
 * @param {Date} date - Objeto de fecha
 * @returns {string} Fecha formateada
 */
export const formatDateTime = (date) => {
    if (!date) return 'N/A';
    
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
  /**
   * Calcula un indicador de nivel basado en un valor y rango
   * @param {number} value - Valor a evaluar
   * @param {number} min - Valor mínimo del rango
   * @param {number} max - Valor máximo del rango
   * @returns {string} - 'low', 'medium', o 'high'
   */
  export const calculateLevel = (value, min, max) => {
    const range = max - min;
    const third = range / 3;
    
    if (value < min + third) return 'low';
    if (value < min + (2 * third)) return 'medium';
    return 'high';
  };
  
  /**
   * Genera un color basado en un valor dentro de un rango
   * @param {number} value - Valor a evaluar
   * @param {number} min - Valor mínimo del rango
   * @param {number} max - Valor máximo del rango
   * @param {boolean} inverse - Si el valor alto es negativo (como alta temperatura como peligro)
   * @returns {string} - Color en formato hexadecimal
   */
  export const getColorForValue = (value, min, max, inverse = false) => {
    // Normaliza el valor en un rango de 0 a 1
    let normalized = (value - min) / (max - min);
    normalized = Math.max(0, Math.min(1, normalized)); // Asegura que esté entre 0 y 1
    
    if (inverse) {
      normalized = 1 - normalized;
    }
    
    // Genera colores desde rojo (0) hasta verde (1)
    const r = Math.round(255 * (1 - normalized));
    const g = Math.round(255 * normalized);
    const b = 50;
    
    // Convierte a formato hexadecimal
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };  