"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { videoCreateSchema } from "@/validators/video.validator";
import CardVariant from "@/components/ui/preview";

import Input from "@/components/ui/Input";
import FileInput from "@/components/ui/FileInput";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

import { uploadFile } from "@/utils/uploadFile";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function VideoForm({ onSuccess, initialData = null, isEditing = false }) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(videoCreateSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      platform: "",
      redirectUrl: "",
      description: "",
      category: "General",
      tags: [],
      thumbnail: "",
      thumbnailPublicId: "",
    },
  });

  // Watch category + tags from form
  const tags = watch("tags");
  const category = watch("category");

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initialData?.thumbnail || "");
  const [uploading, setUploading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [formMessage, setFormMessage] = useState({ type: "", text: "" });

  // ------------------------------------------------------
  // Prefill on edit
  // ------------------------------------------------------
  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        platform: initialData.platform,
        redirectUrl: initialData.redirectUrl,
        description: initialData.description,
        category: initialData.category,
        tags: initialData.tags || [],
        thumbnail: initialData.thumbnail,
        thumbnailPublicId: initialData.thumbnailPublicId,
      });
      setPreviewUrl(initialData.thumbnail);
    }
  }, [initialData, reset]);

  // ------------------------------------------------------
  // Submit Handler
  // ------------------------------------------------------
  const onSubmit = async (data) => {
    setFormMessage({ type: "", text: "" });

    try {
      setUploading(true);

      // Upload thumbnail if selected
      let uploaded = null;
      if (thumbnailFile) {
        uploaded = await uploadFile(thumbnailFile);
      }

      const payload = {
        ...data,
        thumbnail: uploaded?.url || data.thumbnail,
        thumbnailPublicId: uploaded?.public_id || data.thumbnailPublicId,
      };

      let res;
      if (isEditing && initialData?._id) {
        res = await axios.put(`/api/video/${initialData._id}`, payload);
      } else {
        res = await axios.post("/api/video", payload);
      }

      setFormMessage({
        type: "success",
        text: res?.data?.message || "Video saved successfully!",
      });

      setTimeout(() => {
        router.push("/dashboard/video");
      }, 800);

      onSuccess && onSuccess();
    } catch (err) {
      setFormMessage({
        type: "error",
        text:
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Something went wrong.",
      });
    } finally {
      setUploading(false);
    }
  };

  // ------------------------------------------------------
  // Category Options
  // ------------------------------------------------------
  const categories = [
    "General",
    "Corporate Law",
    "Criminal Law",
    "Family Law",
    "Property Law",
    "Employment Law",
    "Intellectual Property",
    "Immigration Law",
    "Contract Law",
    "Consumer Protection",
    "Tax Law",
    "Civil Litigation",
  ];

  const platformOptions = [
    { label: "YouTube", value: "youtube" },
    { label: "Instagram", value: "instagram" },
    { label: "Facebook", value: "facebook" },
    { label: "LinkedIn", value: "linkedin" },
    { label: "Twitter", value: "twitter" },
  ];

  // ------------------------------------------------------
  // Add Tags
  // ------------------------------------------------------
  const addTag = (tag) => {
    const trimmed = tag.trim();
    if (!trimmed) return;
    if (tags.includes(trimmed)) return;

    const updated = [...tags, trimmed];
    setValue("tags", updated);
  };

  const removeTag = (i) => {
    const updated = tags.filter((_, idx) => idx !== i);
    setValue("tags", updated);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-s24 bg-white p-s24 rounded-r16 shadow"
    >
      {/* Feedback message */}
      {formMessage.text && (
        <div
          className={`p-s16 rounded-r8 text-small ${
            formMessage.type === "error"
              ? "bg-red-main/10 text-red-main border border-red-main/30"
              : "bg-green-100 text-green-800 border border-green-600"
          }`}
        >
          {formMessage.text}
        </div>
      )}

      {/* Title */}
      <Input
        label="Title *"
        name="title"
        register={register}
        error={errors.title}
        placeholder="Video Title"
      />

      {/* Description */}
      <Textarea
        label="Description"
        name="description"
        register={register}
        error={errors.description}
        placeholder="Short note"
      />

      {/* Platform */}
      <Select
        label="Platform *"
        name="platform"
        register={register}
        options={platformOptions}
        error={errors.platform}
      />

      {/* Category */}
      <Select
        label="Category *"
        name="category"
        register={register}
        options={categories.map((c) => ({ label: c, value: c }))}
        error={errors.category}
      />

      {/* Redirect URL */}
      <Input
        label="Redirect URL *"
        name="redirectUrl"
        register={register}
        error={errors.redirectUrl}
        placeholder="https://youtube.com/your-video"
      />

      {/* Tags */}
      <div>
        <label className="block text-default mb-s8">
          Tags <span className="text-red-main">*</span>{" "}
          <span className="text-sm text-gray-500">(Press Enter or comma)</span>
        </label>

        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addTag(tagInput);
              setTagInput("");
            }
          }}
          placeholder="e.g. civil-law"
          className="w-full px-s16 py-s12 border border-gray-300 rounded-r8 focus:outline-none focus:border-accent-main"
        />

        {errors.tags && (
          <p className="text-red-main text-sm mt-1">{errors.tags.message}</p>
        )}

        {/* Tag List */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-s8 mt-s8">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 px-s16 py-s8 bg-secondary-main text-primary-main rounded-full"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(i)}
                  className="text-red-main hover:text-red-700 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail */}
 {/* Thumbnail Upload */}
<FileInput
  label="Thumbnail Image *"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }}
  fileName={thumbnailFile?.name}
  accept="image/*"
/>

{/* LIVE PREVIEW */}
{(previewUrl || watch("title") || watch("description")) && (
  <div className="flex justify-center mt-s16">
    <CardVariant
      image={previewUrl || "/placeholder.jpg"}
      title={watch("title") || "Video Title Preview"}
      description={watch("description") || "Video description preview..."}
      variant={watch("platform") || "video"}
    />
  </div>
)}



      {previewUrl && (
        <div className="relative w-48 h-32 mt-s8">
          <img
            src={previewUrl}
            alt="Thumbnail Preview"
            className="w-full h-full object-cover rounded-r8 border"
          />
          <button
            type="button"
            onClick={() => {
              setThumbnailFile(null);
              setPreviewUrl("");
            }}
            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow hover:bg-red-700"
          >
            ✕
          </button>
        </div>
      )}

      {/* Submit Button */}
      <Button type="submit" isLoading={isSubmitting || uploading} className="w-full">
        {isSubmitting || uploading
          ? isEditing
            ? "Updating..."
            : "Uploading..."
          : isEditing
          ? "Update Video"
          : "Upload Video"}
      </Button>
    </form>
  );
}
