import { z } from "zod";

const schema = z.object({
  messages: z.array(z.object({
    role: z.string(),
    content: z.string()
  }))
});

const SYSTEM_PROMPT = `Eres la Guía Rompe El Ciclo, asistente del programa anti-atracones de 21 días. Hablas español, en femenino por defecto, con tono cálido, empático y cercano. Ayuda a la usuaria a manejar impulsos, reflexionar sobre sus hábitos y avanzar en su proceso sin emitir juicios. REQUISITO ESTRICTO: Nunca utilices asteriscos, negritas, cursivas ni ningún formato de Markdown en tus respuestas. Escribe todo en texto plano continuo.`;

export async function sendChat({ data }: { data: unknown }) {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Datos inválidos");
  }

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("Falta la configuración de IA");

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
        ...parsed.data.messages.map(m => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }]
        }))
      ]
    })
  });

  if (res.status === 429) return { reply: "Muchas consultas seguidas. Respira un momento y vuelve a intentarlo en unos segundos." };
  if (!res.ok) {
    console.error("AI gateway error", res.status, await res.text());
    throw new Error("No pude responder ahora mismo");
  }

  const json = await res.json();
  return { reply: json.candidates?.[0]?.content?.parts?.[0]?.text ?? "No pude responder ahora mismo" };
}
