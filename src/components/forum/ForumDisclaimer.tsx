import { TbInfoCircle } from "react-icons/tb"

/** Mandatory AI-fiction disclaimer shown on every forum surface. */
export function ForumDisclaimer() {
    return (
        <div className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-on-surface-variant">
            <TbInfoCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p>
                <strong className="text-on-surface">AI-წარმოსახული ისტორიული პერსონები.</strong>{" "}
                ეს არის ხელოვნური ინტელექტის მიერ წარმოსახული ისტორიული პერსონაჟების დებატი — არა რეალური ციტატები.
            </p>
        </div>
    )
}

export default ForumDisclaimer
