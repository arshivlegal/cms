import { NextResponse } from "next/server";
import connectToDB from "@/lib/dbConnect";
import Blog from "@/models/blog.model";

export const runtime = "nodejs";

/* GET /api/blog/slug/[slug] */
export async function GET(req, context) {
  try {
    await connectToDB();
    
    // ✅ CORRECT WAY: Await params first, then destructure
    const params = await context.params;
    const { slug } = params;
    const blog = await Blog.findOne({ slug })
      .select(
        "title content thumbnail description category tags createdAt isPublished duration slug"
      )
      .lean();

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: blog },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET SLUG ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
