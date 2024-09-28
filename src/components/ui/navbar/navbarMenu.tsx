"use client";

import Link from "next/link";
import { Button } from "../button";
import { type Session } from "next-auth";
import { signOut } from "next-auth/react";

export function NavbarMenu({ session }: { session: Session | null }) {
  return (
    <div className="flex h-[4rem] w-full items-center justify-between px-12">
      <div className="flex gap-5">
        <NavbarMenuItem href={"/"} title="Agrix"></NavbarMenuItem>
        <NavbarMenuItem
          href="/products"
          title="Explore &nbsp; ->"
        ></NavbarMenuItem>
      </div>
      {session?.user ? (
        <Button
          onClick={async () => {
            await signOut();
          }}
          className="bg-neutral-700"
        >
          Logout
        </Button>
      ) : (
        <Button className="bg-neutral-700">
          <Link href={"/api/auth/signin"}>Login</Link>
        </Button>
      )}
    </div>
  );
}

function NavbarMenuItem({ title, href }: { title: string; href: string }) {
  return (
    <Link
      href={href}
      className="font-light text-neutral-700 hover:cursor-pointer hover:underline"
    >
      {title}
    </Link>
  );
}
