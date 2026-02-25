"use client";

import type { Pet, WeightRecord, FeedingRecord } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { getSpecies } from "@/lib/species";
import { Icons } from "@/components/icons";
import {
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from "recharts";

interface FeedingPageProps {
  pet: Pet;
  feedings: FeedingRecord[];
  avgFeedingInterval: number;
  feedingRate: number;
  lastWeight: WeightRecord;
  feedingChartData: Array<{ date: string; aceitas: number; recusadas: number }>;
  onOpenModal: () => void;
  onDelete: (id: string) => void;
}

function FeedingTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ dataKey: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  const aceitas = payload.find((p) => p.dataKey === "aceitas")?.value ?? 0;
  const recusadas = payload.find((p) => p.dataKey === "recusadas")?.value ?? 0;
  return (
    <div className="custom-tooltip">
      <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
        <span style={{ width: 8, height: 8, borderRadius: 2, background: "#4ade80", flexShrink: 0 }} />
        <span style={{ color: "var(--text-secondary)" }}>Aceitas: <strong style={{ color: "var(--accent)" }}>{aceitas}</strong></span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, marginTop: 3 }}>
        <span style={{ width: 8, height: 8, borderRadius: 2, background: "#f87171", flexShrink: 0 }} />
        <span style={{ color: "var(--text-secondary)" }}>Recusadas: <strong style={{ color: "var(--danger)" }}>{recusadas}</strong></span>
      </div>
    </div>
  );
}

export function FeedingPage({ pet, feedings, avgFeedingInterval, feedingRate, lastWeight, feedingChartData, onOpenModal, onDelete }: FeedingPageProps) {
  return (
    <>
      <div className="page-header page-header-row">
        <div>
          <h2>Alimentação</h2>
          <p>Registro de alimentação de {pet.name}</p>
        </div>
        <button className="btn btn-primary" onClick={onOpenModal}>
          <Icons.plus /> Registrar Alimentação
        </button>
      </div>

      <div className="stats-grid grid-cols-3">
        <div className="stat-card">
          <div className="stat-label">Intervalo Médio</div>
          <div className="stat-value">{avgFeedingInterval}<span className="stat-unit">dias</span></div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Taxa de Aceitação</div>
          <div className="stat-value">{feedingRate}<span className="stat-unit">%</span></div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Alimento Recomendado</div>
          {(() => {
            const sp = getSpecies(pet.species);
            const proportion = sp?.feeding.proportion || "10-15% do peso corporal";
            const match = proportion.match(/(\d+)-(\d+)%/);
            if (match && lastWeight?.weight) {
              const lo = Math.round(lastWeight.weight * parseInt(match[1]) / 100);
              const hi = Math.round(lastWeight.weight * parseInt(match[2]) / 100);
              return (
                <>
                  <div className="stat-value" style={{ fontSize: 20 }}>
                    {lo}-{hi}<span className="stat-unit">g</span>
                  </div>
                  <div className="stat-sub">{proportion}</div>
                </>
              );
            }
            return (
              <>
                <div className="stat-value" style={{ fontSize: 16 }}>{sp?.feeding.frequency || "\u2014"}</div>
                <div className="stat-sub">{proportion}</div>
              </>
            );
          })()}
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: "stretch" }}>
        <div className="card" style={{ display: "flex", flexDirection: "column" }}>
          <div className="card-header">
            <span className="card-title">Alimentações por Mês</span>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%" minHeight={220}>
              <BarChart data={feedingChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3328" />
                <XAxis dataKey="date" tick={{ fill: "#5a7a6a", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#5a7a6a", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<FeedingTooltip />} cursor={{ fill: "rgba(74, 222, 128, 0.06)" }} />
                <Bar dataKey="aceitas" fill="#4ade80" radius={[4, 4, 0, 0]} />
                <Bar dataKey="recusadas" fill="#f87171" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 8 }}>
            <span style={{ fontSize: 11, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--success)" }} /> Aceitas
            </span>
            <span style={{ fontSize: 11, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--danger)" }} /> Recusadas
            </span>
          </div>
        </div>

        <div className="card" style={{ display: "flex", flexDirection: "column" }}>
          <div className="card-header">
            <span className="card-title">Últimas Alimentações</span>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{feedings.length} registros</span>
          </div>
          <div className="table-scroll" style={{ flex: 1, minHeight: 0, overflowY: "auto", maxHeight: 480 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Presa</th>
                  <th>Gramas</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {feedings.slice(0, 30).map((f) => (
                  <tr key={f.id}>
                    <td style={{ color: "var(--text-primary)" }}>{formatDate(f.date)}</td>
                    <td>{f.prey}</td>
                    <td>{f.grams}g</td>
                    <td>
                      <span className={`badge ${f.accepted ? "badge-success" : "badge-danger"}`}>
                        {f.accepted ? "Aceita" : "Recusada"}
                      </span>
                    </td>
                    <td style={{ width: 40, textAlign: "center" }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ padding: "4px 6px", minWidth: 0, color: "var(--text-muted)" }}
                        onClick={() => onDelete(f.id)}
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
      </div>
    </>
  );
}
