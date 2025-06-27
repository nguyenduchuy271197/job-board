import { z } from "zod";

// UUID validation schema
export const uuidSchema = z.string().uuid({
  message: "ID không hợp lệ",
});

// ID parameter schema
export const idParamSchema = z.object({
  id: uuidSchema,
});

// Optional ID schema
export const optionalIdSchema = z.object({
  id: uuidSchema.optional(),
});

// Multiple IDs schema
export const idsSchema = z.object({
  ids: z.array(uuidSchema).min(1, {
    message: "Phải có ít nhất một ID",
  }),
});

// Export input types
export type IdParam = z.infer<typeof idParamSchema>;
export type OptionalId = z.infer<typeof optionalIdSchema>;
export type Ids = z.infer<typeof idsSchema>; 