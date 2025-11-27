"use client";
import axios from "axios";

/**
 * Uploads a file to /api/upload and returns Cloudinary's response:
 * { success, url, public_id, resource_type }
 */
export async function uploadFile(file) {
  if (!file) throw new Error("No file provided");

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await axios.post("/api/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // ✅ Expecting standardized backend format
    // e.g. { success: true, data: { url, public_id } }
    if (!res.data || !res.data.data) {
      throw new Error("Invalid upload response from server");
    }

    const { url, public_id } = res.data.data;
    return { url, public_id };
  } catch (error) {
    console.error("❌ Upload error:", error);
    throw new Error(error.response?.data?.message || "File upload failed");
  }
}
