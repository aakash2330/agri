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
            {`Empowering Farmers, One Equipment at a Time Access the Tools You
            Need, When You Need Them Whether you're looking to borrow or lend
            agricultural equipment, our platform connects farmers to share
            resources, reduce costs, and boost productivity. Grow your farm
            smarter and faster with easy, reliable access to essential tools`}
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
