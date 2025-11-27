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

  useEffect(() => {
    fetch("/api/contact/all")
      .then(res => res.json())
      .then(data => {
        if (data.success) setContacts(data.data);
      });
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteModal.id) return;
    
    try {
      setDeleting(true);
      const res = await fetch(`/api/contact/${deleteModal.id}`, { method: "DELETE" });
      const result = await res.json();

      if (result.success) {
        setContacts(prev => prev.filter(c => c._id !== deleteModal.id));
        setDeleteModal({ open: false, id: null, name: "" });
      }
    } catch (error) {
      console.error("Failed to delete contact:", error);
      alert("Failed to delete contact. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const closeModal = () => setDeleteModal({ open: false, id: null, name: "" });

  const openDeleteModal = (e, id, name) => {
    e.stopPropagation();
    setDeleteModal({ open: true, id, name });
  };

  const tableHeaders = [
    "Full Name",
    "Email", 
    "Phone",
    "Message",
    "Status",
    "Created",
    "Delete"
  ];

  const getStatusClass = (status) => 
    status === "pending"
      ? "bg-yellow-500/20 text-yellow-500"
      : "bg-green-500/20 text-green-500";

  return (
    <>
      <ConfirmDeleteModal
        isOpen={deleteModal.open}
        onClose={closeModal}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
        title="Delete Contact"
        message={`Are you sure you want to delete the contact from "${deleteModal.name}"? This action cannot be undone.`}
      />

      <div className="w-full max-w-6xl mx-auto p-6">
        <h2 className="page-title-h2 font-semibold mb-6 text-primary-main">
          Contact Submissions
        </h2>

        <div className="overflow-x-auto border border-accent-main rounded-xl bg-background shadow-md">
          <table className="w-full">
            <thead className="bg-secondary-light border-b border-border">
              <tr>
                {tableHeaders.map((header, i) => (
                  <th 
                    key={header}
                    className={`py-3 px-s16 text-default ${
                      i === tableHeaders.length - 1 ? 'text-center' : 'text-left'
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
                  onClick={() => router.push(`/dashboard/contact/${c._id}`)}
                  className="border-b border-accent-main hover:bg-secondary-light/50 transition cursor-pointer"
                >
                  <td className="py-3 px-s16">{c.fullName}</td>
                  <td className="py-3 px-s16">{c.email}</td>
                  <td className="py-3 px-s16">{c.phone}</td>
                  <td className="py-3 px-4 max-w-[150px] truncate">{c.message}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(c.status)}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-text-secondary">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td 
                    className="py-3 px-4 text-center"
                    onClick={(e) => openDeleteModal(e, c._id, c.fullName)}
                  >
                    <Trash2 className="text-red-main hover:scale-110 transition inline-block cursor-pointer" size={18} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}