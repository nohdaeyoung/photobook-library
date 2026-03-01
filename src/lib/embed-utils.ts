export type EmbedService = "youtube" | "vimeo" | "twitter" | "instagram" | "tiktok";

export interface EmbedInfo {
  service: EmbedService;
  embedId: string;
  url: string;
}

const EMBED_ID_PATTERN = /^[\w-]+$/;

export function parseEmbedUrl(input: string): EmbedInfo | null {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return null;
  }

  // YouTube
  if (
    url.hostname === "www.youtube.com" ||
    url.hostname === "youtube.com" ||
    url.hostname === "m.youtube.com"
  ) {
    // /watch?v=ID
    if (url.pathname === "/watch") {
      const id = url.searchParams.get("v");
      if (id && EMBED_ID_PATTERN.test(id)) {
        return { service: "youtube", embedId: id, url: input.trim() };
      }
    }
    // /shorts/ID
    const shortsMatch = url.pathname.match(/^\/shorts\/([\w-]+)/);
    if (shortsMatch && EMBED_ID_PATTERN.test(shortsMatch[1])) {
      return { service: "youtube", embedId: shortsMatch[1], url: input.trim() };
    }
  }

  // youtu.be/ID
  if (url.hostname === "youtu.be") {
    const id = url.pathname.slice(1).split("/")[0];
    if (id && EMBED_ID_PATTERN.test(id)) {
      return { service: "youtube", embedId: id, url: input.trim() };
    }
  }

  // Vimeo
  if (url.hostname === "vimeo.com" || url.hostname === "www.vimeo.com") {
    const id = url.pathname.slice(1).split("/")[0];
    if (id && /^\d+$/.test(id)) {
      return { service: "vimeo", embedId: id, url: input.trim() };
    }
  }

  // Twitter / X
  if (
    url.hostname === "twitter.com" ||
    url.hostname === "www.twitter.com" ||
    url.hostname === "x.com" ||
    url.hostname === "www.x.com"
  ) {
    const statusMatch = url.pathname.match(/\/[\w]+\/status\/(\d+)/);
    if (statusMatch) {
      return { service: "twitter", embedId: statusMatch[1], url: input.trim() };
    }
  }

  // Instagram
  if (
    url.hostname === "www.instagram.com" ||
    url.hostname === "instagram.com"
  ) {
    const igMatch = url.pathname.match(/^\/(p|reel)\/([\w-]+)/);
    if (igMatch && EMBED_ID_PATTERN.test(igMatch[2])) {
      return { service: "instagram", embedId: igMatch[2], url: input.trim() };
    }
  }

  // TikTok
  if (
    url.hostname === "www.tiktok.com" ||
    url.hostname === "tiktok.com"
  ) {
    const ttMatch = url.pathname.match(/\/@[\w.]+\/video\/(\d+)/);
    if (ttMatch) {
      return { service: "tiktok", embedId: ttMatch[1], url: input.trim() };
    }
  }

  return null;
}

export function getEmbedIframeSrc(service: EmbedService, embedId: string): string | null {
  switch (service) {
    case "youtube":
      return `https://www.youtube.com/embed/${embedId}`;
    case "vimeo":
      return `https://player.vimeo.com/video/${embedId}`;
    default:
      return null;
  }
}

export function getServiceLabel(service: EmbedService): string {
  const labels: Record<EmbedService, string> = {
    youtube: "YouTube",
    vimeo: "Vimeo",
    twitter: "Twitter / X",
    instagram: "Instagram",
    tiktok: "TikTok",
  };
  return labels[service];
}

export function getServiceColor(service: EmbedService): string {
  const colors: Record<EmbedService, string> = {
    youtube: "#FF0000",
    vimeo: "#1AB7EA",
    twitter: "#1DA1F2",
    instagram: "#E4405F",
    tiktok: "#000000",
  };
  return colors[service];
}
