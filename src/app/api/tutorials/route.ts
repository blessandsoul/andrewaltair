import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Tutorial from "@/models/Tutorial";


export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");
        const limit = parseInt(searchParams.get("limit") || "10");

        const query: any = {};
        if (status) query.status = status;

        const tutorials = await Tutorial.find(query)
            .sort({ createdAt: -1 })
            .limit(limit);

        return NextResponse.json(tutorials);
    } catch (error) {
        console.error("Error fetching tutorials:", error);
        return NextResponse.json({ error: "Failed to fetch tutorials" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        // Authenticate - assuming admin check logic exists or minimal session check
        // For now preventing unauthorized public posts
        // const session = await getServerSession(authOptions);
        // if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await dbConnect();
        const body = await req.json();

        // Basic validation
        if (!body.title || !body.slug) {
            return NextResponse.json({ error: "Title and Slug are required" }, { status: 400 });
        }

        const tutorial = await Tutorial.create(body);
        return NextResponse.json(tutorial, { status: 201 });
    } catch (error) {
        console.error("Error creating tutorial:", error);
        return NextResponse.json({ error: "Failed to create tutorial" }, { status: 500 });
    }
}
