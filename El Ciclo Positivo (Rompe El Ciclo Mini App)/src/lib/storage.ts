import { useCallback, useEffect, useState } from "react";

export type DayProgress = {
  morning: boolean[];
  night: boolean[];
};

export type TriggerEntry = {
  id: string;
  date: string;
  situation: string;
  emotions: string[];
  type: string;
  ate: string;
  realHunger: "si" | "no" | "no-segura";
  usedParar: boolean;
};

const KEY_DAYS = "rec:days";
const KEY_START = "rec:start";
const KEY_TRIGGERS = "rec:triggers";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function useLocalState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setValue(read<T>(key, initial));
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          /* ignore */
        }
        return resolved;
      });
    },
    [key],
  );

  return [value, update, hydrated] as const;
}

export function useProgress() {
  return useLocalState<Record<string, DayProgress>>(KEY_DAYS, {});
}

export function useStartDate() {
  const [start, setStart, hydrated] = useLocalState<string>(KEY_START, "");
  useEffect(() => {
    if (hydrated && !start) setStart(new Date().toISOString().slice(0, 10));
  }, [hydrated, start, setStart]);
  return [start, hydrated] as const;
}

export function useTriggers() {
  return useLocalState<TriggerEntry[]>(KEY_TRIGGERS, []);
}

export function currentDay(startISO: string) {
  if (!startISO) return 1;
  const start = new Date(startISO + "T00:00:00");
  const diff = Math.floor((Date.now() - start.getTime()) / 86400000);
  return Math.min(21, Math.max(1, diff + 1));
}

export function emptyDay(): DayProgress {
  return { morning: [false, false, false], night: [false, false, false] };
}

export function dayIsComplete(p?: DayProgress) {
  if (!p) return false;
  return [...p.morning, ...p.night].every(Boolean);
}
