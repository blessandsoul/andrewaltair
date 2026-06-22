# Workshop broadcast: 20 features roadmap + status

Дорожная карта 20 улучшений видео-вещания воркшопа (LiveKit one-way broadcast). Живёт на диске,
чтобы статус не терялся между сессиями. Базовый план вещания: `~/.claude/plans/virtual-wandering-plum.md`.

## Архитектура (кратко)
- Engine: LiveKit (self-hosted SFU на VPS). Сетап: `deploy/livekit/README.md` + `livekit.yaml` + `docker-compose.yml`.
- Одностороннесть на уровне токена: хост/докладчик = publisher (`canPublish`), зритель = subscribe-only.
- Комната = `code` воркшопа. Хост по `hostKey`, зритель по `clientId`.
- Talkback: у студента ОДНО соединение, роль повышается пере-минтом токена при выдаче слова (без коллизии identity).
- Токен-логика: `src/lib/livekit.ts`. Гейтинг настройкой `broadcastEnabled` (5-spot pattern).

## Инфра-фиксы (были блокерами, починены)
- CSP `connect-src` env-aware для LiveKit: `next.config.mjs`.
- `Permissions-Policy: camera=(self), microphone=(self)` (было пусто, глушило getUserMedia).
- Локальный LiveKit dev требует `--bind 0.0.0.0 --node-ip 127.0.0.1` (иначе недостижимый ICE-IP).

## Качество видео (тюнинг 2026-06-22)
- Паблишер `BroadcastPublisher`: capture+publish 1080p (`VideoPresets.h1080`), simulcast [720,360], screenShare 1080p15, `degradationPreference: maintain-resolution`. Без этого был дефолтный 720p + просадка разрешения под нагрузкой = «везде мыло».
- Кнопка-шестерёнка «Параметры видео» (`Settings`) в контрол-баре паблишера, видна после go-live: live-выбор качества 1080/720/360 (`restartTrack`), плавность sharp/smooth (`degradationPreference` через `sender.setParameters`), выбор камеры и микрофона (`useMediaDeviceSelect` video+audio). Строки `settings/quality/motion/sharp/smooth/cameraLabel/micLabel`. tsc 0. Рантайм-проверка в живом эфире = L4.
- Зритель `WatchTile`: `adaptiveStream` ТОЛЬКО для телефона студента (экономит трафик + есть audio-only тумблер); для PiP проектора OFF, тянется верхний слой. adaptiveStream подбирает simulcast по размеру тайла -> маленький тайл = низкий слой = мыло.
- Сеть: если на VPS UDP закрыт и медиа идёт по TCP 7881, битрейт занижается. Убедиться, что 50000-50200/udp открыты в фаерволе.

## Новые пакеты
`livekit-server-sdk`, `livekit-client`, `@livekit/components-react`, `@livekit/track-processors`.

## Новые API-роуты (`src/app/api/workshop/`)
- `host/[hostKey]/broadcast-token` (publisher), `rooms/[code]/watch-token` (viewer/speaker)
- `host/[hostKey]/control` +actions: `setBroadcast`, `grantSpeak`, `revokeSpeak`
- `rooms/[code]/raise-hand`, `rooms/[code]/caption`
- `livekit-webhook` (авто-стоп), `host/[hostKey]/broadcast-recap`

---

## Статус 20 фич

Легенда: ✓ собрано (tsc-clean) · ◐ частично · ☐ не начато · L4 = рантайм-проверка на реальных устройствах ждёт.

### Wave 1, презентер + надёжность (7), готово
| # | Фича | Статус | Где |
|---|------|--------|-----|
| 1 | Демонстрация экрана | ✓ | BroadcastPublisher (screen share), WatchTile (рендер) |
| 2 | Контролы мик/камера/флип/устройства | ✓ | BroadcastPublisher control bar |
| 3 | Размытие фона | ✓ (L4) | BroadcastPublisher (track-processors) |
| 4 | Со-ведущий (камера докладчика) | ✓ (L4) | WatchTile SpeakerControls + inset |
| 5 | Нэйм-плейт/вотермарк | ◐ вотермарк ✓, нэйм-плейт-с-именем нет | WatchTile |
| 6 | Аудио-режим (камера off) | ✓ | BroadcastPublisher |

### Wave 2, серверная надёжность + low-data (4), готово
| # | Фича | Статус | Где |
|---|------|--------|-----|
| 12 | Индикатор связи / переподключение | ✓ | WatchTile (useConnectionState) |
| 13 | Состояние «эфир скоро / хост офлайн» | ✓ | WatchTile |
| 14 | Авто-стоп вебхуком + авто-резюме | ✓ (L4 вебхук) | livekit-webhook route, RemoteClient note |
| 15 | Сворачиваемый тайл на телефоне | ✓ | WatchTile |
| 16 | Low-data (adaptiveStream + только звук) | ✓ | WatchTile |

