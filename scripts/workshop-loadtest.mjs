#!/usr/bin/env node
/**
 * Workshop load test — доказательство, что N студентов не залагают.
 *
 * Имитирует РЕАЛЬНЫЙ паттерн воркшопа: N виртуальных студентов заходят,
 * опрашивают состояние каждые ~3с (с джиттером) и отвечают, когда раунд открыт.
 * Параллельно скрипт играет ВЕДУЩЕГО: открывает раунды и прогоняет фазы.
 * Меряет латентность каждого запроса и печатает p50/p95/p99 + долю ошибок.
 *
 * Запуск (локально, dev-сервер на :3000, admin-bypass включён):
 *   node scripts/workshop-loadtest.mjs
 *   node scripts/workshop-loadtest.mjs --students 30 --duration 45
 *
 * Против прода (после деплоя): сначала создай комнату в /admin/workshop, потом:
 *   node scripts/workshop-loadtest.mjs --url https://andrewaltair.ge --code ABCDE --hostKey <hostKey>
 *
 * Требует Node 18+ (встроенный fetch). Зависимостей нет.
 *
 * Альтернатива «pro»: k6 (один бинарь, k6.io) — но этот скрипт мирит точный
 * поллинг-паттерн без установки. Тест доказывает СЕРВЕР; сеть в зале (телефоны
 * на wifi/4G) — отдельный риск, но опросы — крошечный JSON.
 */

const args = Object.fromEntries(
    process.argv.slice(2).join(' ').split('--').filter(Boolean).map((s) => {
        const [k, ...v] = s.trim().split(/\s+/)
        return [k, v.join(' ') || true]
    })
)

const URL = (args.url || 'http://localhost:3000').replace(/\/$/, '')
const STUDENTS = parseInt(args.students || '30', 10)
const DURATION_S = parseInt(args.duration || '45', 10)
const TEMPLATE = args.template || 'adi-workshop'
let CODE = args.code || null
let HOST_KEY = args.hostKey || null

const lat = [] // {ms, ok, label}
const rec = (ms, ok, label) => lat.push({ ms, ok, label })

async function timed(label, fn) {
    const t0 = performance.now()
    try {
        const res = await fn()
        const ms = performance.now() - t0
        rec(ms, res.ok, label)
        return res
    } catch (e) {
        rec(performance.now() - t0, false, label)
        return { ok: false, status: 0, _err: String(e) }
    }
}

const jget = async (path) => {
    const res = await fetch(URL + path, { cache: 'no-store' })
    let data = null
    try { data = (await res.json())?.data } catch {}
    return { ok: res.ok, status: res.status, data }
}
const jpost = async (path, body) => {
    const res = await fetch(URL + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })
    let data = null
    try { data = (await res.json())?.data } catch {}
    return { ok: res.ok, status: res.status, data }
}
const jpatch = async (path, body) => {
    const res = await fetch(URL + path, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })
    return { ok: res.ok, status: res.status }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const pct = (arr, p) => {
    if (!arr.length) return 0
    const s = [...arr].sort((a, b) => a - b)
    return Math.round(s[Math.min(s.length - 1, Math.floor((p / 100) * s.length))])
}

async function ensureRoom() {
    if (CODE) {
        console.log(`▶ Using existing room ${CODE}`)
        return
    }
    console.log('▶ Creating a fresh room (admin-bypass / dev)...')
    const res = await jpost('/api/workshop/rooms', { templateId: TEMPLATE, demo: false })
    if (!res.ok || !res.data?.code) {
        console.error(`✗ Could not create room (HTTP ${res.status}). On prod pass --code & --hostKey.`)
        process.exit(1)
    }
    CODE = res.data.code
    HOST_KEY = res.data.hostKey
    console.log(`  room=${CODE} hostKey=${HOST_KEY?.slice(0, 8)}…`)
}

