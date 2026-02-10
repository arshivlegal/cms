"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";

export default function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    id: null,
    name: "",
  });
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  /* ---------------- FETCH CONTACTS ---------------- */
  useEffect(() => {
    fetch("/api/contact/all")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setContacts(data.data || []);
      })
      .catch(() => setContacts([]));
  }, []);

  /* ---------------- DELETE CONTACT ---------------- */
  const handleDeleteConfirm = async () => {
    if (!deleteModal.id) return;

    try {
      setDeleting(true);
      const res = await fetch(`/api/contact/${deleteModal.id}`, {
        method: "DELETE",
      });
      const result = await res.json();

      if (result.success) {
        setContacts((prev) =>
          prev.filter((c) => c._id !== deleteModal.id)
        );
        closeModal();
      }
    } catch (error) {
      console.error("Failed to delete contact:", error);
      alert("Failed to delete contact. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const closeModal = () =>
    setDeleteModal({ open: false, id: null, name: "" });

  const openDeleteModal = (e, id, name) => {
    e.stopPropagation();
    setDeleteModal({ open: true, id, name });
  };

  /* ---------------- HELPERS ---------------- */
  const tableHeaders = ["Full Name", "Status", "Created", "Delete"];

  const getStatusClass = (status) =>
    status === "pending"
      ? "bg-yellow-500/20 text-yellow-500"
      : "bg-green-500/20 text-green-500";

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  /* ---------------- MOBILE CARD ---------------- */
  const MobileContactCard = ({ c }) => (
    <div
      onClick={() => router.push(`/dashboard/contact/${c._id}`)}
      className="border border-accent-main rounded-xl p-4 bg-background shadow-sm space-y-3 cursor-pointer"
    >
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-primary-main">
          {c.fullName}
        </h3>

        <Trash2
          size={18}
          className="text-red-main cursor-pointer"
          onClick={(e) =>
            openDeleteModal(e, c._id, c.fullName)
          }
        />
      </div>

     <div className="flex justify-between">
         <span
        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(
          c.status
        )}`}
      >
        {c.status}
      </span>

      <p className="text-sm text-text-secondary">
        {formatDate(c.createdAt)}
      </p>
     </div>
    </div>
  );

  /* ---------------- RENDER ---------------- */
  return (
    <>
      {/* ✅ Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModal.open}
        onClose={closeModal}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
        title="Delete Contact"
        message={`Are you sure you want to delete the contact from "${deleteModal.name}"? This action cannot be undone.`}
      />

      <div className="w-full max-w-5xl mx-auto">
        <h2 className="page-title-h2 font-semibold mb-6 text-primary-main">
          Contact Submissions
        </h2>

        {/* 🖥️ Desktop Table */}
        <div className="hidden md:block overflow-x-auto border border-accent-main rounded-xl bg-background shadow-md">
          <table className="w-full">
            <thead className="bg-secondary-light border-b border-border">
              <tr>
                {tableHeaders.map((header, i) => (
                  <th
                    key={header}
                    className={`py-3 px-s16 ${
                      i === tableHeaders.length - 1
                        ? "text-center"
                        : "text-left"
                    }`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {contacts.map((c) => (
                <tr
                  key={c._id}
                  onClick={() =>
                    router.push(`/dashboard/contact/${c._id}`)
                  }
                  className="border-b border-accent-main hover:bg-secondary-light/50 transition cursor-pointer"
                >
                  <td className="py-3 px-s16">{c.fullName}</td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(
                        c.status
                      )}`}
                    >
                      {c.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-sm text-text-secondary">
                    {formatDate(c.createdAt)}
                  </td>

                  <td
                    className="py-3 px-4 text-center"
                    onClick={(e) =>
                      openDeleteModal(e, c._id, c.fullName)
                    }
                  >
                    <Trash2
                      size={18}
                      className="text-red-main hover:scale-110 transition inline-block cursor-pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 📱 Mobile Cards */}
        <div className="md:hidden space-y-4">
          {contacts.map((c) => (
            <MobileContactCard key={c._id} c={c} />
          ))}
        </div>

      
      </div>
    </>
  );
}
