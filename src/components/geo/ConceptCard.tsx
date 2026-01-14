"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { TbBulb } from "react-icons/tb"

interface ConceptCardProps {
    term: string
    definition: string
    context?: string
    tags?: string[]
}

export function ConceptCard({ term, definition, context, tags = [] }: ConceptCardProps) {
    // JSON-LD for DefinedTerm
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "DefinedTerm",
        "name": term,
        "description": definition,
        "inDefinedTermSet": "Andrew Altair's AI Glossary"
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="my-8"
        >
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <Card className="bg-muted/10 border-l-4 border-l-primary border-y-white/5 border-r-white/5 overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <TbBulb className="w-24 h-24 text-primary" />
                </div>

                <CardHeader className="pb-2 relative">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs uppercase tracking-widest border-primary/30 text-primary">
                            Core Concept
                        </Badge>
                    </div>
                    <CardTitle className="text-2xl font-bold text-foreground">
                        {term}
                    </CardTitle>
                </CardHeader>

                <CardContent className="relative space-y-4">
                    <p className="text-lg font-medium text-foreground/90 italic">
                        "{definition}"
                    </p>

                    {context && (
                        <p className="text-muted-foreground text-sm leading-relaxed border-t border-white/5 pt-4">
                            <strong>Why it matters:</strong> {context}
                        </p>
                    )}

                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                            {tags.map(tag => (
                                <span key={tag} className="text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    )
}
