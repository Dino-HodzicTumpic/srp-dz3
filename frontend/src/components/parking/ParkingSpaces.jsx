import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import ParkingSpaceRow from "./ParkingSpaceRow";

export default function ParkingSpaces({
  spaces,
  onCreate,
  onUpdate,
  onDelete,
  isCreating,
  deletingId,
  updatingId,
  createError,
  updateError,
  deleteError,
}) {
  const [showCreate, setShowCreate] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      space_number: "",
      space_type: "standard",
    },
  });

  const onSubmit = (values) => {
    onCreate(values);
    reset();
    setShowCreate(false);
  };

  return (
    <section className="w-full rounded-lg border bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Parking mjesta</h3>
        <Button type="button" onClick={() => setShowCreate((prev) => !prev)}>
          {showCreate ? "Odustani" : "Dodaj novo mjesto"}
        </Button>
      </div>

      {(createError || updateError || deleteError) && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {createError || updateError || deleteError}
        </div>
      )}

      {showCreate && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-4"
        >
          <div className="flex flex-col gap-1 text-sm">
            <label>Broj mjesta</label>
            <input
              type="text"
              className={`rounded border px-3 py-2 ${
                errors.space_number ? "border-red-500" : "border-slate-200"
              }`}
              {...register("space_number", {
                required: "Broj je obavezan",
                maxLength: { value: 10, message: "Maksimalno 10 znakova" },
                pattern: {
                  value: /^[A-Za-z0-9-]+$/,
                  message: "Dozvoljena su slova, brojevi i -",
                },
              })}
            />
            {errors.space_number && (
              <span className="text-xs text-red-600">
                {errors.space_number.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1 text-sm">
            <label>Tip mjesta</label>
            <select
              className={`rounded border px-3 py-2 ${
                errors.space_type ? "border-red-500" : "border-slate-200"
              }`}
              {...register("space_type", { required: "Tip je obavezan" })}
            >
              <option value="standard">standard</option>
              <option value="disabled">disabled</option>
              <option value="ev">ev</option>
            </select>
            {errors.space_type && (
              <span className="text-xs text-red-600">
                {errors.space_type.message}
              </span>
            )}
          </div>
          <div className="flex items-end gap-2 md:col-span-2">
            <Button type="submit" disabled={isCreating}>
              Spremi
            </Button>
          </div>
        </form>
      )}

      <div className="flex flex-col gap-3">
        {spaces.length === 0 ? (
          <div className="text-sm text-slate-500">Nema mjesta za prikaz.</div>
        ) : (
          spaces.map((space) => (
            <ParkingSpaceRow
              key={space.id}
              space={space}
              onUpdate={onUpdate}
              onDelete={onDelete}
              isUpdating={updatingId === space.id}
              isDeleting={deletingId === space.id}
            />
          ))
        )}
      </div>
    </section>
  );
}
