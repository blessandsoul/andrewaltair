'use server'

import { redirect } from 'next/navigation';
import { getSlugById } from '@/lib/mdx';

export async function handleSmartSearch(formData: FormData) {
    const query = formData.get('query')?.toString();

    if (!query) return;

    // 1. Check if it looks like an ID (starts with # or looks like a short code)
    // Logic: Optional #, followed by exactly 6 digits
    const isSixDigitCode = /^#?\d{6}$/.test(query);

    if (isSixDigitCode) {
        // Remove # if present for lookup
        const cleanId = query.replace('#', '');
        const slug = await getSlugById(cleanId);


        if (slug) {
            // 2. INSTANT REDIRECT (The Magic Moment)
            redirect(`/library/${slug}`);
        }
    }

    // 3. If not an ID or ID not found, redirect to standard text search results
    // Since we don't have a dedicated /search page yet, we'll just redirect to blog with search query
    redirect(`/blog?search=${encodeURIComponent(query)}`);
}
