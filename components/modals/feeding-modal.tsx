"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Icons } from "@/components/icons";
import type { FormData, Pet } from "@/lib/types";
import { getFeedingPreyOptions } from "@/lib/species";

interface FeedingModalProps {
  pet: Pet;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onSave: () => void;
  onClose: () => void;
}

export function FeedingModal({ pet, formData, setFormData, onSave, onClose }: FeedingModalProps) {
  const preyOptions = getFeedingPreyOptions(pet);
  const [customPrey, setCustomPrey] = useState(false);

  return (
    <Modal title="Registrar Alimentação" onClose={onClose}>
      <div className="form-group">
        <label className="form-label">Data</label>
        <input
          type="date"
          className="form-input"
          value={(formData.date as string) || ""}
          onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))}
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Tipo de Alimento</label>
          {!customPrey && preyOptions.length > 0 ? (
            <select
              className="form-input"
              onChange={(e) => {
                if (e.target.value === "__outro") {
                  setCustomPrey(true);
                  setFormData((p) => ({ ...p, prey: "" }));
                } else {
                  setFormData((p) => ({ ...p, prey: e.target.value }));
                }
              }}
            >
              <option value="">Selecione...</option>
              {preyOptions.map((prey) => (
                <option key={prey} value={prey}>{prey}</option>
              ))}
              <option value="__outro">Outro...</option>
            </select>
          ) : (
            <input
              type="text"
              className="form-input"
              placeholder="Ex: Grilo, Camundongo..."
              value={(formData.prey as string) || ""}
              onChange={(e) => setFormData((p) => ({ ...p, prey: e.target.value }))}
            />
          )}
        </div>
        <div className="form-group">
          <label className="form-label">Gramas</label>
          <input
            type="number"
            className="form-input"
            placeholder="Ex: 12"
            onChange={(e) => setFormData((p) => ({ ...p, grams: e.target.value }))}
          />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Aceita?</label>
        <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
          <div
            className="checkbox-wrap"
            onClick={() => setFormData((p) => ({ ...p, accepted: true }))}
          >
            <div className={`checkbox ${formData.accepted !== false ? "checked" : ""}`}>
              {formData.accepted !== false && <Icons.check />}
            </div>
            <span style={{ fontSize: 13 }}>Sim</span>
          </div>
          <div
            className="checkbox-wrap"
            onClick={() => setFormData((p) => ({ ...p, accepted: false }))}
          >
            <div className={`checkbox ${formData.accepted === false ? "checked" : ""}`}>
              {formData.accepted === false && <Icons.check />}
            </div>
            <span style={{ fontSize: 13 }}>Não</span>
          </div>
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Observações</label>
        <textarea
          className="form-input"
          placeholder="Ex: Comeu rápido, sem problemas..."
          onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
        />
      </div>
      <div className="modal-actions">
        <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" onClick={onSave}>Salvar</button>
      </div>
    </Modal>
  );
}
