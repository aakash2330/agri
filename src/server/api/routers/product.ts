import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { product } from "@/server/db/schema";
import { createProductZod } from "types/product";

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
        address: input.address,
      });
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.query.product.findFirst({
        where: (product, { eq }) => eq(product.id, input.id),
      });
      return product ?? null;
    }),

  getAll: publicProcedure
    .input(z.object({ address: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      console.log({
        ...(input.address && {
          where: true,
        }),
      });
      const product = await ctx.db.query.product.findMany({
        ...(input.address && {
          where: (product, { like }) =>
            like(product.address, `%${input.address ?? ""}%`),
        }),
      });
      return product ?? null;
    }),

  getAllCities: publicProcedure.query(async ({ ctx }) => {
    const allAddress = await ctx.db
      .select({ address: product.address })
      .from(product);
    const allCities = allAddress.map((item) => {
      const cityFromAddress = item.address.split(",")[0];
      return cityFromAddress;
    });
    return allCities ?? null;
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
