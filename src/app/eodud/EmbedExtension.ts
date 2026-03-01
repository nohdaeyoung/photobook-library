import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { parseEmbedUrl } from "@/lib/embed-utils";
import type { EmbedService } from "@/lib/embed-utils";
import EmbedNodeView from "./EmbedNodeView";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    embed: {
      setEmbed: (attrs: {
        service: EmbedService;
        embedId: string;
        embedUrl: string;
      }) => ReturnType;
    };
  }
}

const EmbedExtension = Node.create({
  name: "embed",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      service: { default: null },
      embedId: { default: null },
      embedUrl: { default: null },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-embed-service]",
        getAttrs(node) {
          const el = node as HTMLElement;
          return {
            service: el.getAttribute("data-embed-service"),
            embedId: el.getAttribute("data-embed-id"),
            embedUrl: el.getAttribute("data-embed-url"),
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-embed-service": HTMLAttributes.service,
        "data-embed-id": HTMLAttributes.embedId,
        "data-embed-url": HTMLAttributes.embedUrl,
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(EmbedNodeView);
  },

  addCommands() {
    return {
      setEmbed:
        (attrs) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs,
          });
        },
    };
  },

  addProseMirrorPlugins() {
    const nodeType = this.type;

    return [
      new Plugin({
        key: new PluginKey("embedPaste"),
        props: {
          handlePaste(view, event) {
            const text = event.clipboardData?.getData("text/plain")?.trim();
            if (!text) return false;

            // Only handle single-line URL pastes
            if (text.includes("\n")) return false;

            const info = parseEmbedUrl(text);
            if (!info) return false;

            const node = nodeType.create({
              service: info.service,
              embedId: info.embedId,
              embedUrl: info.url,
            });

            const { tr } = view.state;
            const pos = view.state.selection.from;

            // If cursor is in an empty paragraph, replace it
            const $pos = view.state.doc.resolve(pos);
            const parent = $pos.parent;
            if (parent.type.name === "paragraph" && parent.content.size === 0) {
              const parentPos = $pos.before($pos.depth);
              tr.replaceWith(parentPos, parentPos + parent.nodeSize, node);
            } else {
              tr.insert(pos, node);
            }

            view.dispatch(tr);
            return true;
          },
        },
      }),
    ];
  },
});

export default EmbedExtension;
