"use client";

import { Modal } from "@/components/ui/modal";
import type { FormData } from "@/lib/types";

interface ShedModalProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onSave: () => void;
  onClose: () => void;
}

export function ShedModal({ formData, setFormData, onSave, onClose }: ShedModalProps) {
  return (
    <Modal title="Registrar Troca de Pele" onClose={onClose}>
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
        <label className="form-label">Qualidade</label>
        <select
          className="form-input"
          onChange={(e) => setFormData((p) => ({ ...p, quality: e.target.value }))}
        >
          <option value="complete">Completa (uma peça)</option>
          <option value="partial">Parcial (fragmentada)</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Observações</label>
        <textarea
          className="form-input"
          placeholder="Ex: Troca limpa, sem problemas..."
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
