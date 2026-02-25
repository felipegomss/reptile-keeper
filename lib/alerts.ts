import type { Pet, FeedingRecord, ShedRecord, AlertItem } from "./types";
import { daysSince } from "./utils";
import { getSpeciesCategory, getSpecies } from "./species";

interface AlertParams {
  pet: Pet;
  daysSinceFeeding: number | null;
  avgFeedingInterval: number;
  feedings: FeedingRecord[];
  lastShed: ShedRecord | undefined;
  daysSinceShed: number | null;
  avgShedInterval: number;
  weightGain: number;
}

export function generateAlerts({
  pet,
  daysSinceFeeding,
  avgFeedingInterval,
  feedings,
  lastShed,
  daysSinceShed,
  avgShedInterval,
  weightGain,
}: AlertParams): AlertItem[] {
  const alerts: AlertItem[] = [];
  const category = getSpeciesCategory(pet);
  const sp = getSpecies(pet.species);
  const isQuelonio = category === "quelonio";

  if (daysSinceFeeding !== null && daysSinceFeeding >= avgFeedingInterval + 2) {
    alerts.push({
      type: "warning",
      title: "Alimentação atrasada",
      text: `Último alimento há ${daysSinceFeeding} dias. A média é a cada ${avgFeedingInterval} dias.`,
    });
  }

  if (
    daysSinceFeeding !== null &&
    daysSinceFeeding >= avgFeedingInterval - 1 &&
    daysSinceFeeding < avgFeedingInterval + 2
  ) {
    alerts.push({
      type: "info",
      title: "Próxima alimentação",
      text: `Está na hora de alimentar! Último alimento há ${daysSinceFeeding} dias.`,
    });
  }

  // Shed alerts — not relevant for quelônios
  if (!isQuelonio && daysSinceShed !== null) {
    const nextShedEstimate = avgShedInterval - daysSinceShed;
    if (nextShedEstimate <= 7 && nextShedEstimate > 0) {
      alerts.push({
        type: "info",
        title: "Troca de pele se aproximando",
        text: `Próxima troca estimada em ~${nextShedEstimate} dias. Verifique umidade e temperatura.`,
      });
    }
  }

  if (
    feedings.length >= 2 &&
    !feedings[0].accepted &&
    !feedings[1].accepted
  ) {
    alerts.push({
      type: "danger",
      title: "Rejeições consecutivas",
      text: "Duas rejeições seguidas de alimento. Considere consultar um veterinário se persistir.",
    });
  }

  // Partial shed — not relevant for quelônios
  if (!isQuelonio && lastShed?.quality === "partial") {
    const humidityText = sp?.humidity || "50-60%";
    alerts.push({
      type: "warning",
      title: "Troca de pele incompleta",
      text: `A última troca foi parcial. Verifique umidade (${humidityText}) e ofereça superfícies ásperas.`,
    });
  }

  if (weightGain < 0) {
    alerts.push({
      type: "danger",
      title: "Perda de peso",
      text: `Perda de ${Math.abs(weightGain)}g desde a última pesagem. Monitore a alimentação.`,
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      type: "success",
      title: "Tudo em ordem!",
      text: `${pet.name} está saudável e com todos os cuidados em dia.`,
    });
  }

  return alerts;
}
