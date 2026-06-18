// Demo prompts for the workshop pult: copy-paste artifacts the host shows live.
// `body` is stored VERBATIM (an external teaching artifact the host copies into an
// image generator), so it keeps the long dashes that were in the original prompt.
// `title` is our own label (dash-free).

export interface DemoPrompt {
    id: string
    title: string
    body: string
}

export const DEMO_PROMPTS: readonly DemoPrompt[] = [
    {
        id: 'cinema-gas-station',
        title: 'Cinematic still, gas station',
        body: `Cinematic film still, early 1980s rural Texas gas station convenience store, interior, daytime.

SUBJECTS:
@KILLER — a man in his 40s standing on the right side of the frame, dark brown hair in a blunt straight chin-length pageboy cut with a straight fringe, heavy calm expression, tired hooded eyes looking straight ahead at the man opposite, smooth pale-olive skin, faint stubble. Wears a dark navy-black snap-button denim jacket. Upright still posture, shoulders square, motionless, predatory calm.
@OLD_CLERK — older man seen only from behind on the left side of the frame, back of his grey-brown head and shoulder, out of focus, wearing a faded pale-yellow plaid shirt with a beige strap (suspender) over the shoulder. He forms a dark soft frame in the foreground.

BLOCKING: over-the-shoulder two-shot across a store counter. @OLD_CLERK back-of-head fills the left foreground, blurred. @KILLER faces him, sharp, on the right.

CAMERA: medium close-up, over-the-shoulder framing, camera at eye level, flat neutral angle, point of view close to the clerk. Shallow depth of field — only @KILLER's face is in crisp focus, foreground shoulder and background softly blurred. Spherical lens look, soft creamy bokeh, NOT anamorphic, no oval flares.

BACKGROUND (soft, out of focus): a white panelled door directly behind @KILLER acting as a bright backdrop; cluttered convenience-store shelves; a blue snack stand on the left edge; pale straw cowboy hats hanging on the right wall; a red snack rack with small unreadable product labels on the far right. Small background text illegible and blurred.

LIGHT: soft naturalistic daylight from store windows, gentle frontal-side light opening @KILLER's eyes and cheekbones, light shadow under the brow giving a heavy gaze; the white door behind works as a large soft reflector separating his dark silhouette from the space; foreground head in shadow. Moderate, directional contrast, his face the brightest readable point. Stable light.

COLOR: muted, desaturated earthy palette — sandy yellows, beige, warm brown wood, cream walls; cold accent of the dark navy jacket; sun-faded Americana look. Low colour saturation.

MOOD: quiet, tense, ordinary surface hiding menace.

ERA / FORMAT: aspect ratio 2.39:1 widescreen; colour film; 35mm Kodak film grain, soft vintage film texture, gentle filmic softness, naturalistic photochemical look, slight halation on highlights.`,
    },
]
