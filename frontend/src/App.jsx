import "./App.css";
import ParkingsListPage from "./pages/ParkingsListPage";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import ParkingMasterDetailPage from "./pages/ParkingMasterDetailPage";
import ParkingZonesPage from "./pages/ParkingZonesPage";
import ReservationsPage from "./pages/ReservationsPage";
import Navbar from "./components/shared/Navbar";

function App() {
  return (
    <div className="relative min-h-screen">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<ParkingsListPage />} />
          <Route path="/parkings" element={<ParkingsListPage />} />
          <Route path="/parkings/new" element={<ParkingMasterDetailPage />} />
          <Route path="/parkings/:id" element={<ParkingMasterDetailPage />} />
          <Route path="/parking-zones" element={<ParkingZonesPage />} />
          <Route path="/reservations" element={<ReservationsPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
