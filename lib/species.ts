import type { Pet, SpeciesData, SpeciesCategory, CareTip } from "./types";
import speciesJson from "@/data/species.json";

const allSpecies = speciesJson as SpeciesData[];

// O(1) lookup by ID
const speciesById = new Map<string, SpeciesData>();
allSpecies.forEach((s) => speciesById.set(s.id, s));

// Legacy name map — pets criados antes usavam display names
const legacyNameMap: Record<string, string> = {
  "King Snake": "kingsnake",
  "Corn Snake": "milk-snake",
  "Ball Python": "piton-bola",
  "Boa Constrictor": "jiboia-boa-constrictor",
  "Leopard Gecko": "lagartixa-leopardo",
  "Bearded Dragon": "dragao-barbado",
  "Tegu": "teiu",
  "Iguana": "iguana",
};

// ─── Lookups ───

export function getSpecies(speciesId: string): SpeciesData | null {
  // Try direct ID first
  const direct = speciesById.get(speciesId);
  if (direct) return direct;
  // Try legacy name mapping
  const mappedId = legacyNameMap[speciesId];
  if (mappedId) return speciesById.get(mappedId) || null;
  return null;
}

export function getSpeciesCategory(pet: Pet): SpeciesCategory | null {
  return getSpecies(pet.species)?.category || null;
}

export function getSpeciesDisplayName(speciesId: string): string {
  const sp = getSpecies(speciesId);
  if (sp) return sp.name;
  // If it's a legacy name key, return as-is
  if (legacyNameMap[speciesId]) return speciesId;
  // Custom species — return as typed
  return speciesId;
}

export function getPetEmoji(speciesId: string): string {
  const cat = getSpecies(speciesId)?.category;
  if (cat === "lagarto") return "\uD83E\uDD8E";
  if (cat === "quelonio") return "\uD83D\uDC22";
  if (cat === "serpente") return "\uD83D\uDC0D";
  return "\uD83D\uDC0D"; // default snake emoji
}

export function resolveSpeciesId(speciesId: string): string {
  // Resolve legacy names to proper IDs
  return legacyNameMap[speciesId] || speciesId;
}

/** Grouped list for <optgroup> in species selector */
export function getSpeciesGrouped(): Record<SpeciesCategory, SpeciesData[]> {
  return {
    serpente: allSpecies.filter((s) => s.category === "serpente"),
    lagarto: allSpecies.filter((s) => s.category === "lagarto"),
    quelonio: allSpecies.filter((s) => s.category === "quelonio"),
  };
}

export const categoryLabels: Record<SpeciesCategory, string> = {
  serpente: "\uD83D\uDC0D Serpentes",
  lagarto: "\uD83E\uDD8E Lagartos",
  quelonio: "\uD83D\uDC22 Quelônios",
};

// ─── Content Generators ───

