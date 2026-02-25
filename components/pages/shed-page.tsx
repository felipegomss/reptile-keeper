"use client";

import type { Pet, ShedRecord } from "@/lib/types";
import { formatDate, daysSince } from "@/lib/utils";
import { generateShedTips, getSpeciesCategory, getShedPageLabel } from "@/lib/species";
import { Icons } from "@/components/icons";

interface ShedPageProps {
  pet: Pet;
  sheds: ShedRecord[];
  daysSinceShed: number | null;
  avgShedInterval: number;
  onOpenModal: () => void;
  onDelete: (id: string) => void;
}

export function ShedPage({ pet, sheds, daysSinceShed, avgShedInterval, onOpenModal, onDelete }: ShedPageProps) {
  const category = getSpeciesCategory(pet);
  const isQuelonio = category === "quelonio";
  const pageTitle = getShedPageLabel(pet);
  const tips = generateShedTips(pet);

  return (
    <>
      <div className="page-header page-header-row">
        <div>
          <h2>{pageTitle}</h2>
          <p>{isQuelonio ? `Acompanhamento do casco de ${pet.name}` : `Registro de ecdise de ${pet.name}`}</p>
        </div>
        <button className="btn btn-primary" onClick={onOpenModal}>
          <Icons.plus /> {isQuelonio ? "Registrar Check" : "Registrar Troca"}
        </button>
      </div>

      <div className="stats-grid grid-cols-3">
        <div className="stat-card">
          <div className="stat-label">{isQuelonio ? "Último Check" : "Última Troca"}</div>
          <div className="stat-value">{daysSinceShed}<span className="stat-unit">dias atrás</span></div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Intervalo Médio</div>
          <div className="stat-value">{avgShedInterval}<span className="stat-unit">dias</span></div>
        </div>
        <div className="stat-card">
          <div className="stat-label">{isQuelonio ? "Checks OK" : "Trocas Completas"}</div>
          <div className="stat-value">
            {sheds.filter((s) => s.quality === "complete").length}
            <span className="stat-unit">/ {sheds.length}</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">{isQuelonio ? "Histórico de Checks" : "Histórico de Trocas"}</span>
        </div>
        <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>{isQuelonio ? "Status" : "Qualidade"}</th>
              <th>Intervalo</th>
              <th>Notas</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sheds.map((s, i) => {
              const prev = sheds[i + 1];
              const interval = prev ? daysSince(prev.date) - daysSince(s.date) : null;
              return (
                <tr key={s.id}>
                  <td style={{ color: "var(--text-primary)" }}>{formatDate(s.date)}</td>
                  <td>
                    <span className={`badge ${s.quality === "complete" ? "badge-success" : "badge-warning"}`}>
                      {isQuelonio
                        ? (s.quality === "complete" ? "OK" : "Atenção")
                        : (s.quality === "complete" ? "Completa" : "Parcial")}
                    </span>
                  </td>
                  <td>{interval ? `${interval} dias` : "\u2014"}</td>
                  <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {s.notes || "\u2014"}
                  </td>
                  <td style={{ width: 40, textAlign: "center" }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ padding: "4px 6px", minWidth: 0, color: "var(--text-muted)" }}
                      onClick={() => onDelete(s.id)}
                      title="Excluir"
                    >
                      <Icons.trash />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">
            {isQuelonio ? "Dicas para Saúde do Casco" : category === "lagarto" ? "Dicas para Ecdise" : "Dicas para Troca de Pele"}
          </span>
        </div>
        <div className="grid-cols-2">
          {tips.map((tip, i) => (
            <div key={i} style={{ padding: 14, background: "var(--bg-secondary)", borderRadius: 10, border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 16 }}>{tip.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--accent)" }}>{tip.title}</span>
              </div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>{tip.text}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
