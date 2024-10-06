import { product } from "@/server/db/schema";
import { type InferSelectModel } from "drizzle-orm";
import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export type Product = InferSelectModel<typeof product>;

export const createProductZod = z.object({
  name: z.string().min(1, {
    message: "Name of the product must be at least 1 characters.",
  }),
  description: z.string().min(1, {
    message: "description of the product must be at least 1 characters.",
  }),
  image: z.string().array(),
  address: z.string().min(1, {
    message: "address of the product must be at least 1 characters.",
  }),
});

export type TcreateProductZod = z.infer<typeof createProductZod>;

export const insertProductSchema = createInsertSchema(product);
export const selectProductSchema = createSelectSchema(product);

export type TsearchParams = {address:string}
