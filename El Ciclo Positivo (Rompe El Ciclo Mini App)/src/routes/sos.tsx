import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Play, RotateCcw } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { PARAR_STEPS } from "@/lib/program";

export const Route = createFileRoute("/sos")({
  head: () => ({
    meta: [
      { title: "SOS P.A.R.A.R. — Rompe El Ciclo" },
      {
        name: "description",
        content:
          "Protocolo anti-atracón de 5 minutos con temporizador y respiración guiada: Pausa, Acepta, Redirige, Activa, Reevalúa.",
      },
      { property: "og:title", content: "SOS P.A.R.A.R. — Rompe El Ciclo" },
      {
        property: "og:description",
        content: "Interrumpe el impulso en 60 segundos con la técnica P.A.R.A.R.",
      },
    ],
  }),
  component: Sos,
});

function Sos() {
  const [phase, setPhase] = useState<"idle" | "breathe" | "steps">("idle");
  const [step, setStep] = useState(0);
  const [seconds, setSeconds] = useState<number>(60);
  const [done, setDone] = useState(false);

  const active = phase !== "idle";

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [active, phase, step]);

  useEffect(() => {
    if (phase === "breathe" && seconds === 0) {
      setPhase("steps");
      setStep(0);
      setSeconds(PARAR_STEPS[0]?.seconds ?? 60);
    }
  }, [phase, seconds]);

  const start = () => {
    setDone(false);
    setStep(0);
    setSeconds(60);
    setPhase("breathe");
  };

  const next = () => {
    if (step < PARAR_STEPS.length - 1) {
      setStep(step + 1);
      setSeconds(PARAR_STEPS[step + 1]?.seconds ?? 60);
    } else {
      setPhase("idle");
      setDone(true);
    }
  };

  const reset = () => {
    setPhase("idle");
    setDone(false);
    setStep(0);
    setSeconds(60);
  };

  const current = PARAR_STEPS[step] ?? PARAR_STEPS[0];




  if (done) {
    return (
      <div className="px-5 pt-16 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-primary text-primary-foreground">
          <Check className="h-9 w-9" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold">Ya ganaste</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Pausaste el impulso. El 80% de las veces, si pausas los primeros 5 minutos, el impulso se
          disuelve solo. Si aún tienes hambre física, come conscientemente y sin culpa.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 w-full rounded-2xl bg-secondary py-3.5 text-sm font-semibold text-secondary-foreground"
        >
          Volver al inicio del protocolo
        </button>
      </div>
    );
  }

  if (!active) {
    return (
      <div>
        <PageHeader
          title="Protocolo anti-atracón"
          description="Cuando sientas el impulso, no lo ignores — actívalo. Este protocolo lo interrumpe antes de que ocurra el episodio."
        />

        <div className="px-5">
          <button
            type="button"
            onClick={start}
            className="relative grid aspect-square w-full place-items-center overflow-hidden rounded-[2.5rem] bg-gradient-sos text-sos-foreground shadow-[var(--shadow-soft)]"
          >
            <span className="absolute h-56 w-56 rounded-full bg-card/20 animate-breathe" />
            <span className="relative flex flex-col items-center gap-2">
              <Play className="h-9 w-9" />
              <span className="font-display text-3xl font-semibold">SOS</span>
              <span className="text-xs uppercase tracking-[0.24em]">Activar P.A.R.A.R.</span>
            </span>
          </button>
        </div>

        <ul className="mt-8 space-y-3 px-5 pb-4">
          {PARAR_STEPS.map((s, i) => (
            <li key={i} className="card-soft flex gap-3 p-4">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary font-display text-sm font-semibold text-secondary-foreground">
                {s.letter}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold">{s.title}</p>
                <p className="text-xs leading-relaxed text-muted-foreground">{s.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (phase === "breathe") {
    const pctB = ((60 - seconds) / 60) * 100;
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 pb-24 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
          Respira conmigo
        </p>
        <h1 className="mt-2 text-3xl font-semibold">60 segundos de pausa</h1>

        <div className="relative mt-8 grid h-64 w-64 place-items-center">
          <span className="absolute h-56 w-56 rounded-full bg-gradient-calm animate-breathe" />
          <span className="relative font-display text-6xl font-semibold tabular-nums">
            {String(seconds).padStart(2, "0")}
          </span>
        </div>

        <div className="mt-6 h-2 w-full max-w-xs overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-1000"
            style={{ width: `${pctB}%` }}
          />
        </div>

        <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
          Inhala 4 · sostén 4 · exhala 4 · sostén 4. Deja que el impulso baje antes de continuar.
        </p>

        <div className="mt-8 flex w-full max-w-xs flex-col gap-2">
          <button
            type="button"
            onClick={() => {
              setPhase("steps");
              setStep(0);
              setSeconds(PARAR_STEPS[0]?.seconds ?? 60);
            }}
            className="w-full rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground"
          >
            Ver los pasos de P.A.R.A.R.
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 py-2 text-xs font-semibold text-muted-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Cancelar
          </button>
        </div>
      </div>
    );
  }

  const total = current.seconds;
  const pct = ((total - seconds) / total) * 100;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 pb-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
        Paso {step + 1} de {PARAR_STEPS.length}
      </p>
      <h1 className="mt-2 text-3xl font-semibold">
        {current.letter} · {current.title}
      </h1>

      <div className="relative mt-8 grid h-56 w-56 place-items-center">
        <span className="absolute h-48 w-48 rounded-full bg-gradient-calm animate-breathe" />
        <span className="relative font-display text-5xl font-semibold tabular-nums">
          {String(Math.floor(seconds / 60)).padStart(2, "0")}:
          {String(seconds % 60).padStart(2, "0")}
        </span>
      </div>

      <div className="mt-6 h-2 w-full max-w-xs overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
      </div>

      <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted-foreground">{current.text}</p>
      <p className="mt-3 text-xs text-muted-foreground">Inhala 4 · sostén 4 · exhala 4 · sostén 4</p>

      <div className="mt-8 flex w-full max-w-xs flex-col gap-2">
        <button
          type="button"
          onClick={next}
          className="w-full rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground"
        >
          {step === PARAR_STEPS.length - 1 ? "Terminar protocolo" : "Siguiente paso"}
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center justify-center gap-2 py-2 text-xs font-semibold text-muted-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Cancelar
        </button>
      </div>
    </div>
  );
}
