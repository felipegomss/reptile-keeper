export interface Pet {
  id: string;
  name: string;
  species: string;
  morph: string;
  birthDate: string;
  acquiredDate: string;
  photo: string | null;
}

export interface WeightRecord {
  id: string;
  date: string;
  weight: number;
  petId: string;
}

export interface FeedingRecord {
  id: string;
  date: string;
  prey: string;
  grams: number;
  accepted: boolean;
  notes: string;
  petId: string;
}

export interface ShedRecord {
  id: string;
  date: string;
  quality: "complete" | "partial";
  notes: string;
  petId: string;
}

export interface PetDocument {
  id: string;
  name: string;
  type: string;
  date: string;
  category: "legal" | "saude";
  petId: string;
}

export interface NoteRecord {
  id: string;
  date: string;
  category: "saude" | "comportamento" | "vet" | "outro";
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  petId: string;
}

export interface PetWithRecords extends Pet {
  weights: WeightRecord[];
  feedings: FeedingRecord[];
  sheds: ShedRecord[];
  documents: PetDocument[];
  notes: NoteRecord[];
}

export interface AlertItem {
  type: "warning" | "info" | "danger" | "success";
  title: string;
  text: string;
}

export interface CareTip {
  title: string;
  text: string;
  icon: string;
}

export type SpeciesCategory = "serpente" | "lagarto" | "quelonio";

export interface SpeciesTemperature {
  hotSide: string;
  coldSide: string;
  notes: string;
}

export interface SpeciesEnclosure {
  juvenile: string;
  adult: string;
  type: string;
}

export interface SpeciesFeeding {
  preyTypes: string[];
  frequency: string;
  proportion: string;
  notes: string;
}

export interface SpeciesShedding {
  frequency: string;
  notes: string;
}

export interface SpeciesData {
  id: string;
  name: string;
  scientificName: string;
  category: SpeciesCategory;
  size: string;
  lifespan: string;
  temperament: string;
  temperature: SpeciesTemperature;
  humidity: string;
  enclosure: SpeciesEnclosure;
  substrate: string[];
  feeding: SpeciesFeeding;
  shedding: SpeciesShedding;
  lighting: string;
  health: string[];
  tips: string[];
  source: string;
}

export interface FormData {
  [key: string]: string | number | boolean | undefined;
}
