import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { NIGHT_RITUAL, SNACK_TABS } from "@/lib/program";

export const Route = createFileRoute("/snacks")({
  head: () => ({
    meta: [
      { title: "Snacks Anti-Ansiedad — Rompe El Ciclo" },
      {
        name: "description",
        content:
          "Opciones inteligentes por tipo de antojo: dulce, salado, crujiente y nocturno (Bono 1).",
      },
      { property: "og:title", content: "Snacks Anti-Ansiedad — Rompe El Ciclo" },
      {
        property: "og:description",
        content: "Nunca te quedes sin opciones: snacks por tipo de antojo.",
      },
    ],
  }),
  component: Snacks,
});

function Snacks() {
  const [tab, setTab] = useState<string>(SNACK_TABS[0].id);
  const [query, setQuery] = useState("");

  const active = SNACK_TABS.find((t) => t.id === tab) ?? SNACK_TABS[0];
  const results = query.trim()
    ? SNACK_TABS.flatMap((t) =>
        t.items
          .filter((i) => i.toLowerCase().includes(query.trim().toLowerCase()))
          .map((i) => ({ item: i, tab: t.label })),
      )
    : null;

  return (
    <div>
      <PageHeader
        title="Snacks anti-ansiedad"
        description="Lista práctica por tipo de antojo para que nunca estés sin opciones inteligentes."
      />

      <div className="px-5">
        <div className="flex items-center gap-2 rounded-2xl border border-input bg-card px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar snack…"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      {results ? (
        <ul className="mt-5 space-y-2 px-5">
          {results.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin resultados para "{query}".</p>
          ) : (
            results.map((r) => (
              <li key={r.item} className="card-soft p-4">
                <p className="text-sm font-medium">{r.item}</p>
                <p className="text-xs text-muted-foreground">Antojo {r.tab.toLowerCase()}</p>
              </li>
            ))
          )}
        </ul>
      ) : (
        <>
          <div className="mt-5 flex gap-2 overflow-x-auto px-5 pb-1">
            {SNACK_TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`shrink-0 rounded-full px-4 py-2.5 text-xs font-semibold transition-colors ${
                  tab === t.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {t.emoji} {t.label}
              </button>
            ))}
          </div>

          <ul className="mt-4 space-y-2 px-5">
            {active.items.map((item) => (
              <li key={item} className="card-soft p-4 text-sm font-medium">
                {item}
              </li>
            ))}
          </ul>

          {tab === "nocturno" ? (
            <section className="mt-8 px-5">
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Ritual nocturno de 10 minutos
              </h2>
              <div className="mt-3 space-y-3">
                {NIGHT_RITUAL.map((r, i) => (
                  <div key={r.title} className="card-soft flex gap-3 p-4">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{r.title}</p>
                      <p className="text-xs leading-relaxed text-muted-foreground">{r.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}
