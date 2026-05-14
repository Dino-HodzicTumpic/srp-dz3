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

const formatDateTime = (value) => {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }
  return date.toLocaleString();
};

export default function ReservationsTable({
  reservations,
  onEdit,
  onDelete,
  deletingId,
}) {
  return (
    <Table>
      <TableCaption>Lista rezervacija</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>Korisnik</TableHead>
          <TableHead>Vozilo</TableHead>
          <TableHead>Parking</TableHead>
          <TableHead>Mjesto</TableHead>
          <TableHead>Pocetak</TableHead>
          <TableHead>Kraj</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Akcije</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reservations.map((reservation) => (
          <TableRow key={reservation.id}>
            <TableCell>{reservation.id}</TableCell>
            <TableCell>
              {reservation.users?.name || "-"}
              {reservation.users?.email ? ` (${reservation.users.email})` : ""}
            </TableCell>
            <TableCell>{reservation.vehicles?.license_plate || "-"}</TableCell>
            <TableCell>
              {reservation.parkingspaces?.parkings?.name || "-"}
            </TableCell>
            <TableCell>
              {reservation.parkingspaces?.space_number || "-"}
            </TableCell>
            <TableCell>{formatDateTime(reservation.start_time)}</TableCell>
            <TableCell>{formatDateTime(reservation.end_time)}</TableCell>
            <TableCell>{reservation.status}</TableCell>
            <TableCell>
              <Button
                variant="default"
                className="bg-yellow-600"
                onClick={() => onEdit(reservation)}
              >
                Uredi
              </Button>
              <Button
                variant="default"
                className="bg-red-600"
                onClick={() => onDelete(reservation.id)}
                disabled={deletingId === reservation.id}
              >
                {deletingId === reservation.id ? "Brisanje..." : "Obrisi"}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
