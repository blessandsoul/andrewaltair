import dbConnect from "@/lib/db"
import Tutorial from "@/models/Tutorial"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { TbBook } from "react-icons/tb"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Blueprints | Andrew Altair",
    description: "Systematic tutorials and life algorithms.",
}

// Function to get data
export const dynamic = 'force-dynamic';

async function getTutorials() {
    await dbConnect()
    // Fetch only published tutorials
    const tutorials = await Tutorial.find({ status: 'published' })
        .sort({ createdAt: -1 })
        .lean()

    // Serialize for Next.js (ObjectId to string)
    return JSON.parse(JSON.stringify(tutorials))
}

export default async function TutorialsPage() {
    const tutorials = await getTutorials()

    return (
        <div className="container mx-auto py-20 px-4 min-h-screen">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                    Blueprints
                </h1>
                <p className="text-xl text-muted-foreground">
                    Don't just learn. Install systems.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tutorials.map((tutorial: any) => (
                    <Link href={`/tutorials/${tutorial.slug}`} key={tutorial._id} className="group">
                        <Card className="h-full overflow-hidden border-2 border-transparent hover:border-purple-500/20 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 bg-card/50 backdrop-blur-sm">
                            {/* Cover Image */}
                            <div className="aspect-video relative bg-muted/50 overflow-hidden">
                                {tutorial.coverImage ? (
                                    <img
                                        src={tutorial.coverImage}
                                        alt={tutorial.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full text-muted-foreground/20">
                                        <TbBook className="w-16 h-16" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                                    <h3 className="text-xl font-bold text-white line-clamp-2 leading-tight">
                                        {tutorial.title}
                                    </h3>
                                </div>
                            </div>

                            <CardContent className="p-6 space-y-4">
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {tutorial.intro}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {tutorial.tags?.slice(0, 3).map((tag: string) => (
                                        <Badge key={tag} variant="secondary" className="bg-primary/5 text-primary">
                                            #{tag}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {tutorials.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                    <TbBook className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No blueprints deployed yet.</p>
                </div>
            )}
        </div>
    )
}
