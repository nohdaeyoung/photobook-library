"use client";

import { useEffect, useRef } from "react";
import DOMPurify from "dompurify";

interface ContentRendererProps {
  html: string;
}

export default function ContentRenderer({ html }: ContentRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const safeHtml = typeof window !== "undefined"
    ? DOMPurify.sanitize(html, { ADD_ATTR: ["data-embed-service", "data-embed-id", "data-embed-url", "data-embed-rendered"] })
    : html;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const embedDivs = container.querySelectorAll<HTMLElement>("div[data-embed-service]");
    if (embedDivs.length === 0) return;

    const needsTwitter = new Set<HTMLElement>();
    const needsInstagram = new Set<HTMLElement>();
    const needsTiktok = new Set<HTMLElement>();

    embedDivs.forEach((div) => {
      const service = div.getAttribute("data-embed-service");
      const embedId = div.getAttribute("data-embed-id");
      const embedUrl = div.getAttribute("data-embed-url");

      if (!service || !embedId) return;

      // Skip if already processed
      if (div.getAttribute("data-embed-rendered")) return;
      div.setAttribute("data-embed-rendered", "true");

      switch (service) {
        case "youtube": {
          const wrapper = document.createElement("div");
          wrapper.className = "embed-responsive";
          const iframe = document.createElement("iframe");
          iframe.src = `https://www.youtube.com/embed/${embedId}`;
          iframe.allow =
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
          iframe.allowFullscreen = true;
          iframe.title = "YouTube video";
          wrapper.appendChild(iframe);
          div.textContent = "";
          div.appendChild(wrapper);
          break;
        }
        case "vimeo": {
          const wrapper = document.createElement("div");
          wrapper.className = "embed-responsive";
          const iframe = document.createElement("iframe");
          iframe.src = `https://player.vimeo.com/video/${embedId}`;
          iframe.allow = "autoplay; fullscreen; picture-in-picture";
          iframe.allowFullscreen = true;
          iframe.title = "Vimeo video";
          wrapper.appendChild(iframe);
          div.textContent = "";
          div.appendChild(wrapper);
          break;
        }
        case "twitter": {
          const blockquote = document.createElement("blockquote");
          blockquote.className = "twitter-tweet";
          const link = document.createElement("a");
          link.href = embedUrl || `https://twitter.com/i/status/${embedId}`;
          link.textContent = "Tweet";
          blockquote.appendChild(link);
          div.textContent = "";
          div.appendChild(blockquote);
          needsTwitter.add(div);
          break;
        }
        case "instagram": {
          const blockquote = document.createElement("blockquote");
          blockquote.className = "instagram-media";
          blockquote.setAttribute("data-instgrm-captioned", "");
          blockquote.style.maxWidth = "540px";
          blockquote.style.width = "100%";
          const link = document.createElement("a");
          link.href = embedUrl || `https://www.instagram.com/p/${embedId}/`;
          link.textContent = "Instagram post";
          blockquote.appendChild(link);
          div.textContent = "";
          div.appendChild(blockquote);
          needsInstagram.add(div);
          break;
        }
        case "tiktok": {
          const blockquote = document.createElement("blockquote");
          blockquote.className = "tiktok-embed";
          blockquote.setAttribute("cite", embedUrl || "");
          blockquote.setAttribute("data-video-id", embedId);
          blockquote.style.maxWidth = "605px";
          const section = document.createElement("section");
          const link = document.createElement("a");
          link.href = embedUrl || "";
          link.textContent = "TikTok video";
          section.appendChild(link);
          blockquote.appendChild(section);
          div.textContent = "";
          div.appendChild(blockquote);
          needsTiktok.add(div);
          break;
        }
      }
    });

    // Load widget scripts only when needed
    if (needsTwitter.size > 0) {
      loadScript("https://platform.twitter.com/widgets.js", "twitter-wjs");
    }
    if (needsInstagram.size > 0) {
      loadScript("https://www.instagram.com/embed.js", "instagram-embed-js", () => {
        const w = window as unknown as Record<string, unknown>;
        if (w.instgrm) {
          (w.instgrm as { Embeds: { process: () => void } }).Embeds.process();
        }
      });
    }
    if (needsTiktok.size > 0) {
      loadScript("https://www.tiktok.com/embed.js", "tiktok-embed-js");
    }
  }, [html]);

  return (
    <>
      <div
        ref={containerRef}
        className="prose-content"
        dangerouslySetInnerHTML={{ __html: safeHtml }}
      />
      <style>{`
        .prose-content {
          color: var(--text-secondary);
          font-family: var(--font-body);
          font-size: 15px;
          line-height: 1.8;
        }
        .prose-content h2 {
          font-family: var(--font-heading);
          font-size: 1.3em;
          font-weight: 700;
          margin: 1.5em 0 0.5em;
          color: var(--text-primary);
        }
        .prose-content h3 {
          font-family: var(--font-heading);
          font-size: 1.1em;
          font-weight: 600;
          margin: 1.2em 0 0.4em;
          color: var(--text-primary);
        }
        .prose-content p { margin: 0.75em 0; }
        .prose-content strong { font-weight: 700; color: var(--text-primary); }
        .prose-content em { font-style: italic; }
        .prose-content ul, .prose-content ol {
          padding-left: 1.5em;
          margin: 0.75em 0;
        }
        .prose-content li { margin: 0.3em 0; }
        .prose-content blockquote {
          border-left: 3px solid var(--accent);
          padding-left: 1em;
          margin: 1em 0;
          color: var(--text-muted);
          font-style: italic;
        }
        .prose-content a {
          color: var(--accent);
          text-decoration: underline;
        }
        .prose-content img {
          max-width: 100%;
          border-radius: 8px;
          margin: 1.5em 0;
        }
        .prose-content hr {
          border: none;
          border-top: 1px solid var(--border);
          margin: 2em 0;
        }
        .embed-responsive {
          position: relative;
          padding-top: 56.25%;
          margin: 1.5em 0;
          border-radius: 8px;
          overflow: hidden;
          background: #000;
        }
        .embed-responsive iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
        }
        .prose-content .twitter-tweet,
        .prose-content .instagram-media,
        .prose-content .tiktok-embed {
          margin: 1.5em auto !important;
        }
      `}</style>
    </>
  );
}

function loadScript(src: string, id: string, onLoad?: () => void) {
  if (document.getElementById(id)) {
    onLoad?.();
    return;
  }
  const script = document.createElement("script");
  script.id = id;
  script.src = src;
  script.async = true;
  if (onLoad) script.onload = onLoad;
  document.body.appendChild(script);
}
