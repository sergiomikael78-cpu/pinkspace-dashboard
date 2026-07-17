"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteResource } from "@/app/actions/resource";

interface DeleteButtonProps {
  id: string;
  title: string;
}

export default function DeleteButton({ id, title }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${title}"?\nThis action cannot be undone.`)) {
      setIsDeleting(true);
      const res = await deleteResource(id);
      if (!res.success) {
        alert(`Failed to delete: ${res.error}`);
        setIsDeleting(false);
      }
      // If success, Next.js revalidatePath will refresh the list automatically
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-ink-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      title="Delete Resource"
    >
      {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
    </button>
  );
}
