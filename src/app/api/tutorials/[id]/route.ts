import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Tutorial from "@/models/Tutorial";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectToDatabase();
        const tutorial = await Tutorial.findById(params.id); // Or findBySlug if we use slug in URL

        if (!tutorial) {
            // Try slug
            const bySlug = await Tutorial.findOne({ slug: params.id });
            if (bySlug) return NextResponse.json(bySlug);

            return NextResponse.json({ error: "Tutorial not found" }, { status: 404 });
        }

        return NextResponse.json(tutorial);
    } catch (error) {
        console.error("Error fetching tutorial:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectToDatabase();
        const body = await req.json();

        const tutorial = await Tutorial.findByIdAndUpdate(
            params.id,
            { ...body },
            { new: true, runValidators: true }
        );

        if (!tutorial) {
            return NextResponse.json({ error: "Tutorial not found" }, { status: 404 });
        }

        return NextResponse.json(tutorial);
    } catch (error) {
        console.error("Error updating tutorial:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectToDatabase();
        const tutorial = await Tutorial.findByIdAndDelete(params.id);

        if (!tutorial) {
            return NextResponse.json({ error: "Tutorial not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Tutorial deleted successfully" });
    } catch (error) {
        console.error("Error deleting tutorial:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
