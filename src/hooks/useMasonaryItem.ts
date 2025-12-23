import { useEffect, useRef } from "react";

const GAP_SIZE = 16;

export function useMasonryItem(deps: unknown[] = []) {
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

  const disconnect = () => {
    observerRef.current?.disconnect();
    observerRef.current = null;
  };

  useEffect(() => {
    resize();
    return disconnect;
  }, deps);

  return {
    itemRef,
    contentRef,
    observe,
  };
}
