export interface HoloSearchDocument {
  id: string;
  url: string;
  title: string;
  text: string;
  locale: string;
  visibility: "public" | "authenticated" | "private";
  ownerId?: string;
  updatedAt: string;
  checksum: string;
}

export interface HoloSearchResult {
  id: string;
  url: string;
  title: string;
  snippet: string;
  score: number;
}

export function rankHoloSearch(query: string, documents: HoloSearchDocument[]): HoloSearchResult[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  return documents
    .filter((doc) => doc.visibility === "public")
    .map((doc) => {
      const haystack = `${doc.title} ${doc.text}`.toLowerCase();
      const score = terms.reduce((sum, term) => sum + (haystack.includes(term) ? 1 : 0), 0);
      return { id: doc.id, url: doc.url, title: doc.title, snippet: doc.text.slice(0, 180), score };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score);
}
