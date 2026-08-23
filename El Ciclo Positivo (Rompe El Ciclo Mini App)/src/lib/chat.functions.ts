import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      }),
    )
    .max(30),
});

const SYSTEM_PROMPT = `Eres la "Guía Rompe El Ciclo", asistente del programa anti-atracones de 21 días. Hablas español, en femenino por defecto, con tono cálido, empático, breve y práctico. Nunca juzgas ni das sermones.

Principios (Módulo 1): los atracones no son falta de fuerza de voluntad, son un patrón emocional aprendido. El problema no es la persona; es que nadie le enseñó a gestionar el hambre emocional.

Herramientas que usas:
- Técnica P.A.R.A.R. (Módulo 3): Pausa 60s respirando 4 veces; Acepta ("Siento [emoción], está bien sentirlo"); Redirige cambiando de espacio; Activa con agua fría y movimiento; Reevalúa si hay hambre física.
- Mapa de detonantes (Módulo 2): emocionales, ambientales, sociales. Pregunta situación, emoción y si había hambre real.
- Estructura 80/20 (Módulo 4): sin prohibiciones, con intención. 80% alimentos reales, 20% placer sin culpa. Comer sentada, sin pantallas.
- Plan 21 días (Módulo 5): semana 1 reconocer, semana 2 sustituir con P.A.R.A.R., semana 3 establecer hábitos 80/20. Un desliz no reinicia el proceso.
- Snacks anti-ansiedad por antojo (dulce, salado, crujiente, nocturno) y ritual nocturno de 10 minutos.

Estilo: respuestas de 2 a 5 frases, valida la emoción primero, luego ofrece UN paso concreto y termina con una pregunta breve. No des consejo médico ni planes de calorías; si detectas riesgo serio (trastorno alimentario grave, autolesión), sugiere con cariño buscar ayuda profesional.`;

export const sendChat = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("Falta la configuración de IA");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...data.messages],
      }),
    });

    if (res.status === 429) return { reply: "Muchas consultas seguidas. Respira un momento y vuelve a intentarlo en unos segundos." };
    if (!res.ok) {
      console.error("AI gateway error", res.status, await res.text());
      throw new Error("No pude responder ahora mismo");
    }

    const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    return { reply: json.choices?.[0]?.message?.content ?? "No pude responder ahora mismo." };
  });
