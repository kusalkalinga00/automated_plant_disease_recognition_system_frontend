export interface ApiResponse<T> {
  message: string;
  success: boolean;
  payload: T;
  meta?: PaginationMeta | null;
}

export interface PaginationMeta {
  page: number; // current page (1-based)
  page_size: number; // items per page
  // Unified support:
  // Backend may send (total) OR (total_items) OR (total_pages + total_items)
  total?: number; // total items (preferred simple form)
  total_items?: number; // alternative name for total items
  total_pages?: number; // when backend precomputes pages
}
