"use client";

import { Modal } from "@/components/ui/modal";
import { Icons } from "@/components/icons";
import type { FormData } from "@/lib/types";

interface DocumentModalProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onSave: () => void;
  onClose: () => void;
}

export function DocumentModal({ formData, setFormData, onSave, onClose }: DocumentModalProps) {
  return (
    <Modal title="Adicionar Documento" onClose={onClose}>
      <div className="form-group">
        <label className="form-label">Nome do Documento</label>
        <input
          type="text"
          className="form-input"
          placeholder="Ex: Certificado IBAMA"
          onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Categoria</label>
          <select
            className="form-input"
            onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
          >
            <option value="legal">Legal</option>
            <option value="saude">Saúde</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Data</label>
          <input
            type="date"
            className="form-input"
            value={(formData.date as string) || ""}
            onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))}
          />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Arquivo</label>
        <div
          style={{
            padding: 32,
            border: "2px dashed var(--border-light)",
            borderRadius: 10,
            textAlign: "center",
            color: "var(--text-muted)",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          <Icons.doc />
          <div style={{ marginTop: 8 }}>Clique ou arraste para fazer upload</div>
        </div>
      </div>
      <div className="modal-actions">
        <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" onClick={onSave}>Salvar</button>
      </div>
    </Modal>
  );
}
