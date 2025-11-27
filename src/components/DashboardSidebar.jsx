"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Video,
  ListVideo,
  ListChecks,
  Settings,
  Contact,
} from "lucide-react";

export default function DashboardSidebar({ desktop, open, setOpen }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!desktop) {
      document.body.style.overflow = open ? "hidden" : "auto";
    }
  }, [open, desktop]);

  return (
    <>
      {/* DESKTOP FIXED SIDEBAR */}
      {desktop && (
        <aside
          className="
            w-64 h-screen bg-primary-main text-background shadow-xl 
            fixed top-0 left-0   /* ⭐ BELOW NAVBAR */
          "
        >
          <SidebarContent pathname={pathname} />
        </aside>
      )}

      {/* MOBILE SLIDE-IN SIDEBAR */}
      {!desktop && (
        <aside
          className={`
            fixed top-0 left-0 h-screen w-64 bg-primary-main text-background 
            shadow-xl transition-transform duration-300 
            z-40   /* ⭐ Behind Navbar */
            ${open ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <SidebarContent pathname={pathname} onClick={() => setOpen(false)} />
        </aside>
      )}
    </>
  );
}

function SidebarContent({ pathname, onClick = () => {} }) {
  const links = [
    { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Upload Blog", href: "/dashboard/blog/uploads", icon: <FileText size={18} /> },
    { name: "Upload Video", href: "/dashboard/video/uploads", icon: <Video size={18} /> },
    { name: "All Blogs", href: "/dashboard/blog", icon: <ListChecks size={18} /> },
    { name: "All Videos", href: "/dashboard/video", icon: <ListVideo size={18} /> },
    { name: "All Contacts", href: "/dashboard/contact", icon: <Contact size={18} /> },
    { name: "Settings", href: "/dashboard/settings", icon: <Settings size={18} /> },
  ];

  return (
    <div className="flex flex-col h-full">
      
      <div className="flex items-center justify-between bg-white px-s16 py-s16 border-b border-primary-light">
        <h2 className="font-bold text-primary-main body-large mx-s64">
          CMS Panel
        </h2>
      </div>

      <nav className="flex flex-col gap-s8 p-s16 mt-s8 flex-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClick}
              className={`flex items-center gap-s12 px-s16 py-s8 rounded-r8 transition-all ${
                isActive
                  ? "bg-secondary-light text-accent-main font-semibold "
                  : "hover:bg-primary-light hover:text-secondary-light"
              }`}
            >
              {link.icon}
              <span className="px-2 py-1">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-s16 py-s16 border-t border-primary-light text-xs text-secondary-light">
        © {new Date().getFullYear()} Arshiv Legal CMS
      </div>
    </div>
  );
}
