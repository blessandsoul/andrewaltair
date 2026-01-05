import { NextRequest, NextResponse } from 'next/server'

interface SEOAnalysisResult {
    score: number
    tips: {
        type: 'success' | 'warning' | 'error'
        message: string
    }[]
    details: {
        metaTitleOk: boolean
        metaDescriptionOk: boolean
        focusKeywordOk: boolean
        focusKeywordInTitle: boolean
        focusKeywordInExcerpt: boolean
        focusKeywordDensity: number
        contentLength: number
        hasImages: boolean
        hasInternalLinks: boolean
        readability: 'easy' | 'medium' | 'hard'
    }
}

export async function POST(request: NextRequest) {
    try {
        const {
            title,
            metaTitle,
            metaDescription,
            focusKeyword,
            excerpt,
            content,
            hasImages,
            tags
        } = await request.json()

        const tips: SEOAnalysisResult['tips'] = []
        let score = 0
        const maxScore = 100

        // 1. Meta Title analysis (10 points)
        const actualMetaTitle = metaTitle || title || ''
        const metaTitleLength = actualMetaTitle.length
        const metaTitleOk = metaTitleLength >= 30 && metaTitleLength <= 60
        if (metaTitleOk) {
            score += 10
            tips.push({ type: 'success', message: `✅ SEO სათაური (${metaTitleLength}/60) - იდეალურია!` })
        } else if (metaTitleLength < 30) {
            score += 3
            tips.push({ type: 'warning', message: `⚠️ SEO სათაური ძალიან მოკლეა (${metaTitleLength}/60). რეკომენდირებულია 30-60 სიმბოლო.` })
        } else {
            score += 5
            tips.push({ type: 'error', message: `❌ SEO სათაური ძალიან გრძელია (${metaTitleLength}/60). Google ჭრის 60+-ს.` })
        }

        // 2. Meta Description analysis (10 points)
        const actualMetaDesc = metaDescription || excerpt || ''
        const metaDescLength = actualMetaDesc.length
        const metaDescriptionOk = metaDescLength >= 120 && metaDescLength <= 160
        if (metaDescriptionOk) {
            score += 10
            tips.push({ type: 'success', message: `✅ Meta აღწერა (${metaDescLength}/160) - შესანიშნავია!` })
        } else if (metaDescLength < 120) {
            score += 4
            tips.push({ type: 'warning', message: `⚠️ Meta აღწერა მოკლეა (${metaDescLength}/160). რეკომენდირებულია 120-160.` })
        } else {
            score += 6
            tips.push({ type: 'error', message: `❌ Meta აღწერა გრძელია (${metaDescLength}/160). Google ჭრის.` })
        }

        // 3. Focus Keyword analysis (25 points)
        const focusKeywordOk = !!focusKeyword && focusKeyword.length >= 2
        const contentLower = (content || '').toLowerCase()
        const titleLower = (title || '').toLowerCase()
        const excerptLower = (excerpt || '').toLowerCase()
        const keywordLower = (focusKeyword || '').toLowerCase()

        if (!focusKeywordOk) {
            tips.push({ type: 'error', message: '❌ Focus Keyword არ არის მითითებული!' })
        } else {
            score += 5

            // Focus keyword in title
            const focusKeywordInTitle = titleLower.includes(keywordLower)
            if (focusKeywordInTitle) {
                score += 7
                tips.push({ type: 'success', message: '✅ Focus Keyword არის სათაურში!' })
            } else {
                tips.push({ type: 'warning', message: '⚠️ Focus Keyword არ არის სათაურში.' })
            }

            // Focus keyword in excerpt
            const focusKeywordInExcerpt = excerptLower.includes(keywordLower)
            if (focusKeywordInExcerpt) {
                score += 5
                tips.push({ type: 'success', message: '✅ Focus Keyword არის მოკლე აღწერაში!' })
            } else {
                tips.push({ type: 'warning', message: '⚠️ დაამატე Focus Keyword მოკლე აღწერაში.' })
            }

            // Keyword density
            const wordCount = contentLower.split(/\s+/).length
            const keywordMatches = (contentLower.match(new RegExp(keywordLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length
            const focusKeywordDensity = wordCount > 0 ? (keywordMatches / wordCount) * 100 : 0

            if (focusKeywordDensity >= 0.5 && focusKeywordDensity <= 2.5) {
                score += 8
                tips.push({ type: 'success', message: `✅ Keyword სიხშირე (${focusKeywordDensity.toFixed(1)}%) - კარგია!` })
            } else if (focusKeywordDensity < 0.5) {
                tips.push({ type: 'warning', message: `⚠️ Keyword სიხშირე დაბალია (${focusKeywordDensity.toFixed(1)}%). გამოიყენე მეტად.` })
            } else {
                tips.push({ type: 'error', message: `❌ Keyword სიხშირე ძალიან მაღალია (${focusKeywordDensity.toFixed(1)}%). ეს spam-ია.` })
            }
        }

        // 4. Content Length (15 points)
        const contentLength = (content || '').length
        if (contentLength >= 2000) {
            score += 15
            tips.push({ type: 'success', message: `✅ კონტენტი საკმარისად დიდია (${contentLength} სიმბოლო)` })
        } else if (contentLength >= 1000) {
            score += 10
            tips.push({ type: 'warning', message: `⚠️ კონტენტი საშუალოა (${contentLength}). 2000+ უკეთესია SEO-სთვის.` })
        } else {
            score += 3
            tips.push({ type: 'error', message: `❌ კონტენტი მოკლეა (${contentLength}). Google ანიჭებს უფრო დიდ ტექსტებს უპირატესობას.` })
        }

        // 5. Images (10 points)
        if (hasImages) {
            score += 10
            tips.push({ type: 'success', message: '✅ სურათები დამატებულია!' })
        } else {
            tips.push({ type: 'warning', message: '⚠️ დაამატე სურათები ვიზუალური მიმზიდველობისთვის.' })
        }

        // 6. Tags (15 points)
        const tagCount = (tags || []).length
        if (tagCount >= 10) {
            score += 15
            tips.push({ type: 'success', message: `✅ საკმარისი თეგები (${tagCount})!` })
        } else if (tagCount >= 5) {
            score += 8
            tips.push({ type: 'warning', message: `⚠️ მეტი თეგი გაზრდის ხილვადობას (${tagCount}/10+).` })
        } else {
            score += 2
            tips.push({ type: 'error', message: `❌ თეგები ძალიან ცოტაა (${tagCount}). დაამატე სულ მცირე 10.` })
        }

        // 7. Readability (15 points)
        const avgSentenceLength = contentLength / Math.max(1, (content || '').split(/[.!?]+/).length)
        let readability: 'easy' | 'medium' | 'hard' = 'medium'
        if (avgSentenceLength < 100) {
            readability = 'easy'
            score += 15
            tips.push({ type: 'success', message: '✅ წაკითხვადობა - კარგია! მოკლე წინადადებები.' })
        } else if (avgSentenceLength < 200) {
            readability = 'medium'
            score += 10
            tips.push({ type: 'warning', message: '⚠️ წაკითხვადობა - საშუალო. შეამოკლე რამდენიმე წინადადება.' })
        } else {
            readability = 'hard'
            score += 3
            tips.push({ type: 'error', message: '❌ წაკითხვადობა - რთული. წინადადებები ძალიან გრძელია.' })
        }

        // Sort tips: errors first, then warnings, then success
        tips.sort((a, b) => {
            const order = { error: 0, warning: 1, success: 2 }
            return order[a.type] - order[b.type]
        })

        const result: SEOAnalysisResult = {
            score: Math.min(score, maxScore),
            tips,
            details: {
                metaTitleOk,
                metaDescriptionOk,
                focusKeywordOk,
                focusKeywordInTitle: titleLower.includes(keywordLower),
                focusKeywordInExcerpt: excerptLower.includes(keywordLower),
                focusKeywordDensity: 0,
                contentLength,
                hasImages: !!hasImages,
                hasInternalLinks: false,
                readability
            }
        }

        return NextResponse.json({
            success: true,
            ...result
        })

    } catch (error) {
        console.error('SEO analysis error:', error)
        return NextResponse.json(
            { error: 'SEO analysis failed', score: 0, tips: [] },
            { status: 500 }
        )
    }
}
