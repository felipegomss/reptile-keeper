"use client";

import type { Pet, WeightRecord } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { CustomTooltip } from "@/components/ui/custom-tooltip";
import {
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area,
} from "recharts";

interface WeightPageProps {
  pet: Pet;
  weights: WeightRecord[];
  weightChartData: Array<{ date: string; peso: number }>;
  onOpenModal: () => void;
  onDelete: (id: string) => void;
}

export function WeightPage({ pet, weights, weightChartData, onOpenModal, onDelete }: WeightPageProps) {
  return (
    <>
      <div className="page-header page-header-row">
        <div>
          <h2>Controle de Peso</h2>
          <p>Acompanhe a evolução de {pet.name}</p>
        </div>
        <button className="btn btn-primary" onClick={onOpenModal}>
          <Icons.plus /> Registrar Peso
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Curva de Crescimento</span>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={weightChartData}>
            <defs>
              <linearGradient id="wg2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4ade80" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#4ade80" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e3328" />
            <XAxis dataKey="date" tick={{ fill: "#5a7a6a", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#5a7a6a", fontSize: 11 }} axisLine={false} tickLine={false} unit="g" />
            <Tooltip content={<CustomTooltip unit="g" />} />
            <Area type="monotone" dataKey="peso" stroke="#4ade80" strokeWidth={2.5} fill="url(#wg2)" dot={{ r: 4, fill: "#4ade80", strokeWidth: 0 }} activeDot={{ r: 6 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Histórico</span>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{weights.length} registros</span>
        </div>
        <div className="table-scroll" style={{ maxHeight: 480, overflowY: "auto" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Peso</th>
              <th>Variação</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {[...weights].reverse().slice(0, 30).map((w, i, arr) => {
              const prev = arr[i + 1];
              const diff = prev ? w.weight - prev.weight : 0;
              return (
                <tr key={w.id}>
                  <td style={{ color: "var(--text-primary)" }}>{formatDate(w.date)}</td>
                  <td style={{ fontWeight: 600, color: "var(--accent)" }}>{w.weight}g</td>
                  <td>
                    {prev ? (
                      <span className={diff >= 0 ? "stat-trend-up" : "stat-trend-down"}>
                        {diff >= 0 ? "+" : ""}{diff}g
                      </span>
                    ) : "\u2014"}
                  </td>
                  <td style={{ width: 40, textAlign: "center" }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ padding: "4px 6px", minWidth: 0, color: "var(--text-muted)" }}
                      onClick={() => onDelete(w.id)}
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
    </>
  );
}
