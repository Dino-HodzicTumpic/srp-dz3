import React from "react";
import { useNavigate } from "react-router-dom";
import { useParkings } from "@/hooks/useParkings";
import { Button } from "../components/ui/button";
import ParkingTable from "@/components/parking/ParkingsTable";

export default function ParkingsListPage() {
  const { data: parkings, isLoading, isError, error } = useParkings();
  const navigate = useNavigate();

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
    <div className="flex flex-col gap-4 items-center mt-8 mx-auto w-3/4 ">
      <h2 className="font-bold">Parkinzi</h2>
      <div className="flex justify-start w-full">
        <Button variant="default" onClick={handleAddParking}>
          Dodaj novi parking
        </Button>
      </div>

      <ParkingTable parkings={parkings} />
    </div>
  );
}
