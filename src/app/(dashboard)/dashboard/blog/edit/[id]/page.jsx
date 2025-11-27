"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import BlogForm from "@/components/forms/BlogForm";

export default function EditBlogPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/api/blog/${id}`);
        setBlog(res.data?.data);
      } catch (error) {
        console.error("Failed to fetch blog:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBlog();
  }, [id]);

  if (loading) return <p className="text-center mt-s16">Loading...</p>;
  if (!blog) return <p className="text-center mt-s16">Blog not found.</p>;

  return (
    <div className="flex flex-col gap-s24">
      <h1 className="page-title-h2">Edit Blog</h1>
      <BlogForm initialData={blog} isEditing />
    </div>
  );
}
