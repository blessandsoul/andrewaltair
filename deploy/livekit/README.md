# LiveKit self-host (workshop host broadcast)

One-way live video + audio for the workshop: the host publishes camera and mic, students and the projector only watch. No Google Meet. The app talks to a self-hosted LiveKit server on the VPS.

**RU TL;DR:** подними LiveKit на VPS (docker compose ниже), заведи поддомен `livekit.andrewaltair.ge` -> 7880 через Coolify (TLS он сам выдаст), открой UDP 50000-50200 + TCP 7881 в фаерволе, вставь одну пару ключей в `livekit.yaml` и в env приложения. Код приложения переключается на LiveKit Cloud сменой env, без правок.

## 1. Generate one API key/secret pair

```bash
docker run --rm livekit/livekit-server generate-keys
```

Put the SAME pair in two places:
- `livekit.yaml` under `keys:` (replace `APIreplace_me` and the secret).
- The app env (Coolify env for andrewaltair.ge, and local `.env.local`):
  - `LIVEKIT_API_KEY=APIxxxx`
  - `LIVEKIT_API_SECRET=the_secret`
  - `LIVEKIT_URL=wss://livekit.andrewaltair.ge`
  - `NEXT_PUBLIC_LIVEKIT_URL=wss://livekit.andrewaltair.ge`

## 2. DNS

Add an A record: `livekit.andrewaltair.ge` -> `144.76.30.237` (the VPS IP).

## 3. Run the server

```bash
cd deploy/livekit
docker compose up -d
docker compose logs -f livekit   # expect "starting LiveKit server"
```

## 4. Reverse proxy (signaling)

Point `wss://livekit.andrewaltair.ge` (443) at the container on port `7880`.
- **Coolify:** add a Docker Compose resource (this folder), set the domain `livekit.andrewaltair.ge` mapped to port `7880`. Coolify (Traefik) provisions the TLS cert automatically.
- **Plain Traefik / nginx:** terminate TLS on 443 and proxy to `127.0.0.1:7880`, with WebSocket upgrade headers passed through.

Only the signaling WebSocket goes through the proxy. Media does not.

## 5. Firewall (media path)

Open on the host, straight to the VPS, not through the proxy:
- `50000-50200/udp` (primary media)
- `7881/tcp` (fallback when a viewer network blocks UDP)

Hetzner Cloud firewall example: add inbound rules for those ranges. If using `ufw`:

```bash
ufw allow 50000:50200/udp
ufw allow 7881/tcp
```

## 6. Verify

- `curl https://livekit.andrewaltair.ge` should return a small LiveKit response (not a 502).
- In the app: open the host remote, press the video button (`ვიდეო-ეთერი` / go live), allow the camera. A student page and the projector should show the host tile within a few seconds.

## Local development (no VPS)

Run a throwaway dev server, it ships a default `devkey` / `secret` pair. The `--bind 0.0.0.0`
and `--node-ip 127.0.0.1` flags are required: without them `--dev` binds to container loopback
and advertises an unreachable ICE IP, so the browser cannot connect through the Docker port map.

```bash
docker run --rm -p 7880:7880 -p 7881:7881 -p 7882:7882/udp \
  livekit/livekit-server --dev --bind 0.0.0.0 --node-ip 127.0.0.1
```

(The production `docker-compose.yml` uses the config file, not `--dev`, and binds 0.0.0.0 by default.)

Local `.env.local` already points at it:
```
LIVEKIT_URL=ws://localhost:7880
LIVEKIT_API_KEY=devkey
LIVEKIT_API_SECRET=secret
NEXT_PUBLIC_LIVEKIT_URL=ws://localhost:7880
```

## 7. Recording (Egress, optional)

The host remote has a record button (`ჩაწერა`) that appears once you go live. It starts a
room-composite MP4 via LiveKit Egress; pressing it again stops and the file is finalized.
Egress needs two extra containers (Redis + the egress worker), so it is opt-in.

1. Enable the `redis:` block in `livekit.yaml` (it is commented out by default).
2. Put the same api key/secret pair into `egress-compose.yml` (`EGRESS_CONFIG_BODY`).
3. Bring the stack up with the egress overlay merged in:

```bash
cd deploy/livekit
mkdir -p recordings
docker compose -f docker-compose.yml -f egress-compose.yml up -d
docker compose -f docker-compose.yml -f egress-compose.yml logs -f egress
```

Recordings land in `deploy/livekit/recordings/` as `workshop-<CODE>-<time>.mp4`. The egress
container renders the layout in headless Chrome, so it wants `shm_size: 1gb` and the `SYS_ADMIN`
capability (already set in `egress-compose.yml`). Without these containers the record button
returns a 503 and the broadcast keeps working, recording just stays off.

On LiveKit Cloud, egress is built in: no extra containers, point file output at your own S3
bucket in `src/lib/livekit.ts` instead of the local `/out` path.

## Switching to LiveKit Cloud later

Create a project at cloud.livekit.io, then change only the four env vars (`LIVEKIT_URL`, `NEXT_PUBLIC_LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`) to the Cloud values. No app code changes. Stop the self-hosted container.
