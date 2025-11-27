"use client";

import AnimatedGavelIcon from "@/components/ui/AnimatedGavelIcon";

export default function DashboardNavbar({ open, setOpen }) {
  return (
    <header className="
      w-full bg-secondary-main shadow 
      flex items-center justify-between
      px-s24 py-s16
      sticky top-0 
      z-50   /* ⭐ Always above sidebar */
    ">
      {/* SHOW ICON ON MOBILE */}
      <button onClick={() => setOpen(!open)} className="md:hidden p-s8">
        <AnimatedGavelIcon isOpen={open} />
      </button>

      <h1 className="subheading-h3 text-primary-main ">Dashboard</h1>
 

      <div className="flex items-center gap-s8">
        <span className="body-default">Admin</span>
      </div>
    </header>
  );
}
