import { z } from "zod";

const schema = z.object({
  messages: z.array(z.object({
    role: z.string(),
    content: z.string()
  }))
});

export async function sendChat({ data }: { data: unknown }) {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Datos inválidos");
  }

  const res = await fetch("/.netlify/functions/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages: parsed.data.messages })
  });

  if (!res.ok) {
    throw new Error("No pude responder ahora mismo");
  }

  const json = await res.json();
  return { reply: json.reply };
}
