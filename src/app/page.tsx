import Link from "next/link";

import { getServerAuthSession } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";
import { ProfileForm } from "./_components/productForm";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-col items-center justify-center gap-4">
              <Button>
                <Link href="/products">{`All products ->`}</Link>
              </Button>
              <Link
                href={session ? "/api/auth/signout" : "/api/auth/signin"}
                className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
              >
                {session ? "Sign out" : "Sign in"}
              </Link>
              <div className="text-center text-2xl text-white">
                {session && (
                  <span>
                    Logged in as
                    {Object.entries(session.user).map(([key, value]) => {
                      return (
                        <div
                          key={`${JSON.stringify(key)}-${JSON.stringify(value)}`}
                        >{`${JSON.stringify(key)}-${JSON.stringify(value)}`}</div>
                      );
                    })}
                  </span>
                )}
              </div>
            </div>
          </div>
          {session?.user && <ProfileForm></ProfileForm>}
        </div>
      </main>
    </HydrateClient>
  );
}
