import { NextResponse } from "next/server";

export function validateBody(schema, data) {
  try {
    return schema.parse(data);
  } catch (err) {
    // ✅ Handle Zod-style errors by checking for err.errors instead of instanceof
    if (err?.errors && Array.isArray(err.errors)) {
      const errors = err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      console.error("🧩 Validation errors:", errors);
      return NextResponse.json(
        { success: false, message: "Validation failed", errors },
        { status: 400 }
      );
    }

    // ✅ Handle unexpected runtime errors
    console.error("❌ Unexpected validation error:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
