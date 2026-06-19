export function formatPhoneByThreeDigits(value) {
  const rawValue = String(value || "").trim();
  const isInternational = rawValue.startsWith("+");
  const digits = rawValue.replace(/\D/g, "");

  if (!digits) return "";

  const groups = digits.match(/.{1,3}/g) || [];
  return `${isInternational ? "+" : ""}${groups.join(" ")}`.trim();
}