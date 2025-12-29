import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Tool from "@/models/Tool"
import mongoose from "mongoose"

// GET - Get a single tool by ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect()
        const { id } = await params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid tool ID" }, { status: 400 })
        }

        const tool = await Tool.findById(id).lean()

        if (!tool) {
            return NextResponse.json({ error: "Tool not found" }, { status: 404 })
        }

        // Increment views
        await Tool.findByIdAndUpdate(id, { $inc: { views: 1 } })

        return NextResponse.json({
            id: tool._id.toString(),
            name: tool.name,
            description: tool.description,
            url: tool.url,
            logo: tool.logo,
            category: tool.category,
            pricing: tool.pricing,
            rating: tool.rating,
            featured: tool.featured,
            views: tool.views,
        })
    } catch (error) {
        console.error("Get tool error:", error)
        return NextResponse.json({ error: "Failed to fetch tool" }, { status: 500 })
    }
}

// PUT - Update a tool
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect()
        const { id } = await params
        const body = await request.json()

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid tool ID" }, { status: 400 })
        }

        const tool = await Tool.findByIdAndUpdate(
            id,
            {
                $set: {
                    name: body.name,
                    description: body.description,
                    url: body.url,
                    logo: body.logo,
                    category: body.category,
                    pricing: body.pricing,
                    rating: body.rating,
                    featured: body.featured,
                },
            },
            { new: true }
        ).lean()

        if (!tool) {
            return NextResponse.json({ error: "Tool not found" }, { status: 404 })
        }

        return NextResponse.json({
            id: tool._id.toString(),
            name: tool.name,
            description: tool.description,
            url: tool.url,
            logo: tool.logo,
            category: tool.category,
            pricing: tool.pricing,
            rating: tool.rating,
            featured: tool.featured,
        })
    } catch (error) {
        console.error("Update tool error:", error)
        return NextResponse.json({ error: "Failed to update tool" }, { status: 500 })
    }
}

// DELETE - Delete a tool
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect()
        const { id } = await params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid tool ID" }, { status: 400 })
        }

        const tool = await Tool.findByIdAndDelete(id)

        if (!tool) {
            return NextResponse.json({ error: "Tool not found" }, { status: 404 })
        }

        return NextResponse.json({ message: "Tool deleted successfully" })
    } catch (error) {
        console.error("Delete tool error:", error)
        return NextResponse.json({ error: "Failed to delete tool" }, { status: 500 })
    }
}
