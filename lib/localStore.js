import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { fallbackRetreats, fallbackSettings } from "@/lib/demoContent";

const storePath = path.join(process.cwd(), "data", "local-store.json");

function defaultStore() {
  return {
    settings: fallbackSettings,
    retreats: []
  };
}

async function readStore() {
  try {
    const raw = await readFile(storePath, "utf8");
    const parsed = JSON.parse(raw);
    return {
      settings: { ...fallbackSettings, ...(parsed.settings || {}) },
      retreats: Array.isArray(parsed.retreats) ? parsed.retreats : []
    };
  } catch {
    const initialStore = defaultStore();
    await writeStore(initialStore);
    return initialStore;
  }
}

async function writeStore(store) {
  await mkdir(path.dirname(storePath), { recursive: true });
  await writeFile(storePath, JSON.stringify(store, null, 2));
}

export async function getLocalSettings() {
  const store = await readStore();
  return store.settings;
}

export async function updateLocalSettings(settings) {
  const store = await readStore();
  const nextSettings = {
    ...store.settings,
    ...settings,
    _id: store.settings?._id || "demo-settings",
    updatedAt: new Date().toISOString()
  };
  store.settings = nextSettings;
  await writeStore(store);
  return nextSettings;
}

export async function getLocalRetreats(limit) {
  const store = await readStore();
  const retreats = [...store.retreats].sort((a, b) => new Date(a.date) - new Date(b.date));
  return limit ? retreats.slice(0, limit) : retreats;
}

export async function getLocalRetreat(id) {
  const store = await readStore();
  return store.retreats.find((retreat) => retreat._id === id) || null;
}

export async function createLocalRetreat(input) {
  const store = await readStore();
  const now = new Date().toISOString();
  const retreat = {
    _id: randomUUID(),
    title: input.title,
    description: input.description,
    date: new Date(input.date).toISOString(),
    location: input.location,
    image: input.image || "",
    createdAt: now,
    updatedAt: now
  };
  store.retreats = [retreat, ...store.retreats];
  await writeStore(store);
  return retreat;
}

export async function updateLocalRetreat(id, input) {
  const store = await readStore();
  let updatedRetreat = null;
  store.retreats = store.retreats.map((retreat) => {
    if (retreat._id !== id) return retreat;
    updatedRetreat = {
      ...retreat,
      title: input.title,
      description: input.description,
      date: new Date(input.date).toISOString(),
      location: input.location,
      image: input.image || "",
      updatedAt: new Date().toISOString()
    };
    return updatedRetreat;
  });
  await writeStore(store);
  return updatedRetreat;
}

export async function deleteLocalRetreat(id) {
  const store = await readStore();
  const before = store.retreats.length;
  store.retreats = store.retreats.filter((retreat) => retreat._id !== id);
  await writeStore(store);
  return before !== store.retreats.length;
}
