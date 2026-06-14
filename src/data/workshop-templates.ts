// Public entry for the workshop registry. The actual templates now live one-per-file
// under ./workshops/ (assembled in ./workshops/index.ts). This thin re-export keeps
// every existing import `from '@/data/workshop-templates'` resolving unchanged.
export * from "./workshops";
