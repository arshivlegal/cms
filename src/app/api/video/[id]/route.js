import { NextResponse } from "next/server";
import connectToDB from "@/lib/dbConnect";
import Video from "@/models/video.model";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import mongoose from "mongoose";
import cloudinary from "@/lib/cloudinary"; // ✅ Import added
import { videoUpdateSchema } from "@/validators/video.validator";
import { validateBody } from "@/utils/validateRequest";

/* ✅ GET /api/video/[id]
   Fetch a single video by ID
*/
export async function GET(req, context) {
  try {
    await connectToDB();
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(new ApiError(400, "Invalid video ID format"), {
        status: 400,
      });
    }

    const video = await Video.findById(id);

    if (!video) {
      return NextResponse.json(new ApiError(404, "Video not found"), {
        status: 404,
      });
    }

    return NextResponse.json(
      new ApiResponse(200, video, "Video fetched successfully"),
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/video/[id] error:", error);
    return NextResponse.json(new ApiError(500, error.message), { status: 500 });
  }
}

/* ✅ PATCH /api/video/[id]
   Update video by ID (and delete old Cloudinary image if replaced)
*/
export async function PUT(req, context) {
  try {
    await connectToDB();
    const { id } = await context.params;
    const body = await req.json();

    const validated = await validateBody(videoUpdateSchema, body);
    if (validated instanceof NextResponse) return validated;

    const video = await Video.findById(id);
    if (!video)
      return NextResponse.json(new ApiError(404, "Video not found"), { status: 404 });

    Object.assign(video, validated);
    await video.save();

    return NextResponse.json(
      new ApiResponse(200, video, "Video updated successfully"),
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT /api/video/[id] error:", error);
    return NextResponse.json(new ApiError(500, error.message), { status: 500 });
  }
}


/* ✅ DELETE /api/video/[id]
   Delete a video and its Cloudinary thumbnail
*/
export async function DELETE(req, context) {
  try {
    await connectToDB();
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(new ApiError(400, "Invalid video ID format"), {
        status: 400,
      });
    }

    const deletedVideo = await Video.findByIdAndDelete(id);

    if (!deletedVideo) {
      return NextResponse.json(new ApiError(404, "Video not found"), {
        status: 404,
      });
    }

    // ✅ Delete Cloudinary thumbnail if exists
    if (deletedVideo.thumbnailPublicId) {
      try {
        await cloudinary.uploader.destroy(deletedVideo.thumbnailPublicId);
        console.log("🧹 Deleted from Cloudinary:", deletedVideo.thumbnailPublicId);
      } catch (err) {
        console.error("❌ Cloudinary deletion failed:", err);
      }
    }

    return NextResponse.json(
      new ApiResponse(200, deletedVideo, "Video deleted successfully"),
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/video/[id] error:", error);
    return NextResponse.json(new ApiError(500, error.message), { status: 500 });
  }
}
