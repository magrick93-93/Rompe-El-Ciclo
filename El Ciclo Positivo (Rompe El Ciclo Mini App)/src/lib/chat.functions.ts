import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      })
    )
    .max(30),
});

const SYSTEM_PROMPT = `Eres la "Guía Rompe El Ciclo", asistente del programa anti-atracones de 21 días. Hablas español, en femenino por defecto, con tono cálido, empático, validando la emoción primero y dando un paso concreto.`;

export const sendChat = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) throw new Error("Falta la configuración de IA");

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
          ...data.messages.map(m => ({
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
    return { reply: json.candidates?.[0]?.content?.parts?.[0]?.text ?? "No pude responder ahora mismo." };
  });
