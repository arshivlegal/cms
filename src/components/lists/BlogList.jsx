"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Card from "@/components/ui/Card";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import Button from "../ui/Button";
export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    id: null,
    title: "",
  });
  const [deleting, setDeleting] = useState(false);

  const limit = 20;

  // ✅ Fetch blogs
  const fetchBlogs = async (pageNum = 1, append = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const res = await axios.get(`/api/blog?page=${pageNum}&limit=${limit}`);

      const result = Array.isArray(res.data?.data?.blogs)
        ? res.data.data.blogs
        : [];

      const totalBlogs = res.data?.data?.total || 0;
      const totalPages = res.data?.data?.totalPages || 1;

      if (append) {
        setBlogs((prev) => [...prev, ...result]);
      } else {
        setBlogs(result);
      }

      setTotal(totalBlogs);
      setHasMore(pageNum < totalPages);
      setError("");
    } catch (err) {
      console.error("❌ Failed to fetch blogs:", err);
      setError("Failed to load blogs. Please try again later.");
      if (!append) setBlogs([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // ✅ Load more handler
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchBlogs(nextPage, true);
  };

  // ✅ Confirm delete
  const handleDelete = async () => {
    if (!deleteModal.id) return;
    try {
      setDeleting(true);
      await axios.delete(`/api/blog/${deleteModal.id}`);
      setDeleteModal({ open: false, id: null, title: "" });
      
      // Reset and reload from page 1
      setPage(1);
      fetchBlogs(1, false);
    } catch (err) {
      console.error("❌ Failed to delete blog:", err);
      alert("Failed to delete blog. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  // ✅ Load blogs on mount
  useEffect(() => {
    fetchBlogs(1, false);
  }, []);

  // 🌀 Loading
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg">Loading blogs...</div>
      </div>
    );
  }

  // ❌ Error
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  // ✅ Render Grid + Modal
  return (
    <>
      {/* 🧩 Delete Confirmation Popup */}
      <ConfirmDeleteModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null, title: "" })}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Blog"
        message={`Are you sure you want to delete "${deleteModal.title}"? This action cannot be undone.`}
      />

      {/* 📰 Blog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-s32 mx-auto">
        {blogs.map((b) => (
          <Card
            key={b._id}
            title={b.title}
            thumbnail={b.thumbnail}
            description={b.description}
            onEdit={() =>
              (window.location.href = `/dashboard/blog/edit/${b._id}`)
            }
            onDelete={() =>
              setDeleteModal({
                open: true,
                id: b._id,
                title: b.title,
              })
            }
          />
        ))}
      </div>

      {/* 🔽 Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={handleLoadMore}
            disabled={loadingMore}
            varient={"ctaAcent"}
          >
            {loadingMore ? "Loading..." : `Load More (${blogs.length} of ${total})`}
          </Button>
        </div>
      )}

      {/* ✅ All loaded message */}
      {!hasMore && blogs.length > 0 && (
        <div className="text-center mt-8 text-gray-500">
          All blogs loaded ({blogs.length} of {total})
        </div>
      )}
    </>
  );
}