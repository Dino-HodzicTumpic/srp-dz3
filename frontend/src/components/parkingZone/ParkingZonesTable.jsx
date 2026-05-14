import React from "react";
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

export default function ParkingZonesTable({
  zones,
  onEdit,
  onDelete,
  deletingId,
}) {
  return (
    <Table>
      <TableCaption>Lista svih parking zona</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>Naziv</TableHead>
          <TableHead>Cijena/sat</TableHead>
          <TableHead>Opis</TableHead>
          <TableHead>Akcije</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {zones.map((zone) => (
          <TableRow key={zone.id}>
            <TableCell>{zone.id}</TableCell>
            <TableCell>{zone.name}</TableCell>
            <TableCell>{Number(zone.price_per_hour).toFixed(2)}</TableCell>
            <TableCell>{zone.description || "-"}</TableCell>
            <TableCell>
              <Button
                variant="default"
                className="bg-yellow-600"
                onClick={() => onEdit(zone)}
              >
                Uredi
              </Button>
              <Button
                variant="default"
                className="bg-red-600"
                onClick={() => onDelete(zone.id)}
                disabled={deletingId === zone.id}
              >
                {deletingId === zone.id ? "Brisanje..." : "Obrisi"}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
