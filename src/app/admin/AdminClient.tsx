"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { createBook, updateBook, deleteBook, getAdminBooks, uploadImage, fetchBookDataByISBN } from "./actions";

const RichTextEditor = dynamic(() => import("./RichTextEditor"), { ssr: false });

interface Category {
  _id: string;
  name: string;
  nameEn: string;
  slug: string;
  color: string;
  order: number;
}

interface AdminBook {
  _id: string;
  title: string;
  titleEn?: string;
  slug: string;
  author: string;
  year: number;
  pages?: number;
  category: string;
  categorySlug: string;
  tags: string[];
  description?: string;
  content?: string;
  featured: boolean;
  publisher?: string;
  language?: string;
  format?: string;
  isbn?: string;
  coverUrl?: string;
  coverImageUrl?: string;
  images?: { assetId: string; url: string }[];
}

interface AdminClientProps {
  initialBooks: AdminBook[];
  categories: Category[];
}

// ─── 도서 등록/수정 폼 ───
function BookForm({
  categories,
  editBook,
  onClose,
  onSaved,
}: {
  categories: Category[];
  editBook?: AdminBook | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(editBook?.coverImageUrl || editBook?.coverUrl || null);
  const [coverAssetId, setCoverAssetId] = useState<string | null>(null);
  const [isbnCoverUrl, setIsbnCoverUrl] = useState<string>(editBook?.coverUrl || "");
  const [uploading, setUploading] = useState(false);
  const [contentHtml, setContentHtml] = useState(editBook?.content || "");
  const isEdit = Boolean(editBook);

  // ISBN 조회 상태
  const [isbnValue, setIsbnValue] = useState(editBook?.isbn || "");
  const [isbnLoading, setIsbnLoading] = useState(false);
  const [isbnMessage, setIsbnMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Controlled 폼 필드 (ISBN 조회 결과로 업데이트 가능)
  const [title, setTitle] = useState(editBook?.title || "");
  const [titleEn, setTitleEn] = useState(editBook?.titleEn || "");
  const [author, setAuthor] = useState(editBook?.author || "");
  const [year, setYear] = useState(editBook?.year?.toString() || "");
  const [pages, setPages] = useState(editBook?.pages?.toString() || "");
  const [publisher, setPublisher] = useState(editBook?.publisher || "");
  const [description, setDescription] = useState(editBook?.description || "");
  const [language, setLanguage] = useState(editBook?.language || "");

  // 갤러리 이미지 상태
  const [galleryImages, setGalleryImages] = useState<{ assetId: string; url: string }[]>(
    editBook?.images || []
  );
  const [galleryUploading, setGalleryUploading] = useState(false);

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setGalleryUploading(true);
    setError(null);
    const fileArray = Array.from(files);
    for (const file of fileArray) {
      const localPreview = URL.createObjectURL(file);
      try {
        const fd = new FormData();
        fd.append("file", file);
        const result = await uploadImage(fd);
        if (result.success && result.assetId) {
          setGalleryImages((prev) => [
            ...prev,
            { assetId: result.assetId!, url: result.url || localPreview },
          ]);
        } else {
          URL.revokeObjectURL(localPreview);
          setError(`"${file.name}" 업로드 실패: ${result.error || "알 수 없는 오류"}`);
        }
      } catch (err) {
        URL.revokeObjectURL(localPreview);
        setError(`"${file.name}" 업로드 중 오류가 발생했습니다.`);
        console.error("Gallery upload error:", err);
      }
    }
    setGalleryUploading(false);
    e.target.value = "";
  }

  function removeGalleryImage(index: number) {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleISBNLookup() {
    if (!isbnValue.trim()) return;
    setIsbnLoading(true);
    setIsbnMessage(null);
    try {
      const result = await fetchBookDataByISBN(isbnValue.trim());
      if (result.success) {
        const d = result.data;
        if (d.title) setTitle(d.title);
        if (d.titleEn) setTitleEn(d.titleEn);
        if (d.author) setAuthor(d.author);
        if (d.year) setYear(d.year.toString());
        if (d.pages) setPages(d.pages.toString());
        if (d.publisher) setPublisher(d.publisher);
        if (d.description) setDescription(d.description);
        if (d.language) setLanguage(d.language);
        if (d.coverUrl) {
          setCoverPreview(d.coverUrl);
          setIsbnCoverUrl(d.coverUrl);
        }
        setIsbnMessage({ type: "success", text: "도서 정보를 불러왔습니다." });
      } else {
        setIsbnMessage({ type: "error", text: result.error });
      }
    } catch {
      setIsbnMessage({ type: "error", text: "조회 중 오류가 발생했습니다." });
    } finally {
      setIsbnLoading(false);
    }
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setCoverPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const result = await uploadImage(fd);
      if (result.success && result.assetId) {
        setCoverAssetId(result.assetId);
      } else {
        setError("이미지 업로드에 실패했습니다.");
      }
    } catch {
      setError("이미지 업로드에 실패했습니다.");
    } finally {
      setUploading(false);
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set("content", contentHtml);
    formData.set("isbn", isbnValue.trim());
    formData.set("coverUrl", isbnCoverUrl);
    if (coverAssetId) {
      formData.set("coverImageAssetId", coverAssetId);
    }
    for (const img of galleryImages) {
      formData.append("imageAssetIds", img.assetId);
    }

    startTransition(async () => {
      try {
        if (isEdit && editBook) {
          await updateBook(editBook._id, formData);
        } else {
          await createBook(formData);
        }
        onSaved();
        onClose();
      } catch {
        setError("저장에 실패했습니다. 다시 시도해주세요.");
      }
    });
  }

  // 카테고리 ID 찾기 (수정 시)
  const editCategoryId = editBook
    ? categories.find((c) => c.slug === editBook.categorySlug)?._id
    : undefined;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl p-6"
        style={{
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border)",
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-xl font-bold"
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--text-primary)",
            }}
          >
            {isEdit ? "사진책 수정" : "새 사진책 등록"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg transition-colors"
            style={{ color: "var(--text-muted)" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {error && (
          <div
            className="mb-4 p-3 rounded-lg text-sm"
            style={{
              backgroundColor: "rgba(229,62,62,0.1)",
              color: "var(--danger)",
              border: "1px solid rgba(229,62,62,0.3)",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* ISBN 조회 */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
              ISBN
            </span>
            <div className="flex gap-2">
              <input
                value={isbnValue}
                onChange={(e) => setIsbnValue(e.target.value)}
                placeholder="978-0-7148-7935-2"
                className="flex-1 px-3 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleISBNLookup();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleISBNLookup}
                disabled={isbnLoading || !isbnValue.trim()}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                style={{
                  backgroundColor: isbnLoading ? "var(--text-muted)" : "var(--accent)",
                  color: "#0D0D0D",
                }}
              >
                {isbnLoading ? "조회 중..." : "조회"}
              </button>
            </div>
            {isbnMessage && (
              <span
                className="text-xs mt-1"
                style={{
                  color: isbnMessage.type === "success" ? "var(--accent)" : "var(--danger)",
                }}
              >
                {isbnMessage.text}
              </span>
            )}
          </div>

          {/* 제목 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                제목 *
              </span>
              <input
                name="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="px-3 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                }}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                영문 제목
              </span>
              <input
                name="titleEn"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                className="px-3 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                }}
              />
            </label>
          </div>

          {/* 작가 / 연도 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                작가 *
              </span>
              <input
                name="author"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="px-3 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                }}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                출판 연도 *
              </span>
              <input
                name="year"
                type="number"
                required
                min={1800}
                max={2100}
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="px-3 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                }}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                페이지 수
              </span>
              <input
                name="pages"
                type="number"
                min={1}
                value={pages}
                onChange={(e) => setPages(e.target.value)}
                className="px-3 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                }}
              />
            </label>
          </div>

          {/* 카테고리 */}
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
              카테고리 *
            </span>
            <select
              name="categoryId"
              required
              defaultValue={editCategoryId}
              className="px-3 py-2 rounded-lg text-sm"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
            >
              <option value="">선택하세요</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name} ({cat.nameEn})
                </option>
              ))}
            </select>
          </label>

          {/* 태그 */}
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
              태그 (쉼표로 구분)
            </span>
            <input
              name="tags"
              defaultValue={editBook?.tags?.join(", ")}
              placeholder="흑백, 다큐, 거리"
              className="px-3 py-2 rounded-lg text-sm"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
            />
          </label>

          {/* 커버 이미지 */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
              표지 이미지
            </span>
            <div className="flex items-start gap-4">
              {coverPreview && (
                <div
                  className="w-20 h-28 rounded-md overflow-hidden flex-shrink-0"
                  style={{ backgroundColor: "var(--bg-tertiary)" }}
                >
                  <img
                    src={coverPreview}
                    alt="표지 미리보기"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <label
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg cursor-pointer transition-colors text-sm"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  border: "1px dashed var(--border)",
                  color: "var(--text-muted)",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                {uploading ? "업로드 중..." : coverPreview ? "이미지 변경" : "이미지 선택"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverUpload}
                  disabled={uploading}
                />
              </label>
            </div>
          </div>

          {/* 갤러리 이미지 */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
              갤러리 이미지
            </span>
            {galleryImages.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {galleryImages.map((img, idx) => (
                  <div key={img.assetId} className="relative group">
                    <div
                      className="w-16 h-16 rounded-md overflow-hidden"
                      style={{ backgroundColor: "var(--bg-tertiary)" }}
                    >
                      <img
                        src={img.url}
                        alt={`갤러리 ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(idx)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{
                        backgroundColor: "var(--danger)",
                        color: "#fff",
                      }}
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg cursor-pointer transition-colors text-sm"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                border: "1px dashed var(--border)",
                color: "var(--text-muted)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              {galleryUploading ? "업로드 중..." : "이미지 추가 (여러 장 선택 가능)"}
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleGalleryUpload}
                disabled={galleryUploading}
              />
            </label>
          </div>

          {/* 설명 */}
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
              설명
            </span>
            <textarea
              name="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm resize-y"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
            />
          </label>

          {/* 상세 컨텐츠 (리치 텍스트 에디터) */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
              상세 컨텐츠
            </span>
            <RichTextEditor value={contentHtml} onChange={setContentHtml} />
          </div>

          {/* 출판사 / 언어 / 제본 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                출판사
              </span>
              <input
                name="publisher"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                className="px-3 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                }}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                언어
              </span>
              <select
                name="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                }}
              >
                <option value="">선택</option>
                <option value="ko">한국어</option>
                <option value="en">영어</option>
                <option value="ja">일본어</option>
                <option value="other">기타</option>
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                제본 형태
              </span>
              <select
                name="format"
                defaultValue={editBook?.format}
                className="px-3 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                }}
              >
                <option value="">선택</option>
                <option value="hardcover">하드커버</option>
                <option value="softcover">소프트커버</option>
                <option value="spiral">스프링</option>
                <option value="box-set">박스 세트</option>
              </select>
            </label>
          </div>

          {/* 추천 도서 */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              name="featured"
              type="checkbox"
              defaultChecked={editBook?.featured}
              className="w-4 h-4 rounded"
              style={{ accentColor: "var(--accent)" }}
            />
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
              추천 도서로 표시
            </span>
          </label>

          {/* 버튼 */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: isPending ? "var(--text-muted)" : "var(--accent)",
                color: "#0D0D0D",
              }}
            >
              {isPending ? "저장 중..." : isEdit ? "수정 완료" : "등록하기"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                color: "var(--text-secondary)",
                border: "1px solid var(--border)",
              }}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── 메인 관리자 컴포넌트 ───
export default function AdminClient({ initialBooks, categories }: AdminClientProps) {
  const [books, setBooks] = useState(initialBooks);
  const [showForm, setShowForm] = useState(false);
  const [editBook, setEditBook] = useState<AdminBook | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminBook | null>(null);
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBooks = searchQuery
    ? books.filter(
        (b) =>
          b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.category.includes(searchQuery)
      )
    : books;

  function handleNew() {
    setEditBook(null);
    setShowForm(true);
  }

  function handleEdit(book: AdminBook) {
    setEditBook(book);
    setShowForm(true);
  }

  function handleDelete(book: AdminBook) {
    setDeleteTarget(book);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      await deleteBook(deleteTarget._id);
      const updated = await getAdminBooks();
      setBooks(updated);
      setDeleteTarget(null);
    });
  }

  function handleSaved() {
    startTransition(async () => {
      const updated = await getAdminBooks();
      setBooks(updated);
    });
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* 헤더 */}
      <header
        className="sticky top-0 z-40 backdrop-blur-md"
        style={{
          backgroundColor: "var(--bg-overlay)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm transition-colors"
              style={{ color: "var(--text-muted)" }}
            >
              ← 사이트로 돌아가기
            </Link>
            <div
              className="h-4 w-px"
              style={{ backgroundColor: "var(--border)" }}
            />
            <h1
              className="text-lg font-bold"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--accent)",
              }}
            >
              관리자
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span
              className="text-xs px-2 py-1 rounded-full"
              style={{
                backgroundColor: "var(--accent-muted)",
                color: "var(--accent)",
              }}
            >
              {books.length}권
            </span>
          </div>
        </div>
      </header>

      {/* 메인 */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* 툴바 */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="제목, 작가, 카테고리로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:max-w-sm px-4 py-2.5 rounded-lg text-sm"
              style={{
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
            />
          </div>
          <button
            type="button"
            onClick={handleNew}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
            style={{
              backgroundColor: "var(--accent)",
              color: "#0D0D0D",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            새 사진책 등록
          </button>
        </div>

        {/* 도서 목록 테이블 */}
        <div
          className="rounded-xl overflow-hidden"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["제목", "작가", "연도", "카테고리", "추천", ""].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book) => (
                  <tr
                    key={book._id}
                    className="transition-colors"
                    style={{ borderBottom: "1px solid var(--border)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "var(--bg-tertiary)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    <td className="px-4 py-3">
                      <div>
                        <span
                          className="font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {book.title}
                        </span>
                        {book.titleEn && book.titleEn !== book.title && (
                          <span
                            className="block text-xs mt-0.5"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {book.titleEn}
                          </span>
                        )}
                      </div>
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {book.author}
                    </td>
                    <td
                      className="px-4 py-3 tabular-nums"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {book.year}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: "var(--bg-tertiary)",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {book.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {book.featured && (
                        <span style={{ color: "var(--accent)" }}>★</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => handleEdit(book)}
                          className="px-3 py-1.5 rounded-md text-xs transition-colors"
                          style={{
                            backgroundColor: "var(--bg-tertiary)",
                            color: "var(--text-secondary)",
                            border: "1px solid var(--border)",
                          }}
                        >
                          수정
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(book)}
                          className="px-3 py-1.5 rounded-md text-xs transition-colors"
                          style={{
                            backgroundColor: "rgba(229,62,62,0.1)",
                            color: "var(--danger)",
                            border: "1px solid rgba(229,62,62,0.2)",
                          }}
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredBooks.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-12"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {searchQuery
                        ? "검색 결과가 없습니다"
                        : "등록된 사진책이 없습니다"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* 등록/수정 폼 모달 */}
      {showForm && (
        <BookForm
          categories={categories}
          editBook={editBook}
          onClose={() => setShowForm(false)}
          onSaved={handleSaved}
        />
      )}

      {/* 삭제 확인 모달 */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
        >
          <div
            className="w-full max-w-sm rounded-xl p-6 text-center"
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border)",
            }}
          >
            <div
              className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: "rgba(229,62,62,0.1)" }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ color: "var(--danger)" }}
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </div>
            <h3
              className="text-lg font-bold mb-2"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--text-primary)",
              }}
            >
              사진책 삭제
            </h3>
            <p
              className="text-sm mb-6"
              style={{ color: "var(--text-muted)" }}
            >
              &ldquo;{deleteTarget.title}&rdquo;을(를) 삭제하시겠습니까?
              <br />
              이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border)",
                }}
              >
                취소
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isPending}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: "var(--danger)",
                  color: "#fff",
                }}
              >
                {isPending ? "삭제 중..." : "삭제"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
