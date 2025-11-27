"use client";

import React, { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardNavbar from "@/components/DashboardNavbar";

export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground">

      {/* SIDEBAR (Desktop always visible) */}
      <div className="hidden md:block fixed top-0 left-0 h-full w-64">
        <DashboardSidebar desktop={true} />
      </div>

      {/* SIDEBAR (Mobile slide-out) */}
      <DashboardSidebar
        desktop={false}
        open={open}
        setOpen={setOpen}
      />

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">

        {/* NAVBAR always top-level */}
        <DashboardNavbar open={open} setOpen={setOpen} />

        <main className="flex-1 p-s32 overflow-y-auto  md:ml-64">
          {children}
        </main>
      </div>
    </div>
  );
}
