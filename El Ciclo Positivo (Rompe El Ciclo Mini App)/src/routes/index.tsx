import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Moon, Sunrise } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { MORNING_TASKS, NIGHT_TASKS, WEEKS } from "@/lib/program";
import { currentDay, dayIsComplete, emptyDay, useProgress, useStartDate } from "@/lib/storage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Plan de 21 Días — Rompe El Ciclo" },
      {
        name: "description",
        content:
          "Tu dashboard diario del método Rompe El Ciclo: checklist de mañana y noche durante 21 días.",
      },
      { property: "og:title", content: "Plan de 21 Días — Rompe El Ciclo" },
      {
        property: "og:description",
        content: "Checklist diario de mañana y noche para romper el ciclo del atracón.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [progress, setProgress] = useProgress();
  const [start] = useStartDate();
  const today = currentDay(start);
  const day = progress[String(today)] ?? emptyDay();
  const completedDays = WEEKS.flatMap((w) => w.days).filter((d) =>
    dayIsComplete(progress[String(d)]),
  ).length;
  const doneToday = [...day.morning, ...day.night].filter(Boolean).length;

  const toggle = (block: "morning" | "night", index: number) => {
    setProgress((prev) => {
      const key = String(today);
      const base = prev[key] ?? emptyDay();
      const next = { ...base, [block]: base[block].map((v, i) => (i === index ? !v : v)) };
      return { ...prev, [key]: next };
    });
  };

  const week = WEEKS.find((w) => w.days.includes(today as never)) ?? WEEKS[0];

  return (
    <div>
      <PageHeader title={`Día ${today} de 21`} description={week.subtitle} />

      <section className="mx-5 rounded-3xl bg-gradient-calm p-5 shadow-[var(--shadow-soft)]">
        <div className="flex items-center justify-between text-sm font-medium text-secondary-foreground">
          <span>Progreso del plan</span>
          <span>{completedDays}/21 días</span>
        </div>
        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-card/70">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${(completedDays / 21) * 100}%` }}
          />
        </div>
        <p className="mt-3 text-xs text-secondary-foreground">
          Hoy llevas {doneToday} de 6 acciones. No se trata de ser perfecta, sino consistente.
        </p>
      </section>

      <Block
        icon={<Sunrise className="h-4 w-4" />}
        title="Por la mañana"
        tasks={MORNING_TASKS}
        state={day.morning}
        onToggle={(i) => toggle("morning", i)}
      />
      <Block
        icon={<Moon className="h-4 w-4" />}
        title="Por la noche"
        tasks={NIGHT_TASKS}
        state={day.night}
        onToggle={(i) => toggle("night", i)}
      />

      <section className="mt-6 px-5">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Calendario
        </h2>
        <div className="mt-3 space-y-4">
          {WEEKS.map((w) => (
            <div key={w.week} className="card-soft p-4">
              <p className="text-sm font-semibold">
                Semana {w.week} · {w.title}
              </p>
              <p className="text-xs text-muted-foreground">{w.subtitle}</p>
              <div className="mt-3 grid grid-cols-7 gap-2">
                {w.days.map((d) => {
                  const done = dayIsComplete(progress[String(d)]);
                  return (
                    <div
                      key={d}
                      className={`grid aspect-square place-items-center rounded-xl text-xs font-semibold ${
                        done
                          ? "bg-primary text-primary-foreground"
                          : d === today
                            ? "border-2 border-primary text-primary"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {done ? <Check className="h-4 w-4" /> : d}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-6 px-5">
        <Link
          to="/diario"
          className="flex items-center justify-between rounded-2xl bg-secondary px-5 py-4 text-sm font-semibold text-secondary-foreground"
        >
          Registrar un detonante de hoy
          <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}

function Block({
  icon,
  title,
  tasks,
  state,
  onToggle,
}: {
  icon: React.ReactNode;
  title: string;
  tasks: string[];
  state: boolean[];
  onToggle: (i: number) => void;
}) {
  return (
    <section className="mt-6 px-5">
      <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {icon}
        {title}
      </h2>
      <ul className="mt-3 space-y-2">
        {tasks.map((task, i) => (
          <li key={task}>
            <button
              type="button"
              onClick={() => onToggle(i)}
              aria-pressed={state[i]}
              className="card-soft flex w-full items-center gap-3 p-4 text-left"
            >
              <span
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-colors ${
                  state[i] ? "border-primary bg-primary text-primary-foreground" : "border-border"
                }`}
              >
                {state[i] ? <Check className="h-3.5 w-3.5" /> : null}
              </span>
              <span
                className={`min-w-0 text-sm ${state[i] ? "text-muted-foreground line-through" : ""}`}
              >
                {task}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
