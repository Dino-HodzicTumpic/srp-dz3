import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParkings } from "@/hooks/useParkings";
import { Button } from "../components/ui/button";
import ParkingTable from "@/components/parking/ParkingsTable";

export default function ParkingsListPage() {
  const { data: parkings, isLoading, isError, error } = useParkings();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filteredParkings = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = parkings ?? [];
    if (!term) {
      return list;
    }
    return list.filter((parking) => {
      const zoneName = parking.parkingzones?.name ?? "";
      const name = parking.name ?? "";
      const location = parking.location ?? "";
      const totalSpaces = Array.isArray(parking.parkingspaces)
        ? parking.parkingspaces.length
        : (parking.total_spaces ?? 0);

      return [zoneName, name, location, String(totalSpaces)]
        .join(" ")
        .toLowerCase()
        .includes(term);
    });
  }, [parkings, search]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  const handleAddParking = () => {
    navigate("/parkings/new");
  };

  return (
    <div className="mx-auto mt-8 flex w-3/4 flex-col gap-4 items-center">
      <div className="flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="font-bold">Parkinzi</h2>
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Pretrazi po nazivu, lokaciji, zoni"
          className="w-full rounded border border-slate-200 px-3 py-2 text-sm md:w-80"
        />
      </div>
      <div className="flex justify-start w-full">
        <Button variant="default" onClick={handleAddParking}>
          Dodaj novi parking
        </Button>
      </div>

      <ParkingTable parkings={filteredParkings} />
    </div>
  );
}
