import { Link } from "@tanstack/react-router";
import { CalendarCheck, NotebookPen, LifeBuoy, Apple, MessageCircleHeart } from "lucide-react";

const items = [
  { to: "/", label: "Plan", icon: CalendarCheck },
  { to: "/diario", label: "Diario", icon: NotebookPen },
  { to: "/sos", label: "SOS", icon: LifeBuoy, highlight: true },
  { to: "/snacks", label: "Snacks", icon: Apple },
  { to: "/apoyo", label: "Apoyo", icon: MessageCircleHeart },
];

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur">
      <ul className="mx-auto grid max-w-md grid-cols-5 px-1 pb-[env(safe-area-inset-bottom)]">
        {items.map(({ to, label, icon: Icon, highlight }) => (
          <li key={to}>
            <Link
              to={to}
              activeOptions={{ exact: to === "/" }}
              activeProps={{ "data-active": "true" }}
              className="group flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground data-[active=true]:text-primary"
            >
              <span
                className={
                  highlight
                    ? "grid h-9 w-9 place-items-center rounded-full bg-gradient-sos text-sos-foreground shadow-[var(--shadow-soft)]"
                    : "grid h-9 w-9 place-items-center rounded-full transition-colors group-data-[active=true]:bg-secondary"
                }
              >
                <Icon className="h-5 w-5" strokeWidth={1.9} />
              </span>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
