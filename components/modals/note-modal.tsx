"use client";

import { Modal } from "@/components/ui/modal";
import type { FormData } from "@/lib/types";

interface NoteModalProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onSave: () => void;
  onClose: () => void;
}

export function NoteModal({ formData, setFormData, onSave, onClose }: NoteModalProps) {
  return (
    <Modal title="Registrar Ocorrência" onClose={onClose}>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Data *</label>
          <input
            type="date"
            className="form-input"
            value={(formData.date as string) || ""}
            onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Categoria *</label>
          <select
            className="form-input"
            value={(formData.category as string) || ""}
            onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
          >
            <option value="">Selecione...</option>
            <option value="saude">Saúde</option>
            <option value="comportamento">Comportamento</option>
            <option value="vet">Veterinário</option>
            <option value="outro">Outro</option>
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Título *</label>
          <input
            type="text"
            className="form-input"
            placeholder="Ex: Fezes estranhas, Regurgitação..."
            value={(formData.title as string) || ""}
            onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Severidade</label>
          <select
            className="form-input"
            value={(formData.severity as string) || "low"}
            onChange={(e) => setFormData((p) => ({ ...p, severity: e.target.value }))}
          >
            <option value="low">Baixa</option>
            <option value="medium">Média</option>
            <option value="high">Alta</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Descrição</label>
        <textarea
          className="form-input"
          rows={3}
          placeholder="Detalhes da ocorrência..."
          value={(formData.description as string) || ""}
          onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
        />
      </div>
      <div className="modal-actions">
        <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" onClick={onSave}>Salvar</button>
      </div>
    </Modal>
  );
}
