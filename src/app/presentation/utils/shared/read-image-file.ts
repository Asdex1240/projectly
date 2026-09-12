export function readImageAsDataUrl(file: File, maxSizeBytes: number): Promise<string> {
  if (file.size > maxSizeBytes) {
    const maxMb = Math.round(maxSizeBytes / (1024 * 1024));
    return Promise.reject(new Error(`El archivo es muy grande. Máximo ${maxMb}MB.`));
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target?.result as string);
    reader.onerror = () => reject(reader.error ?? new Error("No se pudo leer el archivo."));
    reader.readAsDataURL(file);
  });
}
