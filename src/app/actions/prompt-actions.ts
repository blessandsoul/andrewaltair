'use server'

import dbConnect from '@/lib/db'
import MarketplacePrompt from '@/models/MarketplacePrompt'
import { revalidatePath } from 'next/cache'

export async function incrementPromptView(id: string) {
    try {
        await dbConnect()

        // Ensure ID is valid format before querying
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return { success: false, error: 'Invalid ID' }
        }

        await MarketplacePrompt.updateOne(
            { _id: id },
            { $inc: { views: 1 } }
        )

        return { success: true }
    } catch (error) {
        console.error('Error incrementing prompt view:', error)
        return { success: false, error: 'Failed to increment view' }
    }
}
