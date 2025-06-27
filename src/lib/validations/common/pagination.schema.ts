import { z } from "zod";

// Pagination schema
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1, {
    message: "Trang phải là số nguyên dương",
  }).default(1),
  limit: z.coerce.number().int().min(1).max(100, {
    message: "Giới hạn phải từ 1 đến 100",
  }).default(10),
});

// Sort schema
export const sortSchema = z.object({
  sort_by: z.string().optional(),
  sort_order: z.enum(["asc", "desc"], {
    message: "Thứ tự sắp xếp phải là 'asc' hoặc 'desc'",
  }).default("desc"),
});

// Combined pagination and sort schema
export const paginationWithSortSchema = paginationSchema.merge(sortSchema);

// Export input types
export type PaginationInput = z.infer<typeof paginationSchema>;
export type SortInput = z.infer<typeof sortSchema>;
export type PaginationWithSortInput = z.infer<typeof paginationWithSortSchema>; 