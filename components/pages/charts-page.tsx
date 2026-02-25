"use client";

import type { Pet, WeightRecord, FeedingRecord } from "@/lib/types";
import { CustomTooltip } from "@/components/ui/custom-tooltip";
import {
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
} from "recharts";

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

interface ChartsPageProps {
  pet: Pet;
  weights: WeightRecord[];
  feedings: FeedingRecord[];
  lastWeight: WeightRecord;
  weightChartData: Array<{ date: string; peso: number }>;
  feedingChartData: Array<{ date: string; aceitas: number; recusadas: number }>;
}

export function ChartsPage({ pet, weights, feedings, lastWeight, weightChartData, feedingChartData }: ChartsPageProps) {
  const gramsPerFeeding = feedings
    .filter((f) => f.accepted && f.grams)
    .map((f) => ({
      date: new Date(f.date + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }),
      gramas: f.grams,
    }))
    .reverse();

  return (
    <>
      <div className="page-header">
        <h2>Gráficos & Análises</h2>
        <p>Dados completos de evolução de {pet.name}</p>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Curva de Crescimento</span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={weightChartData}>
              <defs>
                <linearGradient id="wg3" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4ade80" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#4ade80" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3328" />
              <XAxis dataKey="date" tick={{ fill: "#5a7a6a", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#5a7a6a", fontSize: 11 }} axisLine={false} tickLine={false} unit="g" />
              <Tooltip content={<CustomTooltip unit="g" />} />
              <Area type="monotone" dataKey="peso" stroke="#4ade80" strokeWidth={2} fill="url(#wg3)" dot={{ r: 3, fill: "#4ade80" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Gramas por Alimentação</span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={gramsPerFeeding}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3328" />
              <XAxis dataKey="date" tick={{ fill: "#5a7a6a", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#5a7a6a", fontSize: 11 }} axisLine={false} tickLine={false} unit="g" />
              <Tooltip content={<CustomTooltip unit="g" />} />
              <Bar dataKey="gramas" fill="#60a5fa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Taxa de Aceitação Alimentar</span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={feedingChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3328" />
              <XAxis dataKey="date" tick={{ fill: "#5a7a6a", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#5a7a6a", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<FeedingTooltip />} cursor={{ fill: "rgba(74, 222, 128, 0.06)" }} />
              <Bar dataKey="aceitas" stackId="a" fill="#4ade80" radius={[0, 0, 0, 0]} />
              <Bar dataKey="recusadas" stackId="a" fill="#f87171" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Peso vs Alimentação</span>
          </div>
          <div style={{ padding: "20px 0" }}>
            <div className="grid-cols-2" style={{ gap: 16 }}>
              <div style={{ textAlign: "center", padding: 16, background: "var(--bg-secondary)", borderRadius: 10 }}>
                <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Peso Ganho Total</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: "var(--accent)" }}>
                  +{weights.length > 0 ? lastWeight.weight - weights[0].weight : 0}g
                </div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>em {Math.max(weights.length - 1, 0)} pesagens</div>
              </div>
              <div style={{ textAlign: "center", padding: 16, background: "var(--bg-secondary)", borderRadius: 10 }}>
                <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Ganho Médio / Mês</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: "var(--info)" }}>
                  +{weights.length > 1 ? Math.round((lastWeight.weight - weights[0].weight) / (weights.length - 1)) : 0}g
                </div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>crescimento saudável</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
