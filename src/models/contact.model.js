import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [3, "Full name must be at least 3 characters long"],
    },

    email: {
      type: String,
      required: [true, "Email address is required"],
      trim: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "Please enter a valid email address"],
      index: true, // for faster searches
    },

    phone: {
      type: String,
      trim: true,
      match: [/^\+?[0-9]{10,15}$/, "Please enter a valid phone number"],
      index: true,
    },

    message: {
      type: String,
      required: [true, "Message cannot be empty"],
      minlength: [10, "Message must be at least 10 characters long"],
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "resolved"],
      default: "pending",
      index: true,
    }
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

/* 🧩 Indexes for optimized search & filters */
ContactSchema.index({ fullName: "text", email: "text", message: "text" });

export default mongoose.models.Contact || mongoose.model("Contact", ContactSchema);
 