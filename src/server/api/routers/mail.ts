import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import nodemailer from "nodemailer";
import { bookingQuerySchema, type TbookingQuerySchema } from "types/booking";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "xagri2024@gmail.com",
    pass: "kukr ybgf nonr rggv",
  },
});

export const mailRouter = createTRPCRouter({
  sendMail: protectedProcedure
    .input(bookingQuerySchema)
    .mutation(async ({ ctx, input }) => {
      const { name, email } = ctx.session.user;
      const productWithUserId = await ctx.db.query.product.findFirst({
        where: (product, { eq }) => eq(product.id, input.productId),
        with: {
          user: {
            columns: {
              email: true,
            },
          },
        },
      });
      const mailOptions = constructMail({
        userName: name,
        userEmail: email,
        productName: productWithUserId?.name,
        productId: productWithUserId?.id,
        bookingQuery: input,
        userToEmail: productWithUserId?.user.email,
      });

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email: ", error);
          return {
            success: false,
          };
        } else {
          console.log("Email sent: ", info.response);
        }
      });
      return {
        success: true,
      };
    }),
});

export function constructMail({
  userName = "default",
  userEmail = "default",
  userToEmail = "default",
  productName = "default",
  productId = "default",
  bookingQuery,
}: {
  userName?: string | null;
  userEmail?: string | null;
  userToEmail?: string | null;
  productName?: string | null;
  productId?: string | null;
  bookingQuery: TbookingQuerySchema;
}) {
  return {
    from: "xagri2024@gmail.com",
    to: userToEmail ?? "xagri2024@gmail.com",
    subject: `You have recieved a booking`,
    text: `You have recieved a booking from ${userName} for the product ${productName} (${productId}) for the dates ${bookingQuery.from.toISOString()} - ${bookingQuery.to.toISOString()} , You can contact them on ${userEmail} or ${bookingQuery.contactNumber}`,
  };
}
