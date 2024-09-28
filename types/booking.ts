import { z } from "zod";

export const bookingQuerySchema = z.object({
  bookingQuery: z.string().optional(),
  address: z.string().min(1, {
    message: "address must be at least 1 characters.",
  }),
  from: z.date({
    required_error: "From date is required",
  }),
  to: z.date({
    required_error: "To date is required",
  }),
  contactNumber: z
    .string()
    .min(10, {
      message: "Contact must be at least 10 characters.",
    })
    .max(10, {
      message: "Contact must be at max 10 characters.",
    }),
  productId: z
    .string()
    .min(1, { message: "Product Id should be at least 1 characters" }),
});

export type TbookingQuerySchema = z.infer<typeof bookingQuerySchema>;
