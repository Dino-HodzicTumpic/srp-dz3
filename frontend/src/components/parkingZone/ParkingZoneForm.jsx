import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";

export default function ParkingZoneForm({
  zone,
  onSave,
  onCancel,
  isSaving,
  saveError,
}) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: zone?.name ?? "",
      price_per_hour:
        zone?.price_per_hour !== undefined && zone?.price_per_hour !== null
          ? Number(zone.price_per_hour)
          : "",
      description: zone?.description ?? "",
    },
  });

  useEffect(() => {
    reset({
      name: zone?.name ?? "",
      price_per_hour:
        zone?.price_per_hour !== undefined && zone?.price_per_hour !== null
          ? Number(zone.price_per_hour)
          : "",
      description: zone?.description ?? "",
    });
  }, [zone, reset]);

  const priceValue = watch("price_per_hour");

  const onSubmit = (values) => {
    onSave({
      ...values,
      description: values.description?.trim() || null,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full rounded-lg border bg-white p-6 shadow-sm"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {zone ? "Uredi zonu" : "Nova zona"}
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
          Naziv
          <input
            type="text"
            className={`rounded border px-3 py-2 ${
              errors.name ? "border-red-500" : "border-slate-200"
            }`}
            {...register("name", {
              required: "Naziv je obavezan",
              maxLength: { value: 10, message: "Maksimalno 10 znakova" },
              pattern: {
                value: /^Z[A-Z0-9]{1,9}$/,
                message:
                  "Mora poceti s 'Z' i sadrzavati samo velika slova ili brojeve",
              },
            })}
          />
          {errors.name && (
            <span className="text-xs text-red-600">{errors.name.message}</span>
          )}
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Cijena po satu
          <input
            type="number"
            step="0.5"
            className={`rounded border px-3 py-2 ${
              errors.price_per_hour ? "border-red-500" : "border-slate-200"
            }`}
            {...register("price_per_hour", {
              required: "Cijena je obavezna",
              valueAsNumber: true,
              min: { value: 0.5, message: "Minimalno 0.5" },
              max: { value: 100, message: "Maksimalno 100" },
              validate: (value) =>
                Number.isInteger(value * 2) ||
                "Cijena mora biti u koracima od 0.5",
            })}
          />
          {errors.price_per_hour && (
            <span className="text-xs text-red-600">
              {errors.price_per_hour.message}
            </span>
          )}
        </label>

        <label className="flex flex-col gap-1 text-sm md:col-span-2">
          Opis
          <textarea
            rows={3}
            className={`rounded border px-3 py-2 ${
              errors.description ? "border-red-500" : "border-slate-200"
            }`}
            {...register("description", {
              validate: (value) => {
                if (Number(priceValue) > 10) {
                  return value && value.trim().length >= 10
                    ? true
                    : "Opis je obavezan (min 10 znakova) za cijenu vecu od 10";
                }
                return true;
              },
            })}
          />
          {errors.description && (
            <span className="text-xs text-red-600">
              {errors.description.message}
            </span>
          )}
        </label>
      </div>
    </form>
  );
}
