"""Filter a `git diff -- <file>` to keep ONLY hunks that contain none of the drop tokens.

Used to stage just the r6 per-name-answers hunks out of files that also carry
unrelated timer / live-resolve WIP. Output goes to stdout as a valid patch;
counts go to stderr.

Usage: python scratch/ws_hunk_filter.py <path> <comma-separated-drop-tokens>
"""

import subprocess
import sys


def main() -> int:
    path = sys.argv[1]
    drops = [t for t in sys.argv[2].split(",") if t]
    diff = subprocess.run(
        ["git", "diff", "--", path], capture_output=True, text=True, check=True
    ).stdout
    lines = diff.split("\n")

    header: list[str] = []
    i = 0
    while i < len(lines) and not lines[i].startswith("@@"):
        header.append(lines[i])
        i += 1

    hunks: list[list[str]] = []
    cur: list[str] | None = None
    for ln in lines[i:]:
        if ln.startswith("@@"):
            if cur is not None:
                hunks.append(cur)
            cur = [ln]
        elif cur is not None:
            cur.append(ln)
    if cur is not None:
        hunks.append(cur)

    kept = [h for h in hunks if not any(tok in "\n".join(h) for tok in drops)]

    out = "\n".join(header)
    for h in kept:
        out += "\n" + "\n".join(h)
    if not out.endswith("\n"):
        out += "\n"
    sys.stdout.write(out)
    sys.stderr.write(f"{path}: {len(hunks)} hunks total, kept {len(kept)}\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
