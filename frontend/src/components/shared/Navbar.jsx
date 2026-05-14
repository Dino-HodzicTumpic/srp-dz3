import { Link, NavLink } from "react-router-dom";
import { Button } from "../ui/button";

// Nav Links
const NAV_LINKS = [
  { label: "Parkinzi", href: "/parkings" },
  { label: "Parking zone", href: "/parking-zones" },
  { label: "Rezervacije", href: "/reservations" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="mx-auto flex h-16 w-11/12 max-w-6xl items-center justify-between">
        <Link to="/parkings" className="text-lg font-semibold">
          Parking App
        </Link>

        <nav className="hidden items-center gap-3 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                `rounded px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          {NAV_LINKS.map((link) => (
            <Button key={link.href} variant="outline" size="sm" asChild>
              <Link to={link.href}>{link.label}</Link>
            </Button>
          ))}
        </div>
      </div>
    </header>
  );
}
