export function formatDocumentNumber(val: string | number): string {
  return val.toString().padStart(4, '0');
}
