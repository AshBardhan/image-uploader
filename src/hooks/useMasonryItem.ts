import { useEffect, useRef } from "react";

/* Custom hook to manage masonry layout item sizing and observation */
export function useMasonryItem(deps: unknown[] = []) {
  const GAP_SIZE = 16;
  const itemRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);

  const resize = () => {
    if (!itemRef.current || !contentRef.current) return;

    const height = contentRef.current.getBoundingClientRect().height;
    const span = Math.ceil(height / GAP_SIZE);
    const next = `span ${span}`;

    if (itemRef.current.style.gridRowEnd !== next) {
      itemRef.current.style.gridRowEnd = next;
    }
  };

  const observe = () => {
    if (!contentRef.current || observerRef.current) return;

    observerRef.current = new ResizeObserver(() => {
      resize();
    });

    observerRef.current.observe(contentRef.current);
  };

  useEffect(() => {
    resize();

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, deps);

  return {
    itemRef,
    contentRef,
    observe,
  };
}