// ── one virtual student ──────────────────────────────────
async function student(i, deadline) {
    const clientId = `loadstud-${i}-${Math.floor(Math.random() * 1e6)}`
    await timed('join', () => jpost(`/api/workshop/rooms/${CODE}/join`, { clientId, name: `LT${i}` }))
    const answered = new Set()
    while (performance.now() < deadline) {
        const res = await timed('poll', () => jget(`/api/workshop/rooms/${CODE}?clientId=${clientId}`))
        const r = res.data?.round
        if (r && r.type !== 'teach' && (r.phase === 'open' || r.phase === 'revote' || r.phase === 'discuss')) {
            const tag = `${r.key}:${r.phase}`
            if (!answered.has(tag)) {
                answered.add(tag)
                const body = { clientId, roundKey: r.key }
                if (r.phase === 'discuss') {
                    body.textValue = (r.reasons?.[i % (r.reasons?.length || 1)]?.label) || 'потому что так дороже'
                } else if (r.type === 'text') {
                    body.textValue = `нагрузочный ответ ${i}`
                } else if (r.type === 'number') {
                    const { minNumber = 1, maxNumber = 15 } = r.config || {}
                    body.numberValue = minNumber + Math.floor(Math.random() * (maxNumber - minNumber + 1))
                } else {
                    body.optionId = r.options?.[i % (r.options?.length || 1)]?.id || 'a'
                }
                await timed('answer', () => jpost(`/api/workshop/rooms/${CODE}/respond`, body))
            }
        }
        await sleep(3000 * (0.85 + Math.random() * 0.3)) // 3s ± jitter, like the real client
    }
}

// ── host driver: walks the workshop so rounds keep changing ──
async function host(deadline) {
    if (!HOST_KEY) return // prod without hostKey → only student load (open rounds manually)
    await timed('host-open', () => jpatch(`/api/workshop/host/${HOST_KEY}/control`, { action: 'openRound' }))
    while (performance.now() < deadline) {
        const res = await timed('host-poll', () => jget(`/api/workshop/host/${HOST_KEY}`))
        const r = res.data?.round
        let action = 'nextRound'
        if (!r || res.data?.status === 'lobby') action = 'openRound'
        else if (r.type === 'teach') action = 'nextRound'
        else if (r.phase === 'open') action = r.type === 'choice_revote' ? 'advancePhase' : 'reveal'
        else if (r.phase === 'discuss') action = 'advancePhase'
        else if (r.phase === 'revote') action = 'reveal'
        else if (r.phase === 'revealed') action = 'nextRound'
        await timed('host-ctl', () => jpatch(`/api/workshop/host/${HOST_KEY}/control`, { action }))
        await sleep(3500) // give students time to poll + answer each round
    }
}

async function main() {
    console.log(`\n=== Workshop load test ===`)
    console.log(`  url=${URL}  students=${STUDENTS}  duration=${DURATION_S}s\n`)
    await ensureRoom()
    const deadline = performance.now() + DURATION_S * 1000
    const actors = []
    for (let i = 0; i < STUDENTS; i++) actors.push(student(i, deadline))
    actors.push(host(deadline))
    const t0 = performance.now()
    await Promise.all(actors)
    const wall = (performance.now() - t0) / 1000

    // ── report ──
    const all = lat.map((x) => x.ms)
    const errs = lat.filter((x) => !x.ok)
    const polls = lat.filter((x) => x.label === 'poll').map((x) => x.ms)
    const answers = lat.filter((x) => x.label === 'answer').map((x) => x.ms)
    const fmt = (a) => `p50 ${pct(a, 50)}ms · p95 ${pct(a, 95)}ms · p99 ${pct(a, 99)}ms · max ${Math.round(Math.max(0, ...a))}ms`

    console.log(`\n=== Results (${wall.toFixed(0)}s wall, ${lat.length} requests) ===`)
    console.log(`  ALL      : ${fmt(all)}`)
    console.log(`  poll     : ${fmt(polls)}  (n=${polls.length})`)
    console.log(`  answer   : ${fmt(answers)}  (n=${answers.length})`)
    console.log(`  throughput: ${(lat.length / wall).toFixed(1)} req/s`)
    console.log(`  errors   : ${errs.length} / ${lat.length} (${((errs.length / Math.max(lat.length, 1)) * 100).toFixed(1)}%)`)
    if (errs.length) {
        const byStatus = {}
        errs.forEach((e) => { byStatus[e.label] = (byStatus[e.label] || 0) + 1 })
        console.log(`  error breakdown:`, byStatus)
    }

    const p95 = pct(all, 95)
    const errRate = errs.length / Math.max(lat.length, 1)
    const ok = p95 < 300 && errRate < 0.01
    console.log(`\n${ok ? '✅ GREEN' : '⚠️  WATCH'} — ${STUDENTS} студентов: p95 ${p95}ms, ошибок ${(errRate * 100).toFixed(1)}%`)
    console.log(ok
        ? '   Сервер держит нагрузку — лагать не должно.'
        : '   p95 высокий или есть ошибки — смотри breakdown выше.\n')
    if (!CODE_PROVIDED) console.log(`   (тестовая комната ${CODE} осталась — удали её в /admin/workshop)`)
}

const CODE_PROVIDED = !!args.code
main().catch((e) => { console.error(e); process.exit(1) })
