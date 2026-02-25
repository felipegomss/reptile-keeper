"use client";

import type { Pet, WeightRecord, AlertItem } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { getSpeciesDisplayName, getSpeciesCategory, generateCareGuide } from "@/lib/species";
import { Icons } from "@/components/icons";

interface AlertsPageProps {
  pet: Pet;
  alerts: AlertItem[];
  daysSinceFeeding: number | null;
  avgFeedingInterval: number;
  daysSinceShed: number | null;
  avgShedInterval: number;
  lastWeight: WeightRecord;
}

export function AlertsPage({ pet, alerts, daysSinceFeeding, avgFeedingInterval, daysSinceShed, avgShedInterval, lastWeight }: AlertsPageProps) {
  const speciesName = getSpeciesDisplayName(pet.species);
  const category = getSpeciesCategory(pet);
  const isQuelonio = category === "quelonio";
  const careGuide = generateCareGuide(pet);

  const calendarItems = [
    {
      label: "Próxima Alimentação",
      estimate: `em ~${Math.max(0, avgFeedingInterval - (daysSinceFeeding ?? 0))} dias`,
      color: (daysSinceFeeding ?? 0) >= avgFeedingInterval ? "var(--warning)" : "var(--success)",
      detail: `Intervalo médio: ${avgFeedingInterval} dias`,
    },
    ...(!isQuelonio ? [{
      label: "Próxima Troca de Pele",
      estimate: `em ~${Math.max(0, avgShedInterval - (daysSinceShed ?? 0))} dias`,
      color: avgShedInterval - (daysSinceShed ?? 0) <= 7 ? "var(--info)" : "var(--text-muted)",
      detail: `Intervalo médio: ${avgShedInterval} dias`,
    }] : []),
    {
      label: "Próxima Pesagem",
      estimate: "recomendado mensalmente",
      color: "var(--text-muted)",
      detail: `Última: ${formatDate(lastWeight.date)}`,
    },
    {
      label: "Check-up Veterinário",
      estimate: "recomendado a cada 6 meses",
      color: "var(--orange)",
      detail: "Exame de fezes, avaliação geral",
    },
  ];

  return (
    <>
      <div className="page-header">
        <h2>Alertas & Sugestões</h2>
        <p>Cuidados e recomendações para {pet.name}</p>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div className="card-title" style={{ marginBottom: 12 }}>ALERTAS ATIVOS</div>
        {alerts.map((alert, i) => (
          <div key={i} className={`alert-card alert-${alert.type}`}>
            <div className="alert-icon"><Icons.alert /></div>
            <div>
              <div className="alert-title">{alert.title}</div>
              <div className="alert-text">{alert.text}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Calendário de Cuidados</span>
        </div>
        <div style={{ display: "grid", gap: 12 }}>
          {calendarItems.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "var(--bg-secondary)", borderRadius: 10, border: "1px solid var(--border)" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.color, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{item.label}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{item.detail}</div>
              </div>
              <div style={{ fontSize: 13, color: item.color, fontWeight: 500 }}>{item.estimate}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Guia de Cuidados — {speciesName}</span>
        </div>
        <div style={{ display: "grid", gap: 16 }}>
          {careGuide.map((section, i) => (
            <div key={i}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--accent)", marginBottom: 8 }}>{section.title}</div>
              <div className="grid-cols-2" style={{ gap: 6 }}>
                {section.items.map((item, j) => (
                  <div key={j} style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6, paddingLeft: 14, position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, color: "var(--accent-dim)" }}>{"\u2022"}</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
