"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import VideoForm from "@/components/forms/VideoForm";

export default function EditVideoPage() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await axios.get(`/api/video/${id}`);
        setVideo(res.data?.data);
      } catch (error) {
        console.error("❌ Failed to fetch video:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchVideo();
  }, [id]);

  if (loading) return <p className="text-center mt-s16">Loading video...</p>;
  if (!video) return <p className="text-center mt-s16">❌ Video not found.</p>;

  return (
    <div className="flex flex-col gap-s24">
      <h1 className="page-title-h2">Edit Video</h1>
      <VideoForm initialData={video} isEditing />
    </div>
  );
}
