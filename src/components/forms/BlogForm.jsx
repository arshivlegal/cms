
"use client";

import React, { useState, useRef, useCallback, memo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import CardVariant from "@/components/ui/preview";

import { blogCreateSchema } from "@/validators/blog.validator";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import FileInput from "@/components/ui/FileInput";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import RichEditor from "@/components/RichEditor";
import { uploadFile } from "@/utils/uploadFile";
import { useRouter } from "next/navigation";

const MemoizedRichEditor = memo(RichEditor);

// ------------------------------------------------------------
// ⭐ CLEAN HTML (Fix new blogs not matching old styles)
// ------------------------------------------------------------
const cleanHtml = (html) => {
  if (!html) return "";

  let cleaned = html
    .replace(/<div>/g, "<p>")             // div → p
    .replace(/<\/div>/g, "</p>")
    .replace(/<p><br><\/p>/g, "")         // remove empty <p>
    .replace(/&nbsp;/g, " ")              // remove weird spaces
    .replace(/\s+/g, " ")                 // collapse spaces
    .trim();

  const plainText = cleaned.replace(/<[^>]+>/g, "").trim();
  if (!plainText) return "";

  return cleaned;
};

// ------------------------------------------------------------
// ⭐ CHECK FOR EMPTY HTML
// ------------------------------------------------------------
const isHtmlContentEmpty = (html) => {
  if (!html) return true;
  const text = html.replace(/<[^>]+>/g, "").trim();
  return text.length === 0;
};

export default function BlogForm({ onSuccess, initialData = null, isEditing = false }) {
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initialData?.thumbnail || "");
  const [uploading, setUploading] = useState(false);

  const [topMessage, setTopMessage] = useState({ type: "", text: "" });
  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });

  // Tags
  const [tags, setTags] = useState(initialData?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [tagError, setTagError] = useState("");

  // ⭐ Editor is handled outside RHF
  const editorRef = useRef(initialData?.content || "");
const router = useRouter();

  // ------------------------------------------------------------
  // ⭐ Apply new cleanHtml logic + error auto-clear
  // ------------------------------------------------------------
  const handleEditorChange = useCallback(
    (value) => {
      const cleaned = cleanHtml(value);
      editorRef.current = cleaned;

      if (cleaned.length > 0) {
        if (topMessage.type === "error" && topMessage.text.includes("Content")) {
          setTopMessage({ type: "", text: "" });
        }
        if (submitMessage.type === "error" && submitMessage.text.includes("Content")) {
          setSubmitMessage({ type: "", text: "" });
        }
      }
    },
    [topMessage, submitMessage]
  );

  // ------------------------------------------------------------
  // react-hook-form
  // ------------------------------------------------------------
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(blogCreateSchema),
    mode: "onChange",
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      category: initialData?.category || "General",
      thumbnail: initialData?.thumbnail || "",
      thumbnailPublicId: initialData?.thumbnailPublicId || "",
    },
  });

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

  // ------------------------------------------------------------
  // ⭐ Submit handler (A + B fixes applied)
  // ------------------------------------------------------------
  const onSubmit = async (formData) => {
    setTopMessage({ type: "", text: "" });
    setSubmitMessage({ type: "", text: "" });

    let cleanedContent = cleanHtml(editorRef.current);

    // VALIDATE CONTENT (fixed)
    if (!cleanedContent || isHtmlContentEmpty(cleanedContent)) {
      setTopMessage({
        type: "error",
        text: "Content is required. Please write your blog content.",
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // VALIDATE TAGS
    if (!Array.isArray(tags) || tags.length === 0) {
      setTopMessage({
        type: "error",
        text: "At least one tag is required.",
      });
      setTagError("At least one tag is required");
      return;
    }

    // VALIDATE THUMBNAIL
    if (!isEditing && !thumbnailFile && !previewUrl) {
      setTopMessage({
        type: "error",
        text: "Thumbnail image is required.",
      });
      return;
    }

    try {
      setUploading(true);

      let uploadedImage = null;
      if (thumbnailFile) {
        uploadedImage = await uploadFile(thumbnailFile);
      }

      const payload = {
        title: formData.title,
        description: formData.description || "",
        content: cleanedContent,
        category: formData.category,
        tags,
        thumbnail: uploadedImage?.url || previewUrl || formData.thumbnail,
        thumbnailPublicId: uploadedImage?.public_id || formData.thumbnailPublicId,
      };

      let res;
      if (isEditing && initialData?._id) {
        res = await axios.put(`/api/blog/${initialData._id}`, payload);
      } else {
        res = await axios.post(`/api/blog`, payload);
      }

      const msg =
        res?.data?.message ||
        (isEditing ? "Blog updated successfully!" : "Blog published successfully!");

      setTopMessage({ type: "success", text: msg });
      setSubmitMessage({ type: "success", text: msg });

      setTimeout(() => {
  router.push("/dashboard/blog");
}, 1000);

      if (!isEditing) {
        reset();
        editorRef.current = "";
        setPreviewUrl("");
        setThumbnailFile(null);
        setTags([]);
        setTagInput("");
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Something went wrong.";

      setTopMessage({ type: "error", text: backendMessage });
      setSubmitMessage({ type: "error", text: backendMessage });
    } finally {
      setUploading(false);
    }
  };

  // ------------------------------------------------------------
  // ⭐ UI
  // ------------------------------------------------------------
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-s24 bg-white p-s32 rounded-r16 shadow border border-text-secondary/10"
    >
      {/* TOP MESSAGE */}
      {topMessage.text && (
        <div
          className={`p-s16 rounded-r8 text-small ${
            topMessage.type === "error"
              ? "bg-red-main/10 text-red-main border border-red-main/20"
              : "bg-green-100 text-primary-main border border-primary-main/20"
          }`}
        >
          {topMessage.text}
        </div>
      )}

      {/* TITLE */}
      <div>
        <label className=" body-defalut">Blog Title <span className="text-red-main ">*</span></label>
        <Input name="title" register={register} placeholder="Enter blog title" />
        {errors.title && <p className="text-red-main body-small p-1">{errors.title.message}</p>}
      </div>

      {/* DESCRIPTION */}
  
         <Textarea
           label="Description"
           name="description"
           register={register}
           placeholder={"short note"}
           error={errors.description}
         />

      {/* CONTENT EDITOR */}
      <div>
        <label className=" text-default">Content <span className="text-red-main ">*</span></label>
        <MemoizedRichEditor value={editorRef.current} onChange={handleEditorChange} />
      </div>

      {/* CATEGORY */}
      <div>
        <label className=" text-default">Category <span className="text-red-main ">*</span></label>
        <Select
          name="category"
          register={register}
          error={errors.category}
          options={categories.map((c) => ({ label: c, value: c }))}
        />
      </div>

      {/* TAGS */}
      <div>
        <label className=" text-default">
          Tags <span className="text-red-main ">*</span> <span className="body-small">(Press Enter or comma)</span>
        </label>

        <div className="flex gap-s8">
          <Input
            type="text"
            value={tagInput}
            onChange={(e) => {
              setTagInput(e.target.value);
              setTagError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                const trimmed = tagInput.trim().replace(/,$/, "");
                if (!trimmed) return;
                if (tags.includes(trimmed)) return setTagError("Tag already exists");
                setTags([...tags, trimmed]);
                setTagInput("");
              }
            }}
            placeholder="e.g. civil-law"
          />
        </div>

        {tagError && <p className="text-red-main body-small p-1">{tagError}</p>}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-s8 mt-s8">
            {tags.map((t, i) => (
              <span
                key={i}
                className="px-s16 py-s8 bg-secondary-main text-primary-main rounded-full"
              >
                {t}
                <button
                  className="ml-s16 text-red-main body-default"
                  onClick={() => setTags(tags.filter((_, idx) => idx !== i))}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* THUMBNAIL */}
      <div>

        <FileInput
        label={"Thumbnail Image"}
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setThumbnailFile(file);
              setPreviewUrl(URL.createObjectURL(file));
            }
          }}
          fileName={thumbnailFile?.name}
        />
      </div>

      {/* PREVIEW */}
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
      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full px-s8  shadow
                 group-hover:scale-110 transition-transform hover:bg-red-700"
    >
      ✕
    </button>
  </div>
)}

{(previewUrl || watch("title") || watch("description")) && (
  <div className="flex justify-center mt-s24">
    <CardVariant
      title={watch("title") || "Blog Title Preview"}
      description={watch("description") || "Blog description preview..."}
      image={previewUrl || "/placeholder.jpg"}
      variant="blog"
    />
  </div>
)}


      {/* SUBMIT */}
      <Button
        type="submit"
        disabled={uploading || isSubmitting}
        isLoading={uploading || isSubmitting}
      >
        {isSubmitting || uploading
          ? isEditing
            ? "Updating..."
            : "Publishing..."
          : isEditing
          ? "Update Blog"
          : "Publish Blog"}
      </Button>
    </form>
  );
}
