export const formatterCurrency = new Intl.NumberFormat("id-ID", {
  style: "decimal",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

// Format ISO Date ke format DD-MM-YYYY atau DD/MM/YYYY
export function formatDateToDMY(dateInput, separator = "/") {
  try {
    const date = new Date(dateInput);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}${separator}${month}${separator}${year}`;
  } catch (error) {
    console.error("Invalid date input:", dateInput);
    return "-";
  }
}

// Contoh helper tambahan untuk kapitalisasi kata
export function capitalizeFirst(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
