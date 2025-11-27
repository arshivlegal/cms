"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";

export default function ContactDetailClient({ id }) {
  const router = useRouter();
  const [contact, setContact] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/contact/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch contact");
        return res.json();
      })
      .then((data) => {
        if (data.success) setContact(data.data);
      })
      .catch((err) => console.error("Error loading contact:", err));
  }, [id]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setUpdating(true);

    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await res.json();

      if (result.success) {
        setContact(result.data);
        setStatusMsg("Status updated ✓");
        setTimeout(() => setStatusMsg(""), 2000);
      }
    } catch (error) {
      console.error("Status update error:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleting(true);
      const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
      const result = await res.json();

      if (result.success) {
        router.push("/dashboard/contact");
        router.refresh();
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete contact. Please try again.");
    } finally {
      setDeleting(false);
      setDeleteModal(false);
    }
  };

  if (!id) return <p className="p-5">Invalid ID</p>;
  if (!contact) return <p className="p-5">Loading contact...</p>;

  const fields = [
    { label: "Full Name", value: contact.fullName },
    { label: "Email", value: contact.email },
    { label: "Phone", value: contact.phone },
  ];

  const statusOptions = ["pending", "resolved"];

 return (
  <>
    <ConfirmDeleteModal
      isOpen={deleteModal}
      onClose={() => setDeleteModal(false)}
      onConfirm={handleDeleteConfirm}
      loading={deleting}
      title="Delete Contact"
      message={`Are you sure you want to delete the contact from "${contact.fullName}"? This action cannot be undone.`}
    />

    <div className="max-w-3xl mx-auto p-6">

      {/* 🔥 Back Button */}

      {/* Heading */}
      <div className="mb-4">
        <Button
          onClick={() => router.push("/dashboard/contact")}
        >
          ← Back
        </Button>
      </div>
      <h2 className="subheading-h3 font-semibold text-primary-main mb-4">
        Contact Details
      </h2>

      <div className="bg-background border border-border p-6 rounded-xl shadow-sm space-y-6">

        {/* Basic Fields */}
        {fields.map(({ label, value }) => (
          <div key={label}>
            <p className="body-large">{label}</p>
            <p className="text-secondary">{value}</p>
          </div>
        ))}

        {/* Status */}
        <div>
          <p className="body-large mb-1">Status</p>
          <select
            value={contact.status}
            onChange={handleStatusChange}
            disabled={updating}
            className="border border-border rounded px-s8 py-s8 bg-secondary-light text-text-primary"
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>

          {statusMsg && (
            <p className="text-green-500 text-sm mt-2 rounded">{statusMsg}</p>
          )}
        </div>

        {/* Message */}
        <div>
          <p className="body-large">Message</p>
          <p className="whitespace-pre-line text-secondary">{contact.message}</p>
        </div>

        {/* Delete Button */}
        <Button
          onClick={() => setDeleteModal(true)}
          variant="destructive"
        >
          Delete Contact
        </Button>

      </div>
    </div>
  </>
);

}