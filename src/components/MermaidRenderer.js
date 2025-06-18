"use client";

import { useEffect, useRef } from "react";
import mermaid from "mermaid";

export default function MermaidRenderer({ chart }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    mermaid.initialize({ startOnLoad: false });

    const id = "mermaid-" + Math.floor(Math.random() * 10000);

    try {
      mermaid.render(id, chart).then(({ svg }) => {
        if (ref.current) {
          ref.current.innerHTML = svg;
        }
      });
    } catch (error) {
      console.error("Mermaid render error:", error);
      ref.current.innerHTML = `<p style="color:red">Gagal merender diagram</p>`;
    }
  }, [chart]);

  return <div ref={ref} className="overflow-auto" />;
}
