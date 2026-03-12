import { useEffect } from "react";

interface PageSEO {
  title: string;
  description: string;
}

export function usePageSEO({ title, description }: PageSEO) {
  useEffect(() => {
    const prevTitle = document.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc?.getAttribute("content") || "";

    document.title = title;
    if (metaDesc) metaDesc.setAttribute("content", description);

    return () => {
      document.title = prevTitle;
      if (metaDesc) metaDesc.setAttribute("content", prevDesc);
    };
  }, [title, description]);
}
