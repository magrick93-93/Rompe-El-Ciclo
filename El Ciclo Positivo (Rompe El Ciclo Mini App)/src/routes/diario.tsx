import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { EMOTIONS, TRIGGER_TYPES } from "@/lib/program";
import { useTriggers, type TriggerEntry } from "@/lib/storage";

export const Route = createFileRoute("/diario")({
  head: () => ({
    meta: [
      { title: "Diario de Detonantes — Rompe El Ciclo" },
      {
        name: "description",
        content:
          "Registra situación, emoción y hambre real para descubrir tus patrones en 7 días (Módulo 2).",
      },
      { property: "og:title", content: "Diario de Detonantes — Rompe El Ciclo" },
      {
        property: "og:description",
        content: "Tu mapa de detonantes emocionales, ambientales y sociales.",
      },
    ],
  }),
  component: Diario,
});

const HUNGER = [
  { id: "si", label: "Sí" },
  { id: "no", label: "No" },
  { id: "no-segura", label: "No segura" },
] as const;

function Diario() {
  const [entries, setEntries] = useTriggers();
  const [situation, setSituation] = useState("");
  const [emotions, setEmotions] = useState<string[]>([]);
  const [type, setType] = useState<string>("emocional");
  const [ate, setAte] = useState("");
  const [hunger, setHunger] = useState<TriggerEntry["realHunger"]>("no");
  const [usedParar, setUsedParar] = useState(false);

  const save = () => {
    if (!situation.trim() || emotions.length === 0) {
      toast.error("Cuéntame la situación y al menos una emoción.");
      return;
    }
    const entry: TriggerEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      situation: situation.trim(),
      emotions,
      type,
      ate: ate.trim(),
      realHunger: hunger,
      usedParar,
    };
    setEntries((prev) => [entry, ...prev]);
    setSituation("");
    setEmotions([]);
    setAte("");
    setUsedParar(false);
    toast.success("Registro guardado. Cada dato acerca tu patrón a la luz.");
  };

  return (
    <div>
      <PageHeader
        title="Tu mapa de detonantes"
        description="Completa este registro durante 7 días. Los patrones aparecerán solos — y eso lo cambia todo."
      />

      <section className="mx-5 card-soft space-y-5 p-5">
        <Field label="¿Qué situación viviste?">
          <textarea
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            rows={2}
            placeholder="Llegué del trabajo agotada…"
            className="w-full resize-none rounded-xl border border-input bg-background p-3 text-sm outline-none focus:border-primary"
          />
        </Field>

        <Field label="¿Qué emoción sentí?">
          <div className="flex flex-wrap gap-2">
            {EMOTIONS.map((e) => {
              const active = emotions.includes(e);
              return (
                <button
                  key={e}
                  type="button"
                  onClick={() =>
                    setEmotions((prev) =>
                      prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e],
                    )
                  }
                  className={`rounded-full px-3.5 py-2 text-xs font-semibold transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {e}
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="Tipo de detonante">
          <div className="grid grid-cols-3 gap-2">
            {TRIGGER_TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setType(t.id)}
                className={`rounded-xl px-2 py-3 text-xs font-semibold transition-colors ${
                  type === t.id ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {TRIGGER_TYPES.find((t) => t.id === type)?.hint}
          </p>
        </Field>

        <Field label="¿Qué comí?">
          <input
            value={ate}
            onChange={(e) => setAte(e.target.value)}
            placeholder="Pan con mantequilla…"
            className="w-full rounded-xl border border-input bg-background p-3 text-sm outline-none focus:border-primary"
          />
        </Field>

        <Field label="¿Tenía hambre real?">
          <div className="grid grid-cols-3 gap-2">
            {HUNGER.map((h) => (
              <button
                key={h.id}
                type="button"
                onClick={() => setHunger(h.id)}
                className={`rounded-xl px-2 py-3 text-xs font-semibold transition-colors ${
                  hunger === h.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {h.label}
              </button>
            ))}
          </div>
        </Field>

        <label className="flex items-center justify-between rounded-xl bg-muted px-4 py-3 text-sm font-medium">
          ¿Usé P.A.R.A.R.?
          <input
            type="checkbox"
            checked={usedParar}
            onChange={(e) => setUsedParar(e.target.checked)}
            className="h-5 w-5 accent-[oklch(0.58_0.062_155)]"
          />
        </label>

        <button
          type="button"
          onClick={save}
          className="w-full rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground"
        >
          Guardar registro
        </button>
      </section>

      <section className="mt-8 px-5">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Tus registros ({entries.length})
        </h2>
        {entries.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Aún no hay registros. El primero es el más valioso.
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {entries.map((e) => (
              <li key={e.id} className="card-soft p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">
                      {new Date(e.date).toLocaleString("es", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="mt-1 text-sm font-medium">{e.situation}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {e.emotions.join(" · ")} · hambre real:{" "}
                      {HUNGER.find((h) => h.id === e.realHunger)?.label}
                      {e.ate ? ` · ${e.ate}` : ""}
                      {e.usedParar ? " · P.A.R.A.R. ✓" : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label="Eliminar registro"
                    onClick={() => setEntries((prev) => prev.filter((x) => x.id !== e.id))}
                    className="shrink-0 text-muted-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold">{label}</p>
      {children}
    </div>
  );
}
