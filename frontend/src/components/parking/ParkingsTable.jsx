import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import { Button } from "../ui/button";
import { deleteParking } from "@/api/parkingApi";

export default function ParkingsTable({ parkings }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const getTotalSpaces = (parking) => {
    if (Array.isArray(parking.parkingspaces)) {
      return parking.parkingspaces.length;
    }
    return parking.total_spaces ?? 0;
  };

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteParking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parkings"] });
    },
  });

  const handleDetails = (id) => {
    navigate(`/parkings/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/parkings/${id}`);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Jeste li sigurni da zelite obrisati ovaj parking?",
    );
    if (!confirmed) {
      return;
    }
    deleteMutation.mutate(id);
  };

  return (
    <Table>
      <TableCaption>Lista svih parkinga</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>Zona</TableHead>
          <TableHead>Naziv</TableHead>
          <TableHead>Lokacija</TableHead>
          <TableHead>Ukupno mjesta</TableHead>
          <TableHead>Akcije</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {parkings.map((parking) => (
          <TableRow key={parking.id}>
            <TableCell>{parking.id}</TableCell>
            <TableCell>{parking.parkingzones.name}</TableCell>
            <TableCell>{parking.name}</TableCell>
            <TableCell>{parking.location}</TableCell>
            <TableCell>{getTotalSpaces(parking)}</TableCell>
            <TableCell>
              <Button
                variant="default"
                className="bg-green-600"
                onClick={() => handleDetails(parking.id)}
              >
                Detalji
              </Button>
              <Button
                variant="default"
                className="bg-yellow-600"
                onClick={() => handleEdit(parking.id)}
              >
                Uredi
              </Button>
              <Button
                variant="default"
                className="bg-red-600"
                onClick={() => handleDelete(parking.id)}
                disabled={
                  deleteMutation.isPending &&
                  deleteMutation.variables === parking.id
                }
              >
                {deleteMutation.isPending &&
                deleteMutation.variables === parking.id
                  ? "Brisanje..."
                  : "Obriši"}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
