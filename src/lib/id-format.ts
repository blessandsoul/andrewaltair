export function formatId(id: string | undefined | null): string {
    if (!id) return '---';
    return id.toString();
}
