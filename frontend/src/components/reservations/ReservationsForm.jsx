import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";

const pad = (value) => String(value).padStart(2, "0");

const toInputDateTime = (value) => {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export default function ReservationsForm({
  reservation,
  users,
  vehicles,
  parkings,
  onSave,
  onCancel,
  isSaving,
  saveError,
}) {
  const isEditing = Boolean(reservation?.id);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      user_id: reservation?.user_id ?? "",
      vehicle_id: reservation?.vehicle_id ?? "",
      parking_id:
        reservation?.parkingspaces?.parking_id ??
        reservation?.parkingspaces?.parkings?.id ??
        "",
      parking_space_id: reservation?.parking_space_id ?? "",
      start_time: toInputDateTime(reservation?.start_time),
      end_time: toInputDateTime(reservation?.end_time),
      status: reservation?.status ?? "active",
    },
  });

  useEffect(() => {
    reset({
      user_id: reservation?.user_id ?? "",
      vehicle_id: reservation?.vehicle_id ?? "",
      parking_id:
        reservation?.parkingspaces?.parking_id ??
        reservation?.parkingspaces?.parkings?.id ??
        "",
      parking_space_id: reservation?.parking_space_id ?? "",
      start_time: toInputDateTime(reservation?.start_time),
      end_time: toInputDateTime(reservation?.end_time),
      status: reservation?.status ?? "active",
    });
  }, [reservation, reset]);

  const selectedUserId = watch("user_id");
  const selectedParkingId = watch("parking_id");
  const startValue = watch("start_time");

  const filteredVehicles = useMemo(() => {
    if (!selectedUserId) {
      return vehicles;
    }
    return vehicles.filter(
      (vehicle) => vehicle.user_id === Number(selectedUserId),
    );
  }, [vehicles, selectedUserId]);

  const selectedParking = useMemo(() => {
    if (!selectedParkingId) {
      return null;
    }
    return parkings.find((parking) => parking.id === Number(selectedParkingId));
  }, [parkings, selectedParkingId]);

  const parkingSpaces = selectedParking?.parkingspaces ?? [];

  const onSubmit = (values) => {
    onSave({
      user_id: Number(values.user_id),
      vehicle_id: Number(values.vehicle_id),
      parking_space_id: Number(values.parking_space_id),
      start_time: new Date(values.start_time).toISOString(),
      end_time: new Date(values.end_time).toISOString(),
      status: isEditing ? values.status : "active",
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full rounded-lg border bg-white p-6 shadow-sm"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {reservation ? "Uredi rezervaciju" : "Nova rezervacija"}
        </h2>
        <div className="flex gap-2">
          <Button type="submit" disabled={isSaving}>
            Spremi
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Odustani
            </Button>
          )}
        </div>
      </div>

      {saveError && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {saveError}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          Korisnik
          <select
            className={`rounded border px-3 py-2 ${
              errors.user_id ? "border-red-500" : "border-slate-200"
            }`}
            {...register("user_id", {
              required: "Korisnik je obavezan",
              valueAsNumber: true,
            })}
          >
            <option value="">Odaberi korisnika</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
          {errors.user_id && (
            <span className="text-xs text-red-600">
              {errors.user_id.message}
            </span>
          )}
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Vozilo
          <select
            className={`rounded border px-3 py-2 ${
              errors.vehicle_id ? "border-red-500" : "border-slate-200"
            }`}
            {...register("vehicle_id", {
              required: "Vozilo je obavezno",
              valueAsNumber: true,
            })}
          >
            <option value="">Odaberi vozilo</option>
            {filteredVehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.license_plate} ({vehicle.vehicle_type})
              </option>
            ))}
          </select>
          {errors.vehicle_id && (
            <span className="text-xs text-red-600">
              {errors.vehicle_id.message}
            </span>
          )}
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Parking
          <select
            className={`rounded border px-3 py-2 ${
              errors.parking_id ? "border-red-500" : "border-slate-200"
            }`}
            {...register("parking_id", {
              required: "Parking je obavezan",
              valueAsNumber: true,
              onChange: (event) => {
                setValue("parking_space_id", "");
              },
            })}
          >
            <option value="">Odaberi parking</option>
            {parkings.map((parking) => (
              <option key={parking.id} value={parking.id}>
                {parking.name}
              </option>
            ))}
          </select>
          {errors.parking_id && (
            <span className="text-xs text-red-600">
              {errors.parking_id.message}
            </span>
          )}
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Parking mjesto
          <select
            className={`rounded border px-3 py-2 ${
              errors.parking_space_id ? "border-red-500" : "border-slate-200"
            }`}
            disabled={!selectedParkingId}
            {...register("parking_space_id", {
              required: "Parking mjesto je obavezno",
              valueAsNumber: true,
            })}
          >
            <option value="">Odaberi mjesto</option>
            {parkingSpaces.map((space) => (
              <option key={space.id} value={space.id}>
                {space.space_number} ({space.space_type})
              </option>
            ))}
          </select>
          {errors.parking_space_id && (
            <span className="text-xs text-red-600">
              {errors.parking_space_id.message}
            </span>
          )}
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Pocetak
          <input
            type="datetime-local"
            className={`rounded border px-3 py-2 ${
              errors.start_time ? "border-red-500" : "border-slate-200"
            }`}
            {...register("start_time", {
              required: "Pocetak je obavezan",
              validate: (value) => {
                const start = new Date(value);
                if (Number.isNaN(start.getTime())) {
                  return "Neispravan datum";
                }
                if (start < new Date()) {
                  return "Pocetak ne moze biti u proslosti";
                }
                const endValue = watch("end_time");
                if (endValue) {
                  const end = new Date(endValue);
                  if (!Number.isNaN(end.getTime()) && start >= end) {
                    return "Pocetak mora biti prije kraja";
                  }
                }
                return true;
              },
            })}
          />
          {errors.start_time && (
            <span className="text-xs text-red-600">
              {errors.start_time.message}
            </span>
          )}
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Kraj
          <input
            type="datetime-local"
            className={`rounded border px-3 py-2 ${
              errors.end_time ? "border-red-500" : "border-slate-200"
            }`}
            {...register("end_time", {
              required: "Kraj je obavezan",
              validate: (value) => {
                const end = new Date(value);
                if (Number.isNaN(end.getTime())) {
                  return "Neispravan datum";
                }
                const start = new Date(startValue);
                if (!Number.isNaN(start.getTime()) && end <= start) {
                  return "Kraj mora biti nakon pocetka";
                }
                return true;
              },
            })}
          />
          {errors.end_time && (
            <span className="text-xs text-red-600">
              {errors.end_time.message}
            </span>
          )}
        </label>

        {isEditing && (
          <label className="flex flex-col gap-1 text-sm">
            Status
            <select
              className={`rounded border px-3 py-2 ${
                errors.status ? "border-red-500" : "border-slate-200"
              }`}
              {...register("status", { required: "Status je obavezan" })}
            >
              <option value="active">active</option>
              <option value="cancelled">cancelled</option>
              <option value="completed">completed</option>
            </select>
            {errors.status && (
              <span className="text-xs text-red-600">
                {errors.status.message}
              </span>
            )}
          </label>
        )}
      </div>
    </form>
  );
}
