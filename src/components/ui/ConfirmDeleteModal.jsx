"use client";
import { motion, AnimatePresence } from "framer-motion";
import  Button  from "@/components/ui/Button";

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Item",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  loading = false,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Modal Box */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl w-[90%] max-w-sm p-6 text-center"
          >
            {/* Title */}
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              {title}
            </h2>

            {/* Message */}
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              {message}
            </p>

            {/* Buttons */}
            <div className="flex justify-center gap-3">
              <Button
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={onConfirm}
                disabled={loading}
               varient={"destructive"}
              >
                {loading ? "Deleting..." : "Yes, Delete"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
