// Workshop registry — assembles every per-workshop file into one map.
//
// To ADD a workshop: create ./<id>.ts exporting its `WorkshopTemplate` object
// (and, optionally, its demo answers), then add ONE line here to WORKSHOP_TEMPLATES
// (and one to DEMO_RESPONSES if it has demo data). The picker, API, service and
// model pick it up automatically — `WorkshopTemplateId` widens via `satisfies`.

import { adiWorkshop, adiWorkshopDemo } from "./adi-workshop";
import { azbukaAi, azbukaAiDemo } from "./azbuka-ai";
import type { WorkshopTemplate, DemoRoundAnswers } from "./types";

export const WORKSHOP_TEMPLATES = {
  "adi-workshop": adiWorkshop,
  "azbuka-ai": azbukaAi,
} satisfies Record<string, WorkshopTemplate>;

export type WorkshopTemplateId = keyof typeof WORKSHOP_TEMPLATES;

export function isWorkshopTemplateId(id: string): id is WorkshopTemplateId {
  return id in WORKSHOP_TEMPLATES;
}

// Shared across all workshops — the demo room's fake-participant roster.
export const DEMO_NAMES = [
  "გიო",
  "ნინო",
  "დათო",
  "მარიამ",
  "ლუკა",
  "ანა",
  "საბა",
  "თეკლა",
] as const;

// Per-workshop demo answers (optional; if a workshop is absent here the demo room
// still works — it just won't drip in fake answers).
export const DEMO_RESPONSES: Record<
  string,
  Record<string, DemoRoundAnswers>
> = {
  "adi-workshop": adiWorkshopDemo,
  "azbuka-ai": azbukaAiDemo,
};

export type {
  WorkshopTemplate,
  WorkshopTemplateRound,
  DemoRoundAnswers,
} from "./types";
