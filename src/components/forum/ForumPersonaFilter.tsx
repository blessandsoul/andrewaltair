"use client"

import * as React from "react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FORUM_PERSONAS } from "@/lib/georgian-forum-personas"

/**
 * Persona filter for the search page (a server component with a plain GET <form>).
 * shadcn Select is client + state-driven, so we mirror the chosen value into a hidden
 * <input name="persona"> — the GET submit still carries it. ("all" → empty = no filter;
 * Radix SelectItem forbids an empty value, hence the "all" sentinel.)
 */
export function ForumPersonaFilter({
    name = "persona",
    defaultValue = "",
}: {
    name?: string
    defaultValue?: string
}) {
    const [value, setValue] = React.useState(defaultValue || "all")
    return (
        <>
            <input type="hidden" name={name} value={value === "all" ? "" : value} />
            <Select value={value} onValueChange={setValue}>
                <SelectTrigger className="w-full sm:w-52">
                    <SelectValue placeholder="ყველა პერსონა" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">ყველა პერსონა</SelectItem>
                    {FORUM_PERSONAS.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </>
    )
}

export default ForumPersonaFilter
