// localStorage-backed data service.
// All reads/writes go through here so a real backend can replace it later.

import { seedDrills } from "./seedDrills";

const DRILLS_KEY = "vbp.drills";
const PLANS_KEY = "vbp.plans";
const SESSION_KEY = "vbp.activePractice";

export const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function notifySessionChange() {
  window.dispatchEvent(new Event("vbp-session-change"));
}

// ---- Drills ----

export function getDrills() {
  const drills = read(DRILLS_KEY, null);
  if (drills === null) {
    write(DRILLS_KEY, seedDrills);
    return seedDrills;
  }
  return drills;
}

export function saveDrill(drill) {
  const drills = getDrills();
  const idx = drills.findIndex((d) => d.id === drill.id);
  const next = drill.id && idx >= 0 ? drills.map((d) => (d.id === drill.id ? drill : d)) : [...drills, { ...drill, id: drill.id || uid() }];
  write(DRILLS_KEY, next);
  return next;
}

export function deleteDrill(id) {
  const next = getDrills().filter((d) => d.id !== id);
  write(DRILLS_KEY, next);
  return next;
}

// ---- Practice plans ----
// Plan: { id, name, date, createdAt, updatedAt, items: [{ id, drillId, name, description, minutes, notes }] }

export function getPlans() {
  return read(PLANS_KEY, []);
}

export function getPlan(id) {
  return getPlans().find((p) => p.id === id) || null;
}

export function savePlan(plan) {
  const plans = getPlans();
  const now = new Date().toISOString();
  let saved;
  if (plan.id && plans.some((p) => p.id === plan.id)) {
    saved = { ...plan, updatedAt: now };
    write(PLANS_KEY, plans.map((p) => (p.id === plan.id ? saved : p)));
  } else {
    saved = { ...plan, id: plan.id || uid(), createdAt: now, updatedAt: now };
    write(PLANS_KEY, [saved, ...plans]);
  }
  return saved;
}

export function deletePlan(id) {
  write(PLANS_KEY, getPlans().filter((p) => p.id !== id));
  return getPlans();
}

export function duplicatePlan(id) {
  const plan = getPlan(id);
  if (!plan) return null;
  return savePlan({
    ...plan,
    id: undefined,
    name: `${plan.name} (copy)`,
    items: plan.items.map((it) => ({ ...it, id: uid() })),
  });
}

// ---- Active practice session ----
// Survives a page refresh mid-practice.
// Session: { planId, startedAt, pausedAt, pausedTotalMs, completedItemIds, score }

export function getSession() {
  return read(SESSION_KEY, null);
}

export function saveSession(session) {
  write(SESSION_KEY, session);
  notifySessionChange();
  return session;
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  notifySessionChange();
}

// ---- Helpers ----

export function planTotalMinutes(plan) {
  return (plan.items || []).reduce((sum, it) => sum + (Number(it.minutes) || 0), 0);
}

// Accepts youtube watch/share/embed URLs, returns an embed URL or null.
export function youtubeEmbedUrl(url) {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}
