export type LibraryItemType =
  | "textbook"
  | "dictionary"
  | "book"
  | "workbook"
  | "flashcards";

export type LibraryItemLanguage = "ko" | "ru" | "mixed";

export interface LibraryItem {
  id: number;
  title: string;
  author: string | null;
  type: LibraryItemType;
  description: string | null;
  cover_url: string | null;
  file_url: string | null;
  level: string | null;
  language: LibraryItemLanguage | null;
  pages: number | null;
  year: number | null;
}
