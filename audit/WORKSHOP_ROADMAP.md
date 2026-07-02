# Workshop "Wow" Roadmap (10 improvements)

Goal: make people leave the workshop feeling they were at a live event, not a quiz. This is the executable plan for the 10 improvements, grounded in the real files and built mostly on the realtime data channel already shipped in W3.

Branch: `feat/workshop-realtime`. Same discipline as W1-W3: additive (never regress the working video/round flow), semantic tokens, INTERFACE_POLISH + VISUAL_TASTE, every animation reduced-motion gated, no em-dash, HTTP stays the source of truth, verify tsc + lint + vitest + a render pass per batch.

## Calibration up front (honest)
- UI / animation / sound items are fully verifiable locally on the dev server (`:3002`).
- Anything that relies on the LiveKit data channel reaching OTHER clients (live votes, projector reactions, live presence) is L1/L2 verifiable here (compiles, degrades safely) but its L4 "it actually feels instant across devices" needs a reachable LiveKit server plus two devices (phone student + projector host). Each such item is tagged **[needs 2-device test]**.

## Foundation: the realtime channel (already started in W3)
W3 shipped an additive, data-only LiveKit connection (`RealtimeProvider`, `#rt` identity, `canPublishData` granted, media still locked) and student-to-student instant reactions. Most of the wow items below extend the SAME channel, so the first work is to generalize it, then reuse it everywhere.

Generalize `src/app/workshop/_realtime/RealtimeProvider.tsx`:
- Widen `RealtimeEvent` to a small tagged union: `reaction`, `hand`, `answered` (a vote tick, no payload beyond the option bucket), `presence` (join/leave + avatar), `pulse` (host-triggered fx). Keep payloads tiny and non-authoritative.
- Mount the provider on the HOST projector (`DisplayClient.tsx`) and remote (`RemoteClient.tsx`) too, with a host identity, so the big screen receives student events instantly. This single step unlocks items 1, 2, 7.

## Build order (5 phases)
1. **Phase R (foundation):** generalize the channel + wire the projector to receive. Unlocks 1, 2, 7.
2. **Phase G (game-show):** live votes (1), sound (2), cinematic reveal (3), finale (4). The "live event" feeling.
3. **Phase E (engagement):** streak/combo/badge moments (6), live presence rail (7).
4. **Phase C (open rounds):** word-cloud answer wall (5).
5. **Phase H+S (host + growth):** director pult (8), shareable recap diploma (9), zero-friction personalized join (10).

---

## The 10 items

### 1. Live votes on the big screen in real time  ·  Effort M  ·  [needs 2-device test]
**Wow:** the crowd watches the bars fill as people tap. The single biggest gasp in this class of tool.
**Files:** `_realtime/RealtimeProvider.tsx` (add `answered` event), student `CurrentRound.tsx` (publish `answered` on submit), projector `DisplayClient.tsx` + `components/results/BarResults.tsx` / `ResultsBoard.tsx` (increment a live tally from received events during the open phase).
**Reuse:** `ChoiceBar` already spring-fills to a percentage; feed it a live count. Fallback: also drop the projector `/live` poll to ~600ms during `open` so it works even without the channel.

### 2. Sound of the room  ·  Effort S-M  ·  partly [needs 2-device test]
**Wow:** applause swells with the number of reactions, a drumroll on the countdown, an "ooooh" on a wrong reveal. Audio makes a room feel alive faster than any visual.
**Files:** `host/[hostKey]/useDisplayAudio.ts` (add applause/drumroll/oooh cues scaled by reaction volume), `DisplayClient.tsx` (trigger on the reaction batch + on reveal), audio assets under `public/workshop/`.
**Reuse:** `useDisplayAudio` already exists (host has an audio unlock overlay). Gate behind the existing sound setting.

### 3. Cinematic answer reveal  ·  Effort M
**Wow:** 3-2-1 countdown (sound + screen pulse), results slam in, confetti on the winner, a podium rise. Every reveal becomes a game-show beat.
**Files:** `DisplayClient.tsx` (reveal sequence orchestration), `components/ResultsBoard.tsx` + `WinnerCard`, `src/components/workshop/CountdownRing.tsx` (final-seconds pulse), lazy `canvas-confetti`.
**Reuse:** confetti pattern (`DisplayClient.tsx` reveal), `motion.ts` `springPop`, existing `BarResults`/`Histogram` stagger. Reduced-motion gated.

### 4. Finale show (the crescendo)  ·  Effort M-L
**Wow:** the end is a SHOW: leaderboard countdown from #10 to #1 with a spotlight on the winner, confetti + applause, a "class in numbers" montage (total answers, biggest comeback, funniest answer), THEN the diploma and a soft CTA to Andrew's course. People leave buzzing, which feeds the funnel.
**Files:** new `host/[hostKey]/FinaleSequence.tsx` (projector), `Leaderboard.tsx` (reverse-reveal mode), `EndStats.tsx` (montage stats), student `DiplomaView.tsx` (arrives after the finale) + a soft CTA line in `src/data/workshop-strings`.
**Reuse:** `Leaderboard` row layout animation (already shipped), `EndStats` podium stagger, confetti, `useDisplayAudio`. CTA copy obeys BRAND_ENGINE (result not tool, one CTA, no price).

