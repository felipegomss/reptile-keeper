"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import "./page.css";

import type { FormData, Pet } from "@/lib/types";
import { daysSince } from "@/lib/utils";
import { generateAlerts } from "@/lib/alerts";
import { getSpeciesCategory } from "@/lib/species";
import { usePets } from "@/lib/hooks/use-pets";
import { usePetData } from "@/lib/hooks/use-pet-data";
import { Icons } from "@/components/icons";

import { LoadingScreen } from "@/components/ui/loading";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { DashboardPage } from "@/components/pages/dashboard-page";
import { WeightPage } from "@/components/pages/weight-page";
import { FeedingPage } from "@/components/pages/feeding-page";
import { ShedPage } from "@/components/pages/shed-page";
import { ChartsPage } from "@/components/pages/charts-page";
import { AlertsPage } from "@/components/pages/alerts-page";
import { DocumentsPage } from "@/components/pages/documents-page";
import { NotesPage } from "@/components/pages/notes-page";
import { PetsPage } from "@/components/pages/pets-page";
import { WeightModal } from "@/components/modals/weight-modal";
import { FeedingModal } from "@/components/modals/feeding-modal";
import { ShedModal } from "@/components/modals/shed-modal";
import { DocumentModal } from "@/components/modals/document-modal";
import { NoteModal } from "@/components/modals/note-modal";
import { PetModal } from "@/components/modals/pet-modal";

