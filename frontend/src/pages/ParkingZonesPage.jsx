import React, { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createParkingZone,
  deleteParkingZone,
  updateParkingZone,
} from "@/api/parkingApi";
import { useParkingZones } from "@/hooks/useParkingZones";
import ParkingZoneForm from "@/components/parkingZone/ParkingZoneForm";
import ParkingZonesTable from "@/components/parkingZone/ParkingZonesTable";

export default function ParkingZonesPage() {
  const queryClient = useQueryClient();
  const { data: zones = [], isLoading, isError, error } = useParkingZones();
  const [search, setSearch] = useState("");
  const [editingZone, setEditingZone] = useState(null);

  const filteredZones = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      return zones;
    }
    return zones.filter((zone) => {
      const priceText = String(zone.price_per_hour ?? "");
      return (
        zone.name?.toLowerCase().includes(term) ||
        zone.description?.toLowerCase().includes(term) ||
        priceText.includes(term)
      );
    });
  }, [zones, search]);

  const createMutation = useMutation({
    mutationFn: (payload) => createParkingZone(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parkingZones"] });
      setEditingZone(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateParkingZone(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parkingZones"] });
      setEditingZone(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteParkingZone(id),
    onSuccess: (_data, zoneId) => {
      queryClient.invalidateQueries({ queryKey: ["parkingZones"] });
      setEditingZone((current) => (current?.id === zoneId ? null : current));
    },
  });

  const getErrorMessage = (err) => {
    if (!err) {
      return null;
    }
    return err?.response?.data?.error || err?.message || "Dogodila se greska.";
  };

  const handleSave = (values) => {
    if (editingZone) {
      updateMutation.mutate({ id: editingZone.id, payload: values });
      return;
    }
    createMutation.mutate(values);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Jeste li sigurni da zelite obrisati ovu zonu?",
    );
    if (!confirmed) {
      return;
    }
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (isError) {
    return <div className="p-6">Error: {error.message}</div>;
  }

  return (
    <div className="mx-auto flex w-11/12 max-w-5xl flex-col gap-6 py-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-lg font-semibold">Parking zone</h2>
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Pretrazi po nazivu, cijeni ili opisu"
          className="w-full rounded border border-slate-200 px-3 py-2 text-sm md:w-80"
        />
      </div>

      <ParkingZoneForm
        zone={editingZone}
        onSave={handleSave}
        onCancel={editingZone ? () => setEditingZone(null) : null}
        isSaving={createMutation.isPending || updateMutation.isPending}
        saveError={
          createMutation.isError
            ? getErrorMessage(createMutation.error)
            : updateMutation.isError
              ? getErrorMessage(updateMutation.error)
              : null
        }
      />

      {deleteMutation.isError && (
        <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {getErrorMessage(deleteMutation.error)}
        </div>
      )}

      {filteredZones.length === 0 ? (
        <div className="text-sm text-slate-500">Nema zona za prikaz.</div>
      ) : (
        <ParkingZonesTable
          zones={filteredZones}
          onEdit={(zone) => setEditingZone(zone)}
          onDelete={handleDelete}
          deletingId={
            deleteMutation.isPending ? deleteMutation.variables : null
          }
        />
      )}
    </div>
  );
}
