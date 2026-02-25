"use client";

import type { Pet, NoteRecord } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Icons } from "@/components/icons";

interface NotesPageProps {
  pet: Pet;
  notes: NoteRecord[];
  onOpenModal: () => void;
  onDelete: (id: string) => void;
}

const categoryLabels: Record<string, string> = {
  saude: "Saúde",
  comportamento: "Comportamento",
  vet: "Veterinário",
  outro: "Outro",
};

const severityConfig: Record<string, { label: string; badge: string }> = {
  low: { label: "Baixa", badge: "badge-success" },
  medium: { label: "Média", badge: "badge-warning" },
  high: { label: "Alta", badge: "badge-danger" },
};

const categoryBadge: Record<string, string> = {
  saude: "badge-danger",
  comportamento: "badge-warning",
  vet: "badge-info",
  outro: "badge-success",
};

export function NotesPage({ pet, notes, onOpenModal, onDelete }: NotesPageProps) {
  return (
    <>
      <div className="page-header page-header-row">
        <div>
          <h2>Ocorrências</h2>
          <p>Registros de saúde e observações de {pet.name}</p>
        </div>
        <button className="btn btn-primary" onClick={onOpenModal}>
          <Icons.plus /> Registrar
        </button>
      </div>

      <div className="stats-grid grid-cols-3">
        <div className="stat-card">
          <div className="stat-label">Total</div>
          <div className="stat-value">{notes.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Alta Severidade</div>
          <div className="stat-value" style={{ color: "var(--danger)" }}>
            {notes.filter((n) => n.severity === "high").length}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Consultas Vet</div>
          <div className="stat-value" style={{ color: "var(--info)" }}>
            {notes.filter((n) => n.category === "vet").length}
          </div>
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="empty-state">
          <p>Nenhuma ocorrência registrada.</p>
          <button className="btn btn-primary" onClick={onOpenModal}>
            <Icons.plus /> Registrar Primeira Ocorrência
          </button>
        </div>
      ) : (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Histórico</span>
          </div>
          <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Título</th>
                <th>Categoria</th>
                <th>Severidade</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {notes.map((n) => (
                <tr key={n.id}>
                  <td style={{ color: "var(--text-primary)", whiteSpace: "nowrap" }}>{formatDate(n.date)}</td>
                  <td>
                    <div style={{ fontWeight: 500, color: "var(--text-primary)" }}>{n.title}</div>
                    {n.description && (
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{n.description}</div>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${categoryBadge[n.category] || "badge-success"}`}>
                      {categoryLabels[n.category] || n.category}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${severityConfig[n.severity]?.badge || "badge-success"}`}>
                      {severityConfig[n.severity]?.label || n.severity}
                    </span>
                  </td>
                  <td style={{ width: 40, textAlign: "center" }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ padding: "4px 6px", minWidth: 0, color: "var(--text-muted)" }}
                      onClick={() => onDelete(n.id)}
                      title="Excluir"
                    >
                      <Icons.trash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </>
  );
}
