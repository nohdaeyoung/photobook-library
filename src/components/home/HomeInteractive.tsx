"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import SearchModal from "@/components/search/SearchModal";
import type { PhotoBook } from "@/types";

interface HomeInteractiveProps {
  allBooks: PhotoBook[];
}

export default function HomeInteractive({ allBooks }: HomeInteractiveProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <Header onSearchClick={() => setSearchOpen(true)} />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} books={allBooks} />
    </>
  );
}
