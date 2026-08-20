export type FounderArchiveSource = "chat_export" | "uploaded_file" | "google_drive" | "github" | "holopgt_session" | "manual";

export type FounderArchiveKind = "conversation" | "code" | "design" | "business" | "whitepaper" | "media" | "cad" | "note" | "other";

export interface FounderArchiveRecord {
  id: string;
  ownerId: string;
  source: FounderArchiveSource;
  kind: FounderArchiveKind;
  title: string;
  summary: string;
  sourceRef?: string;
  checksum?: string;
  createdAt?: string;
  capturedAt: string;
  private: true;
  searchable: boolean;
  tags: string[];
  legacyDesignIds?: string[];
}

export interface FounderArchiveQuery {
  ownerId: string;
  query: string;
  limit?: number;
  includeKinds?: FounderArchiveKind[];
}
