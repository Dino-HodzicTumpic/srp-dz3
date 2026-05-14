import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createParking,
  createParkingSpace,
  deleteParking,
  deleteParkingSpace,
  getParkingById,
  getParkingZones,
  getParkingSpaces,
  updateParking,
  updateParkingSpace,
} from "@/api/parkingApi";
import ParkingMasterForm from "@/components/parking/ParkingMasterForm";
import ParkingSpaces from "@/components/parking/ParkingSpaces";

export default function ParkingMasterDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNew = id === "new" || !id;

  const {
    data: parking,
    isLoading: isParkingLoading,
    isError: isParkingError,
    error: parkingError,
  } = useQuery({
    queryKey: ["parking", id],
    queryFn: () => getParkingById(id),
    enabled: Boolean(id) && !isNew,
  });

  const {
    data: spaces = [],
    isLoading: isSpacesLoading,
    isError: isSpacesError,
    error: spacesError,
  } = useQuery({
    queryKey: ["parkingSpaces", id],
    queryFn: () => getParkingSpaces(id),
    enabled: Boolean(id) && !isNew,
  });

  const {
    data: zones = [],
    isLoading: isZonesLoading,
    isError: isZonesError,
    error: zonesError,
  } = useQuery({
    queryKey: ["parkingZones"],
    queryFn: () => getParkingZones(),
  });

  const updateParkingMutation = useMutation({
    mutationFn: (payload) => updateParking(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parking", id] });
      queryClient.invalidateQueries({ queryKey: ["parkings"] });
    },
  });

  const createParkingMutation = useMutation({
    mutationFn: (payload) => createParking(payload),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ["parkings"] });
      if (created?.id) {
        navigate(`/parkings/${created.id}`);
      } else {
        navigate("/parkings");
      }
    },
  });

  const deleteParkingMutation = useMutation({
    mutationFn: () => deleteParking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parkings"] });
      navigate("/parkings");
    },
  });

  const createSpaceMutation = useMutation({
    mutationFn: (payload) => createParkingSpace(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parkingSpaces", id] });
    },
  });

  const updateSpaceMutation = useMutation({
    mutationFn: ({ spaceId, payload }) => updateParkingSpace(spaceId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parkingSpaces", id] });
    },
  });

  const deleteSpaceMutation = useMutation({
    mutationFn: (spaceId) => deleteParkingSpace(spaceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parkingSpaces", id] });
    },
  });

  const getErrorMessage = (error) => {
    if (!error) {
      return null;
    }
    return (
      error?.response?.data?.error || error?.message || "Dogodila se greska."
    );
  };

  if (!isNew && isParkingLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!isNew && isParkingError) {
    return <div className="p-6">Error: {parkingError.message}</div>;
  }

  return (
    <div className="mx-auto flex w-11/12 max-w-5xl flex-col gap-6 py-8">
      <ParkingMasterForm
        parking={parking}
        zones={zones}
        zonesLoading={isZonesLoading}
        onSave={(values) =>
          isNew
            ? createParkingMutation.mutate(values)
            : updateParkingMutation.mutate(values)
        }
        onDelete={() => deleteParkingMutation.mutate()}
        isSaving={
          isNew
            ? createParkingMutation.isPending
            : updateParkingMutation.isPending
        }
        isDeleting={deleteParkingMutation.isPending}
        canDelete={!isNew}
        saveError={
          isNew
            ? createParkingMutation.isError
              ? getErrorMessage(createParkingMutation.error)
              : isZonesError
                ? getErrorMessage(zonesError)
                : null
            : updateParkingMutation.isError
              ? getErrorMessage(updateParkingMutation.error)
              : isZonesError
                ? getErrorMessage(zonesError)
                : null
        }
        deleteError={
          deleteParkingMutation.isError
            ? getErrorMessage(deleteParkingMutation.error)
            : null
        }
      />

      {!isNew && (
        <>
          {isSpacesLoading && (
            <div className="text-sm text-slate-500">Loading...</div>
          )}
          {isSpacesError && (
            <div className="text-sm text-red-600">
              Error: {spacesError.message}
            </div>
          )}
          {!isSpacesLoading && !isSpacesError && (
            <ParkingSpaces
              spaces={spaces}
              onCreate={(values) =>
                createSpaceMutation.mutate({
                  ...values,
                  parking_id: Number(id),
                })
              }
              onUpdate={(spaceId, values) =>
                updateSpaceMutation.mutate({ spaceId, payload: values })
              }
              onDelete={(spaceId) => deleteSpaceMutation.mutate(spaceId)}
              isCreating={createSpaceMutation.isPending}
              updatingId={
                updateSpaceMutation.isPending
                  ? updateSpaceMutation.variables?.spaceId
                  : null
              }
              deletingId={
                deleteSpaceMutation.isPending
                  ? deleteSpaceMutation.variables
                  : null
              }
              createError={
                createSpaceMutation.isError
                  ? getErrorMessage(createSpaceMutation.error)
                  : null
              }
              updateError={
                updateSpaceMutation.isError
                  ? getErrorMessage(updateSpaceMutation.error)
                  : null
              }
              deleteError={
                deleteSpaceMutation.isError
                  ? getErrorMessage(deleteSpaceMutation.error)
                  : null
              }
            />
          )}
        </>
      )}
    </div>
  );
}
