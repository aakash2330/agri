import React from "react";
import { Spotlight } from "./ui/spotlight";
import { Button } from "./ui/button";
import Link from "next/link";
import { ProfileForm } from "@/app/_components/productForm";
import { getServerAuthSession } from "@/server/auth";

export async function SpotlightPreview() {
  const session = await getServerAuthSession();
  return (
    <div className="bg-grid-white/[0.02] relative flex h-[40rem] w-full overflow-hidden rounded-md bg-black/[0.96] antialiased md:items-center md:justify-center">
      <Spotlight
        className="-top-40 left-0 md:-top-20 md:left-60"
        fill="white"
      />
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
    </div>
  );
}
