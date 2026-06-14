// Workshop template authoring types — shared by every per-workshop file and the
// registry index. Pure types (no runtime values), so there is no import cycle with
// the registry that imports the workshop objects.

import type { RoundType } from "@/types/workshop.types";
import type { L } from "@/data/workshop-i18n";

export type LText = L; // every authored string is a localized object: l('русский', 'контекст')

export interface TemplateOption {
  id: string;
  label: LText;
  src?: string;
}
export interface TemplateReason {
  id: string;
  label: LText;
}

export type TeachBlockL =
  | { kind: "lead"; text: LText }
  | { kind: "cards"; cards: { title: LText; text: LText }[] }
  | { kind: "keypoints"; items: { n?: string; text: LText }[] }
  | {
      kind: "media";
      items: {
        letter?: string;
        title?: LText;
        src: string;
        mediaType: "image" | "video";
        caption?: LText;
      }[];
    }
  | { kind: "table"; headers: LText[]; rows: LText[][] };

export interface TeachContentL {
  accent?: string;
  blocks: TeachBlockL[];
}
export interface RoundScriptL {
  say?: LText;
  example?: LText;
  show?: LText;
  ask?: LText;
  after?: LText;
  meta?: LText;
}

export interface WorkshopTemplateRound {
  key: string;
  type: RoundType;
  prompt: LText;
  options?: TemplateOption[];
  correctOptionId?: string;
  config?: { minNumber?: number; maxNumber?: number; fields?: LText[] };
  durationSec?: number;
  hostNotes?: LText;
  showsHeroPhoto?: boolean; // F3: keep the chosen photo visible during this round
  reasons?: TemplateReason[]; // F4: preset "why" chips for the discuss phase
  content?: TeachContentL;
  script?: RoundScriptL;
}

export interface WorkshopTemplate {
  title: LText;
  rounds: WorkshopTemplateRound[];
}

// Demo answers for a workshop, keyed by round key. Optional per workshop —
// the demo room degrades gracefully when a workshop has no demo data.
export interface DemoRoundAnswers {
  open: (string | number)[];
  revote?: string[];
}
