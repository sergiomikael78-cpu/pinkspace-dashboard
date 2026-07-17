"use client";

import { useState } from "react";
import ResourceCard from "./ResourceCard";
import PreviewModal from "./PreviewModal";

interface ResourceCardClientWrapperProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resource: any; // Using any here for brevity, matching the Prisma include structure
}

export default function ResourceCardClientWrapper({ resource }: ResourceCardClientWrapperProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <>
      <ResourceCard 
        resource={resource} 
        onPreview={() => setIsPreviewOpen(true)} 
      />
      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        resource={resource}
      />
    </>
  );
}
