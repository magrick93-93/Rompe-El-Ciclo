import { Handler } from "@netlify/functions";

const SYSTEM_PROMPT = "Eres la Guía Rompe El Ciclo, asistente del programa anti-atracones de 21 días. Hablas español, en femenino por defecto, con tono cálido, empático y cercano. Ayuda a la usuaria a manejar impulsos, reflexionar sobre sus hábitos y avanzar en su proceso sin emitir juicios. REQUISITO ESTRICTO: Nunca utilices asteriscos, negritas, cursivas ni ningún formato de Markdown en tus respuestas. Escribe todo en texto plano continuo.";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  // Verificamos cualquiera de las variantes de la llave para asegurarnos de que la tome
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.VITE_MI_LLAVE_SECRETA;
  
  if (!apiKey) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: "Falta configurar la llave de Gemini en Netlify" }) 
    };
  }

  try {
    const bodyData = JSON.parse(event.body || "{}");
    const messages = bodyData.messages || [];

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
          ...messages.map((m: any) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }]
          }))
        ]
      })
    });

    const data = await res.json();
    
    if (!res.ok) {
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: data.error?.message || "Error desde Google API" }) 
      };
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "No pude responder ahora mismo";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply })
    };
  } catch (error: any) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: error.message || "Error interno del servidor" }) 
    };
  }
};