### Wave 3, интерактив (5), готово
| # | Фича | Статус | Где |
|---|------|--------|-----|
| 7 | Плавающие реакции над видео | ✓ reuse | ReactionsOverlay (fixed inset-0 z-40 над PiP) |
| 8 | Поднять руку и говорить (talkback) | ✓ (L4) | raise-hand route, grant/revoke, WatchTile SpeakerControls, RemoteClient list |
| 9 | Закрепить вопрос над видео | ✓ reuse | ChatQuestionMoment поверх PiP |
| 10 | Спотлайт говорящего | ✓ | DisplayClient nameplate |
| 11 | Со-ведущий (см. #4) | ✓ (L4) | WatchTile |

### Wave 4, субтитры + запись + аналитика (5), готово (tsc 0) + 1 stretch ☐
| # | Фича | Статус | Где |
|---|------|--------|-----|
| B10 | Живые субтитры (Web Speech) | ✓ backend+UI (tsc 0) | BroadcastPublisher (SpeechRecognition), caption route, WatchTile subtitle bar |
| B10+ | Грузинский перевод субтитров | ☐ stretch, нужен translate-API (Groq возможен) | note |
| D20 | Транскрипт сессии | ✓ backend + показ в EndStats | appendTranscript, broadcast-recap route, EndStats transcript panel |
| D18 | Минуты эфира (air-time) | ✓ backend + показ в EndStats | applyBroadcast tracking, getBroadcastRecap, EndStats air-time tile |
| D17 | Запись эфира (Egress) | ✓ app-хуки + compose + redis + docs (L4 VPS) | livekit.ts startRoomRecording, control startRecording/stopRecording, RemoteClient REC, egress-compose.yml |
| D19 | Клип/снапшот момента | ✓ client-side frame grab | BroadcastPublisher snapshot (canvas to PNG) |

---

## Калибровка (что реально проверено)
- **Фундамент**: проверен end-to-end вживую (паблишер публикует fake-камеру, зритель-проектор рендерит видео через self-hosted SFU). Скриншоты сняты. L1+L3+L4 OK.
- **Wave 1-3**: tsc 0 ошибок (4 прохода). Рантайм по-отдельности (screen-switch, blur, flip, talkback-grant на 2 устройствах, вебхук-доставка) = L4 pending.
- **Wave 4**: всё собрано, tsc 0 ошибок. captions/транскрипт/минуты/снапшот = L1+L2; Egress-запись = L1+L2 (код + compose + redis + docs), L4 ждёт egress-контейнер на VPS. Рантайм (скачивание снапшота, показ recap в EndStats, REC-кнопка на 2 устройствах) = L4 pending.
- Длинного тире в моих правках нет (скан чист). Пред-существующие тире в комментариях app-файлов (workshop.service.ts и др.) не трогал, вне scope этой задачи.

## Сделано в этой сессии (16/20 -> 20/20 core)
1. tsc-фикс: mongoose 9 переименовал `FilterQuery` -> `QueryFilter` (applyBroadcast). tsc 0.
2. EndStats (D18+D20): фетч `broadcast-recap` + плитка минут эфира + панель транскрипта.
3. D19 снапшот: кнопка Camera в паблишере, canvas-grab текущего кадра -> скачивание PNG.
4. D17 Egress: `livekit.ts` (EgressClient start/stop) + service `startRecording/stopRecording` + control-actions + `recordingEgressId` через HostState + кнопка REC в RemoteClient + строки `record/recordStop` + `egress-compose.yml` (redis+egress) + redis-блок в `livekit.yaml` + секция в README.
5. Final: `npx tsc --noEmit` = 0, скан тире (мои правки чисты), README обновлён.

## Осталось (L4 / внешнее)
- B10+ грузинский перевод субтитров: нужен внешний translate-API (Groq), stretch.
- L4 рантайм на 2 устройствах: REC-запись после подъёма egress-контейнера на VPS, скачивание снапшота, показ recap в EndStats, кнопка REC.
- Деплой: базовый LiveKit + новый egress-overlay (`docker compose -f docker-compose.yml -f egress-compose.yml up -d`), redis-блок в `livekit.yaml`, том `recordings/`.

## Деплой-напоминание
LiveKit-контейнер на VPS + поддомен `livekit.andrewaltair.ge` -> 7880 (Coolify TLS) + UDP 50000-50200 + TCP 7881 в фаерволе + одна пара ключей в `livekit.yaml` и в env приложения. Вебхук-URL уже в `livekit.yaml`. Egress будет отдельным контейнером.
