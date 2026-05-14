import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";

export default function ParkingSpaceRow({
  space,
  onUpdate,
  onDelete,
  isUpdating,
  isDeleting,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      space_number: space.space_number ?? "",
      space_type: space.space_type ?? "standard",
    },
  });

  useEffect(() => {
    reset({
      space_number: space.space_number ?? "",
      space_type: space.space_type ?? "standard",
    });
  }, [space, reset]);

  const onSubmit = (values) => {
    onUpdate(space.id, values);
    setIsEditing(false);
  };

  return (
    <div className="grid grid-cols-1 items-center gap-3 rounded border p-3 md:grid-cols-4">
      {isEditing ? (
        <>
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
          <div className="flex gap-2 md:col-span-2 md:justify-end">
            <Button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isUpdating}
            >
              Spremi
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setIsEditing(false);
              }}
            >
              Odustani
            </Button>
          </div>
        </>
      ) : (
        <>
          <div>
            <div className="text-xs text-slate-500">Broj mjesta</div>
            <div className="font-medium">{space.space_number}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Tip mjesta</div>
            <div className="font-medium">{space.space_type}</div>
          </div>
          <div className="flex gap-2 md:col-span-2 md:justify-end">
            <Button type="button" onClick={() => setIsEditing(true)}>
              Uredi
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => onDelete(space.id)}
              disabled={isDeleting}
            >
              Obriši
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
