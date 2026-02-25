"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import type { Pet } from "@/lib/types";
import {
  getSpeciesGrouped,
  getSpecies,
  resolveSpeciesId,
  categoryLabels,
} from "@/lib/species";
import type { SpeciesCategory } from "@/lib/types";

interface PetModalProps {
  pet?: Pet;
  onSave: (pet: {
    name: string;
    species: string;
    morph: string;
    birthDate: string;
    acquiredDate: string;
  }) => Promise<void>;
  onClose: () => void;
}

const grouped = getSpeciesGrouped();
const categoryOrder: SpeciesCategory[] = ["serpente", "lagarto", "quelonio"];

export function PetModal({ pet, onSave, onClose }: PetModalProps) {
  // Resolve legacy species names to IDs when editing
  const initialSpecies = pet ? resolveSpeciesId(pet.species) : "";
  const isKnownSpecies = initialSpecies ? !!getSpecies(initialSpecies) : false;

  const [name, setName] = useState(pet?.name || "");
  const [species, setSpecies] = useState(isKnownSpecies ? initialSpecies : initialSpecies ? "outro" : "");
  const [customSpecies, setCustomSpecies] = useState(!isKnownSpecies && initialSpecies ? pet?.species || "" : "");
  const [morph, setMorph] = useState(pet?.morph || "");
  const [birthDate, setBirthDate] = useState(pet?.birthDate || "");
  const [acquiredDate, setAcquiredDate] = useState(pet?.acquiredDate || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditing = !!pet;
  const selectedSpecies = species !== "outro" ? getSpecies(species) : null;

  const handleSave = async () => {
    const finalSpecies = species === "outro" ? customSpecies.trim() : species;
    if (!name || !finalSpecies || !birthDate || !acquiredDate) {
      setError("Preencha os campos obrigatórios");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await onSave({ name, species: finalSpecies, morph, birthDate, acquiredDate });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
      setLoading(false);
    }
  };

  return (
    <Modal title={isEditing ? "Editar Pet" : "Adicionar Pet"} onClose={onClose}>
      {error && (
        <div className="alert-card alert-danger" style={{ marginBottom: 12 }}>
          <div>
            <div className="alert-text">{error}</div>
          </div>
        </div>
      )}
      <div className="form-group">
        <label className="form-label">Nome *</label>
        <input
          type="text"
          className="form-input"
          placeholder="Ex: Nagini"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Espécie *</label>
        <select
          className="form-input"
          value={species}
          onChange={(e) => {
            setSpecies(e.target.value);
            if (e.target.value !== "outro") setCustomSpecies("");
          }}
        >
          <option value="">Selecione...</option>
          {categoryOrder.map((cat) => (
            <optgroup key={cat} label={categoryLabels[cat]}>
              {grouped[cat].map((sp) => (
                <option key={sp.id} value={sp.id}>
                  {sp.name}
                </option>
              ))}
            </optgroup>
          ))}
          <option value="outro">Outro...</option>
        </select>
      </div>
      {species === "outro" && (
        <div className="form-group">
          <label className="form-label">Nome da Espécie *</label>
          <input
            type="text"
            className="form-input"
            placeholder="Ex: Corn Snake, Red-Footed Tortoise..."
            value={customSpecies}
            onChange={(e) => setCustomSpecies(e.target.value)}
          />
        </div>
      )}
      {selectedSpecies && (
        <div style={{
          padding: "10px 14px",
          background: "var(--bg-secondary)",
          borderRadius: 8,
          border: "1px solid var(--border)",
          marginBottom: 12,
          fontSize: 12,
          color: "var(--text-secondary)",
          lineHeight: 1.6,
        }}>
          <span style={{ fontStyle: "italic" }}>{selectedSpecies.scientificName}</span>
          {" · "}{selectedSpecies.size} · Expectativa: {selectedSpecies.lifespan}
        </div>
      )}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Morph</label>
          <input
            type="text"
            className="form-input"
            placeholder="Ex: Albino, Normal..."
            value={morph}
            onChange={(e) => setMorph(e.target.value)}
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Nascimento *</label>
          <input
            type="date"
            className="form-input"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Aquisição *</label>
          <input
            type="date"
            className="form-input"
            value={acquiredDate}
            onChange={(e) => setAcquiredDate(e.target.value)}
          />
        </div>
      </div>
      <div className="modal-actions">
        <button className="btn btn-ghost" onClick={onClose}>
          Cancelar
        </button>
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </Modal>
  );
}