export default function PetTracker() {
  const { status } = useSession();
  const {
    pets,
    activePetId,
    setActivePetId,
    loading: petsLoading,
    createPet,
    updatePet,
    deletePet,
  } = usePets();
  const {
    pet,
    weights,
    feedings,
    sheds,
    documents,
    notes,
    loading: dataLoading,
    addWeight,
    deleteWeight,
    addFeeding,
    deleteFeeding,
    addShed,
    deleteShed,
    addDocument,
    deleteDocument,
    addNote,
    deleteNote,
  } = usePetData(activePetId);

  const [page, setPage] = useState("dashboard");
  const [modal, setModal] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({});
  const [editingPet, setEditingPet] = useState<Pet | null>(null);

  // Loading state
  if (status === "loading" || petsLoading) {
    return <LoadingScreen />;
  }

  // No pets yet — show create pet modal on an empty shell
  if (pets.length === 0) {
    return (
      <>
        <div
          className="app-container"
          style={{
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            background: "var(--bg-primary)",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: 400 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🐍</div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 24,
                marginBottom: 8,
              }}
            >
              Bem-vindo ao Reptile Keeper!
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: 14,
                marginBottom: 24,
              }}
            >
              Comece adicionando seu primeiro pet para gerenciar alimentação,
              peso, trocas de pele e muito mais.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => setModal("pet")}
            >
              <Icons.plus /> Adicionar Primeiro Pet
            </button>
          </div>
        </div>
        {modal === "pet" && (
          <PetModal
            onSave={async (petData) => {
              await createPet({ ...petData, photo: null });
            }}
            onClose={() => setModal(null)}
          />
        )}
      </>
    );
  }

  // Pet data still loading (initial load or switching pets)
  if (!pet || dataLoading) {
    return <LoadingScreen />;
  }

  // ─── Computed Values ───
  const lastWeight = weights[weights.length - 1];
  const prevWeight = weights.length > 1 ? weights[weights.length - 2] : null;
  const weightGain = prevWeight ? lastWeight.weight - prevWeight.weight : 0;
  const lastFeeding = feedings[0];
  const daysSinceFeeding = lastFeeding ? daysSince(lastFeeding.date) : null;
  const lastShed = sheds[0];
  const daysSinceShed = lastShed ? daysSince(lastShed.date) : null;
  const recentFeedings = feedings.slice(0, 30);
  const feedingRate =
    recentFeedings.length > 0
      ? Math.round(
          (recentFeedings.filter((f) => f.accepted).length / recentFeedings.length) * 100,
        )
      : 0;
  const avgFeedingInterval = (() => {
    const accepted = recentFeedings.filter((f) => f.accepted);
    if (accepted.length < 2) return 7;
    let total = 0;
    for (let i = 0; i < accepted.length - 1; i++) {
      total += daysSince(accepted[i + 1].date) - daysSince(accepted[i].date);
    }
    return Math.round(Math.abs(total / (accepted.length - 1)));
  })();

  const avgShedInterval = (() => {
    if (sheds.length < 2) return 30;
    let total = 0;
    for (let i = 0; i < sheds.length - 1; i++) {
      total += daysSince(sheds[i + 1].date) - daysSince(sheds[i].date);
    }
    return Math.round(Math.abs(total / (sheds.length - 1)));
  })();

  const alerts = generateAlerts({
    pet,
    daysSinceFeeding,
    avgFeedingInterval,
    feedings,
    lastShed,
    daysSinceShed,
    avgShedInterval,
    weightGain,
  });

  // ─── Chart Data ───
  const weightChartData = (() => {
    const now = new Date();
    const cutoff = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    const cutoffStr = cutoff.toISOString().slice(0, 10);
    return weights
      .filter((w) => w.date >= cutoffStr)
      .map((w) => ({
        date: new Date(w.date + "T12:00:00").toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "short",
        }),
        peso: w.weight,
      }));
  })();

  const feedingChartData = (() => {
    // Build last 6 calendar months starting from day 1
    const now = new Date();
    const months: { key: string; label: string }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
      months.push({ key, label });
    }
    // Initialize all months with zeros
    const monthMap: Record<string, { label: string; aceitas: number; recusadas: number }> = {};
    months.forEach((m) => { monthMap[m.key] = { label: m.label, aceitas: 0, recusadas: 0 }; });
    // Count feedings within the 6-month window
    const cutoff = `${months[0].key}-01`;
    feedings.forEach((f) => {
      if (f.date < cutoff) return;
      const key = f.date.slice(0, 7);
      if (monthMap[key]) {
        if (f.accepted) monthMap[key].aceitas++;
        else monthMap[key].recusadas++;
      }
    });
    return months.map((m) => ({ date: monthMap[m.key].label, aceitas: monthMap[m.key].aceitas, recusadas: monthMap[m.key].recusadas }));
  })();

  // ─── Form Handlers ───
  const today = new Date().toISOString().slice(0, 10);
  const openModal = (type: string) => {
    setFormData({ date: today });
    setModal(type);
  };

  const closeModal = () => setModal(null);

  const handleAddWeight = async () => {
    if (!formData.date || !formData.weight) return;
    await addWeight({
      date: formData.date as string,
      weight: Number(formData.weight),
    });
    setModal(null);
  };

  const handleAddFeeding = async () => {
    if (!formData.date || !formData.prey) return;
    await addFeeding({
      date: formData.date as string,
      prey: formData.prey as string,
      grams: Number(formData.grams || 0),
      accepted: formData.accepted !== false,
      notes: (formData.notes as string) || "",
    });
    setModal(null);
  };

  const handleAddShed = async () => {
    if (!formData.date) return;
    await addShed({
      date: formData.date as string,
      quality: (formData.quality as "complete" | "partial") || "complete",
      notes: (formData.notes as string) || "",
    });
    setModal(null);
  };

  const handleAddDoc = async () => {
    if (!formData.name) return;
    await addDocument({
      name: formData.name as string,
      type: "PDF",
      date:
        (formData.date as string) || new Date().toISOString().slice(0, 10),
      category: (formData.category as "legal" | "saude") || "legal",
    });
    setModal(null);
  };

  const handleAddNote = async () => {
    if (!formData.date || !formData.title || !formData.category) return;
    await addNote({
      date: formData.date as string,
      category: formData.category as "saude" | "comportamento" | "vet" | "outro",
      title: formData.title as string,
      description: (formData.description as string) || "",
      severity: (formData.severity as "low" | "medium" | "high") || "low",
    });
    setModal(null);
  };

  // ─── Navigation Map ───
  const category = getSpeciesCategory(pet);
  const shedLabel = category === "quelonio" ? "Saúde do Casco" : "Trocas de Pele";

  const pages: Record<
    string,
    { label: string; icon: () => React.JSX.Element }
  > = {
    dashboard: { label: "Dashboard", icon: Icons.home },
    peso: { label: "Peso", icon: Icons.weight },
    alimentacao: { label: "Alimentação", icon: Icons.food },
    trocas: { label: shedLabel, icon: Icons.shed },
    ocorrencias: { label: "Ocorrências", icon: Icons.note },
    graficos: { label: "Gráficos", icon: Icons.chart },
    alertas: { label: "Alertas", icon: Icons.alert },
    documentos: { label: "Documentos", icon: Icons.doc },
    pets: { label: "Meus Pets", icon: Icons.settings },
  };

  // ─── Page Rendering ───
  const renderPage = () => {
    // Guard: need at least one weight for most pages
    const safeLastWeight = lastWeight || { id: "", date: "", weight: 0, petId: "" };

    switch (page) {
      case "dashboard":
        return (
          <DashboardPage
            pet={pet}
            lastWeight={safeLastWeight}
            weightGain={weightGain}
            daysSinceFeeding={daysSinceFeeding}
            feedingRate={feedingRate}
            daysSinceShed={daysSinceShed}
            avgShedInterval={avgShedInterval}
            alerts={alerts}
            weightChartData={weightChartData}
            feedings={feedings}
            sheds={sheds}
            weights={weights}
            notes={notes}
            onNavigateToWeight={() => setPage("peso")}
            onAddRecord={openModal}
          />
        );
      case "peso":
        return (
          <WeightPage
            pet={pet}
            weights={weights}
            weightChartData={weightChartData}
            onOpenModal={() => openModal("weight")}
            onDelete={deleteWeight}
          />
        );
      case "alimentacao":
        return (
          <FeedingPage
            pet={pet}
            feedings={feedings}
            avgFeedingInterval={avgFeedingInterval}
            feedingRate={feedingRate}
            lastWeight={safeLastWeight}
            feedingChartData={feedingChartData}
            onOpenModal={() => openModal("feeding")}
            onDelete={deleteFeeding}
          />
        );
      case "trocas":
        return (
          <ShedPage
            pet={pet}
            sheds={sheds}
            daysSinceShed={daysSinceShed}
            avgShedInterval={avgShedInterval}
            onOpenModal={() => openModal("shed")}
            onDelete={deleteShed}
          />
        );
      case "ocorrencias":
        return (
          <NotesPage
            pet={pet}
            notes={notes}
            onOpenModal={() => openModal("note")}
            onDelete={deleteNote}
          />
        );
      case "graficos":
        return (
          <ChartsPage
            pet={pet}
            weights={weights}
            feedings={feedings}
            lastWeight={safeLastWeight}
            weightChartData={weightChartData}
            feedingChartData={feedingChartData}
          />
        );
      case "alertas":
        return (
          <AlertsPage
            pet={pet}
            alerts={alerts}
            daysSinceFeeding={daysSinceFeeding}
            avgFeedingInterval={avgFeedingInterval}
            daysSinceShed={daysSinceShed}
            avgShedInterval={avgShedInterval}
            lastWeight={safeLastWeight}
          />
        );
      case "documentos":
        return (
          <DocumentsPage
            pet={pet}
            docs={documents}
            onOpenModal={() => openModal("doc")}
            onDelete={deleteDocument}
          />
        );
      case "pets":
        return (
          <PetsPage
            pets={pets}
            activePetId={activePetId}
            onSwitchPet={setActivePetId}
            onAddPet={() => openModal("pet")}
            onEditPet={(p) => {
              setEditingPet(p);
              setModal("editPet");
            }}
            onDeletePet={deletePet}
            maxPets={3}
          />
        );
      default:
        return null;
    }
  };

  // ─── Modal Rendering ───
  const renderModal = () => {
    switch (modal) {
      case "weight":
        return (
          <WeightModal
            formData={formData}
            setFormData={setFormData}
            onSave={handleAddWeight}
            onClose={closeModal}
          />
        );
      case "feeding":
        return (
          <FeedingModal
            pet={pet}
            formData={formData}
            setFormData={setFormData}
            onSave={handleAddFeeding}
            onClose={closeModal}
          />
        );
      case "shed":
        return (
          <ShedModal
            formData={formData}
            setFormData={setFormData}
            onSave={handleAddShed}
            onClose={closeModal}
          />
        );
      case "doc":
        return (
          <DocumentModal
            formData={formData}
            setFormData={setFormData}
            onSave={handleAddDoc}
            onClose={closeModal}
          />
        );
      case "note":
        return (
          <NoteModal
            formData={formData}
            setFormData={setFormData}
            onSave={handleAddNote}
            onClose={closeModal}
          />
        );
      case "pet":
        return (
          <PetModal
            onSave={async (petData) => {
              await createPet({ ...petData, photo: null });
            }}
            onClose={closeModal}
          />
        );
      case "editPet":
        return editingPet ? (
          <PetModal
            pet={editingPet}
            onSave={async (petData) => {
              await updatePet(editingPet.id, petData);
            }}
            onClose={() => {
              setEditingPet(null);
              closeModal();
            }}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="app-container">
        <Sidebar
          pet={pet}
          pets={pets}
          activePetId={activePetId}
          onSwitchPet={setActivePetId}
          onAddPet={() => openModal("pet")}
          pages={pages}
          activePage={page}
          onNavigate={setPage}
        />
        <main className="main-content">{renderPage()}</main>
        {renderModal()}
      </div>
      <MobileNav pages={pages} activePage={page} onNavigate={setPage} />
    </>
  );
}
