"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Card from "@/components/ui/Card";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";

export default function VideoList() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    id: null,
    title: "",
  });
  const [deleting, setDeleting] = useState(false);

  const limit = 10;

  // 📡 Fetch videos
  const fetchVideos = async (pageNum = 1, append = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const res = await axios.get(`/api/video?page=${pageNum}&limit=${limit}`);
      
      const result = Array.isArray(res.data?.data?.videos)
        ? res.data.data.videos
        : [];

      const totalVideos = res.data?.data?.total || 0;
      const totalPages = res.data?.data?.totalPages || 1;

      if (append) {
        setVideos((prev) => [...prev, ...result]);
      } else {
        setVideos(result);
      }

      setTotal(totalVideos);
      setHasMore(pageNum < totalPages);
    } catch (err) {
      console.error("❌ Failed to fetch videos:", err);
      if (!append) setVideos([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // 🔽 Load more handler
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchVideos(nextPage, true);
  };

  // 🗑️ Delete confirmed video
  const handleDelete = async () => {
    if (!deleteModal.id) return;
    try {
      setDeleting(true);
      await axios.delete(`/api/video/${deleteModal.id}`);
      setDeleteModal({ open: false, id: null, title: "" });
      
      // Reset and reload from page 1
      setPage(1);
      fetchVideos(1, false);
    } catch (err) {
      console.error("❌ Failed to delete video:", err);
      alert("Failed to delete video. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  // 🚀 Load videos on mount
  useEffect(() => {
    fetchVideos(1, false);
  }, []);

  // 🕓 Loading state
  if (loading) {
    return (
      <p className="text-center text-secondary mt-s32">Loading videos...</p>
    );
  }

  // 🪣 Empty state
  if (!Array.isArray(videos) || videos.length === 0) {
    return (
      <p className="text-center text-secondary mt-s32">
        No videos found.
      </p>
    );
  }

  // 🎬 Render grid + modal
  return (
    <>
      {/* ✅ Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null, title: "" })}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Video"
        message={`Are you sure you want to delete "${deleteModal.title}"? This action cannot be undone.`}
      />

      {/* 🎥 Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-s32 mx-auto">
        {videos.map((v) => (
          <Card
            key={v._id}
            title={v.title}
            subtitle={v.platform}
            thumbnail={v.thumbnail}
            description={v.description}
            onEdit={() =>
              (window.location.href = `/dashboard/video/edit/${v._id}`)
            }
            onDelete={() =>
              setDeleteModal({
                open: true,
                id: v._id,
                title: v.title,
              })
            }
          />
        ))}
      </div>

      {/* 🔽 Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="px-6 py-3 bg-accent-main text-white rounded-lg hover:bg-accent-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingMore ? "Loading..." : `Load More (${videos.length} of ${total})`}
          </button>
        </div>
      )}

      {/* ✅ All loaded message */}
      {!hasMore && videos.length > 0 && (
        <div className="text-center mt-8 text-gray-500">
          All videos loaded ({videos.length} of {total})
        </div>
      )}
    </>
  );
}