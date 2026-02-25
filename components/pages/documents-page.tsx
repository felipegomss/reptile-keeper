"use client";

import type { Pet, PetDocument } from "@/lib/types";
import { formatDate, getAge } from "@/lib/utils";
import { getSpeciesDisplayName } from "@/lib/species";
import { Icons } from "@/components/icons";

interface DocumentsPageProps {
  pet: Pet;
  docs: PetDocument[];
  onOpenModal: () => void;
  onDelete: (id: string) => void;
}

export function DocumentsPage({ pet, docs, onOpenModal, onDelete }: DocumentsPageProps) {
  return (
    <>
      <div className="page-header page-header-row">
        <div>
          <h2>Documentos</h2>
          <p>Documentação de {pet.name}</p>
        </div>
        <button className="btn btn-primary" onClick={onOpenModal}>
          <Icons.plus /> Adicionar Documento
        </button>
      </div>

      <div className="grid-2">
        <div>
          <div className="card-title" style={{ marginBottom: 12 }}>DOCUMENTOS LEGAIS</div>
          <div style={{ display: "grid", gap: 8 }}>
            {docs.filter((d) => d.category === "legal").map((d) => (
              <div key={d.id} className="doc-card doc-legal" style={{ display: "flex", alignItems: "center" }}>
                <div className="doc-icon">PDF</div>
                <div style={{ flex: 1 }}>
                  <div className="doc-name">{d.name}</div>
                  <div className="doc-meta">{formatDate(d.date)} • {d.type}</div>
                </div>
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ padding: "4px 6px", minWidth: 0, color: "var(--text-muted)" }}
                  onClick={() => onDelete(d.id)}
                  title="Excluir"
                >
                  <Icons.trash />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="card-title" style={{ marginBottom: 12 }}>SAÚDE & VETERINÁRIO</div>
          <div style={{ display: "grid", gap: 8 }}>
            {docs.filter((d) => d.category === "saude").map((d) => (
              <div key={d.id} className="doc-card doc-saude" style={{ display: "flex", alignItems: "center" }}>
                <div className="doc-icon">PDF</div>
                <div style={{ flex: 1 }}>
                  <div className="doc-name">{d.name}</div>
                  <div className="doc-meta">{formatDate(d.date)} • {d.type}</div>
                </div>
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ padding: "4px 6px", minWidth: 0, color: "var(--text-muted)" }}
                  onClick={() => onDelete(d.id)}
                  title="Excluir"
                >
                  <Icons.trash />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-header">
          <span className="card-title">Informações do Pet</span>
        </div>
        <div className="grid-cols-3" style={{ gap: 16 }}>
          {[
            { label: "Nome", value: pet.name },
            { label: "Espécie", value: getSpeciesDisplayName(pet.species) },
            { label: "Morph", value: pet.morph },
            { label: "Data de Nascimento", value: formatDate(pet.birthDate) },
            { label: "Data de Aquisição", value: formatDate(pet.acquiredDate) },
            { label: "Idade", value: getAge(pet.birthDate) },
          ].map((item, i) => (
            <div key={i}>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "var(--text-muted)", marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
