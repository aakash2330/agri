import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { booking } from "@/server/db/schema";
import { bookingQuerySchema } from "types/booking";

export const bookingRouter = createTRPCRouter({
  addBooking: protectedProcedure
    .input(bookingQuerySchema)
    .mutation(async ({ ctx, input }) => {
      const newBooking = await ctx.db
        .insert(booking)
        .values({ ...input, userId: ctx.session.user.id });
      console.log({ newBooking });
      if (!newBooking) {
        return { success: true };
      }
      return { success: true };
    }),
});
