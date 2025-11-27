import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Video title is required"],
      trim: true,
    },
    thumbnail: {
      type: String,
      required: [true, "Thumbnail URL is required"],
    },
    platform: {
      type: String,
      enum: ["youtube", "instagram", "facebook", "linkedin", "twitter"],
      required: [true, "Platform is required"],
      index: true,
    },
    thumbnailPublicId: String,
    redirectUrl: {
      type: String,
      required: [true, "Redirect URL is required"],
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    category: {
      type: String,
      default: "General",
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

// ✅ Full text index including title, description, category, and tags
VideoSchema.index(
  { 
    title: "text", 
    description: "text", 
    category: "text",
    tags: "text"
  },
  { 
    weights: { 
      title: 5,           // Highest priority
      tags: 3,            // High priority
      description: 2,     // Medium priority
      category: 2         // Medium priority
    } 
  }
);

export default mongoose.models.Video || mongoose.model("Video", VideoSchema);