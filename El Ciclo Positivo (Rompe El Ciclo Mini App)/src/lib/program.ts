export const MORNING_TASKS = [
  "Escribir cómo me siento emocionalmente (1 min)",
  "Planear mis 3 comidas principales del día",
  "Definir una micro-acción anti-atracón del día",
];

export const NIGHT_TASKS = [
  "Registrar si hubo impulso o episodio",
  "Identificar el detonante emocional",
  "Celebrar cualquier pequeño avance",
];

export const WEEKS = [
  {
    week: 1,
    title: "Reconocer",
    subtitle: "Detonantes y patrones",
    days: [1, 2, 3, 4, 5, 6, 7],
  },
  {
    week: 2,
    title: "Sustituir",
    subtitle: "P.A.R.A.R. diario",
    days: [8, 9, 10, 11, 12, 13, 14],
  },
  {
    week: 3,
    title: "Establecer",
    subtitle: "Hábitos 80/20",
    days: [15, 16, 17, 18, 19, 20, 21],
  },
] as const;

export const EMOTIONS = [
  "Estrés",
  "Soledad",
  "Aburrimiento",
  "Ansiedad",
  "Tristeza",
  "Frustración",
  "Cansancio",
  "Alegría extrema",
];

export const TRIGGER_TYPES = [
  { id: "emocional", label: "Emocional", hint: "Estrés, aburrimiento, soledad, tristeza…" },
  { id: "ambiental", label: "Ambiental", hint: "Cocina de noche, TV, ver ciertos alimentos" },
  { id: "social", label: "Social", hint: "Reuniones, presión social, comentarios" },
] as const;

export const PARAR_STEPS = [
  {
    letter: "P",
    title: "Pausa",
    text: "Detén todo por 60 segundos. Pon las manos sobre el pecho y respira profundo 4 veces.",
    seconds: 60,
  },
  {
    letter: "A",
    title: "Acepta",
    text: 'Di en voz alta o mentalmente: "Siento [emoción]. Está bien sentirlo."',
    seconds: 30,
  },
  {
    letter: "R",
    title: "Redirige",
    text: "Cambia de espacio físico. Ve al baño, sal al patio, abre una ventana.",
    seconds: 45,
  },
  {
    letter: "A",
    title: "Activa",
    text: "Bebe un vaso de agua fría. Activa tu cuerpo con 10 sentadillas o 2 min de estiramiento.",
    seconds: 60,
  },
  {
    letter: "R",
    title: "Reevalúa",
    text: "¿Tengo hambre física? Si sí, come conscientemente. Si no, ya ganaste.",
    seconds: 30,
  },
] as const;

export const SNACK_TABS = [
  {
    id: "dulce",
    label: "Dulce",
    emoji: "🍫",
    items: [
      "Chocolate oscuro 70%+",
      "Dátiles con mantequilla de maní",
      "Yogur griego con miel y frutos rojos",
    ],
  },
  {
    id: "salado",
    label: "Salado",
    emoji: "🧂",
    items: [
      "Pepino con sal de mar y limón",
      "Edamame",
      "Palomitas caseras",
      "Hummus con bastones de zanahoria",
    ],
  },
  {
    id: "crujiente",
    label: "Crujiente",
    emoji: "🥜",
    items: [
      "Almendras tostadas",
      "Galletas de arroz integral",
      "Apio con guacamole",
      "Nueces mixtas sin sal",
    ],
  },
  {
    id: "nocturno",
    label: "Nocturno",
    emoji: "🌙",
    items: [
      "Leche caliente con cúrcuma",
      "Manzana con canela",
      "Infusión de manzanilla con miel",
      "Plátano con crema de almendra",
    ],
  },
] as const;

export const NIGHT_RITUAL = [
  {
    title: "Cierra la cocina",
    text: "Un ritual simbólico que le dice a tu cerebro: terminó la hora de comer.",
  },
  {
    title: "Prepara tu infusión",
    text: "Manzanilla, valeriana o pasiflora. Calma el sistema nervioso en minutos.",
  },
  {
    title: "Diario emocional",
    text: "Escribe: ¿Qué emoción cargo esta noche? Descarga la presión antes de que vaya a la comida.",
  },
];
