import React, { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createReservation,
  deleteReservation,
  updateReservation,
} from "@/api/parkingApi";
import { useParkings } from "@/hooks/useParkings";
import { useReservations } from "@/hooks/useReservations";
import { useUsers } from "@/hooks/useUsers";
import { useVehicles } from "@/hooks/useVehicles";
import ReservationsForm from "@/components/reservations/ReservationsForm";
import ReservationsTable from "@/components/reservations/ReservationsTable";

export default function ReservationsPage() {
  const queryClient = useQueryClient();
  const {
    data: reservations = [],
    isLoading: reservationsLoading,
    isError: reservationsError,
    error: reservationsErrorDetail,
  } = useReservations();
  const {
    data: users = [],
    isLoading: usersLoading,
    isError: usersError,
    error: usersErrorDetail,
  } = useUsers();
  const {
    data: vehicles = [],
    isLoading: vehiclesLoading,
    isError: vehiclesError,
    error: vehiclesErrorDetail,
  } = useVehicles();
  const {
    data: parkings = [],
    isLoading: parkingsLoading,
    isError: parkingsError,
    error: parkingsErrorDetail,
  } = useParkings();

  const [search, setSearch] = useState("");
  const [editingReservation, setEditingReservation] = useState(null);

  const filteredReservations = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      return reservations;
    }
    return reservations.filter((reservation) => {
      const userName = reservation.users?.name ?? "";
      const userEmail = reservation.users?.email ?? "";
      const vehiclePlate = reservation.vehicles?.license_plate ?? "";
      const parkingName = reservation.parkingspaces?.parkings?.name ?? "";
      const spaceNumber = reservation.parkingspaces?.space_number ?? "";
      const status = reservation.status ?? "";
      return [
        userName,
        userEmail,
        vehiclePlate,
        parkingName,
        spaceNumber,
        status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term);
    });
  }, [reservations, search]);

  const createMutation = useMutation({
    mutationFn: (payload) => createReservation(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      setEditingReservation(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateReservation(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      setEditingReservation(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteReservation(id),
    onSuccess: (_data, reservationId) => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      setEditingReservation((current) =>
        current?.id === reservationId ? null : current,
      );
    },
  });

  const getErrorMessage = (err) => {
    if (!err) {
      return null;
    }
    return err?.response?.data?.error || err?.message || "Dogodila se greska.";
  };

  const handleSave = (values) => {
    if (editingReservation) {
      updateMutation.mutate({ id: editingReservation.id, payload: values });
      return;
    }
    createMutation.mutate(values);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Jeste li sigurni da zelite obrisati ovu rezervaciju?",
    );
    if (!confirmed) {
      return;
    }
    deleteMutation.mutate(id);
  };

  const isLoading =
    reservationsLoading || usersLoading || vehiclesLoading || parkingsLoading;
  const isError =
    reservationsError || usersError || vehiclesError || parkingsError;

  const errorDetail =
    reservationsErrorDetail ||
    usersErrorDetail ||
    vehiclesErrorDetail ||
    parkingsErrorDetail;

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (isError) {
    return <div className="p-6">Error: {errorDetail?.message}</div>;
  }

  return (
    <div className="mx-auto flex w-11/12 max-w-6xl flex-col gap-6 py-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-lg font-semibold">Rezervacije</h2>
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Pretrazi po korisniku, vozilu, parkingu, statusu"
          className="w-full rounded border border-slate-200 px-3 py-2 text-sm md:w-96"
        />
      </div>

      <ReservationsForm
        reservation={editingReservation}
        users={users}
        vehicles={vehicles}
        parkings={parkings}
        onSave={handleSave}
        onCancel={editingReservation ? () => setEditingReservation(null) : null}
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

      {filteredReservations.length === 0 ? (
        <div className="text-sm text-slate-500">Nema rezervacija.</div>
      ) : (
        <ReservationsTable
          reservations={filteredReservations}
          onEdit={(reservation) => setEditingReservation(reservation)}
          onDelete={handleDelete}
          deletingId={
            deleteMutation.isPending ? deleteMutation.variables : null
          }
        />
      )}
    </div>
  );
}
