"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import type { Pet } from "@/lib/types";
import { getAge } from "@/lib/utils";
import { getPetEmoji, getSpeciesDisplayName } from "@/lib/species";
import { Icons } from "@/components/icons";

interface PageEntry {
  label: string;
  icon: () => React.JSX.Element;
}

interface SidebarProps {
  pet: Pet;
  pets: Pet[];
  activePetId: string | null;
  onSwitchPet: (id: string) => void;
  onAddPet: () => void;
  pages: Record<string, PageEntry>;
  activePage: string;
  onNavigate: (page: string) => void;
}

export function Sidebar({
  pet,
  pets,
  activePetId,
  onSwitchPet,
  onAddPet,
  pages,
  activePage,
  onNavigate,
}: SidebarProps) {
  const [showPetList, setShowPetList] = useState(false);

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h1>Reptile Keeper</h1>
        <span>Pet Management</span>
      </div>

      <div
        className="pet-card-sidebar"
        style={{ cursor: "pointer" }}
        onClick={() => setShowPetList(!showPetList)}
      >
        <div className="pet-avatar">{getPetEmoji(pet.species)}</div>
        <div className="pet-info-sidebar">
          <h3>{pet.name}</h3>
          <p>
            {getSpeciesDisplayName(pet.species)} • {getAge(pet.birthDate)}
          </p>
        </div>
        <span
          style={{
            marginLeft: "auto",
            color: "var(--text-muted)",
            fontSize: 10,
            transition: "transform 0.2s",
            transform: showPetList ? "rotate(180deg)" : "none",
          }}
        >
          ▼
        </span>
      </div>

      {showPetList && (
        <div
          style={{
            borderBottom: "1px solid var(--border)",
            background: "var(--bg-primary)",
          }}
        >
          {pets.map((p) => (
            <div
              key={p.id}
              style={{
                padding: "10px 20px",
                fontSize: 13,
                cursor: "pointer",
                color:
                  p.id === activePetId
                    ? "var(--accent)"
                    : "var(--text-secondary)",
                background:
                  p.id === activePetId ? "var(--accent-glow)" : "transparent",
                transition: "all 0.2s",
              }}
              onClick={() => {
                onSwitchPet(p.id);
                setShowPetList(false);
              }}
              onMouseEnter={(e) => {
                if (p.id !== activePetId)
                  e.currentTarget.style.background = "var(--bg-card)";
              }}
              onMouseLeave={(e) => {
                if (p.id !== activePetId)
                  e.currentTarget.style.background = "transparent";
              }}
            >
              {getPetEmoji(p.species)} {p.name}
            </div>
          ))}
          {pets.length < 3 && (
            <div
              style={{
                padding: "10px 20px",
                fontSize: 13,
                cursor: "pointer",
                color: "var(--accent)",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.2s",
              }}
              onClick={() => {
                onAddPet();
                setShowPetList(false);
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--bg-card)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <Icons.plus /> Adicionar Pet
            </div>
          )}
        </div>
      )}

      <nav className="nav-section">
        <div className="nav-label">Menu</div>
        {Object.entries(pages).map(([key, { label, icon: Icon }]) => (
          <div
            key={key}
            className={`nav-item ${activePage === key ? "active" : ""}`}
            onClick={() => onNavigate(key)}
          >
            <Icon />
            {label}
          </div>
        ))}
      </nav>

      <div
        style={{
          padding: "16px 12px",
          borderTop: "1px solid var(--border)",
          marginTop: "auto",
        }}
      >
        <div
          className="nav-item"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="w-5 h-5"
          >
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sair
        </div>
      </div>
    </aside>
  );
}
