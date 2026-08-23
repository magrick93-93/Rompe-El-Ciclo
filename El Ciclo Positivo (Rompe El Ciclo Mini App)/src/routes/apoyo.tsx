import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { SendHorizonal } from "lucide-react";
import { toast } from "sonner";
import { sendChat } from "@/lib/chat.functions";

export const Route = createFileRoute("/apoyo")({
  head: () => ({
    meta: [
      { title: "Asistente de Apoyo — Rompe El Ciclo" },
      {
        name: "description",
        content:
          "Chat empático entrenado con la psicología del Módulo 1 y la estructura flexible 80/20 del Módulo 4.",
      },
      { property: "og:title", content: "Asistente de Apoyo — Rompe El Ciclo" },
      {
        property: "og:description",
        content: "Habla con tu guía cuando el impulso aparezca. Sin juicios, con método.",
      },
    ],
  }),
  component: Apoyo,
});

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Estoy ansiosa y quiero comer",
  "Tuve un atracón anoche",
  "¿Cómo aplico el 80/20 hoy?",
];

function Apoyo() {
  const send = useServerFn(sendChat);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hola, estoy aquí contigo. No hay nada roto en ti: solo un patrón que aprendiste y que puedes reescribir. ¿Qué está pasando ahora mismo?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const submit = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await send({ data: { messages: next.slice(-12) } });
      setMessages([...next, { role: "assistant", content: res.reply }]);
    } catch {
      toast.error("No pude responder ahora. Intenta de nuevo en un momento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border px-5 pb-4 pt-8">
        <h1 className="text-2xl font-semibold">Tu guía de apoyo</h1>
      </header>

      <div className="flex-1 space-y-3 px-5 py-5">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              m.role === "user"
                ? "ml-auto bg-primary text-primary-foreground"
                : "card-soft text-card-foreground"
            }`}
          >
            {m.content}
          </div>
        ))}
        {loading ? (
          <div className="card-soft w-24 px-4 py-3 text-sm text-muted-foreground">Escribiendo…</div>
        ) : null}
        <div ref={endRef} />
      </div>

      {messages.length <= 1 ? (
        <div className="flex flex-wrap gap-2 px-5 pb-3">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => submit(s)}
              className="rounded-full bg-muted px-3.5 py-2 text-xs font-medium text-muted-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      ) : null}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submit(input);
        }}
        className="sticky bottom-20 mx-5 mb-4 flex items-center gap-2 rounded-2xl border border-input bg-card px-4 py-2.5"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Cuéntame cómo te sientes…"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none"
        />
        <button
          type="submit"
          aria-label="Enviar"
          disabled={loading}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
        >
          <SendHorizonal className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
