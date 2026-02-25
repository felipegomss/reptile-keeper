"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  PetWithRecords,
  WeightRecord,
  FeedingRecord,
  ShedRecord,
  PetDocument,
  NoteRecord,
} from "@/lib/types";

export function usePetData(petId: string | null) {
  const [data, setData] = useState<PetWithRecords | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!petId) {
      setData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/pets/${petId}`);
      if (res.ok) {
        setData(await res.json());
      }
    } finally {
      setLoading(false);
    }
  }, [petId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addWeight = async (record: Omit<WeightRecord, "id" | "petId">) => {
    const res = await fetch(`/api/pets/${petId}/weights`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    });
    if (!res.ok) throw new Error("Erro ao adicionar peso");
    await fetchData();
  };

  const deleteWeight = async (weightId: string) => {
    await fetch(`/api/pets/${petId}/weights/${weightId}`, {
      method: "DELETE",
    });
    await fetchData();
  };

  const addFeeding = async (record: Omit<FeedingRecord, "id" | "petId">) => {
    const res = await fetch(`/api/pets/${petId}/feedings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    });
    if (!res.ok) throw new Error("Erro ao adicionar alimentação");
    await fetchData();
  };

  const deleteFeeding = async (feedingId: string) => {
    await fetch(`/api/pets/${petId}/feedings/${feedingId}`, {
      method: "DELETE",
    });
    await fetchData();
  };

  const addShed = async (record: Omit<ShedRecord, "id" | "petId">) => {
    const res = await fetch(`/api/pets/${petId}/sheds`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    });
    if (!res.ok) throw new Error("Erro ao adicionar troca");
    await fetchData();
  };

  const deleteShed = async (shedId: string) => {
    await fetch(`/api/pets/${petId}/sheds/${shedId}`, { method: "DELETE" });
    await fetchData();
  };

  const addDocument = async (record: Omit<PetDocument, "id" | "petId">) => {
    const res = await fetch(`/api/pets/${petId}/documents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    });
    if (!res.ok) throw new Error("Erro ao adicionar documento");
    await fetchData();
  };

  const deleteDocument = async (docId: string) => {
    await fetch(`/api/pets/${petId}/documents/${docId}`, { method: "DELETE" });
    await fetchData();
  };

  const addNote = async (record: Omit<NoteRecord, "id" | "petId">) => {
    const res = await fetch(`/api/pets/${petId}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    });
    if (!res.ok) throw new Error("Erro ao adicionar ocorrência");
    await fetchData();
  };

  const deleteNote = async (noteId: string) => {
    await fetch(`/api/pets/${petId}/notes/${noteId}`, { method: "DELETE" });
    await fetchData();
  };

  return {
    pet: data,
    weights: data?.weights ?? [],
    feedings: data?.feedings ?? [],
    sheds: data?.sheds ?? [],
    documents: data?.documents ?? [],
    notes: data?.notes ?? [],
    loading,
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
    refetch: fetchData,
  };
}
