import Link from "next/link"
import { Button } from "@/components/ui/button"
import BlogPostClient from "../../blog/[slug]/BlogPostClient"
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import dbConnect from "@/lib/db"
import Tutorial from "@/models/Tutorial"

// Function to fetch data
async function getTutorial(slug: string) {
    await dbConnect()
    const tutorial = await Tutorial.findOne({ slug: slug }).lean()
    if (!tutorial) return null
    return JSON.parse(JSON.stringify(tutorial))
}


export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const tutorial = await getTutorial(params.slug)
    if (!tutorial) return { title: 'ტუტორიალი არ მოიძებნა | Andrew Altair' }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://andrewaltair.ge'
    let coverImage = tutorial.coverImage
    if (coverImage && !coverImage.startsWith('http')) {
        coverImage = `${siteUrl}${coverImage.startsWith('/') ? '' : '/'}${coverImage}`
    } else if (!coverImage) {
        coverImage = `${siteUrl}/og.png`
    }

    return {
        title: `${tutorial.title} | Andrew Altair`,
        description: tutorial.intro,
        openGraph: {
            title: tutorial.title,
            description: tutorial.intro,
            url: `${siteUrl}/tutorials/${params.slug}`,
            images: [{ url: coverImage }],
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: tutorial.title,
            description: tutorial.intro,
            images: [coverImage],
        }
    }
}

export default async function TutorialDetailPage({ params }: { params: { slug: string } }) {
    const tutorial = await getTutorial(params.slug)

    if (!tutorial) {
        return notFound()
    }

    // Transform tutorial modules into interactive sections
    // This allows RichPostContent to render interactive components like Checkboxes and Nav
    const sections: any[] = [];

    // Tools
    if (tutorial.tools) {
        sections.push({
            type: 'cta',
            title: 'საჭირო ხელსაწყოები',
            content: tutorial.tools,
            icon: 'Wrench' // Maps to TbTool
        });
    }

    // Modules
    if (tutorial.modules) {
        tutorial.modules.forEach((module: any, index: number) => {
            sections.push({
                type: 'tutorial-step',
                title: module.title,
                content: module.explanation,
                quote: module.quote,
                stepNumber: index + 1
            });
        })
    }

    // Conclusion
    if (tutorial.conclusion) {
        sections.push({
            type: 'tip', // Green styling
            title: 'მზად ხართ გასაშვებად?',
            content: tutorial.conclusion,
            icon: 'CheckCircle' // Maps to TbCircleCheck
        });
    }

    // Confidential Advice - Secret Section
    if (tutorial.metaAdvice) {
        sections.push({
            type: 'secret',
            content: tutorial.metaAdvice
        });
    }


    // MAPPING TUTORIAL TO POST INTERFACE
    // We mock some fields that don't verify strictly against DB to reuse the component
    const mappedPost: any = {
        id: tutorial._id.toString(),
        slug: tutorial.slug,
        title: tutorial.title,
        excerpt: tutorial.intro,
        content: '', // Not used when sections are present
        sections: sections, // Interactive sections
        categories: ['tutorials'], // Hardcoded category
        tags: tutorial.tags || [],
        coverImage: tutorial.coverImage,
        coverImages: { horizontal: tutorial.coverImage, vertical: tutorial.coverImage }, // Mock
        author: {
            name: 'Andrew Altair',
            role: 'Author'
        },
        publishedAt: tutorial.createdAt || new Date().toISOString(),
        updatedAt: tutorial.updatedAt || new Date().toISOString(),
        readingTime: 10, // Mock or calculate
        views: 0, // Should come from DB but schema might differ
        comments: 0,
        shares: 0,
        reactions: { like: 0, love: 0, fire: 0 },
        relatedPosts: [] // Empty for now
    }

    // Related posts for sidebar (mock or fetch random)
    const relatedPosts: any[] = [] // Empty for now to be safe


    return (
        <article>
            {/* Using the actual BlogPostClient which renders Layout, Sidebar, etc */}
            <BlogPostClient
                post={mappedPost}
                prevPost={null}
                nextPost={null}
                relatedPosts={relatedPosts}
            />
        </article>
    )
}
