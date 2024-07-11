export function formatTimeDifference(dateString: string, language: string = 'en'): string {
  const currentDate = new Date();
  const targetDate = new Date(dateString);

  const timeDifference = Math.abs(currentDate.getTime() - targetDate.getTime());
  const minutes = Math.floor(timeDifference / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  const getLocalizedUnit = (unit: string, count: number): string => {
    if (language === 'es') {
      // Spanish
      return count === 1 ? unit : `${unit}s`;
    } else {
      // Default to English
      return unit;
    }
  };

  if (minutes < 60) {
    return `${minutes} ${getLocalizedUnit('minute', minutes)}`;
  } else if (hours < 24) {
    return `${hours} ${getLocalizedUnit('hour', hours)}`;
  } else if (days < 7) {
    return `${days} ${getLocalizedUnit('day', days)}`;
  } else if (weeks < 4) {
    return `${weeks} ${getLocalizedUnit('week', weeks)}`;
  } else if (months < 12) {
    return `${months} ${getLocalizedUnit('month', months)}`;
  } else {
    // Reset the date to extract day, month, and year
    targetDate.setDate(1);
    const month = targetDate.toLocaleString(language, { month: 'long' });
    const day = targetDate.getDate();
    const year = targetDate.getFullYear();
    return `${month} ${day}, ${year}`;
  }
}

// Ejemplo de uso:
const fechaEjemplo = '2023-05-15T01:40:35.146Z';
// console.log(formatTimeDifference(fechaEjemplo, 'es')); // Ejemplo de salida: "15 de mayo, 2023"
