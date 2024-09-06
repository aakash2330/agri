import { DrizzleAdapter } from "@auth/drizzle-adapter";
import GoogleProvider, { type GoogleProfile } from "next-auth/providers/google";
import { eq } from "drizzle-orm";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import { db } from "@/server/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "@/server/db/schema";
import { SigninSchema, SignupSchema } from "validators/auth";
import { env } from "@/env";

type TuserRole = "admin" | "user";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      emailVerified: boolean;
      role: TuserRole;
    } & DefaultSession["user"];
  }

  interface User {
    role: TuserRole;
    emailVerified: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }) as Adapter,
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,

      profile(profile: GoogleProfile, token) {
        console.log("token:", token);
        return {
          id: profile.sub,
          name: `${profile.given_name}`,
          email: profile.email,
          emailVerified: false,
          role: "user",
        };
      },
    }),
    CredentialsProvider({
      name: "signin",
      id: "signin",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email" },
        password: { label: "Password", type: "password" },
      },
      // eslint-disable-next-line
      async authorize(credentials): Promise<any> {
        const result = SigninSchema.safeParse(credentials);
        if (!result.success) {
          throw new Error("Input Validation failed");
        }
        const { email, password } = result.data;
        const user = await db.query.users.findFirst({
          where: eq(users.email, email),
          columns: {
            id: true,
            name: true,
            password: true,
            emailVerified: true,
            role: true,
          },
        });

        if (!user) throw new Error("Email or password is incorrect");

        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
          throw new Error("Email or password is incorrect");
        }
        return {
          id: user.id,
          name: user.name,
          email: email,
          emailVerified: user.emailVerified,
          role: user.role,
        };
      },
    }),
    CredentialsProvider({
      name: "signup",
      id: "signup",
      credentials: {
        name: { label: "Name", type: "text" },
        email: { label: "Email", type: "email", placeholder: "email" },
        password: { label: "password", type: "password" },
      },

      // eslint-disable-next-line
      async authorize(credentials): Promise<any> {
        const result = SignupSchema.safeParse(credentials);

        if (!result.success) {
          throw new Error("Input Validation failed");
        }
        const { email, name, password } = result.data;

        const userExist = await db.query.users.findFirst({
          where: eq(users.email, email),
          columns: {
            id: true,
            name: true,
            password: true,
          },
        });

        if (userExist) throw new Error("User with this email already exist");

        const hashedPassword = await bcrypt.hash(
          password,
          env.PASSWORD_HASH_SALT_ROUNDS,
        );

        const [insertedUser] = await db
          .insert(users)
          .values({
            email: email,
            password: hashedPassword,
            name: name,
          })
          .returning({
            id: users.id,
            name: users.name,
            email: users.email,
            emailVerified: users.emailVerified,
            role: users.role,
          });

        if (!insertedUser) throw new Error("User couldn't be added");

        return {
          id: insertedUser.id,
          name: insertedUser.name,
          email: insertedUser.email,
          isVerified: insertedUser.emailVerified,
          role: insertedUser.role,
        };
      },
    }),
  ],

  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        // eslint-disable-next-line
        return {
          ...token,
          // eslint-disable-next-line
          ...session.user,
        };
      }
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.emailVerified = user.emailVerified;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session && session.user) {
        session.user.id = token.id as string;
        session.user.emailVerified = token.emailVerified as boolean;
        session.user.role = token.role as TuserRole;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: env.AUTH_TOKEN_EXPIRATION_TIME,
  },
  jwt: {
    maxAge: env.AUTH_TOKEN_EXPIRATION_TIME,
  },
};

export const getServerAuthSession = () => getServerSession(authOptions);
