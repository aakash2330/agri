import { type product } from "@/server/db/schema";
import { type InferSelectModel } from "drizzle-orm";

export type Product = InferSelectModel<typeof product>;
