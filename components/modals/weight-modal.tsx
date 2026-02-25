"use client";

import { Modal } from "@/components/ui/modal";
import type { FormData } from "@/lib/types";

interface WeightModalProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onSave: () => void;
  onClose: () => void;
}

export function WeightModal({ formData, setFormData, onSave, onClose }: WeightModalProps) {
  return (
    <Modal title="Registrar Peso" onClose={onClose}>
      <div className="form-group">
        <label className="form-label">Data</label>
        <input
          type="date"
          className="form-input"
          value={(formData.date as string) || ""}
          onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Peso (gramas)</label>
        <input
          type="number"
          className="form-input"
          placeholder="Ex: 180"
          onChange={(e) => setFormData((p) => ({ ...p, weight: e.target.value }))}
        />
      </div>
      <div className="modal-actions">
        <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" onClick={onSave}>Salvar</button>
      </div>
    </Modal>
  );
}
