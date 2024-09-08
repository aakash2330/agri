import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { product } from "@/server/db/schema";

const createProductZod = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  image: z.string().min(1),
});

export const productRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(createProductZod)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(product).values({
        name: input.name,
        description: input.description,
        createdById: ctx.session.user.id,
        image: input.image,
      });
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.query.product.findFirst({
        where: (product, { eq }) => eq(product.id, input.id),
      });
      return product ?? null;
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const product = await ctx.db.query.product.findMany();
    return product ?? null;
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