### 5. Live answer wall / word cloud  ·  Effort M
**Wow:** for text rounds, answers fly onto the screen as tiles and cluster/scale by frequency. Mentimeter's signature moment.
**Files:** projector `components/results/TextWall.tsx` / `WriteInList.tsx` (animated tile layout), a small client-side frequency tally.
**Reuse:** framer `layout` animation (same primitive as the leaderboard reorder), `staggerParent/Child`. Text rounds already exist end to end.

### 6. Streaks, combo, and badge unlock as a MOMENT  ·  Effort M
**Wow:** 3 correct in a row triggers a "3 in a row" combo with bonus XP flying up; the leaderboard reshuffles live (already animated); a new badge does not just appear in a list, it unlocks with an animation + sound + flash.
**Files:** student `CurrentRound.tsx` (correctness + `state.me` gamification already available on the revealed branch), new `components/ComboPopup.tsx` + `BadgeUnlock.tsx`, `src/components/workshop/badgeIcons.tsx` (reuse icons).
**Reuse:** confetti, `motion.ts`, `navigator.vibrate`, existing badge/streak fields on `state.me`. Verify the streak field exists server-side at implementation.

### 7. Live presence rail + reactions on the projector  ·  Effort M  ·  [needs 2-device test]
**Wow:** a rail of participant avatars that light up and bounce when they answer or react; "247 people are here and moving" is visceral. Plus the W3 follow-up: reactions fly on the big screen the instant they are tapped, not after a 2s poll.
**Files:** projector `DisplayClient.tsx` (mount `RealtimeProvider` host-side, feed `GameOverlays` `ReactionsOverlay` from received events), new `PresenceRail.tsx`, `src/components/workshop/NameAvatar.tsx` (reuse).
**Reuse:** `LobbyView` already pops newcomers; `ReactionsOverlay` floater; the W3 channel.

### 8. Host director pult  ·  Effort M
**Wow:** the host spotlights a student answer on the big screen, brings someone on camera, throws confetti or a sound cue by hand, runs an instant emoji mood check. The host feels like a TV director.
**Files:** `host/[hostKey]/remote/RemoteClient.tsx` + `HostControls.tsx`, `GameOverlays.tsx`, `api/workshop/host/[hostKey]/control/route.ts` (add spotlight / manual-fx / mood-check actions).
**Reuse:** `spinWheel` / `showWinners` / `showTopAnswers` control pattern already exists, grant-speak already exists. New actions ride the same PATCH + overlay dedupe.

### 9. A diploma / recap worth posting  ·  Effort S-M
**Wow:** a personal animated recap ("you answered 12/15, ranked #3, earned 3 badges") that plays, then the shareable card. Every shared diploma is organic reach for Andrew's brand, so growth is built into the product.
**Files:** student `DiplomaView.tsx` (an animated recap screen before the image), `api/workshop/rooms/[code]/diploma/[clientId]/route.tsx` (a small recap-data endpoint or reuse the existing diploma data), new `RecapCard.tsx`, optional story-format variant.
**Reuse:** the diploma PNG generator + the confetti and entrance already added in W2.

### 10. Zero-friction personalized join  ·  Effort S-M  ·  presence [needs 2-device test]
**Wow:** QR, tap, you are in (already true), plus pick a fun avatar/color and see YOURSELF appear on the big screen instantly. The "I joined and the screen reacted to me" hook lands in the first second.
**Files:** student `components/NameGate.tsx` (avatar/color pick), `api/workshop/rooms/[code]/join` (store avatar), projector `PresenceRail` / `DisplayClient` (show the new joiner instantly via the `presence` event), `NameAvatar.tsx`.
**Reuse:** `NameAvatar` palette (kept varied on purpose), the W3 channel for the instant on-screen appearance.

---

## Recommended first slice (max wow, min work)
Phase R (generalize the channel + wire the projector) then **#1 live votes + #3 cinematic reveal + #2 room sound**. Those three turn the quiz tool into a live event and all ride the channel already in place. Then #4 finale (it feeds the course funnel), then the rest.

## Guardrails
- Additive only: never remount or regress the video `WatchTile` or the round flow. The realtime pieces degrade to the current HTTP poll if LiveKit is down.
- HTTP remains the source of truth (scores, moderation, persistence). Data-channel payloads are ephemeral UX and never authoritative (identity is caller-set, audit V014).
- Reduced-motion gated, semantic indigo tokens, INTERFACE_POLISH values, no em-dash, minimal change. Do not touch the pre-existing admin/workshop WIP files or GradientButton.

## Verification per batch
- `npx tsc --noEmit`, `npm run lint`, `npx vitest run`, and a render pass on `:3002` (create a room in `/admin`, open `/workshop/[code]`).
- For the `[needs 2-device test]` items, verify locally that they compile and that the non-realtime fallback works, then confirm the instant cross-device behavior on a phone + projector with a reachable LiveKit. Report those as L1/L2 done, L4 pending, never as "done" on compile alone.
