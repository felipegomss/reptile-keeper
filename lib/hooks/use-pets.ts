"use client";

import { useState, useEffect, useCallback } from "react";
import type { Pet } from "@/lib/types";

export function usePets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [activePetId, setActivePetId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPets = useCallback(async () => {
    try {
      const res = await fetch("/api/pets");
      if (res.ok) {
        const data = await res.json();
        setPets(data);
        if (data.length > 0) {
          setActivePetId((prev) => {
            if (prev && data.some((p: Pet) => p.id === prev)) return prev;
            return data[0].id;
          });
        } else {
          setActivePetId(null);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  const createPet = async (pet: Omit<Pet, "id">) => {
    const res = await fetch("/api/pets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pet),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Erro ao criar pet");
    }
    const newPet = await res.json();
    await fetchPets();
    setActivePetId(newPet.id);
    return newPet;
  };

  const updatePet = async (id: string, data: Partial<Pet>) => {
    const res = await fetch(`/api/pets/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erro ao atualizar pet");
    await fetchPets();
  };

  const deletePet = async (id: string) => {
    const res = await fetch(`/api/pets/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Erro ao excluir pet");
    await fetchPets();
  };

  return {
    pets,
    activePetId,
    setActivePetId,
    loading,
    createPet,
    updatePet,
    deletePet,
    refetch: fetchPets,
  };
}
