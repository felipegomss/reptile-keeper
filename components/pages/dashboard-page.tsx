"use client";

import { useState, useEffect, useRef } from "react";
import type { Pet, WeightRecord, FeedingRecord, ShedRecord, NoteRecord, AlertItem } from "@/lib/types";
import { formatDate, getAge } from "@/lib/utils";
import { generateCareTips, getSpeciesDisplayName, getSpeciesCategory } from "@/lib/species";
import { Icons } from "@/components/icons";
import { CustomTooltip } from "@/components/ui/custom-tooltip";
import {
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area,
} from "recharts";

interface DashboardPageProps {
  pet: Pet;
  lastWeight: WeightRecord;
  weightGain: number;
  daysSinceFeeding: number | null;
  feedingRate: number;
  daysSinceShed: number | null;
  avgShedInterval: number;
  alerts: AlertItem[];
  weightChartData: Array<{ date: string; peso: number }>;
  feedings: FeedingRecord[];
  sheds: ShedRecord[];
  weights: WeightRecord[];
  notes: NoteRecord[];
  onNavigateToWeight: () => void;
  onAddRecord: (type: string) => void;
}

export function DashboardPage({ pet, lastWeight, weightGain, daysSinceFeeding, feedingRate, daysSinceShed, avgShedInterval, alerts, weightChartData, feedings, sheds, weights, notes, onNavigateToWeight, onAddRecord }: DashboardPageProps) {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const quickAddRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showQuickAdd) return;
    const handler = (e: MouseEvent) => {
      if (quickAddRef.current && !quickAddRef.current.contains(e.target as Node)) {
        setShowQuickAdd(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showQuickAdd]);

  const careTips = generateCareTips(pet, lastWeight);
  const speciesName = getSpeciesDisplayName(pet.species);
  const category = getSpeciesCategory(pet);
  const shedLabel = category === "quelonio" ? "Último Check Casco" : "Última Troca";

  return (
    <>
      <div className="page-header page-header-row">
        <div>
          <h2>Dashboard</h2>
          <p>Visão geral de {pet.name}</p>
        </div>
        <div style={{ position: "relative" }} ref={quickAddRef}>
          <button className="btn btn-primary" onClick={() => setShowQuickAdd(!showQuickAdd)}>
            <Icons.plus /> Registrar
          </button>
          {showQuickAdd && (
            <div style={{
              position: "absolute", right: 0, top: "100%", marginTop: 6,
              background: "var(--bg-card)", border: "1px solid var(--border)",
              borderRadius: 10, padding: 6, minWidth: 190, zIndex: 10,
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
            }}>
              {[
                { key: "weight", label: "Peso", icon: Icons.weight },
                { key: "feeding", label: "Alimentação", icon: Icons.food },
                { key: "shed", label: category === "quelonio" ? "Check Casco" : "Troca de Pele", icon: Icons.shed },
                { key: "note", label: "Ocorrência", icon: Icons.note },
              ].map(({ key, label, icon: Icon }) => (
                <div
                  key={key}
                  className="nav-item"
                  onClick={() => { onAddRecord(key); setShowQuickAdd(false); }}
                >
                  <Icon /> {label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Peso Atual</div>
          <div className="stat-value">
            {lastWeight?.weight}
            <span className="stat-unit">g</span>
          </div>
          <div className={`stat-sub ${weightGain >= 0 ? "stat-trend-up" : "stat-trend-down"}`}>
            {weightGain >= 0 ? "\u2191" : "\u2193"} {Math.abs(weightGain)}g desde última pesagem
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Última Alimentação</div>
          <div className="stat-value">
            {daysSinceFeeding}
            <span className="stat-unit">dias</span>
          </div>
          <div className="stat-sub">Taxa aceitação: {feedingRate}%</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">{shedLabel}</div>
          <div className="stat-value">
            {daysSinceShed}
            <span className="stat-unit">dias</span>
          </div>
          <div className="stat-sub">Média: a cada {avgShedInterval} dias</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Idade</div>
          <div className="stat-value" style={{ fontSize: 22 }}>
            {getAge(pet.birthDate)}
          </div>
          <div className="stat-sub">{pet.morph}</div>
        </div>
      </div>

      {/* Alerts */}
      <div style={{ marginBottom: 24 }}>
        {alerts.map((alert, i) => (
          <div key={i} className={`alert-card alert-${alert.type}`}>
            <div className="alert-icon">
              <Icons.alert />
            </div>
            <div>
              <div className="alert-title">{alert.title}</div>
              <div className="alert-text">{alert.text}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        {/* Weight Chart */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Evolução de Peso</span>
            <button className="btn btn-ghost btn-sm" onClick={onNavigateToWeight}>
              Ver tudo
            </button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weightChartData}>
              <defs>
                <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4ade80" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#4ade80" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3328" />
              <XAxis dataKey="date" tick={{ fill: "#5a7a6a", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#5a7a6a", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip unit="g" />} />
              <Area type="monotone" dataKey="peso" stroke="#4ade80" strokeWidth={2} fill="url(#weightGrad)" dot={{ r: 3, fill: "#4ade80" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Atividade Recente</span>
          </div>
          <div>
            {[
              ...feedings.slice(0, 3).map((f) => ({
                date: f.date,
                text: `Alimentação: ${f.prey} ${f.grams}g ${f.accepted ? "\u2713" : "\u2717"}`,
                color: f.accepted ? "var(--success)" : "var(--danger)",
              })),
              ...sheds.slice(0, 2).map((s) => ({
                date: s.date,
                text: category === "quelonio"
                  ? `Check casco: ${s.quality === "complete" ? "OK" : "Atenção"}`
                  : `Troca de pele: ${s.quality === "complete" ? "Completa" : "Parcial"}`,
                color: s.quality === "complete" ? "var(--info)" : "var(--warning)",
              })),
              ...weights.slice(-2).map((w) => ({
                date: w.date,
                text: `Pesagem: ${w.weight}g`,
                color: "var(--text-muted)",
              })),
              ...notes.slice(0, 3).map((n) => ({
                date: n.date,
                text: `Ocorrência: ${n.title}`,
                color: n.severity === "high" ? "var(--danger)" : n.severity === "medium" ? "var(--warning)" : "var(--orange)",
              })),
            ]
              .sort((a, b) => b.date.localeCompare(a.date))
              .slice(0, 6)
              .map((item, i) => (
                <div key={i} className="timeline-item">
                  <div className="timeline-dot" style={{ background: item.color }} />
                  <div>
                    <div className="timeline-date">{formatDate(item.date)}</div>
                    <div className="timeline-text">{item.text}</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Care Tips */}
      <div className="card" style={{ marginTop: 8 }}>
        <div className="card-header">
          <span className="card-title">Dicas de Cuidados — {speciesName}</span>
        </div>
        <div className="grid-cols-4">
          {careTips.map((tip, i) => (
            <div key={i} style={{ padding: 14, background: "var(--bg-secondary)", borderRadius: 10, border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 20, marginBottom: 8 }}>{tip.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{tip.title}</div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>{tip.text}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
