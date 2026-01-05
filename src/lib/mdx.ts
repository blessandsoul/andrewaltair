import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const articlesDirectory = path.join(process.cwd(), 'content/articles')

export type Post = {
    slug: string
    content: string
    frontmatter: {
        title: string
        id: string
        description: string
        date: string
        image: string
        tags?: string[]
        author?: string
        category?: string
        [key: string]: any
    }
}

export function getPostBySlug(slug: string): Post | null {
    try {
        const realSlug = slug.replace(/\.mdx$/, '')
        const fullPath = path.join(articlesDirectory, `${realSlug}.mdx`)

        if (!fs.existsSync(fullPath)) {
            return null
        }

        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data, content } = matter(fileContents)

        return {
            slug: realSlug,
            content,
            frontmatter: data as Post['frontmatter'],
        }
    } catch (error) {
        console.error(`Error reading post ${slug}:`, error)
        return null
    }
}

export function getAllPosts(): Post[] {
    try {
        if (!fs.existsSync(articlesDirectory)) {
            return []
        }
        const slugs = fs.readdirSync(articlesDirectory)
        const posts = slugs
            .filter((slug) => slug.endsWith('.mdx'))
            .map((slug) => {
                const post = getPostBySlug(slug)
                return post
            })
            .filter((post): post is Post => post !== null)
            // Sort posts by date in descending order
            .sort((a, b) => (new Date(b.frontmatter.date) > new Date(a.frontmatter.date) ? 1 : -1))

        return posts
    } catch (error) {
        console.error("Error getting all posts:", error)
        return []
    }
}

export async function getSlugById(id: string): Promise<string | null> {
    const targetId = id.replace('#', '').trim();
    const allPosts = getAllPosts();

    const match = allPosts.find((post) => {
        return String(post.frontmatter.id) === targetId;
    });

    return match ? match.slug : null;
}
