export const formatDate = (d: string): string => {
  const date = new Date(d + "T12:00:00");
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const daysSince = (d: string): number => {
  const diff = Number(new Date()) - Number(new Date(d + "T12:00:00"));
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

export const getAge = (birthDate: string): string => {
  const now = new Date();
  const birth = new Date(birthDate + "T12:00:00");
  const months =
    (now.getFullYear() - birth.getFullYear()) * 12 +
    now.getMonth() -
    birth.getMonth();
  if (months < 12) return `${months} meses`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  return rem > 0 ? `${years}a ${rem}m` : `${years} ano${years > 1 ? "s" : ""}`;
};
