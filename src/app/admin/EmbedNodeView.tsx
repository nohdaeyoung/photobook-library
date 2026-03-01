"use client";

import { NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { getEmbedIframeSrc, getServiceLabel, getServiceColor } from "@/lib/embed-utils";
import type { EmbedService } from "@/lib/embed-utils";

export default function EmbedNodeView({ node, deleteNode, selected }: NodeViewProps) {
  const { service, embedId, embedUrl } = node.attrs as {
    service: EmbedService;
    embedId: string;
    embedUrl: string;
  };

  const iframeSrc = getEmbedIframeSrc(service, embedId);
  const label = getServiceLabel(service);
  const color = getServiceColor(service);

  return (
    <NodeViewWrapper
      className="embed-node-wrapper"
      style={{
        margin: "12px 0",
        borderRadius: "8px",
        overflow: "hidden",
        border: selected ? `2px solid var(--accent)` : "1px solid var(--border)",
        position: "relative",
      }}
    >
      {/* Delete button */}
      <button
        type="button"
        onClick={deleteNode}
        className="embed-delete-btn"
        title="삭제"
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 10,
          width: 24,
          height: 24,
          borderRadius: "50%",
          border: "none",
          backgroundColor: "rgba(0,0,0,0.6)",
          color: "#fff",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
          lineHeight: 1,
          opacity: 0,
          transition: "opacity 0.15s",
        }}
      >
        &times;
      </button>

      {iframeSrc ? (
        /* YouTube / Vimeo: iframe preview */
        <div style={{ position: "relative", paddingTop: "56.25%", backgroundColor: "#000" }}>
          <iframe
            src={iframeSrc}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: "none",
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={`${label} embed`}
          />
        </div>
      ) : (
        /* Twitter / Instagram / TikTok: card preview */
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "16px 20px",
            backgroundColor: "var(--bg-secondary, #f5f5f5)",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              backgroundColor: color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              color: service === "tiktok" ? "#fff" : "#fff",
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            {label[0]}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontWeight: 600,
                fontSize: 14,
                color: "var(--text-primary)",
                marginBottom: 2,
              }}
            >
              {label}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {embedUrl}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .embed-node-wrapper:hover .embed-delete-btn {
          opacity: 1 !important;
        }
      `}</style>
    </NodeViewWrapper>
  );
}
