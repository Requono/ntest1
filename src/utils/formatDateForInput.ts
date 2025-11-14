export const formatDateForInput = (date: Date | string | undefined) => {
  if (!date) return "";

  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return "";

  const pad = (n: number) => n.toString().padStart(2, "0");

  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};
