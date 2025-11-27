import { NextResponse } from "next/server";
import connectToDB from "@/lib/dbConnect";
import Blog from "@/models/blog.model.js";
import Video from "@/models/video.model.js"; // ensure this file exists
import Contact from "@/models/contact.model"

export async function GET() {
  try {
    await connectToDB();

    const blogCount = await Blog.countDocuments();
    const videoCount = await Video.countDocuments();
    const contactsCount = await Contact.countDocuments();

    // FIX: define uploadCount — here we combine both
    const uploadCount = blogCount + videoCount;

    return NextResponse.json(
      {
        statusCode: 200,
        success: true,
        data: {
          blogCount,
          videoCount,
          uploadCount,
          contactsCount
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { statusCode: 500, success: false, message: error.message },
      { status: 500 }
    );
  }
}
