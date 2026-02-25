"use client";

import { useState, useEffect, useRef } from "react";
import type { Pet } from "@/lib/types";
import { getAge, formatDate } from "@/lib/utils";
import { getPetEmoji, getSpeciesDisplayName } from "@/lib/species";
import { Icons } from "@/components/icons";

interface PetsPageProps {
  pets: Pet[];
  activePetId: string | null;
  onSwitchPet: (id: string) => void;
  onAddPet: () => void;
  onEditPet: (pet: Pet) => void;
  onDeletePet: (id: string) => void;
  maxPets: number;
}

export function PetsPage({ pets, activePetId, onSwitchPet, onAddPet, onEditPet, onDeletePet, maxPets }: PetsPageProps) {
  const [expandedId, setExpandedId] = useState<string | null>(activePetId);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpenId) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpenId]);

  return (
    <>
      <div className="page-header page-header-row">
        <div>
          <h2>Meus Pets</h2>
          <p>{pets.length} de {maxPets} pets cadastrados</p>
        </div>
        {pets.length < maxPets && (
          <button className="btn btn-primary" onClick={onAddPet}>
            <Icons.plus /> Adicionar Pet
          </button>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {pets.map((p) => {
          const isExpanded = expandedId === p.id;
          const isActive = activePetId === p.id;

          return (
            <div
              key={p.id}
              className="card"
              style={{
                borderColor: isActive ? "var(--accent-dim)" : undefined,
                marginBottom: 0,
              }}
            >
              {/* Header — always visible */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  cursor: "pointer",
                }}
                onClick={() => setExpandedId(isExpanded ? null : p.id)}
              >
                <div className="pet-avatar" style={{ width: 44, height: 44, fontSize: 18 }}>
                  {getPetEmoji(p.species)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16, fontWeight: 600 }}>{p.name}</span>
                    {isActive && (
                      <span className="badge badge-success" style={{ fontSize: 9, padding: "2px 8px" }}>Ativo</span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
                    {getSpeciesDisplayName(p.species)}{p.morph ? ` • ${p.morph}` : ""} • {getAge(p.birthDate)}
                  </div>
                </div>

                {/* 3-dot menu */}
                <div
                  style={{ position: "relative" }}
                  ref={menuOpenId === p.id ? menuRef : undefined}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ padding: "6px 8px", minWidth: 0 }}
                    onClick={() => setMenuOpenId(menuOpenId === p.id ? null : p.id)}
                  >
                    <Icons.more />
                  </button>
                  {menuOpenId === p.id && (
                    <div style={{
                      position: "absolute", right: 0, top: "100%", marginTop: 4,
                      background: "var(--bg-card)", border: "1px solid var(--border)",
                      borderRadius: 10, padding: 4, minWidth: 150, zIndex: 10,
                      boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                    }}>
                      <div
                        className="nav-item"
                        style={{ marginBottom: 0 }}
                        onClick={() => {
                          setMenuOpenId(null);
                          onEditPet(p);
                        }}
                      >
                        <Icons.settings /> Editar
                      </div>
                      {!isActive && (
                        <div
                          className="nav-item"
                          style={{ marginBottom: 0 }}
                          onClick={() => {
                            setMenuOpenId(null);
                            onSwitchPet(p.id);
                          }}
                        >
                          <Icons.check /> Selecionar
                        </div>
                      )}
                      <div
                        className="nav-item"
                        style={{ marginBottom: 0, color: "var(--danger)" }}
                        onClick={() => {
                          setMenuOpenId(null);
                          setConfirmDeleteId(p.id);
                        }}
                      >
                        <Icons.trash /> Excluir
                      </div>
                    </div>
                  )}
                </div>

                {/* Chevron */}
                <span style={{
                  color: "var(--text-muted)", fontSize: 10,
                  transition: "transform 0.2s",
                  transform: isExpanded ? "rotate(180deg)" : "none",
                }}>
                  ▼
                </span>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div style={{
                  marginTop: 16, paddingTop: 16,
                  borderTop: "1px solid var(--border)",
                  display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12,
                }}>
                  <div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Espécie</div>
                    <div style={{ fontSize: 14 }}>{getSpeciesDisplayName(p.species)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Morph</div>
                    <div style={{ fontSize: 14 }}>{p.morph || "—"}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Nascimento</div>
                    <div style={{ fontSize: 14 }}>{formatDate(p.birthDate)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Aquisição</div>
                    <div style={{ fontSize: 14 }}>{formatDate(p.acquiredDate)}</div>
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Idade</div>
                    <div style={{ fontSize: 14 }}>{getAge(p.birthDate)}</div>
                  </div>
                  {!isActive && (
                    <div style={{ gridColumn: "1 / -1" }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => onSwitchPet(p.id)}>
                        Selecionar como ativo
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Delete confirmation */}
              {confirmDeleteId === p.id && (
                <div style={{
                  marginTop: 12, padding: 14,
                  background: "rgba(248, 113, 113, 0.06)",
                  border: "1px solid rgba(248, 113, 113, 0.15)",
                  borderRadius: 10,
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--danger)", marginBottom: 4 }}>
                    Excluir {p.name}?
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 12 }}>
                    Todos os registros (peso, alimentação, trocas, ocorrências, documentos) serão excluídos permanentemente.
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => setConfirmDeleteId(null)}>
                      Cancelar
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        onDeletePet(p.id);
                        setConfirmDeleteId(null);
                      }}
                    >
                      <Icons.trash /> Confirmar Exclusão
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
