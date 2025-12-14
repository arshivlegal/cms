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

export default function VideoForm({ 
  onSuccess, 
  initialData = null, 
  isEditing = false 
}) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    clearErrors,
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

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initialData?.thumbnail || "");
  const [uploading, setUploading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [formMessage, setFormMessage] = useState({ type: "", text: "" });

  // Watch form values
  const watchedTitle = watch("title");
  const watchedDescription = watch("description");
  const watchedPlatform = watch("platform");
  const watchedTags = watch("tags");

  // Prefill form data on edit
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

  // Clear top error message when fields are filled
  useEffect(() => {
    if (formMessage.type === "error") {
      if (watchedTags.length > 0 && formMessage.text.includes("tag")) {
        setFormMessage({ type: "", text: "" });
      }
      if (previewUrl && formMessage.text.includes("Thumbnail")) {
        setFormMessage({ type: "", text: "" });
      }
    }
  }, [watchedTags, previewUrl, formMessage]);

  // Auto-clear field errors when criteria is met
  useEffect(() => {
    if (errors.title && watchedTitle?.length >= 3) {
      clearErrors("title");
    }
  }, [watchedTitle, errors.title]);

  // Submit Handler
  const onSubmit = async (data) => {
    setFormMessage({ type: "", text: "" });

    // Validate thumbnail
    if (!isEditing && !thumbnailFile && !previewUrl) {
      setFormMessage({
        type: "error",
        text: "Thumbnail image is required.",
      });
      return;
    }

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

      if (onSuccess) onSuccess();
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

  // Category Options
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

  // Add Tags
  const addTag = (tag) => {
    const trimmed = tag.trim().replace(/,$/, "");
    if (!trimmed) return;
    if (watchedTags.includes(trimmed)) return;

    const updated = [...watchedTags, trimmed];
    setValue("tags", updated);
  };

  const removeTag = (i) => {
    const updated = watchedTags.filter((_, idx) => idx !== i);
    setValue("tags", updated);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-s24 bg-white p-s32 rounded-r16 shadow border border-text-secondary/10"
    >
      {/* Title */}
      <Input
        label="Video Title"
        name="title"
        register={register}
        error={errors.title}
        placeholder="Enter video title"
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
        label="Platform"
        name="platform"
        register={register}
        options={platformOptions}
        error={errors.platform}
      />

      {/* Category */}
      <Select
        label="Category"
        name="category"
        register={register}
        options={categories.map((c) => ({ label: c, value: c }))}
        error={errors.category}
      />

      {/* Redirect URL */}
      <Input
        label="Redirect URL"
        name="redirectUrl"
        register={register}
        error={errors.redirectUrl}
        placeholder="https://youtube.com/your-video"
      />

      {/* Tags */}
      <div>
        <label className="text-default">
          Tags <span className="text-red-main">*</span>{" "}
          <span className="body-small">(Press Enter or comma)</span>
        </label>

        <div className="flex gap-s8 mt-s8">
          <Input
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
          />
        </div>

        {errors.tags && (
          <p className="text-red-main body-small p-1">{errors.tags.message}</p>
        )}

        {/* Tag List */}
        {watchedTags.length > 0 && (
          <div className="flex flex-wrap gap-s8 mt-s8">
            {watchedTags.map((tag, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 px-s16 py-s8 bg-secondary-main text-primary-main rounded-full"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(i)}
                  className="text-red-main hover:text-red-700 body-default"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail Upload */}
      <FileInput
        label="Thumbnail Image"
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

      {/* Thumbnail Preview */}
      {previewUrl && (
        <div className="relative w-48 h-32 mt-s8 group">
          <img
            src={previewUrl}
            alt="Thumbnail Preview"
            className="w-full h-full object-cover rounded-r8 border group-hover:opacity-70 transition"
          />
          <button
            type="button"
            onClick={() => {
              setThumbnailFile(null);
              setPreviewUrl("");
            }}
            className="absolute -top-2 -right-2 bg-red-700 text-white rounded-full px-s8 shadow group-hover:scale-110 transition-transform hover:bg-red-800"
          >
            ✕
          </button>
        </div>
      )}

      {/* Live Card Preview */}
      {(previewUrl || watchedTitle || watchedDescription) && (
        <div className="flex justify-center mt-s24">
          <CardVariant
            image={previewUrl || "/placeholder.jpg"}
            title={watchedTitle || "Video Title Preview"}
            description={watchedDescription || "Video description preview..."}
            variant={watchedPlatform || "video"}
          />
        </div>
      )}

      {/* Feedback message - Above Submit Button */}
      {formMessage.text && (
        <div
          className={`p-s16 rounded-r8 text-small ${
            formMessage.type === "error"
              ? "bg-red-main/10 text-red-main border border-red-main/20"
              : "bg-green-100 text-primary-main border border-primary-main/20"
          }`}
        >
          {formMessage.text}
        </div>
      )}

      {/* Submit Button */}
      <Button 
        type="submit" 
        isLoading={isSubmitting || uploading}
        disabled={isSubmitting || uploading}
      >
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