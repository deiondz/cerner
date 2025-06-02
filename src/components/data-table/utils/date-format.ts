/**
 * Format date to YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  const isoDate = date.toISOString();
  const formattedDate = isoDate.split("T")[0];
  if (!formattedDate) {
    return "";
  }
  return formattedDate;
}