export function generateCareTips(pet: Pet, lastWeight?: { weight: number }): CareTip[] {
  const sp = getSpecies(pet.species);
  const weight = lastWeight?.weight || 0;

  if (!sp) {
    return [
      { title: "Temperatura", text: "Mantenha o gradiente térmico adequado para a espécie.", icon: "\uD83C\uDF21\uFE0F" },
      { title: "Umidade", text: "Monitore a umidade do terrário regularmente.", icon: "\uD83D\uDCA7" },
      { title: "Alimentação", text: weight > 0 ? `Presa adequada: ~10-15% do peso corporal (${Math.round(weight * 0.1)}-${Math.round(weight * 0.15)}g).` : "Ofereça alimento adequado para a espécie.", icon: "\uD83C\uDF3F" },
      { title: "Ambiente", text: "Forneça esconderijos e enriquecimento ambiental.", icon: "\uD83C\uDF3F" },
    ];
  }

  const tips: CareTip[] = [
    {
      title: "Temperatura",
      text: `Lado quente: ${sp.temperature.hotSide}, lado frio: ${sp.temperature.coldSide}. ${sp.temperature.notes}`,
      icon: "\uD83C\uDF21\uFE0F",
    },
    {
      title: "Umidade",
      text: `Ideal: ${sp.humidity}. ${sp.category === "serpente" ? "Aumente durante a troca de pele." : sp.category === "quelonio" ? "Mantenha água limpa e fresca sempre disponível." : "Monitore regularmente."}`,
      icon: "\uD83D\uDCA7",
    },
  ];

  // Feeding tip — species-specific
  if (weight > 0 && sp.feeding.proportion) {
    const match = sp.feeding.proportion.match(/(\d+)-(\d+)%/);
    if (match) {
      const lo = Math.round(weight * parseInt(match[1]) / 100);
      const hi = Math.round(weight * parseInt(match[2]) / 100);
      tips.push({
        title: "Alimentação",
        text: `${sp.feeding.proportion} do peso corporal (${lo}-${hi}g). ${sp.feeding.frequency}. ${sp.feeding.notes}`,
        icon: sp.category === "serpente" ? "\uD83D\uDC2D" : sp.category === "quelonio" ? "\uD83E\uDD6C" : "\uD83E\uDD97",
      });
    } else {
      tips.push({
        title: "Alimentação",
        text: `${sp.feeding.frequency}. ${sp.feeding.notes}`,
        icon: sp.category === "serpente" ? "\uD83D\uDC2D" : sp.category === "quelonio" ? "\uD83E\uDD6C" : "\uD83E\uDD97",
      });
    }
  } else {
    tips.push({
      title: "Alimentação",
      text: `${sp.feeding.frequency}. ${sp.feeding.notes}`,
      icon: sp.category === "serpente" ? "\uD83D\uDC2D" : sp.category === "quelonio" ? "\uD83E\uDD6C" : "\uD83E\uDD97",
    });
  }

  // 4th tip — varies by category
  if (sp.category === "serpente") {
    tips.push({
      title: "Substrato",
      text: `Recomendado: ${sp.substrate.join(", ")}. Evite cedro e pinho (tóxicos).`,
      icon: "\uD83C\uDF3F",
    });
  } else if (sp.category === "lagarto") {
    tips.push({
      title: "Iluminação",
      text: sp.lighting,
      icon: "\u2600\uFE0F",
    });
  } else {
    tips.push({
      title: "Casco & UVB",
      text: `${sp.lighting} Inspecione o casco regularmente.`,
      icon: "\uD83D\uDC22",
    });
  }

  return tips;
}

export function generateShedTips(pet: Pet): CareTip[] {
  const sp = getSpecies(pet.species);
  const cat = sp?.category || null;

  if (cat === "quelonio") {
    return [
      { title: "Inspeção do casco", text: "Verifique se há manchas, amolecimento ou odor. Casco saudável é firme e uniforme.", icon: "\uD83D\uDD0D" },
      { title: "UVB & Cálcio", text: "UVB adequado e suplementação de cálcio previnem problemas de casco e ossos.", icon: "\u2600\uFE0F" },
      { title: "Umidade", text: sp ? `Manter umidade em ${sp.humidity}. Água limpa sempre disponível.` : "Mantenha umidade adequada.", icon: "\uD83D\uDCA7" },
      { title: "Sinais de alerta", text: "Casco mole, descoloração, escamas levantadas ou odor forte indicam problemas. Consulte um vet.", icon: "\u26A0\uFE0F" },
    ];
  }

  if (cat === "lagarto") {
    return [
      { title: "Ecdise em pedaços", text: "Lagartos trocam pele em pedaços, não em uma peça. Isso é normal.", icon: "\uD83E\uDD8E" },
      { title: "Umidade", text: sp ? `Mantenha umidade em ${sp.humidity}. Banhos de imersão podem ajudar.` : "Aumente a umidade durante a troca.", icon: "\uD83D\uDCA7" },
      { title: "Pele retida", text: "Pele retida nos dedos e cauda pode causar constrição. Remova com banho morno.", icon: "\u26A0\uFE0F" },
      { title: "Alimentação", text: "Apetite pode diminuir durante a troca. Espere 1-2 dias após para alimentar.", icon: sp?.category === "lagarto" ? "\uD83E\uDD97" : "\uD83C\uDF3F" },
    ];
  }

  // Serpentes (default)
  return [
    { title: "Sinais pré-troca", text: "Olhos azulados/opacos, cores mais apagadas, menor apetite, comportamento mais recluso.", icon: "\uD83D\uDC40" },
    { title: "Umidade", text: sp ? `Aumente para ${sp.humidity} durante o processo. Um esconderijo úmido com musgo sphagnum ajuda muito.` : "Aumente para 60-70% durante o processo.", icon: "\uD83D\uDCA7" },
    { title: "Alimentação", text: "Evite alimentar durante o período de troca. Espere 2-3 dias após a troca completa.", icon: "\uD83D\uDC2D" },
    { title: "Troca incompleta", text: "Se ficar pele aderida, faça um banho morno (28°C) por 15-20min e remova gentilmente.", icon: "\u26A0\uFE0F" },
  ];
}

