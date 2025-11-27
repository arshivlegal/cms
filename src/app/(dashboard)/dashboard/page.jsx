"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPageClient() {
  const router = useRouter();

  const [stats, setStats] = useState({
    blogCount: 0,
    videoCount: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/stats");
        const json = await res.json();
        console.log(json);
        

        setStats(json.data || {});
      } catch (err) {
        console.error("Stats error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className=" flex flex-col gap-s32">

      <h1 className="page-title-h2">Dashboard Overview 📊</h1>

      <p className="body-default max-w-2xl text-secondary">
        Track your blog, video & upload activities at a glance.
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-s24">

        {/* Blogs */}
        <div
          onClick={() => router.push("/dashboard/blog")}
          className="bg-white p-s24 rounded-r16 shadow flex flex-col gap-s8 cursor-pointer hover:scale-[1.02] transition-transform"
        >
          <h3 className="title-h4 text-primary-main">Blogs</h3>
          <p className="body-small text-secondary">Total Published Blogs</p>
          <span className="hero-h1 text-primary-main">
            {loading ? "…" : stats.blogCount}
          </span>
        </div>

        {/* Videos */}
        <div
          onClick={() => router.push("/dashboard/video")}
          className="bg-white p-s24 rounded-r16 shadow flex flex-col gap-s8 cursor-pointer hover:scale-[1.02] transition-transform"
        >
          <h3 className="title-h4 text-primary-main">Videos</h3>
          <p className="body-small text-secondary">Total Uploaded Videos</p>
          <span className="hero-h1 text-primary-main">
            {loading ? "…" : stats.videoCount}
          </span>
        </div>
        <div
          onClick={() => router.push("/dashboard/contact")}
          className="bg-white p-s24 rounded-r16 shadow flex flex-col gap-s8 cursor-pointer hover:scale-[1.02] transition-transform"
        >
          <h3 className="title-h4 text-primary-main">Contacts</h3>
          <p className="body-small text-secondary">Total contacts</p>
          <span className="hero-h1 text-primary-main">
            {loading ? "…" : stats.contactsCount}
          </span>
        </div>


      </div>
                <div
          
          className="bg-secondary-light p-s24 rounded-r16 shadow flex flex-col gap-s8  "
        >
          <h3 className="title-h4 text-primary-main">Uploads</h3>
          <p className="body-small text-secondary">Total uploads</p>
          <span className="hero-h1 text-primary-main">
            {loading ? "…" : stats.uploadCount}
          </span>
        </div>
    </div>
  );
}
