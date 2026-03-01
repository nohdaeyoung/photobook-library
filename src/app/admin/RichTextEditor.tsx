"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";

interface RichTextEditorProps {
  value?: string;
  onChange: (html: string) => void;
}

function ToolbarButton({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="p-1.5 rounded transition-colors"
      style={{
        backgroundColor: active ? "var(--accent-muted)" : "transparent",
        color: active ? "var(--accent)" : "var(--text-muted)",
      }}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({ openOnClick: false }),
      ImageExtension,
      Placeholder.configure({
        placeholder: "사진책에 대한 상세 내용을 작성하세요...",
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose-editor",
      },
    },
  });

  if (!editor) return null;

  function handleLink() {
    if (!editor) return;
    const url = window.prompt("URL을 입력하세요:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }

  function handleImage() {
    if (!editor) return;
    const url = window.prompt("이미지 URL을 입력하세요:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{
        border: "1px solid var(--border)",
        backgroundColor: "var(--bg-tertiary)",
      }}
    >
      {/* 툴바 */}
      <div
        className="flex flex-wrap items-center gap-0.5 px-2 py-1.5"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="제목 2"
        >
          <span className="text-xs font-bold">H2</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          title="제목 3"
        >
          <span className="text-xs font-bold">H3</span>
        </ToolbarButton>

        <div className="w-px h-5 mx-1" style={{ backgroundColor: "var(--border)" }} />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="굵게"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
            <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="기울임"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="4" x2="10" y2="4" />
            <line x1="14" y1="20" x2="5" y2="20" />
            <line x1="15" y1="4" x2="9" y2="20" />
          </svg>
        </ToolbarButton>

        <div className="w-px h-5 mx-1" style={{ backgroundColor: "var(--border)" }} />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="목록"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="번호 목록"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="10" y1="6" x2="21" y2="6" />
            <line x1="10" y1="12" x2="21" y2="12" />
            <line x1="10" y1="18" x2="21" y2="18" />
            <path d="M4 6h1v4" />
            <path d="M4 10h2" />
            <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="인용"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z" />
            <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3z" />
          </svg>
        </ToolbarButton>

        <div className="w-px h-5 mx-1" style={{ backgroundColor: "var(--border)" }} />

        <ToolbarButton onClick={handleLink} active={editor.isActive("link")} title="링크">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </ToolbarButton>
        <ToolbarButton onClick={handleImage} active={false} title="이미지">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </ToolbarButton>

        <div className="w-px h-5 mx-1" style={{ backgroundColor: "var(--border)" }} />

        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          active={false}
          title="구분선"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </ToolbarButton>
      </div>

      {/* 에디터 영역 */}
      <style>{`
        .prose-editor {
          padding: 12px 16px;
          min-height: 200px;
          max-height: 400px;
          overflow-y: auto;
          color: var(--text-primary);
          font-family: var(--font-body);
          font-size: 14px;
          line-height: 1.7;
          outline: none;
        }
        .prose-editor h2 {
          font-family: var(--font-heading);
          font-size: 1.25em;
          font-weight: 700;
          margin: 1em 0 0.5em;
          color: var(--text-primary);
        }
        .prose-editor h3 {
          font-family: var(--font-heading);
          font-size: 1.1em;
          font-weight: 600;
          margin: 0.8em 0 0.4em;
          color: var(--text-primary);
        }
        .prose-editor p { margin: 0.5em 0; }
        .prose-editor strong { font-weight: 700; }
        .prose-editor em { font-style: italic; }
        .prose-editor ul, .prose-editor ol {
          padding-left: 1.5em;
          margin: 0.5em 0;
        }
        .prose-editor li { margin: 0.2em 0; }
        .prose-editor blockquote {
          border-left: 3px solid var(--accent);
          padding-left: 1em;
          margin: 0.8em 0;
          color: var(--text-secondary);
          font-style: italic;
        }
        .prose-editor a {
          color: var(--accent);
          text-decoration: underline;
        }
        .prose-editor img {
          max-width: 100%;
          border-radius: 8px;
          margin: 1em 0;
        }
        .prose-editor hr {
          border: none;
          border-top: 1px solid var(--border);
          margin: 1.5em 0;
        }
        .prose-editor p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: var(--text-muted);
          float: left;
          height: 0;
          pointer-events: none;
        }
      `}</style>
      <EditorContent editor={editor} />
    </div>
  );
}