export function generateCareGuide(pet: Pet): Array<{ title: string; items: string[] }> {
  const sp = getSpecies(pet.species);

  if (!sp) {
    return [
      { title: "Terrário", items: ["Dimensões adequadas para a espécie", "Gradiente térmico com lado quente e frio", "Esconderijos disponíveis", "Água limpa sempre"] },
      { title: "Alimentação", items: ["Alimento adequado para a espécie", "Frequência conforme idade e tamanho", "Registre aceitação/rejeição"] },
      { title: "Saúde", items: ["Check-up veterinário periódico", "Monitore peso regularmente", "Atenção a parasitas"] },
      { title: "Comportamento", items: ["Observe padrões normais", "Evite manusear após alimentação", "Respeite períodos de estresse"] },
    ];
  }

  const guide: Array<{ title: string; items: string[] }> = [];

  // Terrário
  const terrariumItems = [
    `Juvenil: ${sp.enclosure.juvenile}`,
    `Adulto: ${sp.enclosure.adult}`,
    `Tipo: ${sp.enclosure.type}`,
    `Temperatura: ${sp.temperature.hotSide} (quente) / ${sp.temperature.coldSide} (frio)`,
    `Umidade: ${sp.humidity}`,
    `Substrato: ${sp.substrate.join(", ")}`,
  ];
  guide.push({ title: "Terrário", items: terrariumItems });

  // Alimentação
  const feedItems = [
    `Alimentos: ${sp.feeding.preyTypes.join(", ")}`,
    `Frequência: ${sp.feeding.frequency}`,
    sp.feeding.proportion ? `Proporção: ${sp.feeding.proportion}` : "",
    sp.feeding.notes,
  ].filter(Boolean);
  guide.push({ title: "Alimentação", items: feedItems });

  // Saúde
  guide.push({ title: "Saúde", items: sp.health });

  // Dicas gerais
  if (sp.tips.length > 0) {
    guide.push({ title: "Dicas", items: sp.tips });
  }

  return guide;
}

export function getFeedingPreyOptions(pet: Pet): string[] {
  const sp = getSpecies(pet.species);
  if (!sp) return [];
  return sp.feeding.preyTypes;
}

/** Nav label for shed/shell page based on category */
export function getShedPageLabel(pet: Pet): string {
  const cat = getSpeciesCategory(pet);
  return cat === "quelonio" ? "Saúde do Casco" : "Trocas de Pele";
}

/** Nav label short for mobile */
export function getShedPageLabelShort(pet: Pet): string {
  const cat = getSpeciesCategory(pet);
  return cat === "quelonio" ? "Casco" : "Trocas";
}
