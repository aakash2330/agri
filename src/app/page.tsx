import { HydrateClient } from "@/trpc/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  return (
    <HydrateClient>
      <div className="bg-grid-white/[0.02] relative flex h-screen w-full flex-col overflow-hidden antialiased md:items-center md:justify-center">
        <div className="relative z-10 mx-auto flex w-full max-w-7xl grow flex-col items-center justify-center p-4 pt-20 md:pt-0">
          <h1 className="bg-opacity-50 bg-gradient-to-b from-green-700 to-green-500 bg-clip-text text-center text-4xl font-bold text-transparent md:text-7xl">
            Welcome to agrix
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-center text-base font-normal text-neutral-800">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquipex ea commodo consequat. Duis aute irure dolor in
          </p>
          <br />
          <div className="flex items-center justify-center">
            <Button className="bg-neutral-700">
              <Link href="/products">{`All products ->`}</Link>
            </Button>
          </div>
        </div>
      </div>
    </HydrateClient>
  );
}
