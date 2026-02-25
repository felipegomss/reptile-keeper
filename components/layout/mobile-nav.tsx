"use client";

import { useState, useEffect, useRef } from "react";
import { Icons } from "@/components/icons";

interface PageEntry {
  label: string;
  icon: () => React.JSX.Element;
}

interface MobileNavProps {
  pages: Record<string, PageEntry>;
  activePage: string;
  onNavigate: (page: string) => void;
}

const PRIMARY_KEYS = ["dashboard", "peso", "alimentacao", "trocas"];

export function MobileNav({ pages, activePage, onNavigate }: MobileNavProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  const primaryPages = PRIMARY_KEYS.filter((k) => k in pages);
  const secondaryPages = Object.keys(pages).filter(
    (k) => !PRIMARY_KEYS.includes(k),
  );
  const isSecondaryActive = secondaryPages.includes(activePage);

  useEffect(() => {
    if (!moreOpen) return;
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [moreOpen]);

  return (
    <nav className="mobile-nav">
      {primaryPages.map((key) => {
        const { label, icon: Icon } = pages[key];
        return (
          <button
            key={key}
            className={`mobile-nav-item ${activePage === key ? "active" : ""}`}
            onClick={() => {
              onNavigate(key);
              setMoreOpen(false);
            }}
          >
            <Icon />
            <span>{label}</span>
          </button>
        );
      })}

      <div className="mobile-nav-more-wrap" ref={moreRef}>
        {moreOpen && (
          <div className="mobile-nav-popover">
            {secondaryPages.map((key) => {
              const { label, icon: Icon } = pages[key];
              return (
                <button
                  key={key}
                  className={`mobile-nav-popover-item ${activePage === key ? "active" : ""}`}
                  onClick={() => {
                    onNavigate(key);
                    setMoreOpen(false);
                  }}
                >
                  <Icon />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        )}
        <button
          className={`mobile-nav-item ${isSecondaryActive ? "active" : ""}`}
          onClick={() => setMoreOpen(!moreOpen)}
        >
          <Icons.more />
          <span>Mais</span>
        </button>
      </div>
    </nav>
  );
}
