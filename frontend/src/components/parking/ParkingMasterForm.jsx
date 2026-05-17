import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";

export default function ParkingMasterForm({
  parking,
  zones,
  zonesLoading,
  totalSpaces = 0,
  onSave,
  onDelete,
  isSaving,
  isDeleting,
  saveError,
  deleteError,
  canDelete = true,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      zone_id: parking?.zone_id ?? "",
      name: parking?.name ?? "",
      location: parking?.location ?? "",
    },
  });

  useEffect(() => {
    reset({
      zone_id: parking?.zone_id ?? "",
      name: parking?.name ?? "",
      location: parking?.location ?? "",
    });
  }, [parking, reset]);

  const onSubmit = (values) => {
    onSave(values);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full rounded-lg border bg-white p-6 shadow-sm"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Parking</h2>
        <div className="flex gap-2">
          <Button type="submit" disabled={isSaving}>
            Spremi
          </Button>
          {canDelete && (
            <Button
              type="button"
              variant="destructive"
              onClick={onDelete}
              disabled={isDeleting}
            >
              Obriši
            </Button>
          )}
        </div>
      </div>

      {(saveError || deleteError) && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {saveError || deleteError}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          Zona
          <select
            className={`rounded border px-3 py-2 ${
              errors.zone_id ? "border-red-500" : "border-slate-200"
            }`}
            disabled={zonesLoading}
            {...register("zone_id", {
              required: "Zona je obavezna",
              valueAsNumber: true,
            })}
          >
            <option value="">Odaberi zonu</option>
            {zones.map((zone) => (
              <option key={zone.id} value={zone.id}>
                {zone.name}
              </option>
            ))}
          </select>
          {errors.zone_id && (
            <span className="text-xs text-red-600">
              {errors.zone_id.message}
            </span>
          )}
          {!zonesLoading && zones.length === 0 && (
            <span className="text-xs text-amber-600">Nema dostupnih zona.</span>
          )}
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Naziv
          <input
            type="text"
            className={`rounded border px-3 py-2 ${
              errors.name ? "border-red-500" : "border-slate-200"
            }`}
            {...register("name", {
              required: "Naziv je obavezan",
              minLength: { value: 2, message: "Minimalno 2 znaka" },
              maxLength: { value: 100, message: "Maksimalno 100 znakova" },
            })}
          />
          {errors.name && (
            <span className="text-xs text-red-600">{errors.name.message}</span>
          )}
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Lokacija
          <input
            type="text"
            className={`rounded border px-3 py-2 ${
              errors.location ? "border-red-500" : "border-slate-200"
            }`}
            {...register("location", {
              required: "Lokacija je obavezna",
              minLength: { value: 2, message: "Minimalno 2 znaka" },
              maxLength: { value: 255, message: "Maksimalno 255 znakova" },
            })}
          />
          {errors.location && (
            <span className="text-xs text-red-600">
              {errors.location.message}
            </span>
          )}
        </label>

        <div className="flex flex-col gap-1 text-sm">
          <span>Ukupno mjesta</span>
          <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700">
            {Number.isFinite(totalSpaces) ? totalSpaces : 0}
          </div>
          <span className="text-xs text-slate-500">
            Automatski izracunato prema broju mjesta.
          </span>
        </div>
      </div>
    </form>
  );
}
