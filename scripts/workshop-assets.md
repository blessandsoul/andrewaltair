# Workshop assets — генерация через Magnific MCP

Плейсхолдеры воркшопа лежат как пути в `src/data/workshop-templates.ts`, но файлов в
`public/workshop/assets/` ещё нет. Этот список — что сгенерировать после рестарта сессии
(когда подгрузятся тулзы `mcp__magnific__*`).

Правила (память): **фото = Nano Banana 2 (`imagen-nano-banana-2-flash`), бесплатно.**
**Видео = Kling 2.5 (`kling-25`), ТОЛЬКО 720p, жрёт кредиты → генерю лишь после явного «go».**
Все 9:16 (вертикаль). Люди в GE-контенте = грузинская внешность (тёмные волосы, тёплые карие глаза).

## ФОТО (Nano Banana 2, free) — 7 шт

| Файл | Роль в воркшопе | Промпт (EN) |
|---|---|---|
| `photo_a.jpg` | Голосование A · «старый тбилисский двор» (атмосфера/свет) | Atmospheric photo of an old Tbilisi courtyard, carved wooden balconies, climbing grapevine, worn stone steps, hanging laundry, warm golden late-afternoon light, lived-in nostalgic mood, shallow depth of field, photographic. 9:16. |
| `photo_b.jpg` | Голосование B · «продукт на столе» (бизнес-кадр/база для рекламы) | Clean commercial product shot: a jar of golden Georgian honey on a rustic wooden table, soft window light, minimal styled background, shallow depth of field, premium advertising look. 9:16. |
| `photo_c.jpg` | Голосование C · «портрет у окна» (человек/эмоция/история) | Intimate portrait of a Georgian woman, dark hair, warm brown eyes, by a window in soft natural side light, thoughtful expression, film-like skin tones, story in the eyes. 9:16. |
| `broken.jpg` | «детектив — найди ошибку» (3 ошибки композиции) | Photo with 3 obvious teachable composition mistakes: subject's head cropped off by the top edge, horizon tilted ~15°, a lamp post growing straight out of the subject's head; flat harsh lighting. Make the errors clearly visible. 9:16. |
| `story_3.jpg` | История, шаг «исходник» | A lump of raw grey clay on an empty potter's wheel, studio light, before any work. Same pottery studio as story_1/story_2. 9:16. |
| `story_1.jpg` | История, шаг «процесс» | Close-up of a Georgian potter's clay-covered hands shaping a bowl on a spinning wheel, focused, warm studio light. Same studio/subject as story_3/story_2. 9:16. |
| `story_2.jpg` | История, шаг «результат» | The finished glazed ceramic bowl, beautifully lit on a wooden shelf — the result. Same studio/subject as story_3/story_1. 9:16. |

story_1/2/3 = один и тот же гончар/глина в 3 стадии (исходник→процесс→результат), раунд = расставить по порядку, поэтому держать предмет узнаваемо одинаковым.

## ВИДЕО (Kling 2.5, 720p, КРЕДИТЫ → только с «go») — 3 шт

Делать image-to-video из уже сгенерённых стиллов (дёшево + связно).

| Файл | Роль | Как |
|---|---|---|
| `clip_a.mp4` | «камера движется» (панорама+зум вместе) | i2v из `photo_a.jpg`: камера медленно панорамирует вправо + наезд (dolly-in), сцена статична. 5s, 720p. |
| `clip_b.mp4` | «камера неподвижна» (двигается только объект) | i2v из `photo_b.jpg`: камера зафиксирована, движется только пар над банкой/чашкой. 5s, 720p. |
| `boring.mp4` | «15 сек — ничего не происходит» (как НЕ надо) | Намеренно скучный статичный кадр (пустая комната/стена), без движения камеры и объекта. 10s 720p; при желании добить до 15s через ffmpeg `tpad`. |

## Цикл render→QA
`images_generate` → `creations_wait` → `curl -o file.jpg <url>` → `Read` (посмотреть) → если ок,
сохранить в `public/workshop/assets/`. Видео: кадр через ffmpeg → `Read` для проверки.
