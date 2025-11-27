import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    thumbnail: {
      type: String,
      default: "",
    },
    description: { 
      type: String, 
      default: "" 
    },
    category: {
      type: String,
      default: "General",
      trim: true,
    },
    thumbnailPublicId: {
      type: String,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

// ✅ CORRECTED: Full-text index including content
BlogSchema.index(
  { 
    title: "text", 
    description: "text", 
    content: "text",      // ← THIS WAS MISSING!
    tags: "text" ,
    category:"text"
  },
  { 
    weights: { 
      title: 5,           // Highest priority
      tags: 3,            // High priority
      description: 4,     // Medium priority
      content: 1 ,
      category  :2       // Lower priority
    } 
  }
);

// Add these to your BlogSchema if you have many documents
BlogSchema.index({ title: 1 });
BlogSchema.index({ category: 1 });
BlogSchema.index({ description: 1 });

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
